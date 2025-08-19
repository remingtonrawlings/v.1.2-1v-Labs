import React, { useState, useMemo } from 'react';
import { ArrowLeft, ChevronsRight, Database, HardDrive, Workflow, BarChartBig, Target, Lightbulb, ChevronDown } from 'lucide-react';
import { DiagnosticAssessment as DiagnosticAssessmentType } from '../types';

interface DiagnosticAssessmentProps {
  onBack: () => void;
  onNext: (assessments: DiagnosticAssessmentType[]) => void;
}

const diagnosticFramework = [
  {
    category: 'ICP & GTM Data Foundation',
    icon: Database,
    focusAreas: [
      { id: 'accountAssignments', name: 'Account Assignments & Tiering', question: 'What is the current state of account and territory assignments?', picklist: [ { text: 'Strategic, tiered, and balanced', score: 9.0 }, { text: 'Assignments are balanced but not strategically tiered', score: 6.0 }, { text: 'Significant imbalance or universally overloaded reps', score: 3.0 }, { text: 'No formal assignment process (chaotic)', score: 1.0 } ] },
      { id: 'dataEnrichment', name: 'Data Enrichment & Sourcing', question: 'How effective is the process for acquiring and enriching prospect data?', picklist: [ { text: 'Automated enrichment with high accuracy (>90%)', score: 9.0 }, { text: 'Process is manual but data is generally accurate', score: 5.0 }, { text: 'Data accuracy is inconsistent and a known issue', score: 3.0 }, { text: 'No reliable data source or process', score: 1.0 } ] },
      { id: 'dataHygiene', name: 'Data Hygiene (Duplicates)', question: 'How is data duplication managed within the CRM?', picklist: [ { text: 'Proactive management with automated tools', score: 9.0 }, { text: 'Reactive, manual cleanup efforts', score: 5.0 }, { text: 'High rate of known duplicates with no process', score: 2.0 } ] }
    ]
  },
  {
    category: 'Systems & Technology Stack',
    icon: HardDrive,
    focusAreas: [
        { id: 'lifecycleProcess', name: 'Lead/Contact Lifecycle Process', question: 'How are person records (Leads/Contacts) managed in the CRM?', picklist: [ { text: 'Clear, automated lifecycle is followed', score: 9.0 }, { text: 'Process is defined but manual/inconsistent', score: 5.0 }, { text: 'Systematic duplicates from poor process', score: 3.0 }, { text: 'No defined lifecycle process exists', score: 1.0 } ] },
        { id: 'salesEngagementSync', name: 'Sales Engagement Sync', question: 'How reliable is the data sync between the CRM and Sales Engagement platform?', picklist: [ { text: 'Reliable, real-time sync with minimal errors', score: 9.0 }, { text: 'Occasional sync delays or minor errors', score: 6.0 }, { text: 'Frequent errors requiring manual intervention', score: 3.0 }, { text: 'Sync is fundamentally broken or untrusted', score: 1.0 } ] },
        { id: 'leadRouting', name: 'Lead Routing Automation', question: 'How are new inbound leads assigned to the sales team?', picklist: [ { text: 'Fully automated, fast (< 5 min), and accurate', score: 9.0 }, { text: 'Semi-automated or rules-based but slow (> 1 hr)', score: 5.0 }, { text: 'Primarily manual, slow, and inconsistent', score: 2.0 } ] },
        { id: 'techAdoption', name: 'Tech Stack Adoption & ROI', question: 'How well is the existing tech stack utilized by the team?', picklist: [ { text: 'High adoption with clear ROI on all major tools', score: 9.0 }, { text: 'Adoption is inconsistent; some tools are underutilized', score: 5.0 }, { text: 'Key tools have low adoption (< 60%)', score: 3.0 }, { text: 'Redundant tools exist with unclear purpose', score: 2.0 } ] }
    ]
  },
  {
    category: 'Process & Execution',
    icon: Workflow,
    focusAreas: [
        { id: 'taskManagement', name: 'Task Management', question: 'How effectively do reps manage their daily tasks (on-time completion, past due)?', picklist: [ { text: 'Consistently managed; past-due tasks are rare', score: 9.0 }, { text: 'Moderate number of past-due tasks (< 2 days old)', score: 5.0 }, { text: 'High volume of skipped tasks is common', score: 4.0 }, { text: 'Chronic issue with aging past-due tasks (> 3 days)', score: 2.0 } ] },
        { id: 'sequenceStrategy', name: 'Sequence Strategy', question: 'How effective and personalized are the sales sequences?', picklist: [ { text: 'Persona-based, A/B tested, multi-channel', score: 9.0 }, { text: 'Generic, email-only, or "one-size-fits-all"', score: 4.0 }, { text: 'No structured sequences; reps do their own thing', score: 2.0 } ] },
        { id: 'mktSdrHandoff', name: 'MKT > SDR Handoff (MQL)', question: 'What is the quality and efficiency of the Marketing-to-SDR handoff?', picklist: [ { text: 'Seamless with clear MQL definition and SLAs', score: 9.0 }, { text: 'Definition of MQL is unclear or disputed', score: 5.0 }, { text: 'Significant lead leakage or delays at handoff', score: 3.0 } ] },
        { id: 'sdrSalesHandoff', name: 'SDR > Sales Handoff (SQL)', question: 'What is the quality and efficiency of the SDR-to-AE handoff?', picklist: [ { text: 'Seamless with high AE acceptance rate (>90%)', score: 9.0 }, { text: 'Definition of SQL is unclear or disputed', score: 5.0 }, { text: 'High AE rejection rate of meetings (< 70%)', score: 3.0 } ] }
    ]
  },
  {
    category: 'Reporting & Analytics',
    icon: BarChartBig,
    focusAreas: [
        { id: 'meetingTracking', name: 'Meeting Tracking', question: 'How well does the process allow for tracking "Meetings Set" vs. "Meetings Held"?', picklist: [ { text: 'Automated tracking with clear dispositions', score: 9.0 }, { text: 'Tracking is manual and relies on rep input', score: 5.0 }, { text: 'Data is untrustworthy or non-existent', score: 2.0 } ] },
        { id: 'funnelAnalytics', name: 'Funnel Analytics', question: 'How visible and reliable are the conversion rates throughout the sales funnel?', picklist: [ { text: 'Clear, trusted dashboards for all stages', score: 9.0 }, { text: 'Data exists but is fragmented across systems', score: 6.0 }, { text: 'Key conversion metrics are unknown or untrusted', score: 3.0 } ] },
        { id: 'managerCoaching', name: 'Manager Coaching Dashboards', question: 'Do managers have the reporting they need for effective, data-driven coaching?', picklist: [ { text: 'Yes, dedicated dashboards for coaching exist', score: 9.0 }, { text: 'Managers use rep-level reports, but they aren\'t optimized for coaching', score: 5.0 }, { text: 'No, managers lack visibility into key coaching metrics', score: 2.0 } ] }
    ]
  },
  {
    category: 'Strategy & Enablement',
    icon: Target,
    focusAreas: [
        { id: 'salesPlaybook', name: 'Sales Playbook', question: 'How mature and utilized is the sales playbook?', picklist: [ { text: 'Living, centralized playbook is widely used', score: 9.0 }, { text: 'Playbook exists but is outdated or ignored', score: 4.0 }, { text: 'No formal playbook exists', score: 1.0 } ] },
        { id: 'onboarding', name: 'Onboarding & Ongoing Training', question: 'How effective is the sales onboarding and ongoing enablement program?', picklist: [ { text: 'Structured, effective, and continuous', score: 9.0 }, { text: 'Strong onboarding but weak ongoing training', score: 6.0 }, { text: 'Onboarding is informal and inconsistent', score: 3.0 }, { text: 'No formal training program exists', score: 1.0 } ] },
        { id: 'compPlan', name: 'Compensation Plan Alignment', question: 'Does the compensation plan directly incentivize the desired behaviors and outcomes?', picklist: [ { text: 'Yes, it aligns perfectly with strategic goals', score: 9.0 }, { text: 'It rewards activity more than outcomes', score: 4.0 }, { text: 'It creates perverse incentives or team conflict', score: 2.0 } ] }
    ]
  }
];

