import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Target, Plus, Edit3, Trash2, User, ChevronsRight, Sparkles, Info } from 'lucide-react';
import { SeniorityBucket } from '../types';

interface SeniorityBucketingProps {
  onBack: () => void;
  onNext: (buckets: SeniorityBucket[]) => void;
  initialBuckets: SeniorityBucket[];
}

interface SeniorityLevel {
  id: string;
  name: string;
  color: string;
  icon: string;
}

const SENIORITY_LEVELS: SeniorityLevel[] = [
  { id: 'c-level', name: 'C-Level', color: 'bg-purple-100 border-purple-300 text-purple-800', icon: '👑' },
  { id: 'vp', name: 'VP', color: 'bg-blue-100 border-blue-300 text-blue-800', icon: '🎯' },
  { id: 'director', name: 'Director', color: 'bg-green-100 border-green-300 text-green-800', icon: '📊' },
  { id: 'manager', name: 'Manager', color: 'bg-orange-100 border-orange-300 text-orange-800', icon: '👥' },
  { id: 'individual', name: 'Individual Contributor', color: 'bg-gray-100 border-gray-300 text-gray-800', icon: '⚡' }
];

const BUCKET_COLORS = [
  'bg-purple-50 border-purple-200',
  'bg-blue-50 border-blue-200',
  'bg-green-50 border-green-200',
  'bg-orange-50 border-orange-200',
  'bg-gray-50 border-gray-200',
  'bg-pink-50 border-pink-200',
  'bg-indigo-50 border-indigo-200'
];

