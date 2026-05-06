import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from database import get_db
from models import WorkItem

router = APIRouter(prefix="/api/backlog", tags=["backlog"])

EPIC_AREAS = [
    "governance", "standards", "portfolio_insights", "risk_management",
    "financial_excellence", "readiness_excellence", "business_assets",
    "agentic_ai", "delivery_methodology",
]


class WorkItemUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[str] = None
    story_points: Optional[int] = None
    iteration: Optional[str] = None


def serialize(w: WorkItem) -> dict:
    return {
        "id": w.id,
        "work_item_id": w.work_item_id,
        "item_type": w.item_type,
        "parent_id": w.parent_id,
        "epic_area": w.epic_area,
        "title": w.title,
        "description": w.description,
        "acceptance_criteria": json.loads(w.acceptance_criteria) if w.acceptance_criteria else [],
        "assigned_to": w.assigned_to,
        "status": w.status,
        "priority": w.priority,
        "story_points": w.story_points,
        "iteration": w.iteration,
        "tags": json.loads(w.tags) if w.tags else [],
        "business_value": w.business_value,
        "created_at": w.created_at.isoformat() if w.created_at else None,
        "updated_at": w.updated_at.isoformat() if w.updated_at else None,
        "child_count": len(w.children) if w.children else 0,
    }


@router.get("/")
def list_items(
    item_type: Optional[str] = None,
    epic_area: Optional[str] = None,
    assigned_to: Optional[str] = None,
    status: Optional[str] = None,
    iteration: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(WorkItem)
    if item_type:
        q = q.filter(WorkItem.item_type == item_type)
    if epic_area:
        q = q.filter(WorkItem.epic_area == epic_area)
    if assigned_to:
        q = q.filter(WorkItem.assigned_to == assigned_to)
    if status:
        q = q.filter(WorkItem.status == status)
    if iteration:
        q = q.filter(WorkItem.iteration == iteration)
    items = q.order_by(WorkItem.work_item_id).all()
    return [serialize(w) for w in items]


@router.get("/tree")
def get_tree(
    epic_area: Optional[str] = None,
    assigned_to: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Return epics with nested features and user stories."""
    epics_q = db.query(WorkItem).filter(WorkItem.item_type == "epic")
    if epic_area:
        epics_q = epics_q.filter(WorkItem.epic_area == epic_area)
    epics = epics_q.order_by(WorkItem.work_item_id).all()

    result = []
    for epic in epics:
        features_q = db.query(WorkItem).filter(WorkItem.parent_id == epic.id, WorkItem.item_type == "feature")
        features = features_q.order_by(WorkItem.work_item_id).all()
        epic_data = serialize(epic)
        epic_data["features"] = []
        for feat in features:
            stories_q = db.query(WorkItem).filter(WorkItem.parent_id == feat.id)
            if assigned_to:
                stories_q = stories_q.filter(WorkItem.assigned_to == assigned_to)
            stories = stories_q.order_by(WorkItem.work_item_id).all()
            feat_data = serialize(feat)
            feat_data["stories"] = [serialize(s) for s in stories]
            feat_data["total_sp"] = sum((s.story_points or 0) for s in stories)
            feat_data["done_sp"] = sum((s.story_points or 0) for s in stories if s.status in ("resolved", "closed"))
            if not assigned_to or feat_data["stories"]:
                epic_data["features"].append(feat_data)
        epic_data["total_sp"] = sum(f.get("total_sp", 0) for f in epic_data["features"])
        epic_data["done_sp"] = sum(f.get("done_sp", 0) for f in epic_data["features"])
        result.append(epic_data)
    return result


@router.get("/metrics")
def metrics(db: Session = Depends(get_db)):
    all_items = db.query(WorkItem).all()
    stories = [w for w in all_items if w.item_type == "user_story"]
    features = [w for w in all_items if w.item_type == "feature"]
    epics = [w for w in all_items if w.item_type == "epic"]
    total_sp = sum(s.story_points or 0 for s in stories)
    done_sp = sum(s.story_points or 0 for s in stories if s.status in ("resolved", "closed"))
    by_status = {}
    for s in stories:
        by_status[s.status] = by_status.get(s.status, 0) + 1
    by_persona = {}
    for s in stories:
        p = s.assigned_to or "Unassigned"
        by_persona[p] = by_persona.get(p, 0) + 1
    return {
        "total_epics": len(epics),
        "total_features": len(features),
        "total_stories": len(stories),
        "total_sp": total_sp,
        "done_sp": done_sp,
        "pct_complete": round(done_sp / total_sp * 100, 1) if total_sp else 0,
        "by_status": by_status,
        "by_persona": by_persona,
    }


@router.get("/{item_id}")
def get_item(item_id: str, db: Session = Depends(get_db)):
    w = db.query(WorkItem).filter(WorkItem.id == item_id).first()
    if not w:
        raise HTTPException(status_code=404, detail="Work item not found")
    return serialize(w)


@router.put("/{item_id}")
def update_item(item_id: str, data: WorkItemUpdate, db: Session = Depends(get_db)):
    w = db.query(WorkItem).filter(WorkItem.id == item_id).first()
    if not w:
        raise HTTPException(status_code=404, detail="Work item not found")
    for field, val in data.model_dump(exclude_none=True).items():
        setattr(w, field, val)
    w.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(w)
    return serialize(w)
