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
            <div className="w-full max-w-2xl">
              <div className="text-center mb-12">
                <div className="flex justify-center items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                    <Layers className="w-9 h-9 text-white" />
                  </div>
                </div>
                <h1 className="text-5xl font-bold text-gray-800 mb-4">Organizational Design Studio</h1>
                <p className="text-xl text-gray-600">
                  Use our standardized bucketing tools to build and analyze your organizational structure based on function and seniority.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-left group">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Two Modeling Approaches</h2>
                <p className="text-gray-600 mb-6">
                  Separately organize your company by job function and by seniority level using intuitive drag-and-drop interfaces. This provides a flexible foundation for high-level organizational planning.
                </p>
                <button
                  onClick={() => setView('organizationalDesign')}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold text-lg"
                >
                  Start Designing
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
