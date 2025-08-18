import React, { useState, useMemo } from 'react';
import { ArrowLeft, BarChart3, GripVertical } from 'lucide-react';
import { ICPSegmentGroup } from '../types';

interface ICPProritizationProps {
  onBack: () => void;
  icpGroups: ICPSegmentGroup[];
}

type PriorityLevel = 'high' | 'medium' | 'low' | 'unassigned';

interface PriorityState {
  high: string[];
  medium: string[];
  low: string[];
}

export const ICPPrioritization: React.FC<ICPProritizationProps> = ({ onBack, icpGroups }) => {
  const [priorities, setPriorities] = useState<PriorityState>({ high: [], medium: [], low: [] });
  const [draggedGroupId, setDraggedGroupId] = useState<string | null>(null);

  const unassignedGroups = useMemo(() => {
    const assignedIds = new Set([...priorities.high, ...priorities.medium, ...priorities.low]);
    return icpGroups.filter(g => !assignedIds.has(g.id));
  }, [icpGroups, priorities]);

  const findGroup = (id: string) => icpGroups.find(g => g.id === id);

  const handleDragStart = (groupId: string) => setDraggedGroupId(groupId);
  const handleDragEnd = () => setDraggedGroupId(null);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (targetPriority: PriorityLevel) => {
    if (!draggedGroupId) return;

    // Remove from all lists first
    let newPriorities: PriorityState = {
      high: priorities.high.filter(id => id !== draggedGroupId),
      medium: priorities.medium.filter(id => id !== draggedGroupId),
      low: priorities.low.filter(id => id !== draggedGroupId),
    };

    // Add to the target list if it's not unassigned
    if (targetPriority !== 'unassigned') {
        newPriorities[targetPriority] = [...newPriorities[targetPriority], draggedGroupId];
    }
    
    setPriorities(newPriorities);
    setDraggedGroupId(null);
  };
  
  const PriorityBucket = ({ title, level, groupIds }: { title: string; level: PriorityLevel; groupIds: string[] }) => (
    <div 
        onDrop={() => handleDrop(level)}
        onDragOver={handleDragOver}
        className="bg-white rounded-xl border p-6 shadow-sm min-h-[400px] flex flex-col"
    >
        <h2 className={`text-xl font-bold mb-4 text-center pb-2 border-b-2 
            ${level === 'high' && 'border-red-500 text-red-600'}
            ${level === 'medium' && 'border-yellow-500 text-yellow-600'}
            ${level === 'low' && 'border-blue-500 text-blue-600'}
        `}>{title}</h2>
        <div className="space-y-3 flex-grow">
            {groupIds.map(id => {
                const group = findGroup(id);
                if (!group) return null;
                return <ICPGroupCard key={id} group={group} onDragStart={handleDragStart} onDragEnd={handleDragEnd} />;
            })}
             {groupIds.length === 0 && <div className="h-full flex items-center justify-center text-gray-400 italic">Drop groups here</div>}
        </div>
    </div>
  );

  const ICPGroupCard = ({group, onDragStart, onDragEnd}: {group: ICPSegmentGroup; onDragStart: (id: string) => void; onDragEnd: () => void}) => (
    <div draggable onDragStart={() => onDragStart(group.id)} onDragEnd={onDragEnd} className="p-4 rounded-lg border flex items-center cursor-grab" style={{ borderLeft: `5px solid ${group.color}`}}>
        <GripVertical className="text-gray-400 mr-2" />
        <span className="font-semibold text-gray-800">{group.name}</span>
    </div>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center"><BarChart3 className="w-6 h-6 text-white" /></div>
                        <div><h1 className="text-2xl font-bold text-gray-900">Step 6: ICP Prioritization</h1><p className="text-gray-600">Organize your ICP groups by priority</p></div>
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">Complete Setup</button>
                </div>
            </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl border p-6 shadow-sm sticky top-24">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">ICP Groups Library</h2>
                        <div 
                            onDrop={() => handleDrop('unassigned')}
                            onDragOver={handleDragOver}
                            className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 min-h-[10rem] bg-gray-50 p-2 rounded-lg"
                        >
                            {unassignedGroups.length > 0 ? unassignedGroups.map(group => (
                                <ICPGroupCard key={group.id} group={group} onDragStart={handleDragStart} onDragEnd={handleDragEnd} />
                            )) : <p className="text-gray-500 italic text-center pt-8">All groups prioritized!</p>}
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
  );
};
