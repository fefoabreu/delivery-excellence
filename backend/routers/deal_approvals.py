import json
import subprocess
import os
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
from database import get_db
from models import Contract, DealProfile, ContractServiceLine

router = APIRouter(prefix="/api/deal-approvals", tags=["deal-approvals"])

# ── OKR / KPI targets (static config, could be moved to DB later) ─────────
OKR_CONFIG = {
    "objective": "Accelerate Deal Velocity Through AI-Powered, Policy-Led Approvals",
    "krs": [
        {"id": "kr1", "label": "Average Approval Cycle Time", "unit": "days",
         "current": 6.4, "target": 2.0, "direction": "lower",
         "description": "Time from submission to approval decision (all tiers)"},
        {"id": "kr2", "label": "First-Pass Approval Rate", "unit": "%",
         "current": 68.0, "target": 90.0, "direction": "higher",
         "description": "Deals approved without revision on first submission"},
        {"id": "kr3", "label": "Exception Rate", "unit": "%",
         "current": 22.0, "target": 8.0, "direction": "lower",
         "description": "Deals requiring escalation beyond standard tier path"},
        {"id": "kr4", "label": "Seller Productivity", "unit": "deals/wk",
         "current": 3.1, "target": 5.5, "direction": "higher",
         "description": "Average deals processed per seller per week"},
        {"id": "kr5", "label": "Deal Score Accuracy", "unit": "%",
         "current": 71.0, "target": 88.0, "direction": "higher",
         "description": "AI deal score correlation with post-delivery outcomes"},
        {"id": "kr6", "label": "AI Recommendation Adoption", "unit": "%",
         "current": 0.0, "target": 80.0, "direction": "higher",
         "description": "Approval decisions aligned with AI recommendation"},
    ],
    "kpis": [
        {"label": "Tier 1 SLA", "value": "24 hrs", "target": "Auto-approve"},
        {"label": "Tier 2 SLA", "value": "48 hrs", "target": "Manager"},
        {"label": "Tier 3 SLA", "value": "5 biz days", "target": "Exec Committee"},
        {"label": "SOW Quality Gate", "value": "Score ≥ 7.0", "target": "Required"},
    ],
    "tiers": [
        {"tier": 1, "label": "Streamlined Self-Serve",
         "criteria": ["Deal value ≤ $500K", "Deal score ≥ 75", "Low complexity", "No regulatory flags"],
         "sla": "24 hours", "approver": "System (AI-validated)",
         "color": "green", "icon": "zap",
         "description": "Policy-compliant deals are auto-approved by the AI engine with audit trail."},
        {"tier": 2, "label": "Manager Review",
         "criteria": ["Deal value $500K–$2M", "Deal score ≥ 65", "Medium complexity or 1 condition"],
         "sla": "48 hours", "approver": "Karina — Americas Leader",
         "color": "blue", "icon": "user-check",
         "description": "AI-pre-scored and pre-approved in principle; manager confirms conditions and signs."},
        {"tier": 3, "label": "Executive Committee",
         "criteria": ["Deal value > $2M", "Score < 65", "High complexity or multiple conditions"],
         "sla": "5 business days", "approver": "Edwina — VP Professional Services",
         "color": "purple", "icon": "shield",
         "description": "Full committee review with AI briefing package. AI recommends, executives decide."},
    ],
}

SCORE_DIMS = [
    ("on_strategy",          "On Strategy",               "Alignment to company priority pillars (Cloud, AI, Security, Dynamics, Data)"),
    ("risk_profile",         "Risk Profile",              "Inverse risk: solution complexity, deal size, vendor dependency"),
    ("sow_quality",          "SOW Quality",               "Scope completeness, exclusions, assumptions, acceptance criteria"),
    ("delivery_success",     "Delivery Success Rate",     "Historical success rate on comparable engagements"),
    ("estimate_accuracy",    "Estimate Accuracy",         "Confidence in effort estimates based on complexity and comparables"),
    ("compliance",           "Compliance Burden",         "Regulatory and compliance overhead (HIPAA, GDPR, SOX, FFIEC)"),
    ("ip_leverage",          "IP & Asset Leverage",       "Reuse of playbooks, SOW templates, and delivery accelerators"),
    ("vendor_participation", "Vendor Participation",      "Partner/subcontractor % — impact on margin and delivery control"),
    ("azure_consumption",    "Azure Consumption",         "Monthly ACR generated — strategic value to Microsoft ecosystem"),
    ("white_space",          "White Space / New Logo",    "New logo, white space, or existing account expansion signal"),
    ("internal_investment",  "Internal Investment",       "Company co-investment (IOI) indicating internal strategic commitment"),
]


