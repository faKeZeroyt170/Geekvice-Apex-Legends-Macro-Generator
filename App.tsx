
import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import { MacroProject, ActionType } from './types';
import { MOCK_PROJECTS } from './constants';

const App: React.FC = () => {
  const [projects, setProjects] = useState<MacroProject[]>(MOCK_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string | undefined>(MOCK_PROJECTS[0]?.id);

  const activeProject = projects.find(p => p.id === activeProjectId);

  const handleUpdateProject = useCallback((updatedProject: MacroProject) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? { ...updatedProject, lastModified: Date.now() } : p));
  }, []);

  const handleNewProject = () => {
    const newProj: MacroProject = {
      id: `proj_${Date.now()}`,
      name: 'New Configuration',
      bindings: {
        jump: 'CROSS / A',
        crouch: 'CIRCLE / B',
        interact: 'SQUARE / X',
        tactical: 'L1 / LB'
      },
      actions: [],
      lastModified: Date.now()
    };
    setProjects(prev => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
  };

  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
  };

  return (
    <div className="flex h-screen bg-[#07090e] text-gray-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      <Sidebar 
        projects={projects} 
        activeProjectId={activeProjectId}
        onSelectProject={handleSelectProject}
        onNewProject={handleNewProject}
      />
      
      <main className="flex-1 flex flex-col min-w-0 relative">
        {activeProject ? (
          <Editor 
            project={activeProject} 
            onUpdate={handleUpdateProject} 
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gray-900 rounded-[2.5rem] flex items-center justify-center border border-gray-800 shadow-2xl">
                <i className="fas fa-brain text-4xl text-indigo-500 animate-pulse"></i>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-[#07090e] flex items-center justify-center">
                <i className="fas fa-check text-[10px] text-white"></i>
              </div>
            </div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Bereit für Geekvice</h2>
            <p className="text-gray-500 max-w-sm text-sm font-medium leading-relaxed">
              Wähle eine Konfiguration oder erstelle ein neues KI-Movement Makro für deinen Aimzenox Adapter.
            </p>
            <button 
              onClick={handleNewProject}
              className="mt-10 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
            >
              Neues Makro
            </button>
          </div>
        )}
      </main>

      {/* Futuristic Footer */}
      <footer className="fixed bottom-0 right-0 left-64 bg-black/80 backdrop-blur-2xl border-t border-gray-800/40 py-2.5 px-8 flex justify-between items-center text-[10px] font-bold z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-indigo-400">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
            <span className="tracking-[0.2em] uppercase">Geekvice Engine 4.0</span>
          </div>
          <span className="text-gray-800">|</span>
          <div className="flex items-center gap-2 text-gray-500">
            <span className="uppercase tracking-widest">Active Tech:</span>
            <span className="text-white italic uppercase tracking-tighter">{activeProject?.name || 'IDLE'}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 uppercase tracking-widest">Polling:</span>
            <span className="text-green-500 font-mono">1000Hz Stable</span>
          </div>
          <span className="text-gray-800">|</span>
          <div className="flex items-center gap-2 text-gray-500">
             <i className="fas fa-microchip opacity-40"></i>
             <span className="uppercase tracking-widest">Hardware: Aimzenox Pro V2</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
