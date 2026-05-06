import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from database import get_db
from models import Opportunity

router = APIRouter(prefix="/api/opportunities", tags=["opportunities"])

STAGE_PROBABILITY = {
    "prospect": 10,
    "qualify": 20,
    "develop": 40,
    "propose": 60,
    "negotiate": 80,
    "closed_won": 100,
    "closed_lost": 0,
}


class OpportunityCreate(BaseModel):
    name: str
    client_name: str
    client_contact: Optional[str] = None
    client_contact_email: Optional[str] = None
    stage: str = "prospect"
    estimated_value: float = 0
    description: Optional[str] = None
    owner: Optional[str] = None
    close_date: Optional[str] = None
    services: Optional[List[str]] = []
    industry: Optional[str] = None
    region: Optional[str] = None
    notes: Optional[str] = None


class OpportunityUpdate(BaseModel):
    name: Optional[str] = None
    client_name: Optional[str] = None
    client_contact: Optional[str] = None
    client_contact_email: Optional[str] = None
    stage: Optional[str] = None
    estimated_value: Optional[float] = None
    description: Optional[str] = None
    owner: Optional[str] = None
    close_date: Optional[str] = None
    services: Optional[List[str]] = None
    industry: Optional[str] = None
    region: Optional[str] = None
    notes: Optional[str] = None


class OpportunityOut(BaseModel):
    id: str
    name: str
    client_name: str
    client_contact: Optional[str]
    client_contact_email: Optional[str]
    stage: str
    estimated_value: float
    probability: int
    weighted_value: float
    description: Optional[str]
    owner: Optional[str]
    close_date: Optional[str]
    services: Optional[List[str]]
    industry: Optional[str]
    region: Optional[str]
    notes: Optional[str]
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


def serialize_opp(opp: Opportunity) -> dict:
    return {
        "id": opp.id,
        "name": opp.name,
        "client_name": opp.client_name,
        "client_contact": opp.client_contact,
        "client_contact_email": opp.client_contact_email,
        "stage": opp.stage,
        "estimated_value": opp.estimated_value,
        "probability": opp.probability,
        "weighted_value": opp.weighted_value,
        "description": opp.description,
        "owner": opp.owner,
        "close_date": str(opp.close_date) if opp.close_date else None,
        "services": json.loads(opp.services) if opp.services else [],
        "industry": opp.industry,
        "region": opp.region,
        "notes": opp.notes,
        "created_at": opp.created_at.isoformat() if opp.created_at else None,
        "updated_at": opp.updated_at.isoformat() if opp.updated_at else None,
    }


@router.get("/")
def list_opportunities(stage: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(Opportunity)
    if stage:
        q = q.filter(Opportunity.stage == stage)
    opps = q.order_by(Opportunity.updated_at.desc()).all()
    return [serialize_opp(o) for o in opps]


@router.post("/")
def create_opportunity(data: OpportunityCreate, db: Session = Depends(get_db)):
    prob = STAGE_PROBABILITY.get(data.stage, 10)
    opp = Opportunity(
        name=data.name,
        client_name=data.client_name,
        client_contact=data.client_contact,
        client_contact_email=data.client_contact_email,
        stage=data.stage,
        estimated_value=data.estimated_value,
        probability=prob,
        weighted_value=data.estimated_value * prob / 100,
        description=data.description,
        owner=data.owner,
        close_date=data.close_date,
        services=json.dumps(data.services or []),
        industry=data.industry,
        region=data.region,
        notes=data.notes,
    )
    db.add(opp)
    db.commit()
    db.refresh(opp)
    return serialize_opp(opp)


@router.get("/{opp_id}")
def get_opportunity(opp_id: str, db: Session = Depends(get_db)):
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return serialize_opp(opp)


@router.put("/{opp_id}")
def update_opportunity(opp_id: str, data: OpportunityUpdate, db: Session = Depends(get_db)):
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    for field, val in data.model_dump(exclude_none=True).items():
        if field == "services":
            setattr(opp, field, json.dumps(val))
        else:
            setattr(opp, field, val)
    if data.stage:
        opp.probability = STAGE_PROBABILITY.get(data.stage, opp.probability)
    opp.weighted_value = opp.estimated_value * opp.probability / 100
    opp.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(opp)
    return serialize_opp(opp)


@router.delete("/{opp_id}")
def delete_opportunity(opp_id: str, db: Session = Depends(get_db)):
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    db.delete(opp)
    db.commit()
    return {"ok": True}
