import React, { useState } from 'react';
import { ArrowLeft, UserCheck, Plus, Edit3, Trash2, Check, X } from 'lucide-react';
import { SeniorityBucket } from './SeniorityBucketing';
import { DepartmentBucket } from './DepartmentTeamOrganization';

interface PersonaCreationProps {
  onBack: () => void;
  seniorityBuckets: SeniorityBucket[];
  departmentBuckets: DepartmentBucket[];
}

interface PersonaBucket {
  id: string;
  name: string;
  seniorityBucketId: string | null;
  departmentBucketId: string | null;
}

export const PersonaCreation: React.FC<PersonaCreationProps> = ({ onBack, seniorityBuckets, departmentBuckets }) => {
  const [personaBuckets, setPersonaBuckets] = useState<PersonaBucket[]>([]);
  const [editingBucket, setEditingBucket] = useState<PersonaBucket | null>(null);

  const createPersonaBucket = () => {
    const newBucket: PersonaBucket = {
      id: `persona-${Date.now()}`,
      name: `New Persona ${personaBuckets.length + 1}`,
      seniorityBucketId: null,
      departmentBucketId: null,
    };
    setPersonaBuckets([...personaBuckets, newBucket]);
    setEditingBucket(newBucket);
  };

  const updateEditingBucket = (updates: Partial<PersonaBucket>) => {
    if (editingBucket) {
      setEditingBucket({ ...editingBucket, ...updates });
    }
  };

  const saveEditingBucket = () => {
    if (editingBucket) {
      setPersonaBuckets(personaBuckets.map(b => b.id === editingBucket.id ? editingBucket : b));
    }
    setEditingBucket(null);
  };

  const cancelEditing = () => {
    setEditingBucket(null);
    // If the bucket was just created and is still empty, remove it
    setPersonaBuckets(prev => prev.filter(b => b.id !== editingBucket?.id || b.seniorityBucketId || b.departmentBucketId));
  };

  const deletePersonaBucket = (id: string) => {
    setPersonaBuckets(personaBuckets.filter(b => b.id !== id));
  };
  
  const getSeniorityBucketName = (id: string | null) => seniorityBuckets.find(b => b.id === id)?.name || 'Not Set';
  const getDepartmentBucketName = (id: string | null) => departmentBuckets.find(b => b.id === id)?.name || 'Not Set';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Step 3: Persona Creation</h1>
                <p className="text-gray-600">Combine your buckets to define target personas</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed">
              Finish
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bucket Libraries */}
          <div className="lg:col-span-1 space-y-8">
            {/* Seniority Buckets */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Your Seniority Buckets</h2>
              <div className="space-y-2">
                {seniorityBuckets.length > 0 ? seniorityBuckets.map(b => (
                  <div key={b.id} className={`p-3 rounded-lg border-2 ${b.color.replace('bg-', 'border-')}`}>{b.name}</div>
                )) : <p className="text-gray-500 italic">No seniority buckets created.</p>}
              </div>
            </div>
            {/* Function Buckets */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Your Function Buckets</h2>
              <div className="space-y-2">
                {departmentBuckets.length > 0 ? departmentBuckets.map(b => (
                  <div key={b.id} className={`p-3 rounded-lg border-2 ${b.color.replace('bg-', 'border-')}`}>{b.name}</div>
                )) : <p className="text-gray-500 italic">No function buckets created.</p>}
              </div>
            </div>
          </div>

          {/* Persona Canvas */}
          <div className="lg:col-span-2 bg-white rounded-xl border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Your Custom Persona Buckets</h2>
              <button onClick={createPersonaBucket} className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                <Plus className="w-4 h-4" />
                <span>Create Persona</span>
              </button>
            </div>

            <div className="space-y-4">
              {personaBuckets.map(bucket => (
                editingBucket?.id === bucket.id ? (
                  // Editing State
                  <div key={bucket.id} className="p-4 bg-orange-50 border-2 border-dashed border-orange-200 rounded-lg">
                    <input type="text" value={editingBucket.name} onChange={e => updateEditingBucket({ name: e.target.value })} className="text-lg font-bold w-full p-2 border rounded mb-4" />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-sm mb-1 block">Seniority Group</label>
                        <select value={editingBucket.seniorityBucketId || ''} onChange={e => updateEditingBucket({ seniorityBucketId: e.target.value })} className="w-full p-2 border rounded">
                          <option value="">Select...</option>
                          {seniorityBuckets.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-sm mb-1 block">Function Group</label>
                        <select value={editingBucket.departmentBucketId || ''} onChange={e => updateEditingBucket({ departmentBucketId: e.target.value })} className="w-full p-2 border rounded">
                          <option value="">Select...</option>
                          {departmentBuckets.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button onClick={cancelEditing} className="p-2 hover:bg-gray-200 rounded"><X className="w-5 h-5 text-gray-600" /></button>
                      <button onClick={saveEditingBucket} className="p-2 bg-green-500 hover:bg-green-600 rounded"><Check className="w-5 h-5 text-white" /></button>
                    </div>
                  </div>
                ) : (
                  // Display State
                  <div key={bucket.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{bucket.name}</h3>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Seniority:</span> {getSeniorityBucketName(bucket.seniorityBucketId)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Function:</span> {getDepartmentBucketName(bucket.departmentBucketId)}
                      </p>
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
      </div>
    </div>
  );
};
