export interface TeamMapping {
  key: string;
  name: string;
  patternKeys: string[];
}

export const departmentTeamMapping: Record<string, TeamMapping[]> = {
  "Executive & Leadership": [
    { key: "c_suite", name: "C-Suite / Founders", patternKeys: ["ceo", "cfo", "cto", "cio", "cdo", "coo", "cso", "cco", "cro", "cgo", "chief exec", "founder", "co-founder", "cofounder", "president", "chairman", "board member"] },
    { key: "corp_strategy", name: "Corporate Strategy & Development", patternKeys: ["corporate strategy", "strategic planning", "corporate development", "m&a", "merger", "acquisition", "business strategy", "growth strategy"] }
  ],
  "Go-to-Market (GTM)": [
    { key: "sales_dev", name: "Sales / Business Development", patternKeys: ["sales", "sdr", "bdr", "account executive", "ae", "inside sales", "field sales", "sales manager", "sales rep", "business development", "outbound sale", "inbound sale"] },
    { key: "account_management", name: "Account Management & Expansion", patternKeys: ["account management", "account manager", "retention", "renewal", "upsell", "cross-sell", "client partner", "customer base"] },
    { key: "channel_partnerships", name: "Channel & Partnerships", patternKeys: ["channel sales", "partner manager", "alliances", "reseller", "distributor", "oem", "partnership", "partner development", "channel account manager"] },
    { key: "pre_sales", name: "Pre-Sales & Sales Engineering", patternKeys: ["pre-sales", "presales", "sales engineer", "solution consultant", "demo engineer", "technical sales", "solutions engineer"] },
    { key: "sales_ops", name: "Sales Operations & Revenue Operations (RevOps)", patternKeys: ["sales operations", "sales ops", "revenue operations", "revops", "crm admin", "salesforce admin", "pipeline management", "sales planning", "lead gen"] },
    { key: "sales_enablement", name: "Sales Enablement", patternKeys: ["sales enablement", "enablement", "sales training", "sales readiness"] },
    { key: "marketing_leadership", name: "Marketing Leadership (CMO/VP)", patternKeys: ["chief marketing officer", "cmo", "vp marketing", "vice president marketing", "marketing director", "head of marketing"] },
    { key: "product_marketing", name: "Product Marketing", patternKeys: ["product marketing", "pdm", "market launch", "go-to-market strategy", "competitive intelligence", "messaging", "positioning", "analyst relations"] },
    { key: "digital_marketing", name: "Digital Marketing", patternKeys: ["digital marketing", "seo", "sem", "paid media", "email mark", "sms", "performance marketing", "customer acquisition", "growth marketing"] },
    { key: "content_comms", name: "Content & Communications", patternKeys: ["content", "content marketing", "editorial", "editor", "blogger", "copywriter", "communications", "comms", "pr", "public relations", "media relations", "social media"] },
    { key: "campaigns_abm", name: "Campaigns & ABM", patternKeys: ["campaign", "abm", "account based marketing", "promotions", "demand generation", "field marketing"] },
    { key: "field_events", name: "Field Marketing & Events", patternKeys: ["field marketing", "event marketing", "trade show", "conference", "user group", "webinar marketing", "roadshow"] },
    { key: "creative_services", name: "Creative Services", patternKeys: ["creative", "graphic design", "designer", "videographer", "art director", "brand design"] },
    { key: "customer_success", name: "Customer Success Management", patternKeys: ["customer success", "client success", "onboarding", "adoption specialist", "csm", "implementation", "service delivery"] },
    { key: "customer_support", name: "Customer Support & Service Desk", patternKeys: ["customer support", "customer service", "technical support", "tech support", "helpdesk", "service desk", "support engineer", "troubleshoot", "technician"] },
    { key: "cx", name: "Customer Experience (CX)", patternKeys: ["customer experience", "cx", "client experience", "journey mapping"] },
    { key: "field_service", name: "Field Service & Technical Support", patternKeys: ["field service", "field engineer", "on-site support", "technical account manager", "tam", "service technician", "break-fix"] }
  ],
  "Technology": [
    { key: "software_engineering", name: "Software Engineering", patternKeys: ["software engineer", "swe", "developer", "programmer", "coder", "backend", "frontend", "full-stack", "app dev", "sdet", "is dev"] },
    { key: "devops_sre", name: "DevOps / Site Reliability Engineering (SRE)", patternKeys: ["devops", "sre", "site reliability", "build engineer", "release manager", "ci/cd", "infrastructure as code", "iac", "platform engineer"] },
    { key: "qa", name: "Quality Assurance (QA)", patternKeys: ["qa", "quality assurance", "tester", "validation", "bugs", "defects", "automation testing", "manual testing"] },
    { key: "solutions_architecture", name: "Solutions Architecture", patternKeys: ["solutions architect", "solution architect", "enterprise architect", "cloud architect", "technical architect", "solution design"] },
    { key: "it_sysadmin", name: "IT & Systems Administration", patternKeys: ["it", "information technology", "sysadmin", "system administrator", "it support", "it operations", "desktop support", "it manager"] },
    { key: "infra_netops", name: "Infrastructure & Network Operations", patternKeys: ["infrastructure", "network", "networking", "cloud infrastructure", "data center", "noc", "netops", "network engineer", "network admin"] },
    { key: "enterprise_apps", name: "Enterprise Applications / Business Systems", patternKeys: ["business systems", "enterprise applications", "erp", "crm", "sap", "netsuite", "workday", "salesforce developer", "systems analyst", "business analyst"] },
    { key: "itsm", name: "IT Service Management (ITSM)", patternKeys: ["itsm", "itil", "service delivery", "change management", "incident management", "problem management", "service catalog", "servicenow"] }
  ],
  "Product": [
    { key: "product_management", name: "Product Management", patternKeys: ["product manager", "product owner", "product management", "product strategy", "product lead", "pm", "head of product", "cpo", "chief product officer"] },
    { key: "ux_ui", name: "UX/UI Design & Research", patternKeys: ["ux", "ui", "user experience", "user interface", "product design", "designer", "visual", "interface", "usability", "wireframe", "mockup", "user research"] }
  ],
  "Data & Analytics": [
    { key: "data_engineering", name: "Data Engineering & Infrastructure", patternKeys: ["data engineer", "data engineering", "etl", "pipeline", "data warehouse", "data lake", "bigdata", "data infrastructure", "snowflake", "databricks"] },
    { key: "data_science", name: "Data Science & AI/Machine Learning", patternKeys: ["data scientist", "data science", "ai", "ml", "machine learning", "aie", "nlp", "statistician", "researcher", "predictive", "modeling", "algorithm"] },
    { key: "bi_analytics", name: "BI & Data Analytics", patternKeys: ["data analyst", "bi", "business intelligence", "analytics", "reporting", "tableau", "powerbi", "data visualization", "insights", "kpi", "metrics"] },
    { key: "data_governance", name: "Data Governance & Stewardship", patternKeys: ["data governance", "stewardship", "data quality", "dqa", "data policy", "data privacy", "data integrity", "info governance"] },
    { key: "mdm", name: "Master Data Management (MDM)", patternKeys: ["mdm", "master data management", "data quality", "data cleansing", "golden record", "reference data"] }
  ],
  "Finance & Administration": [
    { key: "finance_accounting", name: "Finance & Accounting", patternKeys: ["finance", "financial", "accounting", "accountant", "controller", "cfo", "fp&a", "ap", "ar", "accounts payable", "receivable", "payroll"] },
    { key: "treasury", name: "Treasury", patternKeys: ["treasury", "cash management", "liquidity", "capital markets", "foreign exchange", "fx"] },
    { key: "investor_relations", name: "Investor Relations (IR)", patternKeys: ["investor relations", "ir", "earnings call", "shareholder relations", "sec filings"] },
    { key: "internal_audit", name: "Internal Audit", patternKeys: ["internal audit", "auditor", "sox testing", "control assurance", "corporate audit"] },
    { key: "admin_services", name: "Administrative Services", patternKeys: ["administrative", "executive assistant", "ea", "office manager", "reception", "front desk"] }
  ],
  "People & Talent": [
    { key: "hr_people_ops", name: "Human Resources (HR) & People Operations", patternKeys: ["human resources", "hr", "people operations", "peopleops"] },
    { key: "hrbp", name: "HR Business Partner (HRBP)", patternKeys: ["hrbp", "human resources business partner", "people partner"] },
    { key: "employee_relations", name: "Employee Relations", patternKeys: ["employee relations", "er", "workplace investigations", "labor relations"] },
    { key: "talent_acquisition", name: "Talent Acquisition & Recruiting", patternKeys: ["talent acquisition", "recruiter", "recruiting", "sourcing", "headhunter"] },
    { key: "learning_dev", name: "Learning & Development (L&D)", patternKeys: ["l&d", "learning and development", "training", "corporate trainer", "instructional design", "employee development"] },
    { key: "comp_ben", name: "Compensation & Benefits", patternKeys: ["compensation", "benefits", "comp & ben", "rewards"] },
    { key: "hris_analytics", name: "HRIS / People Analytics", patternKeys: ["hris", "human resources information system", "people analytics", "hr data", "workday analyst", "hr systems"] }
  ],
  "Legal, Risk & Compliance": [
    { key: "legal_counsel", name: "Legal & Counsel", patternKeys: ["legal", "counsel", "attorney", "lawyer", "general counsel"] },
    { key: "contracts", name: "Contracts Management", patternKeys: ["contracts manager", "contract administrator", "legal operations", "clm", "contract lifecycle"] },
    { key: "ip_law", name: "Intellectual Property (IP) Law", patternKeys: ["ip counsel", "patent attorney", "trademark counsel", "intellectual property law"] },
    { key: "grc", name: "Governance, Risk & Compliance (GRC)", patternKeys: ["grc", "governance", "risk", "compliance", "regulatory", "audit", "sox", "vendor risk", "third party risk"] }
  ],
  "Security": [
    { key: "security_leadership", name: "Security Leadership (CISO)", patternKeys: ["ciso", "chief information security officer", "cso", "head of security", "vp security", "security director"] },
    { key: "cybersecurity_infosec", name: "Cybersecurity & InfoSec", patternKeys: ["cybersecurity", "cyber", "infosec", "information security", "data protection", "iam", "cissp", "nist"] },
    { key: "secops", name: "Security Operations (SecOps / SOC)", patternKeys: ["secops", "soc", "security operations", "threat detection", "incident response", "siem", "soc analyst"] }
  ],
  "Operations, Supply Chain & Manufacturing": [
    { key: "bizops", name: "Business Operations", patternKeys: ["business operations", "bizops", "operations manager", "process improvement", "efficiency"] },
    { key: "pmo_transformation", name: "Project Management Office (PMO) & Digital Transformation", patternKeys: ["pmo", "project manager", "program manager", "digital transformation"] },
    { key: "supply_chain", name: "Supply Chain & Logistics", patternKeys: ["supply chain", "logistics", "procurement", "purchasing", "sourcing", "vendor management", "fulfillment"] },
    { key: "manufacturing", name: "Manufacturing & Production", patternKeys: ["manufacturing", "production", "plant manager", "assembly line", "fabrication", "shop floor", "operations supervisor"] },
    { key: "qc", name: "Quality Control (QC)", patternKeys: ["quality control", "qc", "inspection", "inspector", "six sigma", "lean manufacturing", "iso 9001", "quality engineer"] },
    { key: "facilities", name: "Facilities & Maintenance", patternKeys: ["facilities", "maintenance manager", "plant engineering", "ehs", "environmental health safety", "workplace services"] }
  ],
  "Research & Development (R&D)": [
    { key: "scientific_research", name: "Scientific Research", patternKeys: ["scientist", "researcher", "lab", "laboratory", "chemist", "biologist", "clinical research", "clinical trials", "medical affairs"] },
    { key: "hardware_dev", name: "Hardware & Physical Product Development", patternKeys: ["hardware engineer", "mechanical engineer", "electrical engineer", "product development engineer", "prototyping", "rd engineer"] }
  ],
  "Public Affairs & Non-Profit": [
    { key: "public_affairs", name: "Policy & Public Affairs", patternKeys: ["policy", "public affairs", "government relations", "lobbyist", "legislative affairs", "regulatory affairs"] },
    { key: "nonprofit_program", name: "Program Management (Non-Profit)", patternKeys: ["program manager", "program officer", "grant management", "community outreach", "nonprofit program"] },
    { key: "fundraising", name: "Fundraising & Development", patternKeys: ["fundraising", "development officer", "donor relations", "philanthropy", "advancement"] }
  ],
  "Media & Creative Production": [
    { key: "creative_direction", name: "Creative Direction", patternKeys: ["creative director", "art director", "brand creative", "head of creative"] },
    { key: "production", name: "Production (Video, Audio, Events)", patternKeys: ["producer", "production manager", "broadcast", "studio manager", "post-production", "line producer", "showrunner"] }
  ]
};
