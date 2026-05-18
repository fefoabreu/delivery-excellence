import json
import statistics
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Contract, DealProfile, DeliveryProject

router = APIRouter(prefix="/api/evals", tags=["evals"])

# ── Alignment mapping ──────────────────────────────────────────────────────
ALIGNMENT_MAP = {
    "APPROVE":                 "approved",
    "APPROVE_WITH_CONDITIONS": "conditionally_approved",
    "RECOMMEND_REVIEW":        "in_review",
    "FLAG_REJECTION":          "rejected",
}

AI_RANK    = {"APPROVE": 4, "APPROVE_WITH_CONDITIONS": 3, "RECOMMEND_REVIEW": 2, "FLAG_REJECTION": 1}
HUMAN_RANK = {"approved": 4, "conditionally_approved": 3, "in_review": 2, "rejected": 1}

# ── Dimension metadata ─────────────────────────────────────────────────────
DIMENSION_META = {
    "on_strategy":          {"label": "Strategic Alignment",   "weight": 0.15},
    "risk_profile":         {"label": "Risk Profile",          "weight": 0.15},
    "sow_quality":          {"label": "SOW Quality",           "weight": 0.12},
    "delivery_success":     {"label": "Delivery Success Rate", "weight": 0.10},
    "estimation_accuracy":  {"label": "Estimation Accuracy",   "weight": 0.10},
    "compliance":           {"label": "Compliance",            "weight": 0.08},
    "ip_leverage":          {"label": "IP Leverage",           "weight": 0.08},
    "vendor_participation": {"label": "Vendor Participation",  "weight": 0.07},
    "azure_consumption":    {"label": "Azure Consumption",     "weight": 0.07},
    "sold_margin":          {"label": "Margin Quality",        "weight": 0.08},
}

def score_band(score: float) -> str:
    if score >= 75: return "high"
    if score >= 60: return "medium"
    return "low"


