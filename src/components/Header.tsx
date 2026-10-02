import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Volume2, VolumeX, Coins, Clock, Store, RotateCcw } from 'lucide-react';
import { useGame, DAY_DURATION } from '../context/GameContext';

export const Header: React.FC = () => {
  const { 
    state, 
    toggleSound, 
    isSoundEnabled, 
    resetGame, 
    setIsAdvisorOpen, 
    setIsSaveModalOpen,
    setGameSpeed,
    openStoreFromPreparation
  } = useGame();

  const activeBranch = state.branches.find(b => b.isUnlocked) || state.branches[0];

  // Remaining time formatted as MM:SS
  const remainingSec = Math.max(0, DAY_DURATION - state.dayTime);
  const minutes = Math.floor(remainingSec / 60);
  const seconds = remainingSec % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  // Virtual retail business clock: 08:00 AM to 22:00 PM (14 hours = 840 mins)
  const virtualMinutes = state.currentInGameMinutes || (480 + Math.floor((state.dayTime / DAY_DURATION) * 840));
  const vHour = Math.floor(virtualMinutes / 60);
  const vMin = virtualMinutes % 60;
  const virtualClock = `${vHour < 10 ? '0' : ''}${vHour}:${vMin < 10 ? '0' : ''}${vMin}`;

  const phaseLabels: Record<string, { label: string; color: string; badge: string }> = {
    PREPARATION: { label: 'Chuẩn Bị Sáng', color: 'bg-amber-100 text-amber-800 border-amber-300', badge: '🧹' },
    MORNING: { label: 'Sáng', color: 'bg-blue-100 text-blue-800 border-blue-300', badge: '☀️' },
    LUNCH_PEAK: { label: 'Trưa Cao Điểm', color: 'bg-rose-100 text-rose-800 border-rose-300', badge: '🔥' },
    AFTERNOON: { label: 'Chiều Thong Thả', color: 'bg-amber-100 text-amber-800 border-amber-300', badge: '☕' },
    EVENING_PEAK: { label: 'Tối Cao Điểm', color: 'bg-purple-100 text-purple-800 border-purple-300', badge: '⚡' },
    CLOSING: { label: 'Sắp Đóng Cửa', color: 'bg-indigo-100 text-indigo-800 border-indigo-300', badge: '🌙' },
    CLOSING_GRACE: { label: 'Phục Vụ Nốt Khách', color: 'bg-red-100 text-red-800 border-red-300 animate-pulse', badge: '⏳' },
    END_OF_DAY: { label: 'Hết Ca Ngày', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', badge: '🏁' }
  };

  const currentPhaseInfo = phaseLabels[state.dayPhase] || phaseLabels.MORNING;

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn chơi lại từ đầu không?')) {
      resetGame();
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b-4 border-pink-200 px-3 md:px-4 py-2.5 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col gap-2">
        {/* Top Row: Brand, Clocks, Cash, Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Logo and Shop Name */}
          <div className="flex items-center gap-2.5">
            <motion.div 
              whileHover={{ scale: 1.08, rotate: 6 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 via-rose-400 to-amber-300 flex items-center justify-center shadow-game-btn-pink cursor-pointer"
            >
              <Store className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg md:text-xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-rose-500 tracking-tight m-0">
                  Tiệm Thời Trang Mơ Ước
                </h1>
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              </div>
              <div className="text-xs font-semibold text-pink-500 flex items-center gap-2">
                <span className="truncate max-w-[130px]">{activeBranch.name}</span>
                <span>•</span>
                <span className="text-purple-600 font-bold">Ngày {state.day}</span>
              </div>
            </div>
          </div>

          {/* Center: Real Clock & Day Phase & Simulation Speed */}
          <div className="flex items-center gap-2">
            {/* Clock & Phase Badge */}
            <div className="bg-pink-50/90 px-2.5 py-1.5 rounded-xl border border-pink-200 flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 font-bold text-pink-700" title={`Giờ tiệm: ${virtualClock}`}>
                <Clock className="w-3.5 h-3.5" /> {virtualClock}
              </span>
              <span className={`px-2 py-0.5 rounded-lg border font-bold text-[11px] flex items-center gap-1 ${currentPhaseInfo.color}`}>
                <span>{currentPhaseInfo.badge}</span>
                <span>{currentPhaseInfo.label}</span>
              </span>
              <span className="font-mono text-purple-700 text-xs font-semibold hidden sm:inline">{timeFormatted}</span>
            </div>

            {/* Speed Controls: ⏸ 0x, ▶ 1x, ⏩ 2x */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setGameSpeed(0)}
                className={`px-2 py-1 rounded-lg transition-all ${state.gameSpeed === 0 ? 'bg-amber-400 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                title="Tạm dừng game (0x)"
              >
                ⏸ 0x
              </button>
              <button
                onClick={() => setGameSpeed(1)}
                className={`px-2 py-1 rounded-lg transition-all ${state.gameSpeed === 1 ? 'bg-pink-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                title="Tốc độ tiêu chuẩn (1x)"
              >
                ▶ 1x
              </button>
              <button
                onClick={() => setGameSpeed(2)}
                className={`px-2 py-1 rounded-lg transition-all ${state.gameSpeed === 2 ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                title="Tốc độ nhanh (2x)"
              >
                ⏩ 2x
              </button>
            </div>

            {state.dayPhase === 'PREPARATION' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openStoreFromPreparation}
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold rounded-xl text-xs shadow-game-btn-green animate-bounce"
              >
                🔔 Mở Cửa Ngay!
              </motion.button>
            )}
          </div>

          {/* Right: Cash Display & Controls */}
          <div className="flex items-center gap-2">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3.5 py-1.5 rounded-xl shadow-game-btn-green border-2 border-emerald-300 font-heading font-extrabold text-sm md:text-base tracking-wide"
            >
              <Coins className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span>{state.cash.toLocaleString('vi-VN')} đ</span>
            </motion.div>

            <button
              onClick={() => setIsAdvisorOpen(true)}
              className="p-2 rounded-xl bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-300 transition-colors shadow-xs flex items-center gap-1 text-xs font-bold"
              title="Cố vấn kinh doanh & Phân tích Tại sao?"
            >
              <span>💡</span>
              <span className="hidden sm:inline">Cố Vấn</span>
            </button>

            <button
              onClick={() => setIsSaveModalOpen(true)}
              className="p-2 rounded-xl bg-pink-100 text-pink-700 hover:bg-pink-200 border border-pink-300 transition-colors shadow-xs flex items-center gap-1 text-xs font-bold"
              title="Quản lý bản lưu (Save Slots)"
            >
              <span>💾</span>
              <span className="hidden sm:inline">Lưu</span>
            </button>

            <button
              onClick={handleReset}
              className="hidden md:flex p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200 transition-colors shadow-xs"
              title="Chơi lại từ đầu (Reset)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={toggleSound}
              className="p-2 rounded-xl bg-pink-100 text-pink-600 hover:bg-pink-200 border border-pink-300 transition-colors shadow-xs"
              title={isSoundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
            >
              {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </motion.button>
          </div>
        </div>

        {/* Bottom Sub-bar: Financial & Performance Bar (Accounting Invariant Showcase) */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-2.5 py-1 bg-slate-50/90 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-600">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="text-emerald-600 font-bold">💳 Đã Thu Hôm Nay:</span>
              <span className="text-emerald-700 font-extrabold font-mono">+{state.currentDayStats.revenue.toLocaleString('vi-VN')}đ</span>
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="flex items-center gap-1" title="Giá trị quần áo đang được khách thử hoặc chờ quẹt thẻ ở quầy POS (CHƯA cộng vào tiền mặt!)">
              <span className="text-amber-600 font-bold">🛒 Chờ Thu (Giỏ Hàng):</span>
              <span className="text-amber-700 font-extrabold font-mono">{state.currentDayStats.pendingCartValue.toLocaleString('vi-VN')}đ</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1" title="Doanh thu bị mất do hết size trên kệ hoặc khách bỏ về do chờ lâu">
              <span className="text-rose-500 font-bold">💔 Bỏ Lỡ:</span>
              <span className="text-rose-600 font-bold font-mono">-{state.currentDayStats.lostSalesValue.toLocaleString('vi-VN')}đ</span>
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="flex items-center gap-1">
              <span className="text-indigo-600 font-bold">🎯 Chuyển Đổi:</span>
              <span className="text-indigo-700 font-extrabold">{state.currentDayStats.conversionRate}% ({state.currentDayStats.customersServed}/{state.currentDayStats.customersServed + state.currentDayStats.customersLost})</span>
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < state.reputationStars ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} 
                />
              ))}
              <span className="text-[10px] text-amber-700 ml-1">({state.reputationExp}/{state.reputationNextExp})</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
