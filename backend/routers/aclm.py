"""
A-CLM (Agentic Contract Lifecycle Management) — the closed-loop hub.

These endpoints synthesize live signals from the rest of the platform:
  • Pipeline Agent  — forward-looking signals on deals approaching approval,
                      derived from the opportunity pipeline + pending contracts.
  • Delivery Agent  — feedback signals from live delivery, derived from the
                      QA portfolio monitor (health, early-warning risk).
This makes the cockpit a real closed loop rather than static copy.
"""
from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Opportunity, Contract, DealProfile, QAPortfolioMonitor

router = APIRouter(prefix="/api/aclm", tags=["aclm"])

# Stages that mean a deal is heading into / through the approval funnel.
APPROACHING_STAGES = ["propose", "negotiate"]
# Stages that constitute the "Deal Shaping" part of the 5-stage flow.
SHAPING_STAGES = ["develop", "propose"]


def _fmt_money(v: float) -> str:
    if v >= 1_000_000:
        return f"${v / 1_000_000:.1f}M"
    if v >= 1_000:
        return f"${v / 1_000:.0f}K"
    return f"${v:.0f}"


@router.get("/agent-signals")
def agent_signals(db: Session = Depends(get_db)):
    """Live multi-agent signals for the A-CLM cockpit (Pipeline Agent + Delivery Agent)."""

    # ── Pipeline Agent — signals ahead ─────────────────────────────────────
    approaching_opps = (
        db.query(Opportunity).filter(Opportunity.stage.in_(APPROACHING_STAGES)).all()
    )
    pending = db.query(Contract).filter(Contract.status == "pending_approval").all()
    approaching_count = len(approaching_opps) + len(pending)

    pending_ids = [c.id for c in pending]
    tier3 = (
        db.query(DealProfile)
        .filter(DealProfile.contract_id.in_(pending_ids), DealProfile.approval_tier == 3)
        .count()
        if pending_ids else 0
    )

    shaping = db.query(Opportunity).filter(Opportunity.stage.in_(SHAPING_STAGES)).all()
    shaping_value = sum(o.estimated_value or 0 for o in shaping)

    pipeline_agent = [
        f"{approaching_count} deals approaching the approval funnel",
        f"{tier3} deal{'s' if tier3 != 1 else ''} flagged as Tier 3 complexity",
        f"{_fmt_money(shaping_value)} aggregate deal value entering Deal Shaping",
    ]

    # ── Delivery Agent — feeds back ────────────────────────────────────────
    qa = db.query(QAPortfolioMonitor).filter(QAPortfolioMonitor.status == "active").all()
    active = len(qa)
    amber = sum(1 for q in qa if q.overall_health == "amber")
    red = sum(1 for q in qa if q.overall_health == "red")
    ew_scores = [(q.early_warning or {}).get("score") for q in qa]
    ew_scores = [s for s in ew_scores if isinstance(s, (int, float))]
    # Early-warning is a risk index (higher = worse); express as a health score.
    avg_health = round(100 - sum(ew_scores) / len(ew_scores)) if ew_scores else 0

    delivery_agent = [
        f"{active} active engagements feeding live delivery metrics",
        f"{red} RED · {amber} AMBER — approval conditions need review",
        f"Avg delivery health: {avg_health}/100 across active deals",
    ]

    return {
        "pipeline_agent": pipeline_agent,
        "delivery_agent": delivery_agent,
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "meta": {
            "approaching_count": approaching_count,
            "tier3_pending": tier3,
            "shaping_value": shaping_value,
            "active_engagements": active,
            "amber": amber,
            "red": red,
            "avg_delivery_health": avg_health,
        },
    }
