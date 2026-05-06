from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models.models import Base
from routers import catalog, opportunities, contracts, handoff, delivery, portfolio, agent, backlog, deal_approvals

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Delivery Excellence API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(catalog.router)
app.include_router(opportunities.router)
app.include_router(contracts.router)
app.include_router(handoff.router)
app.include_router(delivery.router)
app.include_router(portfolio.router)
app.include_router(agent.router)
app.include_router(backlog.router)
app.include_router(deal_approvals.router)


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "Delivery Excellence API"}
