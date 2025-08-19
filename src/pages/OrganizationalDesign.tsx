import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, Building2, UserCheck, Briefcase, Group, BarChart3, FileText, Workflow, ListCollapse, GanttChartSquare, Share2 } from 'lucide-react';
import { SeniorityBucketing } from './SeniorityBucketing';
import { DepartmentTeamOrganization } from './DepartmentTeamOrganization';
import { PersonaCreation } from './PersonaCreation';
import { AccountSegmentation } from './AccountSegmentation';
import { ICPSegmentCreation } from './ICPSegmentCreation';
import { ICPPrioritization } from './ICPPrioritization';
import { StrategicWorkflows } from './StrategicWorkflows';
import { SalesProcessBuilder } from './SalesProcessBuilder';
import { DiagnosticAssessment } from './DiagnosticAssessment';
import { HolisticSummary, PriorityState } from './HolisticSummary';
import { SeniorityBucket, DepartmentBucket, PersonaBucket, AccountSegment, ICPSegmentGroup, DiagnosticAssessment as DiagnosticAssessmentType, StrategicWorkflowSurvey, SalesStage } from '../types';

interface OrganizationalDesignProps {
  onBack: () => void;
}

type ExperienceStep = 'choice' | 'seniority' | 'department' | 'persona' | 'account' | 'icp' | 'prioritization' | 'strategicWorkflows' | 'salesProcessBuilder' | 'diagnosticAssessment' | 'holisticSummary';

const HierarchyDiagram = () => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => { const timer = setTimeout(() => setIsVisible(true), 100); return () => clearTimeout(timer); }, []);

    const baseBox = "bg-white border-2 rounded-lg shadow-md flex items-center justify-center p-3 text-center font-semibold";
    const baseLine = "bg-gray-300";
    const animClass = "transition-all duration-500 ease-out";
    const hidden = "opacity-0 -translate-y-3";
    const visible = "opacity-100 translate-y-0";

    return (
        <div className="p-6 bg-slate-50 rounded-xl border-2 border-dashed">
            <div className="grid grid-cols-2 gap-4 items-center justify-around h-72 relative">
                {/* Lines */}
                <div className={`${baseLine} absolute top-1/4 left-1/4 w-px h-1/4 ${animClass} ${isVisible ? 'scale-y-100' : 'scale-y-0'}`} style={{transitionDelay: '400ms', transformOrigin: 'top'}}></div>
                <div className={`${baseLine} absolute top-1/4 right-1/4 w-px h-1/4 ${animClass} ${isVisible ? 'scale-y-100' : 'scale-y-0'}`} style={{transitionDelay: '400ms', transformOrigin: 'top'}}></div>
                <div className={`${baseLine} absolute top-1/2 left-1/4 right-1/4 h-px ${animClass} ${isVisible ? 'scale-x-100' : 'scale-x-0'}`} style={{transitionDelay: '600ms'}}></div>
                <div className={`${baseLine} absolute top-1/2 left-1/2 w-px h-1/4 ${animClass} ${isVisible ? 'scale-y-100' : 'scale-y-0'}`} style={{transitionDelay: '800ms', transformOrigin: 'top'}}></div>

                {/* Boxes */}
                <div className={`${baseBox} border-blue-500 text-blue-800 ${animClass} ${isVisible ? visible : hidden}`} style={{transitionDelay: '100ms'}}><Target className="mr-2"/>Seniority</div>
                <div className={`${baseBox} border-green-500 text-green-800 ${animClass} ${isVisible ? visible : hidden}`} style={{transitionDelay: '200ms'}}><Building2 className="mr-2"/>Function</div>

                <div className={`col-span-2 justify-self-center ${baseBox} border-red-500 text-red-800 w-1/2 ${animClass} ${isVisible ? visible : hidden}`} style={{transitionDelay: '500ms'}}><UserCheck className="mr-2"/>Persona</div>

                <div className={`col-span-2 justify-self-center ${baseBox} border-teal-500 text-teal-800 w-1/2 ${animClass} ${isVisible ? visible : hidden}`} style={{transitionDelay: '900ms'}}><Group className="mr-2"/>ICP Segment Group</div>
            </div>
        </div>
    );
};