const initialScores = diagnosticFramework.flatMap(c => c.focusAreas.map(f => ({
    id: f.id,
    name: f.name,
    category: c.category,
    maturity: null,
    impact: 5,
    feasibility: 5
})));


export const DiagnosticAssessment: React.FC<DiagnosticAssessmentProps> = ({ onBack, onNext }) => {
    const [assessments, setAssessments] = useState<DiagnosticAssessmentType[]>(initialScores);

    const updateAssessment = (id: string, updates: Partial<Omit<DiagnosticAssessmentType, 'id' | 'name' | 'category'>>) => {
        setAssessments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    }
    
    const sortedPriorities = useMemo(() => {
        const scored = assessments.filter(a => a.maturity !== null);
        const priorityScore = (item: DiagnosticAssessmentType) => (item.impact * 0.6) + (item.feasibility * 0.4) - (item.maturity * 0.1);
        scored.sort((a, b) => priorityScore(b) - priorityScore(a));
        return scored;
    }, [assessments]);

    const topPriorities = useMemo(() => sortedPriorities.filter(a => a.impact >= 7 && a.feasibility >= 6).slice(0, 5), [sortedPriorities]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center"><Workflow className="w-6 h-6 text-white" /></div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Step 8: Diagnostic Assessment</h1>
                                <p className="text-gray-600">Diagnose GTM health and prioritize actions</p>
                            </div>
                        </div>
                        <button onClick={() => onNext(assessments)} className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
                            <span>Next: Final Summary</span>
                            <ChevronsRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                         <div className="space-y-4">
                            {diagnosticFramework.map((cat, index) => (
                                <details key={cat.category} open={index === 0} className="bg-white rounded-xl border p-6 shadow-sm group">
                                    <summary className="flex items-center justify-between cursor-pointer">
                                        <div className="flex items-center space-x-3">
                                            <cat.icon className="w-6 h-6 text-purple-600" />
                                            <h2 className="text-xl font-bold text-gray-800">{cat.category}</h2>
                                        </div>
                                        <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <div className="mt-6 space-y-6">
                                        {cat.focusAreas.map(area => {
                                            const current = assessments.find(a => a.id === area.id)!;
                                            return (
                                            <div key={area.id} className="p-4 border-t">
                                                <h3 className="font-bold text-lg text-gray-800">{area.name}</h3>
                                                <p className="text-gray-600 mt-1">{area.question}</p>
                                                
                                                <div className="my-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-start space-x-3">
                                                    <Lightbulb className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-1" />
                                                    <div>
                                                        <h4 className="font-semibold text-indigo-800">AI-Assisted Insight</h4>
                                                        <p className="text-sm text-indigo-700">Relevant data points would appear here to help inform your maturity selection.</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                                    <div>
                                                        <label className="text-sm font-semibold text-gray-600 block mb-2">Maturity Score</label>
                                                        <select onChange={(e) => updateAssessment(area.id, { maturity: parseFloat(e.target.value) })} value={current.maturity ?? ''} className="w-full p-2 border rounded-lg">
                                                            <option value="" disabled>Select maturity...</option>
                                                            {area.picklist.map(opt => <option key={opt.score} value={opt.score}>{opt.text}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-semibold text-gray-600 block mb-2">Impact Score: <span className="font-bold text-purple-700">{current.impact}</span></label>
                                                        <input type="range" min="1" max="10" value={current.impact} onChange={e => updateAssessment(area.id, { impact: parseInt(e.target.value, 10) })} className="w-full" />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-semibold text-gray-600 block mb-2">Feasibility Score: <span className="font-bold text-purple-700">{current.feasibility}</span></label>
                                                        <input type="range" min="1" max="10" value={current.feasibility} onChange={e => updateAssessment(area.id, { feasibility: parseInt(e.target.value, 10) })} className="w-full" />
                                                    </div>
                                                </div>
                                            </div>
                                        )})}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border p-6 shadow-sm sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Prioritization Matrix</h2>
                            <p className="text-sm text-gray-600 mb-4">As you complete the assessment, your top priorities will appear here.</p>
                             <div className="space-y-3">
                                {topPriorities.length > 0 ? topPriorities.map((item, index) => (
                                    <div key={item.id} className="p-4 rounded-lg border bg-gray-50">
                                        <div className="flex items-center space-x-3">
                                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-sm">{index + 1}</span>
                                            <div>
                                                <h4 className="font-bold text-gray-800">{item.name}</h4>
                                                <div className="text-xs text-gray-500 flex space-x-2">
                                                    <span>Impact: <b className="text-red-600">{item.impact}</b></span>
                                                    <span>Feasibility: <b className="text-green-600">{item.feasibility}</b></span>
                                                    <span>Maturity: <b className="text-blue-600">{item.maturity}</b></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-10 text-gray-500 italic">
                                        No high-priority items identified yet.
                                    </div>
                                )}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
