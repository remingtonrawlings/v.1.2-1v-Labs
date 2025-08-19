import React, { useState } from 'react';
import { ArrowLeft, FileText, Check, ChevronsRight, Workflow as WorkflowIcon } from 'lucide-react';
import { SeniorityBucket, DepartmentBucket, PersonaBucket, AccountSegment, ICPSegmentGroup } from '../types';

export interface PriorityState {
  high: string[];
  medium: string[];
  low: string[];
}

interface GlobalMessagingContextProps {
  onBack: () => void;
  onNext: () => void;
  data: {
    seniorityBuckets: SeniorityBucket[];
    departmentBuckets: DepartmentBucket[];
    personaBuckets: PersonaBucket[];
    accountSegments: AccountSegment[];
    icpGroups: ICPSegmentGroup[];
    priorities: PriorityState;
  }
}

const generateMarkdown = (data: GlobalMessagingContextProps['data']): string => {
    const { seniorityBuckets, departmentBuckets, personaBuckets, accountSegments, icpGroups, priorities } = data;
    let md = "# ICP & GTM Strategy Summary\n\n";

    md += "## Foundational Buckets\n\n";
    md += "### Seniority Buckets\n";
    seniorityBuckets.forEach(b => md += `- **${b.name}**: ${b.secondaryLabel} (Levels: ${b.levels.join(', ')})\n`);
    md += "\n### Function Buckets\n";
    departmentBuckets.forEach(b => md += `- **${b.name}**: ${b.secondaryLabel} (${b.functions.length} functions)\n`);

    md += "\n## Personas\n";
    personaBuckets.forEach(p => {
        const sen = seniorityBuckets.find(b => b.id === p.seniorityBucketId)?.name || 'N/A';
        const fun = departmentBuckets.find(b => b.id === p.departmentBucketId)?.name || 'N/A';
        md += `- **${p.name}** (Seniority: ${sen}, Function: ${fun})\n`;
    });
    
    md += "\n## Account Segments\n";
    accountSegments.forEach(a => {
        md += `### ${a.name}\n`;
        md += `- **Industries**: ${a.industries.join(', ') || 'Any'}\n`;
        md += `- **Employee Count**: ${a.employeeCounts.join(', ') || 'Any'}\n`;
        md += `- **Revenue Bands**: ${a.revenueBands.join(', ') || 'Any'}\n\n`;
    });
    
    md += "\n## Prioritized ICP Segment Groups\n";
    const renderPriorityGroup = (title: string, ids: string[]) => {
        md += `### ${title}\n`;
        if (ids.length === 0) md += "_No groups in this priority level._\n\n";
        ids.forEach(id => {
            const group = icpGroups.find(g => g.id === id);
            if(group) {
                const acc = accountSegments.find(a => a.id === group.accountSegmentId);
                md += `#### ${group.name}\n`;
                if(acc) md += `- **Linked Account Segment**: ${acc.name}\n`;
                else md += `- **Linked Account Segment**: None\n`;
                md += `- **Personas**:\n`;
                Array.from(group.personaIds).forEach(pId => {
                    const persona = personaBuckets.find(p => p.id === pId);
                    if(persona) md += `  - ${persona.name}\n`;
                });
                md += `- **Strategic Context**: ${group.strategicContext || 'N/A'}\n`;
                md += `- **Pain Points**: ${group.painPoints || 'N/A'}\n`;
                md += `- **Value Propositions**: ${group.valueProps || 'N/A'}\n\n`;
            }
        });
    };
    
    renderPriorityGroup('High Priority', priorities.high);
    renderPriorityGroup('Medium Priority', priorities.medium);
    renderPriorityGroup('Low Priority', priorities.low);

    return md;
}

const MarkdownModal = ({ markdown, onClose }: { markdown: string, onClose: () => void }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(markdown);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">Generated Markdown Summary</h2>
                    <button onClick={onClose} className="p-2">&times;</button>
                </div>
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

export const GlobalMessagingContext: React.FC<GlobalMessagingContextProps> = ({ onBack, onNext, data }) => {
    const [showMarkdown, setShowMarkdown] = useState(false);
    const markdownContent = generateMarkdown(data);

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
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Step 7: Global Messaging Context</h1>
                                <p className="text-gray-600">Your complete GTM strategy summary</p>
                            </div>
                        </div>
                         <button onClick={onNext} className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
                            <span>Next: Strategic Workflows</span>
                            <ChevronsRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-xl border p-8 shadow-sm">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Strategy is Defined!</h2>
                    <p className="text-lg text-gray-600 mb-6">You have successfully built a comprehensive model of your Ideal Customer Profile. This structure provides the strategic foundation for creating highly-targeted, prioritized Engagement Plans and other Go-To-Market initiatives.</p>
                    <div className="p-6 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <h3 className="font-bold text-indigo-800 mb-2">What's Next?</h3>
                        <p className="text-indigo-700">This structured data can now be used to:</p>
                        <ul className="list-disc list-inside mt-2 text-indigo-700 space-y-1">
                            <li>Run a diagnostic to identify strategic workflows and areas for improvement.</li>
                            <li>Generate tailored messaging for each ICP Segment Group.</li>
                            <li>Build prioritized sequences and campaigns.</li>
                            <li>Align sales and marketing efforts on the highest-value targets.</li>
                        </ul>
                    </div>
                    <div className="mt-8 flex justify-center items-center space-x-4">
                        <button onClick={() => setShowMarkdown(true)} className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-black transition-colors flex items-center space-x-2">
                            <FileText />
                            <span>Generate Markdown Summary</span>
                        </button>
                        <button onClick={onNext} className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
                            <WorkflowIcon />
                            <span>Run Diagnostics</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};