export const OrganizationalDesign: React.FC<OrganizationalDesignProps> = ({ onBack }) => {
  const [step, setStep] = useState<ExperienceStep>('choice');
  // ... all other state initializations are the same
  const [seniorityBuckets, setSeniorityBuckets] = useState<SeniorityBucket[]>([]);
  const [departmentBuckets, setDepartmentBuckets] = useState<DepartmentBucket[]>([]);
  const [personaBuckets, setPersonaBuckets] = useState<PersonaBucket[]>([]);
  const [accountSegments, setAccountSegments] = useState<AccountSegment[]>([]);
  const [icpGroups, setIcpGroups] = useState<ICPSegmentGroup[]>([]);
  const [groupToEditId, setGroupToEditId] = useState<string | null>(null);
  const [priorities, setPriorities] = useState<PriorityState>({ high: [], medium: [], low: [] });
  const [strategicWorkflowSurvey, setStrategicWorkflowSurvey] = useState<StrategicWorkflowSurvey | null>(null);
  const [salesStages, setSalesStages] = useState<SalesStage[]>([]);
  const [diagnosticAssessments, setDiagnosticAssessments] = useState<DiagnosticAssessmentType[]>([]);

  const handleBackToChoice = () => setStep('choice');

  const handleRequestEditGroup = (groupId: string) => { setGroupToEditId(groupId); setStep('icp'); };
  
  const handleSeniorityNext = (buckets: SeniorityBucket[]) => { setSeniorityBuckets(buckets); setStep('department'); };
  const handleDepartmentNext = (buckets: DepartmentBucket[]) => { setDepartmentBuckets(buckets); setStep('persona'); };
  const handlePersonaNext = (buckets: PersonaBucket[]) => { setPersonaBuckets(buckets); setStep('account'); };
  const handleAccountNext = (segments: AccountSegment[]) => { setAccountSegments(segments); setStep('icp'); };
  const handleIcpNext = (groups: ICPSegmentGroup[]) => { setIcpGroups(groups); setStep('prioritization'); };
  const handlePrioritizationNext = (finalPriorities: PriorityState) => { setPriorities(finalPriorities); setStep('strategicWorkflows'); };
  const handleStrategicWorkflowsNext = (surveyData: StrategicWorkflowSurvey) => { setStrategicWorkflowSurvey(surveyData); setStep('salesProcessBuilder'); };
  const handleSalesProcessNext = (stages: SalesStage[]) => { setSalesStages(stages); setStep('diagnosticAssessment'); };
  const handleDiagnosticNext = (assessments: DiagnosticAssessmentType[]) => { setDiagnosticAssessments(assessments); setStep('holisticSummary'); };
  const handleSummaryComplete = () => { alert("You have completed the entire GTM design and assessment flow!"); setStep('choice'); };

  if (step === 'seniority') return <SeniorityBucketing onBack={handleBackToChoice} onNext={handleSeniorityNext} initialBuckets={seniorityBuckets} />;
  if (step === 'department') return <DepartmentTeamOrganization onBack={() => setStep('seniority')} onNext={handleDepartmentNext} initialBuckets={departmentBuckets} />;
  if (step === 'persona') return <PersonaCreation onBack={() => setStep('department')} onNext={handlePersonaNext} seniorityBuckets={seniorityBuckets} departmentBuckets={departmentBuckets} initialPersonas={personaBuckets} />;
  if (step === 'account') return <AccountSegmentation onBack={() => setStep('persona')} onNext={handleAccountNext} initialSegments={accountSegments} />;
  if (step === 'icp') return <ICPSegmentCreation onBack={() => step === 'prioritization' ? setStep('prioritization') : setStep('account')} onNext={handleIcpNext} personaBuckets={personaBuckets} accountSegments={accountSegments} seniorityBuckets={seniorityBuckets} departmentBuckets={departmentBuckets} initialGroups={icpGroups} initialEditGroupId={groupToEditId} onEditFlowComplete={() => { setGroupToEditId(null); setStep('prioritization'); }} />;
  if (step === 'prioritization') return <ICPPrioritization onBack={() => setStep('icp')} onNext={handlePrioritizationNext} icpGroups={icpGroups} initialPriorities={priorities} accountSegments={accountSegments} personaBuckets={personaBuckets} onEditRequest={handleRequestEditGroup} />;
  if (step === 'strategicWorkflows') return <StrategicWorkflows onBack={() => setStep('prioritization')} onNext={handleStrategicWorkflowsNext} />;
  if (step === 'salesProcessBuilder') return <SalesProcessBuilder onBack={() => setStep('strategicWorkflows')} onNext={handleSalesProcessNext} initialStages={salesStages} />;
  if (step === 'diagnosticAssessment') return <DiagnosticAssessment onBack={() => setStep('salesProcessBuilder')} onNext={handleDiagnosticNext} />;
  if (step === 'holisticSummary') return <HolisticSummary onBack={() => setStep('diagnosticAssessment')} onComplete={handleSummaryComplete} data={{seniorityBuckets, departmentBuckets, personaBuckets, accountSegments, icpGroups, priorities, survey: strategicWorkflowSurvey, diagnostics: diagnosticAssessments, salesStages }}/>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center"><Share2 className="w-6 h-6 text-white" /></div>
            <div><h1 className="text-2xl font-bold text-gray-900">GTM Strategy Studio</h1><p className="text-gray-600">A step-by-step guide to defining, prioritizing, and assessing your Go-To-Market strategy</p></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Build a Standardized GTM Motion</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">This guided process builds your entire model, from foundational buckets to a final, prioritized action plan.</p>
        </div>
        
        <HierarchyDiagram />

        <div className="mt-12">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">How It All Fits Together</h3>
            <div className="space-y-4 text-gray-700">
                <p><strong>Foundation (Buckets):</strong> Start by creating a standardized vocabulary for your organization. <strong className="text-blue-600">Seniority Buckets</strong> group titles by level (e.g., Executive, Manager), while <strong className="text-green-600">Function Buckets</strong> group them by job role (e.g., Sales, Marketing).</p>
                <p><strong>The "Who" (Personas):</strong> By combining a Seniority and a Function bucket, you define a <strong className="text-red-600">Persona</strong>—a specific, targetable individual within an organization (e.g., a Sales Manager).</p>
                <p><strong>The "Where" (Segments & ICPs):</strong> <strong className="text-yellow-600">Account Segments</strong> define the companies you target based on firmographics (size, industry). You then create an <strong className="text-teal-600">ICP Segment Group</strong> by mapping your Personas to these Account Segments. This becomes the core of your strategy, defining exactly who you're targeting at which companies.</p>
                <p><strong>The Action Plan (Prioritization & Process):</strong> Finally, you <strong className="text-indigo-600">Prioritize</strong> your ICP Groups to focus efforts on the highest-value targets and define a structured <strong className="text-sky-600">Sales Process</strong> for them to follow. This creates a clear, actionable, and standardized GTM motion for your entire team.</p>
            </div>
        </div>

        <div className="mt-12 bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">The Complete Workflow</h3>
            <div className="space-y-2">
                {[
                    { step: 1, icon: Target, title: "Define Seniority Buckets" },
                    { step: 2, icon: Building2, title: "Define Function Buckets" },
                    { step: 3, icon: UserCheck, title: "Create Persona Buckets" },
                    { step: 4, icon: Briefcase, title: "Create Account Segments" },
                    { step: 5, icon: Group, title: "Build ICP Segment Groups" },
                    { step: 6, icon: BarChart3, title: "Prioritize ICP Groups" },
                    { step: 7, icon: ListCollapse, title: "Complete GTM Survey" },
                    { step: 8, icon: GanttChartSquare, title: "Define Sales Process" },
                    { step: 9, icon: Workflow, title: "Run Diagnostic Assessment" },
                    { step: 10, icon: FileText, title: "Review Holistic Summary" },
                ].map(item => (
                    <div key={item.step} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">{item.step}</div>
                        <div className="flex items-center space-x-2"><item.icon className="w-5 h-5 text-gray-500" /><h4 className="font-semibold text-gray-700">{item.title}</h4></div>
                    </div>
                ))}
            </div>
        </div>

        <div className="mt-12 text-center">
          <button onClick={() => setStep('seniority')} className="w-full max-w-md px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold text-xl shadow-lg hover:shadow-xl">Get Started</button>
        </div>
      </div>
    </div>
  );
};
