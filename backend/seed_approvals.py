"""Seed 8 contracts in pending_approval status with full DealProfile scoring."""
import json, uuid
from datetime import datetime, date, timedelta
from database import SessionLocal, engine
from models.models import Base, Opportunity, Contract, ContractServiceLine, ServiceCatalog, DealProfile

Base.metadata.create_all(bind=engine)

def new_id(): return str(uuid.uuid4())

today = date.today()

# ── Scoring weights ──────────────────────────────────────────────────────────
WEIGHTS = {
    "on_strategy":          0.15,
    "risk_profile":         0.15,
    "sow_quality":          0.12,
    "delivery_success":     0.10,
    "estimation_accuracy":  0.10,
    "compliance":           0.08,
    "ip_leverage":          0.08,
    "vendor_participation": 0.07,
    "azure_consumption":    0.07,
    "sold_margin":          0.08,
}

def weighted_score(breakdown: dict) -> float:
    return sum(breakdown.get(k, 5.0) * w for k, w in WEIGHTS.items())

# ── Deal definitions ─────────────────────────────────────────────────────────
DEALS = [
    # ── 1. Fourth Coffee – Azure DC Exit ─────────────────────────────────────
    dict(
        opp_name="Fourth Coffee - Azure DC Exit",
        contract_name="Fourth Coffee Corp — Azure Data Center Exit Program",
        client="Fourth Coffee Corporation",
        scope=("Full data-center exit to Azure for 210 workloads across Americas and EMEA. "
               "Program includes Azure Landing Zone design, migration factory (Lift-Shift + "
               "refactor tiers), cloud governance, FinOps, and 12-month hypercare. "
               "Avanade subcontracts migration factory execution (20% of effort)."),
        svc_lines=[("Cloud Adoption Foundation", 120), ("Azure Migration - Lift & Shift", 180),
                   ("Cloud Native Modernization", 60), ("FinOps & Cost Optimization", 40)],
        start_offset=14, duration_months=18,
        profile=dict(
            strategy_pillars=["cloud_adoption", "finops"],
            internal_investment_pct=15.0,
            sold_margin_pct=28.0,
            solution_complexity="high",
            vendor_name="Avanade",
            vendor_participation_pct=20.0,
            similar_projects_count=4,
            delivery_success_rate=88.0,
            reference_projects=["Adatum Cloud Foundation", "Proseware SOC Modernization"],
            playbook_available=True,
            sow_template_used=True,
            ip_leverage_score=9.0,
            regulatory_requirements=[],
            compliance_risk="low",
            azure_consumption_monthly=185000,
            azure_acr_percentage=42,
            expansion_type="new_logo",
            is_delivery_led=False,
            breakdown=dict(on_strategy=9.0, risk_profile=5.5, sow_quality=8.5,
                           delivery_success=8.8, estimation_accuracy=7.5, compliance=9.0,
                           ip_leverage=9.0, vendor_participation=7.5, azure_consumption=10.0,
                           sold_margin=9.3),
            ai_status="APPROVE",
            ai_text=("Strong strategic alignment with cloud-first mandate. New logo with substantial "
                     "ACR upside ($185K/month). SOW is comprehensive with tiered workload inventory "
                     "across Lift-Shift, Refactor, and Greenfield tracks. Avanade partnership (20%) "
                     "provides migration factory scale without diluting our governance lead. Margin at "
                     "28% is acceptable given deal volume—confirm commercial desk has applied correct "
                     "volume tier discounting. Approved for Tier 3 Executive signature."),
            ai_conditions=["Confirm volume-tier discount approval from Finance",
                           "Attach Avanade subcontract SOW before countersigning",
                           "Executive Sponsor EBR scheduled within 30 days of kickoff"],
        ),
    ),

    # ── 2. A. Datum – Enterprise Security ────────────────────────────────────
    dict(
        opp_name="A. Datum Security Overhaul",
        contract_name="A. Datum Corporation — Enterprise Zero Trust & SOC Transformation",
        client="A. Datum Corporation",
        scope=("Board-mandated enterprise security transformation covering Zero Trust architecture "
               "(Entra ID, Conditional Access, ZTNA), Microsoft Sentinel SIEM with 45+ data "
               "connectors and SOAR automation, and Defender XDR across 6,500 seats. Includes "
               "Responsible AI guardrails for AI-assisted SOC playbooks."),
        svc_lines=[("Zero Trust Assessment", 1), ("Microsoft Sentinel SIEM Deployment", 140),
                   ("Microsoft Defender XDR", 100), ("Identity & Access Management", 80)],
        start_offset=21, duration_months=10,
        profile=dict(
            strategy_pillars=["security", "zero_trust", "ai"],
            internal_investment_pct=10.0,
            sold_margin_pct=35.0,
            solution_complexity="medium",
            vendor_name=None,
            vendor_participation_pct=0.0,
            similar_projects_count=5,
            delivery_success_rate=92.0,
            reference_projects=["Proseware SOC Modernization", "City Power & Light SOC Modernization"],
            playbook_available=True,
            sow_template_used=True,
            ip_leverage_score=9.5,
            regulatory_requirements=[],
            compliance_risk="low",
            azure_consumption_monthly=28000,
            azure_acr_percentage=18,
            expansion_type="new_logo",
            is_delivery_led=False,
            breakdown=dict(on_strategy=9.5, risk_profile=7.5, sow_quality=9.0,
                           delivery_success=9.2, estimation_accuracy=8.5, compliance=9.0,
                           ip_leverage=9.5, vendor_participation=8.0, azure_consumption=8.0,
                           sold_margin=10.0),
            ai_status="APPROVE",
            ai_text=("Highest recommendation. Board-mandated security transformation with clear scope, "
                     "zero vendor dilution, and the strongest IP leverage in our security portfolio — "
                     "Sentinel and Zero Trust playbooks both apply directly. Delivery success rate of "
                     "92% across five comparable engagements (Proseware, City Power) provides strong "
                     "confidence. 35% margin is excellent. New logo with strategic account potential "
                     "across A. Datum's parent group (12 subsidiaries). Approved without conditions."),
            ai_conditions=[],
        ),
    ),

    # ── 3. Contoso Hotels – AI Guest Experience ───────────────────────────────
    dict(
        opp_name="Contoso Hotels AI Guest Experience",
        contract_name="Contoso Hotels & Resorts — AI Guest Experience Platform",
        client="Contoso Hotels & Resorts",
        scope=("Design and build a multi-property AI guest experience platform on Azure AI Studio. "
               "Custom agents: personalized booking recommendation agent, in-stay concierge agent, "
               "and loyalty prediction model. Deployed across 240 properties in 18 countries. "
               "Includes Responsible AI governance framework and Azure OpenAI private endpoint "
               "architecture. 20% company investment (IOI) committed."),
        svc_lines=[("Azure AI Studio - Custom Agent", 220), ("Agentic Workflow Automation", 80),
                   ("AI Governance & Responsible AI", 50), ("Microsoft Copilot Deployment", 1500)],
        start_offset=30, duration_months=12,
        profile=dict(
            strategy_pillars=["ai_agentic", "cloud_adoption"],
            internal_investment_pct=20.0,
            sold_margin_pct=34.0,
            solution_complexity="high",
            vendor_name=None,
            vendor_participation_pct=0.0,
            similar_projects_count=2,
            delivery_success_rate=85.0,
            reference_projects=["VanArsdel Copilot & AI Platform", "Datum Corp AI Innovation Platform"],
            playbook_available=True,
            sow_template_used=True,
            ip_leverage_score=8.5,
            regulatory_requirements=["GDPR"],
            compliance_risk="medium",
            azure_consumption_monthly=78000,
            azure_acr_percentage=35,
            expansion_type="new_logo",
            is_delivery_led=False,
            breakdown=dict(on_strategy=10.0, risk_profile=5.5, sow_quality=8.5,
                           delivery_success=8.5, estimation_accuracy=6.5, compliance=7.5,
                           ip_leverage=8.5, vendor_participation=8.0, azure_consumption=9.5,
                           sold_margin=10.0),
            ai_status="APPROVE",
            ai_text=("Flagship AI deal — highest strategic priority in the FY pipeline. 20% company "
                     "investment signals internal commitment and materially de-risks the commercial "
                     "proposition. Azure OpenAI ACR of $78K/month is a landmark ACR anchor. AI "
                     "delivery playbook and Responsible AI framework are directly applicable "
                     "(VanArsdel reference). Primary caution: AI estimate accuracy is inherently "
                     "lower than traditional services — phased milestones with AI performance "
                     "acceptance criteria are essential. GDPR data residency architecture must be "
                     "confirmed per EU property footprint. Approved — recommend 90-day project "
                     "health check cadence given scale."),
            ai_conditions=["Phase milestones must include AI model acceptance criteria with measurable thresholds",
                           "GDPR data residency review by Privacy Counsel before kickoff",
                           "90-day AI performance health check cadence established in governance plan"],
        ),
    ),

    # ── 4. Alpine Insurance – Zero Trust ─────────────────────────────────────
    dict(
        opp_name="Alpine Security Transformation",
        contract_name="Alpine Insurance Group — Zero Trust Architecture & Identity Modernization",
        client="Alpine Insurance Group",
        scope=("Zero Trust implementation for a 3,200-seat insurance firm. Covers Entra ID "
               "modernization with PIM and identity governance, Intune device management, "
               "Defender for Endpoint, and Microsoft Sentinel with Solvency II compliance "
               "analytics pack. All delivered by Microsoft Professional Services — no vendor."),
        svc_lines=[("Zero Trust Assessment", 1), ("Identity & Access Management", 90),
                   ("Microsoft Defender XDR", 60), ("Microsoft Sentinel SIEM Deployment", 80)],
        start_offset=7, duration_months=9,
        profile=dict(
            strategy_pillars=["security", "zero_trust"],
            internal_investment_pct=0.0,
            sold_margin_pct=38.0,
            solution_complexity="medium",
            vendor_name=None,
            vendor_participation_pct=0.0,
            similar_projects_count=6,
            delivery_success_rate=91.0,
            reference_projects=["Proseware SOC Modernization", "City Power & Light SOC Modernization", "Lamna Healthcare Azure & Security Foundation"],
            playbook_available=True,
            sow_template_used=True,
            ip_leverage_score=9.0,
            regulatory_requirements=["Solvency II", "GDPR"],
            compliance_risk="medium",
            azure_consumption_monthly=9500,
            azure_acr_percentage=12,
            expansion_type="whitespace",
            is_delivery_led=False,
            breakdown=dict(on_strategy=9.0, risk_profile=7.5, sow_quality=8.8,
                           delivery_success=9.1, estimation_accuracy=8.5, compliance=6.0,
                           ip_leverage=9.0, vendor_participation=8.0, azure_consumption=6.5,
                           sold_margin=10.0),
            ai_status="APPROVE",
            ai_text=("Clean, well-scoped deal. 38% margin is among the best in the current pending "
                     "portfolio. Six comparable security engagements with 91% delivery success rate "
                     "provide strong execution confidence. Zero Trust and Solvency II compliance "
                     "analytics pack are proven IP assets. The Solvency II and GDPR regulatory "
                     "overlay is manageable — Lamna Healthcare HIPAA reference demonstrates our "
                     "regulated-industry delivery capability. No vendor dilution. Recommended for "
                     "Tier 2 Manager approval — does not require Executive Committee."),
            ai_conditions=["Solvency II analytics compliance scope to be confirmed with client's Risk & Compliance team pre-kickoff"],
        ),
    ),

    # ── 5. Contoso Bank – Cloud Migration ────────────────────────────────────
    dict(
        opp_name="Contoso Bank Cloud Migration",
        contract_name="Contoso Financial Group — Azure Cloud Migration (Phase 1: Core Banking)",
        client="Contoso Financial Group",
        scope=("Azure migration of 120 on-premises workloads for a mid-tier commercial bank. "
               "Phase 1 covers core banking (40 workloads: Lift-Shift), landing zone with "
               "FFIEC-compliant security baseline, and network architecture (ExpressRoute + "
               "hybrid DNS). Eviden subcontracts migration execution (15% of effort). "
               "Zero Trust overlay included. Phase 2 (80 workloads) separate SOW."),
        svc_lines=[("Cloud Adoption Foundation", 80), ("Azure Migration - Lift & Shift", 120),
                   ("Azure Networking & Connectivity", 40), ("Identity & Access Management", 30)],
        start_offset=28, duration_months=12,
        profile=dict(
            strategy_pillars=["cloud_adoption", "security"],
            internal_investment_pct=5.0,
            sold_margin_pct=26.0,
            solution_complexity="high",
            vendor_name="Eviden",
            vendor_participation_pct=15.0,
            similar_projects_count=4,
            delivery_success_rate=83.0,
            reference_projects=["Adatum Cloud Foundation", "Wingtip Toys Cloud Native Modernization"],
            playbook_available=True,
            sow_template_used=True,
            ip_leverage_score=8.0,
            regulatory_requirements=["FFIEC", "OCC"],
            compliance_risk="high",
            azure_consumption_monthly=96000,
            azure_acr_percentage=52,
            expansion_type="expansion",
            is_delivery_led=False,
            breakdown=dict(on_strategy=9.0, risk_profile=5.0, sow_quality=7.5,
                           delivery_success=8.3, estimation_accuracy=7.0, compliance=5.0,
                           ip_leverage=8.0, vendor_participation=7.5, azure_consumption=9.5,
                           sold_margin=8.7),
            ai_status="APPROVE_WITH_CONDITIONS",
            ai_text=("Strategically sound cloud migration with excellent ACR outcome ($96K/month). "
                     "Delivery success rate on comparable migrations is acceptable at 83%. Primary "
                     "concern is the regulatory overlay — FFIEC and OCC requirements add compliance "
                     "delivery risk that is not fully reflected in the current estimate. Margin at "
                     "26% is tight for a high-complexity, regulated engagement with vendor "
                     "participation. Two conditions must be met before countersigning: (1) confirm "
                     "FFIEC compliance review is complete, and (2) validate that Eviden's SOW "
                     "explicitly covers regulatory-aware configuration standards. Phase 2 SOW "
                     "should apply lessons learned from Phase 1 delivery to improve margin."),
            ai_conditions=["Attach FFIEC compliance review sign-off to contract file",
                           "Eviden subcontract must include regulatory compliance obligations",
                           "Margin improvement target of +2 pts set for Phase 2 SOW"],
        ),
    ),

    # ── 6. Northwind D365 F&O ────────────────────────────────────────────────
    dict(
        opp_name="Northwind Dynamics 365 F&O",
        contract_name="Northwind Traders — Dynamics 365 Finance & Operations (SAP ECC Replacement)",
        client="Northwind Traders",
        scope=("Full D365 Finance & Operations implementation replacing SAP ECC across Finance, "
               "Supply Chain, and Warehouse Management. 18-month program in 3 phases. Includes "
               "full data migration from SAP, integration with 4 external systems, and 250-user "
               "training program. All delivered by Microsoft Professional Services."),
        svc_lines=[("Dynamics 365 Finance & Operations", 300), ("Dynamics Integration Architecture", 80),
                   ("Dynamics Data Migration", 100), ("Power Platform Center of Excellence", 30)],
        start_offset=35, duration_months=18,
        profile=dict(
            strategy_pillars=["dynamics"],
            internal_investment_pct=0.0,
            sold_margin_pct=32.0,
            solution_complexity="high",
            vendor_name=None,
            vendor_participation_pct=0.0,
            similar_projects_count=5,
            delivery_success_rate=86.0,
            reference_projects=["Trey Research D365 Sales & CS", "Southridge D365 F&O Transformation"],
            playbook_available=True,
            sow_template_used=True,
            ip_leverage_score=8.5,
            regulatory_requirements=[],
            compliance_risk="low",
            azure_consumption_monthly=14000,
            azure_acr_percentage=6,
            expansion_type="expansion",
            is_delivery_led=False,
            breakdown=dict(on_strategy=7.5, risk_profile=5.5, sow_quality=8.0,
                           delivery_success=8.6, estimation_accuracy=8.5, compliance=9.0,
                           ip_leverage=8.5, vendor_participation=8.0, azure_consumption=5.5,
                           sold_margin=10.0),
            ai_status="APPROVE_WITH_CONDITIONS",
            ai_text=("D365 F&O delivery track record is strong and estimate accuracy is high "
                     "(well-defined service catalog). SAP ECC replacement at this scale, however, "
                     "carries inherent risk — integration complexity and data migration fidelity "
                     "are the primary execution risks. Azure consumption is low ($14K/month), "
                     "which is a gap for FY ACR targets. 32% margin is healthy. Condition: "
                     "Obtain a signed data migration scope confirmation from client's SAP team "
                     "before Phase 1 kickoff. Integration architecture assumptions must be "
                     "client-acknowledged in writing. Approved with conditions — Southridge "
                     "D365 delivery lead to be consulted as subject matter advisor."),
            ai_conditions=["Client-signed data migration scope confirmation required before Phase 1 kickoff",
                           "SAP integration assumptions to be accepted in writing by client IT Director",
                           "Southridge D365 delivery lead engaged as SME advisor"],
        ),
    ),

    # ── 7. Northwind Healthcare – HIPAA ──────────────────────────────────────
    dict(
        opp_name="Northwind Healthcare HIPAA Compliance",
        contract_name="Northwind Healthcare System — HIPAA Compliance & Security Platform",
        client="Northwind Healthcare System",
        scope=("Comprehensive HIPAA/HITECH compliance program for an 8-hospital system across "
               "APAC. Microsoft Purview for PHI classification and data governance, Microsoft "
               "Sentinel SIEM with HIPAA analytics ruleset, and Entra ID modernization with "
               "clinical workforce identity governance. Business Associate Agreement (BAA) "
               "in place. 8% company co-investment committed (healthcare vertical priority)."),
        svc_lines=[("Compliance & Purview Implementation", 100), ("Microsoft Sentinel SIEM Deployment", 120),
                   ("Identity & Access Management", 60), ("Data Governance with Purview", 40)],
        start_offset=42, duration_months=11,
        profile=dict(
            strategy_pillars=["security", "compliance", "data_analytics"],
            internal_investment_pct=8.0,
            sold_margin_pct=31.0,
            solution_complexity="high",
            vendor_name=None,
            vendor_participation_pct=0.0,
            similar_projects_count=3,
            delivery_success_rate=89.0,
            reference_projects=["Lamna Healthcare Azure & Security Foundation", "Proseware SOC Modernization"],
            playbook_available=True,
            sow_template_used=True,
            ip_leverage_score=8.0,
            regulatory_requirements=["HIPAA", "HITECH"],
            compliance_risk="high",
            azure_consumption_monthly=31000,
            azure_acr_percentage=21,
            expansion_type="new_logo",
            is_delivery_led=False,
            breakdown=dict(on_strategy=8.5, risk_profile=5.0, sow_quality=8.0,
                           delivery_success=8.9, estimation_accuracy=8.0, compliance=5.0,
                           ip_leverage=8.0, vendor_participation=8.0, azure_consumption=7.5,
                           sold_margin=10.0),
            ai_status="APPROVE_WITH_CONDITIONS",
            ai_text=("Strategic healthcare deal with strong delivery confidence — Lamna Healthcare "
                     "(9.2/10 CSAT) is a directly comparable engagement. 8% company co-investment "
                     "signals vertical priority alignment. New logo with good ACR ($31K/month). "
                     "HIPAA and HITECH regulatory requirements are the primary complexity driver. "
                     "Two non-negotiable conditions: (1) a Business Associate Agreement (BAA) "
                     "must be countersigned before project kickoff — not before contract signature, "
                     "but before any PHI is accessed; (2) Purview PHI classification scope must be "
                     "reviewed by Northwind's Privacy Counsel. 31% margin is solid. Recommend "
                     "Lamna Healthcare PM (Sarah Mitchell) as delivery lead."),
            ai_conditions=["Business Associate Agreement (BAA) countersigned before Day 1 data access",
                           "PHI classification scope reviewed and signed by client Privacy Counsel",
                           "Recommend Sarah Mitchell (Lamna Healthcare PM) as delivery lead"],
        ),
    ),

    # ── 8. Consolidated Messenger D365 F&O ───────────────────────────────────
    dict(
        opp_name="Consolidated Messenger D365 F&O",
        contract_name="Consolidated Messenger — D365 F&O Multi-Country ERP Transformation",
        client="Consolidated Messenger",
        scope=("D365 Finance & Operations rollout across 14 countries replacing a fragmented "
               "SAP landscape. Program covers Finance (GL, AP/AR, Fixed Assets), Logistics "
               "(Warehouse, Transportation), and HR (14 local payroll integrations). "
               "Regional SI partner (30% of effort) covers local regulatory configuration "
               "per country. 28-month program across 4 geographic waves."),
        svc_lines=[("Dynamics 365 Finance & Operations", 400), ("Dynamics Integration Architecture", 120),
                   ("Dynamics Data Migration", 150), ("Power Platform Center of Excellence", 50)],
        start_offset=56, duration_months=28,
        profile=dict(
            strategy_pillars=["dynamics"],
            internal_investment_pct=0.0,
            sold_margin_pct=22.0,
            solution_complexity="high",
            vendor_name="Regional SI Partner",
            vendor_participation_pct=30.0,
            similar_projects_count=2,
            delivery_success_rate=70.0,
            reference_projects=["Northwind Traders D365 F&O (in progress)"],
            playbook_available=True,
            sow_template_used=False,
            ip_leverage_score=6.0,
            regulatory_requirements=["GDPR", "Local Payroll (14 jurisdictions)"],
            compliance_risk="high",
            azure_consumption_monthly=19000,
            azure_acr_percentage=5,
            expansion_type="new_logo",
            is_delivery_led=False,
            breakdown=dict(on_strategy=7.0, risk_profile=3.5, sow_quality=6.5,
                           delivery_success=7.0, estimation_accuracy=5.0, compliance=4.5,
                           ip_leverage=6.0, vendor_participation=6.0, azure_consumption=5.5,
                           sold_margin=7.3),
            ai_status="RECOMMEND_REVIEW",
            ai_text=("This deal requires Architecture Review Board sign-off before approval. "
                     "Multi-country D365 F&O at this scale (14 entities, 4 waves, 28 months) "
                     "carries the highest execution risk in the current pending portfolio. "
                     "Estimate accuracy is low — 14-country local payroll integration variance "
                     "alone could materially shift effort. At 22% margin with 30% vendor "
                     "participation, there is limited buffer for overruns. Our comparable "
                     "delivery success rate at this complexity level is 70% — below the 80% "
                     "threshold for standard approval. The SOW does not include country-level "
                     "scope phasing or penalty/remediation terms. Not recommended for approval "
                     "in current state. Required actions before resubmission: (1) revised SOW "
                     "with country-level phase plans and explicit out-of-scope definition per "
                     "jurisdiction, (2) Architecture Review Board assessment, (3) vendor SLA "
                     "confirmation, (4) margin floor review with Finance."),
            ai_conditions=["Revised SOW required: country-level phase plans and out-of-scope per jurisdiction",
                           "Architecture Review Board (ARB) assessment required before resubmission",
                           "Vendor SLA and indemnity terms must be included in subcontract",
                           "Finance review: margin floor analysis and overrun contingency plan",
                           "Delivery leader approval required confirming resource availability for 28-month program"],
        ),
    ),
]


