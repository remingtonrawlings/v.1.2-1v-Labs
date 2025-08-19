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
}

export interface DiagnosticAssessment {
    id: string; // Corresponds to focus area id
    name: string;
    category: string;
    maturity: number | null;
    impact: number;
    feasibility: number;
}
