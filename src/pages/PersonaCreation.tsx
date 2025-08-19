import React, { useState, useEffect } from 'react';
import { ArrowLeft, UserCheck, Plus, Edit3, Trash2, Check, X, Sparkles, ChevronsRight, FileText, FileSymlink, Edit } from 'lucide-react';
import { SeniorityBucket, DepartmentBucket, PersonaBucket } from '../types';

interface PersonaCreationProps {
  onBack: () => void;
  onNext: (personas: PersonaBucket[]) => void;
  seniorityBuckets: SeniorityBucket[];
  departmentBuckets: DepartmentBucket[];
  initialPersonas: PersonaBucket[];
}

type NamingConvention = 'seniority_first' | 'function_first' | 'custom';
type PersonaCreationStep = 'naming_convention' | 'auto_generate_prompt' | 'manual_create';

const AutoGenerateSelector = ({
  seniorityBuckets,
  departmentBuckets,
  onGenerate,
  onCancel,
}: {
  seniorityBuckets: SeniorityBucket[];
  departmentBuckets: DepartmentBucket[];
  onGenerate: (selectedSeniority: string[], selectedFunctions: string[]) => void;
  onCancel: () => void;
}) => {
  const [selectedSeniorityIds, setSelectedSeniorityIds] = useState<Set<string>>(new Set());
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string, type: 'seniority' | 'function') => {
    const newSet = type === 'seniority' ? new Set(selectedSeniorityIds) : new Set(selectedDepartmentIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    if (type === 'seniority') setSelectedSeniorityIds(newSet);
    else setSelectedDepartmentIds(newSet);
  };
  
  const combinations = selectedSeniorityIds.size * selectedDepartmentIds.size;

  return (
    <div className="bg-white rounded-xl border p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Bulk-Create Personas</h2>
      <p className="text-gray-600 mb-6">Select the buckets you want to combine. We will create a persona for every possible combination.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Seniority Buckets</h3>
          <div className="space-y-2 p-4 border rounded-lg max-h-64 overflow-y-auto">
            {seniorityBuckets.map(bucket => (
              <label key={bucket.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <input type="checkbox" checked={selectedSeniorityIds.has(bucket.id)} onChange={() => toggleSelection(bucket.id, 'seniority')} className="h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                <span>{bucket.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">Function Buckets</h3>
          <div className="space-y-2 p-4 border rounded-lg max-h-64 overflow-y-auto">
            {departmentBuckets.map(bucket => (
              <label key={bucket.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <input type="checkbox" checked={selectedDepartmentIds.has(bucket.id)} onChange={() => toggleSelection(bucket.id, 'function')} className="h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                <span>{bucket.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <button onClick={onCancel} className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">
          Skip for Now
        </button>
        <button 
          onClick={() => onGenerate(Array.from(selectedSeniorityIds), Array.from(selectedDepartmentIds))}
          disabled={combinations === 0}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold disabled:bg-red-300 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Sparkles className="w-5 h-5"/>
          <span>Generate {combinations > 0 ? combinations : ''} Personas</span>
        </button>
      </div>
    </div>
  );
};


export const PersonaCreation: React.FC<PersonaCreationProps> = ({ onBack, onNext, seniorityBuckets, departmentBuckets, initialPersonas }) => {
  const [personaBuckets, setPersonaBuckets] = useState<PersonaBucket[]>(initialPersonas);
  const [editingBucket, setEditingBucket] = useState<PersonaBucket | null>(null);
  const [namingConvention, setNamingConvention] = useState<NamingConvention | null>(null);
  const [step, setStep] = useState<PersonaCreationStep>('naming_convention');


  const getSeniorityBucketName = (id: string | null) => seniorityBuckets.find(b => b.id === id)?.name || 'Not Set';
  const getDepartmentBucketName = (id: string | null) => departmentBuckets.find(b => b.id === id)?.name || 'Not Set';

  useEffect(() => {
    if (editingBucket && namingConvention !== 'custom') {
      const seniorityName = getSeniorityBucketName(editingBucket.seniorityBucketId);
      const functionName = getDepartmentBucketName(editingBucket.departmentBucketId);
      
      let newName = editingBucket.name;
      if (editingBucket.seniorityBucketId && editingBucket.departmentBucketId) {
        if (namingConvention === 'seniority_first') {
          newName = `${seniorityName} - ${functionName}`;
        } else if (namingConvention === 'function_first') {
          newName = `${functionName} - ${seniorityName}`;
        }
      }
      updateEditingBucket({ name: newName });
    }
  }, [editingBucket?.seniorityBucketId, editingBucket?.departmentBucketId, namingConvention]);

  const handleConventionSelected = (convention: NamingConvention) => {
    setNamingConvention(convention);
    setStep('auto_generate_prompt');
  };

  const handleBulkGenerate = (selectedSeniority: string[], selectedFunctions: string[]) => {
    const newPersonas: PersonaBucket[] = [];
    selectedSeniority.forEach(seniorityId => {
      selectedFunctions.forEach(functionId => {
        const seniorityBucket = seniorityBuckets.find(b => b.id === seniorityId);
        const departmentBucket = departmentBuckets.find(b => b.id === functionId);
        if (seniorityBucket && departmentBucket) {
          let name = 'Custom Persona';
           if (namingConvention === 'seniority_first') name = `${seniorityBucket.name} - ${departmentBucket.name}`;
           else if (namingConvention === 'function_first') name = `${departmentBucket.name} - ${seniorityBucket.name}`;
          newPersonas.push({ id: `persona-${seniorityId}-${functionId}`, name, seniorityBucketId: seniorityId, departmentBucketId: functionId });
        }
      });
    });
    setPersonaBuckets(prev => [...prev.filter(p => !newPersonas.some(np => np.id === p.id)), ...newPersonas]);
    setStep('manual_create');
  };

  const createPersonaBucket = () => {
    const newBucket: PersonaBucket = { id: `persona-${Date.now()}`, name: `New Persona ${personaBuckets.length + 1}`, seniorityBucketId: null, departmentBucketId: null };
    setPersonaBuckets([...personaBuckets, newBucket]);
    setEditingBucket(newBucket);
  };

  const updateEditingBucket = (updates: Partial<PersonaBucket>) => {
    if (editingBucket) setEditingBucket({ ...editingBucket, ...updates });
  };

  const saveEditingBucket = () => {
    if (editingBucket) setPersonaBuckets(personaBuckets.map(b => b.id === editingBucket.id ? editingBucket : b));
    setEditingBucket(null);
  };

  const cancelEditing = () => {
    if (editingBucket && (!editingBucket.seniorityBucketId || !editingBucket.departmentBucketId)) {
        setPersonaBuckets(prev => prev.filter(b => b.id !== editingBucket!.id));
    }
    setEditingBucket(null);
  };

  const deletePersonaBucket = (id: string) => setPersonaBuckets(personaBuckets.filter(b => b.id !== id));
  const resetFlow = () => setStep('naming_convention');

  const renderContent = () => {
    switch(step) {
      case 'naming_convention':
        return (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Persona Naming Convention</h2>
                <p className="text-gray-600">This determines how your personas will be named by default.</p>
            </div>
            <div className="space-y-4">
              <button onClick={() => handleConventionSelected('seniority_first')} className="w-full text-left p-6 border-2 rounded-xl hover:border-red-500 hover:bg-red-50 transition-colors group">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center"><FileText /></div>
                    <div>
                        <div className="font-bold text-lg text-gray-800 group-hover:text-red-800">[Seniority] - [Function]</div>
                        <div className="text-sm text-gray-500">e.g., "Executive - Go-to-Market"</div>
                    </div>
                </div>
              </button>
              <button onClick={() => handleConventionSelected('function_first')} className="w-full text-left p-6 border-2 rounded-xl hover:border-red-500 hover:bg-red-50 transition-colors group">
                 <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center"><FileSymlink /></div>
                    <div>
                        <div className="font-bold text-lg text-gray-800 group-hover:text-red-800">[Function] - [Seniority]</div>
                        <div className="text-sm text-gray-500">e.g., "Go-to-Market - Executive"</div>
                    </div>
                </div>
              </button>
              <button onClick={() => handleConventionSelected('custom')} className="w-full text-left p-6 border-2 rounded-xl hover:border-red-500 hover:bg-red-50 transition-colors group">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center"><Edit /></div>
                    <div>
                        <div className="font-bold text-lg text-gray-800 group-hover:text-red-800">Custom Names</div>
                        <div className="text-sm text-gray-500">Manually name each persona</div>
                    </div>
                </div>
              </button>
            </div>
          </div>
        );
      case 'auto_generate_prompt':
        return <AutoGenerateSelector seniorityBuckets={seniorityBuckets} departmentBuckets={departmentBuckets} onGenerate={handleBulkGenerate} onCancel={() => setStep('manual_create')} />;
      case 'manual_create':
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white rounded-xl border p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Your Seniority Buckets</h2>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {seniorityBuckets.length > 0 ? seniorityBuckets.map(b => (
                    <div key={b.id} className={`p-3 rounded-lg border-2 ${b.color.replace('bg-', 'border-')}`}>{b.name}</div>
                  )) : <p className="text-gray-500 italic">No buckets created.</p>}
                </div>
              </div>
              <div className="bg-white rounded-xl border p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Your Function Buckets</h2>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {departmentBuckets.length > 0 ? departmentBuckets.map(b => (
                    <div key={b.id} className={`p-3 rounded-lg border-2 ${b.color.replace('bg-', 'border-')}`}>{b.name}</div>
                  )) : <p className="text-gray-500 italic">No buckets created.</p>}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-800">Your Custom Persona Buckets</h2>
                <button onClick={createPersonaBucket} className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  <Plus className="w-4 h-4" />
                  <span>Create Persona</span>
                </button>
              </div>
              <button onClick={resetFlow} className="text-sm text-blue-600 hover:underline mb-6">Change naming convention</button>

              <div className="space-y-4">
                {personaBuckets.map(bucket => (
                  editingBucket?.id === bucket.id ? (
                    <div key={bucket.id} className="p-4 bg-orange-50 border-2 border-dashed border-orange-200 rounded-lg">
                      <input type="text" value={editingBucket.name} onChange={e => updateEditingBucket({ name: e.target.value })} disabled={namingConvention !== 'custom'} className="text-lg font-bold w-full p-2 border rounded mb-4 disabled:bg-gray-100" />
                      <div className="grid grid-cols-2 gap-4">
                        <select value={editingBucket.seniorityBucketId || ''} onChange={e => updateEditingBucket({ seniorityBucketId: e.target.value })} className="w-full p-2 border rounded"><option value="">Select Seniority...</option>{seniorityBuckets.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
                        <select value={editingBucket.departmentBucketId || ''} onChange={e => updateEditingBucket({ departmentBucketId: e.target.value })} className="w-full p-2 border rounded"><option value="">Select Function...</option>{departmentBuckets.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <button onClick={cancelEditing} className="p-2 hover:bg-gray-200 rounded"><X className="w-5 h-5 text-gray-600" /></button>
                        <button onClick={saveEditingBucket} className="p-2 bg-green-500 hover:bg-green-600 rounded"><Check className="w-5 h-5 text-white" /></button>
                      </div>
                    </div>
                  ) : (
                    <div key={bucket.id} className="p-4 bg-gray-50 border rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{bucket.name}</h3>
                        <p className="text-sm text-gray-600"><span className="font-semibold">Seniority:</span> {getSeniorityBucketName(bucket.seniorityBucketId)}</p>
                        <p className="text-sm text-gray-600"><span className="font-semibold">Function:</span> {getDepartmentBucketName(bucket.departmentBucketId)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => setEditingBucket(bucket)} className="p-2 hover:bg-gray-200 rounded-lg"><Edit3 className="w-4 h-4 text-gray-600" /></button>
                        <button onClick={() => deletePersonaBucket(bucket.id)} className="p-2 hover:bg-red-100 rounded-lg"><Trash2 className="w-4 h-4 text-red-600" /></button>
                      </div>
                    </div>
                  )
                ))}
                {personaBuckets.length === 0 && (
                  <div className="text-center py-16 border-2 border-dashed rounded-xl">
                    <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600">No Personas Yet</h3>
                    <p className="text-gray-500">Create your first persona by combining a seniority and function bucket.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center"><UserCheck className="w-6 h-6 text-white" /></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Step 3: Persona Creation</h1>
                <p className="text-gray-600">Combine your buckets to define target personas</p>
              </div>
            </div>
            <button onClick={() => onNext(personaBuckets)} disabled={personaBuckets.length === 0} className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold disabled:bg-red-300 disabled:cursor-not-allowed"><span>Next Step: Accounts</span><ChevronsRight className="w-5 h-5" /></button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {renderContent()}
      </div>
    </div>
  );
};
