import React, { useState, useMemo } from 'react';
import { ArrowLeft, BarChart3, GripVertical, ChevronsRight, Eye, Edit3, X } from 'lucide-react';
import { ICPSegmentGroup, AccountSegment, PersonaBucket } from '../types';

export interface PriorityState {
  high: string[];
  medium: string[];
  low: string[];
}

interface ICPProritizationProps {
  onBack: () => void;
  onNext: (priorities: PriorityState) => void;
  icpGroups: ICPSegmentGroup[];
  initialPriorities: PriorityState;
  accountSegments: AccountSegment[];
  personaBuckets: PersonaBucket[];
  onEditRequest: (groupId: string) => void;
}

type PriorityLevel = 'high' | 'medium' | 'low' | 'unassigned';

const GroupDetailsModal = ({ group, accountSegments, personaBuckets, onClose, onEdit }: { group: ICPSegmentGroup, accountSegments: AccountSegment[], personaBuckets: PersonaBucket[], onClose: () => void, onEdit: (groupId: string) => void }) => {
    const linkedSegment = accountSegments.find(s => s.id === group.accountSegmentId);
    const personas = Array.from(group.personaIds).map(id => personaBuckets.find(p => p.id === id)).filter(Boolean);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">{group.name}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
                </div>
                <div className="p-6 flex-grow overflow-y-auto space-y-4 text-sm">
                    {linkedSegment && <div><h4 className="font-bold">Account Segment</h4><p>{linkedSegment.name} (Industries: {linkedSegment.industries.join(', ') || 'Any'})</p></div>}
                    <div><h4 className="font-bold">Personas</h4><div className="flex flex-wrap gap-2 mt-1">{personas.map(p => <span key={p!.id} className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs">{p!.name}</span>)}</div></div>
                    <div><h4 className="font-bold">Strategic Context</h4><p className="whitespace-pre-wrap bg-gray-50 p-2 rounded">{group.strategicContext || "N/A"}</p></div>
                    <div><h4 className="font-bold">Pain Points</h4><p className="whitespace-pre-wrap bg-gray-50 p-2 rounded">{group.painPoints || "N/A"}</p></div>
                    <div><h4 className="font-bold">Value Propositions</h4><p className="whitespace-pre-wrap bg-gray-50 p-2 rounded">{group.valueProps || "N/A"}</p></div>
                    <div><h4 className="font-bold">CRM List</h4><p className="whitespace-pre-wrap bg-gray-50 p-2 rounded break-words">{group.crmList || "N/A"}</p></div>
                    <div><h4 className="font-bold">Assets</h4><p className="whitespace-pre-wrap bg-gray-50 p-2 rounded break-words">{group.assets || "N/A"}</p></div>
                </div>
                <div className="p-6 border-t flex justify-end">
                    <button onClick={() => onEdit(group.id)} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Edit3 size={16}/><span>Edit Group</span>
                    </button>
                </div>
            </div>
        </div>
    )
};

export const ICPPrioritization: React.FC<ICPProritizationProps> = ({ onBack, onNext, icpGroups, initialPriorities, accountSegments, personaBuckets, onEditRequest }) => {
  const [priorities, setPriorities] = useState<PriorityState>(initialPriorities);
  const [draggedGroupId, setDraggedGroupId] = useState<string | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<PriorityLevel | null>(null);
  const [viewingGroup, setViewingGroup] = useState<ICPSegmentGroup | null>(null);

  const unassignedGroups = useMemo(() => {
    const assignedIds = new Set([...priorities.high, ...priorities.medium, ...priorities.low]);
    return icpGroups.filter(g => !assignedIds.has(g.id));
  }, [icpGroups, priorities]);

  const findGroup = (id: string) => icpGroups.find(g => g.id === id);

  // ... Drag and drop handlers remain the same ...
  const handleDragStart = (groupId: string) => setDraggedGroupId(groupId);
  const handleDragEnd = () => setDraggedGroupId(null);
  const handleDragOver = (e: React.DragEvent, target: PriorityLevel) => { e.preventDefault(); setDragOverTarget(target); };
  const handleDragLeave = () => setDragOverTarget(null);
  const handleDrop = (e: React.DragEvent, targetPriority: PriorityLevel) => {
    e.preventDefault();
    setDragOverTarget(null);
    if (!draggedGroupId) return;
    let newPriorities: PriorityState = { high: priorities.high.filter(id => id !== draggedGroupId), medium: priorities.medium.filter(id => id !== draggedGroupId), low: priorities.low.filter(id => id !== draggedGroupId) };
    if (targetPriority !== 'unassigned') {
        const targetList = newPriorities[targetPriority];
        if (!targetList.includes(draggedGroupId)) newPriorities[targetPriority] = [...targetList, draggedGroupId];
    }
    setPriorities(newPriorities);
    setDraggedGroupId(null);
  };
  
  const ICPGroupCard = ({group, onDragStart, onDragEnd, isDragging, onView}: {group: ICPSegmentGroup; onDragStart: (id: string) => void; onDragEnd: () => void; isDragging: boolean; onView: (group: ICPSegmentGroup) => void;}) => (
    <div draggable onDragStart={() => onDragStart(group.id)} onDragEnd={onDragEnd} className={`p-2 rounded-lg border flex items-center transition-all duration-200 justify-between ${isDragging ? 'opacity-50 scale-95 shadow-lg' : 'bg-white'} `} style={{ borderLeft: `5px solid ${group.color}`}}>
        <div className="flex items-center cursor-grab"><GripVertical className="text-gray-400 mr-2" /><span className="font-semibold text-gray-800">{group.name}</span></div>
        <button onClick={() => onView(group)} className="p-2 hover:bg-gray-100 rounded-lg"><Eye size={16} className="text-gray-500" /></button>
    </div>
);

  const PriorityBucket = ({ title, level, groupIds }: { title: string; level: PriorityLevel; groupIds: string[] }) => (
    <div onDrop={(e) => handleDrop(e, level)} onDragOver={(e) => handleDragOver(e, level)} onDragLeave={handleDragLeave} className={`rounded-xl border p-6 shadow-sm min-h-[400px] flex flex-col transition-all duration-200 ${dragOverTarget === level ? 'bg-blue-50 border-blue-500 border-2' : 'bg-white'}`}>
        <h2 className={`text-xl font-bold mb-4 text-center pb-2 border-b-2 ${level === 'high' && 'border-red-500 text-red-600'} ${level === 'medium' && 'border-yellow-500 text-yellow-600'} ${level === 'low' && 'border-blue-500 text-blue-600'}`}>{title}</h2>
        <div className="space-y-3 flex-grow pt-4">{groupIds.map(id => { const group = findGroup(id); if (!group) return null; return <ICPGroupCard key={id} group={group} onDragStart={handleDragStart} onDragEnd={handleDragEnd} isDragging={draggedGroupId === id} onView={setViewingGroup}/>; })} {groupIds.length === 0 && <div className="h-full flex items-center justify-center text-gray-400 italic">Drop groups here</div>}</div>
    </div>
  );

  return (
    <>
        {viewingGroup && <GroupDetailsModal group={viewingGroup} accountSegments={accountSegments} personaBuckets={personaBuckets} onClose={() => setViewingGroup(null)} onEdit={onEditRequest} />}
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center"><BarChart3 className="w-6 h-6 text-white" /></div>
                            <div><h1 className="text-2xl font-bold text-gray-900">Step 6: ICP Prioritization</h1><p className="text-gray-600">Organize your ICP groups by priority</p></div>
                        </div>
                        <button onClick={() => onNext(priorities)} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"><span>Next: GTM Survey</span><ChevronsRight className="w-5 h-5" /></button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border p-6 shadow-sm sticky top-24">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">ICP Groups Library</h2>
                            <div onDrop={(e) => handleDrop(e, 'unassigned')} onDragOver={(e) => handleDragOver(e, 'unassigned')} onDragLeave={handleDragLeave} className={`space-y-3 max-h-[60vh] overflow-y-auto pr-2 min-h-[10rem] p-2 rounded-lg transition-all duration-200 ${dragOverTarget === 'unassigned' ? 'bg-blue-100' : 'bg-gray-50'}`}>
                                {unassignedGroups.length > 0 ? unassignedGroups.map(group => (<ICPGroupCard key={group.id} group={group} onDragStart={handleDragStart} onDragEnd={handleDragEnd} isDragging={draggedGroupId === group.id} onView={setViewingGroup}/>)) : <p className="text-gray-500 italic text-center pt-8">All groups prioritized!</p>}
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <PriorityBucket title="High Priority" level="high" groupIds={priorities.high} />
                        <PriorityBucket title="Medium Priority" level="medium" groupIds={priorities.medium} />
                        <PriorityBucket title="Low Priority" level="low" groupIds={priorities.low} />
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};
