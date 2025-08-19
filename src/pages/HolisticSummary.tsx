import React, { useState, useMemo } from 'react';
import { ArrowLeft, FileText, Check, Target, Building2, UserCheck, Briefcase, Group, BarChart3, ListCollapse, Workflow, GanttChartSquare } from 'lucide-react';
import { SeniorityBucket, DepartmentBucket, PersonaBucket, AccountSegment, ICPSegmentGroup, StrategicWorkflowSurvey, DiagnosticAssessment, SalesStage } from '../types';

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
    salesStages: SalesStage[];
  }
}

const generateMarkdown = (data: HolisticSummaryProps['data']): string => {
    const { seniorityBuckets, departmentBuckets, personaBuckets, accountSegments, icpGroups, priorities, survey, diagnostics, salesStages } = data;
    let md = "# GTM Strategy & Diagnostics Summary\n\n";

    md += "## Part 1: ICP & Organizational Model\n";
    md += `### Seniority Buckets\n${seniorityBuckets.map(b => `- **${b.name}**: ${b.levels.join(', ')}`).join('\n')}\n`;
    md += `\n### Function Buckets\n${departmentBuckets.map(b => `- **${b.name}**: ${b.functions.length} functions`).join('\n')}\n`;
    md += `\n### Personas\n${personaBuckets.map(p => `- **${p.name}**`).join('\n')}\n`;
    md += `\n### Account Segments\n${accountSegments.map(a => `#### ${a.name}\n- Industries: ${a.industries.join(', ') || 'Any'}\n- Employees: ${a.employeeCounts.join(', ') || 'Any'}`).join('\n')}\n`;
    
    md += "\n## Part 2: Prioritized ICP Groups\n";
    const renderPriorityGroup = (title: string, ids: string[]) => {
        md += `### ${title}\n`;
        if (ids.length === 0) { md += "_No groups._\n\n"; return; }
        ids.forEach(id => {
            const group = icpGroups.find(g => g.id === id);
            if(group) md += `- **${group.name}**\n`;
        });
    };
    renderPriorityGroup('High Priority', priorities.high);
    renderPriorityGroup('Medium Priority', priorities.medium);
    renderPriorityGroup('Low Priority', priorities.low);
    
    md += "\n## Part 3: Structured Sales Process\n";
    salesStages.forEach(s => {
        md += `### ${s.name}\n- **Description**: ${s.description}\n- **Exit Criteria**: ${s.exitCriteria}\n`;
    });

    if (survey) {
        md += "\n## Part 4: GTM Survey Data\n";
        md += "### Team & Operations\n";
        md += `- Users: ${survey.team.aeCount} AEs, ${survey.team.sdrCount} SDRs, ${survey.team.csmCount} CSMs\n`;
        md += `- Languages: ${[...survey.team.prospectingLanguages, survey.team.otherLanguages].filter(Boolean).join(', ')}\n`;
        md += "### Systems & Processes\n";
        md += `- SEP: ${survey.systems.salesEngagementPlatform === 'Other' ? survey.systems.salesEngagementPlatformOther : survey.systems.salesEngagementPlatform}\n`;
        md += `- MAP: ${survey.systems.marketingAutomation === 'Other' ? survey.systems.marketingAutomationOther : survey.systems.marketingAutomation}\n`;
    }
    
    md += "\n## Part 5: Diagnostic Assessment\n";
    const topPriorities = diagnostics.filter(a => a.maturity !== null && a.impact >= 7 && a.feasibility >= 6).sort((a,b) => (b.impact * 0.6 + b.feasibility * 0.4) - (a.impact * 0.6 + a.feasibility * 0.4));
    md += "### Top Priority Action Items\n";
    if (topPriorities.length > 0) topPriorities.forEach((item, i) => { md += `${i + 1}. **${item.name}** (Impact: ${item.impact}, Feasibility: ${item.feasibility}, Maturity: ${item.maturity})\n`; });
    else md += "_No high-priority items identified._\n";

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
        <div className="flex items-center space-x-3 mb-4"><Icon className="w-6 h-6 text-gray-500" /><h2 className="text-xl font-bold text-gray-800">{title}</h2></div>
        {children}
    </div>
)

