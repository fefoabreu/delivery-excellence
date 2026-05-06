from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Opportunity, Contract, DeliveryProject, RAIDItem, Milestone

router = APIRouter(prefix="/api/portfolio", tags=["portfolio"])

STAGE_ORDER = ["prospect", "qualify", "develop", "propose", "negotiate", "closed_won", "closed_lost"]


@router.get("/pipeline-metrics")
def pipeline_metrics(db: Session = Depends(get_db)):
    opps = db.query(Opportunity).all()
    total_pipeline = sum(o.estimated_value for o in opps if o.stage not in ("closed_won", "closed_lost"))
    weighted_pipeline = sum(o.weighted_value for o in opps if o.stage not in ("closed_won", "closed_lost"))
    won = [o for o in opps if o.stage == "closed_won"]
    lost = [o for o in opps if o.stage == "closed_lost"]
    closed = won + lost
    win_rate = round(len(won) / len(closed) * 100, 1) if closed else 0

    by_stage = {}
    for stage in STAGE_ORDER[:-2]:
        stage_opps = [o for o in opps if o.stage == stage]
        by_stage[stage] = {
            "count": len(stage_opps),
            "value": sum(o.estimated_value for o in stage_opps),
            "weighted": sum(o.weighted_value for o in stage_opps),
        }

    by_region = {}
    for o in opps:
        if o.region and o.stage not in ("closed_won", "closed_lost"):
            by_region.setdefault(o.region, {"count": 0, "value": 0})
            by_region[o.region]["count"] += 1
            by_region[o.region]["value"] += o.estimated_value

    by_owner = {}
    for o in opps:
        if o.owner and o.stage not in ("closed_won", "closed_lost"):
            by_owner.setdefault(o.owner, {"count": 0, "value": 0})
            by_owner[o.owner]["count"] += 1
            by_owner[o.owner]["value"] += o.estimated_value

    return {
        "total_opportunities": len(opps),
        "active_opportunities": len([o for o in opps if o.stage not in ("closed_won", "closed_lost")]),
        "total_pipeline_value": total_pipeline,
        "weighted_pipeline_value": weighted_pipeline,
        "closed_won_count": len(won),
        "closed_won_value": sum(o.estimated_value for o in won),
        "win_rate": win_rate,
        "by_stage": by_stage,
        "by_region": by_region,
        "by_owner": by_owner,
    }


@router.get("/delivery-metrics")
def delivery_metrics(db: Session = Depends(get_db)):
    projects = db.query(DeliveryProject).all()
    active = [p for p in projects if p.status == "active"]
    completed = [p for p in projects if p.status == "completed"]

    health_counts = {"green": 0, "amber": 0, "red": 0}
    for p in active:
        health_counts[p.overall_health] = health_counts.get(p.overall_health, 0) + 1

    total_budget = sum(p.budget for p in active)
    total_actuals = sum(p.actuals for p in active)

    open_raid = db.query(RAIDItem).filter(RAIDItem.status == "open").count()
    overdue_milestones = db.query(Milestone).filter(Milestone.status == "overdue").count()

    dimension_health = {}
    for dim in ("schedule", "budget", "scope", "risk", "satisfaction"):
        col = getattr(DeliveryProject, f"health_{dim}")
        counts = {"green": 0, "amber": 0, "red": 0}
        for p in active:
            val = getattr(p, f"health_{dim}")
            counts[val] = counts.get(val, 0) + 1
        dimension_health[dim] = counts

    return {
        "total_projects": len(projects),
        "active_projects": len(active),
        "completed_projects": len(completed),
        "health_summary": health_counts,
        "total_budget": total_budget,
        "total_actuals": total_actuals,
        "overall_burn_rate": round(total_actuals / total_budget * 100, 1) if total_budget else 0,
        "avg_completion": round(sum(p.completion_pct for p in active) / len(active), 1) if active else 0,
        "open_raid_items": open_raid,
        "overdue_milestones": overdue_milestones,
        "dimension_health": dimension_health,
        "projects_at_risk": [
            {"id": p.id, "name": p.name, "client_name": p.client_name, "overall_health": p.overall_health}
            for p in active if p.overall_health in ("red", "amber")
        ],
    }


@router.get("/executive-summary")
def executive_summary(db: Session = Depends(get_db)):
    pipeline = pipeline_metrics(db=db)
    delivery = delivery_metrics(db=db)
    contracts = db.query(Contract).all()
    return {
        "pipeline": pipeline,
        "delivery": delivery,
        "contracts": {
            "total": len(contracts),
            "draft": len([c for c in contracts if c.status == "draft"]),
            "pending_approval": len([c for c in contracts if c.status == "pending_approval"]),
            "approved": len([c for c in contracts if c.status == "approved"]),
            "active": len([c for c in contracts if c.status == "active"]),
            "total_contract_value": sum(c.total_value for c in contracts if c.status in ("approved", "active")),
        },
    }
