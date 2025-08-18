import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Briefcase, Plus, Edit3, Trash2, X, Check, ChevronsRight } from 'lucide-react';
import { AccountSegment } from '../types';

interface AccountSegmentationProps {
  onBack: () => void;
  onNext: (segments: AccountSegment[]) => void;
  initialSegments: AccountSegment[];
}

const DEFAULT_INDUSTRIES = ["Technology", "Healthcare", "Finance", "Manufacturing", "Retail", "Education", "Real Estate", "Professional Services"];
const EMPLOYEE_BANDS = ["1-10", "11-50", "51-200", "201-1,000", "1,001-5,000", "5,001+"];
const REVENUE_BANDS = ["<$1M", "$1M-$10M", "$10M-$50M", "$50M-$250M", "$250M+"];

const EditSegmentModal = ({
  segment,
  onSave,
  onCancel,
}: {
  segment: AccountSegment;
  onSave: (segment: AccountSegment) => void;
  onCancel: () => void;
}) => {
  const [editedSegment, setEditedSegment] = useState(segment);
  const [customIndustry, setCustomIndustry] = useState('');

  const toggleSelection = (key: keyof AccountSegment, value: string) => {
    const currentValues = editedSegment[key] as string[];
    const newValues = new Set(currentValues);
    if (newValues.has(value)) newValues.delete(value);
    else newValues.add(value);
    setEditedSegment({ ...editedSegment, [key]: Array.from(newValues) });
  };
  
  const addCustomIndustry = () => {
    if (customIndustry && !editedSegment.industries.includes(customIndustry)) {
        setEditedSegment({...editedSegment, industries: [...editedSegment.industries, customIndustry]});
        setCustomIndustry('');
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Account Segment</h2>
          <div className="space-y-6">
            <div>
              <label className="font-semibold text-gray-700">Segment Name</label>
              <input type="text" value={editedSegment.name} onChange={e => setEditedSegment({...editedSegment, name: e.target.value})} className="w-full p-2 border rounded-lg mt-1" />
            </div>
            {/* Industries */}
            <div>
                <label className="font-semibold text-gray-700">Industries</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                    {DEFAULT_INDUSTRIES.map(ind => (
                        <label key={ind} className="flex items-center space-x-2"><input type="checkbox" checked={editedSegment.industries.includes(ind)} onChange={() => toggleSelection('industries', ind)}/><span>{ind}</span></label>
                    ))}
                </div>
                <div className="flex items-center space-x-2 mt-2">
                    <input type="text" value={customIndustry} onChange={e => setCustomIndustry(e.target.value)} placeholder="Add custom industry..." className="flex-grow p-2 border rounded-lg" />
                    <button onClick={addCustomIndustry} className="px-4 py-2 bg-gray-200 rounded-lg">Add</button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {editedSegment.industries.filter(i => !DEFAULT_INDUSTRIES.includes(i)).map(ind => (
                        <span key={ind} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm flex items-center">{ind} <button onClick={() => toggleSelection('industries', ind)} className="ml-1"><X size={14}/></button></span>
                    ))}
                </div>
            </div>
            {/* Employee/Revenue Bands */}
            <div><label className="font-semibold text-gray-700">Employee Count</label><div className="grid grid-cols-3 gap-2 mt-2">{EMPLOYEE_BANDS.map(band => (<label key={band} className="flex items-center space-x-2"><input type="checkbox" checked={editedSegment.employeeCounts.includes(band)} onChange={() => toggleSelection('employeeCounts', band)}/><span>{band}</span></label>))}</div></div>
            <div><label className="font-semibold text-gray-700">Annual Revenue</label><div className="grid grid-cols-3 gap-2 mt-2">{REVENUE_BANDS.map(band => (<label key={band} className="flex items-center space-x-2"><input type="checkbox" checked={editedSegment.revenueBands.includes(band)} onChange={() => toggleSelection('revenueBands', band)}/><span>{band}</span></label>))}</div></div>

          </div>
          <div className="flex justify-end space-x-3 mt-8">
            <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
            <button onClick={() => onSave(editedSegment)} className="px-4 py-2 bg-yellow-500 text-white rounded-lg">Save Segment</button>
          </div>
        </div>
      </div>
    </div>
  );
};


export const AccountSegmentation: React.FC<AccountSegmentationProps> = ({ onBack, onNext, initialSegments }) => {
  const [segments, setSegments] = useState<AccountSegment[]>(initialSegments);
  const [editingSegment, setEditingSegment] = useState<AccountSegment | null>(null);

  const createSegment = () => {
    const newSegment: AccountSegment = {
      id: `acct-${Date.now()}`,
      name: `New Segment ${segments.length + 1}`,
      industries: [],
      employeeCounts: [],
      revenueBands: [],
    };
    setEditingSegment(newSegment);
  };
  
  const handleSaveSegment = (segmentToSave: AccountSegment) => {
    const exists = segments.some(s => s.id === segmentToSave.id);
    if(exists) {
        setSegments(segments.map(s => s.id === segmentToSave.id ? segmentToSave : s));
    } else {
        setSegments([...segments, segmentToSave]);
    }
    setEditingSegment(null);
  }

  const deleteSegment = (id: string) => {
    setSegments(segments.filter(s => s.id !== id));
  }

  return (
    <>
    {editingSegment && <EditSegmentModal segment={editingSegment} onSave={handleSaveSegment} onCancel={() => setEditingSegment(null)} />}
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center"><Briefcase className="w-6 h-6 text-white" /></div>
              <div><h1 className="text-2xl font-bold text-gray-900">Step 4: Account Segments</h1><p className="text-gray-600">Define your target company profiles</p></div>
            </div>
            <button onClick={() => onNext(segments)} disabled={segments.length === 0} className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold disabled:bg-yellow-300 disabled:cursor-not-allowed"><span>Next Step: ICP Groups</span><ChevronsRight className="w-5 h-5" /></button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Account Segments</h2>
          <button onClick={createSegment} className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"><Plus className="w-4 h-4" /><span>Create Segment</span></button>
        </div>

        {segments.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-xl">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">No Account Segments Yet</h3>
            <p className="text-gray-500">Create your first segment to define a group of target accounts.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {segments.map(segment => (
              <div key={segment.id} className="bg-white rounded-xl border p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">{segment.name}</h3>
                  <div className="space-y-3 text-sm">
                    <div><span className="font-semibold">Industries:</span> {segment.industries.join(', ') || 'Any'}</div>
                    <div><span className="font-semibold">Employees:</span> {segment.employeeCounts.join(', ') || 'Any'}</div>
                    <div><span className="font-semibold">Revenue:</span> {segment.revenueBands.join(', ') || 'Any'}</div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button onClick={() => setEditingSegment(segment)} className="p-2 hover:bg-gray-100 rounded-lg"><Edit3 className="w-4 h-4 text-gray-600" /></button>
                  <button onClick={() => deleteSegment(segment.id)} className="p-2 hover:bg-red-100 rounded-lg"><Trash2 className="w-4 h-4 text-red-600" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};
