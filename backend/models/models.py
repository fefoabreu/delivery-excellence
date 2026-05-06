import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Date, Text, ForeignKey
from sqlalchemy.orm import relationship, backref
from database import Base


def new_id():
    return str(uuid.uuid4())


class ServiceCatalog(Base):
    __tablename__ = "service_catalog"
    id = Column(String, primary_key=True, default=new_id)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # cloud_adoption, ai_agentic, dynamics, security, data_analytics
    practice = Column(String)
    description = Column(Text)
    unit = Column(String)  # day, hour, fixed, user_month
    list_price = Column(Float)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Opportunity(Base):
    __tablename__ = "opportunities"
    id = Column(String, primary_key=True, default=new_id)
    name = Column(String, nullable=False)
    client_name = Column(String, nullable=False)
    client_contact = Column(String)
    client_contact_email = Column(String)
    stage = Column(String, default="prospect")  # prospect, qualify, develop, propose, negotiate, closed_won, closed_lost
    estimated_value = Column(Float, default=0)
    probability = Column(Integer, default=10)
    weighted_value = Column(Float, default=0)
    description = Column(Text)
    owner = Column(String)
    close_date = Column(Date)
    services = Column(Text)  # JSON array of service IDs
    industry = Column(String)
    region = Column(String)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    contracts = relationship("Contract", back_populates="opportunity")


class Contract(Base):
    __tablename__ = "contracts"
    id = Column(String, primary_key=True, default=new_id)
    opportunity_id = Column(String, ForeignKey("opportunities.id"))
    contract_number = Column(String, unique=True)
    name = Column(String, nullable=False)
    client_name = Column(String)
    total_value = Column(Float, default=0)
    status = Column(String, default="draft")  # draft, pending_approval, approved, active, completed, cancelled
    approval_status = Column(String, default="pending")  # pending, approved, rejected
    approved_by = Column(String)
    approved_at = Column(DateTime)
    scope_summary = Column(Text)
    terms_conditions = Column(Text)
    start_date = Column(Date)
    end_date = Column(Date)
    created_by = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    opportunity = relationship("Opportunity", back_populates="contracts")
    service_lines = relationship("ContractServiceLine", back_populates="contract", cascade="all, delete-orphan")
    handoff = relationship("Handoff", back_populates="contract", uselist=False)
    delivery_project = relationship("DeliveryProject", back_populates="contract", uselist=False)


class ContractServiceLine(Base):
    __tablename__ = "contract_service_lines"
    id = Column(String, primary_key=True, default=new_id)
    contract_id = Column(String, ForeignKey("contracts.id"))
    service_id = Column(String, ForeignKey("service_catalog.id"))
    service_name = Column(String)
    category = Column(String)
    quantity = Column(Float, default=1)
    unit = Column(String)
    unit_price = Column(Float)
    discount_pct = Column(Float, default=0)
    total = Column(Float)

    contract = relationship("Contract", back_populates="service_lines")


class Handoff(Base):
    __tablename__ = "handoffs"
    id = Column(String, primary_key=True, default=new_id)
    contract_id = Column(String, ForeignKey("contracts.id"), unique=True)
    customer_vision = Column(Text)
    business_objectives = Column(Text)  # JSON array
    success_criteria = Column(Text)  # JSON array
    risks = Column(Text)  # JSON array
    pitfalls = Column(Text)  # JSON array
    key_decisions = Column(Text)  # JSON array
    delivery_notes = Column(Text)
    pre_sales_owner = Column(String)
    delivery_owner = Column(String)
    status = Column(String, default="pending")  # pending, in_review, completed
    completed_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

    contract = relationship("Contract", back_populates="handoff")
    contacts = relationship("HandoffContact", back_populates="handoff", cascade="all, delete-orphan")


class HandoffContact(Base):
    __tablename__ = "handoff_contacts"
    id = Column(String, primary_key=True, default=new_id)
    handoff_id = Column(String, ForeignKey("handoffs.id"))
    name = Column(String)
    title = Column(String)
    email = Column(String)
    phone = Column(String)
    role = Column(String)  # sponsor, champion, technical_lead, finance, end_user

    handoff = relationship("Handoff", back_populates="contacts")


