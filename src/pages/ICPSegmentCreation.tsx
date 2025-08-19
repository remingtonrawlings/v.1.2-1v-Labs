import React, { useState, useMemo } from 'react';
import { ArrowLeft, Group, UserCheck, Plus, Edit3, Trash2, X, ChevronsRight, Copy, AppWindow, ChevronDown } from 'lucide-react';
import { AccountSegment, PersonaBucket, SeniorityBucket, DepartmentBucket, ICPSegmentGroup } from '../types';

interface ICPSegmentCreationProps {
  onBack: () => void;
  onNext: (groups: ICPSegmentGroup[]) => void;
  accountSegments: AccountSegment[];
  personaBuckets: PersonaBucket[];
  seniorityBuckets: SeniorityBucket[];
  departmentBuckets: DepartmentBucket[];
  initialGroups: ICPSegmentGroup[];
}

const GROUP_COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#6366F1', '#14B8A6'];

const PersonaAssignmentModal = ({
    icpGroups,
    personaBuckets,
    onAssign,
    onCancel,
} : {
    icpGroups: ICPSegmentGroup[];
    personaBuckets: PersonaBucket[];
    onAssign: (groupId: string, personaIds: string[]) => void;
    onCancel: () => void;
}) => {
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [selectedPersonaIds, setSelectedPersonaIds] = useState<Set<string>>(new Set());
    
    const assignedPersonaIdsInSelectedGroup = useMemo(() => {
        return icpGroups.find(g => g.id === selectedGroupId)?.personaIds || new Set();
    }, [selectedGroupId, icpGroups]);

    const togglePersonaSelection = (id: string) => {
        const newSet = new Set(selectedPersonaIds);
        if(newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedPersonaIds(newSet);
    }

    const handleAssign = () => {
        onAssign(selectedGroupId, Array.from(selectedPersonaIds));
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Bulk Assign Personas</h2>
              <p className="text-gray-600">Assign multiple personas to a specific ICP Segment Group.</p>
            </div>
            <div className="p-6 flex-grow overflow-y-auto">
                <div className="mb-6">
                    <label className="font-semibold text-lg mb-2 block">1. Select ICP Segment Group</label>
                    <select value={selectedGroupId} onChange={e => setSelectedGroupId(e.target.value)} className="w-full p-3 border rounded-lg">
                        <option value="">Choose a group...</option>
                        {icpGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                </div>
                {selectedGroupId && (
                <div>
                    <label className="font-semibold text-lg mb-2 block">2. Select Personas to Add</label>
                    <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg max-h-[40vh] overflow-y-auto">
                        {personaBuckets.map(p => {
                            const isAssigned = assignedPersonaIdsInSelectedGroup.has(p.id);
                            return (
                                <label key={p.id} className={`flex items-center space-x-3 p-3 rounded-lg ${isAssigned ? 'text-gray-400 bg-gray-100' : 'hover:bg-gray-100 cursor-pointer'}`}>
                                    <input type="checkbox" disabled={isAssigned} checked={selectedPersonaIds.has(p.id)} onChange={() => togglePersonaSelection(p.id)} className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"/>
                                    <span>{p.name}</span>
                                </label>
                            )
                        })}
                    </div>
                </div>
                )}
            </div>
            <div className="p-6 border-t flex justify-between items-center">
                <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-lg">Close</button>
                <button onClick={handleAssign} disabled={!selectedGroupId || selectedPersonaIds.size === 0} className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold disabled:bg-teal-300">
                    Assign {selectedPersonaIds.size > 0 ? selectedPersonaIds.size : ''} Personas
                </button>
            </div>
          </div>
        </div>
    );
};

export const ICPSegmentCreation: React.FC<ICPSegmentCreationProps> = ({ onBack, onNext, accountSegments, personaBuckets, seniorityBuckets, departmentBuckets, initialGroups }) => {
  const [icpGroups, setIcpGroups] = useState<ICPSegmentGroup[]>(initialGroups);
  const [draggedPersonaId, setDraggedPersonaId] = useState<string | null>(null);
  const [editingGroup, setEditingGroup] = useState<ICPSegmentGroup | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<string>>(new Set());

  const toggleGroupExpansion = (groupId: string) => {
    const newSet = new Set(expandedGroupIds);
    if(newSet.has(groupId)) newSet.delete(groupId);
    else newSet.add(groupId);
    setExpandedGroupIds(newSet);
  }

  const personaUsageCount = useMemo(() => {
    const counts: Record<string, number> = {};
    icpGroups.forEach(group => {
      group.personaIds.forEach(id => {
        counts[id] = (counts[id] || 0) + 1;
      });
    });
    return counts;
  }, [icpGroups]);

  const getPersonaDetails = (id: string) => personaBuckets.find(p => p.id === id);
  const getSeniorityName = (id: string | null) => seniorityBuckets.find(b => b.id === id)?.name;
  const getDepartmentName = (id: string | null) => departmentBuckets.find(b => b.id === id)?.name;

  const createIcpGroup = () => {
    const newGroup: ICPSegmentGroup = {
      id: `icp-${Date.now()}`,
      name: `New ICP Group ${icpGroups.length + 1}`,
      accountSegmentId: null,
      personaIds: new Set(),
      color: GROUP_COLORS[icpGroups.length % GROUP_COLORS.length],
      strategicContext: '',
      painPoints: '',
      valueProps: '',
      crmList: '',
      assets: ''
    };
    setIcpGroups([...icpGroups, newGroup]);
    setEditingGroup(newGroup);
  };
  
  const cloneIcpGroup = (groupToClone: ICPSegmentGroup) => {
    const newGroup: ICPSegmentGroup = {
        ...JSON.parse(JSON.stringify(groupToClone)),
        id: `icp-${Date.now()}`,
        name: `${groupToClone.name} - Copy`,
        personaIds: new Set(groupToClone.personaIds),
    };
    setIcpGroups(prev => [...prev, newGroup]);
  };

  const saveEditingGroup = () => {
    if (editingGroup) {
      setIcpGroups(icpGroups.map(g => g.id === editingGroup.id ? editingGroup : g));
    }
    setEditingGroup(null);
  };
  
  const deleteIcpGroup = (id: string) => setIcpGroups(icpGroups.filter(g => g.id !== id));

  const handleDragStart = (personaId: string) => setDraggedPersonaId(personaId);
  const handleDragEnd = () => setDraggedPersonaId(null);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  
  const handleDrop = (groupId: string) => {
    if(!draggedPersonaId) return;
    setIcpGroups(icpGroups.map(group => {
        if(group.id === groupId && !group.personaIds.has(draggedPersonaId)) {
            const newPersonaIds = new Set(group.personaIds);
            newPersonaIds.add(draggedPersonaId);
            return { ...group, personaIds: newPersonaIds };
        }
        return group;
    }));
  };
  
  const removePersonaFromGroup = (groupId: string, personaId: string) => {
    setIcpGroups(icpGroups.map(group => {
        if (group.id === groupId) {
            const newPersonaIds = new Set(group.personaIds);
            newPersonaIds.delete(personaId);
            return { ...group, personaIds: newPersonaIds };
        }
        return group;
    }));
  };

  const handleBulkAssign = (groupId: string, personaIds: string[]) => {
    setIcpGroups(icpGroups.map(group => {
        if(group.id === groupId) {
            const newPersonaIds = new Set(group.personaIds);
            personaIds.forEach(id => newPersonaIds.add(id));
            return { ...group, personaIds: newPersonaIds };
        }
        return group;
    }));
    setShowAssignModal(false);
  }

  return (
    <>
    {showAssignModal && <PersonaAssignmentModal icpGroups={icpGroups} personaBuckets={personaBuckets} onAssign={handleBulkAssign} onCancel={() => setShowAssignModal(false)} />}
    {editingGroup && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 flex flex-col h-[90vh]">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit ICP Group</h2>
                <div className="space-y-4 overflow-y-auto pr-2 flex-grow">
                    <div><label className="font-semibold">Group Name</label><input type="text" value={editingGroup.name} onChange={e => setEditingGroup({...editingGroup, name: e.target.value})} className="w-full p-2 border rounded-lg mt-1" /></div>
                    <div><label className="font-semibold">Link to Account Segment (Optional)</label><select value={editingGroup.accountSegmentId || ''} onChange={e => setEditingGroup({...editingGroup, accountSegmentId: e.target.value || null})} className="w-full p-2 border rounded-lg mt-1"><option value="">None (Personas Only)</option>{accountSegments.map(seg => <option key={seg.id} value={seg.id}>{seg.name}</option>)}</select></div>
                    <div><label className="font-semibold">Strategic Context for Messaging</label><textarea value={editingGroup.strategicContext} onChange={e => setEditingGroup({...editingGroup, strategicContext: e.target.value})} rows={3} className="w-full p-2 border rounded-lg mt-1" /></div>
                    <div><label className="font-semibold">Pains / Problem Hypothesis</label><textarea value={editingGroup.painPoints} onChange={e => setEditingGroup({...editingGroup, painPoints: e.target.value})} rows={3} className="w-full p-2 border rounded-lg mt-1" /></div>
                    <div><label className="font-semibold">Value Propositions</label><textarea value={editingGroup.valueProps} onChange={e => setEditingGroup({...editingGroup, valueProps: e.target.value})} rows={3} className="w-full p-2 border rounded-lg mt-1" /></div>
                    <div><label className="font-semibold">CRM List (e.g., Salesforce URL)</label><textarea value={editingGroup.crmList} onChange={e => setEditingGroup({...editingGroup, crmList: e.target.value})} rows={2} className="w-full p-2 border rounded-lg mt-1" /></div>
                    <div><label className="font-semibold">Assets (Campaigns, Programs, etc.)</label><textarea value={editingGroup.assets} onChange={e => setEditingGroup({...editingGroup, assets: e.target.value})} rows={2} className="w-full p-2 border rounded-lg mt-1" /></div>
                    <div><label className="font-semibold">Group Color</label><div className="flex space-x-2 mt-2">{GROUP_COLORS.map(color => (<button key={color} onClick={() => setEditingGroup({...editingGroup, color})} className="w-8 h-8 rounded-full" style={{ backgroundColor: color, outline: editingGroup.color === color ? `2px solid ${color}` : 'none', outlineOffset: '2px' }} />))}</div></div>
                </div>
                <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
                    <button onClick={() => setEditingGroup(null)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                    <button onClick={saveEditingGroup} className="px-4 py-2 bg-teal-600 text-white rounded-lg">Save</button>
                </div>
            </div>
         </div>
    )}
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center"><Group className="w-6 h-6 text-white" /></div>
              <div><h1 className="text-2xl font-bold text-gray-900">Step 5: Build ICP Segment Groups</h1><p className="text-gray-600">Map Personas to Account Segments</p></div>
            </div>
            <button onClick={() => onNext(icpGroups)} disabled={icpGroups.length === 0} className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold disabled:bg-teal-300 disabled:cursor-not-allowed"><span>Next: Prioritize</span><ChevronsRight className="w-5 h-5" /></button>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border p-6 shadow-sm sticky top-24">
                    <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center"><UserCheck className="w-5 h-5 mr-2 text-red-600" />Persona Library</h2>
                    <button onClick={() => setShowAssignModal(true)} className="w-full flex items-center justify-center space-x-2 px-4 py-2 mb-4 bg-white text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors">
                        <AppWindow className="w-4 h-4" />
                        <span>Bulk Assign Personas</span>
                    </button>
                    <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-2">
                        {personaBuckets.length > 0 ? personaBuckets.map(persona => {
                            const details = getPersonaDetails(persona.id);
                            return (
                                <div key={persona.id} draggable onDragStart={() => handleDragStart(persona.id)} onDragEnd={handleDragEnd} className="p-4 rounded-lg border bg-gray-50 cursor-grab transition-shadow hover:shadow-md">
                                    <div className="flex justify-between items-start"><h3 className="font-bold text-gray-800">{persona.name}</h3>{(personaUsageCount[persona.id] > 0) && <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full font-medium">{personaUsageCount[persona.id]} uses</span>}</div>
                                    <p className="text-xs text-gray-500">S: {getSeniorityName(details?.seniorityBucketId)} | F: {getDepartmentName(details?.departmentBucketId)}</p>
                                </div>
                            );
                        }) : <p className="text-gray-500 italic text-center py-4">Create Personas in Step 3.</p>}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center"><Group className="w-6 h-6 mr-2 text-teal-600" />Your ICP Segment Groups</h2>
                    <button onClick={createIcpGroup} className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"><Plus size={16}/><span>Create ICP Group</span></button>
                </div>
                {icpGroups.length > 0 ? icpGroups.map(group => {
                    const linkedSegment = accountSegments.find(s => s.id === group.accountSegmentId);
                    const isExpanded = expandedGroupIds.has(group.id);
                    return (
                        <div key={group.id} onDrop={() => handleDrop(group.id)} onDragOver={handleDragOver} className="bg-white rounded-xl border p-6 shadow-sm min-h-[12rem] transition-all" style={{ borderLeft: `5px solid ${group.color}`}}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{group.name}</h3>
                                    {linkedSegment ? (<div className="text-xs text-gray-500 mt-1 space-y-1"><p><span className="font-semibold">Industries:</span> {linkedSegment.industries.join(', ') || 'Any'}</p><p><span className="font-semibold">Employees:</span> {linkedSegment.employeeCounts.join(', ') || 'Any'}</p><p><span className="font-semibold">Revenue:</span> {linkedSegment.revenueBands.join(', ') || 'Any'}</p></div>) : <p className="text-sm text-gray-500 italic">Personas only (no account criteria)</p>}
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => cloneIcpGroup(group)} className="p-2 hover:bg-gray-100 rounded-lg"><Copy size={16}/></button>
                                    <button onClick={() => setEditingGroup(group)} className="p-2 hover:bg-gray-100 rounded-lg"><Edit3 size={16}/></button>
                                    <button onClick={() => deleteIcpGroup(group.id)} className="p-2 hover:bg-red-100 rounded-lg"><Trash2 size={16} className="text-red-600"/></button>
                                </div>
                            </div>
                            <div className="space-y-2">
                              {Array.from(group.personaIds).map(personaId => {
                                const persona = getPersonaDetails(personaId);
                                return ( <div key={personaId} className="flex items-center justify-between p-2 rounded-md" style={{border: `1px solid ${group.color}`, backgroundColor: `${group.color}1A`}}>
                                    <span className="font-medium" style={{color: group.color}}>{persona?.name}</span>
                                    <button onClick={() => removePersonaFromGroup(group.id, personaId)} className="p-1 hover:bg-white/50 rounded-full"><X size={14} style={{color: group.color}}/></button>
                                </div>)
                              })}
                            </div>
                            {group.personaIds.size === 0 && <p className="text-center text-gray-400 py-4 border-2 border-dashed rounded-md">Drag Personas here</p>}
                            
                            <div className="mt-4 pt-4 border-t">
                                <button onClick={() => toggleGroupExpansion(group.id)} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                                    <ChevronDown className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} size={16}/>
                                    <span>Show Context</span>
                                </button>
                                {isExpanded && (
                                    <div className="mt-4 space-y-3 text-sm text-gray-700 bg-gray-50 p-4 rounded-md">
                                        <div><h4 className="font-semibold text-gray-800">Strategic Context</h4><p>{group.strategicContext || "N/A"}</p></div>
                                        <div><h4 className="font-semibold text-gray-800">Pain Points</h4><p>{group.painPoints || "N/A"}</p></div>
                                        <div><h4 className="font-semibold text-gray-800">Value Propositions</h4><p>{group.valueProps || "N/A"}</p></div>
                                        <div><h4 className="font-semibold text-gray-800">CRM List</h4><p className="whitespace-pre-wrap break-words">{group.crmList || "N/A"}</p></div>
                                        <div><h4 className="font-semibold text-gray-800">Assets</h4><p className="whitespace-pre-wrap break-words">{group.assets || "N/A"}</p></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }) : <div className="text-center py-16 border-2 border-dashed rounded-xl"><Group className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-semibold text-gray-600">No ICP Groups Yet</h3><p className="text-gray-500">Create your first group to begin mapping personas.</p></div>}
            </div>
        </div>
      </div>
    </div>
    </>
  );
};