export const HolisticSummary: React.FC<HolisticSummaryProps> = ({ onBack, onComplete, data }) => {
    const [showMarkdown, setShowMarkdown] = useState(false);
    const markdownContent = generateMarkdown(data);
    
    const topPriorities = useMemo(() => data.diagnostics.filter(a => a.maturity !== null && a.impact >= 7 && a.feasibility >= 6).sort((a,b) => (b.impact * 0.6 + b.feasibility * 0.4) - (a.impact * 0.6 + a.feasibility * 0.4)).slice(0, 5), [data.diagnostics]);

    const PriorityGroup = ({title, ids}: {title: string, ids: string[]}) => (
        <div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <div className="space-y-2">{ids.length > 0 ? ids.map(id => { const g = data.icpGroups.find(g => g.id === id); if (!g) return null; return <div key={id} className="p-3 rounded-lg border" style={{borderLeft: `4px solid ${g.color}`}}><span className="font-semibold">{g.name}</span></div>}) : <p className="text-gray-500 italic">No groups.</p>}</div>
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
                            <div><h1 className="text-2xl font-bold text-gray-900">Step 10: Holistic Summary & Export</h1><p className="text-gray-600">Your complete GTM strategy at a glance</p></div>
                        </div>
                         <button onClick={onComplete} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"><span>Complete & Finish</span><Check className="w-5 h-5" /></button>
                    </div>
                </div>
            </header>
            <div className="max-w-7xl mx-auto px-6 py-8">
                 <div className="text-center mb-8"><button onClick={() => setShowMarkdown(true)} className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-black transition-colors flex items-center space-x-2 mx-auto"><FileText /><span>Generate & Export Markdown Summary</span></button></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card icon={GanttChartSquare} title="Structured Sales Process">
                            <div className="space-y-2">{data.salesStages.map((stage, i) => <div key={stage.id}><span className="font-bold">{i + 1}. {stage.name}:</span> <span className="text-gray-600">{stage.description}</span></div>)}</div>
                        </Card>
                        <Card icon={Group} title="ICP & Prioritization">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><PriorityGroup title="High Priority" ids={data.priorities.high} /><PriorityGroup title="Medium Priority" ids={data.priorities.medium} /><PriorityGroup title="Low Priority" ids={data.priorities.low} /></div>
                        </Card>
                        <Card icon={ListCollapse} title="GTM Survey Insights">
                            {data.survey && <div className="text-sm space-y-1 text-gray-700"><p><strong>Inbound Reliance:</strong> {data.survey.inbound.reliancePercentage}%</p><p><strong>Team Size:</strong> {data.survey.team.aeCount} AEs, {data.survey.team.sdrCount} SDRs, {data.survey.team.csmCount} CSMs</p><p><strong>Sales Engagement:</strong> {data.survey.systems.salesEngagementPlatform === 'Other' ? data.survey.systems.salesEngagementPlatformOther : data.survey.systems.salesEngagementPlatform}</p></div>}
                        </Card>
                    </div>
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
                        <div className="grid grid-cols-2 gap-8">
                            <Card icon={UserCheck} title="Personas"><p className="text-3xl font-bold">{data.personaBuckets.length}</p></Card>
                            <Card icon={Briefcase} title="Segments"><p className="text-3xl font-bold">{data.accountSegments.length}</p></Card>
                        </div>
                        <Card icon={Target} title="Foundational Buckets"><p><strong>Seniority:</strong> {data.seniorityBuckets.length}</p><p><strong>Function:</strong> {data.departmentBuckets.length}</p></Card>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};
