import React, { useState, useMemo } from 'react';
import { ArrowLeft, Group, UserCheck, Plus, Edit3, Trash2, X, ChevronsRight } from 'lucide-react';
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

export const ICPSegmentCreation: React.FC<ICPSegmentCreationProps> = ({ onBack, onNext, accountSegments, personaBuckets, seniorityBuckets, departmentBuckets, initialGroups }) => {
  const [icpGroups, setIcpGroups] = useState<ICPSegmentGroup[]>(initialGroups);
  const [draggedPersonaId, setDraggedPersonaId] = useState<string | null>(null);
  const [editingGroup, setEditingGroup] = useState<ICPSegmentGroup | null>(null);

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
    };
    setIcpGroups([...icpGroups, newGroup]);
    setEditingGroup(newGroup);
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
    setIcpGroups(icpGroups.map(group => group.id === groupId ? { ...group, personaIds: new Set(group.personaIds).add(draggedPersonaId) } : group));
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

  return (
    <>
    {editingGroup && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Edit ICP Group</h2>
                <div className="space-y-4">
                    <div>
                        <label className="font-semibold">Group Name</label>
                        <input type="text" value={editingGroup.name} onChange={e => setEditingGroup({...editingGroup, name: e.target.value})} className="w-full p-2 border rounded-lg mt-1" />
                    </div>
                    <div>
                        <label className="font-semibold">Link to Account Segment (Optional)</label>
                        <select value={editingGroup.accountSegmentId || ''} onChange={e => setEditingGroup({...editingGroup, accountSegmentId: e.target.value || null})} className="w-full p-2 border rounded-lg mt-1">
                            <option value="">None (Personas Only)</option>
                            {accountSegments.map(seg => <option key={seg.id} value={seg.id}>{seg.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="font-semibold">Group Color</label>
                        <div className="flex space-x-2 mt-2">
                          {GROUP_COLORS.map(color => (
                            <button key={color} onClick={() => setEditingGroup({...editingGroup, color})} className="w-8 h-8 rounded-full" style={{ backgroundColor: color, outline: editingGroup.color === color ? `2px solid ${color}` : 'none', outlineOffset: '2px' }} />
                          ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
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
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><UserCheck className="w-5 h-5 mr-2 text-red-600" />Persona Library</h2>
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                        {personaBuckets.length > 0 ? personaBuckets.map(persona => {
                            const details = getPersonaDetails(persona.id);
                            return (
                                <div key={persona.id} draggable onDragStart={() => handleDragStart(persona.id)} onDragEnd={handleDragEnd} className="p-4 rounded-lg border bg-gray-50 cursor-grab transition-shadow hover:shadow-md">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-gray-800">{persona.name}</h3>
                                        {(personaUsageCount[persona.id] > 0) && <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full font-medium">{personaUsageCount[persona.id]} uses</span>}
                                    </div>
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
                    return (
                        <div key={group.id} onDrop={() => handleDrop(group.id)} onDragOver={handleDragOver} className="bg-white rounded-xl border p-6 shadow-sm min-h-[12rem]" style={{ borderLeft: `5px solid ${group.color}`}}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{group.name}</h3>
                                    {linkedSegment ? (
                                        <div className="text-xs text-gray-500 mt-1 space-y-1">
                                            <p><span className="font-semibold">Industries:</span> {linkedSegment.industries.join(', ') || 'Any'}</p>
                                            <p><span className="font-semibold">Employees:</span> {linkedSegment.employeeCounts.join(', ') || 'Any'}</p>
                                            <p><span className="font-semibold">Revenue:</span> {linkedSegment.revenueBands.join(', ') || 'Any'}</p>
                                        </div>
                                    ) : <p className="text-sm text-gray-500 italic">Personas only (no account criteria)</p>}
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => setEditingGroup(group)} className="p-2 hover:bg-gray-100 rounded-lg"><Edit3 size={16}/></button>
                                    <button onClick={() => deleteIcpGroup(group.id)} className="p-2 hover:bg-red-100 rounded-lg"><Trash2 size={16} className="text-red-600"/></button>
                                </div>
                            </div>
                            <div className="space-y-2">
                              {Array.from(group.personaIds).map(personaId => {
                                const persona = getPersonaDetails(personaId);
                                return (
                                  <div key={personaId} className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded-md">
                                    <span className="text-red-800 font-medium">{persona?.name}</span>
                                    <button onClick={() => removePersonaFromGroup(group.id, personaId)} className="p-1 hover:bg-red-100 rounded-full"><X size={14} className="text-red-700"/></button>
                                  </div>
                                )
                              })}
                            </div>
                            {group.personaIds.size === 0 && <p className="text-center text-gray-400 py-4 border-2 border-dashed rounded-md">Drag Personas here</p>}
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
