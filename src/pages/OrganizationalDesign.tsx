import React, { useState } from 'react';
import { ArrowLeft, Target, Building2, UserCheck, Briefcase, Group, BarChart3, FileText, Workflow } from 'lucide-react';
import { SeniorityBucketing } from './SeniorityBucketing';
import { DepartmentTeamOrganization } from './DepartmentTeamOrganization';
import { PersonaCreation } from './PersonaCreation';
import { AccountSegmentation } from './AccountSegmentation';
import { ICPSegmentCreation } from './ICPSegmentCreation';
import { ICPPrioritization } from './ICPPrioritization';
import { GlobalMessagingContext, PriorityState } from './GlobalMessagingContext';
import { StrategicWorkflows } from './StrategicWorkflows';
import { SeniorityBucket, DepartmentBucket, PersonaBucket, AccountSegment, ICPSegmentGroup, DiagnosticAssessment } from '../types';

interface OrganizationalDesignProps {
  onBack: () => void;
}

type ExperienceStep = 'choice' | 'seniority' | 'department' | 'persona' | 'account' | 'icp' | 'prioritization' | 'summary' | 'strategicWorkflows';

export const OrganizationalDesign: React.FC<OrganizationalDesignProps> = ({ onBack }) => {
  const [step, setStep] = useState<ExperienceStep>('choice');
  const [seniorityBuckets, setSeniorityBuckets] = useState<SeniorityBucket[]>([]);
  const [departmentBuckets, setDepartmentBuckets] = useState<DepartmentBucket[]>([]);
  const [personaBuckets, setPersonaBuckets] = useState<PersonaBucket[]>([]);
  const [accountSegments, setAccountSegments] = useState<AccountSegment[]>([]);
  const [icpGroups, setIcpGroups] = useState<ICPSegmentGroup[]>([]);
  const [priorities, setPriorities] = useState<PriorityState>({ high: [], medium: [], low: [] });
  const [diagnosticAssessments, setDiagnosticAssessments] = useState<DiagnosticAssessment[]>([]);

  const handleBackToChoice = () => setStep('choice');

  const handleSeniorityNext = (buckets: SeniorityBucket[]) => { setSeniorityBuckets(buckets); setStep('department'); };
  const handleDepartmentNext = (buckets: DepartmentBucket[]) => { setDepartmentBuckets(buckets); setStep('persona'); };
  const handlePersonaNext = (buckets: PersonaBucket[]) => { setPersonaBuckets(buckets); setStep('account'); };
  const handleAccountNext = (segments: AccountSegment[]) => { setAccountSegments(segments); setStep('icp'); };
  const handleIcpNext = (groups: ICPSegmentGroup[]) => { setIcpGroups(groups); setStep('prioritization'); };
  const handlePrioritizationNext = (finalPriorities: PriorityState) => { setPriorities(finalPriorities); setStep('summary'); };
  const handleSummaryNext = () => setStep('strategicWorkflows');
  const handleStrategicWorkflowsNext = (assessments: DiagnosticAssessment[]) => {
    setDiagnosticAssessments(assessments);
    // This is the final step, for now we can go back to the beginning or show a final message.
    // Let's go back to the choice screen to signify completion.
    setStep('choice');
  };


  if (step === 'seniority') return <SeniorityBucketing onBack={handleBackToChoice} onNext={handleSeniorityNext} initialBuckets={seniorityBuckets} />;
  if (step === 'department') return <DepartmentTeamOrganization onBack={() => setStep('seniority')} onNext={handleDepartmentNext} initialBuckets={departmentBuckets} />;
  if (step === 'persona') return <PersonaCreation onBack={() => setStep('department')} onNext={handlePersonaNext} seniorityBuckets={seniorityBuckets} departmentBuckets={departmentBuckets} initialPersonas={personaBuckets} />;
  if (step === 'account') return <AccountSegmentation onBack={() => setStep('persona')} onNext={handleAccountNext} initialSegments={accountSegments} />;
  if (step === 'icp') return <ICPSegmentCreation onBack={() => setStep('account')} onNext={handleIcpNext} personaBuckets={personaBuckets} accountSegments={accountSegments} seniorityBuckets={seniorityBuckets} departmentBuckets={departmentBuckets} initialGroups={icpGroups} />;
  if (step === 'prioritization') return <ICPPrioritization onBack={() => setStep('icp')} onNext={handlePrioritizationNext} icpGroups={icpGroups} initialPriorities={priorities} />;
  if (step === 'summary') return <GlobalMessagingContext onBack={() => setStep('prioritization')} onNext={handleSummaryNext} data={{seniorityBuckets, departmentBuckets, personaBuckets, accountSegments, icpGroups, priorities}}/>;
  if (step === 'strategicWorkflows') return <StrategicWorkflows onBack={() => setStep('summary')} onNext={handleStrategicWorkflowsNext} />;


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center"><Group className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Organizational Design Studio</h1>
              <p className="text-gray-600">A step-by-step guide to defining and prioritizing your GTM strategy</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Define, Prioritize & Strategize</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">This guided process builds your entire GTM model, from foundational buckets to a final, prioritized action plan.</p>
        </div>

        <div className="space-y-2">
            {[
                { step: 1, icon: Target, title: "Define Seniority Buckets", color: "from-blue-500 to-purple-600", iconColor: "text-blue-600" },
                { step: 2, icon: Building2, title: "Define Function Buckets", color: "from-green-500 to-blue-600", iconColor: "text-green-600" },
                { step: 3, icon: UserCheck, title: "Create Persona Buckets", color: "from-red-500 to-orange-500", iconColor: "text-red-600" },
                { step: 4, icon: Briefcase, title: "Create Account Segments", color: "from-yellow-500 to-amber-500", iconColor: "text-yellow-600" },
                { step: 5, icon: Group, title: "Build ICP Segment Groups", color: "from-teal-500 to-cyan-500", iconColor: "text-teal-600" },
                { step: 6, icon: BarChart3, title: "Prioritize ICP Groups", color: "from-indigo-500 to-violet-500", iconColor: "text-indigo-600" },
                { step: 7, icon: FileText, title: "Review & Export Summary", color: "from-gray-500 to-gray-600", iconColor: "text-gray-600" },
                { step: 8, icon: Workflow, title: "Run Strategic Diagnostics", color: "from-purple-500 to-indigo-600", iconColor: "text-purple-600" },
            ].map(item => (
                 <div key={item.step} className="flex items-start space-x-6 bg-white p-6 rounded-2xl border">
                    <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white text-2xl font-bold`}>{item.step}</div>
                    <div>
                        <div className="flex items-center space-x-3 mb-1">
                            <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                            <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-12 text-center">
          <button onClick={() => setStep('seniority')} className="w-full max-w-md px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold text-xl shadow-lg hover:shadow-xl">Get Started</button>
        </div>
      </div>
    </div>
  );
};