@router.get("/summary")
def get_evals_summary(db: Session = Depends(get_db)):

    # ── All deal profiles with contracts ──────────────────────────────────
    profiles = (
        db.query(DealProfile, Contract)
        .join(Contract, Contract.id == DealProfile.contract_id)
        .all()
    )

    # ── 1. Human-AI Alignment ─────────────────────────────────────────────
    decided = [(p, c) for p, c in profiles if p.action_taken]
    aligned_count       = 0
    human_more_lenient  = 0
    human_more_strict   = 0
    by_tier = {1: {"total": 0, "aligned": 0}, 2: {"total": 0, "aligned": 0}, 3: {"total": 0, "aligned": 0}}
    decisions = []

    for p, c in decided:
        expected   = ALIGNMENT_MAP.get(p.ai_recommendation_status or "")
        is_aligned = (p.action_taken == expected)
        if is_aligned:
            aligned_count += 1
        else:
            ai_r  = AI_RANK.get(p.ai_recommendation_status or "", 0)
            hu_r  = HUMAN_RANK.get(p.action_taken or "", 0)
            if hu_r > ai_r:
                human_more_lenient += 1
            else:
                human_more_strict += 1

        tier = p.approval_tier or 3
        if tier in by_tier:
            by_tier[tier]["total"]   += 1
            by_tier[tier]["aligned"] += 1 if is_aligned else 0

        decisions.append({
            "contract_id": c.id,
            "name":        c.name,
            "client_name": c.client_name,
            "total_value": c.total_value,
            "deal_score":  round(p.deal_score or 0, 1),
            "tier":        tier,
            "ai_status":   p.ai_recommendation_status,
            "action":      p.action_taken,
            "aligned":     is_aligned,
            "direction":   (
                None if is_aligned
                else ("lenient" if HUMAN_RANK.get(p.action_taken or "", 0) > AI_RANK.get(p.ai_recommendation_status or "", 0) else "strict")
            ),
            "action_by":   p.action_by,
            "action_date": p.action_date.isoformat() if p.action_date else None,
        })

    total_decided  = len(decided)
    alignment_rate = (aligned_count / total_decided) if total_decided else 0

    by_tier_out = {
        str(t): {
            "total":   v["total"],
            "aligned": v["aligned"],
            "rate":    round(v["aligned"] / v["total"], 3) if v["total"] else 0,
        }
        for t, v in by_tier.items()
    }

    # ── 2. Score Distribution ─────────────────────────────────────────────
    all_scores  = [p.deal_score for p, _ in profiles if p.deal_score is not None]
    bands       = {"0-49": 0, "50-64": 0, "65-74": 0, "75-84": 0, "85-100": 0}
    tier_scores = {1: [], 2: [], 3: []}

    for p, _ in profiles:
        s = p.deal_score or 0
        if   s < 50: bands["0-49"]   += 1
        elif s < 65: bands["50-64"]  += 1
        elif s < 75: bands["65-74"]  += 1
        elif s < 85: bands["75-84"]  += 1
        else:        bands["85-100"] += 1
        t = p.approval_tier or 3
        if t in tier_scores:
            tier_scores[t].append(s)

    tier_score_out = {
        str(t): {
            "avg":   round(statistics.mean(s), 1) if s else 0,
            "count": len(s),
        }
        for t, s in tier_scores.items()
    }

    # ── 3. Score vs. Delivery Outcome ─────────────────────────────────────
    correlated = (
        db.query(DealProfile, Contract, DeliveryProject)
        .join(Contract,         Contract.id         == DealProfile.contract_id)
        .join(DeliveryProject,  DeliveryProject.contract_id == Contract.id)
        .all()
    )

    by_band: dict = {
        "high":   {"green": 0, "amber": 0, "red": 0, "deals": []},
        "medium": {"green": 0, "amber": 0, "red": 0, "deals": []},
        "low":    {"green": 0, "amber": 0, "red": 0, "deals": []},
    }

    for p, c, dp in correlated:
        band   = score_band(p.deal_score or 0)
        health = dp.overall_health or "green"
        if health in by_band[band]:
            by_band[band][health] += 1
        by_band[band]["deals"].append({
            "name":           c.name,
            "client_name":    c.client_name,
            "deal_score":     round(p.deal_score or 0, 1),
            "overall_health": health,
            "completion_pct": dp.completion_pct,
            "burn_rate":      round((dp.actuals / dp.budget * 100), 1) if dp.budget else 0,
            "ai_status":      p.ai_recommendation_status,
        })

    # ── 4. Dimension Analysis ─────────────────────────────────────────────
    dim_values: dict = {k: [] for k in DIMENSION_META}
    for p, _ in profiles:
        if p.score_breakdown:
            try:
                bd = json.loads(p.score_breakdown)
                for k in DIMENSION_META:
                    if k in bd and bd[k] is not None:
                        dim_values[k].append(float(bd[k]))
            except (json.JSONDecodeError, ValueError, TypeError):
                pass

    dimensions = []
    for k, meta in DIMENSION_META.items():
        vals = dim_values[k]
        dimensions.append({
            "key":      k,
            "label":    meta["label"],
            "weight":   meta["weight"],
            "avg":      round(statistics.mean(vals), 2) if vals else 0,
            "min":      round(min(vals), 2) if vals else 0,
            "max":      round(max(vals), 2) if vals else 0,
            "variance": round(statistics.stdev(vals), 2) if len(vals) > 1 else 0,
            "count":    len(vals),
        })

    dimensions.sort(key=lambda x: x["variance"], reverse=True)

    return {
        "alignment": {
            "total_scored":  len(profiles),
            "total_decided": total_decided,
            "aligned":       aligned_count,
            "alignment_rate": round(alignment_rate, 3),
            "divergence": {
                "human_more_lenient": human_more_lenient,
                "human_more_strict":  human_more_strict,
            },
            "by_tier":   by_tier_out,
            "decisions": decisions,
        },
        "score_distribution": {
            "total": len(all_scores),
            "avg":   round(statistics.mean(all_scores), 1) if all_scores else 0,
            "bands": bands,
            "by_tier": tier_score_out,
        },
        "score_vs_delivery": {
            "correlated_count": len(correlated),
            "by_band":          by_band,
        },
        "dimensions": dimensions,
    }
