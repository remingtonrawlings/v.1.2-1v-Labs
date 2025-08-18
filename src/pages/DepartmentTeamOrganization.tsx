import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowLeft, Building2, Plus, Search, Edit3, Trash2, ChevronDown, ChevronRight, CheckCircle2, ChevronsRight } from 'lucide-react';
import { departmentTeamMapping } from '../data/comprehensiveOrgData';

export interface TeamFunction {
  key: string;
  name: string;
  departmentName: string;
}

export interface DepartmentBucket {
  id: string;
  name: string;
  secondaryLabel: string;
  functions: TeamFunction[];
  color: string;
}

interface DepartmentTeamOrganizationProps {
  onBack: () => void;
  onNext: (buckets: DepartmentBucket[]) => void;
  initialBuckets: DepartmentBucket[];
}

const BUCKET_COLORS = [
  'bg-blue-50 border-blue-200',
  'bg-green-50 border-green-200',
  'bg-purple-50 border-purple-200',
  'bg-orange-50 border-orange-200',
  'bg-pink-50 border-pink-200',
  'bg-indigo-50 border-indigo-200',
  'bg-yellow-50 border-yellow-200',
  'bg-red-50 border-red-200'
];

export const DepartmentTeamOrganization: React.FC<DepartmentTeamOrganizationProps> = ({ onBack, onNext, initialBuckets }) => {
  const [departmentBuckets, setDepartmentBuckets] = useState<DepartmentBucket[]>(initialBuckets);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<{ type: 'department' | 'function'; data: any } | null>(null);
  const [editingBucket, setEditingBucket] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editLabel, setEditLabel] = useState('');
  const editingNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingBucket && editingNameInputRef.current) {
      editingNameInputRef.current.focus();
      editingNameInputRef.current.select();
    }
  }, [editingBucket]);

  const assignedFunctionKeys = useMemo(() => {
    const keys = new Set<string>();
    departmentBuckets.forEach(bucket => {
      bucket.functions.forEach(func => keys.add(func.key));
    });
    return keys;
  }, [departmentBuckets]);

  const filteredDepartments = Object.entries(departmentTeamMapping).filter(([deptName, teams]) => {
    if (!searchTerm) return true;
    return deptName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           teams.some(team => team.name.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const createDepartmentBucket = () => {
    const newBucket: DepartmentBucket = {
      id: `bucket-${Date.now()}`,
      name: `Custom Group ${departmentBuckets.length + 1}`,
      secondaryLabel: 'Uncategorized Functions',
      functions: [],
      color: BUCKET_COLORS[departmentBuckets.length % BUCKET_COLORS.length]
    };
    setDepartmentBuckets(prevBuckets => [...prevBuckets, newBucket]);
    setEditingBucket(newBucket.id);
    setEditName(newBucket.name);
    setEditLabel(newBucket.secondaryLabel);
  };

  const deleteBucket = (bucketId: string) => {
    setDepartmentBuckets(departmentBuckets.filter(s => s.id !== bucketId));
  };

  const updateBucket = (bucketId: string, updates: Partial<DepartmentBucket>) => {
    setDepartmentBuckets(departmentBuckets.map(bucket => 
      bucket.id === bucketId ? { ...bucket, ...updates } : bucket
    ));
  };

  const toggleDepartmentExpansion = (deptName: string) => {
    const newExpanded = new Set(expandedDepartments);
    if (newExpanded.has(deptName)) newExpanded.delete(deptName);
    else newExpanded.add(deptName);
    setExpandedDepartments(newExpanded);
  };

  const handleDragStart = (type: 'department' | 'function', data: any) => setDraggedItem({ type, data });
  const handleDragEnd = () => setDraggedItem(null);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (bucketId: string, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;
    const targetBucket = departmentBuckets.find(s => s.id === bucketId);
    if (!targetBucket) return;
    let functionsToAdd: TeamFunction[] = [];
    if (draggedItem.type === 'department') {
      const deptName = draggedItem.data;
      const deptFunctions = departmentTeamMapping[deptName] || [];
      functionsToAdd = deptFunctions
        .map(func => ({ ...func, departmentName: deptName }))
        .filter(func => !assignedFunctionKeys.has(func.key));
    } else if (draggedItem.type === 'function') {
      const func = draggedItem.data;
      if (!assignedFunctionKeys.has(func.key)) functionsToAdd = [func];
    }
    if (functionsToAdd.length > 0) {
      updateBucket(bucketId, { functions: [...targetBucket.functions, ...functionsToAdd] });
    }
  };

  const removeFunctionFromBucket = (bucketId: string, functionKey: string) => {
    const bucket = departmentBuckets.find(s => s.id === bucketId);
    if (!bucket) return;
    updateBucket(bucketId, { functions: bucket.functions.filter(f => f.key !== functionKey) });
  };

  const startEditing = (bucket: DepartmentBucket) => {
    setEditingBucket(bucket.id);
    setEditName(bucket.name);
    setEditLabel(bucket.secondaryLabel);
  };

  const saveEditing = (bucketId: string) => {
    updateBucket(bucketId, { name: editName, secondaryLabel: editLabel });
    setEditingBucket(null);
  };

  const cancelEditing = () => setEditingBucket(null);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, bucketId: string) => {
    if (e.key === 'Enter') saveEditing(bucketId);
    else if (e.key === 'Escape') cancelEditing();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Step 2: Function Buckets</h1>
                <p className="text-gray-600">Group standard functions into your own departments</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNext(departmentBuckets)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                <span>Next Step: Personas</span>
                <ChevronsRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-24 max-h-[800px] flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-green-600" />
                  Standard Functions Library
                </h2>
                <p className="text-sm text-gray-600 mb-4">These functions represent job roles and teams. Drag them into your custom buckets.</p>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search functions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {filteredDepartments.map(([deptName, teams]) => (
                  <div key={deptName} className="border rounded-lg">
                    <div className="flex items-center justify-between p-3 cursor-grab hover:bg-gray-50 rounded-t-lg" draggable onDragStart={() => handleDragStart('department', deptName)} onDragEnd={handleDragEnd}>
                      <div className="flex items-center space-x-2 flex-1">
                        <button onClick={() => toggleDepartmentExpansion(deptName)} className="p-1">
                          {expandedDepartments.has(deptName) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-sm">{deptName}</span>
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{teams.length}</span>
                    </div>
                    {expandedDepartments.has(deptName) && (
                      <div className="border-t bg-gray-50 rounded-b-lg p-2 space-y-1">
                        {teams.map((team) => {
                          const isAssigned = assignedFunctionKeys.has(team.key);
                          return (
                            <div key={team.key} draggable={!isAssigned} onDragStart={() => !isAssigned && handleDragStart('function', { ...team, departmentName: deptName })} onDragEnd={handleDragEnd} className={`flex items-center p-2 rounded ${isAssigned ? 'bg-green-50 text-gray-400 cursor-not-allowed' : 'hover:bg-white cursor-move'}`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${isAssigned ? 'bg-green-300' : 'bg-green-500'}`}></div>
                              <span className="text-sm flex-1">{team.name}</span>
                              {isAssigned && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">Your Custom Function Buckets</h2>
                <button onClick={createDepartmentBucket} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <Plus className="w-4 h-4" />
                  <span>Create Bucket</span>
                </button>
              </div>
              {departmentBuckets.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed rounded-xl">
                  <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600">No Custom Buckets Yet</h3>
                  <p className="text-gray-500">Create your first bucket to start organizing functions.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {departmentBuckets.map((bucket) => (
                    <div key={bucket.id} className={`p-6 rounded-xl border-2 border-dashed ${bucket.color} min-h-64`} onDrop={(e) => handleDrop(bucket.id, e)} onDragOver={handleDragOver}>
                      <div className="flex items-start justify-between mb-4">
                        {editingBucket === bucket.id ? (
                          <div className="flex-1 space-y-2">
                            <input ref={editingNameInputRef} type="text" value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => handleInputKeyDown(e, bucket.id)} className="w-full px-3 py-2 border rounded-lg" placeholder="Bucket Name" />
                            <input type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)} onKeyDown={(e) => handleInputKeyDown(e, bucket.id)} className="w-full px-3 py-2 border rounded-lg" placeholder="Secondary Label" />
                            <div className="flex space-x-2">
                              <button onClick={() => saveEditing(bucket.id)} className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">Save</button>
                              <button onClick={cancelEditing} className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800">{bucket.name}</h3>
                            <p className="text-sm text-gray-600">{bucket.secondaryLabel}</p>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 pl-2">
                          <span className="text-xs bg-white/50 px-2 py-1 rounded">{bucket.functions.length} functions</span>
                          <button onClick={() => startEditing(bucket)} className="p-2 hover:bg-white/50 rounded-lg"><Edit3 className="w-4 h-4 text-gray-600" /></button>
                          <button onClick={() => deleteBucket(bucket.id)} className="p-2 hover:bg-red-100 rounded-lg"><Trash2 className="w-4 h-4 text-red-600" /></button>
                        </div>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {bucket.functions.length === 0 ? (
                          <p className="text-gray-400 text-center py-8 italic">Drag functions here</p>
                        ) : (
                          bucket.functions.map((func) => (
                            <div key={func.key} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                              <div>
                                <div className="font-medium text-sm">{func.name}</div>
                                <div className="text-xs text-gray-500">from {func.departmentName}</div>
                              </div>
                              <button onClick={() => removeFunctionFromBucket(bucket.id, func.key)} className="p-1 hover:bg-red-100 rounded"><Trash2 className="w-3 h-3 text-red-600" /></button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
