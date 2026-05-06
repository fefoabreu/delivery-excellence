import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from database import get_db
from models import Handoff, HandoffContact, Contract

router = APIRouter(prefix="/api/handoffs", tags=["handoffs"])


class ContactIn(BaseModel):
    name: str
    title: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    role: str = "stakeholder"


class HandoffCreate(BaseModel):
    contract_id: str
    customer_vision: Optional[str] = None
    business_objectives: Optional[List[str]] = []
    success_criteria: Optional[List[str]] = []
    risks: Optional[List[str]] = []
    pitfalls: Optional[List[str]] = []
    key_decisions: Optional[List[str]] = []
    delivery_notes: Optional[str] = None
    pre_sales_owner: Optional[str] = None
    delivery_owner: Optional[str] = None
    contacts: Optional[List[ContactIn]] = []


class HandoffUpdate(BaseModel):
    customer_vision: Optional[str] = None
    business_objectives: Optional[List[str]] = None
    success_criteria: Optional[List[str]] = None
    risks: Optional[List[str]] = None
    pitfalls: Optional[List[str]] = None
    key_decisions: Optional[List[str]] = None
    delivery_notes: Optional[str] = None
    pre_sales_owner: Optional[str] = None
    delivery_owner: Optional[str] = None
    status: Optional[str] = None


def serialize_handoff(h: Handoff) -> dict:
    contacts = [{"id": c.id, "name": c.name, "title": c.title, "email": c.email, "phone": c.phone, "role": c.role} for c in h.contacts]
    return {
        "id": h.id,
        "contract_id": h.contract_id,
        "customer_vision": h.customer_vision,
        "business_objectives": json.loads(h.business_objectives) if h.business_objectives else [],
        "success_criteria": json.loads(h.success_criteria) if h.success_criteria else [],
        "risks": json.loads(h.risks) if h.risks else [],
        "pitfalls": json.loads(h.pitfalls) if h.pitfalls else [],
        "key_decisions": json.loads(h.key_decisions) if h.key_decisions else [],
        "delivery_notes": h.delivery_notes,
        "pre_sales_owner": h.pre_sales_owner,
        "delivery_owner": h.delivery_owner,
        "status": h.status,
        "completed_at": h.completed_at.isoformat() if h.completed_at else None,
        "created_at": h.created_at.isoformat() if h.created_at else None,
        "contacts": contacts,
    }


@router.get("/")
def list_handoffs(db: Session = Depends(get_db)):
    handoffs = db.query(Handoff).order_by(Handoff.created_at.desc()).all()
    return [serialize_handoff(h) for h in handoffs]


@router.post("/")
def create_handoff(data: HandoffCreate, db: Session = Depends(get_db)):
    contract = db.query(Contract).filter(Contract.id == data.contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    if contract.handoff:
        raise HTTPException(status_code=400, detail="Handoff already exists for this contract")

    h = Handoff(
        contract_id=data.contract_id,
        customer_vision=data.customer_vision,
        business_objectives=json.dumps(data.business_objectives or []),
        success_criteria=json.dumps(data.success_criteria or []),
        risks=json.dumps(data.risks or []),
        pitfalls=json.dumps(data.pitfalls or []),
        key_decisions=json.dumps(data.key_decisions or []),
        delivery_notes=data.delivery_notes,
        pre_sales_owner=data.pre_sales_owner,
        delivery_owner=data.delivery_owner,
        status="pending",
    )
    db.add(h)
    db.flush()

    for c_in in (data.contacts or []):
        contact = HandoffContact(
            handoff_id=h.id,
            name=c_in.name,
            title=c_in.title,
            email=c_in.email,
            phone=c_in.phone,
            role=c_in.role,
        )
        db.add(contact)

    db.commit()
    db.refresh(h)
    return serialize_handoff(h)


@router.get("/{handoff_id}")
def get_handoff(handoff_id: str, db: Session = Depends(get_db)):
    h = db.query(Handoff).filter(Handoff.id == handoff_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Handoff not found")
    return serialize_handoff(h)


@router.get("/contract/{contract_id}")
def get_handoff_by_contract(contract_id: str, db: Session = Depends(get_db)):
    h = db.query(Handoff).filter(Handoff.contract_id == contract_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Handoff not found")
    return serialize_handoff(h)


@router.put("/{handoff_id}")
def update_handoff(handoff_id: str, data: HandoffUpdate, db: Session = Depends(get_db)):
    h = db.query(Handoff).filter(Handoff.id == handoff_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Handoff not found")
    for field, val in data.model_dump(exclude_none=True).items():
        if field in ("business_objectives", "success_criteria", "risks", "pitfalls", "key_decisions"):
            setattr(h, field, json.dumps(val))
        else:
            setattr(h, field, val)
    if data.status == "completed":
        h.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(h)
    return serialize_handoff(h)
