import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowLeft, Building2, Plus, Search, Edit3, Trash2, ChevronDown, ChevronRight, CheckCircle2, ChevronsRight, Layers, AppWindow } from 'lucide-react';
import { departmentTeamMapping } from '../data/comprehensiveOrgData';
import { DepartmentBucket, TeamFunction } from '../types';

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

const FunctionsAssignmentModal = ({
  departmentBuckets,
  assignedFunctionKeys,
  onAssign,
  onCancel,
}: {
  departmentBuckets: DepartmentBucket[];
  assignedFunctionKeys: Set<string>;
  onAssign: (bucketId: string, functionKeys: string[]) => void;
  onCancel: () => void;
}) => {
  const [selectedBucketId, setSelectedBucketId] = useState<string>('');
  const [selectedFunctionKeys, setSelectedFunctionKeys] = useState<Set<string>>(new Set());

  const toggleFunctionSelection = (key: string) => {
    const newSet = new Set(selectedFunctionKeys);
    if (newSet.has(key)) newSet.delete(key);
    else newSet.add(key);
    setSelectedFunctionKeys(newSet);
  };
  
  const handleAssign = () => {
    onAssign(selectedBucketId, Array.from(selectedFunctionKeys));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">View & Assign Functions</h2>
          <p className="text-gray-600">Bulk-assign functions to one of your custom buckets.</p>
        </div>
        <div className="p-6 flex-grow overflow-y-hidden grid grid-cols-3 gap-6">
          <div className="col-span-1 border-r pr-6">
            <h3 className="font-semibold mb-2">1. Select a Bucket</h3>
            <select value={selectedBucketId} onChange={e => setSelectedBucketId(e.target.value)} className="w-full p-2 border rounded-lg mb-4">
              <option value="">Choose a bucket...</option>
              {departmentBuckets.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <h3 className="font-semibold mb-2">2. Select Functions</h3>
            <p className="text-sm text-gray-500">Check the functions to add to the selected bucket.</p>
          </div>
          <div className="col-span-2 overflow-y-auto">
             <div className="space-y-4">
              {Object.entries(departmentTeamMapping).map(([deptName, functions]) => (
                <div key={deptName}>
                  <h4 className="font-bold text-gray-700 mb-2">{deptName}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {functions.map(func => {
                      const isAssigned = assignedFunctionKeys.has(func.key);
                      return (
                        <label key={func.key} className={`flex items-center space-x-2 p-2 rounded-md ${isAssigned ? 'text-gray-400' : 'hover:bg-gray-100 cursor-pointer'}`}>
                          <input type="checkbox" disabled={isAssigned} checked={selectedFunctionKeys.has(func.key)} onChange={() => toggleFunctionSelection(func.key)} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"/>
                          <span>{func.name}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))}
             </div>
          </div>
        </div>
        <div className="p-6 border-t flex justify-between items-center">
            <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-lg">Close</button>
            <button onClick={handleAssign} disabled={!selectedBucketId || selectedFunctionKeys.size === 0} className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold disabled:bg-green-300">
                Assign {selectedFunctionKeys.size > 0 ? selectedFunctionKeys.size : ''} Functions
            </button>
        </div>
      </div>
    </div>
  );
};


const BulkCreateModal = ({ onSave, onCancel }: { onSave: (names: string[]) => void; onCancel: () => void; }) => {
  const [step, setStep] = useState(1);
  const [numBuckets, setNumBuckets] = useState(3);
  const [bucketNames, setBucketNames] = useState<string[]>([]);

  const handleNumChange = (num: number) => {
    const n = Math.max(1, num);
    setNumBuckets(n);
    setBucketNames(Array.from({ length: n }, (_, i) => `Custom Group ${i + 1}`));
  };

  const startNaming = () => {
    handleNumChange(numBuckets);
    setStep(2);
  };

  const updateName = (index: number, name: string) => {
    const newNames = [...bucketNames];
    newNames[index] = name;
    setBucketNames(newNames);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        {step === 1 && (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Create Buckets in Bulk</h2>
            <p className="text-gray-600 mb-6">How many buckets will you need? You can always add or remove them later.</p>
            <div className="flex items-center space-x-4 mb-4">
              {[3, 4, 5].map(num => (
                <button key={num} onClick={() => handleNumChange(num)} className={`px-6 py-3 rounded-lg font-semibold text-lg transition-colors ${numBuckets === num ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{num}</button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Or enter a custom amount:</span>
              <input type="number" value={numBuckets} onChange={e => handleNumChange(parseInt(e.target.value, 10))} className="w-20 p-2 border rounded-lg" />
            </div>
            <div className="flex justify-end space-x-3 mt-8">
              <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
              <button onClick={startNaming} className="px-4 py-2 bg-green-600 text-white rounded-lg">Next</button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Name Your Buckets</h2>
            <p className="text-gray-600 mb-6">Provide a name for each of your new buckets.</p>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {bucketNames.map((name, index) => (
                <input key={index} type="text" value={name} onChange={e => updateName(index, e.target.value)} className="w-full p-2 border rounded-lg" />
              ))}
            </div>
            <div className="flex justify-end space-x-3 mt-8">
              <button onClick={() => setStep(1)} className="px-4 py-2 bg-gray-200 rounded-lg">Back</button>
              <button onClick={() => onSave(bucketNames)} className="px-4 py-2 bg-green-600 text-white rounded-lg">Save Buckets</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const DepartmentTeamOrganization: React.FC<DepartmentTeamOrganizationProps> = ({ onBack, onNext, initialBuckets }) => {
  const [departmentBuckets, setDepartmentBuckets] = useState<DepartmentBucket[]>(initialBuckets);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<{ type: 'department' | 'function'; data: any } | null>(null);
  const [editingBucket, setEditingBucket] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editLabel, setEditLabel] = useState('');
  const editingNameInputRef = useRef<HTMLInputElement>(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

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
  
  const handleBulkAssign = (bucketId: string, functionKeys: string[]) => {
    const functionsToAdd: TeamFunction[] = [];
    
    for (const key of functionKeys) {
        for (const deptName in departmentTeamMapping) {
            const func = departmentTeamMapping[deptName].find(f => f.key === key);
            if(func) {
                functionsToAdd.push({ ...func, departmentName: deptName});
                break;
            }
        }
    }
    
    updateBucket(bucketId, { functions: [...(departmentBuckets.find(b => b.id === bucketId)?.functions || []), ...functionsToAdd] });
    setShowAssignModal(false);
  };


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
  
  const handleBulkSave = (names: string[]) => {
    const newBuckets = names.map((name, index) => ({
      id: `bucket-${Date.now()}-${index}`,
      name: name,
      secondaryLabel: 'Functions Group',
      functions: [],
      color: BUCKET_COLORS[(departmentBuckets.length + index) % BUCKET_COLORS.length]
    }));
    setDepartmentBuckets(prev => [...prev, ...newBuckets]);
    setShowBulkModal(false);
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
        .map(func => ({ ...func, departmentName: deptName } as TeamFunction))
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
    <>
      {showBulkModal && <BulkCreateModal onSave={handleBulkSave} onCancel={() => setShowBulkModal(false)} />}
      {showAssignModal && <FunctionsAssignmentModal departmentBuckets={departmentBuckets} assignedFunctionKeys={assignedFunctionKeys} onAssign={handleBulkAssign} onCancel={() => setShowAssignModal(false)} />}
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
                  disabled={departmentBuckets.length === 0}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:bg-green-300 disabled:cursor-not-allowed"
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
                    Functions Library
                  </h2>
                   <button onClick={() => setShowAssignModal(true)} className="w-full flex items-center justify-center space-x-2 px-4 py-2 mb-4 bg-white text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors">
                        <AppWindow className="w-4 h-4" />
                        <span>View & Assign Functions</span>
                    </button>
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
                  <div className="flex items-center space-x-2">
                    <button onClick={() => setShowBulkModal(true)} className="flex items-center space-x-2 px-4 py-2 bg-white text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors">
                      <Layers className="w-4 h-4" />
                      <span>Create in Bulk</span>
                    </button>
                    <button onClick={createDepartmentBucket} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      <Plus className="w-4 h-4" />
                      <span>Create Bucket</span>
                    </button>
                  </div>
                </div>
                {departmentBuckets.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed rounded-xl">
                    <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600">No Custom Buckets Yet</h3>
                    <p className="text-gray-500">Create buckets to start organizing functions.</p>
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
                            <span className="text-xs bg-white/50 px-2 py-1 rounded">{bucket.functions.length} funcs</span>
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
    </>
  );
};