def serialize_profile(c: Contract, dp: DealProfile) -> dict:
    breakdown = json.loads(dp.score_breakdown) if dp.score_breakdown else {}
    return {
        "id": c.id,
        "contract_number": c.contract_number,
        "name": c.name,
        "client_name": c.client_name,
        "total_value": c.total_value,
        "status": c.status,
        "start_date": str(c.start_date) if c.start_date else None,
        "end_date": str(c.end_date) if c.end_date else None,
        "scope_summary": c.scope_summary,
        "service_lines": [
            {"service_name": sl.service_name, "category": sl.category,
             "quantity": sl.quantity, "unit": sl.unit,
             "unit_price": sl.unit_price, "total": sl.total}
            for sl in c.service_lines
        ],
        "created_at": c.created_at.isoformat() if c.created_at else None,
        "profile": {
            "strategy_pillars": json.loads(dp.strategy_pillars) if dp.strategy_pillars else [],
            "internal_investment_pct": dp.internal_investment_pct,
            "sold_margin_pct": dp.sold_margin_pct,
            "solution_complexity": dp.solution_complexity,
            "vendor_name": dp.vendor_name,
            "vendor_participation_pct": dp.vendor_participation_pct,
            "similar_projects_count": dp.similar_projects_count,
            "delivery_success_rate": dp.delivery_success_rate,
            "reference_projects": json.loads(dp.reference_projects) if dp.reference_projects else [],
            "playbook_available": dp.playbook_available,
            "sow_template_used": dp.sow_template_used,
            "ip_leverage_score": dp.ip_leverage_score,
            "regulatory_requirements": json.loads(dp.regulatory_requirements) if dp.regulatory_requirements else [],
            "compliance_risk": dp.compliance_risk,
            "azure_consumption_monthly": dp.azure_consumption_monthly,
            "azure_acr_percentage": dp.azure_acr_percentage,
            "expansion_type": dp.expansion_type,
            "is_delivery_led": dp.is_delivery_led,
            "score_breakdown": breakdown,
            "deal_score": dp.deal_score,
            "approval_tier": dp.approval_tier,
            "ai_recommendation_status": dp.ai_recommendation_status,
            "ai_recommendation_text": dp.ai_recommendation_text,
            "ai_conditions": json.loads(dp.ai_conditions) if dp.ai_conditions else [],
            "action_taken": dp.action_taken,
            "action_by": dp.action_by,
            "action_notes": dp.action_notes,
            "action_date": dp.action_date.isoformat() if dp.action_date else None,
        },
        "score_dimensions": SCORE_DIMS,
    }


@router.get("/config")
def get_config():
    return OKR_CONFIG


@router.get("/")
def list_pending(db: Session = Depends(get_db)):
    profiles = db.query(DealProfile).all()
    result = []
    for dp in profiles:
        c = db.query(Contract).filter(Contract.id == dp.contract_id).first()
        if c:
            result.append(serialize_profile(c, dp))
    return sorted(result, key=lambda x: x["profile"]["deal_score"], reverse=True)


@router.get("/{contract_id}")
def get_deal(contract_id: str, db: Session = Depends(get_db)):
    c = db.query(Contract).filter(Contract.id == contract_id).first()
    if not c:
        raise HTTPException(404, "Contract not found")
    dp = db.query(DealProfile).filter(DealProfile.contract_id == contract_id).first()
    if not dp:
        raise HTTPException(404, "Deal profile not found")
    return serialize_profile(c, dp)


class ApprovalAction(BaseModel):
    action: str          # approved | conditionally_approved | in_review | rejected
    action_by: str
    action_notes: Optional[str] = None


