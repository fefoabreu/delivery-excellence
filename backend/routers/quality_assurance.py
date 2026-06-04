import json
from pathlib import Path
from fastapi import APIRouter, HTTPException, Depends, Body
from sqlalchemy.orm import Session
from database import get_db
from models import (
    QAPortfolioMonitor,
    QACheckpoint,
    QAGetToGreen,
    QAKnowledgeNetwork,
    QAClientPortal,
    QASingleton,
)

router = APIRouter(prefix="/api/quality-assurance", tags=["quality-assurance"])

# Config is static tuning (thresholds/weights), kept as a file alongside the
# canonical dataset the frontend also ships for its static build.
DATA_DIR = Path(__file__).resolve().parents[2] / "frontend" / "public" / "mock-data"


def _row(obj) -> dict:
    """Serialize a SQLAlchemy row back to its original JSON shape."""
    return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}


def _apply(obj, body: dict, allowed: set):
    """Partial-update: write only allowed fields present in the body."""
    unknown = set(body) - allowed
    if unknown:
        raise HTTPException(status_code=422, detail=f"Fields not editable: {sorted(unknown)}")
    for k, v in body.items():
        setattr(obj, k, v)


# ── Reads ──────────────────────────────────────────────────────────────────
@router.get("/")
def get_quality_assurance(db: Session = Depends(get_db)):
    """Full QA dataset, assembled from the DB in the exact shape the UI expects."""
    health_reviews = db.query(QASingleton).get("health_reviews")
    qa_evals = db.query(QASingleton).get("qa_evals")
    return {
        "portfolio_monitor": [_row(r) for r in db.query(QAPortfolioMonitor).all()],
        "checkpoints": [_row(r) for r in db.query(QACheckpoint).all()],
        "get_to_green": [_row(r) for r in db.query(QAGetToGreen).all()],
        "health_reviews": health_reviews.data if health_reviews else None,
        "knowledge_network": [_row(r) for r in db.query(QAKnowledgeNetwork).all()],
        "client_portal": [_row(r) for r in db.query(QAClientPortal).all()],
        "qa_evals": qa_evals.data if qa_evals else None,
    }


@router.get("/config")
def get_quality_assurance_config():
    """QA configuration (thresholds, weights, etc.)."""
    path = DATA_DIR / "quality-assurance-config.json"
    if not path.exists():
        raise HTTPException(status_code=404, detail="QA config file not found")
    return json.load(open(path))


# ── Writes ─────────────────────────────────────────────────────────────────
PORTFOLIO_EDITABLE = {
    "overall_health", "status", "phase", "ai_assessment", "ai_narrative",
    "completion_pct", "actuals", "burn_rate", "budget", "days_in_current_status",
    "qa_director_override", "early_warning", "health_dimensions",
}

CHECKPOINT_EDITABLE = {
    "status", "completed_date", "maturity_score", "ai_assessment",
    "qa_director_override", "criteria_met", "criteria_gaps",
}

G2G_EDITABLE = {
    "status", "current_ew_score", "target_green_date", "qa_specialist",
    "root_causes", "immediate_actions", "recovery_milestones",
    "success_criteria", "weekly_assessments",
}


@router.patch("/portfolio/{project_id}")
def update_portfolio(project_id: str, body: dict = Body(...), db: Session = Depends(get_db)):
    """Update a monitored engagement (e.g. QA Director override, health, EW signals)."""
    row = db.query(QAPortfolioMonitor).get(project_id)
    if not row:
        raise HTTPException(status_code=404, detail=f"Engagement {project_id} not found")
    _apply(row, body, PORTFOLIO_EDITABLE)
    db.commit()
    db.refresh(row)
    return _row(row)


@router.patch("/checkpoints/{checkpoint_id}")
def update_checkpoint(checkpoint_id: str, body: dict = Body(...), db: Session = Depends(get_db)):
    """Update a phase-gate checkpoint (complete it, score maturity, override the AI)."""
    row = db.query(QACheckpoint).get(checkpoint_id)
    if not row:
        raise HTTPException(status_code=404, detail=f"Checkpoint {checkpoint_id} not found")
    _apply(row, body, CHECKPOINT_EDITABLE)
    db.commit()
    db.refresh(row)
    return _row(row)


@router.patch("/get-to-green/{plan_id}")
def update_get_to_green(plan_id: str, body: dict = Body(...), db: Session = Depends(get_db)):
    """Update a Get-to-Green recovery plan (advance milestones, log weekly assessments)."""
    row = db.query(QAGetToGreen).get(plan_id)
    if not row:
        raise HTTPException(status_code=404, detail=f"Get-to-Green plan {plan_id} not found")
    _apply(row, body, G2G_EDITABLE)
    db.commit()
    db.refresh(row)
    return _row(row)
