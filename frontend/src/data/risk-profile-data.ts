import { ContentBlock } from './sow-data';

export type RiskSectionType = 'brief' | 'standard' | 'precedent' | 'agents' | 'signals';

export interface RiskSection {
  id: string;
  number: string;
  title: string;
  sectionType: RiskSectionType;
  dimensionKey?: string;
  content: ContentBlock[];
}

export interface RiskDimension {
  key: string;
  label: string;
  weight: string;
  score: number;
  strength: string;
  gaps: string[];
  recommendation: string;
}

export interface ReferenceProject {
  name: string;
  industry: string;
  year: number;
  outcome: 'success' | 'partial' | 'failed';
  relevance: 'High' | 'Medium';
  lesson: string;
}

export interface AgentMatch {
  name: string;
  role: string;
  credits: Array<{ project: string; csat: number }>;
  industries: string[];
  availability: string;
  regions: string[];
}

export interface MarketSignal {
  feed: string;
  alert: string;
  severity: 'info' | 'warning' | 'critical';
  date: string;
  dimension: string;
}

export interface ExecutiveBrief {
  riskTier: 'Low Risk' | 'Managed Risk' | 'Elevated Risk' | 'High Risk' | 'Critical Risk';
  headlineRisk: string;
  precedentSignal: string;
  deliveryConfidence: string;
  marketContext: string;
  decisionGuidance: string;
}

export interface RiskAlignmentFlag {
  label: string;
  status: 'ok' | 'warning';
  detail?: string;
}

export interface RiskProfileData {
  compositeScore: number;
  executiveBrief: ExecutiveBrief;
  sections: RiskSection[];
  dimensions: RiskDimension[];
  referenceProjects: ReferenceProject[];
  agentMatches: AgentMatch[];
  marketSignals: MarketSignal[];
  alignmentFlags: RiskAlignmentFlag[];
}

export function riskTierFromScore(s: number): ExecutiveBrief['riskTier'] {
  if (s >= 8.5) return 'Low Risk';
  if (s >= 7.0) return 'Managed Risk';
  if (s >= 5.5) return 'Elevated Risk';
  if (s >= 4.0) return 'High Risk';
  return 'Critical Risk';
}

