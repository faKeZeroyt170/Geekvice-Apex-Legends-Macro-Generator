
import React, { useEffect, useState } from 'react';
import { MacroAction, ActionType } from '../types';

interface VisualizerProps {
  actions: MacroAction[];
  isPlaying?: boolean;
  activeActionIndex?: number | null;
}

const Visualizer: React.FC<VisualizerProps> = ({ actions, isPlaying, activeActionIndex }) => {
  const [currentAction, setCurrentAction] = useState<MacroAction | null>(null);

  // Use the active action from playback if available, otherwise show the last one in the list
  useEffect(() => {
    if (activeActionIndex !== null && activeActionIndex !== undefined && actions[activeActionIndex]) {
      setCurrentAction(actions[activeActionIndex]);
    } else {
      const lastStick = [...actions].reverse().find(a => a.type === ActionType.STICK_MOVE);
      setCurrentAction(lastStick || null);
    }
  }, [activeActionIndex, actions]);

  const getStickValues = (targetStick: 'LS' | 'RS') => {
    if (currentAction?.type === ActionType.STICK_MOVE && currentAction.stick === targetStick) {
      return { x: currentAction.x || 0, y: currentAction.y || 0 };
    }
    return { x: 0, y: 0 };
  };

  const ls = getStickValues('LS');
  const rs = getStickValues('RS');
  
  // Check if a button is currently pressed in the active action
  const isButtonPressed = (keyName: string) => {
    return currentAction?.type === ActionType.KEY_PRESS && currentAction.key?.toUpperCase() === keyName.toUpperCase();
  };

  return (
    <div className="relative bg-[#0a0d14] border border-indigo-500/20 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden group">
      {/* Playback Overlay */}
      {isPlaying && (
        <div className="absolute top-4 right-8 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">Live Preview</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Stick (Movement) */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-40 h-40 bg-gray-900 rounded-full border-4 border-gray-800 flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
             <div className="absolute inset-0 border border-indigo-500/5 rounded-full"></div>
             <div className="absolute w-[1px] h-full bg-indigo-500/10"></div>
             <div className="absolute h-[1px] w-full bg-indigo-500/10"></div>
             
             {/* Stick Head */}
             <div 
              className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full shadow-[0_0_25px_rgba(99,102,241,0.6)] transition-all duration-75 ease-out border-4 border-white/10 z-20"
              style={{ 
                transform: `translate(${ls.x * 0.6}px, ${ls.y * 0.6}px)` 
              }}
             >
                <div className="absolute inset-0 rounded-full bg-white/10 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                </div>
             </div>

             {/* Dynamic Trail (Optional effect) */}
             <div 
              className="absolute w-12 h-12 bg-indigo-500/20 rounded-full blur-xl transition-all duration-200"
              style={{ transform: `translate(${ls.x * 0.5}px, ${ls.y * 0.5}px)` }}
             ></div>
          </div>
          <div className="text-center">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Left Stick (LS)</span>
            <div className="text-xs font-mono font-bold text-indigo-400 tabular-nums">
              X: {ls.x}% | Y: {ls.y}%
            </div>
          </div>
        </div>

        {/* Buttons & Right Stick Area */}
        <div className="flex flex-col items-center gap-8">
           {/* Simple Button Grid Preview */}
           <div className="grid grid-cols-2 gap-4">
              <div className={`px-4 py-2 rounded-xl border-2 transition-all duration-75 text-[10px] font-black uppercase tracking-tighter ${
                isButtonPressed('SPACE') || isButtonPressed('X') || isButtonPressed('A')
                  ? 'bg-green-500 border-green-400 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]'
                  : 'bg-gray-800/40 border-gray-700 text-gray-600'
              }`}>
                Jump (A/X)
              </div>
              <div className={`px-4 py-2 rounded-xl border-2 transition-all duration-75 text-[10px] font-black uppercase tracking-tighter ${
                isButtonPressed('CTRL') || isButtonPressed('B') || isButtonPressed('O')
                  ? 'bg-red-500 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                  : 'bg-gray-800/40 border-gray-700 text-gray-600'
              }`}>
                Crouch (B/O)
              </div>
           </div>

           {/* Right Stick (Aiming/Turns) */}
           <div className="flex flex-col items-center gap-4">
              <div className="relative w-28 h-28 bg-gray-900 rounded-full border-2 border-gray-800 flex items-center justify-center shadow-inner">
                 <div className="absolute w-[1px] h-full bg-red-500/10"></div>
                 <div className="absolute h-[1px] w-full bg-red-500/10"></div>
                 
                 <div 
                  className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-75 ease-out border-2 border-white/10"
                  style={{ transform: `translate(${rs.x * 0.4}px, ${rs.y * 0.4}px)` }}
                 ></div>
              </div>
              <div className="text-center">
                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block mb-1">Right Stick (RS)</span>
                <div className="text-[10px] font-mono font-bold text-red-400 tabular-nums">
                  X: {rs.x}% | Y: {rs.y}%
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px]"></div>
    </div>
  );
};

export default Visualizer;
