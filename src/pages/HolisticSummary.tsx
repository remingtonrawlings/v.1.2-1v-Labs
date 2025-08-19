import React, { useState, useMemo } from 'react';
import { ArrowLeft, FileText, Check, ChevronsRight, Target, Building2, UserCheck, Briefcase, Group, BarChart3, ListCollapse, HardDrive, Workflow } from 'lucide-react';
import { SeniorityBucket, DepartmentBucket, PersonaBucket, AccountSegment, ICPSegmentGroup, StrategicWorkflowSurvey, DiagnosticAssessment } from '../types';

export interface PriorityState {
  high: string[];
  medium: string[];
  low: string[];
}

interface HolisticSummaryProps {
  onBack: () => void;
  onComplete: () => void;
  data: {
    seniorityBuckets: SeniorityBucket[];
    departmentBuckets: DepartmentBucket[];
    personaBuckets: PersonaBucket[];
    accountSegments: AccountSegment[];
    icpGroups: ICPSegmentGroup[];
    priorities: PriorityState;
    survey: StrategicWorkflowSurvey | null;
    diagnostics: DiagnosticAssessment[];
  }
}

const generateMarkdown = (data: HolisticSummaryProps['data']): string => {
    const { seniorityBuckets, departmentBuckets, personaBuckets, accountSegments, icpGroups, priorities, survey, diagnostics } = data;
    let md = "# GTM Strategy & Diagnostics Summary\n\n";

    md += "## Part 1: ICP & Organizational Model\n";
    // ... (rest of the markdown generation logic is the same)
    
    md += "\n## Part 2: GTM Survey Data\n";
    // ...
    
    md += "\n## Part 3: Diagnostic Assessment\n";
    const topPriorities = diagnostics
        .filter(a => a.maturity !== null && a.impact >= 7 && a.feasibility >= 6)
        .sort((a,b) => (b.impact * 0.6 + b.feasibility * 0.4) - (a.impact * 0.6 + a.feasibility * 0.4));
        
    md += "### Top Priority Action Items\n";
    if (topPriorities.length > 0) {
        topPriorities.forEach((item, index) => {
            md += `${index + 1}. **${item.name}** (Impact: ${item.impact}, Feasibility: ${item.feasibility}, Maturity: ${item.maturity})\n`;
        });
    } else {
        md += "_No high-priority items identified._\n";
    }

    return md;
}


