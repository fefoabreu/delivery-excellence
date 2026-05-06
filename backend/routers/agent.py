import os
import json
import subprocess
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from models import Opportunity, Contract, DeliveryProject, Handoff

router = APIRouter(prefix="/api/agent", tags=["agent"])

SYSTEM_PROMPT = """You are the Delivery Excellence AI — the senior delivery leader for a global Microsoft Professional Services organization. Your expertise spans:

- Pre-sales and solution architecture across Cloud Adoption, Agentic AI, Dynamics 365, Security, and Data & Analytics
- Consulting methodology (Microsoft's delivery frameworks, PMBOK, agile delivery)
- Contract structuring, scope definition, and commercial pricing
- Delivery health management and project recovery
- Executive communication and stakeholder management

You help the team with:
1. Drafting Statements of Work (SOWs) and scope narratives
2. Pricing guidance and deal structuring
3. Sales-to-delivery handoff documentation
4. Delivery health analysis and recommendations
5. Status update drafting
6. Risk identification and mitigation strategies
7. Portfolio insights and executive summaries

Always be concise, authoritative, and actionable. Use industry-standard terminology."""


class AgentMessage(BaseModel):
    message: str
    context_type: Optional[str] = None  # opportunity, contract, delivery, handoff
    context_id: Optional[str] = None


def _call_claude(prompt: str) -> str:
    """
    Route AI calls through Claude Code CLI (uses your Claude Code subscription)
    or fall back to the Anthropic SDK if ANTHROPIC_API_KEY is set.
    """
    if os.getenv("ANTHROPIC_API_KEY"):
        import anthropic
        client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=3000,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.content[0].text

    # Use Claude Code CLI — no separate API key needed
    full_prompt = f"{SYSTEM_PROMPT}\n\n---\n\n{prompt}"
    result = subprocess.run(
        ["claude", "-p", full_prompt],
        capture_output=True,
        text=True,
        timeout=120,
    )
    if result.returncode != 0:
        raise RuntimeError(f"Claude CLI error: {result.stderr.strip()}")
    return result.stdout.strip()


def get_context_data(context_type: str, context_id: str, db: Session) -> str:
    if context_type == "opportunity":
        obj = db.query(Opportunity).filter(Opportunity.id == context_id).first()
        if obj:
            return f"Opportunity context:\n- Name: {obj.name}\n- Client: {obj.client_name}\n- Stage: {obj.stage}\n- Value: ${obj.estimated_value:,.0f}\n- Description: {obj.description}"
    elif context_type == "contract":
        obj = db.query(Contract).filter(Contract.id == context_id).first()
        if obj:
            lines = "\n".join([f"  - {sl.service_name}: {sl.quantity} {sl.unit} @ ${sl.unit_price:,.0f}" for sl in obj.service_lines])
            return f"Contract context:\n- Name: {obj.name}\n- Client: {obj.client_name}\n- Value: ${obj.total_value:,.0f}\n- Status: {obj.status}\n- Scope: {obj.scope_summary}\nService Lines:\n{lines}"
    elif context_type == "delivery":
        obj = db.query(DeliveryProject).filter(DeliveryProject.id == context_id).first()
        if obj:
            return f"Delivery project context:\n- Name: {obj.name}\n- Client: {obj.client_name}\n- Health: {obj.overall_health.upper()}\n- Phase: {obj.phase}\n- Budget: ${obj.budget:,.0f} | Actuals: ${obj.actuals:,.0f}\n- Completion: {obj.completion_pct}%\n- Schedule: {obj.health_schedule} | Budget: {obj.health_budget} | Scope: {obj.health_scope} | Risk: {obj.health_risk}"
    elif context_type == "handoff":
        obj = db.query(Handoff).filter(Handoff.id == context_id).first()
        if obj:
            return f"Handoff context:\n- Vision: {obj.customer_vision}\n- Objectives: {obj.business_objectives}\n- Risks: {obj.risks}\n- Pitfalls: {obj.pitfalls}"
    return ""


@router.post("/chat")
def chat(data: AgentMessage, db: Session = Depends(get_db)):
    context = ""
    if data.context_type and data.context_id:
        context = get_context_data(data.context_type, data.context_id, db)

    user_content = data.message
    if context:
        user_content = f"{context}\n\nUser request: {data.message}"

    try:
        return {"response": _call_claude(user_content)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/draft-sow")
def draft_sow(data: AgentMessage, db: Session = Depends(get_db)):
    context = ""
    if data.context_id:
        context = get_context_data("contract", data.context_id, db)

    prompt = f"""{context}

Draft a professional Statement of Work (SOW) for this engagement. Include:
1. Executive Summary
2. Project Objectives
3. Scope of Services (in scope and out of scope)
4. Deliverables
5. Assumptions and Dependencies
6. Acceptance Criteria
7. Timeline Overview
8. Commercial Terms Summary

User details: {data.message}"""

    try:
        return {"response": _call_claude(prompt)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/health-analysis")
def health_analysis(data: AgentMessage, db: Session = Depends(get_db)):
    context = ""
    if data.context_id:
        obj = db.query(DeliveryProject).filter(DeliveryProject.id == data.context_id).first()
        if obj:
            raid_items = [f"  [{r.item_type.upper()}] {r.title} (impact: {r.impact}, status: {r.status})" for r in obj.raid_items]
            milestones = [f"  - {m.name}: {m.status} (due: {m.due_date})" for m in obj.milestones]
            context = f"""Project: {obj.name} | Client: {obj.client_name}
Overall Health: {obj.overall_health.upper()}
Health Dimensions: Schedule={obj.health_schedule} | Budget={obj.health_budget} | Scope={obj.health_scope} | Risk={obj.health_risk} | Satisfaction={obj.health_satisfaction}
Phase: {obj.phase} | Completion: {obj.completion_pct}%
Budget: ${obj.budget:,.0f} | Actuals: ${obj.actuals:,.0f} | Burn Rate: {round(obj.actuals/obj.budget*100,1) if obj.budget else 0}%
Executive Summary: {obj.executive_summary}

RAID Items:
{chr(10).join(raid_items) if raid_items else "  None logged"}

Milestones:
{chr(10).join(milestones) if milestones else "  None defined"}"""

    prompt = f"""{context}

{data.message if data.message else "Analyze this project's delivery health and provide:"}
1. Health Assessment: What is driving each dimension's status?
2. Key Risks: Top 3 risks requiring immediate attention
3. Recommended Actions: Specific, prioritized actions for recovery or continuation
4. Executive Communication: A 2-sentence executive summary of project status"""

    try:
        return {"response": _call_claude(prompt)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
