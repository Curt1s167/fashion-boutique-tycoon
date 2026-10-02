import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Volume2, VolumeX, Coins, Clock, Store, RotateCcw } from 'lucide-react';
import { useGame, DAY_DURATION } from '../context/GameContext';

export const Header: React.FC = () => {
  const { state, toggleSound, isSoundEnabled, resetGame, setIsAdvisorOpen, setIsSaveModalOpen } = useGame();

  const expPercentage = Math.min(100, (state.reputationExp / state.reputationNextExp) * 100);
  const dayPercentage = Math.min(100, (state.dayTime / DAY_DURATION) * 100);
  const activeBranch = state.branches.find(b => b.isUnlocked) || state.branches[0];

  // Remaining time formatted as MM:SS
  const remainingSec = Math.max(0, DAY_DURATION - state.dayTime);
  const minutes = Math.floor(remainingSec / 60);
  const seconds = remainingSec % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  // Virtual retail business clock: 08:00 AM to 22:00 PM (14 hours = 840 mins)
  const virtualMinutes = 480 + Math.floor((state.dayTime / DAY_DURATION) * 840);
  const vHour = Math.floor(virtualMinutes / 60);
  const vMin = virtualMinutes % 60;
  const virtualClock = `${vHour < 10 ? '0' : ''}${vHour}:${vMin < 10 ? '0' : ''}${vMin}`;

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn chơi lại từ đầu không?')) {
      resetGame();
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b-4 border-pink-200 px-4 py-3 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo and Shop Name */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <motion.div 
            whileHover={{ scale: 1.08, rotate: 6 }}
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-400 via-rose-400 to-amber-300 flex items-center justify-center shadow-game-btn-pink cursor-pointer"
          >
            <Store className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl md:text-2xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-rose-500 tracking-tight m-0">
                Tiệm Thời Trang Mơ Ước
              </h1>
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            </div>
            <div className="text-xs font-semibold text-pink-500 flex items-center gap-2">
              <span className="truncate max-w-[150px]">{activeBranch.name}</span>
              <span>•</span>
              <span className="text-purple-600 font-bold">Ngày {state.day}</span>
            </div>
          </div>

          {/* Quick Sound & Reset on Mobile */}
          <div className="flex items-center gap-1.5 md:hidden ml-auto">
            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 text-xs"
              title="Chơi lại từ đầu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={toggleSound}
              className="p-2 rounded-xl bg-pink-100 text-pink-600 hover:bg-pink-200 border border-pink-200"
              title={isSoundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>

        {/* Center: Day Progress & Reputation */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-center">
          {/* Day Timer with Real Shop Clock */}
          <div className="bg-pink-50/80 px-3 py-1.5 rounded-2xl border border-pink-200 min-w-[145px]">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
              <span className="flex items-center gap-1 text-pink-600" title={`Giờ mở cửa: ${virtualClock}`}>
                <Clock className="w-3.5 h-3.5" /> {virtualClock}
              </span>
              <span className="font-mono text-purple-700">{timeFormatted}</span>
            </div>
            <div className="w-full bg-pink-200 rounded-full h-2 overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full"
                style={{ width: `${dayPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Star Reputation */}
          <div className="bg-amber-50/80 px-3 py-1.5 rounded-2xl border border-amber-200 min-w-[140px]">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-1">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3.5 h-3.5 ${i < state.reputationStars ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} 
                  />
                ))}
              </div>
              <span className="text-[10px] text-amber-600">{state.reputationExp}/{state.reputationNextExp}</span>
            </div>
            <div className="w-full bg-amber-200 rounded-full h-2 overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-amber-400 to-yellow-500 h-full rounded-full"
                style={{ width: `${expPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Right: Cash Display & Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-2xl shadow-game-btn-green border-2 border-emerald-300 font-heading font-extrabold text-base md:text-lg tracking-wide"
          >
            <Coins className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-bounceShort" />
            <span>{state.cash.toLocaleString('vi-VN')} đ</span>
          </motion.div>

          <button
            onClick={() => setIsAdvisorOpen(true)}
            className="p-2.5 rounded-2xl bg-amber-100 text-amber-700 hover:bg-amber-200 border-2 border-amber-300 transition-colors shadow-xs flex items-center gap-1 text-xs font-bold"
            title="Cố vấn kinh doanh & Phân tích Tại sao?"
          >
            <span className="text-sm">💡</span>
            <span className="hidden sm:inline">Cố Vấn</span>
          </button>

          <button
            onClick={() => setIsSaveModalOpen(true)}
            className="p-2.5 rounded-2xl bg-pink-100 text-pink-700 hover:bg-pink-200 border-2 border-pink-300 transition-colors shadow-xs flex items-center gap-1 text-xs font-bold"
            title="Quản lý bản lưu (Save Slots)"
          >
            <span className="text-sm">💾</span>
            <span className="hidden sm:inline">Lưu Game</span>
          </button>

          <button
            onClick={handleReset}
            className="hidden md:flex p-2.5 rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 border-2 border-slate-200 transition-colors shadow-sm"
            title="Chơi lại từ đầu (Reset)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={toggleSound}
            className="hidden md:flex p-2.5 rounded-2xl bg-pink-100 text-pink-600 hover:bg-pink-200 border-2 border-pink-300 transition-colors shadow-sm"
            title={isSoundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
          >
            {isSoundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>
    </header>
  );
};
