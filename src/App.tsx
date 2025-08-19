import React, { useState } from 'react';
import { OrganizationalDesign } from './pages/OrganizationalDesign';
import { Layers } from 'lucide-react';

type View = 'home' | 'organizationalDesign';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');

  const renderContent = () => {
    switch (view) {
      case 'organizationalDesign':
        return <OrganizationalDesign onBack={() => setView('home')} />;
      case 'home':
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl text-center">
                <div className="flex justify-center items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Layers className="w-9 h-9 text-white" />
                  </div>
                </div>
                <h1 className="text-5xl font-bold text-gray-800 mb-4">
                  Context Map Design Studio
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                  A guided workflow to build a complete Go-To-Market strategy. Define your target audience, structure your sales process, and diagnose key areas for improvement to create a clear, actionable plan.
                </p>
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow max-w-lg mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Build Your GTM Context Map</h2>
                    <p className="text-gray-600 mb-6">
                        This sequential process will guide you through defining every layer of your GTM strategy, from foundational elements to a final, actionable diagnostic.
                    </p>
                    <button
                      onClick={() => setView('organizationalDesign')}
                      className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold text-lg"
                    >
                      Start Building Your Context Map
                    </button>
                </div>
            </div>
          </div>
        );
    }
  };

  return <>{renderContent()}</>;
};

export default App;
