import json
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from database import get_db
from models import DeliveryProject, Milestone, RAIDItem, StatusUpdate, Contract

router = APIRouter(prefix="/api/delivery", tags=["delivery"])


class ProjectCreate(BaseModel):
    contract_id: str
    name: str
    client_name: str
    project_manager: Optional[str] = None
    technical_lead: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    budget: float = 0
    phase: str = "initiate"


class ProjectUpdate(BaseModel):
    project_manager: Optional[str] = None
    technical_lead: Optional[str] = None
    overall_health: Optional[str] = None
    health_schedule: Optional[str] = None
    health_budget: Optional[str] = None
    health_scope: Optional[str] = None
    health_risk: Optional[str] = None
    health_satisfaction: Optional[str] = None
    status: Optional[str] = None
    actuals: Optional[float] = None
    completion_pct: Optional[int] = None
    phase: Optional[str] = None
    executive_summary: Optional[str] = None


class MilestoneIn(BaseModel):
    name: str
    description: Optional[str] = None
    due_date: Optional[str] = None
    owner: Optional[str] = None
    deliverables: Optional[List[str]] = []


class MilestoneUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    completed_date: Optional[str] = None
    notes: Optional[str] = None
    owner: Optional[str] = None


class RAIDIn(BaseModel):
    item_type: str
    title: str
    description: Optional[str] = None
    impact: str = "medium"
    probability: Optional[str] = "medium"
    owner: Optional[str] = None
    due_date: Optional[str] = None
    mitigation: Optional[str] = None


class RAIDUpdate(BaseModel):
    status: Optional[str] = None
    mitigation: Optional[str] = None
    owner: Optional[str] = None


class StatusUpdateIn(BaseModel):
    period: str
    overall_health: str
    summary: str
    accomplishments: Optional[List[str]] = []
    next_steps: Optional[List[str]] = []
    escalations: Optional[List[str]] = []


def serialize_project(p: DeliveryProject) -> dict:
    return {
        "id": p.id,
        "contract_id": p.contract_id,
        "name": p.name,
        "client_name": p.client_name,
        "project_manager": p.project_manager,
        "technical_lead": p.technical_lead,
        "overall_health": p.overall_health,
        "health_schedule": p.health_schedule,
        "health_budget": p.health_budget,
        "health_scope": p.health_scope,
        "health_risk": p.health_risk,
        "health_satisfaction": p.health_satisfaction,
        "status": p.status,
        "start_date": str(p.start_date) if p.start_date else None,
        "end_date": str(p.end_date) if p.end_date else None,
        "budget": p.budget,
        "actuals": p.actuals,
        "burn_rate": round(p.actuals / p.budget * 100, 1) if p.budget else 0,
        "completion_pct": p.completion_pct,
        "phase": p.phase,
        "executive_summary": p.executive_summary,
        "created_at": p.created_at.isoformat() if p.created_at else None,
        "updated_at": p.updated_at.isoformat() if p.updated_at else None,
        "milestone_count": len(p.milestones),
        "open_raid_count": sum(1 for r in p.raid_items if r.status == "open"),
    }