def compute_score(breakdown: dict) -> float:
    return round(sum(breakdown.get(k, 5.0) * w * 10 for k, w in WEIGHTS.items()), 1)


def assign_tier(total_value: float, complexity: str, score: float) -> int:
    if total_value <= 500_000 and score >= 75 and complexity == "low":
        return 1
    if total_value <= 10_000_000 and score >= 65 and complexity in ("low", "medium"):
        return 2
    return 3


def seed_approvals():
    db = SessionLocal()
    try:
        # Check if already seeded
        existing = db.query(DealProfile).count()
        if existing >= 8:
            print("Deal approval profiles already seeded.")
            return

        svcs = {s.name: s for s in db.query(ServiceCatalog).all()}
        opps = {o.name: o for o in db.query(Opportunity).all()}
        count = db.query(Contract).count()

        for i, deal in enumerate(DEALS):
            opp = opps.get(deal["opp_name"])
            if not opp:
                print(f"  ⚠ Opportunity not found: {deal['opp_name']}")
                continue

            count += 1
            c = Contract(
                id=new_id(),
                opportunity_id=opp.id,
                contract_number=f"CON-2026-{str(count).zfill(4)}",
                name=deal["contract_name"],
                client_name=deal["client"],
                status="pending_approval",
                approval_status="pending",
                scope_summary=deal["scope"],
                start_date=today + timedelta(days=deal["start_offset"]),
                end_date=today + timedelta(days=deal["start_offset"] + deal["duration_months"] * 30),
                created_by="Pre-Sales Team",
            )
            db.add(c)
            db.flush()

            total = 0.0
            for svc_name, qty in deal["svc_lines"]:
                svc = svcs.get(svc_name)
                if svc:
                    lt = (svc.list_price or 0) * qty
                    db.add(ContractServiceLine(
                        id=new_id(), contract_id=c.id, service_id=svc.id,
                        service_name=svc.name, category=svc.category,
                        quantity=qty, unit=svc.unit, unit_price=svc.list_price,
                        discount_pct=0, total=lt,
                    ))
                    total += lt
            c.total_value = total

            p = deal["profile"]
            breakdown = p["breakdown"]
            deal_score = compute_score(breakdown)
            tier = assign_tier(total, p["solution_complexity"], deal_score)

            dp = DealProfile(
                id=new_id(),
                contract_id=c.id,
                strategy_pillars=json.dumps(p["strategy_pillars"]),
                internal_investment_pct=p["internal_investment_pct"],
                sold_margin_pct=p["sold_margin_pct"],
                solution_complexity=p["solution_complexity"],
                vendor_name=p.get("vendor_name"),
                vendor_participation_pct=p["vendor_participation_pct"],
                similar_projects_count=p["similar_projects_count"],
                delivery_success_rate=p["delivery_success_rate"],
                reference_projects=json.dumps(p.get("reference_projects", [])),
                playbook_available=p["playbook_available"],
                sow_template_used=p["sow_template_used"],
                ip_leverage_score=p["ip_leverage_score"],
                regulatory_requirements=json.dumps(p["regulatory_requirements"]),
                compliance_risk=p["compliance_risk"],
                azure_consumption_monthly=p["azure_consumption_monthly"],
                azure_acr_percentage=p["azure_acr_percentage"],
                expansion_type=p["expansion_type"],
                is_delivery_led=p["is_delivery_led"],
                score_breakdown=json.dumps(breakdown),
                deal_score=deal_score,
                approval_tier=tier,
                ai_recommendation_status=p["ai_status"],
                ai_recommendation_text=p["ai_text"],
                ai_conditions=json.dumps(p["ai_conditions"]),
            )
            db.add(dp)
            print(f"  ✓ {deal['client'][:35]:35} ${total:>12,.0f}  Score:{deal_score:5.1f}  Tier:{tier}  {p['ai_status']}")

        db.commit()
        print(f"\n✓ Seeded {len(DEALS)} pending-approval contracts with deal profiles.")

    except Exception as ex:
        db.rollback()
        raise ex
    finally:
        db.close()


if __name__ == "__main__":
    seed_approvals()
