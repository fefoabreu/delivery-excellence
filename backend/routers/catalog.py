from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from database import get_db
from models import ServiceCatalog

router = APIRouter(prefix="/api/catalog", tags=["catalog"])


class ServiceOut(BaseModel):
    id: str
    name: str
    category: str
    practice: Optional[str]
    description: Optional[str]
    unit: Optional[str]
    list_price: Optional[float]
    active: bool

    class Config:
        from_attributes = True


@router.get("/", response_model=List[ServiceOut])
def list_services(category: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(ServiceCatalog).filter(ServiceCatalog.active == True)
    if category:
        q = q.filter(ServiceCatalog.category == category)
    return q.order_by(ServiceCatalog.category, ServiceCatalog.name).all()


@router.get("/{service_id}", response_model=ServiceOut)
def get_service(service_id: str, db: Session = Depends(get_db)):
    svc = db.query(ServiceCatalog).filter(ServiceCatalog.id == service_id).first()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    return svc