@router.get("/projects")
def list_projects(status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(DeliveryProject)
    if status:
        q = q.filter(DeliveryProject.status == status)
    return [serialize_project(p) for p in q.order_by(DeliveryProject.updated_at.desc()).all()]


@router.post("/projects")
def create_project(data: ProjectCreate, db: Session = Depends(get_db)):
    contract = db.query(Contract).filter(Contract.id == data.contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    p = DeliveryProject(
        contract_id=data.contract_id,
        name=data.name,
        client_name=data.client_name,
        project_manager=data.project_manager,
        technical_lead=data.technical_lead,
        start_date=data.start_date,
        end_date=data.end_date,
        budget=data.budget,
        phase=data.phase,
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return serialize_project(p)


@router.get("/projects/{project_id}")
def get_project(project_id: str, db: Session = Depends(get_db)):
    p = db.query(DeliveryProject).filter(DeliveryProject.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    return serialize_project(p)


@router.put("/projects/{project_id}")
def update_project(project_id: str, data: ProjectUpdate, db: Session = Depends(get_db)):
    p = db.query(DeliveryProject).filter(DeliveryProject.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    for field, val in data.model_dump(exclude_none=True).items():
        setattr(p, field, val)
    p.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(p)
    return serialize_project(p)


# --- Milestones ---
@router.get("/projects/{project_id}/milestones")
def list_milestones(project_id: str, db: Session = Depends(get_db)):
    milestones = db.query(Milestone).filter(Milestone.project_id == project_id).all()
    return [{
        "id": m.id, "project_id": m.project_id, "name": m.name,
        "description": m.description, "due_date": str(m.due_date) if m.due_date else None,
        "completed_date": str(m.completed_date) if m.completed_date else None,
        "status": m.status, "owner": m.owner,
        "deliverables": json.loads(m.deliverables) if m.deliverables else [],
    } for m in milestones]


@router.post("/projects/{project_id}/milestones")
def create_milestone(project_id: str, data: MilestoneIn, db: Session = Depends(get_db)):
    m = Milestone(
        project_id=project_id, name=data.name, description=data.description,
        due_date=data.due_date, owner=data.owner,
        deliverables=json.dumps(data.deliverables or []),
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return {"id": m.id, "project_id": m.project_id, "name": m.name,
            "description": m.description, "due_date": str(m.due_date) if m.due_date else None,
            "status": m.status, "owner": m.owner,
            "deliverables": json.loads(m.deliverables) if m.deliverables else []}


@router.put("/milestones/{milestone_id}")
def update_milestone(milestone_id: str, data: MilestoneUpdate, db: Session = Depends(get_db)):
    m = db.query(Milestone).filter(Milestone.id == milestone_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Milestone not found")
    for field, val in data.model_dump(exclude_none=True).items():
        setattr(m, field, val)
    db.commit()
    db.refresh(m)
    return {"id": m.id, "name": m.name, "status": m.status}


# --- RAID ---
@router.get("/projects/{project_id}/raid")
def list_raid(project_id: str, item_type: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(RAIDItem).filter(RAIDItem.project_id == project_id)
    if item_type:
        q = q.filter(RAIDItem.item_type == item_type)
    items = q.all()
    return [{
        "id": r.id, "project_id": r.project_id, "item_type": r.item_type,
        "title": r.title, "description": r.description, "impact": r.impact,
        "probability": r.probability, "status": r.status, "owner": r.owner,
        "due_date": str(r.due_date) if r.due_date else None, "mitigation": r.mitigation,
        "created_at": r.created_at.isoformat() if r.created_at else None,
    } for r in items]


@router.post("/projects/{project_id}/raid")
def create_raid_item(project_id: str, data: RAIDIn, db: Session = Depends(get_db)):
    r = RAIDItem(
        project_id=project_id, item_type=data.item_type, title=data.title,
        description=data.description, impact=data.impact, probability=data.probability,
        owner=data.owner, due_date=data.due_date, mitigation=data.mitigation,
    )
    db.add(r)
    db.commit()
    db.refresh(r)
    return {"id": r.id, "item_type": r.item_type, "title": r.title, "status": r.status}


@router.put("/raid/{raid_id}")
def update_raid(raid_id: str, data: RAIDUpdate, db: Session = Depends(get_db)):
    r = db.query(RAIDItem).filter(RAIDItem.id == raid_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="RAID item not found")
    for field, val in data.model_dump(exclude_none=True).items():
        setattr(r, field, val)
    db.commit()
    return {"id": r.id, "status": r.status}


# --- Status Updates ---
@router.get("/projects/{project_id}/status-updates")
def list_status_updates(project_id: str, db: Session = Depends(get_db)):
    updates = db.query(StatusUpdate).filter(StatusUpdate.project_id == project_id).order_by(StatusUpdate.created_at.desc()).all()
    return [{
        "id": u.id, "project_id": u.project_id, "period": u.period,
        "overall_health": u.overall_health, "summary": u.summary,
        "accomplishments": json.loads(u.accomplishments) if u.accomplishments else [],
        "next_steps": json.loads(u.next_steps) if u.next_steps else [],
        "escalations": json.loads(u.escalations) if u.escalations else [],
        "created_at": u.created_at.isoformat() if u.created_at else None,
    } for u in updates]


@router.post("/projects/{project_id}/status-updates")
def create_status_update(project_id: str, data: StatusUpdateIn, db: Session = Depends(get_db)):
    u = StatusUpdate(
        project_id=project_id, period=data.period, overall_health=data.overall_health,
        summary=data.summary,
        accomplishments=json.dumps(data.accomplishments or []),
        next_steps=json.dumps(data.next_steps or []),
        escalations=json.dumps(data.escalations or []),
    )
    db.add(u)
    db.commit()
    db.refresh(u)
    return {"id": u.id, "period": u.period, "overall_health": u.overall_health}