@router.post("/{contract_id}/action")
def take_action(contract_id: str, data: ApprovalAction, db: Session = Depends(get_db)):
    c = db.query(Contract).filter(Contract.id == contract_id).first()
    if not c:
        raise HTTPException(404, "Contract not found")
    dp = db.query(DealProfile).filter(DealProfile.contract_id == contract_id).first()
    if not dp:
        raise HTTPException(404, "Deal profile not found")

    dp.action_taken = data.action
    dp.action_by = data.action_by
    dp.action_notes = data.action_notes
    dp.action_date = datetime.utcnow()

    if data.action == "approved":
        c.status = "approved"
        c.approval_status = "approved"
        c.approved_by = data.action_by
        c.approved_at = datetime.utcnow()
    elif data.action == "rejected":
        c.status = "draft"
        c.approval_status = "rejected"

    db.commit()
    return serialize_profile(c, dp)


@router.post("/{contract_id}/regenerate-ai")
def regenerate_ai(contract_id: str, db: Session = Depends(get_db)):
    """Re-run AI analysis for a deal using Claude Code CLI auth."""
    c = db.query(Contract).filter(Contract.id == contract_id).first()
    dp = db.query(DealProfile).filter(DealProfile.contract_id == contract_id).first()
    if not c or not dp:
        raise HTTPException(404, "Deal not found")

    breakdown = json.loads(dp.score_breakdown) if dp.score_breakdown else {}
    reqs = json.loads(dp.regulatory_requirements) if dp.regulatory_requirements else []
    pillars = json.loads(dp.strategy_pillars) if dp.strategy_pillars else []

    prompt = f"""You are the Delivery Excellence AI — senior pre-sales and deal governance advisor for Microsoft Professional Services.

Analyze this deal and provide an executive approval recommendation.

DEAL: {c.name}
CLIENT: {c.client_name}
VALUE: ${c.total_value:,.0f}
MARGIN: {dp.sold_margin_pct}%
COMPLEXITY: {dp.solution_complexity}
APPROVAL TIER: {dp.approval_tier}
DEAL SCORE: {dp.deal_score}/100

SCORE BREAKDOWN (0-10 each):
{chr(10).join(f'  {k}: {v}' for k, v in breakdown.items())}

PROFILE DETAILS:
- Strategy Pillars: {', '.join(pillars)}
- Internal Investment: {dp.internal_investment_pct}%
- Vendor: {dp.vendor_name or 'None'} ({dp.vendor_participation_pct}%)
- Regulatory Requirements: {', '.join(reqs) if reqs else 'None'}
- Azure ACR: ${dp.azure_consumption_monthly:,.0f}/month ({dp.azure_acr_percentage}% of deal)
- Delivery Success Rate on Comparable Projects: {dp.delivery_success_rate}%
- Expansion Type: {dp.expansion_type}

Provide:
1. A deal recommendation: APPROVE, APPROVE_WITH_CONDITIONS, RECOMMEND_REVIEW, or FLAG_REJECTION
2. A 3-4 sentence executive justification covering strategic alignment, risk profile, and financial merit
3. Up to 4 specific conditions or concerns (if any)

Format your response as JSON:
{{
  "status": "APPROVE",
  "text": "...",
  "conditions": ["...", "..."]
}}"""

    try:
        result = subprocess.run(["claude", "-p", prompt], capture_output=True, text=True, timeout=90)
        if result.returncode != 0:
            raise RuntimeError(result.stderr)
        raw = result.stdout.strip()
        # Extract JSON from response
        import re
        match = re.search(r'\{[\s\S]*\}', raw)
        if match:
            ai_data = json.loads(match.group())
            dp.ai_recommendation_status = ai_data.get("status", dp.ai_recommendation_status)
            dp.ai_recommendation_text = ai_data.get("text", dp.ai_recommendation_text)
            dp.ai_conditions = json.dumps(ai_data.get("conditions", []))
            db.commit()
    except Exception as e:
        raise HTTPException(500, f"AI regeneration failed: {e}")

    return serialize_profile(c, dp)