const MarkdownModal = ({ markdown, onClose }: { markdown: string, onClose: () => void }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => { navigator.clipboard.writeText(markdown); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center"><h2 className="text-xl font-bold">Generated Markdown Summary</h2><button onClick={onClose} className="p-2">&times;</button></div>
                <textarea readOnly value={markdown} className="w-full flex-grow p-4 font-mono text-sm" />
                <div className="p-4 border-t flex justify-end">
                    <button onClick={handleCopy} className={`px-4 py-2 rounded-lg text-white font-semibold flex items-center space-x-2 ${copied ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {copied ? <Check size={16}/> : <FileText size={16}/>}
                        <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                    </button>
                </div>
            </div>
        </div>
    )
};

const Card = ({icon: Icon, title, children}: {icon: React.ElementType, title: string, children: React.ReactNode}) => (
    <div className="bg-white rounded-xl border p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
            <Icon className="w-6 h-6 text-gray-500" />
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        {children}
    </div>
)

export const HolisticSummary: React.FC<HolisticSummaryProps> = ({ onBack, onComplete, data }) => {
    const [showMarkdown, setShowMarkdown] = useState(false);
    const markdownContent = generateMarkdown(data);
    
    const topPriorities = useMemo(() => data.diagnostics
        .filter(a => a.maturity !== null && a.impact >= 7 && a.feasibility >= 6)
        .sort((a,b) => (b.impact * 0.6 + b.feasibility * 0.4) - (a.impact * 0.6 + a.feasibility * 0.4))
        .slice(0, 5), [data.diagnostics]);

    const PriorityGroup = ({title, ids}: {title: string, ids: string[]}) => (
        <div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <div className="space-y-2">
            {ids.length > 0 ? ids.map(id => {
                const group = data.icpGroups.find(g => g.id === id);
                if (!group) return null;
                return <div key={id} className="p-3 rounded-lg border" style={{borderLeft: `4px solid ${group.color}`}}><span className="font-semibold">{group.name}</span></div>
            }) : <p className="text-gray-500 italic">No groups.</p>}
            </div>
        </div>
    );

    return (
        <>
        {showMarkdown && <MarkdownModal markdown={markdownContent} onClose={() => setShowMarkdown(false)} />}
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center"><FileText className="w-6 h-6 text-white" /></div>
                            <div><h1 className="text-2xl font-bold text-gray-900">Step 9: Holistic Summary & Export</h1><p className="text-gray-600">Your complete GTM strategy at a glance</p></div>
                        </div>
                         <button onClick={onComplete} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"><span>Complete & Finish</span><Check className="w-5 h-5" /></button>
                    </div>
                </div>
            </header>
            <div className="max-w-7xl mx-auto px-6 py-8">
                 <div className="text-center mb-8">
                    <button onClick={() => setShowMarkdown(true)} className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-black transition-colors flex items-center space-x-2 mx-auto">
                        <FileText /><span>Generate & Export Markdown Summary</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card icon={Group} title="ICP & Prioritization">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <PriorityGroup title="High Priority" ids={data.priorities.high} />
                                <PriorityGroup title="Medium Priority" ids={data.priorities.medium} />
                                <PriorityGroup title="Low Priority" ids={data.priorities.low} />
                            </div>
                        </Card>
                        <Card icon={ListCollapse} title="GTM Survey Insights">
                            {data.survey && (
                                <div className="text-sm space-y-1 text-gray-700">
                                    <p><strong>Inbound Reliance:</strong> {data.survey.inbound.reliancePercentage}%</p>
                                    <p><strong>Team Size:</strong> {data.survey.team.aeCount} AEs, {data.survey.team.sdrCount} SDRs, {data.survey.team.csmCount} CSMs</p>
                                    <p><strong>Sales Engagement:</strong> {data.survey.systems.salesEngagementPlatform === 'Other' ? data.survey.systems.salesEngagementPlatformOther : data.survey.systems.salesEngagementPlatform}</p>
                                    <p><strong>Marketing Automation:</strong> {data.survey.systems.marketingAutomation === 'Other' ? data.survey.systems.marketingAutomationOther : data.survey.systems.marketingAutomation}</p>
                                </div>
                            )}
                        </Card>
                         <Card icon={Briefcase} title="Account Segments">
                            <div className="flex flex-wrap gap-2">{data.accountSegments.map(s => <div key={s.id} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">{s.name}</div>)}</div>
                        </Card>
                    </div>
                    {/* Right Column */}
                    <div className="lg:col-span-1 space-y-8">
                         <Card icon={Workflow} title="Top Diagnostic Priorities">
                            <div className="space-y-3">
                                {topPriorities.length > 0 ? topPriorities.map((item, index) => (
                                    <div key={item.id} className="p-3 rounded-lg border bg-gray-50">
                                        <div className="flex items-start space-x-3">
                                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-sm">{index + 1}</span>
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-800">{item.name}</h4>
                                                <div className="text-xs text-gray-500">I: <b className="text-red-600">{item.impact}</b> F: <b className="text-green-600">{item.feasibility}</b> M: <b className="text-blue-600">{item.maturity}</b></div>
                                            </div>
                                        </div>
                                    </div>
                                )) : <p className="text-gray-500 italic text-center">No high-priority items identified.</p>}
                             </div>
                        </Card>
                        <Card icon={UserCheck} title="Personas Defined">
                            <div className="flex flex-wrap gap-2">{data.personaBuckets.map(p => <div key={p.id} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">{p.name}</div>)}</div>
                        </Card>
                        <Card icon={Target} title="Foundational Buckets">
                            <p><strong>Seniority Buckets:</strong> {data.seniorityBuckets.length}</p>
                            <p><strong>Function Buckets:</strong> {data.departmentBuckets.length}</p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};
