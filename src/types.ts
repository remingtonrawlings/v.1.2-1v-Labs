export interface TeamFunction {
  key: string;
  name: string;
  departmentName: string;
}

export interface DepartmentBucket {
  id: string;
  name: string;
  secondaryLabel: string;
  functions: TeamFunction[];
  color: string;
}

export interface SeniorityBucket {
  id: string;
  name: string;
  secondaryLabel: string;
  levels: string[];
  color: string;
}

export interface PersonaBucket {
  id: string;
  name: string;
  seniorityBucketId: string | null;
  departmentBucketId: string | null;
}

export interface AccountSegment {
    id: string;
    name: string;
    industries: string[];
    employeeCounts: string[];
    revenueBands: string[];
}

export interface ICPSegmentGroup {
    id: string;
    name: string;
    accountSegmentId: string | null;
    personaIds: Set<string>;
    color: string;
    strategicContext?: string;
    painPoints?: string;
    valueProps?: string;
    crmList?: string;
    assets?: string;
}

export interface DiagnosticAssessment {
    id: string; // Corresponds to focus area id
    name: string;
    category: string;
    maturity: number | null;
    impact: number;
    feasibility: number;
}

export interface StrategicWorkflowSurvey {
  inbound: {
    contactsLeads: boolean | null;
    reliancePercentage: number;
    aesAndSdrGetLeads: boolean | null;
    hasHighPriorityLeads: boolean | null;
    aesGetHighPriorityLeads: boolean | null;
    hasSpecialCampaigns: boolean | null;
  };
  events: {
    usesEvents: boolean | null;
    teamsInviteAndFollowUp: boolean | null;
  };
  tactics: {
    usesPhoneCalls: boolean | null;
    coldCallingImportance: number;
    hasAutomatedEmailSequences: boolean | null;
  };
  team: {
    aeCount: number;
    sdrCount: number;
    csmCount: number;
    hasInternationalReps: boolean | null;
    prospectingLanguages: string[];
    otherLanguages: string;
    supportRoleCount: number;
  };
  sequences: {
    followUp: boolean;
    eventInvite: boolean;
    eventFollowUp: boolean;
    reEngage: boolean;
    nurture: boolean;
    expansion: boolean;
    renewal: boolean;
  };
  systems: {
    salesEngagementPlatform: string;
    salesEngagementPlatformOther: string;
    outreachErrorLogs: string;
    conversationIntelligence: string;
    conversationIntelligenceOther: string;
    marketingAutomation: string;
    marketingAutomationOther: string;
    websiteConversionTools: string[];
    websiteConversionToolsOther: string;
    dataSources: string[];
    dataSourcesOther: string;
    aiIntegrations: string[];
    aiIntegrationsOther: string;
    aiUseCases: string;
    automationTools: string[];
    automationToolsOther: string;
  };
}
