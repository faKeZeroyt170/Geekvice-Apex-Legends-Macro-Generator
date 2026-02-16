
import React, { useState, useRef } from 'react';
import { MacroProject, ActionType, MacroAction } from '../types';
import { generateMovementMacro } from '../services/geminiService';
import Visualizer from './Visualizer';

interface EditorProps {
  project: MacroProject;
  onUpdate: (updatedProject: MacroProject) => void;
}

const BUTTON_OPTIONS = ['CROSS / A', 'CIRCLE / B', 'SQUARE / X', 'TRIANGLE / Y', 'L1 / LB', 'R1 / RB', 'L2 / LT', 'R2 / RT'];

const Editor: React.FC<EditorProps> = ({ project, onUpdate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeActionIndex, setActiveActionIndex] = useState<number | null>(null);
  const [movementType, setMovementType] = useState('Superglide');
  const [showBindings, setShowBindings] = useState(false);
  const playbackTimeoutRef = useRef<number | null>(null);

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    try {
      const { actions, guide } = await generateMovementMacro(movementType, project.bindings);
      onUpdate({ 
        ...project, 
        name: `${movementType} Aimzenix Profile`,
        actions: actions,
        instructions: guide 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const updateBinding = (role: string, newKey: string) => {
    const newBindings = { ...project.bindings, [role]: newKey };
    // Sync existing actions
    const updatedActions = project.actions.map(action => {
      if (action.type === ActionType.KEY_PRESS && action.role === role) {
        return { ...action, key: newKey };
      }
      return action;
    });
    onUpdate({ ...project, bindings: newBindings, actions: updatedActions });
  };

  const startPlayback = () => {
    if (isPlaying || project.actions.length === 0) return;
    
    setIsPlaying(true);
    let currentIndex = 0;

    const runAction = () => {
      if (currentIndex >= project.actions.length) {
        setIsPlaying(false);
        setActiveActionIndex(null);
        return;
      }

      setActiveActionIndex(currentIndex);
      const action = project.actions[currentIndex];
      currentIndex++;

      playbackTimeoutRef.current = window.setTimeout(runAction, action.duration || 10);
    };

    runAction();
  };

  const copyToClipboard = () => {
    const macroStr = project.actions.map(a => {
      if (a.type === ActionType.STICK_MOVE) {
        return `${a.stick}(X:${a.x}%, Y:${a.y}%, ${a.duration}ms)`;
      }
      return a.type === ActionType.KEY_PRESS ? `BTN(${a.key}, ${a.duration}ms)` : `WAIT(${a.duration}ms)`;
    }).join(' -> ');
    navigator.clipboard.writeText(macroStr);
    alert('Aimzenix Makro-Daten kopiert!');
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto scroll-custom bg-[#07090e] p-6 lg:p-12 pb-32">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Branding */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.25)] border border-indigo-400/20 relative">
              <i className="fas fa-keyboard text-white text-xl absolute -top-1 -left-1 bg-gray-900 p-1.5 rounded-lg border border-gray-800 shadow-lg"></i>
              <i className="fas fa-mouse text-white text-xl absolute -bottom-1 -right-1 bg-gray-900 p-1.5 rounded-lg border border-gray-800 shadow-lg"></i>
              <i className="fas fa-microchip text-white text-3xl"></i>
            </div>
            <div>
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">
                Aimzenix <span className="text-indigo-500">MnK Studio</span>
              </h2>
              <p className="text-indigo-400/60 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                Rebinding Enabled • Geekvice V4.1
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
             <button 
              onClick={() => setShowBindings(!showBindings)}
              className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border flex items-center gap-3 ${
                showBindings ? 'bg-indigo-600 text-white' : 'bg-gray-800/40 border-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              <i className="fas fa-cog"></i>
              Bindings
            </button>
            <button 
              onClick={startPlayback}
              disabled={isPlaying || project.actions.length === 0}
              className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border flex items-center gap-3 ${
                isPlaying 
                ? 'bg-red-500/10 border-red-500/50 text-red-500 cursor-not-allowed' 
                : 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400 hover:bg-indigo-500 hover:text-white'
              }`}
            >
              <i className={`fas ${isPlaying ? 'fa-spinner fa-spin' : 'fa-play'}`}></i>
              {isPlaying ? 'Simulation...' : 'Vorschau'}
            </button>
            <button 
              className="bg-white text-black px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-2xl active:scale-95"
            >
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Rebinding Overlay / Panel */}
          {showBindings && (
            <div className="lg:col-span-12 bg-[#12161f] border border-indigo-500/30 rounded-[2.5rem] p-8 mb-10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-xl uppercase italic tracking-tight text-white">Button Rebinding</h3>
                <button onClick={() => setShowBindings(false)} className="text-gray-500 hover:text-white"><i className="fas fa-times"></i></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(project.bindings).map(([role, currentKey]) => (
                  <div key={role} className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 ml-1">{role}</label>
                    <select 
                      value={currentKey}
                      onChange={(e) => updateBinding(role, e.target.value)}
                      className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                    >
                      {BUTTON_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Controls & Preview */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-gradient-to-br from-[#12161f] to-[#0a0d14] border border-gray-800 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="font-black text-2xl mb-8 uppercase italic tracking-tight text-indigo-400">Adapter Wizard</h3>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">Technik</label>
                    <select 
                      value={movementType}
                      onChange={(e) => setMovementType(e.target.value)}
                      className="w-full bg-black/50 border border-gray-700 rounded-2xl px-6 py-5 font-bold text-sm focus:border-indigo-500 outline-none appearance-none cursor-pointer transition-all"
                    >
                      <option className="bg-gray-900">Superglide MnK</option>
                      <option className="bg-gray-900">Tap-Strafe (MnK Scroll)</option>
                      <option className="bg-gray-900">Neo-Strafe MnK</option>
                      <option className="bg-gray-900">Wall-Bounce Script</option>
                      <option className="bg-gray-900">Jitter Aim Macro</option>
                    </select>
                  </div>

                  <button 
                    onClick={handleAiGenerate}
                    disabled={isGenerating}
                    className="w-full bg-indigo-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50 shadow-[0_10px_40px_rgba(79,70,229,0.3)]"
                  >
                    {isGenerating ? (
                      <span className="flex items-center justify-center gap-3">
                        <i className="fas fa-circle-notch fa-spin"></i> Analyzing Frames
                      </span>
                    ) : 'KI-Profil Erstellen'}
                  </button>
                </div>
              </div>
              <div className="absolute -bottom-16 -right-16 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <i className="fas fa-keyboard text-[20rem]"></i>
              </div>
            </div>

            {/* Visualizer Stick Preview */}
            <Visualizer 
              actions={project.actions} 
              isPlaying={isPlaying} 
              activeActionIndex={activeActionIndex} 
            />

            {/* Geekvice Specific Instructions */}
            {project.instructions && (
              <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-[2.5rem] p-8 relative">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                   <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Aimzenix / Geekvice Anleitung</h4>
                </div>
                <div className="text-sm text-gray-400 leading-relaxed italic whitespace-pre-line font-medium">
                  {project.instructions}
                </div>
              </div>
            )}
          </div>

          {/* Timeline & Output */}
          <div className="lg:col-span-7">
            <div className="bg-[#0a0d14] border border-gray-800/60 rounded-[3rem] p-10 h-full flex flex-col">
              <div className="flex justify-between items-center mb-10">
                <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">MnK Conversion Data Stream</h4>
                <button onClick={copyToClipboard} className="text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors border border-gray-800 px-3 py-1 rounded-lg">
                  Copy Raw
                </button>
              </div>
              
              <div className="flex-1 space-y-3 overflow-y-auto pr-4 scroll-custom max-h-[700px]">
                {project.actions.map((action, index) => (
                  <div 
                    key={action.id} 
                    className={`rounded-3xl p-5 flex items-center justify-between transition-all border ${
                      activeActionIndex === index 
                        ? 'bg-indigo-600 border-indigo-400 scale-[1.02] shadow-[0_0_30px_rgba(79,70,229,0.35)]' 
                        : 'bg-gray-900/40 border-gray-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${activeActionIndex === index ? 'bg-white text-indigo-600' : 'bg-gray-800 text-gray-500'}`}>
                        {index + 1}
                      </div>
                      
                      <div className="flex flex-col">
                        <span className={`text-[11px] font-black uppercase tracking-widest ${
                          activeActionIndex === index ? 'text-white' : (action.type === ActionType.STICK_MOVE ? 'text-indigo-400' : 'text-gray-400')
                        }`}>
                          {action.type === ActionType.STICK_MOVE ? `${action.stick} EMULATION` : action.type}
                        </span>
                        
                        {action.type === ActionType.STICK_MOVE && (
                          <div className={`text-xs font-mono mt-1 ${activeActionIndex === index ? 'text-indigo-100' : 'text-gray-500'}`}>
                            LS_X: {action.x}% <span className="opacity-20">/</span> LS_Y: {action.y}%
                          </div>
                        )}
                        
                        {action.type === ActionType.KEY_PRESS && (
                          <span className={`text-xs font-mono mt-1 ${activeActionIndex === index ? 'text-white' : 'text-gray-500'}`}>
                            {action.role?.toUpperCase() || 'BUTTON'}: {action.key}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-[8px] font-black uppercase ${activeActionIndex === index ? 'text-white/60' : 'text-gray-600'}`}>Frame Delay</div>
                        <div className={`text-sm font-mono font-bold ${activeActionIndex === index ? 'text-white' : 'text-indigo-500'}`}>
                          {action.duration}ms
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {project.actions.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-40 opacity-10">
                    <i className="fas fa-microchip text-6xl mb-6"></i>
                    <p className="text-sm font-black uppercase tracking-[0.3em]">No Profile Data</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Editor;
