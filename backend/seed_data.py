"""Seed representative data for Delivery Excellence."""
import json
import uuid
from datetime import date, datetime, timedelta
from database import SessionLocal, engine
from models.models import (
    Base, ServiceCatalog, Opportunity, Contract, ContractServiceLine,
    Handoff, HandoffContact, DeliveryProject, Milestone, RAIDItem, StatusUpdate,
)

Base.metadata.create_all(bind=engine)

def new_id():
    return str(uuid.uuid4())

today = date.today()

def seed():
    db = SessionLocal()
    try:
        if db.query(ServiceCatalog).count() > 0:
            print("Database already seeded. Delete delivery_excellence.db to reseed.")
            return

        # ─── SERVICE CATALOG ───────────────────────────────────────────────
        services_data = [
            # Cloud Adoption
            ("Cloud Adoption Foundation", "cloud_adoption", "Cloud", "Azure Landing Zone design and implementation, governance, and foundational architecture", "day", 2800),
            ("Cloud Migration Assessment", "cloud_adoption", "Cloud", "Assess on-premises workloads and create cloud migration roadmap with TCO analysis", "fixed", 45000),
            ("Azure Migration - Lift & Shift", "cloud_adoption", "Cloud", "Rehost workloads to Azure IaaS using Azure Migrate", "day", 2400),
            ("Cloud Native Modernization", "cloud_adoption", "Cloud", "Refactor applications to cloud-native architecture using containers and PaaS", "day", 3200),
            ("FinOps & Cost Optimization", "cloud_adoption", "Cloud", "Implement Azure cost management practices, tagging strategy, and optimization", "day", 2600),
            ("Azure Networking & Connectivity", "cloud_adoption", "Cloud", "Hub-spoke network topology, ExpressRoute, and connectivity architecture", "day", 2800),
            # AI & Agentic
            ("AI Readiness Assessment", "ai_agentic", "AI", "Evaluate organizational AI maturity, data readiness, and use case prioritization", "fixed", 35000),
            ("Microsoft Copilot Deployment", "ai_agentic", "AI", "M365 Copilot enablement including adoption, governance, and prompt engineering", "user_month", 45),
            ("Azure AI Studio - Custom Agent", "ai_agentic", "AI", "Design and build custom AI agents using Azure OpenAI and AI Studio", "day", 3800),
            ("Agentic Workflow Automation", "ai_agentic", "AI", "Implement multi-agent orchestration using AutoGen or Semantic Kernel", "day", 4200),
            ("AI Governance & Responsible AI", "ai_agentic", "AI", "Implement responsible AI framework, content safety, and model monitoring", "day", 3000),
            ("Document Intelligence Solution", "ai_agentic", "AI", "Azure Document Intelligence implementation for intelligent document processing", "day", 3200),
            # Dynamics 365
            ("Dynamics 365 Sales Implementation", "dynamics", "Dynamics", "End-to-end D365 Sales deployment including configuration, migration, and training", "day", 2600),
            ("Dynamics 365 Customer Service", "dynamics", "Dynamics", "D365 Customer Service with omnichannel, case management, and knowledge base", "day", 2600),
            ("Dynamics 365 Finance & Operations", "dynamics", "Dynamics", "D365 F&O implementation for finance, supply chain, or manufacturing", "day", 3400),
            ("Power Platform Center of Excellence", "dynamics", "Dynamics", "Establish Power Platform CoE including governance, ALM, and maker enablement", "day", 2800),
            ("Dynamics Integration Architecture", "dynamics", "Dynamics", "Design and implement integrations between D365 and enterprise systems", "day", 3000),
            ("Dynamics Data Migration", "dynamics", "Dynamics", "Legacy CRM/ERP data extraction, transformation, and migration to Dynamics", "day", 2800),
            # Security
            ("Zero Trust Assessment", "security", "Security", "Evaluate current security posture against Zero Trust principles and define roadmap", "fixed", 40000),
            ("Microsoft Sentinel SIEM Deployment", "security", "Security", "Deploy and configure Microsoft Sentinel with UEBA, analytics rules, and SOAR playbooks", "day", 3200),
            ("Microsoft Defender XDR", "security", "Security", "Deploy Defender for Endpoint, Identity, Cloud Apps, and Office 365", "day", 2800),
            ("Identity & Access Management", "security", "Security", "Entra ID architecture, MFA, conditional access, PIM, and identity governance", "day", 2800),
            ("Security Operations Center (SOC)", "security", "Security", "Design and enable Microsoft-powered SOC with 24/7 monitoring capabilities", "day", 3600),
            ("Compliance & Purview Implementation", "security", "Security", "Microsoft Purview data governance, compliance manager, and information protection", "day", 2600),
            # Data & Analytics
            ("Data Strategy & Roadmap", "data_analytics", "Data", "Define enterprise data strategy, governance model, and analytics maturity roadmap", "fixed", 50000),
            ("Microsoft Fabric Implementation", "data_analytics", "Data", "End-to-end Microsoft Fabric deployment including lakehouses, pipelines, and warehouses", "day", 3200),
            ("Power BI Enterprise Deployment", "data_analytics", "Data", "Semantic layer design, report development, and enterprise BI governance", "day", 2600),
            ("Azure Synapse Analytics", "data_analytics", "Data", "Synapse Analytics workspace, dedicated pools, and data integration pipelines", "day", 3000),
            ("Real-Time Analytics & Event Streaming", "data_analytics", "Data", "Azure Event Hubs, Stream Analytics, and real-time dashboard solutions", "day", 3400),
            ("Data Governance with Purview", "data_analytics", "Data", "Microsoft Purview data catalog, lineage, classification, and data quality", "day", 2800),
        ]

        service_ids = {}
        services_obj = {}
        for name, cat, practice, desc, unit, price in services_data:
            svc = ServiceCatalog(id=new_id(), name=name, category=cat, practice=practice,
                                 description=desc, unit=unit, list_price=price, active=True)
            db.add(svc)
            service_ids[name] = svc.id
            services_obj[name] = svc
        db.flush()

        # ─── HELPERS ───────────────────────────────────────────────────────
        def make_opp(name, client, contact, email, stage, value, prob, desc, region, industry, owner, days_offset=0):
            close_days = {"prospect": 180, "qualify": 120, "develop": 90, "propose": 60,
                          "negotiate": 30, "closed_won": -30, "closed_lost": -60}.get(stage, 90) + days_offset
            opp = Opportunity(
                id=new_id(), name=name, client_name=client, client_contact=contact,
                client_contact_email=email, stage=stage, estimated_value=value,
                probability=prob, weighted_value=value * prob / 100,
                description=desc, owner=owner,
                close_date=today + timedelta(days=close_days),
                services=json.dumps([]), industry=industry, region=region,
            )
            db.add(opp)
            return opp

        def make_contract(opp_id, name, client, scope, svc_lines, start_offset, duration_months, creator, approved_days_back=None):
            start = today + timedelta(days=start_offset)
            months_fwd = (start.month - 1 + duration_months)
            end = date(start.year + months_fwd // 12, months_fwd % 12 + 1, min(start.day, 28))
            count = db.query(Contract).count()
            approved_at = datetime.utcnow() - timedelta(days=abs(start_offset) + (approved_days_back or 5))
            c = Contract(
                id=new_id(), opportunity_id=opp_id,
                contract_number=f"CON-2026-{str(count + 1).zfill(4)}",
                name=name, client_name=client, status="active",
                approval_status="approved", approved_by="Patricia Evans, VP Delivery",
                approved_at=approved_at,
                scope_summary=scope, start_date=start, end_date=end, created_by=creator,
            )
            db.add(c)
            db.flush()
            total = 0.0
            for svc_name, qty in svc_lines:
                svc = services_obj.get(svc_name)
                if svc:
                    line_total = (svc.list_price or 0) * qty
                    db.add(ContractServiceLine(
                        id=new_id(), contract_id=c.id, service_id=svc.id,
                        service_name=svc.name, category=svc.category,
                        quantity=qty, unit=svc.unit, unit_price=svc.list_price,
                        discount_pct=0, total=line_total,
                    ))
                    total += line_total
            c.total_value = total
            return c

        def make_handoff(contract_id, vision, objectives, criteria, risks, pitfalls, decisions, notes, pre_sales, delivery, contacts_data, completed=True, days_back=40):
            h = Handoff(
                id=new_id(), contract_id=contract_id,
                customer_vision=vision,
                business_objectives=json.dumps(objectives),
                success_criteria=json.dumps(criteria),
                risks=json.dumps(risks),
                pitfalls=json.dumps(pitfalls),
                key_decisions=json.dumps(decisions),
                delivery_notes=notes,
                pre_sales_owner=pre_sales,
                delivery_owner=delivery,
                status="completed" if completed else "pending",
                completed_at=datetime.utcnow() - timedelta(days=days_back) if completed else None,
            )
            db.add(h)
            db.flush()
            for name, title, email, role in contacts_data:
                db.add(HandoffContact(id=new_id(), handoff_id=h.id, name=name, title=title, email=email, role=role))
            return h

        def make_project(contract_id, name, client, pm, tl, health, h_sched, h_bud, h_scope, h_risk, h_sat,
                         status, start_offset, duration_months, budget, actuals, completion, phase, summary,
                         milestones_data, raid_data, update_data=None):
            start = today + timedelta(days=start_offset)
            months_fwd = (start.month - 1 + duration_months)
            end = date(start.year + months_fwd // 12, months_fwd % 12 + 1, min(start.day, 28))
            p = DeliveryProject(
                id=new_id(), contract_id=contract_id, name=name, client_name=client,
                project_manager=pm, technical_lead=tl,
                overall_health=health, health_schedule=h_sched, health_budget=h_bud,
                health_scope=h_scope, health_risk=h_risk, health_satisfaction=h_sat,
                status=status, start_date=start, end_date=end,
                budget=budget, actuals=actuals,
                completion_pct=completion, phase=phase, executive_summary=summary,
            )
            db.add(p)
            db.flush()
            for ms_name, ms_status, due_offset, completed_offset, owner in milestones_data:
                db.add(Milestone(
                    id=new_id(), project_id=p.id, name=ms_name, status=ms_status,
                    due_date=today + timedelta(days=due_offset),
                    completed_date=today + timedelta(days=completed_offset) if completed_offset is not None else None,
                    owner=owner,
                ))
            for rtype, title, desc, impact, prob, rstatus, owner, due_offset, mitigation in raid_data:
                db.add(RAIDItem(
                    id=new_id(), project_id=p.id, item_type=rtype, title=title,
                    description=desc, impact=impact, probability=prob, status=rstatus,
                    owner=owner,
                    due_date=today + timedelta(days=due_offset) if due_offset is not None else None,
                    mitigation=mitigation,
                ))
            if update_data:
                period, uh, summary_txt, accoms, nexts, escs = update_data
                db.add(StatusUpdate(
                    id=new_id(), project_id=p.id, period=period, overall_health=uh,
                    summary=summary_txt,
                    accomplishments=json.dumps(accoms),
                    next_steps=json.dumps(nexts),
                    escalations=json.dumps(escs),
                ))
            return p

        # ══════════════════════════════════════════════════════════════════
        #  ACTIVE PIPELINE OPPORTUNITIES  ($20M–$25M target)
        # ══════════════════════════════════════════════════════════════════

        # -- Existing active opps (kept) --
        make_opp("Contoso Bank Cloud Migration", "Contoso Financial Group", "Sarah Chen", "s.chen@contoso.com",
                 "propose", 1_850_000, 60, "Full Azure migration of 120 on-premises workloads with zero-trust security overlay.", "Americas", "Banking", "Michael Torres")
        make_opp("Fabrikam AI Agent Platform", "Fabrikam Manufacturing", "David Osei", "d.osei@fabrikam.com",
                 "develop", 620_000, 40, "Agentic AI platform for supply chain optimization using Azure AI Studio and Semantic Kernel.", "EMEA", "Manufacturing", "Elena Vasquez")
        make_opp("Northwind Dynamics 365 F&O", "Northwind Traders", "Maria Santos", "m.santos@northwind.com",
                 "negotiate", 2_200_000, 80, "Full D365 F&O transformation replacing SAP ECC. 18-month implementation.", "Americas", "Retail", "James Park")
        make_opp("Alpine Security Transformation", "Alpine Insurance Group", "Robert Klein", "r.klein@alpine.com",
                 "propose", 880_000, 60, "Zero Trust with Sentinel SIEM, Defender XDR, and full identity modernization.", "EMEA", "Insurance", "Elena Vasquez")
        make_opp("Tailspin Analytics Platform", "Tailspin Toys", "Jennifer Wu", "j.wu@tailspin.com",
                 "qualify", 450_000, 20, "Microsoft Fabric replacing legacy BI stack, Power BI rollout, Purview governance.", "APAC", "Consumer Goods", "Priya Nair")
        make_opp("WoodGrove Copilot Enablement", "WoodGrove Bank", "Alex Johnson", "a.johnson@woodgrove.com",
                 "prospect", 280_000, 10, "M365 Copilot for 5,000 users with adoption program and AI governance framework.", "Americas", "Banking", "Michael Torres")
        make_opp("Bellows College Data Strategy", "Bellows College System", "Nancy Huang", "n.huang@bellows.edu",
                 "qualify", 320_000, 20, "Enterprise data strategy and Fabric implementation for a 15-campus university.", "Americas", "Higher Education", "Priya Nair")
        make_opp("Relecloud AI Readiness", "Relecloud Logistics", "Carlos Mendez", "c.mendez@relecloud.com",
                 "prospect", 95_000, 10, "AI readiness assessment for logistics optimization. Gateway to a larger AI build.", "Americas", "Logistics", "Michael Torres")

        # -- New large active opps to push pipeline to $20M–$25M --
        make_opp("Fourth Coffee - Azure DC Exit", "Fourth Coffee Corporation", "Brian Walsh", "b.walsh@fourthcoffee.com",
                 "propose", 4_200_000, 60,
                 "Full data-center exit to Azure for 200+ workloads across 3 continents. Includes cloud foundation, migration factory, and 12-month hypercare. Driven by lease expiry in Q1 2027.",
                 "Americas", "Food & Beverage", "Michael Torres")
        make_opp("Consolidated Messenger D365 F&O", "Consolidated Messenger", "Yuki Tanaka", "y.tanaka@consolidated.com",
                 "develop", 3_800_000, 40,
                 "Replace legacy SAP with D365 F&O across 14 countries. Covers finance, logistics, and HR. Highly complex multi-entity consolidation requirement.",
                 "EMEA", "Logistics", "James Park")
        make_opp("A. Datum Security Overhaul", "A. Datum Corporation", "Sandra Rivera", "s.rivera@adatum.com",
                 "negotiate", 2_600_000, 80,
                 "Enterprise-wide security transformation: Zero Trust architecture, Sentinel SOC, Defender suite, and full IAM modernization. Board-mandated after near-miss breach.",
                 "Americas", "Technology", "Elena Vasquez")
        make_opp("Contoso Hotels AI Guest Experience", "Contoso Hotels & Resorts", "Marco Ferrari", "m.ferrari@contoso-hotels.com",
                 "qualify", 2_100_000, 20,
                 "AI-powered personalization platform using Azure OpenAI across 240 hotel properties. Custom guest recommendation engine and intelligent concierge agent.",
                 "EMEA", "Hospitality", "Elena Vasquez")
        make_opp("Northwind Healthcare HIPAA Compliance", "Northwind Healthcare", "Dr. Rachel Kim", "r.kim@northwind-health.com",
                 "propose", 1_900_000, 60,
                 "Compliance-driven Microsoft Purview deployment plus Sentinel SIEM for HIPAA/HITECH audit readiness across 8 hospital systems.",
                 "APAC", "Healthcare", "Priya Nair")
        make_opp("Humongous Insurance Data Platform", "Humongous Insurance Group", "Patrick O'Brien", "p.obrien@humongous.com",
                 "develop", 2_300_000, 40,
                 "Enterprise data platform on Microsoft Fabric to unify 40 years of legacy actuarial, claims, and policy data. Includes AI-powered underwriting assistant.",
                 "EMEA", "Insurance", "Priya Nair")
        db.flush()

        # ══════════════════════════════════════════════════════════════════
        #  CLOSED WON → CONTRACT → HANDOFF → DELIVERY PROJECT
        # ══════════════════════════════════════════════════════════════════

        # 1. ADATUM CLOUD FOUNDATION (active / amber)
        opp1 = make_opp("Adatum Cloud Foundation", "Adatum Corporation", "Lisa Park", "l.park@adatum.com",
                         "closed_won", 540_000, 100, "Azure Landing Zone and cloud foundation for greenfield Azure adoption.",
                         "Americas", "Technology", "James Park")
        db.flush()
        c1 = make_contract(opp1.id, "Adatum Cloud Foundation - Azure LZ Build", "Adatum Corporation",
            "Design and implement a production-grade Azure Landing Zone (hub-spoke), including governance (Policy-as-Code, RBAC), networking (ExpressRoute + VPN), security baseline (Defender for Cloud), and FinOps tooling.",
            [("Cloud Adoption Foundation", 80), ("Azure Networking & Connectivity", 40), ("FinOps & Cost Optimization", 20)],
            -60, 6, "James Park")
        make_handoff(c1.id,
            "Adatum wants to be fully cloud-native within 36 months. This engagement is the strategic foundation — the CTO views it as a career-defining transformation.",
            ["Establish a secure, compliant Azure Landing Zone by August 2026", "Enable self-service workload onboarding for 10 application teams", "Achieve 25% infrastructure cost reduction vs. on-premises in year 1"],
            ["Landing Zone passes Microsoft Well-Architected Framework review", "First 5 workloads migrated by project close"],
            ["Only 1 internal Azure architect — key-person risk", "ExpressRoute provisioning lead times (6–8 weeks)"],
            ["Client underestimated policy remediation scope — budget pressure likely in Phase 2", "Messy existing tenant from prior POC"],
            ["Hub-spoke over Azure Virtual WAN — client prefers control", "Custom Policy-as-Code (Bicep) not Azure Blueprints"],
            "Start with 2-week discovery sprint to audit existing tenant. CTO (Lisa Park) has weekly 30-min check-ins — do not miss these.",
            "James Park", "Sarah Mitchell",
            [("Lisa Park", "CTO", "l.park@adatum.com", "sponsor"), ("Ray Kowalski", "Azure Architect", "r.kowalski@adatum.com", "technical_lead")],
            days_back=50)
        make_project(c1.id, "Adatum Cloud Foundation", "Adatum Corporation",
            "Sarah Mitchell", "Ray Kowalski",
            "amber", "amber", "green", "green", "amber", "green",
            "active", -60, 6, 540_000, 198_000, 42, "execute",
            "Cloud foundation progressing with most components on track. Schedule amber due to ExpressRoute delay (6 weeks behind). Governance delivered ahead of schedule. Client satisfaction high.",
            [("Azure Tenant Cleanup & Audit", "completed", -50, -48, "Ray Kowalski"),
             ("Landing Zone Architecture Design", "completed", -40, -38, "Sarah Mitchell"),
             ("Governance & Policy Framework", "completed", -20, -18, "Sarah Mitchell"),
             ("Hub-Spoke Network Deployment", "in_progress", 15, None, "Ray Kowalski"),
             ("ExpressRoute Circuit Configuration", "at_risk", 20, None, "Ray Kowalski"),
             ("Security Baseline (Defender for Cloud)", "not_started", 45, None, "Sarah Mitchell"),
             ("First 5 Workload Onboarding", "not_started", 90, None, "Ray Kowalski"),
             ("FinOps Dashboard & Alerting", "not_started", 100, None, "Sarah Mitchell")],
            [("risk", "ExpressRoute Provisioning Delay", "Telco SLA 8 weeks. Hub-spoke connectivity blocked.", "high", "high", "open", "Ray Kowalski", 10, "VPN Gateway as interim connectivity"),
             ("risk", "Single Azure Architect Dependency", "Only 1 internal SME — departure = knowledge risk.", "high", "medium", "open", "Sarah Mitchell", None, "Document all configs; shadow sessions with backup staff"),
             ("issue", "Legacy Tenant Misconfiguration", "47 non-compliant resource groups from prior POC.", "medium", None, "in_progress", "Ray Kowalski", 5, "Remediation script in test subscription")],
            ("Week of Apr 28, 2026", "amber",
             "Governance framework delivered. ExpressRoute delay continues to be the primary schedule risk. VPN Gateway initiated as interim.",
             ["Policy-as-Code framework deployed with 24 governance policies", "RBAC model approved by CTO", "39 of 47 legacy resource groups remediated"],
             ["Complete remaining 8 resource group remediations by May 7", "Begin hub-spoke VNET deployment in non-prod"],
             ["ExpressRoute: telco now projecting June 15 vs May 20 original — request executive escalation"]))

        # 2. PROSEWARE SOC MODERNIZATION (active / green)
        opp2 = make_opp("Proseware SOC Modernization", "Proseware Inc", "Tom Bradley", "t.bradley@proseware.com",
                         "closed_won", 760_000, 100, "Microsoft-powered SOC with Sentinel, Defender, and 24x7 monitoring capability.",
                         "EMEA", "Professional Services", "Elena Vasquez")
        db.flush()
        c2 = make_contract(opp2.id, "Proseware SOC Modernization - Sentinel & Defender", "Proseware Inc",
            "Deploy Microsoft Sentinel as primary SIEM/SOAR with 40+ connectors, custom analytics rules, and automated playbooks. Implement Defender suite across 3,500 seats. Establish 24x7 SOC.",
            [("Microsoft Sentinel SIEM Deployment", 120), ("Microsoft Defender XDR", 80), ("Security Operations Center (SOC)", 60)],
            -45, 9, "Elena Vasquez")
        make_handoff(c2.id,
            "Proseware was breached 18 months ago. The CISO has board mandate to achieve enterprise-class security operations this fiscal year. Political capital is high.",
            ["Deploy Sentinel with full SIEM coverage", "MTTD < 15 min, MTTR < 4 hours for critical incidents", "Eliminate Splunk and reduce licensing 40%"],
            ["100% critical assets covered by Defender for Endpoint", "40+ Sentinel connectors operational", "SOC team of 4 analysts fully trained"],
            ["Splunk decommission depends on 3rd-party SLA", "2 of 4 SOC analyst headcount still unfilled"],
            ["CISO and IT Ops Director have conflicting SOC ownership views", "Previous integrator left connectors undocumented"],
            ["Sentinel over Splunk Cloud — cost and native MS integration", "Managed SOAR playbooks via Logic Apps"],
            "Weekly delivery review with CISO (Tom Bradley) every Tuesday 9am EST. Do NOT discuss Splunk deprecation in joint calls — politically sensitive.",
            "Elena Vasquez", "Marco Rossi",
            [("Tom Bradley", "CISO", "t.bradley@proseware.com", "sponsor"), ("Angela Moore", "IT Ops Director", "a.moore@proseware.com", "technical_lead")],
            days_back=38)
        make_project(c2.id, "Proseware SOC Modernization", "Proseware Inc",
            "Marco Rossi", "Angela Moore",
            "green", "green", "green", "amber", "green", "green",
            "active", -45, 9, 760_000, 142_000, 22, "execute",
            "SOC Modernization on track. Sentinel baseline exceeded Day 45 milestone target. Scope amber due to AS/400 coverage gap requiring architecture decision. CISO satisfaction high.",
            [("Sentinel Baseline Deployment", "completed", -5, -7, "Marco Rossi"),
             ("Core Data Connectors (20+)", "in_progress", 20, None, "Angela Moore"),
             ("Defender for Endpoint (3,500 seats)", "in_progress", 30, None, "Angela Moore"),
             ("Analytics Rules & UEBA", "not_started", 60, None, "Marco Rossi"),
             ("SOAR Playbooks (15 playbooks)", "not_started", 90, None, "Marco Rossi"),
             ("SOC Team Training", "not_started", 150, None, "Marco Rossi"),
             ("Splunk Decommission & Cutover", "not_started", 180, None, "Angela Moore")],
            [("risk", "SOC Analyst Headcount Gap", "2 of 4 SOC analyst positions unfilled. Training milestone may slip.", "high", "medium", "open", "Tom Bradley", 60, "Escalate HR timeline; consider interim MSSP coverage"),
             ("issue", "AS/400 Coverage Gap", "No Defender agent path for AS/400 systems. Scope gap discovered post-contract.", "medium", None, "in_progress", "Angela Moore", 30, "CEF connector via Syslog as compensating control"),
             ("dependency", "MFA Rollout for Sentinel Analytics", "Sign-in analytics require MFA enforcement — IT Ops rollout incomplete.", "high", None, "open", "Angela Moore", 45, None)],
            ("Week of Apr 28, 2026", "green",
             "Strong week — Sentinel baseline deployed 7 days ahead of schedule. AS/400 gap scoped and CEF connector solution being tested.",
             ["Sentinel workspace deployed and operational in prod", "15 initial data connectors live", "12 KQL detection rules migrated from Splunk"],
             ["Complete remaining 25+ connectors by May 16", "Begin Defender for Endpoint rollout — 500 seats/week"],
             []))

        # 3. SOUTHRIDGE D365 F&O (active / green / plan)
        opp3 = make_opp("Southridge D365 F&O Transformation", "Southridge Video", "Patricia Lim", "p.lim@southridge.com",
                         "closed_won", 2_800_000, 100, "Replace legacy PeopleSoft with D365 F&O across finance, supply chain, and media rights management.",
                         "Americas", "Media & Entertainment", "James Park")
        db.flush()
        c3 = make_contract(opp3.id, "Southridge Video - D365 F&O Transformation", "Southridge Video",
            "Full D365 Finance & Operations implementation replacing PeopleSoft ERP. Covers General Ledger, AP/AR, Fixed Assets, Supply Chain, Project Operations, and custom media rights module. 24-month program across 3 phases.",
            [("Dynamics 365 Finance & Operations", 350), ("Dynamics Integration Architecture", 80), ("Dynamics Data Migration", 120)],
            -15, 24, "James Park")
        make_handoff(c3.id,
            "Southridge CEO committed to board that D365 will be live for fiscal year close in March 2028. This is non-negotiable. CFO is the day-to-day sponsor and is very hands-on.",
            ["Go-live on D365 F&O by March 2028 for fiscal year close", "Eliminate PeopleSoft by end of 2027", "Achieve real-time financial visibility across 12 subsidiaries"],
            ["Parallel run: D365 and PeopleSoft for Q1 2028 close", "Clean data migration validated by external auditor"],
            ["Complex media rights revenue recognition requirements may require ISV", "Only 3 internal D365-trained staff"],
            ["Client attempted D365 F&O once before with a different SI — project was cancelled after 8 months", "Finance team is resistant to change — heavy change management needed"],
            ["Custom media rights module to be built on D365 extensibility framework", "Phase 1: Finance only; Phase 2: SCM; Phase 3: Media Rights"],
            "Day 1 priority: run design workshops with CFO (Patricia Lim) before any configuration. Previous SI failure was caused by skipping design. Change management is critical — budget has been allocated.",
            "James Park", "David Chen",
            [("Patricia Lim", "CFO / Executive Sponsor", "p.lim@southridge.com", "sponsor"), ("Greg Mason", "IT Director", "g.mason@southridge.com", "technical_lead"), ("Karen White", "Finance Controller", "k.white@southridge.com", "end_user")],
            days_back=10)
        make_project(c3.id, "Southridge D365 F&O Transformation", "Southridge Video",
            "David Chen", "Kevin Park",
            "green", "green", "green", "green", "green", "green",
            "active", -15, 24, 2_800_000, 85_000, 5, "plan",
            "Program in Plan phase following successful kickoff. Design workshops underway with finance team. Client engagement is strong. No issues identified to date.",
            [("Project Kickoff & Governance Setup", "completed", -10, -8, "David Chen"),
             ("Business Process Discovery - Finance", "in_progress", 20, None, "David Chen"),
             ("Solution Design Workshop - Finance", "not_started", 45, None, "Kevin Park"),
             ("Phase 1 Configuration - Finance", "not_started", 90, None, "Kevin Park"),
             ("UAT - Finance", "not_started", 180, None, "David Chen"),
             ("Phase 1 Go-Live (Finance)", "not_started", 240, None, "David Chen"),
             ("Phase 2 - Supply Chain", "not_started", 365, None, "Kevin Park"),
             ("Phase 3 - Media Rights", "not_started", 540, None, "Kevin Park"),
             ("Final Go-Live & Hypercare", "not_started", 700, None, "David Chen")],
            [("risk", "Media Rights Revenue Recognition Complexity", "Custom revenue recognition rules may require ISV solution — not budgeted.", "high", "medium", "open", "David Chen", 45, "ISV assessment in design phase"),
             ("assumption", "PeopleSoft Data Quality", "Assumed client data is clean. Discovery may reveal remediation need.", "medium", None, "open", "Kevin Park", None, None),
             ("dependency", "Change Management Program", "Design sign-off depends on CFO-led change management sessions being scheduled.", "high", None, "open", "David Chen", 20, None)],
            ("Week of Apr 28, 2026", "green",
             "Strong program start. Kickoff delivered. Finance discovery workshops kicked off with 12 business stakeholders. Team dynamics positive.",
             ["Project governance framework established and approved", "Discovery kickoff with 12 finance stakeholders completed", "Risk register initialized"],
             ["Complete Finance business process mapping by May 15", "Schedule ISV assessment for media rights module"],
             []))

        # 4. BLUE YONDER FABRIC PLATFORM (active / amber / execute)
        opp4 = make_opp("Blue Yonder Microsoft Fabric", "Blue Yonder Inc", "Amir Siddiqui", "a.siddiqui@blueyonder.com",
                         "closed_won", 1_500_000, 100, "Enterprise data platform on Microsoft Fabric unifying supply chain, demand planning, and logistics analytics.",
                         "APAC", "Supply Chain Technology", "Priya Nair")
        db.flush()
        c4 = make_contract(opp4.id, "Blue Yonder - Microsoft Fabric Enterprise Data Platform", "Blue Yonder Inc",
            "Implement Microsoft Fabric as the unified analytics platform replacing a fragmented landscape of 6 legacy data tools. Includes OneLake architecture, data pipelines, Lakehouse, Warehouse, and executive Power BI suite.",
            [("Microsoft Fabric Implementation", 240), ("Power BI Enterprise Deployment", 80), ("Data Governance with Purview", 60)],
            -90, 12, "Priya Nair")
        make_handoff(c4.id,
            "Blue Yonder wants to be the AI-powered supply chain platform of record for Asia-Pacific. This Fabric implementation is the data foundation for their AI roadmap.",
            ["Unified data platform live with all 6 legacy sources migrated", "Executive Power BI suite replacing 40 disparate reports", "Purview data catalog with 80%+ asset coverage"],
            ["OneLake ingesting all 6 legacy data sources", "Power BI certified dataset adopted by 200+ analysts"],
            ["Data quality issues in legacy ERP will delay pipeline development", "Only 1 internal data engineer — key person risk"],
            ["Client previously tried a Databricks implementation — abandoned after 6 months due to skills gap", "Stakeholder alignment on data ownership is weak"],
            ["OneLake over Synapse Analytics — better Fabric native integration", "Purview for governance from day 1, not as an afterthought"],
            "Legacy ERP data quality is worse than disclosed during pre-sales. Build in a 3-week data profiling sprint before any pipeline work. The 1 internal data engineer (Raj Patel) is excellent — leverage him heavily.",
            "Priya Nair", "Sophie Laurent",
            [("Amir Siddiqui", "Chief Data Officer", "a.siddiqui@blueyonder.com", "sponsor"), ("Raj Patel", "Senior Data Engineer", "r.patel@blueyonder.com", "technical_lead")],
            days_back=80)
        make_project(c4.id, "Blue Yonder Microsoft Fabric Platform", "Blue Yonder Inc",
            "Sophie Laurent", "Raj Patel",
            "amber", "amber", "green", "amber", "green", "amber",
            "active", -90, 12, 1_500_000, 620_000, 48, "execute",
            "Platform delivery is 3 weeks behind schedule due to legacy ERP data quality issues uncovered in profiling sprint. Core Lakehouse is operational. Client satisfaction is cautiously positive but CDO expects recovery plan.",
            [("Data Profiling & Quality Assessment", "completed", -75, -72, "Sophie Laurent"),
             ("OneLake Architecture & Foundation", "completed", -60, -58, "Raj Patel"),
             ("Legacy ERP Pipeline (Source 1 & 2)", "completed", -30, -28, "Raj Patel"),
             ("Legacy ERP Pipeline (Source 3–6)", "in_progress", 15, None, "Raj Patel"),
             ("Lakehouse Gold Layer & Semantic Model", "at_risk", 20, None, "Sophie Laurent"),
             ("Power BI Executive Dashboard Suite", "not_started", 60, None, "Sophie Laurent"),
             ("Purview Data Catalog Deployment", "not_started", 75, None, "Sophie Laurent"),
             ("User Adoption & Training", "not_started", 90, None, "Sophie Laurent"),
             ("Go-Live & Hypercare", "not_started", 100, None, "Raj Patel")],
            [("issue", "Legacy ERP Data Quality", "Sources 3–6 have 30–40% incomplete records requiring remediation before pipeline build.", "high", None, "in_progress", "Raj Patel", 15, "Data cleansing rules applied upstream; ERP team engaged"),
             ("risk", "Single Internal Engineer Dependency", "Raj Patel is the only internal data engineer. Any absence critically impacts delivery.", "high", "medium", "open", "Sophie Laurent", None, "Cross-training junior analyst; full documentation in Confluence"),
             ("risk", "Semantic Model Performance", "Gold layer query times exceeding 10s on large datasets — Direct Lake mode may need tuning.", "medium", "medium", "open", "Raj Patel", 20, "Performance tuning sprint planned")],
            ("Week of Apr 28, 2026", "amber",
             "Sources 1–4 pipelines operational. Sources 5–6 data quality remediation continues. Schedule risk acknowledged with CDO — recovery plan presented and accepted.",
             ["ERP Sources 1–4 pipelines fully operational and tested", "OneLake ingesting 2.8TB/day across operational sources", "Data quality rules deployed for Sources 3–4"],
             ["Complete Sources 5–6 remediation and pipeline build by May 12", "Begin Lakehouse Gold layer modelling"],
             ["Schedule recovery: 3-week slip acknowledged by CDO — request approval for parallel workstream to compress timeline"]))

        # 5. WINGTIP TOYS AZURE MODERNIZATION (active / red / execute)
        opp5 = make_opp("Wingtip Toys Azure Modernization", "Wingtip Toys", "Claire Beaumont", "c.beaumont@wingtip.com",
                         "closed_won", 1_900_000, 100, "Cloud-native application modernization: containerize and re-platform 35 applications to AKS and Azure PaaS.",
                         "Americas", "Retail", "Michael Torres")
        db.flush()
        c5 = make_contract(opp5.id, "Wingtip Toys - Cloud Native Modernization", "Wingtip Toys",
            "Modernize 35 legacy .NET and Java applications to cloud-native architecture on AKS. Includes container strategy, CI/CD pipeline with GitHub Actions, Azure DevOps, and cloud-native observability with Azure Monitor.",
            [("Cloud Native Modernization", 240), ("Cloud Adoption Foundation", 40), ("Azure Networking & Connectivity", 30)],
            -120, 12, "Michael Torres")
        make_handoff(c5.id,
            "Wingtip CTO wants to demonstrate a cloud-native portfolio to the board by Q4 2026 to support their IPO narrative. 35 applications is aggressive for 12 months.",
            ["35 applications containerized and running on AKS by December 2026", "CI/CD pipelines for all applications", "Zero on-premises application footprint"],
            ["All 35 apps passing automated integration tests in AKS", "P95 response time ≤ pre-migration baseline"],
            ["Application count is 35 — team capacity may not support all in scope", "Some apps have undocumented dependencies"],
            ["App #17 (inventory) has a mainframe dependency that was NOT disclosed during discovery — material scope risk", "Dev team has limited Kubernetes experience"],
            ["AKS over App Service — future scalability requirements", "GitHub Actions for CI/CD — client has existing GitHub Enterprise"],
            "App #17 inventory system has an undocumented AS/400 mainframe dependency. This is a blocker and needs an architecture decision before containerization. Escalate immediately in kickoff.",
            "Michael Torres", "Aisha Okonkwo",
            [("Claire Beaumont", "CTO", "c.beaumont@wingtip.com", "sponsor"), ("Jake Morrison", "Lead Developer", "j.morrison@wingtip.com", "technical_lead")],
            days_back=110)
        make_project(c5.id, "Wingtip Toys Cloud Native Modernization", "Wingtip Toys",
            "Aisha Okonkwo", "Jake Morrison",
            "red", "red", "amber", "red", "red", "amber",
            "active", -120, 12, 1_900_000, 980_000, 38, "execute",
            "Project is in RED status. The undocumented mainframe dependency on App #17 has caused a 6-week architecture redesign, compressing remaining schedule. Team capacity is insufficient to complete all 35 apps by December. Executive escalation in progress.",
            [("Container Strategy & AKS Foundation", "completed", -100, -95, "Aisha Okonkwo"),
             ("CI/CD Pipeline Framework", "completed", -85, -80, "Jake Morrison"),
             ("Wave 1: Apps 1–10 (Low Complexity)", "completed", -60, -55, "Jake Morrison"),
             ("Wave 2: Apps 11–20 (Medium Complexity)", "overdue", -10, None, "Jake Morrison"),
             ("App #17 Mainframe Integration Architecture", "in_progress", 15, None, "Aisha Okonkwo"),
             ("Wave 3: Apps 21–30 (High Complexity)", "not_started", 60, None, "Jake Morrison"),
             ("Wave 4: Apps 31–35 + #17", "not_started", 100, None, "Jake Morrison"),
             ("Performance Testing & Optimization", "not_started", 110, None, "Jake Morrison"),
             ("Go-Live & Cutover", "not_started", 120, None, "Aisha Okonkwo")],
            [("issue", "Wave 2 Overdue - 6 Apps Incomplete", "6 of 10 Wave 2 apps not completed due to undiscovered dependencies and team capacity.", "high", None, "open", "Aisha Okonkwo", 10, "Emergency sprint planned; 2 additional engineers requested from bench"),
             ("risk", "App #17 Mainframe Dependency Unresolved", "AS/400 mainframe integration requires API gateway design not in original scope. Potential SOW amendment needed.", "high", "high", "open", "Aisha Okonkwo", 15, "Architecture options document in review with client"),
             ("risk", "Schedule - December Go-Live Jeopardy", "At current velocity, only 28–30 of 35 apps deliverable by December. IPO narrative at risk.", "high", "high", "open", "Michael Torres", None, "Scope reduction options being presented to CTO"),
             ("risk", "Team Capacity Insufficient", "Current 4-person delivery team cannot absorb Wave 2 recovery and maintain Wave 3 velocity.", "high", "high", "open", "Aisha Okonkwo", 7, "2 additional engineers requested from global bench")],
            ("Week of Apr 28, 2026", "red",
             "Project remains RED. Wave 2 is 6 apps behind. App #17 mainframe discovery has caused schedule compression. Emergency resourcing request approved. Scope reduction options presented to CTO.",
             ["Architecture options document for App #17 delivered to client", "2 additional engineers approved from global bench — starting May 6", "Wave 2 apps 11–14 completed and promoted to staging"],
             ["Complete Wave 2 remaining 6 apps by May 20 with additional engineers", "Client decision on App #17 scope by May 9", "Present revised delivery plan to CTO by May 12"],
             ["REQUEST ESCALATION: December go-live at risk — CTO awareness required; scope reduction or timeline extension decision needed by May 12"]))

        # 6. CITY POWER & LIGHT SENTINEL (active / green)
        opp6 = make_opp("City Power & Light SOC Modernization", "City Power & Light", "Howard Snyder", "h.snyder@citypowerlight.com",
                         "closed_won", 1_300_000, 100, "Microsoft Sentinel SIEM deployment and SOC enablement for a critical infrastructure utility.",
                         "Americas", "Utilities", "Elena Vasquez")
        db.flush()
        c6 = make_contract(opp6.id, "City Power & Light - Sentinel SOC & OT Security", "City Power & Light",
            "Deploy Microsoft Sentinel across IT and OT environments for a regulated electric utility. Includes Defender for IoT integration, NERC CIP compliance analytics, and 24x7 SOC capability.",
            [("Microsoft Sentinel SIEM Deployment", 160), ("Security Operations Center (SOC)", 80), ("Microsoft Defender XDR", 60)],
            -30, 9, "Elena Vasquez")
        make_handoff(c6.id,
            "City Power & Light operates critical infrastructure. A ransomware incident at a peer utility last year triggered a board mandate for enterprise SOC capability. NERC CIP compliance is a regulatory requirement.",
            ["Sentinel deployed across IT and OT/ICS environments", "NERC CIP compliance analytics running", "24x7 SOC with 4-analyst team operational"],
            ["Zero undetected incidents > 15 minutes in OT environment", "NERC CIP audit passed with Sentinel evidence package"],
            ["OT/ICS environment has air-gapped segments — Sentinel connectivity requires special architecture", "NERC CIP requires evidence of 6-month monitoring history before audit"],
            ["Previous security tool (QRadar) has complex existing rules — migration effort underestimated", "Regulatory timeline is fixed — no slip allowed"],
            ["Sentinel over QRadar — native Microsoft integration and lower TCO", "Defender for IoT for OT/ICS visibility"],
            "The NERC CIP audit is scheduled for January 2027 — this is immovable. OT environment connectivity requires working with their SCADA team (separate from IT). Get SCADA team alignment in Week 1.",
            "Elena Vasquez", "Fatima Al-Hassan",
            [("Howard Snyder", "CISO", "h.snyder@citypowerlight.com", "sponsor"), ("Maria Delgado", "OT Security Lead", "m.delgado@citypowerlight.com", "technical_lead")],
            days_back=25)
        make_project(c6.id, "City Power & Light SOC Modernization", "City Power & Light",
            "Fatima Al-Hassan", "Maria Delgado",
            "green", "green", "green", "green", "green", "green",
            "active", -30, 9, 1_300_000, 180_000, 20, "execute",
            "Strong delivery start. IT Sentinel baseline deployed. OT connectivity architecture approved. NERC CIP compliance analytics in design. All milestones on track for January 2027 audit.",
            [("Sentinel IT Baseline Deployment", "completed", -15, -13, "Fatima Al-Hassan"),
             ("OT/ICS Connectivity Architecture Design", "completed", -10, -8, "Maria Delgado"),
             ("IT Data Connectors (30+)", "in_progress", 20, None, "Fatima Al-Hassan"),
             ("OT/ICS Defender for IoT Integration", "in_progress", 30, None, "Maria Delgado"),
             ("NERC CIP Analytics Rules", "not_started", 60, None, "Fatima Al-Hassan"),
             ("SOC Team Setup & Training", "not_started", 120, None, "Fatima Al-Hassan"),
             ("NERC CIP Evidence Package", "not_started", 200, None, "Fatima Al-Hassan"),
             ("SOC Go-Live", "not_started", 240, None, "Fatima Al-Hassan")],
            [("risk", "NERC CIP Audit Timeline Fixed", "January 2027 audit is immovable. Any delivery slip directly impacts compliance.", "high", "low", "open", "Fatima Al-Hassan", None, "Monthly milestone reviews with CISO; no scope additions without impact analysis"),
             ("dependency", "SCADA Team Availability", "OT connector deployment requires SCADA team time — currently committed to other projects through May 15.", "medium", None, "open", "Maria Delgado", 45, None)],
            None)

        # 7. DATUM CORP AI AGENTS (active / green / initiate)
        opp7 = make_opp("Datum Corp AI Innovation Platform", "Datum Corporation", "Nadia Petrov", "n.petrov@datum.com",
                         "closed_won", 1_600_000, 100, "Build custom AI agents for HR, procurement, and customer service using Azure AI Studio and Semantic Kernel.",
                         "EMEA", "Technology", "Elena Vasquez")
        db.flush()
        c7 = make_contract(opp7.id, "Datum Corporation - AI Innovation Platform", "Datum Corporation",
            "Design and build a multi-agent AI platform on Azure AI Studio with Semantic Kernel orchestration. Three initial agents: HR onboarding agent, procurement approval agent, and customer service deflection agent. Includes AI governance framework and responsible AI review.",
            [("Azure AI Studio - Custom Agent", 200), ("Agentic Workflow Automation", 80), ("AI Governance & Responsible AI", 40)],
            -7, 10, "Elena Vasquez")
        make_handoff(c7.id,
            "Datum's CEO publicly committed at their annual conference to 'AI-first operations by 2027.' This platform is the flagship initiative. High visibility internally and externally.",
            ["3 production AI agents live by Q4 2026", "AI governance framework adopted across all business units", "50% reduction in HR onboarding processing time"],
            ["HR agent handles 80%+ of onboarding queries without human escalation", "Responsible AI review passed by external auditor"],
            ["AI model accuracy for procurement approvals must meet legal threshold — not yet defined", "Data privacy requirements for HR agent (EU GDPR)"],
            ["CEO announcements have created unrealistic timeline expectations internally — delivery team must manage this", "Procurement data is not clean — will impact agent training"],
            ["Semantic Kernel over LangChain — client's .NET stack", "Azure OpenAI GPT-4o as foundation model", "Start with HR agent as pilot — lower risk, measurable outcomes"],
            "Manage expectations carefully — the CEO has been public about this. Start with HR agent. Do not start procurement agent until HR agent is in production and outcomes validated.",
            "Elena Vasquez", "James Osei",
            [("Nadia Petrov", "Chief AI Officer", "n.petrov@datum.com", "sponsor"), ("Felix Wagner", "Platform Architect", "f.wagner@datum.com", "technical_lead")],
            days_back=5)
        make_project(c7.id, "Datum Corp AI Innovation Platform", "Datum Corporation",
            "James Osei", "Felix Wagner",
            "green", "green", "green", "green", "green", "green",
            "active", -7, 10, 1_600_000, 35_000, 4, "initiate",
            "Program in Initiate phase. Discovery and architecture workshops scheduled. No issues identified. High client energy and engagement.",
            [("Program Kickoff & Architecture Workshop", "in_progress", 7, None, "James Osei"),
             ("AI Use Case Deep Dive & Prioritization", "not_started", 20, None, "James Osei"),
             ("HR Agent - Design & Prototype", "not_started", 45, None, "Felix Wagner"),
             ("HR Agent - Build & Test", "not_started", 90, None, "Felix Wagner"),
             ("HR Agent - Production Go-Live", "not_started", 130, None, "James Osei"),
             ("Procurement Agent - Design & Build", "not_started", 160, None, "Felix Wagner"),
             ("Customer Service Agent - Design & Build", "not_started", 220, None, "Felix Wagner"),
             ("AI Governance Framework Deployment", "not_started", 250, None, "James Osei"),
             ("Platform Handover & Enablement", "not_started", 290, None, "James Osei")],
            [("risk", "CEO Public Commitment vs. Delivery Reality", "10-month timeline is aggressive for 3 production agents. Expectation management critical.", "high", "medium", "open", "James Osei", None, "Weekly stakeholder communications; milestone-based public updates only"),
             ("assumption", "Procurement Data Quality", "Assumed procurement data structured enough for agent training. Discovery may reveal gaps.", "medium", None, "open", "Felix Wagner", None, None)],
            None)

        # 8. LAMNA HEALTHCARE (completed)
        opp8 = make_opp("Lamna Healthcare Azure Foundation", "Lamna Healthcare", "Dr. James Rhee", "j.rhee@lamna.com",
                         "closed_won", 1_800_000, 100, "Azure cloud foundation and HIPAA-compliant security baseline for a multi-site healthcare provider.",
                         "EMEA", "Healthcare", "Elena Vasquez")
        db.flush()
        c8 = make_contract(opp8.id, "Lamna Healthcare - Azure & Security Foundation", "Lamna Healthcare",
            "Azure Landing Zone with healthcare-specific compliance controls, Defender for Cloud HIPAA policy initiative, and Purview data classification for PHI. Full identity modernization with Entra ID.",
            [("Cloud Adoption Foundation", 120), ("Identity & Access Management", 80), ("Compliance & Purview Implementation", 60)],
            -270, 9, "Elena Vasquez")
        make_handoff(c8.id,
            "Lamna needs to pass a HIPAA audit in Q3 2026. The cloud foundation is the enabler. Very compliance-driven engagement.",
            ["HIPAA-compliant Azure environment operational", "Entra ID fully deployed with MFA and PIM"],
            ["HIPAA policy initiative showing 95%+ compliance in Defender for Cloud", "PHI data classified and protected in Purview"],
            ["Legacy on-premises AD has 12 years of accumulated technical debt"],
            ["Previous cloud vendor was AWS — some stakeholder reluctance toward Azure"],
            ["Defender for Cloud HIPAA initiative over custom policy", "Entra ID cloud-only for new accounts; hybrid for legacy"],
            "HIPAA audit is the North Star. Every decision should be framed around audit readiness.",
            "Elena Vasquez", "Sarah Mitchell",
            [("Dr. James Rhee", "CIO", "j.rhee@lamna.com", "sponsor")],
            days_back=10)
        make_project(c8.id, "Lamna Healthcare Azure & Security Foundation", "Lamna Healthcare",
            "Sarah Mitchell", "Ray Kowalski",
            "green", "green", "green", "green", "green", "green",
            "completed", -270, 9, 1_800_000, 1_720_000, 100, "close",
            "Project successfully completed. HIPAA-compliant Azure environment delivered. Client passed HIPAA audit in April 2026. Excellent CSAT score of 9.2/10.",
            [("Azure Landing Zone", "completed", -240, -238, "Sarah Mitchell"),
             ("Identity Modernization", "completed", -180, -175, "Ray Kowalski"),
             ("HIPAA Policy Initiative", "completed", -120, -115, "Sarah Mitchell"),
             ("Purview PHI Classification", "completed", -90, -85, "Sarah Mitchell"),
             ("HIPAA Audit Readiness Review", "completed", -30, -28, "Sarah Mitchell"),
             ("Project Closure & Handover", "completed", -5, -3, "Sarah Mitchell")],
            [], None)

        # 9. TREY RESEARCH D365 (completed)
        opp9 = make_opp("Trey Research D365 Sales", "Trey Research Inc", "Amanda Foster", "a.foster@trey.com",
                         "closed_won", 1_200_000, 100, "D365 Sales and Customer Service implementation for a mid-size research firm.",
                         "Americas", "Professional Services", "James Park")
        db.flush()
        c9 = make_contract(opp9.id, "Trey Research - D365 Sales & Customer Service", "Trey Research Inc",
            "Deploy D365 Sales with advanced forecasting and AI-assisted pipeline management, plus D365 Customer Service with omnichannel support across email, Teams, and web portal.",
            [("Dynamics 365 Sales Implementation", 180), ("Dynamics 365 Customer Service", 120), ("Dynamics Data Migration", 60)],
            -330, 10, "James Park")
        make_handoff(c9.id,
            "Trey Research wants a single platform to manage the full client lifecycle — from prospect to delivery. Salesforce replacement.",
            ["Full Salesforce migration to D365 Sales", "Customer Service omnichannel live for 200 agents"],
            ["All Salesforce data migrated with zero data loss validation", "Customer Service deflection rate > 30% in 90 days"],
            ["Complex Salesforce data model — migration may require custom ETL"],
            ["Client underestimated training effort for 200 CS agents"],
            ["D365 Customer Service over ServiceNow — existing Office 365 footprint"],
            "Training is the success factor. Salesforce migration is technically straightforward but the CS agent adoption needs a dedicated change program.",
            "James Park", "David Chen",
            [("Amanda Foster", "VP Sales", "a.foster@trey.com", "sponsor")],
            days_back=10)
        make_project(c9.id, "Trey Research D365 Sales & CS", "Trey Research Inc",
            "David Chen", "Kevin Park",
            "green", "green", "green", "green", "green", "green",
            "completed", -330, 10, 1_200_000, 1_150_000, 100, "close",
            "Project completed successfully. D365 Sales and Customer Service live. 92% user adoption at 60 days post go-live. Customer deflection rate achieved 34%.",
            [("Salesforce Data Migration", "completed", -260, -255, "David Chen"),
             ("D365 Sales Configuration", "completed", -220, -215, "Kevin Park"),
             ("D365 Customer Service + Omnichannel", "completed", -160, -155, "Kevin Park"),
             ("UAT & Training", "completed", -80, -75, "David Chen"),
             ("Go-Live", "completed", -30, -28, "David Chen"),
             ("Hypercare & Closure", "completed", -5, -3, "David Chen")],
            [], None)

        # 10. MUNSON'S PICKLES POWER BI (completed)
        opp10 = make_opp("Munson's Pickles Analytics Platform", "Munson's Pickles & Preserves", "Erik Munson", "e.munson@munsons.com",
                          "closed_won", 920_000, 100, "Microsoft Fabric and Power BI enterprise analytics replacing on-premises SSRS and Excel reporting.",
                          "Americas", "Food Manufacturing", "Priya Nair")
        db.flush()
        c10 = make_contract(opp10.id, "Munson's Pickles - Fabric & Power BI Analytics", "Munson's Pickles & Preserves",
            "Microsoft Fabric Lakehouse implementation ingesting data from ERP, MES, and supply chain systems. Power BI certified dataset strategy replacing 300+ Excel reports.",
            [("Microsoft Fabric Implementation", 120), ("Power BI Enterprise Deployment", 100), ("Data Governance with Purview", 40)],
            -240, 8, "Priya Nair")
        make_handoff(c10.id,
            "Erik Munson (owner-operator) wants real-time production and sales visibility on his tablet. Very practical vision — no over-engineering.",
            ["Real-time production dashboard for plant floor", "CFO financial dashboard replacing 40 Excel reports"],
            ["Production KPIs refreshing < 5 minutes", "CFO signs off on data accuracy vs. GL"],
            ["MES system has no API — requires ODBC connector"],
            ["Client has very limited IT staff — 2 people total"],
            ["Fabric Direct Lake for production data — no data warehouse layer needed", "Mobile-first Power BI design"],
            "Keep it simple. Erik wants a tablet dashboard, not an enterprise analytics program. Scope creep is the #1 risk — say no to anything not in the SOW.",
            "Priya Nair", "Sophie Laurent",
            [("Erik Munson", "Owner / CEO", "e.munson@munsons.com", "sponsor")],
            days_back=10)
        make_project(c10.id, "Munson's Pickles Fabric & Power BI", "Munson's Pickles & Preserves",
            "Sophie Laurent", "Raj Patel",
            "green", "green", "green", "green", "green", "green",
            "completed", -240, 8, 920_000, 890_000, 100, "close",
            "Project delivered on time and under budget. Production dashboard live. Erik Munson gave 10/10 CSAT. Reference customer secured.",
            [("Fabric Lakehouse Foundation", "completed", -200, -198, "Sophie Laurent"),
             ("ERP & MES Data Pipelines", "completed", -160, -156, "Raj Patel"),
             ("Production Dashboard (Tablet)", "completed", -120, -117, "Sophie Laurent"),
             ("CFO Financial Dashboard", "completed", -80, -77, "Sophie Laurent"),
             ("Power BI Governance & Certification", "completed", -40, -37, "Sophie Laurent"),
             ("Training & Go-Live", "completed", -10, -8, "Sophie Laurent")],
            [], None)

        # 11. VANARSDEL AI PLATFORM (completed)
        opp11 = make_opp("VanArsdel Copilot & AI Platform", "VanArsdel Ltd", "Helen Brooks", "h.brooks@vanarsdel.com",
                          "closed_won", 1_400_000, 100, "M365 Copilot for 8,000 users plus custom Azure OpenAI agents for legal contract review and procurement.",
                          "APAC", "Industrial Manufacturing", "Priya Nair")
        db.flush()
        c11 = make_contract(opp11.id, "VanArsdel - Copilot Deployment & Custom AI Agents", "VanArsdel Ltd",
            "M365 Copilot deployment for 8,000 seats with governance and adoption program, plus 2 custom Azure OpenAI agents: legal contract review assistant and procurement spend analysis agent.",
            [("Microsoft Copilot Deployment", 8000), ("Azure AI Studio - Custom Agent", 80), ("AI Governance & Responsible AI", 40)],
            -300, 10, "Priya Nair")
        make_handoff(c11.id,
            "VanArsdel's General Counsel drove this initiative after seeing a competitor use AI for contract review. The CIO is supportive but cautious on data privacy.",
            ["8,000 Copilot users active and productive by go-live + 60 days", "Legal contract review agent in production"],
            ["Copilot usage rate > 60% at 90 days", "Legal agent reduces contract review time by 50%"],
            ["Legal data privacy requirements restrict which documents can be processed by AI"],
            ["Legal team is skeptical — contract review agent needs validation by external counsel"],
            ["Copilot with SharePoint Restricted Content Discoverability for legal docs", "Legal agent on private Azure OpenAI deployment (no public endpoint)"],
            "Legal team skepticism is the cultural risk. Involve external counsel early in legal agent validation. Copilot adoption needs executive air cover — get CIO to do a launch video.",
            "Priya Nair", "James Osei",
            [("Helen Brooks", "General Counsel", "h.brooks@vanarsdel.com", "sponsor"), ("Bob Yamada", "CIO", "b.yamada@vanarsdel.com", "champion")],
            days_back=10)
        make_project(c11.id, "VanArsdel Copilot & AI Platform", "VanArsdel Ltd",
            "James Osei", "Felix Wagner",
            "green", "green", "green", "green", "green", "green",
            "completed", -300, 10, 1_400_000, 1_380_000, 100, "close",
            "Successfully delivered. 8,000 Copilot seats active. Legal agent in production with external counsel sign-off. Copilot adoption 68% at 90 days. Reference case study published.",
            [("Copilot Governance & Tenant Config", "completed", -270, -268, "James Osei"),
             ("Copilot Adoption Program", "completed", -200, -196, "James Osei"),
             ("Copilot Go-Live (8,000 seats)", "completed", -150, -147, "James Osei"),
             ("Legal Agent - Design & Privacy Review", "completed", -120, -116, "Felix Wagner"),
             ("Legal Agent - Build & Validation", "completed", -70, -67, "Felix Wagner"),
             ("Legal Agent - External Counsel Sign-off", "completed", -40, -38, "Felix Wagner"),
             ("Legal Agent Go-Live", "completed", -10, -8, "Felix Wagner")],
            [], None)

        # 12. LUCERNE PUBLISHING ZERO TRUST (on_hold)
        opp12 = make_opp("Lucerne Publishing Zero Trust", "Lucerne Publishing", "Stefan Gruber", "s.gruber@lucerne.com",
                          "closed_won", 1_100_000, 100, "Zero Trust architecture implementation covering identity, devices, and network for a global publishing house.",
                          "EMEA", "Media & Publishing", "Elena Vasquez")
        db.flush()
        c12 = make_contract(opp12.id, "Lucerne Publishing - Zero Trust Architecture", "Lucerne Publishing",
            "Implement Zero Trust architecture across identity (Entra ID + PIM), devices (Intune + Defender for Endpoint), and network (Conditional Access, ZTNA). Covers 5,000 users across 12 countries.",
            [("Zero Trust Assessment", 1), ("Identity & Access Management", 120), ("Microsoft Defender XDR", 80)],
            -80, 12, "Elena Vasquez")
        make_handoff(c12.id,
            "Lucerne Publishing was the victim of a phishing attack that cost €2M. The board mandated Zero Trust within 18 months. CFO controls budget tightly.",
            ["Zero Trust architecture fully operational across all 5,000 users", "Phishing simulation failure rate < 5%"],
            ["Conditional Access policies blocking 99.9% of unauthorized access attempts"],
            ["Legacy identity infrastructure in 3 acquired companies not yet integrated into Entra ID"],
            ["CFO put the project on hold once already due to budget — risk of repeat"],
            ["Conditional Access over legacy VPN — aligns with remote-first workforce"],
            "The project was put on hold once. Budget sensitivity is real — track spend weekly and flag any risk of overrun immediately. The CFO (Stefan Gruber) requires monthly budget reports.",
            "Elena Vasquez", "Fatima Al-Hassan",
            [("Stefan Gruber", "CFO / Sponsor", "s.gruber@lucerne.com", "sponsor")],
            days_back=70)
        make_project(c12.id, "Lucerne Publishing Zero Trust", "Lucerne Publishing",
            "Fatima Al-Hassan", "Maria Delgado",
            "amber", "green", "amber", "amber", "amber", "amber",
            "on_hold", -80, 12, 1_100_000, 320_000, 32, "execute",
            "Project placed on hold by client on April 15 pending budget re-approval for FY2027. Delivery was progressing well (Phase 1 identity complete). Restart expected June 2026 pending CFO approval.",
            [("Zero Trust Assessment & Roadmap", "completed", -70, -68, "Fatima Al-Hassan"),
             ("Phase 1: Identity (Entra ID + PIM)", "completed", -40, -38, "Maria Delgado"),
             ("Phase 2: Devices (Intune + Defender)", "in_progress", 30, None, "Maria Delgado"),
             ("Phase 3: Network (ZTNA + Conditional Access)", "not_started", 90, None, "Fatima Al-Hassan"),
             ("Phishing Simulation & Training", "not_started", 150, None, "Fatima Al-Hassan"),
             ("Zero Trust Go-Live & Validation", "not_started", 200, None, "Fatima Al-Hassan")],
            [("risk", "Project Hold Could Extend", "CFO budget approval for restart is pending. If not approved by June, resource reallocation may be necessary.", "high", "medium", "open", "Elena Vasquez", 45, "Bi-weekly check-in with Stefan Gruber; executive sponsor engagement"),
             ("issue", "Acquired Company Identity Not Integrated", "3 acquired companies have separate AD tenants not yet merged into Entra ID. Phase 2 is blocked until identity consolidation is complete.", "high", None, "open", "Fatima Al-Hassan", 60, "Identity consolidation plan to be scoped as separate work item")],
            None)

        # 13. MARGIE'S TRAVEL COPILOT (on_hold)
        opp13 = make_opp("Margie's Travel Copilot Rollout", "Margie's Travel", "Fiona Gallagher", "f.gallagher@margies.com",
                          "closed_won", 680_000, 100, "M365 Copilot deployment for 3,500 travel consultants with custom travel planning prompt library.",
                          "Americas", "Travel & Hospitality", "Michael Torres")
        db.flush()
        c13 = make_contract(opp13.id, "Margie's Travel - M365 Copilot Deployment", "Margie's Travel",
            "M365 Copilot for 3,500 travel consultants including governance framework, prompt engineering workshop, custom travel planning copilot library, and 90-day adoption program.",
            [("Microsoft Copilot Deployment", 3500), ("AI Governance & Responsible AI", 20)],
            -50, 6, "Michael Torres")
        make_handoff(c13.id,
            "Margie's CEO wants Copilot to help consultants book 20% more travel per day without adding headcount. Very clear ROI metric.",
            ["3,500 consultants active on Copilot within 60 days of go-live", "Measurable 15%+ booking productivity improvement"],
            ["Productivity measurement dashboard live by Day 30 post go-live"],
            ["Microsoft 365 licensing not fully compliant — some users on E1 (not eligible for Copilot)"],
            ["Client's IT team is 2 people — limited bandwidth for tenant configuration support"],
            ["Custom travel planning prompt library as differentiator — Copilot Studio for custom agents"],
            "License remediation must happen before deployment. IT team bandwidth is the constraint — give them a very detailed pre-work checklist.",
            "Michael Torres", "Aisha Okonkwo",
            [("Fiona Gallagher", "CEO", "f.gallagher@margies.com", "sponsor")],
            days_back=40)
        make_project(c13.id, "Margie's Travel Copilot Deployment", "Margie's Travel",
            "Aisha Okonkwo", "Jake Morrison",
            "amber", "amber", "green", "amber", "green", "green",
            "on_hold", -50, 6, 680_000, 95_000, 18, "plan",
            "Project on hold since April 1. Client discovered 800 users on E1 licenses (ineligible for Copilot). License upgrade procurement in process. Restart expected mid-May 2026.",
            [("Tenant Readiness & License Audit", "completed", -40, -38, "Aisha Okonkwo"),
             ("Copilot Governance Framework", "in_progress", 15, None, "Aisha Okonkwo"),
             ("Prompt Library Development", "not_started", 30, None, "Jake Morrison"),
             ("Pilot (100 users)", "not_started", 45, None, "Aisha Okonkwo"),
             ("Full Rollout (3,400 users)", "not_started", 75, None, "Aisha Okonkwo"),
             ("Adoption Program & Closure", "not_started", 130, None, "Aisha Okonkwo")],
            [("issue", "800 Users on Ineligible E1 Licenses", "License upgrade procurement in process. Deployment cannot proceed until resolved.", "high", None, "open", "Fiona Gallagher", 20, "License upgrade PO submitted April 28; expected delivery May 15")],
            None)

        # 14. CONTOSO SPORTS D365 CE (cancelled)
        opp14 = make_opp("Contoso Sports D365 CE", "Contoso Sports Network", "Derek Hunt", "d.hunt@contoso-sports.com",
                          "closed_won", 890_000, 100, "D365 Customer Engagement implementation for a sports media company.",
                          "EMEA", "Media & Entertainment", "James Park")
        db.flush()
        c14 = make_contract(opp14.id, "Contoso Sports - D365 Customer Engagement", "Contoso Sports Network",
            "D365 Sales and Marketing implementation for a sports rights and media company.",
            [("Dynamics 365 Sales Implementation", 140), ("Dynamics Data Migration", 60), ("Power Platform Center of Excellence", 40)],
            -200, 8, "James Park")
        make_handoff(c14.id,
            "Contoso Sports wants D365 to manage their 500+ media rights partnerships and sponsorship pipeline.",
            ["D365 Sales live for 200 sales users", "Media rights contract tracking in D365"],
            ["Full Salesforce migration with zero data loss"],
            ["Complex many-to-many relationship model for media rights — may require custom data model"],
            ["Client underwent a leadership change — new CRO has different priorities"],
            ["Custom media rights entity model in D365", "PowerApps portal for partner self-service"],
            "Leadership change is the key risk. Secure commitment from new CRO in Week 1.",
            "James Park", "David Chen",
            [("Derek Hunt", "CRO", "d.hunt@contoso-sports.com", "sponsor")],
            completed=False, days_back=150)
        make_project(c14.id, "Contoso Sports D365 CE", "Contoso Sports Network",
            "David Chen", "Kevin Park",
            "red", "red", "red", "red", "red", "red",
            "cancelled", -200, 8, 890_000, 340_000, 28, "execute",
            "Project cancelled by client on March 15, 2026 following acquisition by a larger media group. Acquirer has existing Salesforce mandate. Formal closure completed. Lessons learned documented.",
            [("Discovery & Design", "completed", -180, -175, "David Chen"),
             ("D365 Configuration - Phase 1", "completed", -140, -135, "Kevin Park"),
             ("Data Migration Prep", "in_progress", -100, None, "Kevin Park"),
             ("Project Cancelled", "completed", -50, -50, "David Chen")],
            [], None)

        db.commit()
        opp_count = db.query(Opportunity).count()
        proj_count = db.query(DeliveryProject).count()
        active_pipeline = sum(o.estimated_value for o in db.query(Opportunity).all() if o.stage not in ("closed_won", "closed_lost"))
        print("✓ Database seeded successfully.")
        print(f"  - {len(services_data)} services in catalog")
        print(f"  - {opp_count} opportunities ({len([o for o in db.query(Opportunity).all() if o.stage not in ('closed_won','closed_lost')])} active)")
        print(f"  - Active pipeline: ${active_pipeline:,.0f}")
        print(f"  - {proj_count} delivery projects")

    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed()
