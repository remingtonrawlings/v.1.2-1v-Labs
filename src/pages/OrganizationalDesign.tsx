import React, { useState } from 'react';
import { ArrowLeft, Target, Building2, UserCheck, Briefcase, Group, BarChart3 } from 'lucide-react';
import { SeniorityBucketing } from './SeniorityBucketing';
import { DepartmentTeamOrganization } from './DepartmentTeamOrganization';
import { PersonaCreation } from './PersonaCreation';
import { AccountSegmentation } from './AccountSegmentation';
import { ICPSegmentCreation } from './ICPSegmentCreation';
import { ICPPrioritization } from './ICPPrioritization';
import { SeniorityBucket, DepartmentBucket, PersonaBucket, AccountSegment, ICPSegmentGroup } from '../types';

interface OrganizationalDesignProps {
  onBack: () => void;
}

type ExperienceStep = 'choice' | 'seniority' | 'department' | 'persona' | 'account' | 'icp' | 'prioritization';

export const OrganizationalDesign: React.FC<OrganizationalDesignProps> = ({ onBack }) => {
  const [step, setStep] = useState<ExperienceStep>('choice');
  const [seniorityBuckets, setSeniorityBuckets] = useState<SeniorityBucket[]>([]);
  const [departmentBuckets, setDepartmentBuckets] = useState<DepartmentBucket[]>([]);
  const [personaBuckets, setPersonaBuckets] = useState<PersonaBucket[]>([]);
  const [accountSegments, setAccountSegments] = useState<AccountSegment[]>([]);
  const [icpGroups, setIcpGroups] = useState<ICPSegmentGroup[]>([]);

  const handleBackToChoice = () => setStep('choice');

  const handleSeniorityNext = (buckets: SeniorityBucket[]) => { setSeniorityBuckets(buckets); setStep('department'); };
  const handleDepartmentNext = (buckets: DepartmentBucket[]) => { setDepartmentBuckets(buckets); setStep('persona'); };
  const handlePersonaNext = (buckets: PersonaBucket[]) => { setPersonaBuckets(buckets); setStep('account'); };
  const handleAccountNext = (segments: AccountSegment[]) => { setAccountSegments(segments); setStep('icp'); };
  const handleIcpNext = (groups: ICPSegmentGroup[]) => { setIcpGroups(groups); setStep('prioritization'); };

  if (step === 'seniority') return <SeniorityBucketing onBack={handleBackToChoice} onNext={handleSeniorityNext} initialBuckets={seniorityBuckets} />;
  if (step === 'department') return <DepartmentTeamOrganization onBack={() => setStep('seniority')} onNext={handleDepartmentNext} initialBuckets={departmentBuckets} />;
  if (step === 'persona') return <PersonaCreation onBack={() => setStep('department')} onNext={handlePersonaNext} seniorityBuckets={seniorityBuckets} departmentBuckets={departmentBuckets} initialPersonas={personaBuckets} />;
  if (step === 'account') return <AccountSegmentation onBack={() => setStep('persona')} onNext={handleAccountNext} initialSegments={accountSegments} />;
  if (step === 'icp') return <ICPSegmentCreation onBack={() => setStep('account')} onNext={handleIcpNext} personaBuckets={personaBuckets} accountSegments={accountSegments} seniorityBuckets={seniorityBuckets} departmentBuckets={departmentBuckets} initialGroups={icpGroups} />;
  if (step === 'prioritization') return <ICPPrioritization onBack={() => setStep('icp')} icpGroups={icpGroups} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center"><Group className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Organizational Design Studio</h1>
              <p className="text-gray-600">A step-by-step guide to defining and prioritizing your ICP</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Define & Prioritize Your ICP in 6 Steps</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">This guided process builds your entire organizational model, from foundational buckets to final, prioritized ICP groups.</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start space-x-6 bg-white p-6 rounded-2xl border"><div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">1</div><div><div className="flex items-center space-x-3 mb-1"><Target className="w-6 h-6 text-blue-600" /><h3 className="text-xl font-bold text-gray-900">Define Seniority Buckets</h3></div></div></div>
          <div className="flex items-start space-x-6 bg-white p-6 rounded-2xl border"><div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">2</div><div><div className="flex items-center space-x-3 mb-1"><Building2 className="w-6 h-6 text-green-600" /><h3 className="text-xl font-bold text-gray-900">Define Function Buckets</h3></div></div></div>
          <div className="flex items-start space-x-6 bg-white p-6 rounded-2xl border"><div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">3</div><div><div className="flex items-center space-x-3 mb-1"><UserCheck className="w-6 h-6 text-red-600" /><h3 className="text-xl font-bold text-gray-900">Create Persona Buckets</h3></div></div></div>
          <div className="flex items-start space-x-6 bg-white p-6 rounded-2xl border"><div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">4</div><div><div className="flex items-center space-x-3 mb-1"><Briefcase className="w-6 h-6 text-yellow-600" /><h3 className="text-xl font-bold text-gray-900">Create Account Segments</h3></div></div></div>
          <div className="flex items-start space-x-6 bg-white p-6 rounded-2xl border"><div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">5</div><div><div className="flex items-center space-x-3 mb-1"><Group className="w-6 h-6 text-teal-600" /><h3 className="text-xl font-bold text-gray-900">Build ICP Segment Groups</h3></div></div></div>
          <div className="flex items-start space-x-6 bg-white p-6 rounded-2xl border"><div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">6</div><div><div className="flex items-center space-x-3 mb-1"><BarChart3 className="w-6 h-6 text-indigo-600" /><h3 className="text-xl font-bold text-gray-900">Prioritize ICP Groups</h3></div></div></div>
        </div>

        <div className="mt-12 text-center">
          <button onClick={() => setStep('seniority')} className="w-full max-w-md px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold text-xl shadow-lg hover:shadow-xl">Get Started</button>
        </div>
      </div>
    </div>
  );
};
