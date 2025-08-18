import React, { useState } from 'react';
import { ArrowLeft, Target, Building2, UserCheck } from 'lucide-react';
import { SeniorityBucketing, SeniorityBucket } from './SeniorityBucketing';
import { DepartmentTeamOrganization, DepartmentBucket } from './DepartmentTeamOrganization';
import { PersonaCreation } from './PersonaCreation';

interface OrganizationalDesignProps {
  onBack: () => void;
}

type ExperienceStep = 'choice' | 'seniority' | 'department' | 'persona';

export const OrganizationalDesign: React.FC<OrganizationalDesignProps> = ({ onBack }) => {
  const [step, setStep] = useState<ExperienceStep>('choice');
  const [seniorityBuckets, setSeniorityBuckets] = useState<SeniorityBucket[]>([]);
  const [departmentBuckets, setDepartmentBuckets] = useState<DepartmentBucket[]>([]);

  const handleBackToChoice = () => setStep('choice');

  const handleSeniorityNext = (buckets: SeniorityBucket[]) => {
    setSeniorityBuckets(buckets);
    setStep('department');
  };

  const handleDepartmentNext = (buckets: DepartmentBucket[]) => {
    setDepartmentBuckets(buckets);
    setStep('persona');
  };

  if (step === 'seniority') {
    return (
      <SeniorityBucketing
        onBack={handleBackToChoice}
        onNext={handleSeniorityNext}
        initialBuckets={seniorityBuckets}
      />
    );
  }

  if (step === 'department') {
    return (
      <DepartmentTeamOrganization
        onBack={() => setStep('seniority')}
        onNext={handleDepartmentNext}
        initialBuckets={departmentBuckets}
      />
    );
  }

  if (step === 'persona') {
    return (
      <PersonaCreation
        onBack={() => setStep('department')}
        seniorityBuckets={seniorityBuckets}
        departmentBuckets={departmentBuckets}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Organizational Design Studio</h1>
              <p className="text-gray-600">A step-by-step guide to defining your organization</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Design Your Organization in 3 Steps
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Follow this guided process to create custom Seniority and Function buckets, then combine them to define your target Personas.
          </p>
        </div>

        <div className="space-y-8">
          {/* Step 1: Seniority */}
          <div className="flex items-start space-x-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold">1</div>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Target className="w-7 h-7 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">Define Seniority Buckets</h3>
              </div>
              <p className="text-gray-700">Start by creating high-level groupings for seniority. Drag and drop standard seniority levels (like C-Level, VP, Director) into custom-named buckets (e.g., "Executive Leadership", "Management").</p>
            </div>
          </div>

          {/* Step 2: Function */}
          <div className="flex items-start space-x-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold">2</div>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Building2 className="w-7 h-7 text-green-600" />
                <h3 className="text-2xl font-bold text-gray-900">Define Function Buckets</h3>
              </div>
              <p className="text-gray-700">Next, use our standard library of job functions to create your departmental structure. Drag functions (like "Software Engineering" or "Product Marketing") into custom buckets (e.g., "R&D", "Go-to-Market").</p>
            </div>
          </div>
          
          {/* Step 3: Persona */}
          <div className="flex items-start space-x-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-3xl font-bold">3</div>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <UserCheck className="w-7 h-7 text-red-600" />
                <h3 className="text-2xl font-bold text-gray-900">Create Persona Buckets</h3>
              </div>
              <p className="text-gray-700">Finally, combine your previously created buckets to define specific Personas. A Persona is the intersection of a Seniority bucket and a Function bucket (e.g., "Executive Leadership" + "Go-to-Market").</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => setStep('seniority')}
            className="w-full max-w-md px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold text-xl shadow-lg hover:shadow-xl"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
