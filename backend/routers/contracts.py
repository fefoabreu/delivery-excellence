import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from database import get_db
from models import Contract, ContractServiceLine, ServiceCatalog

router = APIRouter(prefix="/api/contracts", tags=["contracts"])


class ServiceLineIn(BaseModel):
    service_id: str
    quantity: float = 1
    discount_pct: float = 0


class ContractCreate(BaseModel):
    opportunity_id: Optional[str] = None
    name: str
    client_name: str
    scope_summary: Optional[str] = None
    terms_conditions: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    created_by: Optional[str] = None
    service_lines: List[ServiceLineIn] = []


class ContractUpdate(BaseModel):
    name: Optional[str] = None
    client_name: Optional[str] = None
    scope_summary: Optional[str] = None
    terms_conditions: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    status: Optional[str] = None


class ApprovalAction(BaseModel):
    action: str  # approve, reject
    approved_by: str
    notes: Optional[str] = None


def serialize_contract(c: Contract) -> dict:
    lines = []
    for sl in c.service_lines:
        lines.append({
            "id": sl.id,
            "service_id": sl.service_id,
            "service_name": sl.service_name,
            "category": sl.category,
            "quantity": sl.quantity,
            "unit": sl.unit,
            "unit_price": sl.unit_price,
            "discount_pct": sl.discount_pct,
            "total": sl.total,
        })
    return {
        "id": c.id,
        "opportunity_id": c.opportunity_id,
        "contract_number": c.contract_number,
        "name": c.name,
        "client_name": c.client_name,
        "total_value": c.total_value,
        "status": c.status,
        "approval_status": c.approval_status,
        "approved_by": c.approved_by,
        "approved_at": c.approved_at.isoformat() if c.approved_at else None,
        "scope_summary": c.scope_summary,
        "terms_conditions": c.terms_conditions,
        "start_date": str(c.start_date) if c.start_date else None,
        "end_date": str(c.end_date) if c.end_date else None,
        "created_by": c.created_by,
        "created_at": c.created_at.isoformat() if c.created_at else None,
        "updated_at": c.updated_at.isoformat() if c.updated_at else None,
        "service_lines": lines,
        "has_handoff": c.handoff is not None,
        "has_delivery": c.delivery_project is not None,
    }


def _generate_contract_number(db: Session) -> str:
    count = db.query(Contract).count()
    return f"CON-{datetime.utcnow().year}-{str(count + 1).zfill(4)}"


@router.get("/")
def list_contracts(status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(Contract)
    if status:
        q = q.filter(Contract.status == status)
    contracts = q.order_by(Contract.updated_at.desc()).all()
    return [serialize_contract(c) for c in contracts]


@router.post("/")
def create_contract(data: ContractCreate, db: Session = Depends(get_db)):
    contract = Contract(
        opportunity_id=data.opportunity_id,
        contract_number=_generate_contract_number(db),
        name=data.name,
        client_name=data.client_name,
        scope_summary=data.scope_summary,
        terms_conditions=data.terms_conditions,
        start_date=data.start_date,
        end_date=data.end_date,
        created_by=data.created_by,
        status="draft",
        approval_status="pending",
    )
    db.add(contract)
    db.flush()

    total = 0.0
    for sl_in in data.service_lines:
        svc = db.query(ServiceCatalog).filter(ServiceCatalog.id == sl_in.service_id).first()
        if svc:
            unit_price = svc.list_price or 0
            line_total = unit_price * sl_in.quantity * (1 - sl_in.discount_pct / 100)
            sl = ContractServiceLine(
                contract_id=contract.id,
                service_id=svc.id,
                service_name=svc.name,
                category=svc.category,
                quantity=sl_in.quantity,
                unit=svc.unit,
                unit_price=unit_price,
                discount_pct=sl_in.discount_pct,
                total=line_total,
            )
            db.add(sl)
            total += line_total

    contract.total_value = total
    db.commit()
    db.refresh(contract)
    return serialize_contract(contract)


@router.get("/{contract_id}")
def get_contract(contract_id: str, db: Session = Depends(get_db)):
    c = db.query(Contract).filter(Contract.id == contract_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Contract not found")
    return serialize_contract(c)


@router.put("/{contract_id}")
def update_contract(contract_id: str, data: ContractUpdate, db: Session = Depends(get_db)):
    c = db.query(Contract).filter(Contract.id == contract_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Contract not found")
    for field, val in data.model_dump(exclude_none=True).items():
        setattr(c, field, val)
    c.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(c)
    return serialize_contract(c)


@router.post("/{contract_id}/submit")
def submit_for_approval(contract_id: str, db: Session = Depends(get_db)):
    c = db.query(Contract).filter(Contract.id == contract_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Contract not found")
    c.status = "pending_approval"
    c.updated_at = datetime.utcnow()
    db.commit()
    return serialize_contract(c)


@router.post("/{contract_id}/approve")
def approve_contract(contract_id: str, data: ApprovalAction, db: Session = Depends(get_db)):
    c = db.query(Contract).filter(Contract.id == contract_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Contract not found")
    if data.action == "approve":
        c.status = "approved"
        c.approval_status = "approved"
        c.approved_by = data.approved_by
        c.approved_at = datetime.utcnow()
    else:
        c.status = "draft"
        c.approval_status = "rejected"
    c.updated_at = datetime.utcnow()
    db.commit()
    return serialize_contract(c)


@router.post("/{contract_id}/close")
def close_contract(contract_id: str, db: Session = Depends(get_db)):
    c = db.query(Contract).filter(Contract.id == contract_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Contract not found")
    if c.approval_status != "approved":
        raise HTTPException(status_code=400, detail="Contract must be approved before closing")
    c.status = "active"
    c.updated_at = datetime.utcnow()
    db.commit()
    return serialize_contract(c)