export function riskColor(s: number) {
  if (s >= 8.5) return { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'Low Risk' };
  if (s >= 7.0) return { dot: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', badge: 'Managed Risk' };
  if (s >= 5.5) return { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', badge: 'Elevated Risk' };
  if (s >= 4.0) return { dot: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', badge: 'High Risk' };
  return { dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', badge: 'Critical Risk' };
}

export const RISK_PROFILE_DATA: Record<string, RiskProfileData> = {

  // ─── 1. FOURTH COFFEE CORPORATION ────────────────────────────────────────
  'Fourth Coffee Corporation': {
    compositeScore: 5.5,
    executiveBrief: {
      riskTier: 'Elevated Risk',
      headlineRisk: 'High delivery complexity across 210 workloads in three migration tracks, compounded by EMEA geographic scope and a new client relationship with no CRM delivery history.',
      precedentSignal: '88% delivery success rate on 4 comparable migrations. Key lesson from Northwind Retailers DC Exit: EMEA waves ran 4 months late due to unresolved data residency questions — same risk is present here.',
      deliveryConfidence: 'James Holwerda (Migration Lead, CSAT 4.3 on Adatum Foundation) is the strongest available match. EMEA delivery presence needs confirmation — no local confirmed resource on file.',
      marketContext: 'Azure migration demand is at peak across Americas and EMEA. Team capacity for large DC exit programs is constrained — competing pipeline pressure on the migration practice.',
      decisionGuidance: 'Approve with two hard conditions: (1) EMEA local delivery resource confirmed before contract signature; (2) workload inventory locked and EMEA data residency pre-cleared before Phase 2 begins.',
    },
    sections: [
      {
        id: 'executive-brief', number: '1.', title: 'Executive Risk Brief',
        sectionType: 'brief',
        content: [
          { t: 'p', text: 'This is an Elevated Risk engagement. The deal is commercially sound and strategically strong, but the delivery complexity of 210 workloads across Americas and EMEA — combined with a new client relationship and Avanade subcontractor coordination — creates a meaningful execution risk picture that requires active management at approval.' },
          { t: 'p', text: 'The deal should proceed to approval with named conditions. The two risk items that must be resolved before contract execution are (1) EMEA local delivery resource confirmation and (2) EMEA data residency pre-clearance. Both are manageable; neither is a deal-stopper if addressed promptly.' },
        ],
      },
      {
        id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment',
        sectionType: 'standard', dimensionKey: 'delivery_complexity',
        content: [
          { t: 'p', text: 'The migration factory covers 210 workloads across three technical tracks: 120 Lift-Shift (straightforward but volume-intensive), 60 Refactor (moderate technical complexity per workload), and 30 Greenfield (net-new cloud-native builds, highest per-unit complexity). Running all three tracks in parallel across Americas and EMEA is the primary complexity driver.' },
          { t: 'bullets', items: [
            'Wave structure: 6 waves of 35 workloads each — manageable in isolation, but EMEA waves 5–6 carry residency and coordination overhead',
            'Refactor track requires containerization expertise and PaaS conversion skills — distinct from Lift-Shift capabilities',
            'Greenfield track (30 workloads) is the highest per-unit complexity and has the least comparable precedent in this engagement type',
            '18-month timeline leaves 2–3 weeks of float per wave — tight but not unreasonable for this scale',
          ]},
        ],
      },
      {
        id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment',
        sectionType: 'standard', dimensionKey: 'client_readiness',
        content: [
          { t: 'p', text: 'Fourth Coffee is a new logo with no prior Microsoft PS delivery history. The VP of IT Infrastructure is the named sponsor — a functional lead rather than a C-suite sponsor, which limits escalation authority and organizational change capacity for a program of this scope.' },
          { t: 'bullets', items: [
            'Client IT team commitment of 2 FTE is appropriate for the migration phase but may be insufficient during EMEA waves when Americas waves are still in hypercare',
            'No change management function has been mentioned — for a 210-workload migration with FinOps culture change, this is a gap',
            'Decision velocity is unknown (new logo) — client review cycles and approval speed are unproven at this scale',
            'Positive signal: client initiated this engagement with a clear mandate to exit the data center — executive alignment on the direction is strong even if sponsorship level is mid-tier',
          ]},
        ],
      },
      {
        id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment',
        sectionType: 'standard', dimensionKey: 'commercial_structure',
        content: [
          { t: 'p', text: '28% sold margin is adequate for a high-volume migration at this scale, particularly with Avanade absorbing 20% of effort under Microsoft\'s commercial risk umbrella. The 15% ECIF commitment on Phase 1 creates a structured landing zone investment that lowers early-phase commercial exposure.' },
          { t: 'bullets', items: [
            'Volume discount applied correctly — commercial desk has confirmed the tier (per AI condition)',
            'Change order mechanism is defined in SOW — commercial protection is in place for scope additions',
            'Risk: if EMEA waves encounter data residency complications requiring additional legal work, the fixed-fee structure has limited buffer at 28% margin',
            'Positive: Avanade commercial risk is fully absorbed — Microsoft is not sharing upside with the subcontractor but is carrying the delivery risk, which is appropriate at this margin level',
          ]},
        ],
      },
      {
        id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment',
        sectionType: 'standard', dimensionKey: 'execution_resourcing',
        content: [
          { t: 'bullets', items: [
            '4 comparable large-scale Azure migrations completed — delivery success rate 88%, above the 80% threshold for standard approval',
            'Microsoft Engagement Director and Solution Architect roles are confirmed; Migration Lead (Phase 2) and FinOps Architect (Phase 3) are not yet named',
            'Avanade team: resource commitment letter required before Phase 2 — currently outstanding (per SOW assumption)',
            'EMEA delivery: no local Microsoft PS resource confirmed for EMEA waves — this is the single highest execution risk item',
            'Key-person risk: if the Engagement Director is reallocated mid-program, the Avanade governance model loses its anchor',
          ]},
        ],
      },
      {
        id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment',
        sectionType: 'standard', dimensionKey: 'regulatory_compliance',
        content: [
          { t: 'p', text: 'No named regulatory requirements apply to this engagement. EMEA data residency is treated as an assumption (client asserts compliance) rather than a verified regulatory condition — which represents an unmitigated risk but not a regulatory delivery burden.' },
          { t: 'bullets', items: [
            'No GDPR, FFIEC, HIPAA, or SOX requirements in scope',
            'EMEA data residency: client asserts no new barriers — but this is unverified and EMEA workloads are scheduled last, giving time to surface issues',
            'No AI governance requirements (no AI in delivery scope)',
          ]},
        ],
      },
      {
        id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment',
        sectionType: 'standard', dimensionKey: 'partner_ecosystem',
        content: [
          { t: 'bullets', items: [
            'Avanade participation: 20% of effort — within the Managed Risk threshold for a known partner',
            'Avanade has 3+ comparable DC exit migrations with Microsoft PS; performance rated 4.0/5.0 on most recent comparable',
            'Avanade subcontract SLA is defined in the deal conditions — regulatory-aware configuration standard requirement is appropriate',
            'Risk: Avanade governance protocol in the SOW is thin — their reporting line and Microsoft PM authority over their scope is not fully documented',
            'No third-party technology dependencies that create platform risk',
          ]},
        ],
      },
      {
        id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment',
        sectionType: 'standard', dimensionKey: 'technology_maturity',
        content: [
          { t: 'bullets', items: [
            'Azure Migrate, Azure Site Recovery (ASR), and Azure Arc: all GA and production-proven at comparable scale',
            'Azure Landing Zone (hub-spoke): fully mature, templated delivery — no risk',
            'FinOps tooling (Azure Cost Management, FinOps hub): GA and well-established in comparable engagements',
            'No preview features in critical path — low technology maturity risk overall',
            'Refactor track (containerization to AKS): AKS is mature but containerization of legacy workloads carries per-workload discovery risk',
          ]},
        ],
      },
      {
        id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence',
        sectionType: 'precedent',
        content: [
          { t: 'p', text: 'Three comparable large-scale Azure migration programs were retrieved. The partial outcome on Northwind Retailers DC Exit is the most relevant precedent — the root cause (unresolved EMEA data residency) is directly applicable to this engagement.' },
        ],
      },
      {
        id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence',
        sectionType: 'agents',
        content: [
          { t: 'p', text: 'Two delivery agents with comparable Azure DC exit experience are available within the engagement timeline. EMEA regional coverage is the gap — no agent with EMEA-specific large-scale migration experience is currently identified as available.' },
        ],
      },
      {
        id: 'market-signals', number: '11.', title: 'Market Signal Alerts',
        sectionType: 'signals',
        content: [
          { t: 'p', text: 'One active market signal is affecting this engagement. Review the capacity signal before finalizing the team composition.' },
        ],
      },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 4.0,
        strength: 'Three-track migration structure (Lift-Shift, Refactor, Greenfield) is well-organized and leverages proven Azure Migrate tooling for the majority of workloads.',
        gaps: ['EMEA geographic scope adds coordination, timezone, and potential data residency overhead not fully captured in the complexity rating', 'Greenfield track (30 workloads) has the least precedent in comparable DC exit engagements — per-workload variance is high'],
        recommendation: 'Lock Greenfield workload specifications in Phase 1 before migration waves begin. Consider a separate risk register entry for Greenfield track per-workload variance.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 5.5,
        strength: 'Strong executive alignment on the strategic direction (data center exit) despite mid-tier sponsorship level — the mandate is clear even if the sponsor is not C-suite.',
        gaps: ['No change management function identified for FinOps culture adoption', 'Decision velocity is unknown (new logo) — first delayed decision in Phase 2 could cascade across waves'],
        recommendation: 'Request client to designate a FinOps adoption lead before Phase 3 begins. Establish a decision SLA in the governance plan (client decisions required within 5 business days).' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 7.5,
        strength: '28% margin with Avanade absorbed and ECIF protection on Phase 1 is a well-structured commercial position for this scale.',
        gaps: ['EMEA legal complications could erode margin if the residency issue requires unplanned advisory work'],
        recommendation: 'Include a 2% contingency reserve in the financial model for EMEA residency resolution costs.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 6.0,
        strength: '88% delivery success rate on 4 comparable migrations is above threshold. James Holwerda is a strong Migration Lead match with recent comparable experience.',
        gaps: ['EMEA local resource not confirmed — the highest single execution risk item', 'Avanade resource commitment letter is outstanding'],
        recommendation: 'EMEA local resource confirmation is a hard gate for contract execution. Block Phase 2 kickoff until the Avanade commitment letter is received.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '10%', score: 9.5,
        strength: 'No regulatory requirements apply. Lowest risk dimension in this deal.',
        gaps: ['EMEA data residency is an assumption, not a verified compliance position'],
        recommendation: 'Require client legal confirmation of EMEA data residency compliance as a Month 1 Phase 1 gate deliverable.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 6.0,
        strength: 'Avanade is a known partner with comparable delivery history; commercial risk is fully absorbed by Microsoft.',
        gaps: ['Avanade governance protocol is insufficiently defined in the SOW', 'No Avanade EMEA resource confirmed to handle the local waves'],
        recommendation: 'Add a 1-page Avanade governance protocol before contract execution: meeting cadence, reporting format, Microsoft PM authority over Avanade scope decisions.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 8.5,
        strength: 'All platform components are GA and production-proven. No preview features in critical path. AKS containerization is the only area requiring per-workload assessment.',
        gaps: ['Containerization of legacy workloads (Refactor track) requires per-workload discovery that can surface compatibility issues late in the wave'],
        recommendation: 'Build a containerization compatibility assessment into the Phase 1 workload inventory gate for all Refactor-track workloads.' },
    ],
    referenceProjects: [
      { name: 'Adatum Cloud Foundation', industry: 'Professional Services', year: 2024, outcome: 'success', relevance: 'High', lesson: 'Landing Zone templating and Avanade coordination worked well when MS PM held weekly joint syncs. Success attributed to early workload inventory lock (Week 1).' },
      { name: 'Northwind Retailers DC Exit', industry: 'Retail', year: 2023, outcome: 'partial', relevance: 'High', lesson: 'EMEA waves ran 4 months late due to EU data residency review initiated in Month 10 rather than Month 1. Same risk present in this engagement — EMEA residency assumed but unverified.' },
      { name: 'Bellows College Azure Campus', industry: 'Education', year: 2025, outcome: 'success', relevance: 'Medium', lesson: 'Multi-track migration (Lift-Shift + Refactor) succeeded when Refactor criteria were locked in a Phase 1 workload classification gate. Without this gate, track assignment disputes delayed Wave 2.' },
    ],
    agentMatches: [
      { name: 'James Holwerda', role: 'Azure Migration Lead', credits: [{ project: 'Adatum Cloud Foundation', csat: 4.3 }, { project: 'Bellows College Azure Campus', csat: 4.5 }], industries: ['Retail', 'Education', 'Professional Services'], availability: 'Available from Month 1', regions: ['Americas'] },
      { name: 'Sofia Delgado', role: 'FinOps Architect', credits: [{ project: 'Adatum Cloud Foundation', csat: 4.1 }], industries: ['Retail', 'Manufacturing'], availability: 'Available from Month 12 (Phase 3)', regions: ['Americas', 'EMEA'] },
    ],
    marketSignals: [
      { feed: 'Migration Practice Capacity Index', alert: 'Azure DC exit pipeline demand is at 18-month high across Americas. Team capacity for large programs (>150 workloads) is under pressure — 3 competing programs in the queue.', severity: 'warning', date: 'May 2026', dimension: 'Execution & Resourcing' },
    ],
    alignmentFlags: [
      { label: 'Delivery Success Rate vs. Precedent Evidence', status: 'ok' },
      { label: 'EMEA Risk → Risk Register', status: 'warning', detail: 'EMEA data residency risk is in the SOW assumptions but has no entry in the deal risk register.' },
      { label: 'Avanade Protocol → Governance', status: 'warning', detail: 'Avanade governance protocol is defined as a condition but not yet documented.' },
      { label: 'ECIF → Commercial Terms', status: 'ok' },
    ],
  },

  // ─── 2. A. DATUM CORPORATION ─────────────────────────────────────────────
  'A. Datum Corporation': {
    compositeScore: 7.5,
    executiveBrief: {
      riskTier: 'Managed Risk',
      headlineRisk: 'Well-contained security transformation with strong playbook leverage and no vendor dilution. Primary risk is legacy system Conditional Access compatibility, which requires a Phase 1 discovery gate.',
      precedentSignal: '92% delivery success rate on 5 comparable Zero Trust engagements. No failures in this service line. Proseware SOC Modernization is the closest match — identical technology stack, 94% CSAT.',
      deliveryConfidence: 'Priya Nakamura (Zero Trust Architect, CSAT 4.4 on Proseware) and Marcus Chen (Sentinel/SOAR Architect, CSAT 4.6) are both confirmed available. Strongest delivery team match in the current portfolio.',
      marketContext: 'Zero Trust market: Stable. Microsoft Entra ID and Sentinel are both fully mature GA products. No technology maturity risk. Board-mandate engagements in this service line have the highest first-pass approval rate in our portfolio.',
      decisionGuidance: 'Recommend approval without conditions. Confirm licensing pre-verification in Phase 1 Assessment. Legacy system compatibility audit is a standard Phase 1 gate — no blocker.',
    },
    sections: [
      {
        id: 'executive-brief', number: '1.', title: 'Executive Risk Brief',
        sectionType: 'brief',
        content: [
          { t: 'p', text: 'This is a Managed Risk engagement — the strongest risk profile in the current pending portfolio. The Zero Trust service line is Microsoft PS\'s highest-confidence delivery track: mature playbooks, experienced delivery team, proven technology, and a board-mandate sponsorship that creates the organizational readiness conditions for success.' },
          { t: 'p', text: 'The primary risk items are procedural: licensing pre-verification and legacy system Conditional Access compatibility. Both are standard Phase 1 gate activities, not deal-level risks.' },
        ],
      },
      {
        id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment',
        sectionType: 'standard', dimensionKey: 'delivery_complexity',
        content: [
          { t: 'p', text: '6,500 seats across four phases is a large-scale but well-structured deployment. All four platform components (Entra ID, Sentinel, Defender XDR, SOAR) have established delivery playbooks with >5 comparable deployments each.' },
          { t: 'bullets', items: [
            'Entra ID PIM + Conditional Access: fully templated delivery, 45-connector Sentinel deployment is volume-intensive but not complex',
            'SOAR automation: the only component requiring custom development (playbook authoring) — manageable within Phase 3 scope',
            'Responsible AI guardrails: new addition to the standard ZT playbook — adds a small governance design component with no comparable precedent in ZT engagements',
            'No data migration, no SAP integration, no multi-country scope — complexity ceiling is medium despite 6,500-seat scale',
          ]},
        ],
      },
      {
        id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment',
        sectionType: 'standard', dimensionKey: 'client_readiness',
        content: [
          { t: 'bullets', items: [
            'Board mandate: highest sponsorship signal — the CISO has full organizational authority and budget to execute',
            'Client dedicated security architect (0.5 FTE): appropriate commitment for a 10-month ZT program',
            'A. Datum\'s parent group (12 subsidiaries): positive signal — success here creates expansion potential and the client is motivated to deliver a reference-quality outcome',
            'Decision velocity: board-mandate engagements have historically fast decision cycles — no historical red flags in CRM',
          ]},
        ],
      },
      {
        id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment',
        sectionType: 'standard', dimensionKey: 'commercial_structure',
        content: [
          { t: 'bullets', items: [
            '35% margin is the highest in the current pending portfolio — excellent commercial position',
            'Fixed fee with no vendor: simplest commercial structure, no dilution risk, no subcontractor commercial exposure',
            'No ECIF complexity — clean billing structure',
            'SOAR playbook legal review requirement adds a 3-5 day approval dependency per playbook — not a commercial risk but a scheduling consideration',
          ]},
        ],
      },
      {
        id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment',
        sectionType: 'standard', dimensionKey: 'execution_resourcing',
        content: [
          { t: 'bullets', items: [
            '5 comparable ZT + Security engagements with 92% delivery success rate — highest confidence service line',
            'Priya Nakamura and Marcus Chen confirmed available — both have directly comparable delivery credits',
            'No key-person risk: the ZT and Sentinel playbooks are team-held knowledge, not individual-dependent',
            'Pure Microsoft PS delivery — no subcontractor coordination overhead',
          ]},
        ],
      },
      {
        id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment',
        sectionType: 'standard', dimensionKey: 'regulatory_compliance',
        content: [
          { t: 'bullets', items: [
            'No regulatory requirements apply',
            'SOAR automated remediation actions require client legal review — this is a governance control, not a regulatory compliance burden',
            'Responsible AI guardrails are a delivery practice requirement, not a regulatory mandate — manageable within Phase 4',
          ]},
        ],
      },
      {
        id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment',
        sectionType: 'standard', dimensionKey: 'partner_ecosystem',
        content: [
          { t: 'bullets', items: [
            'No subcontractor — purest possible delivery structure',
            'No third-party technology dependencies beyond the Microsoft platform stack',
            'All 45 Sentinel data connectors are Microsoft-native or Microsoft-certified — no unsupported connector risk',
          ]},
        ],
      },
      {
        id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment',
        sectionType: 'standard', dimensionKey: 'technology_maturity',
        content: [
          { t: 'bullets', items: [
            'Microsoft Entra ID P2, Sentinel, Defender XDR, Intune: all fully GA with production-proven deployment at comparable scale',
            'SOAR platform (Sentinel Logic Apps): GA and well-understood by the delivery team',
            'Responsible AI governance tooling: Microsoft\'s RAI toolkit is available but the integration into a ZT SOC context has <2 comparable deployments',
            'No preview features in critical path',
          ]},
        ],
      },
      {
        id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence',
        sectionType: 'precedent',
        content: [
          { t: 'p', text: 'Five comparable Zero Trust and security transformation engagements retrieved. No failures in this service line. The Wingtip Financial SIEM Migration partial outcome is the only cautionary precedent — caused by client-side leadership change, not a delivery execution failure.' },
        ],
      },
      {
        id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence',
        sectionType: 'agents',
        content: [
          { t: 'p', text: 'Two agents are confirmed available with directly comparable delivery credits. This is the strongest team match in the current pending portfolio.' },
        ],
      },
      {
        id: 'market-signals', number: '11.', title: 'Market Signal Alerts',
        sectionType: 'signals',
        content: [
          { t: 'p', text: 'No adverse market signals. Zero Trust demand is strong and stable. Microsoft platform is fully GA.' },
        ],
      },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 7.0, strength: 'Four-phase structure is clean and well-sequenced. All components have mature delivery playbooks.', gaps: ['Responsible AI guardrails for SOC context has <2 comparable precedents — scope is small but novel'], recommendation: 'Define RAI framework acceptance criteria explicitly in Phase 4 deliverable spec before engagement starts.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 8.5, strength: 'Board mandate with CISO authority and parent-group expansion potential creates ideal sponsorship conditions.', gaps: ['12-subsidiary expansion potential also means stakeholder landscape is larger than a standalone engagement'], recommendation: 'Identify two additional A. Datum stakeholders (IT Director level) in Phase 1 to build multi-stakeholder alignment before Phase 2.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 9.0, strength: '35% margin, no vendor, fixed fee — the cleanest commercial structure in the current portfolio.', gaps: ['SOAR playbook legal review dependency could slow Phase 3 if client legal team is slow to respond'], recommendation: 'Start SOAR playbook legal review process in Phase 2 (parallel to identity work) to avoid Phase 3 delay.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 8.0, strength: 'Priya Nakamura and Marcus Chen are confirmed available with directly comparable delivery credits. No subcontractor risk.', gaps: ['SOAR automation playbook authoring requires both ZT and Sentinel expertise simultaneously — role overlap risk in Phase 3'], recommendation: 'Confirm Phase 3 team has dedicated SOAR authoring resource alongside Sentinel deployment lead — do not rely on one person for both.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '10%', score: 9.0, strength: 'No regulatory requirements. Responsible AI is an internal practice standard, not an external mandate.', gaps: [], recommendation: 'No action required on regulatory dimension.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 9.5, strength: 'No partners. No third-party platform dependencies. Lowest possible partner risk.', gaps: [], recommendation: 'No action required.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 8.5, strength: 'All core platform components are fully GA. Sentinel 45-connector deployment is well-understood.', gaps: ['RAI toolkit integration into SOC context: <2 comparable deployments — minor technology novelty risk'], recommendation: 'Schedule a 2-day RAI integration design sprint in Phase 1 to validate the approach before Phase 4 commitment.' },
    ],
    referenceProjects: [
      { name: 'Proseware SOC Modernization', industry: 'Financial Services', year: 2025, outcome: 'success', relevance: 'High', lesson: 'Identical technology stack (Entra ID + Sentinel + Defender XDR). 94% CSAT. SOAR playbooks required 3 weeks of tuning post-go-live — build this buffer into Phase 3 timeline.' },
      { name: 'City Power & Light SOC Modernization', industry: 'Energy & Utilities', year: 2024, outcome: 'success', relevance: 'High', lesson: '40-connector Sentinel deployment completed on schedule when connectors were pre-qualified in Phase 1. Connectors not pre-qualified (7 of 40) caused a 2-week delay in Phase 3.' },
      { name: 'Wingtip Financial SIEM Migration', industry: 'Banking', year: 2024, outcome: 'partial', relevance: 'Medium', lesson: 'CISO departure at Month 5 required 6-week re-sponsorship process. Delivery paused during transition. Mitigation for A. Datum: CISO has board mandate — lower turnover risk, but an escalation plan for sponsor change should be documented.' },
      { name: 'Lamna Healthcare Azure & Security Foundation', industry: 'Healthcare', year: 2024, outcome: 'success', relevance: 'Medium', lesson: 'Responsible AI governance design added 3 weeks of scope in a comparable engagement when acceptance criteria were undefined at contract signature. Define RAI acceptance criteria before Phase 1 ends.' },
    ],
    agentMatches: [
      { name: 'Priya Nakamura', role: 'Zero Trust Architect', credits: [{ project: 'Proseware SOC Modernization', csat: 4.4 }, { project: 'City Power & Light SOC', csat: 4.3 }], industries: ['Financial Services', 'Energy'], availability: 'Confirmed available Month 1', regions: ['Americas', 'EMEA'] },
      { name: 'Marcus Chen', role: 'Sentinel & AI Lead', credits: [{ project: 'VanArsdel Copilot & AI Platform', csat: 4.6 }, { project: 'Proseware SOC Modernization', csat: 4.5 }], industries: ['Retail', 'Financial Services'], availability: 'Confirmed available Month 3', regions: ['Americas'] },
    ],
    marketSignals: [],
    alignmentFlags: [
      { label: 'Success Rate vs. Precedent Evidence', status: 'ok' },
      { label: 'Team Availability Confirmed', status: 'ok' },
      { label: 'RAI Scope → Technology Maturity', status: 'warning', detail: 'Responsible AI guardrails for SOC context has <2 comparable deployments — novelty risk is small but should be acknowledged at approval.' },
      { label: 'Commercial Structure → Margin', status: 'ok' },
    ],
  },

  // ─── 3. CONTOSO HOTELS & RESORTS ─────────────────────────────────────────
  'Contoso Hotels & Resorts': {
    compositeScore: 5.5,
    executiveBrief: {
      riskTier: 'Elevated Risk',
      headlineRisk: 'AI platform build at unprecedented scale (240 properties, 18 countries) using Azure AI Studio agent architecture that has only 2 comparable precedents. AI model performance against the +15% booking conversion target is the single highest-risk outcome in the current portfolio.',
      precedentSignal: '85% delivery success rate on 2 comparable AI platform engagements. Datum Corp AI Innovation Platform is the most relevant precedent — model underperformed its conversion target by 8% at go-live, requiring a 6-week optimization sprint. Same risk is present here.',
      deliveryConfidence: 'Marcus Chen (AI Lead, CSAT 4.6 on VanArsdel) is confirmed. The 240-property rollout requires 3 additional regional deployment specialists — not yet identified. GDPR privacy officer engagement is critical and not yet confirmed.',
      marketContext: 'Azure AI Studio agent architecture moved to GA in Q1 2026. Technology maturity improved, but multi-agent orchestration at 240-property scale is still first-of-class for hospitality. GDPR enforcement in EU hospitality has increased — 3 enforcement actions in the sector in 2025.',
      decisionGuidance: 'Approve with conditions: (1) AI model performance acceptance criteria defined before Phase 2 (not just at Phase 4); (2) GDPR Privacy Counsel written approval before Phase 1 exit; (3) 240-property rollout phased with explicit performance gates every 60 properties.',
    },
    sections: [
      { id: 'executive-brief', number: '1.', title: 'Executive Risk Brief', sectionType: 'brief', content: [{ t: 'p', text: 'This is an Elevated Risk engagement with flagship strategic importance. The 20% IOI commitment and $78K/month ACR potential make this a priority deal. The risk is not whether to approve, but what conditions must be in place to protect both the client outcome and the Microsoft delivery record on a first-of-class AI deployment at hospitality scale.' }] },
      { id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment', sectionType: 'standard', dimensionKey: 'delivery_complexity', content: [{ t: 'bullets', items: ['Three AI agents with distinct architectures (recommendation, NLP concierge, ML prediction) require different engineering disciplines in parallel', '240 properties across 18 countries: rollout complexity is the highest in the current portfolio by geographic scope', 'Two PMS system integrations: API stability risk if PMS vendors release updates during the 12-month engagement', 'Multi-language support (5 languages): NLP quality variance across languages requires separate validation per language', 'GDPR data residency architecture must be resolved before any EU property data is used for model training'] }] },
      { id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment', sectionType: 'standard', dimensionKey: 'client_readiness', content: [{ t: 'bullets', items: ['Chief Digital Officer as sponsor: appropriate for an AI-first digital transformation — strong executive visibility', 'Client has no prior AI agent deployment history — change management for 240 properties adopting AI-driven concierge is a significant organizational undertaking not fully scoped', 'No dedicated client change management function identified', 'Positive: 20% IOI commitment signals strong internal conviction and board-level alignment'] }] },
      { id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment', sectionType: 'standard', dimensionKey: 'commercial_structure', content: [{ t: 'bullets', items: ['34% margin is solid; IOI at 20% offset on Phase 1 reduces early-phase cash exposure', 'Azure OpenAI consumption ($78K/month) is client-owned — no infrastructure cost risk to Microsoft margin', 'Fixed fee on a 12-month AI build is moderately risky given AI model performance uncertainty — Phase 2 A/B gate mitigates but does not eliminate this', 'IOI approval memo not yet attached to SOW — commercial risk if conditions are disputed at invoicing'] }] },
      { id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment', sectionType: 'standard', dimensionKey: 'execution_resourcing', content: [{ t: 'bullets', items: ['Marcus Chen (AI architect, CSAT 4.6) is confirmed for Phase 1–3 — strong anchor', '240-property rollout (Phase 4) requires 3 regional deployment specialists not yet identified', 'Key-person risk: AI model training and validation is highly Marcus Chen-dependent in Phase 2–3', 'GDPR privacy officer engagement (client-side) is a critical Phase 1 dependency — if not confirmed by Month 1 Week 2, Phase 2 gate is at risk'] }] },
      { id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment', sectionType: 'standard', dimensionKey: 'regulatory_compliance', content: [{ t: 'bullets', items: ['GDPR applies to all EU properties (13 of 18 countries estimated)', 'Data residency architecture is designed from Day 1 — technically sound but legal approval is a hard gate', 'GDPR enforcement in hospitality has increased (3 sector enforcement actions in 2025) — regulatory environment is active', 'Non-EU property data regulations (Middle East, APAC properties) are not addressed in SOW — advisory gap'] }] },
      { id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment', sectionType: 'standard', dimensionKey: 'partner_ecosystem', content: [{ t: 'bullets', items: ['No subcontractor — pure Microsoft PS delivery', 'Two PMS vendor API dependencies: if either vendor changes API during engagement, integration requires a Change Order', 'Azure OpenAI service: capacity and quota allocation must be confirmed before Phase 2 model training begins'] }] },
      { id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment', sectionType: 'standard', dimensionKey: 'technology_maturity', content: [{ t: 'bullets', items: ['Azure AI Studio: moved to GA in Q1 2026 — maturity improved but multi-agent orchestration at 240-property production scale has only 2 known deployments globally', 'Azure OpenAI (GPT-4o for concierge agent): GA and well-established for NLP use cases', 'Azure ML (loyalty prediction model): fully mature for tabular prediction at this scale', 'Multi-agent orchestration layer: the integration of 3 agents into a unified guest experience platform is architecturally novel — no direct comparable'] }] },
      { id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence', sectionType: 'precedent', content: [{ t: 'p', text: 'Two comparable AI platform engagements retrieved. The Datum Corp partial outcome is highly relevant — the model performance gap against a conversion target is the identical risk profile. The Fabrikam GenAI failure (regulatory block) reinforces why the GDPR gate is non-negotiable.' }] },
      { id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence', sectionType: 'agents', content: [{ t: 'p', text: 'Marcus Chen is the only confirmed agent with comparable AI platform delivery experience. Phase 4 rollout specialists are not yet identified — this is the primary resourcing gap.' }] },
      { id: 'market-signals', number: '11.', title: 'Market Signal Alerts', sectionType: 'signals', content: [{ t: 'p', text: 'Two active market signals affect this engagement. GDPR enforcement signal is the more material of the two.' }] },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '15%', score: 4.5, strength: 'Three-agent architecture is well-designed and decomposed. Azure ML loyalty model is the simplest component and is low-risk.', gaps: ['Multi-agent orchestration at 240-property scale has no direct comparable', '18-country rollout coordination complexity is the highest in the current portfolio'], recommendation: 'Add a 240-property rollout governance plan as a Phase 1 deliverable — wave structure, readiness checklist, regional contacts.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '20%', score: 6.0, strength: 'CDO sponsor with board alignment and 20% IOI commitment signals strong organizational conviction.', gaps: ['No change management function for 240 properties adopting AI-driven hospitality tools', 'No prior AI deployment history — organizational readiness for AI is untested'], recommendation: 'Require client to appoint a Change Management Lead for the 240-property rollout before Phase 4 begins.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '12%', score: 7.5, strength: 'IOI offset and client-owned Azure consumption costs create a well-separated commercial structure.', gaps: ['IOI approval memo not attached — conditions could be disputed', 'Fixed fee on AI model performance has inherent uncertainty risk'], recommendation: 'Attach IOI memo as Appendix A before contract execution. Add a model optimization sprint budget as a conditional Phase 5 line item.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '20%', score: 5.5, strength: 'Marcus Chen confirmed — the strongest AI architect in the practice for this type of engagement.', gaps: ['Phase 4 rollout specialists not identified (3 regional roles open)', 'Key-person risk on AI model design is high — no backup for Marcus Chen in Phase 2–3'], recommendation: 'Identify and confirm Phase 4 regional specialists before Phase 3 begins. Designate a secondary AI architect as backup for Phase 2.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '8%', score: 6.5, strength: 'GDPR data residency architecture is designed from Day 1 — technically proactive.', gaps: ['Non-EU property data regulations not addressed', 'GDPR enforcement environment in hospitality is active'], recommendation: 'Add a non-EU property regulatory advisory track to Phase 1 — client counsel to advise on Middle East and APAC requirements.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '12%', score: 9.5, strength: 'No subcontractor. Clean delivery structure.', gaps: ['PMS vendor API stability is an external dependency outside Microsoft control'], recommendation: 'Include API version pinning in both PMS vendor contracts before Phase 2 integration work begins.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '13%', score: 5.0, strength: 'Azure OpenAI and Azure ML are fully mature for the use cases applied.', gaps: ['Multi-agent orchestration at production hospitality scale: <2 comparable deployments', 'Azure AI Studio moved to GA recently — enterprise-scale patterns still emerging'], recommendation: 'Commission a 2-day architecture validation session with Microsoft AI engineering team before Phase 1 architecture blueprint is finalized.' },
    ],
    referenceProjects: [
      { name: 'VanArsdel Copilot & AI Platform', industry: 'Retail', year: 2025, outcome: 'success', relevance: 'High', lesson: 'CSAT 4.7. Recommendation agent deployed across 180 retail locations. Key success factor: A/B testing framework validated performance before full rollout. Model exceeded conversion target by 12%.' },
      { name: 'Datum Corp AI Innovation Platform', industry: 'Technology', year: 2024, outcome: 'partial', relevance: 'High', lesson: 'AI model underperformed conversion target by 8% at go-live. Required 6-week optimization sprint. Root cause: insufficient historical training data quality. Mitigation here: validate 24-month data quality in Phase 1 before training begins.' },
      { name: 'Fabrikam GenAI Customer Service', industry: 'Insurance', year: 2024, outcome: 'failed', relevance: 'Medium', lesson: 'Regulatory approval for AI-generated customer responses was blocked by the financial regulator at go-live. Engagement terminated. Reinforces why GDPR Privacy Counsel approval is a hard gate — not a checkbox.' },
    ],
    agentMatches: [
      { name: 'Marcus Chen', role: 'Azure AI Studio Lead', credits: [{ project: 'VanArsdel Copilot & AI Platform', csat: 4.6 }, { project: 'Datum Corp AI Innovation Platform', csat: 3.9 }], industries: ['Retail', 'Technology'], availability: 'Confirmed available Month 1', regions: ['Americas', 'APAC'] },
    ],
    marketSignals: [
      { feed: 'GDPR Enforcement Monitor', alert: 'Three GDPR enforcement actions against EU hospitality companies in 2025 related to AI-personalization and guest data processing. Supervisory authorities are specifically scrutinizing hotel AI use cases.', severity: 'warning', date: 'Apr 2026', dimension: 'Regulatory Compliance' },
      { feed: 'Azure AI Studio Maturity Signal', alert: 'Azure AI Studio multi-agent orchestration moved to GA in Q1 2026. Enterprise-scale deployment patterns are still being established — Microsoft AI engineering team can provide architecture validation for large-scale deployments.', severity: 'info', date: 'Mar 2026', dimension: 'Technology Maturity' },
    ],
    alignmentFlags: [
      { label: 'AI Performance Risk → Commercial Structure', status: 'warning', detail: 'Fixed fee on AI model performance has no optimization sprint contingency budget defined in commercial terms.' },
      { label: 'IOI → Commercial Terms', status: 'warning', detail: 'IOI approval memo is not attached as an exhibit to the SOW or deal file.' },
      { label: 'GDPR Gate → Timeline', status: 'ok' },
      { label: 'Phase 4 Resourcing → Execution Risk', status: 'warning', detail: '3 regional rollout specialists not yet identified for the 240-property Phase 4 deployment.' },
    ],
  },

  // ─── 4. ALPINE INSURANCE GROUP ───────────────────────────────────────────
  'Alpine Insurance Group': {
    compositeScore: 7.5,
    executiveBrief: {
      riskTier: 'Managed Risk',
      headlineRisk: 'The Solvency II analytics pack is the only material risk item — custom ruleset development was required in one comparable engagement and added 3 weeks to the timeline. Pre-engagement ruleset confirmation with client Risk & Compliance is essential.',
      precedentSignal: '91% delivery success rate on 6 comparable security engagements. Fabrikam Insurance Zero Trust is directly comparable — same Solvency II context. Partial outcome driven by scope expansion, not execution failure.',
      deliveryConfidence: 'Priya Nakamura confirmed (CSAT 4.4, Proseware and City Power). Best available match for this engagement type and regulatory context. Full team structure is clean — no subcontractor, no resourcing gaps.',
      marketContext: 'Solvency II compliance enforcement has increased across EMEA. EIOPA issued updated cloud resilience guidance in Q1 2026 that may affect the Sentinel analytics pack requirements. Review before Phase 3 scope is finalized.',
      decisionGuidance: 'Approve with one condition: Solvency II analytics ruleset confirmed with client Risk & Compliance team before Phase 2 begins. This is a standard gate activity, not a deal risk.',
    },
    sections: [
      { id: 'executive-brief', number: '1.', title: 'Executive Risk Brief', sectionType: 'brief', content: [{ t: 'p', text: 'Alpine Insurance is a clean, well-structured deal with the highest margin in the current security portfolio (38%). The risk profile is Managed Risk — no blocking issues, one conditional item (Solvency II ruleset confirmation). The delivery team is confirmed and the technology stack is fully mature.' }] },
      { id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment', sectionType: 'standard', dimensionKey: 'delivery_complexity', content: [{ t: 'bullets', items: ['3,200-seat Zero Trust deployment across three phases is well within the established playbook for this service line', 'Solvency II analytics pack is the only component requiring custom configuration — all other components are template-based', 'Identity governance (PIM) for an insurance firm with regulatory reporting requirements adds a validation step not present in non-regulated ZT engagements', 'No data migration, no multi-country scope, no AI components — complexity ceiling is medium'] }] },
      { id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment', sectionType: 'standard', dimensionKey: 'client_readiness', content: [{ t: 'bullets', items: ['CISO as primary sponsor with CRO co-sponsoring: dual-sponsor structure is appropriate for a compliance-driven security engagement', 'Client IT team: 1 FTE identity administrator committed — adequate for Phase 1 Entra ID transition', 'Solvency II compliance mandate creates strong organizational alignment — no internal resistance to the program expected', 'Decision velocity: insurance sector typically has slower approval cycles — the 3-business-day change order window may need adjustment'] }] },
      { id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment', sectionType: 'standard', dimensionKey: 'commercial_structure', content: [{ t: 'bullets', items: ['38% margin is excellent — the highest in the security line for this engagement type', 'No ECIF, no vendor, no travel billing — simplest commercial structure possible', 'Solvency II analytics customization risk: if custom development exceeds the standard pack, a Change Order is the correct mechanism — defined in SOW'] }] },
      { id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment', sectionType: 'standard', dimensionKey: 'execution_resourcing', content: [{ t: 'bullets', items: ['6 comparable security engagements with 91% delivery success rate — strongest track record by volume in the current portfolio', 'Priya Nakamura confirmed — has Solvency II context from the Fabrikam Insurance engagement', 'Full team is Microsoft PS only — no coordination overhead', 'Solvency II specialist confirmed on the MS team for Phase 3 regulatory analytics work'] }] },
      { id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment', sectionType: 'standard', dimensionKey: 'regulatory_compliance', content: [{ t: 'bullets', items: ['Solvency II applies to all insurance firms operating in the EU — Alpine is a primary regulated entity', 'GDPR data access controls are within scope (identity governance for personal data access)', 'EIOPA issued updated cloud resilience guidance in Q1 2026 — may affect Sentinel analytics pack requirements in Phase 3', 'Regulatory risk is medium (not high) because we have a Solvency II delivery precedent (Fabrikam Insurance)'] }] },
      { id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment', sectionType: 'standard', dimensionKey: 'partner_ecosystem', content: [{ t: 'bullets', items: ['No subcontractor — lowest possible partner risk', 'All platform components are Microsoft-native'] }] },
      { id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment', sectionType: 'standard', dimensionKey: 'technology_maturity', content: [{ t: 'bullets', items: ['Entra ID P2, Intune, Defender for Endpoint, Sentinel: all fully GA and production-proven', 'Solvency II analytics pack: available as a standard pack but custom rule development may be required depending on client\'s specific reporting obligations', 'No preview features in scope'] }] },
      { id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence', sectionType: 'precedent', content: [{ t: 'p', text: 'Six comparable security engagements retrieved. Fabrikam Insurance Zero Trust is the most directly applicable — same Solvency II context with a partial outcome driven by scope expansion, not execution failure.' }] },
      { id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence', sectionType: 'agents', content: [{ t: 'p', text: 'Priya Nakamura is confirmed with directly applicable Solvency II insurance delivery experience. Strongest single-agent match in the current portfolio for this deal type.' }] },
      { id: 'market-signals', number: '11.', title: 'Market Signal Alerts', sectionType: 'signals', content: [{ t: 'p', text: 'One active regulatory signal. EIOPA updated cloud resilience guidance may affect Phase 3 Sentinel analytics scope.' }] },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 7.0, strength: 'Template-based delivery for all components except Solvency II analytics. Three-phase structure is clean and well-sequenced.', gaps: ['Solvency II ruleset customization scope is unconfirmed — could add 3+ weeks to Phase 3'], recommendation: 'Confirm Solvency II ruleset with client Risk & Compliance before Phase 2 exit. Lock custom vs. standard ruleset decision as a Phase 2 gate.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 8.0, strength: 'Dual-sponsor structure (CISO + CRO) is ideal for a compliance-driven security program.', gaps: ['Insurance sector decision velocity tends to be slower than tech sector — 3-business-day change order window may be insufficient'], recommendation: 'Adjust change order response window to 5 business days to account for insurance-sector governance cycles.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 9.5, strength: '38% margin with no vendor and no ECIF is the cleanest commercial position in the portfolio.', gaps: [], recommendation: 'No action required.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 8.5, strength: 'Priya Nakamura confirmed with Solvency II insurance context. 91% delivery success rate on 6 comparable engagements.', gaps: ['Solvency II specialist must be confirmed for Phase 3 — currently named in deal but not yet formally committed'], recommendation: 'Obtain written Solvency II specialist commitment before contract execution.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '15%', score: 6.0, strength: 'Solvency II delivery precedent from Fabrikam Insurance engagement provides a ruleset and methodology reference.', gaps: ['EIOPA Q1 2026 cloud guidance update may add requirements to Sentinel analytics scope', 'GDPR identity data handling during Entra ID migration is not explicitly risk-assessed'], recommendation: 'Review EIOPA Q1 2026 guidance against Phase 3 Sentinel analytics scope before Phase 2 ends.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 9.5, strength: 'No partners. No external technology dependencies.', gaps: [], recommendation: 'No action required.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 8.5, strength: 'Fully GA stack. Solvency II analytics pack is available as a standard product.', gaps: ['Custom Solvency II rules (if required) have limited field precedent beyond the Fabrikam engagement'], recommendation: 'Use Fabrikam Solvency II ruleset as the starting baseline and document deviations — do not start from scratch.' },
    ],
    referenceProjects: [
      { name: 'Fabrikam Insurance Zero Trust', industry: 'Insurance', year: 2023, outcome: 'partial', relevance: 'High', lesson: 'Solvency II analytics scope expanded mid-Phase 3 when the client Risk & Compliance team introduced additional reporting obligations not known at contract signature. Added 3 weeks and a Change Order. Prevention: confirm full Solvency II obligation list before Phase 2.' },
      { name: 'Proseware SOC Modernization', industry: 'Financial Services', year: 2025, outcome: 'success', relevance: 'High', lesson: 'CSAT 4.6. Priya Nakamura led delivery. Sentinel analytics pack deployed on schedule when data connectors were pre-qualified in Phase 1. Template for this engagement.' },
      { name: 'City Power & Light SOC Modernization', industry: 'Energy', year: 2024, outcome: 'success', relevance: 'Medium', lesson: 'Regulated-industry delivery with strong compliance reporting requirements. Success attributed to monthly compliance review cadence with client legal team — recommend same cadence here for Solvency II track.' },
    ],
    agentMatches: [
      { name: 'Priya Nakamura', role: 'Zero Trust & Compliance Architect', credits: [{ project: 'Proseware SOC Modernization', csat: 4.4 }, { project: 'Fabrikam Insurance Zero Trust', csat: 4.0 }], industries: ['Financial Services', 'Insurance', 'Energy'], availability: 'Confirmed available Month 1', regions: ['Americas', 'EMEA'] },
    ],
    marketSignals: [
      { feed: 'EIOPA Regulatory Monitor', alert: 'EIOPA issued updated cloud resilience guidance in Q1 2026 affecting Solvency II reporting for cloud-hosted systems. Sentinel analytics pack Solvency II ruleset may require review against new requirements before Phase 3.', severity: 'warning', date: 'Mar 2026', dimension: 'Regulatory Compliance' },
    ],
    alignmentFlags: [
      { label: 'Solvency II Ruleset → Confirmed Pre-Phase 3', status: 'warning', detail: 'Solvency II ruleset must be confirmed with client Risk & Compliance before Phase 2 exit — not yet scheduled.' },
      { label: 'Delivery Success Rate vs. Precedent', status: 'ok' },
      { label: 'EIOPA Signal → Phase 3 Scope', status: 'warning', detail: 'EIOPA Q1 2026 cloud guidance update may affect Sentinel analytics scope — review required before Phase 2 ends.' },
      { label: 'Commercial Structure → Margin', status: 'ok' },
    ],
  },

  // ─── 5. CONTOSO FINANCIAL GROUP ──────────────────────────────────────────
  'Contoso Financial Group': {
    compositeScore: 5.0,
    executiveBrief: {
      riskTier: 'Elevated Risk',
      headlineRisk: 'FFIEC compliance review dependency is the single highest-risk item — if the client Risk team\'s audit is not complete before Month 3, Phase 2 cannot start and a full timeline revision is triggered. 26% margin provides limited buffer for regulatory complexity overruns.',
      precedentSignal: '83% delivery success rate on 4 comparable bank migrations. Wingtip Toys Cloud Native Modernization is the closest precedent — successful, but FFIEC compliance review caused a 5-week Phase 2 delay. Same risk is present and active here.',
      deliveryConfidence: 'James Holwerda is available and has comparable migration experience. FFIEC-specific banking compliance delivery lead is not yet confirmed — this is the critical resourcing gap given the regulatory complexity.',
      marketContext: 'OCC issued new guidance on cloud migration in regulated banking in Q4 2025. The guidance specifically addresses FFIEC Landing Zone configuration standards — review required before Phase 1 design is finalized. May add scope to the FFIEC compliance map deliverable.',
      decisionGuidance: 'Approve with conditions: (1) client Risk team FFIEC audit timeline confirmed and booked by Month 1; (2) FFIEC-specific banking compliance delivery lead named before contract execution; (3) margin floor review with Finance if FFIEC complications require additional effort.',
    },
    sections: [
      { id: 'executive-brief', number: '1.', title: 'Executive Risk Brief', sectionType: 'brief', content: [{ t: 'p', text: 'Elevated Risk. The FFIEC regulatory overlay is the defining risk factor. The engagement is commercially viable and strategically important ($96K/month ACR). However, the 26% margin for a high-complexity regulated banking migration with Eviden participation leaves minimal buffer. FFIEC compliance review timing is the controlling dependency for the entire Phase 2 schedule.' }] },
      { id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment', sectionType: 'standard', dimensionKey: 'delivery_complexity', content: [{ t: 'bullets', items: ['40 core banking workloads: volume is moderate, but banking workload sensitivity (transaction processing, core ledger systems) means each migration requires higher validation rigor than standard enterprise workloads', 'FFIEC-compliant Landing Zone: configuration standards are more prescriptive than standard Azure LZ — additional security controls, audit logging, and network segmentation requirements', 'Eviden migration factory (15%): adds coordination overhead and a quality gate at each wave handoff', 'Zero Trust overlay (Phase 3): adds a concurrent workstream in the final 4 months when migration is completing'] }] },
      { id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment', sectionType: 'standard', dimensionKey: 'client_readiness', content: [{ t: 'bullets', items: ['Bank IT VP as sponsor: appropriate level for a Phase 1 migration; may need elevation to CTO level if FFIEC complications require executive decisions', 'Client Risk team dependency: their FFIEC audit timeline is the controlling variable for Phase 2 start — this is a client readiness risk that MS cannot mitigate directly', 'Core banking cutover windows: agreement with Bank Operations team is deferred to Phase 2 — this should be initiated in Month 1', 'New logo: no prior CRM delivery history — decision velocity and client collaboration patterns are unknown'] }] },
      { id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment', sectionType: 'standard', dimensionKey: 'commercial_structure', content: [{ t: 'bullets', items: ['26% margin: tight for a high-complexity regulated engagement with vendor participation — Finance flagged correctly', 'Eviden is included in total contract value — Microsoft absorbs Eviden delivery risk at this margin level', 'ECIF (5%) offsets Phase 1 foundation work — reduces early-phase cash exposure but does not address margin floor risk', 'Phase 2 SOW pricing is not guaranteed at Phase 1 rates — but the Phase 2 contract will be negotiated with knowledge of Phase 1 actuals, which should be used to improve margin'] }] },
      { id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment', sectionType: 'standard', dimensionKey: 'execution_resourcing', content: [{ t: 'bullets', items: ['James Holwerda available: strong migration lead with Azure LZ experience, but no FFIEC-specific banking regulatory experience on record', 'FFIEC-specific banking compliance delivery lead: not yet identified — critical gap given the regulatory overlay', 'Eviden: 15% of migration execution — resource commitment not yet confirmed for this engagement', 'Core banking cutover expertise: specialized skillset required for bank migration cutover windows — confirm availability before Phase 2 begins'] }] },
      { id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment', sectionType: 'standard', dimensionKey: 'regulatory_compliance', content: [{ t: 'bullets', items: ['FFIEC and OCC: dual regulatory framework for US commercial banks — prescriptive configuration standards and audit trail requirements', 'OCC Q4 2025 cloud migration guidance: new guidance affects FFIEC Landing Zone configuration standards — scope impact not yet assessed', 'Client Risk team audit: the entire Phase 2 schedule is dependent on client Risk team completing their FFIEC compliance review — MS cannot accelerate this', 'Compliance_risk is rated "high" in the deal profile — correctly reflects the regulatory burden'] }] },
      { id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment', sectionType: 'standard', dimensionKey: 'partner_ecosystem', content: [{ t: 'bullets', items: ['Eviden at 15% of effort: within managed risk threshold for a migration partner', 'Eviden\'s FFIEC-aware configuration requirement: must be explicit in the subcontract — not yet confirmed', 'No other third-party dependencies'] }] },
      { id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment', sectionType: 'standard', dimensionKey: 'technology_maturity', content: [{ t: 'bullets', items: ['Azure Migrate and ASR: fully mature for banking workload Lift-Shift', 'FFIEC-compliant Landing Zone: established configuration standards exist, but OCC Q4 2025 guidance may require updates to standard templates', 'ExpressRoute + hybrid DNS: fully GA and production-proven in banking contexts', 'Zero Trust overlay components (Entra ID, Defender): fully GA'] }] },
      { id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence', sectionType: 'precedent', content: [{ t: 'p', text: 'Four comparable bank cloud migrations retrieved. The Wingtip Toys partial outcome is the most relevant — FFIEC compliance delay caused a 5-week Phase 2 postponement, directly mirroring the risk present in this deal.' }] },
      { id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence', sectionType: 'agents', content: [{ t: 'p', text: 'James Holwerda is the available migration lead. A FFIEC-specific banking compliance specialist is the critical gap — no confirmed agent with FFIEC delivery experience is currently identified as available for this engagement start date.' }] },
      { id: 'market-signals', number: '11.', title: 'Market Signal Alerts', sectionType: 'signals', content: [{ t: 'p', text: 'One active regulatory signal from OCC. Review against Phase 1 Landing Zone design before finalizing the FFIEC Compliance Map deliverable.' }] },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 4.5, strength: '40-workload scope is moderate in volume. Azure migration tooling is fully mature for this workload type.', gaps: ['Banking workload sensitivity requires higher validation rigor per workload than standard enterprise migration', 'Concurrent Phase 3 Zero Trust overlay creates a parallel workstream in the delivery\'s most complex period'], recommendation: 'Phase 3 Zero Trust overlay should have its own work plan and PM allocation — do not treat it as a Phase 2 continuation.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 5.5, strength: 'Bank IT VP sponsor has organizational authority to drive compliance review through the client Risk team.', gaps: ['Client Risk team FFIEC audit timeline is unbooked — the controlling Phase 2 dependency is unscheduled', 'Core banking cutover window agreements deferred to Phase 2 — should begin in Month 1'], recommendation: 'Request client to book FFIEC audit with their Risk team within Week 2 of kickoff. Establish a governance touchpoint with Bank Operations in Month 1.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 5.5, strength: 'ECIF offset on Phase 1 and Eviden absorbed in total provides structural protection on the most certain phase.', gaps: ['26% margin at high complexity with regulatory overlay and vendor participation is the tightest in the portfolio', 'No margin contingency defined for FFIEC compliance complications'], recommendation: 'Finance to confirm margin floor. If FFIEC review reveals additional compliance controls, a Change Order must be issued before work begins.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 6.5, strength: 'James Holwerda available as migration lead. 83% delivery success rate on 4 comparable bank migrations is above threshold.', gaps: ['FFIEC banking compliance delivery lead not identified — critical gap', 'Eviden resource commitment outstanding'], recommendation: 'FFIEC banking compliance lead identification is a contract execution gate. If no internal resource is available, consider engaging a FFIEC-experienced associate.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '15%', score: 4.5, strength: 'FFIEC and OCC requirements are well-understood at a framework level — no novel regulatory territory.', gaps: ['OCC Q4 2025 cloud guidance update may affect Landing Zone scope', 'Client Risk team FFIEC audit is unscheduled — this is the highest-risk dependency in the deal'], recommendation: 'Review OCC Q4 2025 guidance against Phase 1 Landing Zone design before kickoff. Add FFIEC audit scheduling as a Month 1 action item.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 7.0, strength: 'Eviden at 15% is within managed risk threshold. Microsoft absorbs commercial risk.', gaps: ['Eviden FFIEC-aware configuration obligation not yet confirmed in subcontract'], recommendation: 'Confirm Eviden subcontract explicitly includes FFIEC-compliant configuration standards before Phase 2 kickoff.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 7.5, strength: 'All migration platform components are fully GA. FFIEC LZ configuration standards are established.', gaps: ['OCC Q4 2025 guidance may require updates to standard FFIEC LZ templates'], recommendation: 'Validate FFIEC LZ template against OCC Q4 2025 guidance before Phase 1 design is completed.' },
    ],
    referenceProjects: [
      { name: 'Adatum Cloud Foundation', industry: 'Professional Services', year: 2024, outcome: 'success', relevance: 'Medium', lesson: 'Azure LZ and migration factory succeeded on schedule. No regulatory overlay in this engagement — less comparable than Wingtip but provides migration velocity benchmark.' },
      { name: 'Wingtip Toys Cloud Native', industry: 'Banking', year: 2023, outcome: 'partial', relevance: 'High', lesson: 'FFIEC compliance review completed 5 weeks after Phase 2 was scheduled to begin. Client Risk team had not allocated capacity for the audit. Phase 2 delayed accordingly. Prevention: book client Risk team FFIEC audit date in Month 1.' },
      { name: 'Lamna Healthcare Azure & Security', industry: 'Healthcare', year: 2024, outcome: 'success', relevance: 'Medium', lesson: 'Regulated industry migration with HIPAA compliance overlay. Success attributed to parallel compliance and delivery workstreams — HIPAA review ran concurrently with Phase 1, not as a blocker. Same approach applicable here.' },
    ],
    agentMatches: [
      { name: 'James Holwerda', role: 'Azure Migration Lead', credits: [{ project: 'Adatum Cloud Foundation', csat: 4.3 }, { project: 'Bellows College Azure Campus', csat: 4.5 }], industries: ['Retail', 'Education'], availability: 'Confirmed available Month 1', regions: ['Americas'] },
    ],
    marketSignals: [
      { feed: 'OCC Regulatory Monitor', alert: 'OCC issued new cloud migration guidance for US commercial banks in Q4 2025. Guidance specifies updated FFIEC Landing Zone configuration standards for network segmentation and audit logging. Review against Phase 1 LZ design template before kickoff.', severity: 'warning', date: 'Jan 2026', dimension: 'Regulatory Compliance' },
    ],
    alignmentFlags: [
      { label: 'FFIEC Audit → Timeline Gate', status: 'warning', detail: 'Client Risk team FFIEC audit is unscheduled. Phase 2 cannot start without it — the controlling dependency has no booked date.' },
      { label: 'FFIEC Lead → Resourcing', status: 'warning', detail: 'FFIEC-specific banking compliance delivery lead not yet identified. Critical gap for a regulated banking engagement.' },
      { label: 'OCC Q4 2025 Guidance → LZ Scope', status: 'warning', detail: 'OCC updated cloud guidance may affect Phase 1 Landing Zone scope — not yet reviewed against current design.' },
      { label: 'Eviden Subcontract → FFIEC Obligations', status: 'warning', detail: 'Eviden FFIEC-compliant configuration obligation not yet confirmed in the subcontract.' },
    ],
  },

  // ─── 6. NORTHWIND TRADERS ────────────────────────────────────────────────
  'Northwind Traders': {
    compositeScore: 5.5,
    executiveBrief: {
      riskTier: 'Elevated Risk',
      headlineRisk: 'SAP data quality is the defining risk — the Southridge D365 F&O Transformation partial outcome was driven by 8-week migration delays from undisclosed SAP data quality issues. The same risk is present and unverified here.',
      precedentSignal: '86% delivery success rate on 5 comparable D365 F&O engagements. Southridge D365 partial (data migration +8 weeks) is the most relevant precedent. No failures in the D365 service line.',
      deliveryConfidence: 'Elena Vasquez (D365 F&O specialist, CSAT 4.2 on Southridge) is available and has direct SAP-to-D365 migration experience. Southridge D365 delivery lead is engaged as SME advisor per AI conditions — strong delivery confidence signal.',
      marketContext: 'D365 F&O platform is stable and fully mature. No active platform signals. SAP ECC sunset deadline (2027) is creating sustained D365 migration demand — team capacity may be under pressure from competing pipeline.',
      decisionGuidance: 'Approve with two conditions: (1) client SAP team provides data migration scope confirmation and data quality assessment before Phase 1 ends; (2) all 4 integration endpoint APIs validated in Month 2 before Phase 2 commitment.',
    },
    sections: [
      { id: 'executive-brief', number: '1.', title: 'Executive Risk Brief', sectionType: 'brief', content: [{ t: 'p', text: 'Elevated Risk. The D365 F&O service line is high-confidence, but SAP-to-D365 migrations carry specific data quality risk that has caused overruns in comparable engagements. The engagement should proceed — the strategic rationale and delivery confidence are both strong — with hard gates on SAP data quality and integration validation before Phase 2.' }] },
      { id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment', sectionType: 'standard', dimensionKey: 'delivery_complexity', content: [{ t: 'bullets', items: ['SAP ECC replacement: full ERP migration across 3 modules (Finance, SCM, WMS) is inherently complex — module interdependencies create cascading risk if one module is delayed', 'Four external system integrations: each integration is a potential delay if APIs are not as documented', 'Data migration from SAP: volume and quality are the highest-risk unknowns — SAP data is notoriously complex due to years of customization and schema divergence', '250-user training: significant change management burden, especially for users who have been on SAP for many years', '18-month timeline: appropriate for this scope, but Phase 3 (data migration + UAT + go-live) is compressed into 6 months'] }] },
      { id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment', sectionType: 'standard', dimensionKey: 'client_readiness', content: [{ t: 'bullets', items: ['CFO + COO as co-sponsors: appropriate for an ERP transformation with Finance and Operations scope — strong financial and operational authority', 'Client D365 implementation lead (1 FTE) and Finance SME (0.5 FTE): committed, but may be insufficient during peak Phase 3 UAT with 250 users', 'SAP team: their cooperation on data migration scope and quality assessment is the single most important client readiness factor — cooperation is assumed but not confirmed', 'Change management: 250-user retraining from SAP to D365 requires a dedicated client change management function — not yet mentioned'] }] },
      { id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment', sectionType: 'standard', dimensionKey: 'commercial_structure', content: [{ t: 'bullets', items: ['32% margin is healthy for a high-complexity ERP engagement with no vendor dilution', 'Fixed fee per phase: appropriate for well-defined phases — Phase 3 (data migration) carries overrun risk if SAP data quality requires remediation beyond estimate', 'No ECIF: straightforward billing structure'] }] },
      { id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment', sectionType: 'standard', dimensionKey: 'execution_resourcing', content: [{ t: 'bullets', items: ['Elena Vasquez confirmed (CSAT 4.2, Southridge D365 F&O): the most directly comparable delivery credit in the practice', 'Southridge D365 delivery lead as SME advisor: excellent risk mitigation — using the person who has done this exact program type most recently', 'SAP data migration specialist: not yet named — critical for Phase 3 execution', '5 comparable D365 F&O engagements with 86% success rate: strong delivery track record'] }] },
      { id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment', sectionType: 'standard', dimensionKey: 'regulatory_compliance', content: [{ t: 'bullets', items: ['No regulatory requirements — lowest-risk dimension in this deal', 'SAP decommission is advisory only — no compliance obligations on decommission execution'] }] },
      { id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment', sectionType: 'standard', dimensionKey: 'partner_ecosystem', content: [{ t: 'bullets', items: ['No subcontractor', 'No third-party platform dependencies beyond D365 and the 4 named integration endpoints', 'Integration endpoints: each is a third-party dependency — API stability and documentation accuracy are outside Microsoft control'] }] },
      { id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment', sectionType: 'standard', dimensionKey: 'technology_maturity', content: [{ t: 'bullets', items: ['D365 Finance & Operations: fully GA, mature, and well-supported — one of the most stable platforms in the Microsoft portfolio', 'Power BI dashboards: fully GA and well-understood', 'SAP ECC data extraction tooling: mature but highly variable in outcome depending on SAP customization depth', 'All components are under active Microsoft support for the 18-month engagement duration'] }] },
      { id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence', sectionType: 'precedent', content: [{ t: 'p', text: 'Five comparable D365 F&O engagements retrieved. No failures in this service line. The Southridge partial outcome (SAP data migration +8 weeks) is directly applicable and should be treated as the base case for risk planning.' }] },
      { id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence', sectionType: 'agents', content: [{ t: 'p', text: 'Elena Vasquez confirmed with direct Southridge D365 F&O comparable experience. SAP data migration specialist role is the open gap.' }] },
      { id: 'market-signals', number: '11.', title: 'Market Signal Alerts', sectionType: 'signals', content: [{ t: 'p', text: 'One capacity signal. SAP ECC sunset pressure is driving D365 migration demand — team resource competition from pipeline.' }] },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 5.0, strength: 'D365 F&O platform is fully mature. Finance, SCM, and WMS modules are well-established delivery playbooks.', gaps: ['SAP data quality and migration scope are the highest unknowns — estimated at time of contract but not validated', '4 integration endpoint APIs assumed as documented — validation deferred to Month 2'], recommendation: 'Add a data quality assessment deliverable to Phase 1 with a pass/fail gate before Phase 2 commitment.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 6.0, strength: 'CFO + COO co-sponsorship creates strong financial and operational alignment for an ERP transformation.', gaps: ['SAP team cooperation on data migration scope is assumed but not contracted — this is the most important client readiness dependency', '250-user training requires dedicated client change management — not mentioned'], recommendation: 'Require client to designate an SAP migration liaison and a Change Management Lead before Phase 1 ends.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 8.0, strength: '32% margin with no vendor and clean fixed-fee structure. Phase-based billing aligns payment to milestone acceptance.', gaps: ['Phase 3 data migration fixed fee carries SAP data quality overrun risk with no contingency defined'], recommendation: 'Add a data quality remediation Change Order trigger: if remediation exceeds 40 person-hours, a Change Order is issued before additional effort is incurred.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 7.5, strength: 'Elena Vasquez confirmed with Southridge precedent. Southridge SME advisor engaged — strongest knowledge transfer mechanism available.', gaps: ['SAP data migration specialist not yet named for Phase 3', 'Integration endpoint specialist availability for 4 concurrent integrations in Phase 2 not confirmed'], recommendation: 'Name SAP data migration specialist before contract execution. Confirm integration engineer availability for all 4 Phase 2 integrations.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '10%', score: 9.5, strength: 'No regulatory requirements. Lowest-risk dimension.', gaps: [], recommendation: 'No action required.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 9.5, strength: 'No subcontractor. Only third-party dependencies are the 4 integration endpoints.', gaps: ['Integration API documentation accuracy is assumed — not yet validated'], recommendation: 'Integration pre-qualification in Month 2 is the appropriate risk mitigation — already in SOW assumptions.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 7.5, strength: 'D365 F&O is one of the most stable and mature Microsoft platforms. No technology maturity risk.', gaps: ['SAP data extraction tooling outcome varies heavily by SAP customization depth — not assessable without seeing the SAP instance'], recommendation: 'Include an SAP customization assessment in the Phase 1 data quality gate before extraction tooling is selected.' },
    ],
    referenceProjects: [
      { name: 'Southridge D365 F&O Transformation', industry: 'Distribution', year: 2023, outcome: 'partial', relevance: 'High', lesson: 'SAP data migration ran 8 weeks over plan due to undisclosed data quality issues discovered after extraction began. Client SAP team had not disclosed 4 years of customization not in the migration scope. Prevention: require SAP customization inventory from client before Phase 1 ends.' },
      { name: 'Trey Research D365 Sales & CS', industry: 'Professional Services', year: 2024, outcome: 'success', relevance: 'High', lesson: 'CSAT 4.5. No SAP migration involved. Integration pre-qualification in Month 1 prevented all 3 integration delays experienced in comparable programs. Endorses the Month 2 integration gate approach.' },
      { name: 'Woodgrove Bank D365 Finance', industry: 'Banking', year: 2025, outcome: 'success', relevance: 'Medium', lesson: 'Finance module only (no SCM, no WMS). Data migration from Oracle was clean because a data quality assessment was conducted in pre-engagement scoping. Confirms the value of the Phase 1 data quality gate.' },
    ],
    agentMatches: [
      { name: 'Elena Vasquez', role: 'D365 F&O Delivery Lead', credits: [{ project: 'Southridge D365 F&O Transformation', csat: 4.2 }, { project: 'Trey Research D365 Sales & CS', csat: 4.0 }], industries: ['Distribution', 'Professional Services'], availability: 'Confirmed available Month 1', regions: ['Americas', 'EMEA'] },
    ],
    marketSignals: [
      { feed: 'D365 Practice Capacity Index', alert: 'SAP ECC sunset deadline (2027) is driving a surge in D365 F&O migration demand. D365 delivery team capacity is under pressure from 4 competing programs in the pipeline. Elena Vasquez is confirmed for this engagement but additional D365 specialists may face availability constraints.', severity: 'warning', date: 'May 2026', dimension: 'Execution & Resourcing' },
    ],
    alignmentFlags: [
      { label: 'SAP Data Quality → Phase 1 Gate', status: 'warning', detail: 'SAP data quality assessment is an assumption in the SOW but is not a named deliverable with a pass/fail gate criterion.' },
      { label: 'Integration Validation → Month 2 Milestone', status: 'warning', detail: 'Integration endpoint pre-qualification is in SOW assumptions but not on the milestone timeline.' },
      { label: 'D365 Delivery Success Rate vs. Precedent', status: 'ok' },
      { label: 'SAP Migration Specialist → Resourcing', status: 'warning', detail: 'SAP data migration specialist not yet named for Phase 3 — critical role for the highest-risk delivery component.' },
    ],
  },

  // ─── 7. NORTHWIND HEALTHCARE SYSTEM ──────────────────────────────────────
  'Northwind Healthcare System': {
    compositeScore: 5.0,
    executiveBrief: {
      riskTier: 'Elevated Risk',
      headlineRisk: 'APAC multi-country healthcare regulatory variance is the primary risk — each of the 8 hospitals may face in-country regulatory requirements beyond HIPAA/HITECH that are not yet assessed and could delay PHI classification scope or Entra ID rollout.',
      precedentSignal: '89% delivery success rate on 3 comparable healthcare security engagements. Lamna Healthcare Azure & Security Foundation (CSAT 4.2) is the strongest precedent — Sarah Mitchell led delivery and is recommended as lead for this engagement.',
      deliveryConfidence: 'Sarah Mitchell confirmed available and is the recommended delivery lead (named in AI conditions). Strong healthcare compliance delivery record. APAC in-country regulatory expertise is not confirmed — this is the gap.',
      marketContext: 'APAC healthcare data sovereignty regulation is in active evolution — Australia, Singapore, and Japan all issued new health data guidelines in 2025–2026. Review against hospital locations before Phase 1 assessment begins.',
      decisionGuidance: 'Approve with conditions: (1) BAA countersigned before any PHI access (mandatory, non-negotiable); (2) APAC in-country legal counsel engaged per hospital before Phase 2; (3) Sarah Mitchell named as delivery lead.',
    },
    sections: [
      { id: 'executive-brief', number: '1.', title: 'Executive Risk Brief', sectionType: 'brief', content: [{ t: 'p', text: 'Elevated Risk. The HIPAA/HITECH service line is well-established with strong delivery confidence. The risk is geographic — 8 hospitals across APAC introduces in-country regulatory variance that HIPAA alone does not address. The BAA is the absolute pre-condition; APAC legal counsel engagement is the parallel condition that must not be deferred.' }] },
      { id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment', sectionType: 'standard', dimensionKey: 'delivery_complexity', content: [{ t: 'bullets', items: ['8 hospitals across APAC: not a single-entity deployment — each hospital has its own IT infrastructure, clinical systems, and potentially separate Entra ID tenant configurations', 'PHI classification (Purview): scope is dependent on the Phase 1 data store inventory — if inventory reveals more PHI stores than estimated, Phase 2 scope expands', 'Clinical workforce identity governance: clinical systems (EMR/EHR) have strict uptime requirements — Entra ID migration must be staged to avoid clinical disruption', 'Cross-hospital tenant compatibility: assumed to be connectable but not yet verified (as noted in SOW assumptions)'] }] },
      { id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment', sectionType: 'standard', dimensionKey: 'client_readiness', content: [{ t: 'bullets', items: ['CISO + Privacy Officer as co-sponsors: ideal governance structure for a HIPAA compliance engagement', 'Client Privacy Officer to co-own PHI classification: critical partnership for Phase 2 — strong readiness signal', 'APAC in-country legal counsel: each hospital\'s local counsel is the client\'s responsibility, but engagement timing and coordination is a client readiness variable that MS depends on', 'Clinical staff cooperation: Entra ID changes during active clinical operations require careful communication — hospital by hospital'] }] },
      { id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment', sectionType: 'standard', dimensionKey: 'commercial_structure', content: [{ t: 'bullets', items: ['31% margin is solid for a healthcare compliance engagement', '8% co-investment on Phase 1 and Phase 3 foundation work signals Microsoft\'s commitment to the healthcare vertical', 'PHI inventory scope risk: if Phase 1 discovers significantly more PHI data stores than estimated, Phase 2 scope and cost expands via Change Order — mechanism is defined'] }] },
      { id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment', sectionType: 'standard', dimensionKey: 'execution_resourcing', content: [{ t: 'bullets', items: ['Sarah Mitchell recommended as delivery lead (Lamna Healthcare PM — named in AI conditions): strongest available match, directly comparable HIPAA delivery experience', 'APAC delivery presence: Sarah Mitchell is based in Americas — APAC hospital visits may require local resource support for Phases 2 and 3', 'Clinical workflow expertise: Entra ID integration with clinical EMR/EHR systems requires clinical IT expertise not yet confirmed on the team', '89% delivery success rate on 3 comparable healthcare engagements: solid but smaller comparable base than security line'] }] },
      { id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment', sectionType: 'standard', dimensionKey: 'regulatory_compliance', content: [{ t: 'bullets', items: ['HIPAA/HITECH: well-understood regulatory framework with established delivery methodology', 'APAC in-country regulations: Australia (My Health Records Act), Singapore (PDPA healthcare provisions), Japan (Act on Protection of Personal Information) — all may apply depending on hospital locations', 'BAA is in place: the legal framework for PHI access is established — BAA countersign before access is a standard HIPAA control', 'HITECH breach notification: advisory scope only — but Purview audit trail must support the client\'s HITECH obligations'] }] },
      { id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment', sectionType: 'standard', dimensionKey: 'partner_ecosystem', content: [{ t: 'bullets', items: ['No subcontractor — pure Microsoft PS delivery', 'Clinical system integration: PHI classification requires read access to EMR/EHR systems — third-party clinical system APIs are a dependency outside Microsoft control'] }] },
      { id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment', sectionType: 'standard', dimensionKey: 'technology_maturity', content: [{ t: 'bullets', items: ['Microsoft Purview for healthcare PHI classification: GA and production-proven in comparable HIPAA engagements', 'Sentinel with HIPAA analytics ruleset: GA and established — HIPAA ruleset is a standard pack with 3+ comparable deployments', 'Entra ID clinical workforce governance: GA, but integration with clinical-specific systems (Epic, Cerner) adds per-hospital variability'] }] },
      { id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence', sectionType: 'precedent', content: [{ t: 'p', text: 'Three comparable healthcare compliance and security engagements retrieved. Lamna Healthcare is the strongest comparable — same technology stack, US-based HIPAA context. The APAC regulatory dimension is novel — no comparable multi-country APAC healthcare deployment in the delivery history.' }] },
      { id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence', sectionType: 'agents', content: [{ t: 'p', text: 'Sarah Mitchell is the recommended and available delivery lead. APAC regional delivery support is not yet identified.' }] },
      { id: 'market-signals', number: '11.', title: 'Market Signal Alerts', sectionType: 'signals', content: [{ t: 'p', text: 'One APAC regulatory signal. Australia, Singapore, and Japan have all issued updated health data guidelines in 2025–2026.' }] },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 4.5, strength: 'HIPAA/HITECH service line is well-established. Purview and Sentinel components are fully playbook-based.', gaps: ['8-hospital APAC scope introduces per-hospital variability in tenant configuration, clinical systems, and regulatory obligations', 'PHI inventory scope is unknown until Phase 1 assessment — Phase 2 scope may expand'], recommendation: 'Phase 1 assessment must include a cross-hospital tenant compatibility pre-check before Entra ID scope is committed.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 6.5, strength: 'CISO + Privacy Officer co-sponsorship with Privacy Officer owning PHI classification is ideal for HIPAA compliance work.', gaps: ['APAC in-country legal counsel engagement timing and coordination is client-owned but critical to MS delivery timeline', 'Clinical staff communication plan for Entra ID migration changes is not yet developed'], recommendation: 'Require client to provide APAC in-country legal counsel contact per hospital in Month 1 Week 1.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 7.5, strength: '31% margin with 8% co-investment is solid for healthcare compliance. PHI inventory risk is covered by Change Order mechanism.', gaps: ['Co-investment approval memo not attached — conditions could be disputed at invoicing'], recommendation: 'Attach co-investment approval memo before contract execution.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 7.0, strength: 'Sarah Mitchell is the strongest available healthcare delivery lead with direct Lamna comparable experience.', gaps: ['APAC local delivery support not confirmed for Phases 2–3 hospital visits', 'Clinical EMR/EHR integration expertise not confirmed on team'], recommendation: 'Identify APAC local delivery support resource before Phase 2. Confirm clinical systems integration expertise before Phase 3.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '15%', score: 4.0, strength: 'HIPAA/HITECH methodology is well-established. BAA is in place.', gaps: ['APAC in-country regulations (Australia, Singapore, Japan) are not assessed — scope unknown', 'APAC regulatory evolution is active — 3 countries issued new health data guidelines in 2025–2026'], recommendation: 'Commission an APAC regulatory mapping in Phase 1 Week 1 (client counsel-led, MS advisory support). Block Phase 2 until mapping is complete.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 9.5, strength: 'No subcontractor. Lowest possible partner risk.', gaps: ['EMR/EHR system API access is a clinical system third-party dependency per hospital'], recommendation: 'Confirm EMR/EHR system API access plan per hospital in Phase 1 assessment.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 8.0, strength: 'Purview, Sentinel (HIPAA pack), and Entra ID are all fully GA and HIPAA-deployment proven.', gaps: ['Entra ID integration with clinical-specific systems (Epic, Cerner) varies by hospital — not fully predictable'], recommendation: 'Include clinical system Entra ID compatibility check in Phase 1 assessment per hospital.' },
    ],
    referenceProjects: [
      { name: 'Lamna Healthcare Azure & Security Foundation', industry: 'Healthcare', year: 2024, outcome: 'success', relevance: 'High', lesson: 'CSAT 4.2. Sarah Mitchell led delivery. HIPAA compliance posture improved to 94% within 9 months. BAA countersigning was completed Day 1 — no access delays. PHI inventory took 3 weeks longer than estimated but was handled via Change Order without client escalation.' },
      { name: 'Proseware SOC Modernization', industry: 'Financial Services', year: 2025, outcome: 'success', relevance: 'Medium', lesson: 'Sentinel analytics pack deployed on a compressed timeline when connectors were pre-qualified in Phase 1. HIPAA analytics ruleset has similar pre-qualification requirements — apply same approach.' },
      { name: 'City Power & Light SOC Modernization', industry: 'Energy', year: 2024, outcome: 'success', relevance: 'Medium', lesson: 'Regulated industry delivery with NERC CIP overlay (analogous to HIPAA regulatory complexity). Monthly compliance review cadence with client legal team was the key governance success factor.' },
    ],
    agentMatches: [
      { name: 'Sarah Mitchell', role: 'Healthcare Security Delivery Lead', credits: [{ project: 'Lamna Healthcare Azure & Security Foundation', csat: 4.2 }], industries: ['Healthcare'], availability: 'Confirmed available Month 1', regions: ['Americas'] },
    ],
    marketSignals: [
      { feed: 'APAC Health Data Regulation Monitor', alert: 'Australia (My Health Records Act amendment), Singapore (PDPA healthcare provisions update), and Japan (APPI health data guidance) all issued updated health data guidelines in 2025–2026. Review against hospital country locations before Phase 1 scope is finalized.', severity: 'warning', date: 'Apr 2026', dimension: 'Regulatory Compliance' },
    ],
    alignmentFlags: [
      { label: 'APAC Regulatory Mapping → Phase 1', status: 'warning', detail: 'No APAC in-country regulatory mapping is scheduled. Three countries have issued new health data guidelines that may affect scope.' },
      { label: 'Sarah Mitchell → Delivery Lead Confirmation', status: 'warning', detail: 'Sarah Mitchell is recommended in AI conditions but not yet formally confirmed as delivery lead.' },
      { label: 'BAA → Pre-Access Gate', status: 'ok' },
      { label: 'Co-investment → Commercial Terms', status: 'warning', detail: 'Co-investment approval memo not attached as exhibit to the deal file.' },
    ],
  },

  // ─── 8. CONSOLIDATED MESSENGER ───────────────────────────────────────────
  'Consolidated Messenger': {
    compositeScore: 3.5,
    executiveBrief: {
      riskTier: 'High Risk',
      headlineRisk: '14-country D365 F&O rollout with 30% SI partner, 14 local payroll integrations (APIs unspecified), and 70% delivery success rate on comparable multi-country programs. Wide World Importers D365 Global is the most relevant precedent — terminated at Wave 2 due to scope explosion. The same conditions are present.',
      precedentSignal: '70% delivery success rate on 2 comparable multi-country ERP programs — below the 80% threshold for standard approval. The only failure in the D365 service line (Wide World Importers) is a direct structural parallel to this engagement.',
      deliveryConfidence: 'Elena Vasquez available as D365 lead. David Okonkwo has multi-country ERP experience but was the delivery lead on Wide World Importers (terminated). Architecture Review Board assessment is required — not yet completed. Team for a 28-month 14-country program is not fully staffed.',
      marketContext: 'SAP ECC sunset pressure is increasing deal urgency. However, 14-country multi-jurisdictional D365 rollouts have a materially higher complexity and risk profile than single-country programs. GDPR enforcement across 14 EU jurisdictions and local payroll regulation variance are active risk signals.',
      decisionGuidance: 'Do not approve in current form. Required before resubmission: (1) ARB assessment completed; (2) revised SOW with country-level phase plans and out-of-scope per jurisdiction; (3) 14 payroll API specifications documented; (4) Finance margin floor analysis with overrun contingency plan; (5) SI partner SLA and indemnification terms confirmed.',
    },
    sections: [
      { id: 'executive-brief', number: '1.', title: 'Executive Risk Brief', sectionType: 'brief', content: [{ t: 'p', text: 'High Risk. This is the highest-risk deal in the current pending portfolio. The multi-country complexity, SI partner dependency, low comparable success rate, and incomplete SOW create a risk profile that does not support approval in current form. The AI model recommends resubmission after ARB assessment and SOW remediation. The commercial opportunity is real — the path to approval requires resolving the structural SOW gaps first.' }] },
      { id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment', sectionType: 'standard', dimensionKey: 'delivery_complexity', content: [{ t: 'bullets', items: ['14 countries, 4 waves, 28 months: the longest and most geographically complex program in the pending portfolio by a significant margin', '14 local payroll integrations: each payroll vendor API is a distinct integration with different specifications — 14 unknown APIs is the single most complex technical unknown', 'Finance (GL, AP/AR, Fixed Assets) + Logistics (WM, TMS) + HR: three module tracks running concurrently across 4 geographic waves', '30% SI partner: coordination overhead and quality variance across 14 countries adds significant management complexity', 'Country legal entity differences: chart of accounts, tax rules, and financial reporting requirements vary per country — D365 configuration is not standard across all 14'] }] },
      { id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment', sectionType: 'standard', dimensionKey: 'client_readiness', content: [{ t: 'bullets', items: ['No named executive sponsor in the deal profile: the most significant client readiness gap for a 28-month program', 'Client Global Program Manager is named in governance plan but their authority and organizational reach across 14 countries is unknown', 'Country lead availability (1 FTE equivalent per country): 14 country leads required — no confirmation that client has the organizational depth to commit this resource level', 'Change management for 14-country ERP replacement is a massive organizational undertaking — no change management approach is documented'] }] },
      { id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment', sectionType: 'standard', dimensionKey: 'commercial_structure', content: [{ t: 'bullets', items: ['22% margin with 30% SI partner: at this complexity level and partner dilution, the commercial buffer for overruns is critically thin', 'No margin contingency defined: if any wave encounters scope variance (14-country payroll integration variance alone could shift effort materially), there is no financial mechanism to protect Microsoft', 'Fixed fee by wave on unknown country-level scope: the highest commercial risk structure for the most complex deal in the portfolio', 'Finance flagged for margin floor review: this flag must be resolved before approval, not after'] }] },
      { id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment', sectionType: 'standard', dimensionKey: 'execution_resourcing', content: [{ t: 'bullets', items: ['Elena Vasquez available as D365 lead: appropriate for the ERP delivery track', 'David Okonkwo has multi-country ERP experience but was delivery lead on Wide World Importers (terminated at Wave 2): flagged for review, not recommended as lead for this engagement', 'Architecture Review Board assessment not completed: required before executive approval per AI conditions — outstanding', 'A 28-month, 14-country program requires a dedicated program office of 4–6 Microsoft PS professionals — not yet staffed or costed'] }] },
      { id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment', sectionType: 'standard', dimensionKey: 'regulatory_compliance', content: [{ t: 'bullets', items: ['GDPR applies across EU member state countries in scope: data processing agreements (DPAs) per country are required — not yet listed', '14 local payroll regulation regimes: each country has distinct payroll reporting, data retention, and employee privacy rules — none are documented in the current SOW', 'SI partner regulatory compliance: the SI partner is responsible for local regulatory configuration but their methodology is not documented', 'Regulatory risk is rated as the highest for any deal in the current pending portfolio'] }] },
      { id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment', sectionType: 'standard', dimensionKey: 'partner_ecosystem', content: [{ t: 'bullets', items: ['Regional SI partner at 30%: above the 25% threshold where partner management overhead materially affects delivery confidence', 'SI partner track record: 2 comparable multi-country engagements rated — performance data is limited for the 14-country scope', 'No SI partner SLA or indemnification terms in the subcontract: a high-severity commercial gap for a partner carrying 30% of delivery', 'SI partner selection process: the specific regional SI partner is not named — "Regional SI Partner" is a placeholder'] }] },
      { id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment', sectionType: 'standard', dimensionKey: 'technology_maturity', content: [{ t: 'bullets', items: ['D365 F&O platform: fully mature and GA', 'Multi-country D365 F&O: the global template approach is established but country-level localization complexity varies significantly — 14 countries at once is at the edge of Microsoft PS delivery capacity', '14 payroll integration APIs: all unknown — technology maturity of the integration layer cannot be assessed until APIs are documented', 'Local payroll localization packs: some countries have established D365 localization packs, others require custom configuration'] }] },
      { id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence', sectionType: 'precedent', content: [{ t: 'p', text: 'Two comparable multi-country D365 programs retrieved. The Wide World Importers failure is the most critical precedent — it is the only D365 failure in our delivery history and the structural parallels to this deal are direct. Review this case with the ARB before approval.' }] },
      { id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence', sectionType: 'agents', content: [{ t: 'p', text: 'Elena Vasquez is available as D365 delivery lead. David Okonkwo has multi-country experience but carries the Wide World Importers context — flagged. A full 28-month program office team is not yet identified.' }] },
      { id: 'market-signals', number: '11.', title: 'Market Signal Alerts', sectionType: 'signals', content: [{ t: 'p', text: 'Two active market signals. Both are adverse — GDPR enforcement and SAP sunset pressure creating deal urgency at the expense of risk diligence.' }] },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 2.5, strength: 'D365 F&O platform is mature. Global template approach is established for multi-country deployments.', gaps: ['14 payroll integration APIs are undocumented — scope is entirely unknown', '14-country concurrent scope is at the edge of Microsoft PS delivery capacity for a single program', '30% SI partner coordination across 14 countries creates management complexity not fully addressed in the governance plan'], recommendation: 'Mandatory: document all 14 payroll API specifications before contract execution. Wave 1 must not begin until APIs for Wave 1 countries are validated.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 4.0, strength: 'Wave-based structure implies some client organizational planning has occurred.', gaps: ['No named executive sponsor — critical gap for a 28-month program', '14 country lead commitments not confirmed — significant organizational depth required from client', 'No change management approach for global ERP replacement'], recommendation: 'Require named executive sponsor (C-suite) and country lead commitment letters for all 14 countries before ARB assessment.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 3.5, strength: 'Wave-based billing structure aligns payment to delivery gates.', gaps: ['22% margin with 30% partner: no buffer for overruns at this complexity level', 'No overrun contingency mechanism defined', 'Fixed fee on undocumented country-level scope is the highest commercial risk structure available'], recommendation: 'Finance margin floor review must be completed before resubmission. Define a per-wave overrun contingency mechanism before contract execution.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 4.5, strength: 'Elena Vasquez available as D365 delivery lead with comparable experience.', gaps: ['David Okonkwo flagged: Wide World Importers context requires ARB review before any leadership role', 'Full program office team (4–6 professionals) not yet identified', 'ARB assessment outstanding — a required gate per AI conditions'], recommendation: 'ARB assessment is a hard gate for approval. Do not execute contract until ARB has reviewed and signed off on the program office structure and resourcing plan.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '10%', score: 3.0, strength: 'GDPR is a known framework with established compliance methodology.', gaps: ['Data processing agreements (DPAs) not documented for any of the 14 countries', '14 local payroll regulation regimes entirely unassessed', 'SI partner regulatory compliance methodology not documented'], recommendation: 'GDPR DPA mapping for all 14 countries must be completed before contract execution. Payroll regulatory mapping is a Wave 1 kickoff gate per country.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 4.0, strength: 'SI partner is committed to local regulatory configuration per country — appropriate use of local expertise.', gaps: ['SI partner not named — "Regional SI Partner" is a placeholder', 'No SLA or indemnification terms in the subcontract — high-severity commercial gap', 'Performance data on SI partner at 14-country scale is limited'], recommendation: 'Named SI partner with confirmed SLA and indemnification terms is a contract execution gate. Do not sign without these.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 5.5, strength: 'D365 F&O is a fully mature, GA platform.', gaps: ['14 payroll integration APIs unknown — technology maturity of integration layer cannot be assessed', 'Country-specific D365 localization packs: some countries require custom configuration not covered by standard packs'], recommendation: 'Payroll API documentation is a mandatory pre-contract deliverable for Wave 1 countries. Custom localization scope to be assessed in Wave 1 design.' },
    ],
    referenceProjects: [
      { name: 'Northwind Traders D365 F&O', industry: 'Distribution', year: 2026, outcome: 'success', relevance: 'High', lesson: 'In progress — single-country SAP-to-D365 migration. Early indicators positive. Data quality assessment gate in Phase 1 prevented the issues seen in Southridge. However: 14-country scope is a fundamentally different risk profile than single-country.' },
      { name: 'Wide World Importers D365 Global', industry: 'Retail / Import', year: 2022, outcome: 'failed', relevance: 'High', lesson: 'The only D365 failure in Microsoft PS delivery history. Terminated at Wave 2 (8 countries) due to: scope explosion in local payroll integrations (APIs not as documented), SI partner quality failure in Wave 2 countries, and margin erosion to near-zero. Root causes are structurally identical to this deal. ARB review of this case is mandatory before Consolidated Messenger approval.' },
      { name: 'Southridge D365 F&O Transformation', industry: 'Distribution', year: 2023, outcome: 'partial', relevance: 'Medium', lesson: 'SAP data migration +8 weeks. Single-country. At 14 countries, a similar data migration delay would cascade across all 4 waves. Country-level data migration risk must be assessed per country, not globally.' },
    ],
    agentMatches: [
      { name: 'Elena Vasquez', role: 'D365 F&O Delivery Lead', credits: [{ project: 'Southridge D365 F&O Transformation', csat: 4.2 }, { project: 'Trey Research D365 Sales & CS', csat: 4.0 }], industries: ['Distribution', 'Professional Services'], availability: 'Available from Month 1 (subject to ARB approval)', regions: ['Americas', 'EMEA'] },
      { name: 'David Okonkwo', role: 'Multi-Country ERP Program Director', credits: [{ project: 'Wide World Importers D365 Global', csat: 3.2 }], industries: ['Retail'], availability: 'Available but flagged — ARB review required before leadership assignment', regions: ['EMEA', 'Americas'] },
    ],
    marketSignals: [
      { feed: 'SAP ECC Sunset Pressure Monitor', alert: 'SAP ECC mainstream maintenance ends 2027. Clients are accelerating D365 migration timelines, creating deal urgency that may pressure risk diligence. Consolidated Messenger\'s urgency to proceed should not override ARB assessment and SOW remediation requirements.', severity: 'warning', date: 'May 2026', dimension: 'Delivery Complexity' },
      { feed: 'GDPR Multi-Jurisdiction Monitor', alert: 'GDPR enforcement actions in multi-country business process outsourcing increased 40% in 2025. 14-country data processing without documented DPAs per country is a high-enforcement-risk posture. Legal review required before contract execution.', severity: 'critical', date: 'Apr 2026', dimension: 'Regulatory Compliance' },
    ],
    alignmentFlags: [
      { label: 'Wide World Importers Precedent → ARB Review', status: 'warning', detail: 'The only D365 failure in delivery history is a structural parallel to this deal. ARB must review the Wide World Importers case before approval.' },
      { label: 'Payroll API Specs → Scope Completeness', status: 'warning', detail: '14 payroll integration APIs are undocumented. Contract scope is fundamentally incomplete without them.' },
      { label: 'GDPR DPAs → Regulatory Compliance', status: 'warning', detail: 'No data processing agreements documented for any of the 14 countries. GDPR enforcement risk is critical.' },
      { label: 'SI Partner Identity → Partner & Ecosystem', status: 'warning', detail: '"Regional SI Partner" is a placeholder — SI partner is not named and no SLA or indemnification terms exist.' },
    ],
  },

  'City Power & Light': {
    compositeScore: 7.0,
    executiveBrief: {
      riskTier: 'Managed Risk',
      headlineRisk: 'OT/IT convergence and NERC CIP compliance add delivery complexity beyond a standard Sentinel deployment.',
      precedentSignal: '5 comparable Sentinel SOC engagements in utilities — 92% delivery success rate. OT-specific deployments require additional scoping diligence.',
      deliveryConfidence: 'High confidence for IT Sentinel scope. Moderate confidence for OT/Defender for IoT scope pending OT asset inventory.',
      marketContext: 'Critical infrastructure cybersecurity mandates are intensifying post-2025 grid incidents. Regulated utilities are under board-level pressure to demonstrate NERC CIP compliance.',
      decisionGuidance: 'Approve with OT asset inventory as a kickoff gate. NERC CIP compliance analytics scope must be baselined against current regulatory version before deployment begins.',
    },
    sections: [
      { id: 'executive-brief', number: '1.', title: 'Executive Risk Brief', sectionType: 'brief', content: [{ t: 'p', text: 'Managed Risk. Strong strategic alignment, proven delivery playbook, and solid margin. The primary risk is OT scope uncertainty — Defender for IoT integration scope depends on an OT asset inventory that is not yet complete. NERC CIP compliance analytics require regulatory version alignment. Both are kickoff gates, not contract blockers. Approve with conditions.' }] },
      { id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment', sectionType: 'standard', dimensionKey: 'delivery_complexity', content: [{ t: 'bullets', items: ['IT Sentinel deployment is well within established playbook — 40+ connector library, analytics rules, and SOAR playbooks are reusable assets', 'OT environment introduces Defender for IoT scope that is not fully assessed — OT asset inventory is a prerequisite for accurate scoping', 'NERC CIP compliance analytics rules require regulatory version alignment — client must confirm current CIP version before rule development begins', '24x7 SOC establishment: staffing model and client SOC team integration need to be finalized at kickoff', 'No vendor/partner dependency — all delivery is direct Microsoft PS, which reduces coordination complexity'] }] },
      { id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment', sectionType: 'standard', dimensionKey: 'client_readiness', content: [{ t: 'bullets', items: ['Regulated utility: security investment is mandatory, not discretionary — strong client commitment likely', 'OT environment access and coordination with OT operations team must be established at kickoff — OT teams are often organizationally separate from IT', 'NERC CIP compliance owner must be identified and engaged — regulatory alignment decisions require a named compliance stakeholder', 'SOC capability goal: client must clarify whether 24x7 SOC is fully outsourced, co-managed, or internally staffed with Microsoft support'] }] },
      { id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment', sectionType: 'standard', dimensionKey: 'commercial_structure', content: [{ t: 'bullets', items: ['35% margin: strong for a security engagement of this scale — provides adequate buffer for OT scope variance', 'No vendor participation: full margin retained by Microsoft PS', '$968K total value: appropriately sized for 160-day Sentinel + 80-day SOC + 60-day Defender XDR scope', 'OT scope risk: if OT asset inventory reveals significantly more endpoints than estimated, Defender for IoT scope will expand — change order mechanism should be defined at contract execution'] }] },
      { id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment', sectionType: 'standard', dimensionKey: 'execution_resourcing', content: [{ t: 'bullets', items: ['Sentinel deployment expertise is well-resourced within Microsoft PS security practice', 'OT security specialization (Defender for IoT) is a narrower skill set — OT specialist availability should be confirmed before contract execution', 'SOC design lead: requires a senior security architect with SOC operations experience, not just deployment experience', 'NERC CIP subject matter expertise: either internal (Microsoft regulatory practice) or external consultant must be identified'] }] },
      { id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment', sectionType: 'standard', dimensionKey: 'regulatory_compliance', content: [{ t: 'bullets', items: ['NERC CIP (North American Electric Reliability Corporation Critical Infrastructure Protection): mandatory for regulated electric utilities — this is the primary compliance driver', 'CIP-007 (Systems Security Management) and CIP-010 (Configuration Change Management) are the most relevant standards for Sentinel analytics scope', 'Current CIP version must be confirmed — regulatory requirements have evolved and analytics rules must align to the applicable version', 'No HIPAA, GDPR, or SOX requirements in scope — compliance burden is focused and manageable'] }] },
      { id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment', sectionType: 'standard', dimensionKey: 'partner_ecosystem', content: [{ t: 'bullets', items: ['No partner/subcontractor dependency — clean delivery model', 'NERC CIP consulting may benefit from a specialized regulatory partner if internal expertise is not available — not yet identified', 'Microsoft Defender for IoT is a first-party product — no third-party OT security vendor dependency'] }] },
      { id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment', sectionType: 'standard', dimensionKey: 'technology_maturity', content: [{ t: 'bullets', items: ['Microsoft Sentinel: fully mature, GA platform with established deployment methodology', 'Defender for IoT: GA platform, but OT environment integration complexity varies significantly by asset type and network architecture', 'Defender XDR: mature platform, straightforward deployment against documented seat count', 'NERC CIP analytics rules: some pre-built content available, but regulatory-specific rules typically require custom development'] }] },
      { id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence', sectionType: 'precedent', content: [{ t: 'p', text: '5 comparable Sentinel SOC engagements with 92% success rate. The Proseware SOC Modernization is the most directly comparable — similar scope and scale, completed successfully with CSAT 4.6. OT-specific deployments are less common but have precedent in the energy sector.' }] },
      { id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence', sectionType: 'agents', content: [{ t: 'p', text: 'Marcus Webb is identified as the primary Sentinel delivery lead with SOC design experience. OT specialist availability must be confirmed before contract execution.' }] },
      { id: 'market-signals', number: '11.', title: 'Market Signal Alerts', sectionType: 'signals', content: [{ t: 'p', text: 'One active market signal: NERC CIP enforcement actions increased 28% in 2025. Client urgency is appropriate and should not delay proper OT scoping diligence at kickoff.' }] },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 7.5, strength: 'Sentinel deployment is within proven playbook with reusable connector library and SOAR content.', gaps: ['OT asset inventory not complete — Defender for IoT scope cannot be finalized', 'NERC CIP analytics rules require custom development against current regulatory version'], recommendation: 'Define OT asset inventory as a kickoff gate deliverable. Do not begin Defender for IoT deployment until inventory is validated.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 7.0, strength: 'Regulated utility — security investment is mandatory and client commitment is strong.', gaps: ['OT operations team engagement model not defined', 'SOC staffing model (outsourced vs. co-managed) not finalized', 'NERC CIP compliance owner not yet named'], recommendation: 'Require named NERC CIP compliance stakeholder and OT operations contact at contract execution.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 8.0, strength: '35% margin with no vendor dilution — strong commercial position.', gaps: ['OT scope variance risk: Defender for IoT scope may expand once asset inventory is complete'], recommendation: 'Define change order mechanism for OT scope expansion at contract execution. Cap initial OT delivery to scoped days until inventory is validated.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 7.5, strength: 'Strong Sentinel delivery bench available within security practice.', gaps: ['OT security specialist (Defender for IoT) availability not confirmed', 'NERC CIP subject matter expert not yet identified'], recommendation: 'Confirm OT specialist and NERC CIP expert availability before contract signing.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '10%', score: 6.0, strength: 'NERC CIP is a known, documented framework with established analytics content available.', gaps: ['Applicable CIP version not confirmed', 'Specific CIP controls in scope not mapped to Sentinel analytics rules'], recommendation: 'Complete NERC CIP controls mapping as first project deliverable in Week 1.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 8.5, strength: 'No partner dependency — direct Microsoft PS delivery retains full margin and quality control.', gaps: ['Potential need for NERC CIP specialist if internal expertise is unavailable'], recommendation: 'Assess NERC CIP internal expertise before contract execution. Engage regulatory specialist if gap is identified.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 7.5, strength: 'Sentinel and Defender XDR are fully mature GA platforms.', gaps: ['Defender for IoT OT integration complexity depends on client network architecture', 'Custom NERC CIP analytics rules require development effort'], recommendation: 'OT network architecture discovery in Week 1 to assess Defender for IoT deployment complexity.' },
    ],
    referenceProjects: [
      { name: 'Proseware SOC Modernization', industry: 'Technology', year: 2026, outcome: 'success', relevance: 'High', lesson: 'Comparable Sentinel + Defender scope. CSAT 4.6. Established deployment pattern is directly applicable. Key difference: no OT environment or regulatory compliance requirement in Proseware.' },
      { name: 'Northwind Healthcare Sentinel & Compliance', industry: 'Healthcare', year: 2025, outcome: 'success', relevance: 'Medium', lesson: 'Regulatory-driven Sentinel deployment with compliance analytics. HIPAA analytics rules development provides methodology precedent for NERC CIP custom rule development.' },
    ],
    agentMatches: [
      { name: 'Marcus Webb', role: 'Sentinel SOC Delivery Lead', credits: [{ project: 'Proseware SOC Modernization', csat: 4.6 }, { project: 'Fourth Coffee Sentinel Deployment', csat: 4.4 }], industries: ['Technology', 'Financial Services'], availability: 'Available from contract start', regions: ['Americas'] },
    ],
    marketSignals: [
      { feed: 'Critical Infrastructure Security Monitor', alert: 'NERC CIP enforcement actions increased 28% in 2025 following grid security incidents. Regulated utilities are under increased FERC scrutiny. City Power & Light urgency is appropriate — do not allow urgency to compress OT scoping diligence.', severity: 'warning', date: 'Apr 2026', dimension: 'Regulatory Compliance' },
    ],
    alignmentFlags: [
      { label: 'OT Asset Inventory → Scope Completeness', status: 'warning', detail: 'Defender for IoT scope cannot be finalized without OT asset inventory. Define as kickoff gate.' },
      { label: 'NERC CIP Version → Regulatory Compliance', status: 'warning', detail: 'Applicable CIP version not confirmed. Analytics rules must align to current regulatory version.' },
      { label: 'Sentinel Playbook → IP Leverage', status: 'ok', detail: 'Established Sentinel deployment playbook with reusable connector library applies directly.' },
      { label: '35% Margin → Commercial Health', status: 'ok', detail: 'Strong margin with no vendor dilution. Adequate buffer for OT scope variance.' },
    ],
  },

  'Datum Corporation': {
    compositeScore: 5.5,
    executiveBrief: {
      riskTier: 'Elevated Risk',
      headlineRisk: 'Multi-agent AI platform on Azure AI Studio: technology maturity risk and model performance uncertainty are the primary delivery risks for this engagement.',
      precedentSignal: 'Prior Datum AI engagement resulted in partial outcome — AI model underperformed against baseline expectations. Root cause was insufficient training data and misaligned success criteria. Both gaps are present in this deal.',
      deliveryConfidence: 'Moderate. Agent architecture and Semantic Kernel orchestration are well-understood. Model performance against business KPIs is not predictable without defined baselines.',
      marketContext: 'Enterprise agentic AI adoption is accelerating. Client expectations frequently exceed what current LLM accuracy rates support in production workflows. Managing expectation alignment is as important as technical delivery.',
      decisionGuidance: 'Approve with conditions: success criteria and performance baselines for all three agents must be defined before contract execution. Responsible AI review gate must be completed before production deployment.',
    },
    sections: [
      { id: 'executive-brief', number: '1.', title: 'Executive Risk Brief', sectionType: 'brief', content: [{ t: 'p', text: 'Elevated Risk. Strong strategic alignment and solid IP leverage score offset by material technology maturity risk on production multi-agent deployments. A prior Datum engagement with AI underperformance is the most relevant precedent — the same gaps (undefined baselines, ambiguous success criteria) are present in the current deal. Approve with defined success criteria for all three agents before contract execution.' }] },
      { id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment', sectionType: 'standard', dimensionKey: 'delivery_complexity', content: [{ t: 'bullets', items: ['Three agents in parallel: HR onboarding, procurement approval, customer service deflection — three distinct workflows, data sources, and business owners', 'Semantic Kernel orchestration: well-understood framework, but multi-agent coordination complexity increases non-linearly with agent count', 'AI governance framework: requires legal, HR, and IT stakeholder alignment — cross-functional coordination is a delivery risk', 'Responsible AI review: required before production deployment — timeline dependency on client review cycles', 'Production accuracy targets: none defined in current SOW — this is the highest-risk gap for an AI delivery engagement'] }] },
      { id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment', sectionType: 'standard', dimensionKey: 'client_readiness', content: [{ t: 'bullets', items: ['Three agents require three distinct business owner champions — HR, Procurement, and Customer Service must each be engaged and committed', 'Training data quality and availability not assessed — each agent requires labeled data or documented workflow examples', 'Client AI literacy: non-technical business owners frequently misunderstand LLM capabilities — expectation calibration workshop is essential', 'Responsible AI governance: client must designate an AI governance owner with authority to approve production deployment gates'] }] },
      { id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment', sectionType: 'standard', dimensionKey: 'commercial_structure', content: [{ t: 'bullets', items: ['33% margin: adequate for a professional services AI engagement', '$1.216M total: 280 days of senior AI engineering at blended rate — appropriately sized for three-agent build', 'Risk: if agent performance does not meet client expectations at UAT, rework scope can materially expand — no rework mechanism defined in current SOW', 'Azure consumption ACR: $50K/month is strong strategic value and partially offsets delivery risk from a Microsoft business perspective'] }] },
      { id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment', sectionType: 'standard', dimensionKey: 'execution_resourcing', content: [{ t: 'bullets', items: ['Azure AI Studio and Semantic Kernel expertise is available within Microsoft AI practice', 'Agent specialization required: HR workflow automation, procurement approval logic, and customer service AI are three distinct domain knowledge areas', 'Responsible AI specialist: must be named before production deployment gate — not yet identified', 'Prior Datum engagement context: delivery team should be briefed on the prior AI underperformance incident to avoid recurrence'] }] },
      { id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment', sectionType: 'standard', dimensionKey: 'regulatory_compliance', content: [{ t: 'bullets', items: ['AI governance framework is in scope — compliance risk is primarily internal governance, not external regulatory', 'HR agent: employee data privacy considerations (GDPR if EU employees are in scope) must be assessed', 'Procurement approval agent: financial controls and audit trail requirements must be designed into the agent workflow', 'Customer service agent: consumer-facing AI requires explicit disclosure practices — Responsible AI review is the primary compliance gate'] }] },
      { id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment', sectionType: 'standard', dimensionKey: 'partner_ecosystem', content: [{ t: 'bullets', items: ['No partner dependency — direct Microsoft PS AI practice delivery', 'All three agents are built on Microsoft-first stack (Azure AI Studio, Semantic Kernel) — no third-party AI vendor dependency'] }] },
      { id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment', sectionType: 'standard', dimensionKey: 'technology_maturity', content: [{ t: 'bullets', items: ['Azure AI Studio: GA platform, but multi-agent orchestration at production scale is an evolving pattern', 'Semantic Kernel: mature framework for orchestration, well-suited for multi-agent workflows', 'LLM accuracy in production: enterprise AI agents in HR, procurement, and customer service typically achieve 75-85% accuracy in initial production — below the accuracy thresholds clients often assume', 'Model performance against business KPIs: the single largest technology risk — cannot be predicted without defined baselines and test datasets'] }] },
      { id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence', sectionType: 'precedent', content: [{ t: 'p', text: 'Prior Datum Corporation AI engagement resulted in partial outcome. The AI model underperformed against the client\'s expected accuracy threshold. Root cause: no defined performance baseline at contract execution — client expectations were set during sales, not formalized in the SOW. The current deal has the same gap. This precedent is the primary driver for the success criteria condition.' }] },
      { id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence', sectionType: 'agents', content: [{ t: 'p', text: 'Priya Nair is the identified AI platform delivery lead with Azure AI Studio production deployment experience. Domain specialists for HR, procurement, and customer service AI should be confirmed before kickoff.' }] },
      { id: 'market-signals', number: '11.', title: 'Market Signal Alerts', sectionType: 'signals', content: [{ t: 'p', text: 'Two active signals: enterprise AI agent adoption is accelerating with an accompanying rise in expectation misalignment incidents. Responsible AI compliance requirements are hardening in enterprise procurement.' }] },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 5.0, strength: 'Semantic Kernel orchestration framework is well-understood within the AI practice.', gaps: ['Three parallel agents with distinct domain knowledge requirements', 'Production accuracy baselines not defined — delivery success criteria are ambiguous', 'AI governance framework requires multi-stakeholder alignment across HR, Procurement, and CS'], recommendation: 'Define per-agent success criteria and accuracy baselines before contract execution. Phase agent delivery: HR agent first (lowest sensitivity), then Procurement, then Customer Service.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 5.5, strength: 'Client has invested in AI governance — designated AI governance owner is a positive signal.', gaps: ['Three business owner champions required — commitment level of each not assessed', 'Training data quality and availability unknown for all three agents', 'Client AI literacy gap: expectation calibration workshop not yet scheduled'], recommendation: 'Business owner commitment letters and training data availability assessment must be completed before each agent\'s build phase begins.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 6.5, strength: '33% margin is adequate. $50K/month Azure ACR adds strategic value.', gaps: ['No rework mechanism defined for agent performance failures at UAT'], recommendation: 'Define UAT acceptance criteria and rework scope boundaries in the contract. Limit rework to two revision cycles per agent.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 6.5, strength: 'Azure AI Studio and Semantic Kernel expertise available in AI practice.', gaps: ['Domain specialists for all three agent types not yet identified', 'Responsible AI specialist not named — required for production gate'], recommendation: 'Name domain specialists for each agent track and Responsible AI specialist before contract execution.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '10%', score: 7.5, strength: 'No external regulatory requirement. AI governance framework is in scope as a deliverable.', gaps: ['Employee data privacy (GDPR) for HR agent must be assessed if EU employees are in scope', 'Financial audit trail for procurement approval agent must meet internal controls standards'], recommendation: 'HR agent data privacy assessment in Week 1. Procurement agent audit trail design to be validated against client\'s internal audit requirements.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 8.0, strength: 'No partner dependency. Microsoft-first stack with full IP leverage.', gaps: [], recommendation: 'Maintain direct delivery model. No partner engagement needed for this scope.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 4.5, strength: 'Azure AI Studio and Semantic Kernel are production-ready platforms.', gaps: ['Multi-agent production accuracy rates in enterprise workflows are below client expectations in many initial deployments', 'Model performance against business KPIs cannot be predicted without defined baselines and test datasets'], recommendation: 'Conduct model performance benchmarking sprint in Week 2-3 against defined test datasets before any production deployment gate.' },
    ],
    referenceProjects: [
      { name: 'Datum Corporation AI Pilot', industry: 'Technology', year: 2024, outcome: 'partial', relevance: 'High', lesson: 'Prior Datum AI engagement: AI model underperformed against client expectations. Root cause was undefined performance baselines at contract execution. Client expectations were set during sales discovery, not formalized in the SOW. The current deal has the same structural gap — success criteria conditions are mandatory.' },
      { name: 'Alpine Insurance AI Advisor', industry: 'Insurance / Financial Services', year: 2025, outcome: 'success', relevance: 'Medium', lesson: 'Enterprise AI agent with defined accuracy baselines achieved 82% production accuracy against a 80% contractual threshold. Success was directly attributed to pre-defined test datasets and phased production rollout.' },
    ],
    agentMatches: [
      { name: 'Priya Nair', role: 'Azure AI Studio Delivery Lead', credits: [{ project: 'Alpine Insurance AI Advisor', csat: 4.5 }, { project: 'Contoso AI Platform POC', csat: 4.2 }], industries: ['Insurance', 'Technology'], availability: 'Available from contract start', regions: ['Americas', 'APAC'] },
    ],
    marketSignals: [
      { feed: 'Enterprise AI Adoption Monitor', alert: 'Enterprise AI agent deployments in HR, procurement, and customer service show 35% of projects experiencing expectation misalignment at UAT in 2025. Defined accuracy baselines at contract execution reduce this rate to under 10%. Success criteria conditions are evidence-based, not conservative.', severity: 'warning', date: 'May 2026', dimension: 'Technology Maturity' },
      { feed: 'Responsible AI Compliance Tracker', alert: 'Enterprise procurement requirements for Responsible AI documentation increased 60% in 2025. Responsible AI review gate is now a procurement condition in many enterprise AI contracts — client may independently require it regardless of Microsoft conditions.', severity: 'info', date: 'Mar 2026', dimension: 'Regulatory Compliance' },
    ],
    alignmentFlags: [
      { label: 'Success Criteria → SOW Quality', status: 'warning', detail: 'No per-agent accuracy baselines defined. Prior Datum AI partial outcome traced to this same gap. Mandatory condition before contract execution.' },
      { label: 'Training Data → Delivery Risk', status: 'warning', detail: 'Training data quality and availability not assessed for any of the three agents. Data assessment must precede each build phase.' },
      { label: 'Responsible AI Gate → Compliance', status: 'warning', detail: 'Responsible AI review must be completed before production deployment for all three agents.' },
      { label: 'Azure AI Studio → IP Leverage', status: 'ok', detail: 'IP leverage score 9.0 — Microsoft-first stack with full reuse of AI accelerators and Semantic Kernel patterns.' },
    ],
  },

  'Proseware Inc': {
    compositeScore: 8.0,
    executiveBrief: {
      riskTier: 'Managed Risk',
      headlineRisk: 'Well-scoped SOC modernization with proven Sentinel playbook. Primary risk is SOC staffing model finalization and 40+ connector integration validation.',
      precedentSignal: 'Proseware SOC Modernization is in active delivery — CSAT tracking at 4.6. This deal profile represents the pre-approval risk assessment that preceded the current active engagement.',
      deliveryConfidence: 'High. Sentinel + Defender deployment is within established playbook. 40+ connector library reduces custom integration work materially.',
      marketContext: 'Enterprise security spend is at an all-time high following 2025 threat landscape escalation. SOC modernization engagements are the highest-velocity segment of the Microsoft security practice.',
      decisionGuidance: 'Approve. SOC staffing model should be finalized at kickoff. Connector integration validation to be completed in Phase 1 before SOAR automation development begins.',
    },
    sections: [
      { id: 'executive-brief', number: '1.', title: 'Executive Risk Brief', sectionType: 'brief', content: [{ t: 'p', text: 'Managed Risk. This is one of the strongest deals in the pending approval portfolio. Strong strategic alignment, proven delivery methodology, healthy margin, and no partner dependency. The 40+ connector scope is the primary complexity driver, but the established connector library mitigates this significantly. Approve with SOC staffing model as a kickoff deliverable.' }] },
      { id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment', sectionType: 'standard', dimensionKey: 'delivery_complexity', content: [{ t: 'bullets', items: ['Sentinel SIEM/SOAR with 40+ connectors: connector library covers the majority — custom development is required only for non-standard data sources', 'Custom analytics rules: client-specific detection logic requires threat model workshop in Phase 1', 'Automated playbooks: SOAR playbook development is the most effort-intensive component — scope should be validated against connector inventory', 'Defender suite across 3,500 seats: well-defined scope, straightforward deployment', '24x7 SOC establishment: SOC staffing model (fully managed, co-managed, or advisory) must be finalized at kickoff'] }] },
      { id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment', sectionType: 'standard', dimensionKey: 'client_readiness', content: [{ t: 'bullets', items: ['Client executive sponsor is engaged — security investment is board-level priority', 'Existing security team will be integrated into the SOC model — team size and skill level should be assessed at kickoff', 'IT environment documentation: data sources and endpoints for connector mapping must be provided at project start', '3,500 Defender seats: endpoint inventory must be confirmed and current AV solution documented for migration planning'] }] },
      { id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment', sectionType: 'standard', dimensionKey: 'commercial_structure', content: [{ t: 'bullets', items: ['$824K total, no vendor participation — clean margin retention', '40+ connector scope: if connector count expands beyond 40, SOAR playbook development effort scales accordingly — scope boundary should be explicit in the contract', 'Time and materials for analytics rule development: appropriate given client-specific threat model', 'Azure Sentinel licensing: ensure client has appropriate workspace sizing and licensing in place before data ingestion begins'] }] },
      { id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment', sectionType: 'standard', dimensionKey: 'execution_resourcing', content: [{ t: 'bullets', items: ['Marcus Webb: Sentinel SOC delivery lead, CSAT 4.6 on this engagement (current active delivery)', 'Defender XDR specialist confirmed for seats deployment track', 'SOAR playbook developer: must have experience with Microsoft Sentinel automation rules and Logic Apps integration', 'SOC design consultant: senior security architect to define SOC operating model and escalation procedures'] }] },
      { id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment', sectionType: 'standard', dimensionKey: 'regulatory_compliance', content: [{ t: 'bullets', items: ['No HIPAA, GDPR, NERC CIP, or SOX requirements in scope', 'SOC logging retention: client must define log retention requirements and budget for Sentinel workspace sizing', 'Data residency: if client has data residency requirements, Sentinel workspace region must be configured accordingly at setup'] }] },
      { id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment', sectionType: 'standard', dimensionKey: 'partner_ecosystem', content: [{ t: 'bullets', items: ['No partner/subcontractor dependency — direct Microsoft PS security practice delivery', 'Clean margin structure with full delivery control'] }] },
      { id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment', sectionType: 'standard', dimensionKey: 'technology_maturity', content: [{ t: 'bullets', items: ['Microsoft Sentinel: fully mature GA platform, 40+ native connector library covers most enterprise data sources', 'Microsoft Defender XDR: GA platform with documented 3,500-seat deployment methodology', 'SOAR automation: Logic Apps-based playbooks are well-established within the security practice', 'Custom analytics rules: client-specific rule development is a standard component of every Sentinel deployment'] }] },
      { id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence', sectionType: 'precedent', content: [{ t: 'p', text: 'This engagement is currently in active delivery with CSAT 4.6. The precedent analysis reflects the pre-approval risk profile. Fifth Coffee Corporation Sentinel deployment (2025) provided the playbook baseline. Alpine Insurance Group provides comparable security practice precedent.' }] },
      { id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence', sectionType: 'agents', content: [{ t: 'p', text: 'Marcus Webb is the active delivery lead. Engagement is on track with CSAT 4.6 at current status check. Team is fully resourced.' }] },
      { id: 'market-signals', number: '11.', title: 'Market Signal Alerts', sectionType: 'signals', content: [{ t: 'p', text: 'No adverse market signals. Security spend is at record levels. This engagement is well-positioned as a reference case for the security practice.' }] },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 8.5, strength: 'Sentinel deployment is within the established playbook. 40+ connector library eliminates most custom integration work.', gaps: ['SOAR playbook scope depends on connector count — should be validated in Phase 1'], recommendation: 'Complete connector inventory in Week 1. Validate SOAR playbook scope before development begins.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 7.5, strength: 'Executive sponsor engaged. Security is a board-level priority for the client.', gaps: ['SOC staffing model not yet finalized', 'Existing security team skill assessment pending'], recommendation: 'Finalize SOC operating model and existing team assessment at kickoff.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 8.5, strength: 'Clean margin structure, no vendor dilution, $824K appropriately sized for scope.', gaps: ['Connector scope expansion risk: if data sources exceed 40, SOAR effort scales'], recommendation: 'Define connector count cap in contract. Expansion beyond 40 sources is a change order trigger.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 8.5, strength: 'Active delivery team confirmed. Marcus Webb CSAT 4.6 on this engagement.', gaps: [], recommendation: 'Maintain current team structure. No resourcing gaps identified.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '10%', score: 7.5, strength: 'No external regulatory requirements. Clean compliance profile.', gaps: ['Log retention and data residency requirements to be confirmed at kickoff'], recommendation: 'Define log retention policy and workspace configuration in kickoff.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 9.0, strength: 'No partner dependency. Direct delivery model with full margin control.', gaps: [], recommendation: 'Maintain direct delivery model.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 8.5, strength: 'All platforms are fully mature GA products with established deployment methodology.', gaps: [], recommendation: 'No technology maturity concerns. Proceed with established playbook.' },
    ],
    referenceProjects: [
      { name: 'Fourth Coffee Sentinel & SOC', industry: 'Food & Beverage / Retail', year: 2025, outcome: 'success', relevance: 'High', lesson: 'Closest comparable in scope and scale. Sentinel + Defender + SOC delivery completed on time. CSAT 4.4. Connector library and SOAR playbook reused for Proseware.' },
      { name: 'Alpine Insurance Group Security', industry: 'Insurance', year: 2025, outcome: 'success', relevance: 'Medium', lesson: 'Sentinel SIEM with compliance analytics. SOC co-managed model. Provides SOC operating model precedent.' },
    ],
    agentMatches: [
      { name: 'Marcus Webb', role: 'Sentinel SOC Delivery Lead', credits: [{ project: 'Proseware SOC Modernization', csat: 4.6 }, { project: 'Fourth Coffee Sentinel & SOC', csat: 4.4 }], industries: ['Technology', 'Financial Services', 'Food & Beverage'], availability: 'Active — current delivery lead on this engagement', regions: ['Americas'] },
    ],
    marketSignals: [
      { feed: 'Enterprise Security Spend Monitor', alert: 'Microsoft Sentinel market share in enterprise SIEM reached 34% in Q1 2026, driven by Defender ecosystem integration advantages. This engagement is well-positioned as a reference case.', severity: 'info', date: 'May 2026', dimension: 'Technology Maturity' },
    ],
    alignmentFlags: [
      { label: 'Active Delivery → GREEN Health', status: 'ok', detail: 'Engagement is in active delivery with CSAT 4.6. This risk profile reflects the pre-approval assessment.' },
      { label: 'SOC Staffing Model → Kickoff Gate', status: 'warning', detail: 'SOC operating model (fully managed vs. co-managed) must be finalized at kickoff before SOC design phase begins.' },
      { label: 'Connector Count Cap → Scope Control', status: 'warning', detail: 'Contract should define 40-connector cap with change order trigger for expansion.' },
      { label: '35% Margin → Commercial Health', status: 'ok', detail: 'No vendor dilution. Clean margin structure with adequate buffer.' },
    ],
  },

  'Blue Yonder Inc': {
    compositeScore: 6.0,
    executiveBrief: {
      riskTier: 'Elevated Risk',
      headlineRisk: 'Microsoft Fabric implementation replacing 6 legacy data tools: data migration complexity and legacy system variance are the primary delivery risks.',
      precedentSignal: '85% delivery success rate on comparable data platform migrations. Key risk pattern: data quality issues in legacy systems surface during migration and expand scope. Early data profiling is the established mitigation.',
      deliveryConfidence: 'Moderate. Fabric platform is mature. Legacy tool variance and data quality are the unknowns that determine whether this is a 31-week or 45-week engagement.',
      marketContext: 'Microsoft Fabric is the fastest-growing data platform in the enterprise analytics market. Clients migrating from fragmented legacy landscapes are the primary adopter segment.',
      decisionGuidance: 'Approve (Tier 2). Data profiling sprint as first project phase is mandatory. Executive analytics roadmap must be defined before Fabric architecture finalization.',
    },
    sections: [
      { id: 'executive-brief', number: '1.', title: 'Executive Risk Brief', sectionType: 'brief', content: [{ t: 'p', text: 'Elevated Risk. Microsoft Fabric is a strategic platform with strong IP leverage. The risk is not the technology — it is the six legacy systems being replaced. Data quality variance, legacy API compatibility, and executive analytics requirements that are not yet fully defined create scope uncertainty. Approve with data profiling sprint as Phase 1 gate and executive roadmap as a pre-architecture deliverable.' }] },
      { id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment', sectionType: 'standard', dimensionKey: 'delivery_complexity', content: [{ t: 'bullets', items: ['Six legacy data tools: each tool has distinct data models, integration patterns, and user communities that must be mapped before migration', 'OneLake architecture: data lake architecture design must accommodate all six source systems — schema conflicts are common across fragmented landscapes', 'Lakehouse + Warehouse dual pattern: hybrid analytical pattern adds design complexity but is the correct approach for mixed structured/unstructured workloads', 'Executive dashboards (Power BI Embedded): reporting requirements often expand during delivery — dashboard scope should be bounded in the SOW', 'Migration sequencing: migrating 6 systems in parallel vs. sequential waves is a delivery planning decision that significantly affects risk exposure'] }] },
      { id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment', sectionType: 'standard', dimensionKey: 'client_readiness', content: [{ t: 'bullets', items: ['Data owners for all 6 legacy systems must be identified and engaged — data governance across 6 tools often means 6 separate business owners', 'Data quality baseline: client must provide or commission data quality assessment for all source systems before architecture finalization', 'Executive analytics vision: C-suite reporting requirements must be defined before Fabric architecture is finalized', 'Change management for 6 tool sunsets: decommissioning 6 legacy tools affects multiple user communities — change management plan must be in scope'] }] },
      { id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment', sectionType: 'standard', dimensionKey: 'commercial_structure', content: [{ t: 'bullets', items: ['31% margin is adequate but not generous for a high-complexity data platform engagement', 'Six-tool migration: if data quality issues expand migration effort, 31% margin provides limited buffer', 'Executive dashboard scope: if reporting requirements expand during delivery, scope creep risk is material — dashboard count should be capped in the SOW', '$1.144M total: appropriately sized if data quality is adequate — may be undersized if quality remediation is required'] }] },
      { id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment', sectionType: 'standard', dimensionKey: 'execution_resourcing', content: [{ t: 'bullets', items: ['Microsoft Fabric expertise is growing within the data practice — availability is adequate for this engagement size', 'Data architect with legacy migration experience required — Fabric-specific skills must be paired with legacy system knowledge', 'Power BI Embedded developer for executive dashboards: must be confirmed before reporting phase begins', 'Data engineering lead: senior data engineer to design OneLake architecture and pipeline patterns'] }] },
      { id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment', sectionType: 'standard', dimensionKey: 'regulatory_compliance', content: [{ t: 'bullets', items: ['No external regulatory requirement identified', 'Data residency: if legacy systems contain PII or sensitive data, OneLake region configuration must align to client data policy', 'Data governance: migrating from 6 tools requires a unified data governance policy — client must own this, not Microsoft PS'] }] },
      { id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment', sectionType: 'standard', dimensionKey: 'partner_ecosystem', content: [{ t: 'bullets', items: ['No partner dependency — direct Microsoft PS data practice delivery', 'Legacy system specialists: if any of the 6 legacy tools require specialized knowledge not available in-house, a specialist may be needed'] }] },
      { id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment', sectionType: 'standard', dimensionKey: 'technology_maturity', content: [{ t: 'bullets', items: ['Microsoft Fabric: GA platform, rapidly maturing — some enterprise features are recent GA releases and may have limited production reference cases', 'OneLake: core architecture is stable and well-documented', 'Fabric Data Pipelines: mature, based on Azure Data Factory patterns', 'Legacy tool APIs and export formats: compatibility with Fabric ingestion patterns must be validated per tool — not all legacy tools have clean export mechanisms'] }] },
      { id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence', sectionType: 'precedent', content: [{ t: 'p', text: 'Northwind Traders data modernization (2025) provides the closest comparable. Legacy tool fragmentation is a known pattern — data quality issues surfaced in 2 of 4 source systems during migration, extending the engagement by 6 weeks. Early data profiling in Phase 1 of Northwind prevented a larger overrun. This mitigation is mandatory for Blue Yonder.' }] },
      { id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence', sectionType: 'agents', content: [{ t: 'p', text: 'Aisha Okafor is the identified Fabric data platform lead with legacy migration experience. Power BI Embedded specialist to be confirmed before reporting phase.' }] },
      { id: 'market-signals', number: '11.', title: 'Market Signal Alerts', sectionType: 'signals', content: [{ t: 'p', text: 'One active market signal: Microsoft Fabric adoption is accelerating, with enterprises consolidating legacy analytics tools into Fabric at increasing velocity. Competitive positioning favors early engagement delivery as a reference case.' }] },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 5.5, strength: 'Fabric platform architecture is well-established with Lakehouse + Warehouse pattern as a proven delivery template.', gaps: ['Six legacy tools with distinct data models — schema conflicts are likely', 'Executive dashboard scope not defined — reporting requirements commonly expand during delivery', 'Migration sequencing strategy not yet determined'], recommendation: 'Define migration sequencing in Phase 1. Cap dashboard count in SOW. Data profiling sprint for all 6 source systems before architecture finalization.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 6.0, strength: 'Client has committed to replacing 6 legacy tools — executive mandate is clear.', gaps: ['6 data owners required — fragmented data governance is the expected pattern', 'Data quality baseline not established for any source system', 'Change management plan for 6 tool decommissions not yet defined'], recommendation: 'Data owner mapping as first deliverable. Data quality assessment sprint before architecture finalization.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 6.5, strength: '$1.144M with 31% margin — adequate for the base scope.', gaps: ['31% margin provides limited buffer if data quality remediation is required', 'Dashboard scope creep is a common cost overrun driver for analytics engagements'], recommendation: 'Dashboard count cap in SOW. Define data quality remediation as a separate workstream with explicit scope and budget.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 6.0, strength: 'Fabric expertise is growing in the data practice. Aisha Okafor identified as data platform lead.', gaps: ['Power BI Embedded specialist not yet confirmed', 'Legacy system specialists: if any legacy tool requires domain expertise, specialist availability must be assessed'], recommendation: 'Confirm Power BI specialist before reporting phase. Assess legacy tool expertise gaps before migration planning begins.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '10%', score: 7.5, strength: 'No external regulatory requirement.', gaps: ['Data residency and PII handling policy must be confirmed if source systems contain sensitive data'], recommendation: 'Data classification assessment in Week 1 to determine if PII handling or data residency configuration is required.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 7.5, strength: 'No partner dependency. Direct delivery.', gaps: ['Legacy tool specialist may be needed depending on 6-tool inventory'], recommendation: 'Assess legacy tool specialist needs after inventory completion.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 5.5, strength: 'Microsoft Fabric core platform is stable and mature.', gaps: ['Some recent Fabric GA features have limited production reference cases', 'Legacy tool export compatibility with Fabric ingestion must be validated per tool'], recommendation: 'Validate legacy tool compatibility in data profiling sprint before pipeline development begins.' },
    ],
    referenceProjects: [
      { name: 'Northwind Traders Data Modernization', industry: 'Distribution', year: 2025, outcome: 'success', relevance: 'High', lesson: 'Legacy tool fragmentation pattern is identical. Data quality issues in 2 of 4 source systems required remediation — early data profiling in Phase 1 prevented a larger scope overrun. This mitigation is directly applicable.' },
      { name: 'Contoso Hotels Data Platform', industry: 'Hospitality', year: 2024, outcome: 'success', relevance: 'Medium', lesson: 'Power BI Embedded executive dashboard scope expanded from 8 to 19 dashboards during delivery, adding 6 weeks and margin pressure. Dashboard count cap in SOW is a lesson applied to this deal.' },
    ],
    agentMatches: [
      { name: 'Aisha Okafor', role: 'Microsoft Fabric Data Platform Lead', credits: [{ project: 'Northwind Traders Data Modernization', csat: 4.5 }, { project: 'Contoso Hotels Data Platform', csat: 4.3 }], industries: ['Distribution', 'Hospitality'], availability: 'Available from contract start', regions: ['Americas', 'EMEA'] },
    ],
    marketSignals: [
      { feed: 'Microsoft Fabric Adoption Monitor', alert: 'Microsoft Fabric achieved fastest-growing enterprise data platform status in Q1 2026, with 180% YoY growth in enterprise adoption. Clients replacing fragmented analytics landscapes are the primary segment. Reference case delivery velocity is a competitive advantage.', severity: 'info', date: 'Apr 2026', dimension: 'Technology Maturity' },
    ],
    alignmentFlags: [
      { label: 'Data Profiling Sprint → Phase 1 Gate', status: 'warning', detail: 'Data quality baseline not established. Northwind precedent: early profiling prevented scope overrun. Mandatory for this engagement.' },
      { label: 'Dashboard Count Cap → Scope Control', status: 'warning', detail: 'Executive dashboard scope not defined. Historical pattern: reporting requirements expand during delivery. Cap in SOW.' },
      { label: 'Microsoft Fabric → Strategic Alignment', status: 'ok', detail: 'Fabric is the highest-priority data platform investment in the Microsoft product portfolio. Strong IP leverage score.' },
      { label: '31% Margin → Buffer Risk', status: 'warning', detail: '31% margin provides limited buffer for data quality remediation if source systems are poor quality. Remediation workstream should be scoped separately.' },
    ],
  },

  'Southridge Video': {
    compositeScore: 5.5,
    executiveBrief: {
      riskTier: 'Elevated Risk',
      headlineRisk: 'D365 F&O replacing PeopleSoft: data migration complexity and custom media rights module are the two highest risk components of this 24-month program.',
      precedentSignal: 'Southridge D365 F&O Transformation (2023): prior Southridge engagement resulted in a partial outcome — data migration ran 8 weeks late due to PeopleSoft data quality issues. The same client, same data source, same migration pattern is in scope for this deal.',
      deliveryConfidence: 'Moderate. Standard D365 F&O module track (GL, AP/AR, Fixed Assets, Supply Chain) is within established playbook. Custom media rights module has no comparable precedent in the delivery library.',
      marketContext: 'D365 F&O is the market-leading ERP for mid-market and enterprise manufacturing and distribution. Media and entertainment ERP displacement is a growing segment with limited precedent in the Microsoft PS portfolio.',
      decisionGuidance: 'Approve (Tier 2). PeopleSoft data quality assessment must be completed before contract execution. Custom media rights module must be scoped to fixed specification before development begins. 24-month program requires dedicated program management office.',
    },
    sections: [
      { id: 'executive-brief', number: '1.', title: 'Executive Risk Brief', sectionType: 'brief', content: [{ t: 'p', text: 'Elevated Risk. The prior Southridge D365 engagement is the most important precedent — data migration overran by 8 weeks due to PeopleSoft data quality issues. The same client, same source system, and same migration pattern are in scope. This is a known and manageable risk if the PeopleSoft data quality assessment is completed before contract execution. The custom media rights module is a second, distinct risk — no comparable in the delivery library.' }] },
      { id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment', sectionType: 'standard', dimensionKey: 'delivery_complexity', content: [{ t: 'bullets', items: ['D365 F&O Finance track (GL, AP/AR, Fixed Assets): established playbook — primary risk is PeopleSoft data migration quality', 'Supply Chain module: standard configuration, but media/content supply chain has specialized requirements (rights windows, territory licensing)', 'Project Operations: scope and effort management for production projects — moderate complexity', 'Custom media rights module: the highest-risk component — no standard D365 F&O module for media rights management exists, requiring custom development', '24-month program: requires dedicated program management office and formal stage-gate governance'] }] },
      { id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment', sectionType: 'standard', dimensionKey: 'client_readiness', content: [{ t: 'bullets', items: ['Prior D365 engagement gives Southridge more D365 project experience than a typical client — a positive signal for this larger program', 'PeopleSoft data quality: prior engagement revealed data quality issues — client must commission a data quality remediation plan before this program begins', 'Media rights subject matter experts: the custom media rights module requires business SMEs who can specify rights management workflows in detail', 'Executive program sponsor: for a 24-month program, C-suite sponsorship with decision authority must be named at contract execution'] }] },
      { id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment', sectionType: 'standard', dimensionKey: 'commercial_structure', content: [{ t: 'bullets', items: ['$1.766M is the largest services deal in the current Tier 2 portfolio', '32% margin: adequate for standard D365 track. Custom media rights module development carries higher risk of overrun — may require a separate T&M component', 'Data migration overrun risk: 8 weeks of overrun cost in the prior engagement — financial mechanism for overrun must be defined', '24-month billing: milestone-based billing with clear acceptance criteria per phase is essential for cash flow and scope control'] }] },
      { id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment', sectionType: 'standard', dimensionKey: 'execution_resourcing', content: [{ t: 'bullets', items: ['Elena Vasquez: D365 F&O delivery lead, experience on comparable ERP programs', 'Custom media rights module: requires a D365 developer with ISV extension experience — this is a specialized skill not routinely available in the PS bench', 'Program Manager: 24-month program requires a dedicated PM, not a delivery-PM hybrid role', 'Data migration lead: given prior PeopleSoft data quality history, a senior data migration architect is required for this track'] }] },
      { id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment', sectionType: 'standard', dimensionKey: 'regulatory_compliance', content: [{ t: 'bullets', items: ['No HIPAA, GDPR, or SOX requirements identified', 'Media rights licensing: content rights management has legal and contractual obligations — the media rights module must be designed with legal review', 'Financial controls: GL and AP/AR implementation must meet client\'s internal audit and financial controls requirements'] }] },
      { id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment', sectionType: 'standard', dimensionKey: 'partner_ecosystem', content: [{ t: 'bullets', items: ['No partner dependency — direct Microsoft PS delivery', 'Custom media rights module: may benefit from a D365 ISV partner with media industry experience if internal D365 developer capability is insufficient'] }] },
      { id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment', sectionType: 'standard', dimensionKey: 'technology_maturity', content: [{ t: 'bullets', items: ['D365 F&O standard modules: fully mature GA platform', 'D365 F&O custom extension for media rights: requires X++ development against well-documented extension framework, but media rights domain logic is specialized', 'PeopleSoft data migration: established DIXF-based migration tooling, but data quality in source is the variable', 'Project Operations: GA module, appropriate for production project management'] }] },
      { id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence', sectionType: 'precedent', content: [{ t: 'p', text: 'Southridge D365 F&O Transformation (2023): partial outcome. Data migration ran 8 weeks late due to PeopleSoft data quality issues. Standard D365 modules delivered on time and on budget. Custom development was out of scope in the prior engagement. This program adds the custom media rights module — a new risk vector with no precedent. PeopleSoft data quality is a known risk and must be assessed before contract execution.' }] },
      { id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence', sectionType: 'agents', content: [{ t: 'p', text: 'Elena Vasquez is identified as D365 F&O delivery lead. Dedicated Program Manager and custom D365 developer with ISV extension experience must be confirmed before contract execution.' }] },
      { id: 'market-signals', number: '11.', title: 'Market Signal Alerts', sectionType: 'signals', content: [{ t: 'p', text: 'One market signal: PeopleSoft ERP mainstream support ends 2027. Client urgency to migrate is real and appropriate. Urgency should not compress the PeopleSoft data quality assessment — this is the lesson of the prior engagement.' }] },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 5.0, strength: 'Standard D365 F&O Finance, Supply Chain, and Project Operations are within the established delivery playbook.', gaps: ['Custom media rights module: no comparable in delivery library — custom D365 X++ development with media domain complexity', 'PeopleSoft data migration: prior engagement data quality issues are a documented risk that is unresolved', '24-month program scope requires formal program office structure'], recommendation: 'Custom media rights module must be scoped to fixed specification before development begins. Engage D365 ISV specialist for custom development track.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 5.5, strength: 'Prior D365 engagement gives Southridge above-average D365 project experience.', gaps: ['PeopleSoft data quality not remediated since prior engagement', 'Media rights SMEs not yet identified for custom module specification', 'Executive program sponsor not named for 24-month commitment'], recommendation: 'PeopleSoft data quality assessment and remediation plan before contract execution. Named executive sponsor with decision authority required.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 6.0, strength: '$1.766M is appropriately sized for 24-month D365 F&O program scope.', gaps: ['32% margin may be insufficient if custom media rights module overruns', 'Data migration overrun mechanism not defined'], recommendation: 'Custom media rights module on T&M with clear scope specification. Define data migration overrun mechanism at contract execution.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 5.5, strength: 'Elena Vasquez available as D365 delivery lead with comparable ERP experience.', gaps: ['Custom D365 developer with ISV/media experience not identified', 'Dedicated Program Manager not yet named for 24-month program', 'Data migration lead: senior architect required given prior PeopleSoft quality history'], recommendation: 'Confirm custom D365 developer and dedicated PM before contract execution. Senior data migration architect is mandatory — not optional.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '10%', score: 7.0, strength: 'No external regulatory requirement. Clean compliance profile.', gaps: ['Media rights module legal review required for rights licensing logic'], recommendation: 'Legal review of media rights module design before development begins.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 7.5, strength: 'No partner dependency. Direct delivery.', gaps: ['D365 ISV partner may be needed for custom media rights module if internal D365 developer capability is insufficient'], recommendation: 'Assess custom D365 development capability before committing to internal delivery. Engage D365 ISV partner if gap is identified.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 5.5, strength: 'D365 F&O standard modules are fully mature GA platforms.', gaps: ['Custom media rights X++ extension: no reference implementation in delivery library', 'PeopleSoft DIXF migration: technology is mature but data quality variance in source is the risk variable'], recommendation: 'Custom media rights module POC sprint before full development commitment.' },
    ],
    referenceProjects: [
      { name: 'Southridge D365 F&O Transformation', industry: 'Distribution', year: 2023, outcome: 'partial', relevance: 'High', lesson: 'SAP — correction: PeopleSoft data migration ran 8 weeks late due to data quality issues. Standard D365 modules delivered on time. Custom development was not in scope. PeopleSoft data quality is a known client-specific risk — data quality assessment before contract execution is mandatory for this program.' },
      { name: 'Consolidated Messenger D365 F&O Global', industry: 'Logistics', year: 2026, outcome: 'partial', relevance: 'Medium', lesson: 'Large D365 F&O program with custom module requirements. Governance structure and stage-gate approach provide program management precedent for the 24-month Southridge program.' },
    ],
    agentMatches: [
      { name: 'Elena Vasquez', role: 'D365 F&O Delivery Lead', credits: [{ project: 'Southridge D365 F&O Transformation', csat: 4.2 }, { project: 'Trey Research D365 Sales & CS', csat: 4.0 }], industries: ['Distribution', 'Professional Services'], availability: 'Available from contract start', regions: ['Americas', 'EMEA'] },
    ],
    marketSignals: [
      { feed: 'PeopleSoft ERP Sunset Monitor', alert: 'Oracle PeopleSoft mainstream support ends in 2027. Southridge client urgency to migrate is appropriate and real. Do not allow urgency to compress the PeopleSoft data quality assessment — the prior 2023 engagement data quality overrun is directly attributable to this pattern.', severity: 'warning', date: 'May 2026', dimension: 'Delivery Complexity' },
    ],
    alignmentFlags: [
      { label: 'PeopleSoft Data Quality → Prior Overrun Risk', status: 'warning', detail: 'Prior Southridge engagement: 8-week data migration overrun due to PeopleSoft data quality. Same source system. Data quality assessment before contract execution is mandatory.' },
      { label: 'Custom Media Rights Module → No Precedent', status: 'warning', detail: 'No comparable custom media rights D365 module in delivery library. Fixed specification before development and D365 ISV specialist required.' },
      { label: 'Dedicated PM → 24-Month Program', status: 'warning', detail: '24-month program requires a dedicated Program Manager — not a delivery-PM hybrid role.' },
      { label: 'D365 F&O Standard Modules → Playbook Ready', status: 'ok', detail: 'GL, AP/AR, Fixed Assets, Supply Chain, Project Operations are all within established delivery playbook.' },
    ],
  },

  'Adatum Corporation': {
    compositeScore: 6.5,
    executiveBrief: {
      riskTier: 'Elevated Risk',
      headlineRisk: 'Azure Landing Zone with ExpressRoute: networking complexity and FinOps optimization require structured governance from day one.',
      precedentSignal: 'Adatum Cloud Foundation is in active delivery — AMBER health status with ExpressRoute provisioning delay. This risk profile reflects the pre-approval assessment for the landing zone deal that preceded the current delivery.',
      deliveryConfidence: 'Moderate. Hub-spoke architecture and Policy-as-Code governance are within the established cloud practice playbook. ExpressRoute dependency on client\'s network provider is the primary schedule risk.',
      marketContext: 'Azure Landing Zone is the most common enterprise cloud foundation engagement. Well-defined methodology with high IP leverage. ExpressRoute delays are the most frequent cause of schedule variance in this engagement type.',
      decisionGuidance: 'Approve with conditions (Tier 3). ExpressRoute provisioning timeline must be confirmed with client\'s network provider before project start date is committed. FinOps optimization scope must be bounded to prevent scope creep.',
    },
    sections: [
      { id: 'executive-brief', number: '1.', title: 'Executive Risk Brief', sectionType: 'brief', content: [{ t: 'p', text: 'Elevated Risk. Azure Landing Zone is a well-understood engagement type with strong playbook support. The primary risk is external dependency: ExpressRoute provisioning requires client\'s network provider to act on a timeline that Microsoft PS cannot control. The current active delivery (Adatum Cloud Foundation) is in AMBER health for exactly this reason. FinOps optimization scope must be bounded to prevent requirements expansion. Approve with ExpressRoute timeline validation and FinOps scope definition as conditions.' }] },
      { id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment', sectionType: 'standard', dimensionKey: 'delivery_complexity', content: [{ t: 'bullets', items: ['Hub-spoke network architecture: standard pattern with well-documented implementation methodology', 'Policy-as-Code (Azure Policy + Bicep/Terraform): complexity scales with policy count and organizational hierarchy depth — policy scope must be defined', 'ExpressRoute + VPN: dual connectivity pattern adds configuration complexity; ExpressRoute provisioning is a dependency on client\'s network provider', 'Defender for Cloud security baseline: straightforward configuration within landing zone scope', 'FinOps framework: budget alert automation and tagging strategy scope can expand significantly if not bounded at contract execution'] }] },
      { id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment', sectionType: 'standard', dimensionKey: 'client_readiness', content: [{ t: 'bullets', items: ['Azure subscription and tenant access: client must have appropriate Azure entitlements and admin access configured before project start', 'Network provider engagement: ExpressRoute requires client to have an active service order with their network provider — this timeline is outside Microsoft PS control', 'FinOps champion: client must identify a FinOps owner who will maintain cost governance after project completion', 'Policy governance hierarchy: organizational unit structure must be finalized before Policy-as-Code implementation begins'] }] },
      { id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment', sectionType: 'standard', dimensionKey: 'commercial_structure', content: [{ t: 'bullets', items: ['$388K is a well-sized landing zone engagement at 29% margin', 'ExpressRoute delay risk: if network provider provisioning delays the engagement, Microsoft PS carries idle resource cost', 'FinOps scope creep: optimization and cost governance requirements tend to expand — a scope boundary on tagging policy count and alert rules is recommended', 'High complexity rating at $388K: cost per outcome is higher than standard landing zone — complexity rating should be validated'] }] },
      { id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment', sectionType: 'standard', dimensionKey: 'execution_resourcing', content: [{ t: 'bullets', items: ['Azure cloud architect with hub-spoke and Policy-as-Code experience required', 'Network engineer with ExpressRoute configuration experience required for connectivity track', 'FinOps practitioner: separate skill set from cloud architecture — confirm practitioner availability before FinOps phase begins', 'Security engineer for Defender for Cloud baseline configuration'] }] },
      { id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment', sectionType: 'standard', dimensionKey: 'regulatory_compliance', content: [{ t: 'bullets', items: ['No external regulatory requirement identified', 'RBAC design: Azure RBAC must align to client\'s identity governance policy — IT security review of RBAC model required before deployment', 'Policy-as-Code: Azure Policy definitions must be reviewed by client\'s governance team before enforcement mode activation'] }] },
      { id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment', sectionType: 'standard', dimensionKey: 'partner_ecosystem', content: [{ t: 'bullets', items: ['No partner dependency — direct Microsoft PS cloud practice delivery', 'Network provider: client\'s ISP/network provider for ExpressRoute circuit is an external dependency not managed by Microsoft PS'] }] },
      { id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment', sectionType: 'standard', dimensionKey: 'technology_maturity', content: [{ t: 'bullets', items: ['Azure Landing Zone accelerator: Microsoft-published reference architecture with maintained Bicep/Terraform modules', 'ExpressRoute: GA service, mature and well-understood — provisioning lead time is the variable, not technology maturity', 'Azure Policy: mature platform for governance enforcement', 'Defender for Cloud: GA platform with documented landing zone integration'] }] },
      { id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence', sectionType: 'precedent', content: [{ t: 'p', text: 'Adatum Cloud Foundation is in active delivery at AMBER health — ExpressRoute provisioning delay is the root cause of AMBER status. This is the most direct precedent: same client, same technology, same risk pattern. ExpressRoute provisioning timeline must be validated before project start date is committed in the contract.' }] },
      { id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence', sectionType: 'agents', content: [{ t: 'p', text: 'Cloud architect and network engineer to be confirmed. FinOps practitioner availability must be validated before FinOps phase begins.' }] },
      { id: 'market-signals', number: '11.', title: 'Market Signal Alerts', sectionType: 'signals', content: [{ t: 'p', text: 'No adverse market signals. Azure Landing Zone is the highest-volume cloud foundation engagement in the Microsoft PS portfolio.' }] },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 6.0, strength: 'Hub-spoke architecture and Azure Landing Zone accelerator provide a well-established foundation.', gaps: ['ExpressRoute provisioning timeline outside Microsoft PS control', 'FinOps scope boundary not defined — requirements expansion risk'], recommendation: 'ExpressRoute provisioning confirmed before project start. FinOps scope defined by tagging policy count and alert rule cap in SOW.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 6.5, strength: 'Client has initiated Azure adoption — existing Azure footprint implies baseline cloud readiness.', gaps: ['ExpressRoute service order status with network provider not confirmed', 'Organizational unit hierarchy not finalized — required for Policy-as-Code scope', 'FinOps owner not identified'], recommendation: 'ExpressRoute service order status from client\'s network provider before project kickoff date is committed.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 6.5, strength: '$388K appropriately sized for landing zone scope. No vendor dilution.', gaps: ['29% margin is below preferred threshold for high-complexity engagements', 'ExpressRoute delay idle cost risk not mitigated in contract'], recommendation: 'Define an ExpressRoute delay mechanism (pause and resume clause) in the contract to protect against idle resource costs.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 6.5, strength: 'Azure cloud architecture capability is well-resourced in the cloud practice.', gaps: ['ExpressRoute network engineer availability not confirmed', 'FinOps practitioner: separate skill set, availability to be confirmed'], recommendation: 'Confirm network engineer and FinOps practitioner before contract execution.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '10%', score: 7.5, strength: 'No external regulatory requirement. Clean compliance profile.', gaps: ['RBAC model requires client IT security review before deployment'], recommendation: 'RBAC design review by client IT security in Week 2 before enforcement mode activation.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 7.5, strength: 'No partner dependency. Direct delivery.', gaps: ['External network provider is an uncontrolled dependency for ExpressRoute provisioning'], recommendation: 'Confirm ExpressRoute provisioning lead time with client and network provider before contract execution.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 6.5, strength: 'All platform components are fully mature GA Azure services.', gaps: ['ExpressRoute provisioning lead times vary by provider and region — 6-14 weeks is the typical range'], recommendation: 'Confirm ExpressRoute provisioning lead time before committing project start date.' },
    ],
    referenceProjects: [
      { name: 'Adatum Cloud Foundation (Active)', industry: 'Technology', year: 2026, outcome: 'partial', relevance: 'High', lesson: 'Active delivery at AMBER health. ExpressRoute provisioning delay is the root cause of AMBER status. Same client, same technology pattern. ExpressRoute timeline validation is mandatory before this contract is executed.' },
      { name: 'Contoso Hotels Cloud Foundation', industry: 'Hospitality', year: 2025, outcome: 'success', relevance: 'Medium', lesson: 'Hub-spoke landing zone with ExpressRoute, delivered on time. ExpressRoute provisioning was confirmed before kickoff — key success factor.' },
    ],
    agentMatches: [
      { name: 'James Okonkwo', role: 'Azure Cloud Architect', credits: [{ project: 'Contoso Hotels Cloud Foundation', csat: 4.4 }, { project: 'Northwind Traders Azure Foundation', csat: 4.3 }], industries: ['Hospitality', 'Distribution'], availability: 'Available from contract start', regions: ['Americas'] },
    ],
    marketSignals: [
      { feed: 'ExpressRoute Provisioning Lead Time Monitor', alert: 'ExpressRoute provisioning lead times increased to 8-14 weeks in Americas region in Q1 2026 due to network provider capacity constraints. This is directly relevant — the active Adatum Cloud Foundation is in AMBER status for this reason. Validate network provider lead time before committing a project start date.', severity: 'warning', date: 'May 2026', dimension: 'Delivery Complexity' },
    ],
    alignmentFlags: [
      { label: 'ExpressRoute Delay → Active AMBER Status', status: 'warning', detail: 'Adatum Cloud Foundation in AMBER due to ExpressRoute delay. Same client, same risk. Network provider timeline validation before project start is mandatory.' },
      { label: 'FinOps Scope → Creep Risk', status: 'warning', detail: 'FinOps optimization requirements commonly expand. Define tagging policy count and alert rule cap in SOW.' },
      { label: 'Azure Landing Zone Accelerator → IP Leverage', status: 'ok', detail: 'Microsoft Landing Zone accelerator with Bicep/Terraform modules applies directly.' },
      { label: '29% Margin → Below Preferred Threshold', status: 'warning', detail: '29% is below the preferred 30%+ threshold for high-complexity engagements. Monitor for scope variance.' },
    ],
  },

  "Margie's Travel": {
    compositeScore: 7.0,
    executiveBrief: {
      riskTier: 'Managed Risk',
      headlineRisk: 'M365 Copilot adoption with custom travel planning library: adoption rate and custom Copilot development scope are the primary risk vectors.',
      precedentSignal: '78% delivery success rate on comparable Copilot adoption engagements. Custom Copilot library development is an emerging pattern — two comparable engagements in the delivery library, both successful.',
      deliveryConfidence: 'Moderate-High. M365 Copilot deployment and governance framework are well within the established playbook. Custom travel planning Copilot library adds development complexity but is bounded in scope.',
      marketContext: 'M365 Copilot enterprise adoption is the fastest-growing segment in the Microsoft 365 practice. Travel and hospitality is an active vertical for Copilot adoption, with consultant productivity gains well-documented.',
      decisionGuidance: 'Approve with conditions (Tier 3). Custom Copilot library specification must be frozen before development begins. 90-day adoption program must include defined success metrics for consultant productivity uplift.',
    },
    sections: [
      { id: 'executive-brief', number: '1.', title: 'Executive Risk Brief', sectionType: 'brief', content: [{ t: 'p', text: 'Managed Risk. M365 Copilot for 3,500 travel consultants is a well-scoped engagement within the established adoption playbook. The custom travel planning Copilot library adds development complexity that is manageable if the specification is frozen before build begins. The 90-day adoption program is the engagement\'s highest-value component — success metrics for consultant productivity must be defined so outcomes can be demonstrated. Approve with custom library specification and adoption success metrics as conditions.' }] },
      { id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment', sectionType: 'standard', dimensionKey: 'delivery_complexity', content: [{ t: 'bullets', items: ['M365 Copilot governance framework: well-documented playbook component — data classification, DLP policy review, and SharePoint content governance are standard activities', 'Prompt engineering workshop: requires travel domain expertise to develop high-value prompts for consultant use cases', 'Custom travel planning Copilot library: the highest-complexity component — custom Copilot declarative agents require Microsoft 365 Copilot Studio development expertise', '90-day adoption program: structured change management with user cohort approach, well within adoption practice capability', '3,500 seat rollout: enterprise-scale deployment with a phased rollout approach is the established pattern'] }] },
      { id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment', sectionType: 'standard', dimensionKey: 'client_readiness', content: [{ t: 'bullets', items: ['M365 Copilot licensing: client must have M365 Copilot licenses active before deployment — license procurement timeline must be confirmed', 'Consultant user community: 3,500 travel consultants are the primary audience — consultant manager engagement is key to adoption program success', 'Data readiness: Copilot surface area requires M365 data to be properly classified — current SharePoint and Teams governance posture must be assessed', 'Change champion network: adoption at 3,500-user scale requires a distributed network of change champions — client must identify 20-30 champions before adoption program begins'] }] },
      { id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment', sectionType: 'standard', dimensionKey: 'commercial_structure', content: [{ t: 'bullets', items: ['$217.5K is a well-priced adoption engagement at 30% margin — appropriately sized for the scope', 'Custom Copilot library: if specification is not frozen, library scope can expand — scope cap on number of Copilot agents/plugins is recommended', 'Adoption program success: if adoption rates do not meet client expectations, pressure for additional change management activities may emerge', 'License cost is client\'s responsibility and is not in scope — confirm client is not expecting license costs to be included in the engagement fee'] }] },
      { id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment', sectionType: 'standard', dimensionKey: 'execution_resourcing', content: [{ t: 'bullets', items: ['M365 adoption specialist with Copilot deployment experience required', 'Copilot Studio developer for custom travel planning library — must have declarative agent development experience', 'Prompt engineer with travel and hospitality domain knowledge preferred', 'Change management lead for 90-day adoption program — enterprise adoption experience at 3,000+ user scale'] }] },
      { id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment', sectionType: 'standard', dimensionKey: 'regulatory_compliance', content: [{ t: 'bullets', items: ['Copilot data access: Copilot surfaces M365 content that the user has permission to access — existing M365 permissions model must be validated', 'Travel industry: no specific regulatory requirement identified for M365 Copilot in travel consulting context', 'Data classification: M365 sensitivity labels must be applied before Copilot activation to prevent inadvertent surfacing of classified content'] }] },
      { id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment', sectionType: 'standard', dimensionKey: 'partner_ecosystem', content: [{ t: 'bullets', items: ['No partner dependency — direct Microsoft PS M365 practice delivery', 'Travel GDS integrations (Sabre, Amadeus): if custom Copilot library requires live GDS data, integration complexity is materially higher — must be scoped explicitly or excluded'] }] },
      { id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment', sectionType: 'standard', dimensionKey: 'technology_maturity', content: [{ t: 'bullets', items: ['M365 Copilot: GA platform with rapidly maturing enterprise deployment playbook', 'Copilot Studio declarative agents: GA but evolving — some enterprise features are recent additions with limited production reference cases', 'M365 governance (DLP, sensitivity labels): mature platform with established deployment patterns', 'Custom agent development: prompt engineering and declarative agent patterns are well-documented but require domain knowledge to execute effectively'] }] },
      { id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence', sectionType: 'precedent', content: [{ t: 'p', text: 'Two comparable Copilot enterprise adoption engagements in the delivery library. Both successful. Neither included a custom Copilot library — the travel planning library is a new component. Prompt engineering workshop approach and 90-day adoption program structure are directly reusable from prior engagements.' }] },
      { id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence', sectionType: 'agents', content: [{ t: 'p', text: 'Sophia Reyes is identified as M365 Copilot adoption lead. Copilot Studio developer for custom library must be confirmed before build phase.' }] },
      { id: 'market-signals', number: '11.', title: 'Market Signal Alerts', sectionType: 'signals', content: [{ t: 'p', text: 'One market signal: M365 Copilot enterprise adoption is accelerating with strong productivity metrics in services industries. Travel consulting is a high-fit vertical for Copilot given the research and summarization use cases.' }] },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 7.5, strength: 'M365 Copilot governance and adoption playbook is well-established. 90-day adoption program structure is reusable.', gaps: ['Custom Copilot travel library specification not frozen — scope can expand', 'Travel GDS integration scope ambiguity if live data feeds are expected'], recommendation: 'Freeze custom Copilot library specification before build begins. Explicitly exclude or scope GDS integrations in the SOW.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 6.5, strength: 'Travel consultants are high-fit Copilot users — productivity use cases are well-documented.', gaps: ['M365 Copilot license status not confirmed', 'Change champion network not yet identified', 'M365 data classification posture unknown'], recommendation: 'License confirmation and data classification assessment in Week 1. Change champion identification before adoption program begins.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 7.0, strength: '$217.5K at 30% margin is well-priced for the scope.', gaps: ['Custom Copilot library scope can expand without a defined cap'], recommendation: 'Define custom library scope as a fixed count of agents/plugins in the SOW.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 7.5, strength: 'Sophia Reyes identified as Copilot adoption lead with enterprise deployment experience.', gaps: ['Copilot Studio developer for custom library not yet confirmed'], recommendation: 'Confirm Copilot Studio developer before contract execution.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '10%', score: 7.5, strength: 'No external regulatory requirement. M365 permissions model governs data access.', gaps: ['M365 sensitivity labels must be applied before Copilot activation'], recommendation: 'Data classification sprint in Week 1 before any Copilot activation.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 8.0, strength: 'No partner dependency. Direct M365 practice delivery.', gaps: ['GDS integration ambiguity must be resolved in SOW'], recommendation: 'Explicitly exclude GDS live data integrations unless separately scoped.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 7.0, strength: 'M365 Copilot is GA with rapidly maturing deployment playbook.', gaps: ['Copilot Studio declarative agents: some enterprise features are recent GA releases'], recommendation: 'Validate target Copilot Studio features against current GA release before committing custom library design.' },
    ],
    referenceProjects: [
      { name: 'Contoso Hotels M365 Copilot Adoption', industry: 'Hospitality', year: 2025, outcome: 'success', relevance: 'High', lesson: 'Enterprise Copilot adoption at 2,800 users. CSAT 4.4. 90-day adoption program structure and change champion network approach are directly reusable. No custom Copilot library was in scope.' },
      { name: 'Northwind Healthcare M365 Copilot', industry: 'Healthcare', year: 2025, outcome: 'success', relevance: 'Medium', lesson: 'Regulated industry Copilot deployment with strict data classification requirements. Data classification sprint approach before activation is directly applicable.' },
    ],
    agentMatches: [
      { name: 'Sophia Reyes', role: 'M365 Copilot Adoption Lead', credits: [{ project: 'Contoso Hotels M365 Copilot Adoption', csat: 4.4 }, { project: 'Northwind Healthcare M365 Copilot', csat: 4.3 }], industries: ['Hospitality', 'Healthcare'], availability: 'Available from contract start', regions: ['Americas'] },
    ],
    marketSignals: [
      { feed: 'M365 Copilot Enterprise Adoption Monitor', alert: 'M365 Copilot enterprise adoption in services industries showing 22% average productivity uplift for research and summarization tasks. Travel consulting is a high-fit vertical. Reference case potential is strong.', severity: 'info', date: 'May 2026', dimension: 'Technology Maturity' },
    ],
    alignmentFlags: [
      { label: 'Custom Library Spec → Scope Gate', status: 'warning', detail: 'Custom travel planning Copilot library specification must be frozen before build begins. Scope cap (agent count) in SOW.' },
      { label: 'M365 License Status → Kickoff Gate', status: 'warning', detail: 'M365 Copilot license activation must be confirmed before deployment begins.' },
      { label: 'Copilot Adoption Playbook → IP Leverage', status: 'ok', detail: 'Established 90-day adoption program and prompt engineering workshop are directly reusable from prior engagements.' },
      { label: '30% Margin → Commercial Health', status: 'ok', detail: '30% margin at appropriate deal size. Clean commercial structure.' },
    ],
  },

  'Lucerne Publishing': {
    compositeScore: 6.5,
    executiveBrief: {
      riskTier: 'Elevated Risk',
      headlineRisk: 'Zero Trust across 5,000 users in 12 countries: multi-country identity and device management complexity with conditional access policy design as the highest-risk component.',
      precedentSignal: '76% delivery success rate on comparable Zero Trust implementations. Multi-country Conditional Access policy design is the most common source of scope variance in this engagement type.',
      deliveryConfidence: 'Moderate. Identity (Entra ID + PIM) and device (Intune + Defender for Endpoint) tracks are well within the established security practice playbook. 12-country Conditional Access complexity requires structured policy design governance.',
      marketContext: 'Zero Trust architecture adoption is accelerating following 2025 identity-based breach incidents. Publishing and media companies are increasingly investing in Zero Trust following intellectual property protection incidents.',
      decisionGuidance: 'Approve with conditions (Tier 3). Conditional Access policy design must go through a structured approval process with client IT and business stakeholders. Country-specific access requirements must be inventoried before policy design begins.',
    },
    sections: [
      { id: 'executive-brief', number: '1.', title: 'Executive Risk Brief', sectionType: 'brief', content: [{ t: 'p', text: 'Elevated Risk. Zero Trust architecture across 5,000 users and 12 countries is a well-scoped engagement within the security practice. The 12-country scope adds Conditional Access policy complexity that requires structured governance — different countries may have different access requirements, device policies, and compliance baselines. Identity and device tracks are straightforward. Approve with country access requirement inventory and Conditional Access governance process as conditions.' }] },
      { id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment', sectionType: 'standard', dimensionKey: 'delivery_complexity', content: [{ t: 'bullets', items: ['Entra ID + PIM: identity track is well-established — Privileged Identity Management configuration for 5,000 users is the primary sizing consideration', 'Intune + Defender for Endpoint: device track for 5,000 devices across 12 countries — device management configuration must account for country-specific device standards', 'Conditional Access (ZTNA): the highest-complexity component — 12 countries may have distinct regulatory, business, and device access requirements that require separate policy sets', 'Network: ZTNA configuration replaces traditional VPN — network transition planning must include a cutover approach that does not disrupt business continuity', '12-country scope: country-specific testing and validation is required before global rollout'] }] },
      { id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment', sectionType: 'standard', dimensionKey: 'client_readiness', content: [{ t: 'bullets', items: ['Country IT contacts: 12 country IT contacts must be identified and engaged for local requirements and rollout coordination', 'Existing device inventory: Intune enrollment requires a current and accurate device inventory across all 12 countries', 'Current VPN infrastructure: ZTNA replaces VPN — client must document current VPN architecture before network transition planning begins', 'Conditional Access policy owners: business and IT stakeholders in each country must approve Conditional Access policy design before deployment'] }] },
      { id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment', sectionType: 'standard', dimensionKey: 'commercial_structure', content: [{ t: 'bullets', items: ['$600K at 29% margin: adequately priced for the scope but limited buffer for country-specific complexity', 'Conditional Access policy scope: if 12 countries require 12 distinct policy sets, design and validation effort is materially higher than a single global policy baseline', 'Country rollout sequencing: if countries require individual rollout windows due to business constraints, delivery timeline can extend beyond the initial estimate', '29% margin is below the preferred threshold for a multi-country security engagement'] }] },
      { id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment', sectionType: 'standard', dimensionKey: 'execution_resourcing', content: [{ t: 'bullets', items: ['Entra ID and PIM specialist with enterprise identity experience required', 'Intune + Defender for Endpoint engineer with multi-country device management experience', 'Conditional Access architect: senior security architect with Zero Trust policy design experience required — this is the most specialized skill set needed', 'ZTNA network architect for VPN-to-ZTNA transition planning'] }] },
      { id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment', sectionType: 'standard', dimensionKey: 'regulatory_compliance', content: [{ t: 'bullets', items: ['12 countries: data residency and identity data handling requirements vary by country — must be assessed before Entra ID tenant configuration', 'GDPR: if any countries are EU member states, employee identity data in Entra ID must comply with GDPR data processing requirements', 'Publishing industry: no sector-specific regulatory requirement identified, but intellectual property access controls are a business driver'] }] },
      { id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment', sectionType: 'standard', dimensionKey: 'partner_ecosystem', content: [{ t: 'bullets', items: ['No partner dependency — direct Microsoft PS security practice delivery', 'Local country IT partners: may be beneficial for on-site device enrollment support in countries where Microsoft PS does not have physical presence'] }] },
      { id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment', sectionType: 'standard', dimensionKey: 'technology_maturity', content: [{ t: 'bullets', items: ['Entra ID: fully mature, GA identity platform', 'PIM: GA, well-documented for enterprise deployment', 'Intune: GA, mature MDM platform with global deployment support', 'Defender for Endpoint: GA platform with established Intune integration', 'Conditional Access: mature feature set, but policy design for 12 countries requires structured governance'] }] },
      { id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence', sectionType: 'precedent', content: [{ t: 'p', text: 'Alpine Insurance Group Zero Trust (2025) is the closest comparable — multi-country Conditional Access design was the primary complexity driver. Policy governance approach (country access requirement inventory before design) prevented scope variance in the Alpine engagement. This approach is directly applicable.' }] },
      { id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence', sectionType: 'agents', content: [{ t: 'p', text: 'Zero Trust architect with multi-country Conditional Access experience to be confirmed. Entra ID and Intune specialists available in the security practice.' }] },
      { id: 'market-signals', number: '11.', title: 'Market Signal Alerts', sectionType: 'signals', content: [{ t: 'p', text: 'One market signal: identity-based attack incidents increased 45% in 2025, driving Zero Trust adoption urgency in all sectors. Publishing industry IP protection incidents are a sector-specific driver.' }] },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 6.5, strength: 'Identity (Entra ID + PIM) and device (Intune + Defender) tracks are within established security practice playbook.', gaps: ['12-country Conditional Access policy design: distinct country requirements may require 12 separate policy sets', 'VPN-to-ZTNA cutover: network transition planning required to avoid business disruption'], recommendation: 'Country access requirement inventory before Conditional Access design begins. Phased rollout with country-by-country validation before global deployment.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 6.0, strength: 'Client has committed to Zero Trust architecture — executive mandate is clear.', gaps: ['12 country IT contacts not yet engaged', 'Device inventory across 12 countries not assessed', 'Current VPN architecture not documented'], recommendation: 'Country IT contact mapping and device inventory assessment in Week 1. VPN architecture documentation before network track begins.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 6.5, strength: '$600K appropriately sized for Zero Trust scope at 5,000 users.', gaps: ['29% margin is below preferred threshold for multi-country engagement', 'Conditional Access policy complexity may vary significantly from single global baseline assumption'], recommendation: 'Define Conditional Access policy count assumption in SOW. Country-specific policy count above assumed baseline is a change order trigger.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 6.5, strength: 'Entra ID and Intune specialists available in security practice.', gaps: ['Conditional Access architect with multi-country Zero Trust experience not yet confirmed', 'ZTNA network architect for VPN transition not yet identified'], recommendation: 'Confirm Zero Trust architect and ZTNA network specialist before contract execution.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '10%', score: 7.0, strength: 'No sector-specific regulatory requirement.', gaps: ['GDPR applies if EU countries are in scope — Entra ID tenant configuration must comply', 'Country-specific data residency requirements for identity data must be assessed'], recommendation: 'Country data residency assessment for identity data in Week 1 before Entra ID configuration.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 7.5, strength: 'No partner dependency. Direct delivery.', gaps: ['On-site device enrollment support in 12 countries may benefit from local partners'], recommendation: 'Assess on-site support requirement per country. Engage local partners for device enrollment if required.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 6.5, strength: 'All platform components are fully mature GA services.', gaps: ['Multi-country Conditional Access governance is a process complexity, not a technology maturity issue'], recommendation: 'Leverage Alpine Insurance Zero Trust Conditional Access governance framework as policy design template.' },
    ],
    referenceProjects: [
      { name: 'Alpine Insurance Group Zero Trust', industry: 'Insurance', year: 2025, outcome: 'success', relevance: 'High', lesson: 'Multi-country Zero Trust with Conditional Access policy design. Country access requirement inventory before design was the key success factor. Policy governance approach is directly reusable.' },
      { name: 'Northwind Healthcare Zero Trust Identity', industry: 'Healthcare', year: 2025, outcome: 'success', relevance: 'Medium', lesson: 'Entra ID + PIM + Intune in a regulated environment. Data residency and compliance requirements drove configuration decisions. Non-EU, but methodology for country-specific configuration is applicable.' },
    ],
    agentMatches: [
      { name: 'Wei Zhang', role: 'Zero Trust Security Architect', credits: [{ project: 'Alpine Insurance Group Zero Trust', csat: 4.4 }, { project: 'Northwind Healthcare Zero Trust Identity', csat: 4.5 }], industries: ['Insurance', 'Healthcare'], availability: 'Available from contract start', regions: ['EMEA', 'Americas'] },
    ],
    marketSignals: [
      { feed: 'Identity Security Threat Monitor', alert: 'Identity-based attacks increased 45% in 2025. Microsoft Entra ID conditional access policies blocked 1.2M identity attacks per day in Q1 2026. Zero Trust architecture demand is at record levels — this is a well-timed strategic engagement.', severity: 'info', date: 'Apr 2026', dimension: 'Technology Maturity' },
    ],
    alignmentFlags: [
      { label: 'Country Access Requirements → Pre-Design Gate', status: 'warning', detail: '12 countries may have distinct access requirements. Country requirement inventory must precede Conditional Access policy design.' },
      { label: 'GDPR → Identity Data Compliance', status: 'warning', detail: 'If EU countries are in scope, Entra ID tenant configuration must comply with GDPR data processing requirements.' },
      { label: '29% Margin → Below Preferred Threshold', status: 'warning', detail: '29% margin is below preferred threshold for a multi-country security engagement. Define change order triggers for policy complexity expansion.' },
      { label: 'Entra ID + Intune Playbook → IP Leverage', status: 'ok', detail: 'Established Zero Trust identity and device deployment patterns are directly applicable.' },
    ],
  },

  'Contoso Sports Network': {
    compositeScore: 5.0,
    executiveBrief: {
      riskTier: 'Elevated Risk',
      headlineRisk: 'D365 Sales & Marketing for a sports rights and media company: specialized vertical requirements, low delivery success rate, and thin margin create a risk profile requiring structured review before approval.',
      precedentSignal: '65% delivery success rate on comparable D365 Sales & Marketing engagements in specialized verticals. Sports rights management is a niche domain — no direct precedent in the delivery library.',
      deliveryConfidence: 'Low-Moderate. Standard D365 Sales and Marketing configuration is within the playbook. Sports rights management, media licensing workflows, and rights window tracking require significant customization beyond standard D365 capability.',
      marketContext: 'D365 Sales is a mature platform for sports and media companies, but rights management workflows are typically handled by specialized ISV solutions. The decision to build on D365 rather than a rights management ISV carries customization risk.',
      decisionGuidance: 'Recommend review (Tier 3). Sports rights management requirements must be fully documented and compared against D365 Sales standard capability before contract execution. Customization scope must be fixed before approval. Consider whether a rights management ISV integration approach is more appropriate than full D365 customization.',
    },
    sections: [
      { id: 'executive-brief', number: '1.', title: 'Executive Risk Brief', sectionType: 'brief', content: [{ t: 'p', text: 'Elevated Risk. This is the highest-risk deal in the Tier 3 recommend-review category. The combination of 65% delivery success rate, specialized vertical requirements with no direct precedent, thin 26% margin, and high solution complexity creates a risk profile that requires structured review before approval. The core question is whether D365 Sales & Marketing can meet sports rights management requirements without excessive customization. A requirements validation exercise before contract execution is the minimum condition for this deal to proceed.' }] },
      { id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment', sectionType: 'standard', dimensionKey: 'delivery_complexity', content: [{ t: 'bullets', items: ['D365 Sales standard configuration: accounts, contacts, opportunities, and pipeline management are straightforward', 'Sports rights management: rights windows, territory licensing, content distribution agreements, and rights expiry tracking are specialized requirements with no standard D365 module', 'D365 Marketing (Customer Insights - Journeys): fan engagement and media partner marketing automation — marketing journey complexity depends on segment count and channel mix', 'Sports media entity model: D365 standard entity model does not include sports-specific objects — a custom entity model is required', 'Integration: sports rights data likely exists in existing rights management systems — integration scope is unclear'] }] },
      { id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment', sectionType: 'standard', dimensionKey: 'client_readiness', content: [{ t: 'bullets', items: ['Sports rights SMEs: rights management workflow documentation requires participation from rights management and legal teams — their availability is the primary client readiness risk', 'Current systems landscape: existing rights management systems, CRM tools, and marketing platforms must be inventoried before D365 architecture is designed', 'Data migration: sports rights contracts and historical deal data in existing systems must be assessed for migration complexity', 'Executive sponsor engagement: C-suite alignment on scope is critical given the high-complexity risk profile'] }] },
      { id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment', sectionType: 'standard', dimensionKey: 'commercial_structure', content: [{ t: 'bullets', items: ['26% margin is the lowest of the current Tier 3 deals — provides minimal buffer for scope variance', '$644K total: appropriately sized for standard D365 Sales & Marketing, but may be undersized if sports rights customization scope is material', 'Customization risk: if sports rights management requires custom entity development and workflow automation, effort can expand 2-3x beyond standard D365 configuration', 'No vendor participation — margin is fully retained but the specialized vertical expertise gap is a delivery risk'] }] },
      { id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment', sectionType: 'standard', dimensionKey: 'execution_resourcing', content: [{ t: 'bullets', items: ['D365 Sales & Marketing functional consultant available in Dynamics practice', 'Sports & media vertical expertise: rare in the Microsoft PS delivery bench — no named specialist with sports rights management domain knowledge identified', 'D365 custom entity developer: required for sports rights entity model — must be confirmed before contract execution', 'System integration lead: sports rights system integration scope is undefined — integration architect must be identified once integration scope is clarified'] }] },
      { id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment', sectionType: 'standard', dimensionKey: 'regulatory_compliance', content: [{ t: 'bullets', items: ['Media rights contracts: D365 customization must accurately reflect legal terms in rights agreements — legal review of custom entity model is required', 'GDPR: if fan data or media partner data includes EU individuals, D365 Marketing data processing must comply with GDPR', 'Sports broadcasting regulations: territory-specific broadcasting rights have regulatory dimensions in some jurisdictions — must be assessed before rights management workflow design'] }] },
      { id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment', sectionType: 'standard', dimensionKey: 'partner_ecosystem', content: [{ t: 'bullets', items: ['No partner dependency currently — but sports rights management ISV integration may be a more appropriate solution than full D365 customization', 'D365 ISV partner with sports & media experience: should be evaluated as an alternative delivery model before committing to full custom development', 'Rights management ISVs (e.g., specialized media rights platforms): integration pattern may be less risky than custom D365 entity model'] }] },
      { id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment', sectionType: 'standard', dimensionKey: 'technology_maturity', content: [{ t: 'bullets', items: ['D365 Sales: fully mature GA CRM platform', 'D365 Marketing (Customer Insights - Journeys): GA, actively evolving with recent AI-driven features', 'Sports rights management on D365: requires custom entity development — no standard module exists and no reference implementation in delivery library', 'Rights management ISV alternatives: mature specialized solutions exist (e.g., industry-specific platforms) that may handle sports rights complexity better than custom D365 development'] }] },
      { id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence', sectionType: 'precedent', content: [{ t: 'p', text: 'No direct sports rights management D365 implementation in the delivery library. Trey Research D365 Sales & CS (2025) provides the closest standard D365 Sales precedent — standard configuration, successful delivery, CSAT 4.0. The sports rights management customization requirement is a new risk vector with no comparable. This is the basis for the recommend-review classification.' }] },
      { id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence', sectionType: 'agents', content: [{ t: 'p', text: 'D365 Sales & Marketing functional consultant available. Sports & media vertical specialist not identified — this is the primary resourcing gap. D365 custom entity developer must be confirmed.' }] },
      { id: 'market-signals', number: '11.', title: 'Market Signal Alerts', sectionType: 'signals', content: [{ t: 'p', text: 'One market signal: sports and media industry CRM consolidation is accelerating, but industry-specific CRM platforms with native rights management (e.g., Salesforce Media Cloud, specialized rights management ISVs) are competitive alternatives. The D365-first approach requires strong customization rationale.' }] },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 5.0, strength: 'D365 Sales standard configuration is within the established playbook.', gaps: ['Sports rights management customization: no standard D365 module — custom entity model required with no delivery library precedent', 'Integration with existing rights systems: scope is undefined', 'Sports-specific data model complexity'], recommendation: 'Requirements validation exercise for sports rights management before contract execution. Compare D365 customization vs. rights management ISV integration approach.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 4.5, strength: 'Executive mandate for CRM consolidation is clear.', gaps: ['Sports rights SME availability for requirements documentation unknown', 'Existing systems landscape not inventoried', 'Rights contract data migration complexity not assessed'], recommendation: 'Rights management SME availability and existing systems inventory before requirements validation exercise.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 5.0, strength: '$644K total — adequate for standard D365 Sales & Marketing scope.', gaps: ['26% margin is the lowest in the Tier 3 portfolio — minimal buffer for customization scope variance', 'Budget may be insufficient if sports rights customization is material'], recommendation: 'Reassess deal budget after requirements validation. If customization scope exceeds standard configuration significantly, repricing is required before approval.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 5.0, strength: 'D365 Sales & Marketing functional consultant available.', gaps: ['Sports & media vertical specialist not identified', 'D365 custom entity developer not confirmed', 'No sports rights domain expert in delivery bench'], recommendation: 'Identify sports & media vertical specialist or D365 ISV partner with domain expertise before contract execution.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '10%', score: 6.5, strength: 'Standard D365 compliance posture is well-understood.', gaps: ['Rights management legal review required for custom entity model', 'GDPR assessment for fan and media partner data'], recommendation: 'Legal review of custom entity model design before development. GDPR assessment for Marketing data processing.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 7.5, strength: 'No partner dependency — direct delivery model.', gaps: ['D365 ISV with sports & media experience not yet evaluated as alternative to full customization'], recommendation: 'Evaluate rights management ISV integration approach as an alternative before committing to full custom D365 development.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 5.0, strength: 'D365 Sales and Marketing platforms are fully mature.', gaps: ['Sports rights management on D365: no reference implementation — technology approach is unproven in this vertical', 'Custom entity model for rights management adds development risk'], recommendation: 'Proof of concept for custom rights management entity model before full development commitment.' },
    ],
    referenceProjects: [
      { name: 'Trey Research D365 Sales & CS', industry: 'Professional Services', year: 2025, outcome: 'success', relevance: 'Medium', lesson: 'Standard D365 Sales and Customer Service delivery, CSAT 4.0. No custom entity development. Provides methodology baseline for standard D365 track only — sports rights customization is an additional risk vector.' },
      { name: 'Contoso Hotels D365 Sales', industry: 'Hospitality', year: 2024, outcome: 'success', relevance: 'Medium', lesson: 'D365 Sales in a specialized vertical. Hotel-specific entity model required minor customization. Sports rights management is materially more complex than hotel group sales configuration.' },
    ],
    agentMatches: [
      { name: 'Carlos Mendoza', role: 'D365 Sales & Marketing Lead', credits: [{ project: 'Trey Research D365 Sales & CS', csat: 4.0 }, { project: 'Contoso Hotels D365 Sales', csat: 4.2 }], industries: ['Professional Services', 'Hospitality'], availability: 'Available from contract start — pending scope validation', regions: ['Americas'] },
    ],
    marketSignals: [
      { feed: 'Sports & Media CRM Market Monitor', alert: 'Sports rights management CRM consolidation is accelerating with a mix of D365 customization and ISV-integrated approaches. Industry-specific platforms with native rights management (Media Cloud, specialized rights ISVs) are gaining share. The decision to build on D365 vs. integrate with a rights ISV must be made before contract execution.', severity: 'warning', date: 'Apr 2026', dimension: 'Technology Maturity' },
    ],
    alignmentFlags: [
      { label: 'Rights Management Requirements → Pre-Contract Validation', status: 'warning', detail: 'Sports rights management requirements must be documented and validated against D365 capability before contract execution. No delivery library precedent exists.' },
      { label: '26% Margin → Minimal Buffer', status: 'warning', detail: '26% margin is the lowest in the Tier 3 portfolio. Customization scope variance has no commercial buffer.' },
      { label: 'D365 ISV Alternative → Evaluation Required', status: 'warning', detail: 'Rights management ISV integration approach should be evaluated before committing to full custom D365 development.' },
      { label: 'Sports Vertical Specialist → Resourcing Gap', status: 'warning', detail: 'No sports & media vertical specialist identified in delivery bench. This is the primary resourcing gap for this engagement.' },
    ],
  },

  'Wingtip Toys': {
    compositeScore: 4.5,
    executiveBrief: {
      riskTier: 'High Risk',
      headlineRisk: '35 legacy .NET and Java applications to cloud-native AKS: breadth of application portfolio, lowest delivery success rate in the portfolio (62%), and thin 24% margin create the highest risk profile in the current Tier 3 portfolio.',
      precedentSignal: 'Application modernization programs at 35+ application scale have a 62% delivery success rate in comparable engagements. The most common failure patterns are: scope expansion as application complexity is discovered, legacy codebase quality issues extending refactoring effort, and container migration technical debt.',
      deliveryConfidence: 'Low. Container strategy, CI/CD pipeline, and observability framework are within the cloud practice playbook. The application-level unknowns across 35 applications — legacy code quality, dependency mapping, and containerization feasibility — are the primary risk vectors and cannot be assessed without an application portfolio assessment.',
      marketContext: 'Cloud-native modernization of legacy .NET and Java applications is a high-demand but high-risk segment. AKS is a mature platform. Legacy application quality is the uncontrolled variable that most often determines outcome.',
      decisionGuidance: 'Recommend review (Tier 3). Application portfolio assessment is required before contract execution. A fixed-price contract on 35 applications without portfolio assessment is the highest-risk commercial structure available for this engagement type. Consider phased approach: portfolio assessment as Phase 1 (separate, bounded scope), followed by a right-sized modernization contract based on actual application complexity.',
    },
    sections: [
      { id: 'executive-brief', number: '1.', title: 'Executive Risk Brief', sectionType: 'brief', content: [{ t: 'p', text: 'High Risk. This is the highest-risk deal in the current pending approval portfolio. The combination of 35 unknown legacy applications, 62% comparable delivery success rate, 24% margin, and high solution complexity without an application portfolio assessment creates a risk profile that should not proceed to contract execution in its current form. The recommended path is a two-phase approach: Phase 1 portfolio assessment (bounded, lower risk) followed by a right-sized modernization contract. Approving the full 35-application modernization without a portfolio assessment is not recommended.' }] },
      { id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment', sectionType: 'standard', dimensionKey: 'delivery_complexity', content: [{ t: 'bullets', items: ['35 applications: the largest application count in a single modernization program in the current delivery library', 'Legacy .NET and Java: codebase age, framework versions, and architecture patterns vary significantly — each application requires individual assessment', 'Containerization feasibility: not all legacy applications can be containerized without significant refactoring — feasibility varies by application', 'AKS architecture: container orchestration platform is mature, but multi-application AKS cluster design requires careful capacity and namespace planning', 'CI/CD pipeline with GitHub Actions + Azure DevOps: pipeline development must be replicated across 35 applications — automation is critical to delivery efficiency', 'Dependency mapping: cross-application dependencies in a 35-application portfolio can create migration sequencing constraints that are impossible to plan without an assessment'] }] },
      { id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment', sectionType: 'standard', dimensionKey: 'client_readiness', content: [{ t: 'bullets', items: ['Application owners: 35 applications likely means multiple application owners across different business units — alignment on modernization priority and sequencing is a governance challenge', 'Legacy codebase access: Microsoft PS must have full access to source code, architecture documentation, and dependency maps for all 35 applications', 'Application documentation: legacy applications frequently lack current architecture documentation — reconstruction effort can be material', 'Business continuity: migrating 35 production applications requires business continuity planning per application — client must have rollback capabilities defined'] }] },
      { id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment', sectionType: 'standard', dimensionKey: 'commercial_structure', content: [{ t: 'bullets', items: ['24% margin: the lowest margin in the current pending approval portfolio — provides no buffer for scope variance', '$964K for 35 applications: approximately $27.5K per application. This is below the typical effort level for legacy application modernization, suggesting the scope assumes simple containerization for all applications', 'Scope expansion risk: if applications require significant refactoring (not containerization), effort per application can be 3-5x higher than containerization alone', 'Fixed-price risk: a fixed-price contract on 35 applications without portfolio assessment is the highest-risk commercial structure available', 'Cost per application analysis strongly suggests the current budget assumes a best-case scenario for all 35 applications'] }] },
      { id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment', sectionType: 'standard', dimensionKey: 'execution_resourcing', content: [{ t: 'bullets', items: ['.NET and Java application developers with modernization experience required — team sizing for 35 applications requires portfolio assessment output', 'AKS/Kubernetes architect for container platform design and cluster governance', 'CI/CD pipeline engineer with GitHub Actions and Azure DevOps expertise', 'Observability engineer for Azure Monitor and Application Insights configuration across 35 applications', 'Program manager: 35 applications requires a dedicated PM with application portfolio governance experience'] }] },
      { id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment', sectionType: 'standard', dimensionKey: 'regulatory_compliance', content: [{ t: 'bullets', items: ['No external regulatory requirement identified', 'Container security: AKS workload security baseline (Azure Policy for Kubernetes, image scanning) must be defined before deployment', 'Application secrets management: legacy applications often use hardcoded secrets — migration to Azure Key Vault must be part of the modernization scope', 'Data compliance: if any of the 35 applications handle PII or sensitive data, containerized deployment must maintain existing data compliance posture'] }] },
      { id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment', sectionType: 'standard', dimensionKey: 'partner_ecosystem', content: [{ t: 'bullets', items: ['No partner dependency — direct Microsoft PS cloud practice delivery', 'At 35 applications, partner augmentation for application refactoring tracks may be required depending on portfolio assessment results'] }] },
      { id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment', sectionType: 'standard', dimensionKey: 'technology_maturity', content: [{ t: 'bullets', items: ['AKS: fully mature, GA Kubernetes platform', 'GitHub Actions + Azure DevOps: mature CI/CD platform combination', 'Azure Monitor + Application Insights: mature observability platform', 'Legacy .NET and Java: the unknown variable — .NET Framework 2.0-4.x applications require refactoring, not just containerization. Java EE applications may have JEE container dependencies that complicate migration'] }] },
      { id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence', sectionType: 'precedent', content: [{ t: 'p', text: 'No direct 35-application AKS modernization in the delivery library. The closest comparable was a 12-application modernization (2024, partial outcome) where legacy codebase quality issues in 4 applications caused scope expansion that consumed the project contingency. At 35 applications, the same issue affects nearly 3x as many applications. Portfolio assessment before contract execution is the primary lesson from this precedent.' }] },
      { id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence', sectionType: 'agents', content: [{ t: 'p', text: 'Cloud practice has AKS and CI/CD expertise. Application modernization team sizing for 35 applications cannot be determined without a portfolio assessment. This is a prerequisite for resourcing planning.' }] },
      { id: 'market-signals', number: '11.', title: 'Market Signal Alerts', sectionType: 'signals', content: [{ t: 'p', text: 'One market signal: legacy .NET and Java application modernization is a high-demand segment, but 62% success rate reflects the reality that legacy application quality is highly variable. Portfolio assessment before contracting is now an industry standard practice in this segment.' }] },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 4.0, strength: 'AKS, GitHub Actions, Azure DevOps, and Azure Monitor are fully mature platforms within the cloud practice playbook.', gaps: ['35 legacy applications: individual application complexity unknown without portfolio assessment', 'Legacy .NET and Java codebase quality is the highest-risk unknown', 'Cross-application dependency mapping required before migration sequencing', 'Containerization feasibility varies per application — not all applications can be containerized without significant refactoring'], recommendation: 'Application portfolio assessment (Phase 1) before full modernization contract. Right-size contract scope and budget based on portfolio assessment output.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 4.5, strength: 'Executive mandate for cloud-native modernization is clear.', gaps: ['Application ownership across 35 applications: multiple business unit owners with potentially conflicting priorities', 'Legacy codebase documentation: architecture documentation for legacy applications frequently does not exist or is outdated', 'Business continuity planning for 35 production applications not yet defined'], recommendation: 'Application owner mapping and codebase documentation assessment in portfolio assessment phase.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 4.5, strength: 'No vendor participation — direct delivery.', gaps: ['24% margin: lowest in the portfolio — no buffer for scope variance', '$27.5K per application assumes best-case containerization for all 35 applications', 'Fixed-price on unknown application complexity is the highest-risk commercial structure for this engagement type'], recommendation: 'Repricing required after portfolio assessment. Consider T&M or capped T&M structure with per-application estimates based on assessment output.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 4.5, strength: 'AKS and CI/CD expertise available in cloud practice.', gaps: ['.NET and Java modernization team size cannot be determined without portfolio assessment', 'Program manager for 35-application portfolio governance not yet named', 'Observability engineer for 35-application monitoring configuration: significant effort per application'], recommendation: 'Defer resourcing plan until portfolio assessment is complete. Team size and composition must be right-sized to actual application complexity.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '10%', score: 6.5, strength: 'No external regulatory requirement. AKS security baseline is well-documented.', gaps: ['Application-level secrets management: legacy applications may have hardcoded secrets requiring remediation', 'PII data handling must be assessed per application'], recommendation: 'Include secrets management and PII assessment in portfolio assessment scope.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 7.5, strength: 'No partner dependency. Direct delivery.', gaps: ['Partner augmentation for application refactoring tracks may be required at 35-application scale'], recommendation: 'Assess partner augmentation need after portfolio assessment output.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 4.0, strength: 'AKS, GitHub Actions, Azure DevOps, and Azure Monitor are all fully mature GA platforms.', gaps: ['Legacy .NET Framework 2.0-4.x: containerization requires .NET 6+ migration in many cases — refactoring effort is material', 'Java EE applications: JEE container dependencies may complicate AKS migration'], recommendation: 'Technology feasibility assessment per application (containerize vs. refactor vs. re-platform) must be output of portfolio assessment.' },
    ],
    referenceProjects: [
      { name: 'Contoso Application Modernization (12 apps)', industry: 'Distribution', year: 2024, outcome: 'partial', relevance: 'High', lesson: 'Partial outcome: 12-application modernization. Legacy codebase quality issues in 4 applications caused scope expansion that consumed the project contingency. 8 applications were containerized on schedule. At 35 applications, the same quality issue rate affects nearly 12 applications. Portfolio assessment before contracting is the direct lesson from this case.' },
      { name: 'Alpine Insurance Cloud Native Migration', industry: 'Insurance', year: 2024, outcome: 'success', relevance: 'Medium', lesson: '8-application AKS migration — portfolio assessment before contracting identified 3 applications requiring refactoring vs. containerization, allowing for right-sized contracting. Success directly attributed to pre-contract portfolio assessment.' },
    ],
    agentMatches: [
      { name: 'Lin Feng', role: 'Cloud Native Modernization Lead', credits: [{ project: 'Alpine Insurance Cloud Native Migration', csat: 4.5 }, { project: 'Contoso Application Modernization', csat: 3.8 }], industries: ['Insurance', 'Distribution'], availability: 'Available for portfolio assessment phase — full engagement availability TBD pending assessment output', regions: ['Americas', 'APAC'] },
    ],
    marketSignals: [
      { feed: 'Legacy Application Modernization Monitor', alert: 'Application modernization programs with 30+ applications have a 58% on-time delivery rate in 2025. Portfolio assessment before contracting reduces scope variance by 40% (Microsoft PS delivery data). The two-phase approach (assessment then modernization) is the industry-standard risk mitigation for this engagement type.', severity: 'critical', date: 'May 2026', dimension: 'Delivery Complexity' },
    ],
    alignmentFlags: [
      { label: 'Portfolio Assessment → Contract Gate', status: 'warning', detail: 'Application portfolio assessment is required before modernization contract execution. 35 unknown applications on a fixed-price contract is not recommended.' },
      { label: '24% Margin → No Buffer', status: 'warning', detail: '24% is the lowest margin in the portfolio. Scope variance on 35 applications has no commercial buffer.' },
      { label: '62% Success Rate → High Risk Threshold', status: 'warning', detail: '62% delivery success rate on comparable engagements is the lowest in the current portfolio. Below the 70% threshold for standard Tier 3 approval.' },
      { label: 'Two-Phase Approach → Recommended Path', status: 'warning', detail: 'Phase 1: portfolio assessment (bounded, lower risk). Phase 2: right-sized modernization contract based on actual application complexity.' },
    ],
  },
};
