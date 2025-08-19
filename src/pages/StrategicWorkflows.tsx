import React, { useState } from 'react';
import { ArrowLeft, ChevronsRight, Inbox, Calendar, Zap, Users, ListCollapse, HardDrive, Info } from 'lucide-react';
import { StrategicWorkflowSurvey } from '../types';

const TOP_LANGUAGES = ["English", "Spanish", "Mandarin", "Hindi", "French", "Arabic", "Bengali", "Russian", "Portuguese", "German"];

const initialSurveyState: StrategicWorkflowSurvey = {
  inbound: { contactsLeads: null, reliancePercentage: 50, aesAndSdrGetLeads: null, hasHighPriorityLeads: null, aesGetHighPriorityLeads: null, hasSpecialCampaigns: null },
  events: { usesEvents: null, teamsInviteAndFollowUp: null },
  tactics: { usesPhoneCalls: null, coldCallingImportance: 5, hasAutomatedEmailSequences: null },
  team: { aeCount: 0, sdrCount: 0, csmCount: 0, hasInternationalReps: null, prospectingLanguages: [], otherLanguages: '', supportRoleCount: 0 },
  sequences: { followUp: false, eventInvite: false, eventFollowUp: false, reEngage: false, nurture: false, expansion: false, renewal: false },
  systems: { salesEngagementPlatform: '', salesEngagementPlatformOther: '', outreachErrorLogs: '', conversationIntelligence: '', conversationIntelligenceOther: '', marketingAutomation: '', marketingAutomationOther: '', websiteConversionTools: [], websiteConversionToolsOther: '', dataSources: [], dataSourcesOther: '', aiIntegrations: [], aiIntegrationsOther: '', aiUseCases: '', automationTools: [], automationToolsOther: '' },
};

