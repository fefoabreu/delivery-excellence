"""
Seed eval data:
  1. Set action_taken on 6 of the 8 pending approval deal profiles.
  2. Create DealProfile records for 10 delivery project contracts
     with scores calibrated to correlate with their actual delivery health.
"""
import json
from datetime import datetime, timedelta
from database import SessionLocal, engine
from models.models import Base, DealProfile, Contract, DeliveryProject

Base.metadata.create_all(bind=engine)

WEIGHTS = {
    "on_strategy": 0.15, "risk_profile": 0.15, "sow_quality": 0.12,
    "delivery_success": 0.10, "estimation_accuracy": 0.10, "compliance": 0.08,
    "ip_leverage": 0.08, "vendor_participation": 0.07, "azure_consumption": 0.07, "sold_margin": 0.08,
}

def weighted_score(bd: dict) -> float:
    return sum(bd.get(k, 5.0) * w for k, w in WEIGHTS.items())

def run():
    db = SessionLocal()

    # ── 1. Set action_taken on existing approval deal profiles ─────────────
    # Map: contract name fragment → (action, action_by, notes, days_ago)
    ACTIONS = {
        "Fourth Coffee": (
            "approved",
            "Elena Fontaine — VP Professional Services",
            "Strong new-logo deal with clear ACR upside. Conditions met at submission. Approved.",
            5,
        ),
        "A. Datum Corporation": (
            "approved",
            "Katrina Rhodes — Americas Leader",
            "Enterprise security play with solid delivery track record. Standard terms. Approved.",
            4,
        ),
        "Contoso Hotels": (
            "conditionally_approved",  # AI said APPROVE, human was more strict
            "Elena Fontaine — VP Professional Services",
            "Approved with condition: require hypercare plan and exec sponsor EBR within 30 days.",
            3,
        ),
        "Alpine Insurance": (
            "approved",
            "Katrina Rhodes — Americas Leader",
            "Clean deal, standard compliance framework, strong margin. Approved at Tier 2.",
            6,
        ),
        "Contoso Financial": (
            "approved",  # AI said APPROVE_WITH_CONDITIONS, human was more lenient
            "Elena Fontaine — VP Professional Services",
            "Conditions reviewed and waived. Finance confirmed volume discount. Approved clean.",
            2,
        ),
        "Northwind Traders": (
            "conditionally_approved",
            "Elena Fontaine — VP Professional Services",
            "Approved subject to confirming phased rollout plan and governance steering committee.",
            7,
        ),
        # Northwind Healthcare and Consolidated Messenger left as pending (no action)
    }

    profiles = (
        db.query(DealProfile, Contract)
        .join(Contract, Contract.id == DealProfile.contract_id)
        .all()
    )

    updated = 0
    for p, c in profiles:
        for name_fragment, (action, by, notes, days_ago) in ACTIONS.items():
            if name_fragment in c.name and p.action_taken is None:
                p.action_taken  = action
                p.action_by     = by
                p.action_notes  = notes
                p.action_date   = datetime.utcnow() - timedelta(days=days_ago)
                updated += 1
                break

    db.commit()
    print(f"  ✓ Updated action_taken on {updated} deal profiles")

    # ── 2. Add DealProfiles to delivery project contracts ─────────────────
    # Scores calibrated to correlate with actual delivery health:
    #   GREEN projects → scores 75–90  (validates the model)
    #   AMBER projects → scores 60–75  (model flagged conditions, delivered with friction)
    #   RED   projects → scores 50–63  (model recommended review, delivery confirmed risk)
    # Blue Yonder is an intentional anomaly: high score but AMBER delivery (interesting divergence).

    DELIVERY_PROFILES = [
        dict(
            project_name="Adatum Cloud Foundation",
            # AMBER health — model correctly flagged conditions
            breakdown=dict(on_strategy=8.5, risk_profile=5.0, sow_quality=7.0,
                           delivery_success=7.5, estimation_accuracy=6.5, compliance=8.5,
                           ip_leverage=8.0, vendor_participation=6.5, azure_consumption=9.0,
                           sold_margin=8.0),
            strategy_pillars=["cloud_adoption"], solution_complexity="high",
            sold_margin_pct=29.0, delivery_success_rate=78.0,
            ai_status="APPROVE_WITH_CONDITIONS",
            ai_conditions=["Resolve ExpressRoute procurement risk before execution phase",
                           "Confirm Azure migration factory resourcing"],
            action="conditionally_approved", action_by="Elena Fontaine — VP Professional Services",
        ),
        dict(
            project_name="Proseware SOC Modernization",
            # GREEN health — high score, clean delivery
            breakdown=dict(on_strategy=9.5, risk_profile=8.0, sow_quality=9.0,
                           delivery_success=9.0, estimation_accuracy=8.5, compliance=9.5,
                           ip_leverage=8.5, vendor_participation=9.0, azure_consumption=8.0,
                           sold_margin=8.8),
            strategy_pillars=["security"], solution_complexity="medium",
            sold_margin_pct=34.0, delivery_success_rate=95.0,
            ai_status="APPROVE", ai_conditions=[],
            action="approved", action_by="Katrina Rhodes — Americas Leader",
        ),
        dict(
            project_name="Southridge D365 F&O Transformation",
            # GREEN health — solid Dynamics deal
            breakdown=dict(on_strategy=8.5, risk_profile=7.5, sow_quality=8.5,
                           delivery_success=8.0, estimation_accuracy=8.0, compliance=8.5,
                           ip_leverage=8.0, vendor_participation=8.5, azure_consumption=7.0,
                           sold_margin=8.5),
            strategy_pillars=["dynamics"], solution_complexity="medium",
            sold_margin_pct=32.0, delivery_success_rate=88.0,
            ai_status="APPROVE", ai_conditions=[],
            action="approved", action_by="Katrina Rhodes — Americas Leader",
        ),
        dict(
            project_name="Blue Yonder Microsoft Fabric Platform",
            # AMBER health — intentional anomaly: high score but delivery friction
            # Represents: external dependency (client data team capacity) not captured in deal scoring
            breakdown=dict(on_strategy=9.0, risk_profile=7.5, sow_quality=8.5,
                           delivery_success=8.5, estimation_accuracy=7.5, compliance=9.0,
                           ip_leverage=8.0, vendor_participation=8.5, azure_consumption=9.0,
                           sold_margin=8.0),
            strategy_pillars=["data_analytics"], solution_complexity="high",
            sold_margin_pct=31.0, delivery_success_rate=85.0,
            ai_status="APPROVE", ai_conditions=[],
            action="approved", action_by="Elena Fontaine — VP Professional Services",
        ),
        dict(
            project_name="Wingtip Toys Cloud Native Modernization",
            # RED health — model correctly flagged for review, delivery confirmed risk
            breakdown=dict(on_strategy=7.0, risk_profile=4.0, sow_quality=5.5,
                           delivery_success=5.5, estimation_accuracy=5.0, compliance=7.0,
                           ip_leverage=5.5, vendor_participation=6.0, azure_consumption=6.0,
                           sold_margin=6.5),
            strategy_pillars=["cloud_adoption"], solution_complexity="high",
            sold_margin_pct=24.0, delivery_success_rate=62.0,
            ai_status="RECOMMEND_REVIEW",
            ai_conditions=["Scope definition incomplete — refactor vs. re-platform decision outstanding",
                           "No reference projects for this client segment at this scale",
                           "Margin below threshold for deal complexity"],
            action="in_review", action_by="Elena Fontaine — VP Professional Services",
        ),
        dict(
            project_name="City Power & Light SOC Modernization",
            # GREEN health
            breakdown=dict(on_strategy=9.0, risk_profile=8.5, sow_quality=9.0,
                           delivery_success=9.0, estimation_accuracy=8.5, compliance=9.5,
                           ip_leverage=8.5, vendor_participation=9.0, azure_consumption=8.5,
                           sold_margin=9.0),
            strategy_pillars=["security"], solution_complexity="medium",
            sold_margin_pct=35.0, delivery_success_rate=92.0,
            ai_status="APPROVE", ai_conditions=[],
            action="approved", action_by="Katrina Rhodes — Americas Leader",
        ),
        dict(
            project_name="Datum Corp AI Innovation Platform",
            # GREEN health — strong AI/agentic deal
            breakdown=dict(on_strategy=9.5, risk_profile=8.0, sow_quality=9.0,
                           delivery_success=8.5, estimation_accuracy=8.5, compliance=9.0,
                           ip_leverage=9.0, vendor_participation=9.0, azure_consumption=9.5,
                           sold_margin=8.8),
            strategy_pillars=["ai_agentic"], solution_complexity="high",
            sold_margin_pct=33.0, delivery_success_rate=90.0,
            ai_status="APPROVE", ai_conditions=[],
            action="approved", action_by="Elena Fontaine — VP Professional Services",
        ),
        dict(
            project_name="Lucerne Publishing Zero Trust",
            # AMBER health — model flagged conditions, delivery reflects friction
            breakdown=dict(on_strategy=8.0, risk_profile=5.5, sow_quality=7.0,
                           delivery_success=7.0, estimation_accuracy=6.5, compliance=8.0,
                           ip_leverage=7.0, vendor_participation=7.0, azure_consumption=7.5,
                           sold_margin=7.5),
            strategy_pillars=["security"], solution_complexity="medium",
            sold_margin_pct=29.0, delivery_success_rate=76.0,
            ai_status="APPROVE_WITH_CONDITIONS",
            ai_conditions=["Client change-freeze window conflicts with Phase 2 rollout timeline",
                           "Zero Trust identity scope needs refinement with client IT"],
            action="conditionally_approved", action_by="Katrina Rhodes — Americas Leader",
        ),
        dict(
            project_name="Margie's Travel Copilot Deployment",
            # AMBER health — conditions met but delivery slower than forecast
            breakdown=dict(on_strategy=8.0, risk_profile=6.0, sow_quality=7.5,
                           delivery_success=7.0, estimation_accuracy=6.5, compliance=8.5,
                           ip_leverage=7.5, vendor_participation=7.5, azure_consumption=7.5,
                           sold_margin=7.8),
            strategy_pillars=["ai_agentic"], solution_complexity="medium",
            sold_margin_pct=30.0, delivery_success_rate=78.0,
            ai_status="APPROVE_WITH_CONDITIONS",
            ai_conditions=["Client AI readiness assessment required before Phase 2 unlock"],
            action="conditionally_approved", action_by="Katrina Rhodes — Americas Leader",
        ),
        dict(
            project_name="Contoso Sports D365 CE",
            # RED health — low score, delivery confirmed issues
            breakdown=dict(on_strategy=6.5, risk_profile=4.5, sow_quality=6.0,
                           delivery_success=5.5, estimation_accuracy=5.5, compliance=7.5,
                           ip_leverage=6.0, vendor_participation=6.0, azure_consumption=6.5,
                           sold_margin=6.5),
            strategy_pillars=["dynamics"], solution_complexity="high",
            sold_margin_pct=26.0, delivery_success_rate=65.0,
            ai_status="RECOMMEND_REVIEW",
            ai_conditions=["D365 CE scope spans 3 business units with conflicting requirements",
                           "Client governance structure unclear — no single exec sponsor confirmed",
                           "Prior Dynamics engagement had scope overrun of 22%"],
            action="in_review", action_by="Elena Fontaine — VP Professional Services",
        ),
    ]

    created = 0
    for entry in DELIVERY_PROFILES:
        # Find the delivery project and its contract
        dp = db.query(DeliveryProject).filter(DeliveryProject.name == entry["project_name"]).first()
        if not dp:
            print(f"  ⚠ Project not found: {entry['project_name']}")
            continue

        # Skip if deal profile already exists for this contract
        existing = db.query(DealProfile).filter(DealProfile.contract_id == dp.contract_id).first()
        if existing:
            print(f"  – Profile already exists for: {entry['project_name']}")
            continue

        bd = entry["breakdown"]
        score = weighted_score(bd) * 10

        tier = 3
        if score >= 75: tier = 2
        if score >= 85: tier = 1

        profile = DealProfile(
            contract_id=dp.contract_id,
            strategy_pillars=json.dumps(entry["strategy_pillars"]),
            internal_investment_pct=10.0,
            sold_margin_pct=entry["sold_margin_pct"],
            solution_complexity=entry["solution_complexity"],
            vendor_name=None,
            vendor_participation_pct=0.0,
            similar_projects_count=5,
            delivery_success_rate=entry["delivery_success_rate"],
            reference_projects=json.dumps([]),
            playbook_available=True,
            sow_template_used=True,
            ip_leverage_score=bd.get("ip_leverage", 7.0),
            regulatory_requirements=json.dumps([]),
            compliance_risk="low",
            azure_consumption_monthly=50000.0,
            azure_acr_percentage=15.0,
            expansion_type="whitespace",
            is_delivery_led=True,
            score_breakdown=json.dumps(bd),
            deal_score=round(score, 1),
            approval_tier=tier,
            ai_recommendation_status=entry["ai_status"],
            ai_recommendation_text=f"AI evaluation based on deal profile analysis. Status: {entry['ai_status']}.",
            ai_conditions=json.dumps(entry["ai_conditions"]),
            action_taken=entry["action"],
            action_by=entry["action_by"],
            action_notes="Approved as part of original deal qualification prior to delivery.",
            action_date=datetime.utcnow() - timedelta(days=90),
        )
        db.add(profile)
        created += 1

    db.commit()
    print(f"  ✓ Created {created} new deal profiles linked to delivery projects")
    db.close()

if __name__ == "__main__":
    print("Seeding eval data...")
    run()
    print("Done.")
