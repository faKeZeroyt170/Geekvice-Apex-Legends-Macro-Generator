
import React from 'react';
import { MOVEMENT_TEMPLATES } from '../constants';
import { MacroProject } from '../types';

interface SidebarProps {
  projects: MacroProject[];
  activeProjectId?: string;
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ projects, activeProjectId, onSelectProject, onNewProject }) => {
  return (
    <div className="w-64 bg-[#080a0f] h-screen border-r border-gray-800/50 flex flex-col">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <i className="fas fa-microchip text-white text-lg"></i>
          </div>
          <div>
            <h1 className="font-black text-sm italic tracking-tighter text-white uppercase leading-none">AIMZENIX</h1>
            <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">AI STUDIO</span>
          </div>
        </div>

        <button 
          onClick={onNewProject}
          className="w-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-2xl py-4 px-4 flex items-center justify-center gap-2 transition-all hover:bg-indigo-600 hover:text-white group active:scale-95"
        >
          <i className="fas fa-plus text-[10px] group-hover:rotate-90 transition-transform"></i>
          <span className="text-xs font-black uppercase tracking-widest">New Config</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scroll-custom px-4">
        <h2 className="text-[10px] font-black text-gray-700 uppercase mb-4 px-4 tracking-widest flex items-center gap-2">
          <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
          MnK Profiles
        </h2>
        <div className="space-y-1">
          {projects.map(project => (
            <button
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className={`w-full text-left px-4 py-4 rounded-2xl transition-all group ${
                activeProjectId === project.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'hover:bg-gray-900 text-gray-500'
              }`}
            >
              <div className="flex items-center gap-3">
                 <i className={`fas fa-circle text-[6px] ${activeProjectId === project.id ? 'text-white' : 'text-gray-800'}`}></i>
                 <span className="text-xs font-bold truncate block tracking-tight">{project.name}</span>
              </div>
            </button>
          ))}
        </div>

        <h2 className="text-[10px] font-black text-gray-700 uppercase mt-10 mb-4 px-4 tracking-widest flex items-center gap-2">
           <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
           Emulation Mods
        </h2>
        <div className="space-y-1">
          {MOVEMENT_TEMPLATES.map(temp => (
            <div 
              key={temp.id}
              className="px-4 py-3 border border-gray-800/30 rounded-xl text-[10px] text-gray-600 flex justify-between items-center group hover:border-gray-700 transition-colors"
            >
              <span className="font-bold uppercase tracking-tighter">{temp.name}</span>
              <span className="opacity-40 italic text-[8px]">{temp.category}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-6">
        <div className="bg-[#0c0f16] rounded-2xl p-4 border border-gray-800/50">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Aimzenix Link Active</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