export const StrategicWorkflows: React.FC<{onBack: () => void; onNext: (data: StrategicWorkflowSurvey) => void;}> = ({ onBack, onNext }) => {
  const [survey, setSurvey] = useState<StrategicWorkflowSurvey>(initialSurveyState);

  const handleBoolChange = (category: 'inbound' | 'events' | 'tactics' | 'team', key: string, value: boolean | null) => {
    setSurvey(prev => ({ ...prev, [category]: { ...prev[category], [key]: value } }));
  };
  const handleSystemChange = (key: keyof StrategicWorkflowSurvey['systems'], value: any) => {
      setSurvey(prev => ({ ...prev, systems: { ...prev.systems, [key]: value }}));
  }
  const handleMultiSelect = (key: 'websiteConversionTools' | 'dataSources' | 'aiIntegrations' | 'automationTools', value: string) => {
    const newSet = new Set(survey.systems[key]);
    if (newSet.has(value)) newSet.delete(value);
    else newSet.add(value);
    handleSystemChange(key, Array.from(newSet));
  };
  const handleSequenceChange = (key: keyof StrategicWorkflowSurvey['sequences']) => {
    setSurvey(prev => ({ ...prev, sequences: { ...prev.sequences, [key]: !prev.sequences[key] } }));
  };
  const handleLanguageChange = (lang: string) => {
      const newLangs = new Set(survey.team.prospectingLanguages);
      if (newLangs.has(lang)) newLangs.delete(lang);
      else newLangs.add(lang);
      setSurvey(prev => ({...prev, team: {...prev.team, prospectingLanguages: Array.from(newLangs)}}));
  }

  const YesNoToggle = ({ value, onChange }: { value: boolean | null, onChange: (val: boolean) => void }) => (
    <div className="flex space-x-2">
      <button onClick={() => onChange(true)} className={`px-4 py-2 rounded-lg ${value === true ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Yes</button>
      <button onClick={() => onChange(false)} className={`px-4 py-2 rounded-lg ${value === false ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>No</button>
    </div>
  );
  
  const RadioGroup = ({ options, selected, onChange, name }: { options: string[], selected: string, onChange: (val: string) => void, name: string }) => (
      <div className="flex flex-wrap gap-x-4 gap-y-2">{options.map(opt => <label key={opt} className="flex items-center space-x-2"><input type="radio" name={name} value={opt} checked={selected === opt} onChange={e => onChange(e.target.value)} /><span>{opt}</span></label>)}</div>
  );
  const CheckboxGroup = ({ options, selected, onChange }: { options: string[], selected: string[], onChange: (val: string) => void }) => (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">{options.map(opt => <label key={opt} className="flex items-center space-x-2"><input type="checkbox" checked={selected.includes(opt)} onChange={() => onChange(opt)} /><span>{opt}</span></label>)}</div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center"><ListCollapse className="w-6 h-6 text-white" /></div>
              <div><h1 className="text-2xl font-bold text-gray-900">Step 7: GTM Survey</h1><p className="text-gray-600">Assess your organization's strategic focus</p></div>
            </div>
            <button onClick={() => onNext(survey)} className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-semibold"><span>Next: Sales Process</span><ChevronsRight className="w-5 h-5" /></button>
          </div>
        </div>
      </header>
      
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 mb-2 rounded-r-lg flex items-start space-x-3">
            <Info className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
            <div>
                <h3 className="font-bold text-cyan-800">What to Do Here</h3>
                <p className="text-cyan-700">Answer these questions to capture a snapshot of your current GTM motions, team structure, and technology stack. This information provides the necessary context for the diagnostic assessment in a later step.</p>
            </div>
        </div>
        
        {/* Inbound Motion */}
        <div className="bg-white rounded-xl border p-6 shadow-sm"><div className="flex items-center space-x-3 mb-4"><Inbox className="w-6 h-6 text-cyan-600" /><h2 className="text-xl font-bold text-gray-800">Inbound Motion Focus</h2></div><div className="space-y-4">
          <div className="flex justify-between items-center"><p>Do your teams contact inbound leads as part of prospecting?</p><YesNoToggle value={survey.inbound.contactsLeads} onChange={v => handleBoolChange('inbound', 'contactsLeads', v)} /></div>
          <div className="flex justify-between items-center"><p>How reliant is your team upon inbound to achieve quota attainment?</p><div className="flex items-center space-x-2"><input type="range" min="0" max="100" value={survey.inbound.reliancePercentage} onChange={e => setSurvey({...survey, inbound: {...survey.inbound, reliancePercentage: parseInt(e.target.value, 10)}})} className="w-48" /><span className="font-bold">{survey.inbound.reliancePercentage}%</span></div></div>
          <div className="flex justify-between items-center"><p>Do AEs and SDRs both get inbound leads?</p><YesNoToggle value={survey.inbound.aesAndSdrGetLeads} onChange={v => handleBoolChange('inbound', 'aesAndSdrGetLeads', v)} /></div>
          <div className="flex justify-between items-center"><p>Are there high-priority inbound leads (e.g., contact us)?</p><YesNoToggle value={survey.inbound.hasHighPriorityLeads} onChange={v => handleBoolChange('inbound', 'hasHighPriorityLeads', v)} /></div>
          {survey.inbound.hasHighPriorityLeads && <div className="flex justify-between items-center pl-8"><p>Do AEs get any high-priority inbound leads directly?</p><YesNoToggle value={survey.inbound.aesGetHighPriorityLeads} onChange={v => handleBoolChange('inbound', 'aesGetHighPriorityLeads', v)} /></div>}
          <div className="flex justify-between items-center"><p>Do you have other special campaigns that require special attention?</p><YesNoToggle value={survey.inbound.hasSpecialCampaigns} onChange={v => handleBoolChange('inbound', 'hasSpecialCampaigns', v)} /></div>
        </div></div>

        {/* Events Motion */}
        <div className="bg-white rounded-xl border p-6 shadow-sm"><div className="flex items-center space-x-3 mb-4"><Calendar className="w-6 h-6 text-cyan-600" /><h2 className="text-xl font-bold text-gray-800">Events Motion Focus</h2></div><div className="space-y-4">
          <div className="flex justify-between items-center"><p>Does your company attend or promote events?</p><YesNoToggle value={survey.events.usesEvents} onChange={v => handleBoolChange('events', 'usesEvents', v)} /></div>
          {survey.events.usesEvents && <div className="flex justify-between items-center pl-8"><p>Do your teams invite people to events and also do event follow-ups?</p><YesNoToggle value={survey.events.teamsInviteAndFollowUp} onChange={v => handleBoolChange('events', 'teamsInviteAndFollowUp', v)} /></div>}
        </div></div>

        {/* Tactics & Channels */}
        <div className="bg-white rounded-xl border p-6 shadow-sm"><div className="flex items-center space-x-3 mb-4"><Zap className="w-6 h-6 text-cyan-600" /><h2 className="text-xl font-bold text-gray-800">Tactics & Channels Focus</h2></div><div className="space-y-4">
          <div className="flex justify-between items-center"><p>Do your teams make phone calls as part of sales sequences?</p><YesNoToggle value={survey.tactics.usesPhoneCalls} onChange={v => handleBoolChange('tactics', 'usesPhoneCalls', v)} /></div>
          {survey.tactics.usesPhoneCalls && <div className="flex justify-between items-center pl-8"><p>How important is cold calling to your organization?</p><div className="flex items-center space-x-2"><input type="range" min="1" max="10" value={survey.tactics.coldCallingImportance} onChange={e => setSurvey({...survey, tactics: {...survey.tactics, coldCallingImportance: parseInt(e.target.value, 10)}})} className="w-48" /><span className="font-bold">{survey.tactics.coldCallingImportance}</span></div></div>}
          <div className="flex justify-between items-center"><p>Do you have high-volume automated email-only sequences?</p><YesNoToggle value={survey.tactics.hasAutomatedEmailSequences} onChange={v => handleBoolChange('tactics', 'hasAutomatedEmailSequences', v)} /></div>
        </div></div>
        
        {/* Team & Operations */}
        <div className="bg-white rounded-xl border p-6 shadow-sm"><div className="flex items-center space-x-3 mb-4"><Users className="w-6 h-6 text-cyan-600" /><h2 className="text-xl font-bold text-gray-800">Team & Operations Focus</h2></div><div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div><label className="block font-semibold">How many AEs use your sales engagement tool?</label><input type="number" min="0" value={survey.team.aeCount} onChange={e => setSurvey({...survey, team: {...survey.team, aeCount: parseInt(e.target.value, 10)}})} className="w-full p-2 border rounded-lg mt-1"/></div>
                <div><label className="block font-semibold">How many SDRs use your sales engagement tool?</label><input type="number" min="0" value={survey.team.sdrCount} onChange={e => setSurvey({...survey, team: {...survey.team, sdrCount: parseInt(e.target.value, 10)}})} className="w-full p-2 border rounded-lg mt-1"/></div>
                <div><label className="block font-semibold">How many CSMs use your sales engagement tool?</label><input type="number" min="0" value={survey.team.csmCount} onChange={e => setSurvey({...survey, team: {...survey.team, csmCount: parseInt(e.target.value, 10)}})} className="w-full p-2 border rounded-lg mt-1"/></div>
                <div><label className="block font-semibold">Supporting Roles (Ops, Enablement)?</label><input type="number" min="0" value={survey.team.supportRoleCount} onChange={e => setSurvey({...survey, team: {...survey.team, supportRoleCount: parseInt(e.target.value, 10)}})} className="w-full p-2 border rounded-lg mt-1"/></div>
            </div>
            <div className="flex justify-between items-center"><p>Do you have reps located in international locations?</p><YesNoToggle value={survey.team.hasInternationalReps} onChange={v => handleBoolChange('team', 'hasInternationalReps', v)} /></div>
            <div><label className="block font-semibold mb-2">How many languages do your teams prospect in?</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">{TOP_LANGUAGES.map(lang => <label key={lang} className="flex items-center space-x-2"><input type="checkbox" checked={survey.team.prospectingLanguages.includes(lang)} onChange={() => handleLanguageChange(lang)}/><span>{lang}</span></label>)}</div>
                <input type="text" value={survey.team.otherLanguages} onChange={e => setSurvey({...survey, team: {...survey.team, otherLanguages: e.target.value}})} placeholder="Other languages (comma separated)..." className="w-full p-2 border rounded-lg mt-2"/>
            </div>
        </div></div>

        {/* Systems & Processes */}
        <div className="bg-white rounded-xl border p-6 shadow-sm"><div className="flex items-center space-x-3 mb-4"><HardDrive className="w-6 h-6 text-cyan-600" /><h2 className="text-xl font-bold text-gray-800">Systems & Processes</h2></div><div className="space-y-6">
          <div><label className="font-semibold block mb-2">What is your primary sales engagement platform?</label><RadioGroup name="sep" options={['Outreach', 'SalesLoft', 'Apollo', 'Groove', 'Mixmax', 'None', 'Other']} selected={survey.systems.salesEngagementPlatform} onChange={v => handleSystemChange('salesEngagementPlatform', v)} />{survey.systems.salesEngagementPlatform === 'Other' && <input type="text" value={survey.systems.salesEngagementPlatformOther} onChange={e=>handleSystemChange('salesEngagementPlatformOther', e.target.value)} placeholder="Specify other platform" className="w-full p-2 border rounded-lg mt-2"/>}{survey.systems.salesEngagementPlatform === 'Outreach' && <div className="mt-2 pl-4"><label className="font-semibold block mb-2">Would you be able to provide Outreach error logs?</label><RadioGroup name="outreach" options={['Yes', 'No', 'Need to check with admin']} selected={survey.systems.outreachErrorLogs} onChange={v => handleSystemChange('outreachErrorLogs', v)} /></div>}</div>
          <div><label className="font-semibold block mb-2">What tool do you use for conversation intelligence?</label><RadioGroup name="ci" options={['Gong', 'Chorus', 'Dialpad', 'None', 'Other']} selected={survey.systems.conversationIntelligence} onChange={v => handleSystemChange('conversationIntelligence', v)} />{survey.systems.conversationIntelligence === 'Other' && <input type="text" value={survey.systems.conversationIntelligenceOther} onChange={e=>handleSystemChange('conversationIntelligenceOther', e.target.value)} placeholder="Specify other tool" className="w-full p-2 border rounded-lg mt-2"/>}</div>
          <div><label className="font-semibold block mb-2">What is your marketing automation platform?</label><RadioGroup name="map" options={['Marketo', 'HubSpot', 'Pardot', 'Eloqua', 'None', 'Other']} selected={survey.systems.marketingAutomation} onChange={v => handleSystemChange('marketingAutomation', v)} />{survey.systems.marketingAutomation === 'Other' && <input type="text" value={survey.systems.marketingAutomationOther} onChange={e=>handleSystemChange('marketingAutomationOther', e.target.value)} placeholder="Specify other platform" className="w-full p-2 border rounded-lg mt-2"/>}</div>
          <div><label className="font-semibold block mb-2">Which tools do you use for website conversion?</label><CheckboxGroup options={['Drift', 'Intercom', 'ZoomInfo FormComplete', 'Qualified', 'None', 'Other']} selected={survey.systems.websiteConversionTools} onChange={v => handleMultiSelect('websiteConversionTools', v)} />{survey.systems.websiteConversionTools.includes('Other') && <input type="text" value={survey.systems.websiteConversionToolsOther} onChange={e=>handleSystemChange('websiteConversionToolsOther', e.target.value)} placeholder="Specify other tools" className="w-full p-2 border rounded-lg mt-2"/>}</div>
          <div><label className="font-semibold block mb-2">What are your primary data sources?</label><CheckboxGroup options={['ZoomInfo', 'DiscoverOrg', 'LinkedIn Sales Navigator', 'Clearbit', 'Internal database', 'Other']} selected={survey.systems.dataSources} onChange={v => handleMultiSelect('dataSources', v)} />{survey.systems.dataSources.includes('Other') && <input type="text" value={survey.systems.dataSourcesOther} onChange={e=>handleSystemChange('dataSourcesOther', e.target.value)} placeholder="Specify other sources" className="w-full p-2 border rounded-lg mt-2"/>}</div>
          <div><label className="font-semibold block mb-2">What AI tools have you integrated?</label><CheckboxGroup options={['ChatGPT/GPT tools', 'Claude/Anthropic', 'Custom AI solutions', 'None', 'Other']} selected={survey.systems.aiIntegrations} onChange={v => handleMultiSelect('aiIntegrations', v)} />{survey.systems.aiIntegrations.includes('Other') && <input type="text" value={survey.systems.aiIntegrationsOther} onChange={e=>handleSystemChange('aiIntegrationsOther', e.target.value)} placeholder="Specify other AI tools" className="w-full p-2 border rounded-lg mt-2"/>}{!survey.systems.aiIntegrations.includes('None') && survey.systems.aiIntegrations.length > 0 && <textarea value={survey.systems.aiUseCases} onChange={e=>handleSystemChange('aiUseCases', e.target.value)} placeholder="Briefly describe your AI use cases..." className="w-full p-2 border rounded-lg mt-2" rows={2}/>}</div>
          <div><label className="font-semibold block mb-2">Which tools do you use for automation?</label><CheckboxGroup options={['Zapier', 'Workato', 'Custom integrations', 'None', 'Other']} selected={survey.systems.automationTools} onChange={v => handleMultiSelect('automationTools', v)} />{survey.systems.automationTools.includes('Other') && <input type="text" value={survey.systems.automationToolsOther} onChange={e=>handleSystemChange('automationToolsOther', e.target.value)} placeholder="Specify other automation tools" className="w-full p-2 border rounded-lg mt-2"/>}</div>
        </div></div>

        {/* Sequence Strategy */}
        <div className="bg-white rounded-xl border p-6 shadow-sm"><div className="flex items-center space-x-3 mb-4"><ListCollapse className="w-6 h-6 text-cyan-600" /><h2 className="text-xl font-bold text-gray-800">Sequence Strategy</h2></div>
            <p className="mb-4">Which of these types of these other sequences are important for your team?</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.keys(survey.sequences).map(key => <label key={key} className="flex items-center space-x-2"><input type="checkbox" checked={survey.sequences[key as keyof typeof survey.sequences]} onChange={() => handleSequenceChange(key as keyof typeof survey.sequences)} /><span>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</span></label>)}
            </div>
        </div>
      </div>
    </div>
  );
};