class DeliveryProject(Base):
    __tablename__ = "delivery_projects"
    id = Column(String, primary_key=True, default=new_id)
    contract_id = Column(String, ForeignKey("contracts.id"), unique=True)
    name = Column(String, nullable=False)
    client_name = Column(String)
    project_manager = Column(String)
    technical_lead = Column(String)
    overall_health = Column(String, default="green")  # red, amber, green
    health_schedule = Column(String, default="green")
    health_budget = Column(String, default="green")
    health_scope = Column(String, default="green")
    health_risk = Column(String, default="green")
    health_satisfaction = Column(String, default="green")
    status = Column(String, default="active")  # active, on_hold, completed, cancelled
    start_date = Column(Date)
    end_date = Column(Date)
    budget = Column(Float, default=0)
    actuals = Column(Float, default=0)
    completion_pct = Column(Integer, default=0)
    phase = Column(String)  # initiate, plan, execute, monitor, close
    executive_summary = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    contract = relationship("Contract", back_populates="delivery_project")
    milestones = relationship("Milestone", back_populates="project", cascade="all, delete-orphan")
    raid_items = relationship("RAIDItem", back_populates="project", cascade="all, delete-orphan")
    status_updates = relationship("StatusUpdate", back_populates="project", cascade="all, delete-orphan")


class Milestone(Base):
    __tablename__ = "milestones"
    id = Column(String, primary_key=True, default=new_id)
    project_id = Column(String, ForeignKey("delivery_projects.id"))
    name = Column(String)
    description = Column(Text)
    due_date = Column(Date)
    completed_date = Column(Date)
    status = Column(String, default="not_started")  # not_started, in_progress, completed, overdue, at_risk
    owner = Column(String)
    deliverables = Column(Text)  # JSON array

    project = relationship("DeliveryProject", back_populates="milestones")


class RAIDItem(Base):
    __tablename__ = "raid_items"
    id = Column(String, primary_key=True, default=new_id)
    project_id = Column(String, ForeignKey("delivery_projects.id"))
    item_type = Column(String)  # risk, assumption, issue, dependency
    title = Column(String)
    description = Column(Text)
    impact = Column(String)  # high, medium, low
    probability = Column(String)  # high, medium, low (for risks)
    status = Column(String, default="open")  # open, in_progress, mitigated, closed
    owner = Column(String)
    due_date = Column(Date)
    mitigation = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("DeliveryProject", back_populates="raid_items")


class StatusUpdate(Base):
    __tablename__ = "status_updates"
    id = Column(String, primary_key=True, default=new_id)
    project_id = Column(String, ForeignKey("delivery_projects.id"))
    period = Column(String)  # e.g. "Week of May 5, 2026"
    overall_health = Column(String)
    summary = Column(Text)
    accomplishments = Column(Text)  # JSON array
    next_steps = Column(Text)  # JSON array
    escalations = Column(Text)  # JSON array
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("DeliveryProject", back_populates="status_updates")


class WorkItem(Base):
    __tablename__ = "work_items"
    id = Column(String, primary_key=True, default=new_id)
    work_item_id = Column(String, unique=True)   # WI-0001
    item_type = Column(String)                   # epic, feature, user_story
    parent_id = Column(String, ForeignKey("work_items.id"), nullable=True)
    epic_area = Column(String)                   # slug of the 9 areas
    title = Column(String, nullable=False)
    description = Column(Text)
    acceptance_criteria = Column(Text)           # JSON array
    assigned_to = Column(String)                 # Edwina | Karina | Maikel
    status = Column(String, default="new")       # new, active, in_progress, resolved, closed
    priority = Column(String, default="medium")  # critical, high, medium, low
    story_points = Column(Integer)
    iteration = Column(String)                   # Sprint 1 … Sprint 6
    tags = Column(Text)                          # JSON array
    business_value = Column(Integer)             # 1–10
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    children = relationship("WorkItem", backref=backref("parent", remote_side="WorkItem.id"))