export const SeniorityBucketing: React.FC<SeniorityBucketingProps> = ({ onBack, onNext, initialBuckets }) => {
  const [buckets, setBuckets] = useState<SeniorityBucket[]>(initialBuckets);
  const [draggedLevel, setDraggedLevel] = useState<string | null>(null);
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

  const createBucket = () => {
    const newBucket: SeniorityBucket = {
      id: `bucket-${Date.now()}`,
      name: `Seniority Group ${buckets.length + 1}`,
      secondaryLabel: 'Custom Leadership Group',
      levels: [],
      color: BUCKET_COLORS[buckets.length % BUCKET_COLORS.length]
    };
    setBuckets([...buckets, newBucket]);
    setEditingBucket(newBucket.id);
    setEditName(newBucket.name);
    setEditLabel(newBucket.secondaryLabel);
  };

  const createFromDefault = () => {
    const defaultBuckets = SENIORITY_LEVELS.map((level, index) => ({
      id: `default-${level.id}`,
      name: level.name,
      secondaryLabel: `All ${level.name} roles`,
      levels: [level.id],
      color: BUCKET_COLORS[index % BUCKET_COLORS.length],
    }));
    setBuckets(defaultBuckets);
    setEditingBucket(null); // Ensure we're not in edit mode
  };

  const deleteBucket = (bucketId: string) => {
    setBuckets(buckets.filter(b => b.id !== bucketId));
  };

  const updateBucket = (bucketId: string, updates: Partial<SeniorityBucket>) => {
    setBuckets(buckets.map(bucket => 
      bucket.id === bucketId ? { ...bucket, ...updates } : bucket
    ));
  };

  const handleDragStart = (levelId: string) => {
    setDraggedLevel(levelId);
  };

  const handleDragEnd = () => {
    setDraggedLevel(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (bucketId: string, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedLevel) return;

    const bucket = buckets.find(b => b.id === bucketId);
    if (!bucket) return;

    // Remove from other buckets if it exists
    const updatedBuckets = buckets.map(b => ({
      ...b,
      levels: b.levels.filter(l => l !== draggedLevel)
    }));
    
    // Add to the target bucket if it's not already there
    const targetB = updatedBuckets.find(b => b.id === bucketId);
    if (targetB && !targetB.levels.includes(draggedLevel)) {
      targetB.levels.push(draggedLevel);
    }
    
    setBuckets(updatedBuckets);
  };


  const removeLevelFromBucket = (bucketId: string, levelId: string) => {
    const bucket = buckets.find(b => b.id === bucketId);
    if (!bucket) return;

    updateBucket(bucketId, {
      levels: bucket.levels.filter(l => l !== levelId)
    });
  };

  const startEditing = (bucket: SeniorityBucket) => {
    setEditingBucket(bucket.id);
    setEditName(bucket.name);
    setEditLabel(bucket.secondaryLabel);
  };

  const saveEditing = (bucketId: string) => {
    updateBucket(bucketId, { name: editName, secondaryLabel: editLabel });
    setEditingBucket(null);
  };

  const cancelEditing = () => {
    setEditingBucket(null);
  };
  
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, bucketId: string) => {
    if (e.key === 'Enter') {
      saveEditing(bucketId);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Step 1: Seniority Buckets</h1>
                <p className="text-gray-600">Create custom groupings of leadership levels</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => onNext(buckets)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-blue-300 disabled:cursor-not-allowed"
                disabled={buckets.length === 0}
              >
                <span>Next Step: Functions</span>
                <ChevronsRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded-r-lg flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
                <h3 className="font-bold text-blue-800">What to Do Here</h3>
                <p className="text-blue-700">Drag the standard seniority levels from the left library into your own custom buckets on the right. This allows you to create groupings that match how your organization thinks about seniority (e.g., a bucket for "Decision Makers" might include C-Level and VP).</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Seniority Levels
              </h2>
              <p className="text-sm text-gray-600 mb-6">Drag these levels into your custom buckets</p>
              <div className="space-y-3">
                {SENIORITY_LEVELS.map((level) => (
                  <div
                    key={level.id}
                    draggable
                    onDragStart={() => handleDragStart(level.id)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-move transition-all duration-200 hover:shadow-md ${level.color} ${draggedLevel === level.id ? 'opacity-50 scale-95' : ''}`}
                  >
                    <span className="text-lg mr-3">{level.icon}</span>
                    <div className="font-semibold text-sm flex-1">{level.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">Your Custom Seniority Buckets</h2>
                <div className="flex items-center space-x-2">
                  <button onClick={createFromDefault} className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    <Sparkles className="w-4 h-4" />
                    <span>Create from Default</span>
                  </button>
                  <button onClick={createBucket} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Create Custom</span>
                  </button>
                </div>
              </div>

              {buckets.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
                  <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Seniority Buckets Yet</h3>
                  <p className="text-gray-500">Create buckets manually or use the "Create from Default" option to start.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {buckets.map((bucket) => (
                    <div
                      key={bucket.id}
                      className={`p-6 rounded-xl border-2 border-dashed transition-all duration-200 ${bucket.color} min-h-48`}
                      onDrop={(e) => handleDrop(bucket.id, e)}
                      onDragOver={handleDragOver}
                    >
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
                          <button onClick={() => startEditing(bucket)} className="p-2 hover:bg-white/50 rounded-lg"><Edit3 className="w-4 h-4 text-gray-600" /></button>
                          <button onClick={() => deleteBucket(bucket.id)} className="p-2 hover:bg-red-100 rounded-lg"><Trash2 className="w-4 h-4 text-red-600" /></button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {bucket.levels.length === 0 ? (
                          <p className="text-gray-400 text-center py-8 italic">Drag levels here</p>
                        ) : (
                          bucket.levels.map((levelId) => {
                            const level = SENIORITY_LEVELS.find(l => l.id === levelId);
                            if (!level) return null;
                            return (
                              <div key={levelId} className={`flex items-center justify-between p-3 rounded-lg border-2 ${level.color}`}>
                                <div className="flex items-center"><span className="text-lg mr-3">{level.icon}</span><span className="font-semibold text-sm">{level.name}</span></div>
                                <button onClick={() => removeLevelFromBucket(bucket.id, levelId)} className="p-1 hover:bg-red-100 rounded"><Trash2 className="w-3 h-3 text-red-600" /></button>
                              </div>
                            );
                          })
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
