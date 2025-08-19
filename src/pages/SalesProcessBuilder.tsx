import React, { useState } from 'react';
import { ArrowLeft, ChevronsRight, Plus, Edit3, Trash2, ChevronDown, Check, X } from 'lucide-react';
import { SalesStage } from '../types';

interface SalesProcessBuilderProps {
  onBack: () => void;
  onNext: (stages: SalesStage[]) => void;
  initialStages: SalesStage[];
}

const MOCKED_ASSETS = {
  "Strategy Assets": ["Competitive Analysis", "Market Research Report", "Ideal Customer Profile"],
  "Sales Assets": ["Discovery Call Script", "Product Demo Deck", "ROI Calculator", "Negotiation Guide"],
  "Marketing Assets": ["Case Study - Enterprise", "Case Study - SMB", "Whitepaper - Industry Trends", "Webinar Recording"],
  "Oliver Assets (AI)": ["AI-Generated Email Template", "AI Persona Insights", "AI-Generated Call Script"],
};

const EditStageModal = ({ stage, onSave, onCancel }: { stage: SalesStage, onSave: (stage: SalesStage) => void, onCancel: () => void }) => {
  const [editedStage, setEditedStage] = useState(stage);

  const handleAssetToggle = (asset: string) => {
    const newAssets = new Set(editedStage.linkedAssets);
    if (newAssets.has(asset)) newAssets.delete(asset);
    else newAssets.add(asset);
    setEditedStage({ ...editedStage, linkedAssets: Array.from(newAssets) });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl h-[90vh] flex flex-col">
        <div className="p-6 border-b"><h2 className="text-2xl font-bold text-gray-800">Edit Sales Stage</h2></div>
        <div className="p-6 flex-grow overflow-y-auto space-y-4">
          <div><label className="font-semibold">Stage Name</label><input type="text" value={editedStage.name} onChange={e => setEditedStage({...editedStage, name: e.target.value})} className="w-full p-2 border rounded-lg mt-1" /></div>
          <div><label className="font-semibold">Stage Description (Buyer's Perspective)</label><textarea value={editedStage.description} onChange={e => setEditedStage({...editedStage, description: e.target.value})} rows={3} className="w-full p-2 border rounded-lg mt-1" /></div>
          <div><label className="font-semibold">Exit Criteria (Measurable)</label><textarea value={editedStage.exitCriteria} onChange={e => setEditedStage({...editedStage, exitCriteria: e.target.value})} rows={3} className="w-full p-2 border rounded-lg mt-1" /></div>
          <div><label className="font-semibold">Required Activities</label><textarea value={editedStage.requiredActivities} onChange={e => setEditedStage({...editedStage, requiredActivities: e.target.value})} rows={3} className="w-full p-2 border rounded-lg mt-1" placeholder="Supports Markdown for lists, etc." /></div>
          <div><label className="font-semibold">Training Requirements</label><textarea value={editedStage.trainingRequirements} onChange={e => setEditedStage({...editedStage, trainingRequirements: e.target.value})} rows={3} className="w-full p-2 border rounded-lg mt-1" placeholder="Supports Markdown" /></div>
          <div>
            <label className="font-semibold block mb-2">Linked Assets</label>
            <div className="space-y-2">
              {Object.entries(MOCKED_ASSETS).map(([category, assets]) => (
                <details key={category} className="border rounded-lg p-2">
                  <summary className="font-medium cursor-pointer">{category}</summary>
                  <div className="grid grid-cols-2 gap-2 p-2">
                    {assets.map(asset => <label key={asset} className="flex items-center space-x-2"><input type="checkbox" checked={editedStage.linkedAssets.includes(asset)} onChange={() => handleAssetToggle(asset)} /><span>{asset}</span></label>)}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 border-t flex justify-end space-x-2"><button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button><button onClick={() => onSave(editedStage)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save Stage</button></div>
      </div>
    </div>
  );
};

export const SalesProcessBuilder: React.FC<SalesProcessBuilderProps> = ({ onBack, onNext, initialStages }) => {
  const [stages, setStages] = useState<SalesStage[]>(initialStages);
  const [editingStage, setEditingStage] = useState<SalesStage | null>(null);
  const [expandedStageIds, setExpandedStageIds] = useState<Set<string>>(new Set());

  const addStage = () => {
    const newStage: SalesStage = { id: `stage-${Date.now()}`, name: `New Stage ${stages.length + 1}`, description: '', exitCriteria: '', requiredActivities: '', trainingRequirements: '', linkedAssets: [] };
    setStages([...stages, newStage]);
    setEditingStage(newStage);
  };

  const handleSaveStage = (stageToSave: SalesStage) => {
    setStages(stages.map(s => s.id === stageToSave.id ? stageToSave : s));
    setEditingStage(null);
  };

  const deleteStage = (id: string) => setStages(stages.filter(s => s.id !== id));

  const toggleStageExpansion = (id: string) => {
    const newSet = new Set(expandedStageIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedStageIds(newSet);
  };
  
  const defaultStages = [
      { name: "Problem Awareness", desc: "Buyer realizes they have a problem and begins researching its impact." },
      { name: "Solution Research", desc: "Buyer defines their problem and researches potential solution categories." },
      { name: "Vendor Evaluation", desc: "Buyer actively compares different solutions and vendors." },
      { name: "Decision Making", desc: "Buyer has a preferred vendor and is building a business case for internal approval." },
      { name: "Contract Negotiation", desc: "Buyer is working through final approvals and negotiations." },
  ];
  
  const createDefaultStages = () => {
    const newStages = defaultStages.map((s, i) => ({
        id: `stage-default-${i}`, name: s.name, description: s.desc, exitCriteria: '', requiredActivities: '', trainingRequirements: '', linkedAssets: []
    }));
    setStages(newStages);
  };

  return (
    <>
      {editingStage && <EditStageModal stage={editingStage} onSave={handleSaveStage} onCancel={() => setEditingStage(null)} />}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-600 rounded-xl flex items-center justify-center"><i className="text-white">...</i></div>
                <div><h1 className="text-2xl font-bold text-gray-900">Step 8: Structured Sales Process</h1><p className="text-gray-600">Define your buyer journey sales stages</p></div>
              </div>
              <button onClick={() => onNext(stages)} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"><span>Next: Diagnostics</span><ChevronsRight className="w-5 h-5" /></button>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Buyer Journey Stages</h2>
            <div className="flex space-x-2">
                <button onClick={createDefaultStages} className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">Use Default Stages</button>
                <button onClick={addStage} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={16}/><span>Add Stage</span></button>
            </div>
          </div>

          <div className="space-y-4">
            {stages.map((stage, index) => {
              const isExpanded = expandedStageIds.has(stage.id);
              return (
                <div key={stage.id} className="bg-white rounded-xl border shadow-sm">
                  <div className="flex items-center p-4">
                    <div className="text-xl font-bold text-blue-600 w-10">{index + 1}</div>
                    <div className="flex-grow"><h3 className="text-xl font-bold text-gray-800">{stage.name}</h3><p className="text-sm text-gray-500">{stage.description}</p></div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => setEditingStage(stage)} className="p-2 hover:bg-gray-100 rounded-lg"><Edit3 size={16}/></button>
                      <button onClick={() => deleteStage(stage.id)} className="p-2 hover:bg-red-100 rounded-lg"><Trash2 size={16} className="text-red-600"/></button>
                      <button onClick={() => toggleStageExpansion(stage.id)} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronDown className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} /></button>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="border-t p-6 space-y-4 text-sm bg-gray-50">
                        <div><h4 className="font-semibold">Exit Criteria</h4><p className="whitespace-pre-wrap">{stage.exitCriteria || "Not defined."}</p></div>
                        <div><h4 className="font-semibold">Required Activities</h4><p className="whitespace-pre-wrap">{stage.requiredActivities || "Not defined."}</p></div>
                        <div><h4 className="font-semibold">Training Requirements</h4><p className="whitespace-pre-wrap">{stage.trainingRequirements || "Not defined."}</p></div>
                        <div><h4 className="font-semibold">Linked Assets</h4>{stage.linkedAssets.length > 0 ? <div className="flex flex-wrap gap-2 mt-1">{stage.linkedAssets.map(a => <span key={a} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{a}</span>)}</div> : <p>None.</p>}</div>
                    </div>
                  )}
                </div>
              );
            })}
             {stages.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-600">No Sales Stages Yet</h3>
                    <p className="text-gray-500">Add your first stage or use a default template to begin.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
