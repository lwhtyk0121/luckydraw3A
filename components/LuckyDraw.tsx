
import React, { useState, useEffect, useRef } from 'react';
import { Participant } from '../types';
import { getWinnerCheer } from '../services/geminiService';

interface Props {
  participants: Participant[];
}

const LuckyDraw: React.FC<Props> = ({ participants }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [currentName, setCurrentName] = useState<string | null>(null);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [remainingPool, setRemainingPool] = useState<Participant[]>([]);
  const [cheer, setCheer] = useState<string>('');
  const rollInterval = useRef<number | null>(null);

  useEffect(() => {
    setRemainingPool(participants);
  }, [participants]);

  const startDraw = async () => {
    if (participants.length === 0) return;
    
    const pool = allowRepeat ? participants : remainingPool;
    if (pool.length === 0) {
      alert("所有人都已經中獎了！");
      return;
    }

    setIsRolling(true);
    setCheer('');
    
    // Animation
    let count = 0;
    rollInterval.current = window.setInterval(() => {
      const randomIndex = Math.floor(Math.random() * pool.length);
      setCurrentName(pool[randomIndex].name);
      count++;
    }, 80) as unknown as number;

    // Stop after 2-3 seconds
    setTimeout(async () => {
      if (rollInterval.current) clearInterval(rollInterval.current);
      
      const poolAtStop = allowRepeat ? participants : remainingPool;
      const winnerIndex = Math.floor(Math.random() * poolAtStop.length);
      const winner = poolAtStop[winnerIndex];
      
      setCurrentName(winner.name);
      setWinners(prev => [winner, ...prev]);
      
      if (!allowRepeat) {
        setRemainingPool(prev => prev.filter(p => p.id !== winner.id));
      }

      setIsRolling(false);
      
      // AI Cheer
      const msg = await getWinnerCheer(winner.name);
      setCheer(msg);
      createConfetti();
    }, 2500);
  };

  const createConfetti = () => {
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-50 text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">幸運大抽獎</h2>
          <div className="flex items-center gap-4 bg-gray-100 p-2 rounded-lg">
             <label className="flex items-center gap-2 cursor-pointer">
               <input 
                type="checkbox" 
                checked={allowRepeat} 
                onChange={(e) => setAllowRepeat(e.target.checked)}
                disabled={isRolling}
                className="w-4 h-4 text-indigo-600 rounded"
               />
               <span className="text-sm font-medium text-gray-700">允許重複抽中</span>
             </label>
             <div className="h-4 w-px bg-gray-300"></div>
             <span className="text-xs text-gray-500">
               剩餘獎項：{!allowRepeat ? remainingPool.length : '無限'}
             </span>
          </div>
        </div>

        <div className="py-12 px-4 rounded-3xl bg-indigo-50 border-4 border-dashed border-indigo-200">
          <div className={`text-6xl md:text-8xl font-black transition-all ${isRolling ? 'scale-110 text-indigo-600 animate-pulse' : 'text-gray-800'}`}>
            {currentName || "準備開始"}
          </div>
        </div>

        {cheer && !isRolling && (
          <div className="text-xl text-indigo-600 font-bold animate-bounce mt-4">
            🎉 {cheer}
          </div>
        )}

        <button
          onClick={startDraw}
          disabled={isRolling || (remainingPool.length === 0 && !allowRepeat) || participants.length === 0}
          className={`px-12 py-4 rounded-full text-xl font-bold shadow-lg transform transition active:scale-95 ${
            isRolling || (remainingPool.length === 0 && !allowRepeat) || participants.length === 0
            ? 'bg-gray-400 cursor-not-allowed text-white' 
            : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:-translate-y-1'
          }`}
        >
          {isRolling ? '抽獎中...' : '立刻抽獎'}
        </button>
      </div>

      {winners.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center justify-between">
            <span>中獎名單 ({winners.length})</span>
            <button onClick={() => setWinners([])} className="text-xs text-gray-400 hover:text-red-500 uppercase">清除歷史</button>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {winners.map((w, idx) => (
              <div key={`${w.id}-${idx}`} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-indigo-100">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {winners.length - idx}
                </span>
                <span className="font-medium text-gray-700">{w.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckyDraw;
