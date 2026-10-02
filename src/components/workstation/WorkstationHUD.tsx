import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Coins, Star, Volume2, VolumeX, Store, ArrowLeftRight } from 'lucide-react';
import { useGame, DAY_DURATION } from '../../context/GameContext';

interface WorkstationHUDProps {
  onToggleViewMode?: () => void;
}

export const WorkstationHUD: React.FC<WorkstationHUDProps> = ({ onToggleViewMode }) => {
  const { state, toggleSound, isSoundEnabled, setGameSpeed, setActiveTab } = useGame();

  const remainingSec = Math.max(0, DAY_DURATION - state.dayTime);
  const minutes = Math.floor(remainingSec / 60);
  const seconds = remainingSec % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const virtualMinutes = state.currentInGameMinutes || (480 + Math.floor((state.dayTime / DAY_DURATION) * 840));
  const vHour = Math.floor(virtualMinutes / 60);
  const vMin = virtualMinutes % 60;
  const virtualClock = `${vHour < 10 ? '0' : ''}${vHour}:${vMin < 10 ? '0' : ''}${vMin}`;

  const phaseColors: Record<string, string> = {
    PREPARATION: 'bg-amber-100 text-amber-800 border-amber-300',
    MORNING: 'bg-blue-100 text-blue-800 border-blue-300',
    LUNCH_PEAK: 'bg-rose-100 text-rose-800 border-rose-300',
    AFTERNOON: 'bg-amber-100 text-amber-800 border-amber-300',
    EVENING_PEAK: 'bg-purple-100 text-purple-800 border-purple-300',
    CLOSING: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    CLOSING_GRACE: 'bg-red-100 text-red-800 border-red-300 animate-pulse',
    END_OF_DAY: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 border-2 border-pink-200 shadow-sm space-y-2">
      {/* Top HUD: Time, Phase, Speed, Mode Switcher */}
      <div className="flex items-center justify-between gap-1.5 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-white shadow-xs">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <div className="font-heading font-extrabold text-slate-800 flex items-center gap-1">
              <span>Ngày {state.day}</span>
              <span className="text-pink-600 font-mono">({virtualClock})</span>
            </div>
            <div className="text-[10px] text-purple-700 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3 text-purple-500" />
              <span>{timeFormatted}</span>
            </div>
          </div>
        </div>

        {/* Phase Pill */}
        <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-extrabold ${phaseColors[state.dayPhase] || 'bg-slate-100 text-slate-700'}`}>
          {state.dayPhase}
        </span>

        {/* Speed Controls: ⏸ 0x, ▶ 1x, ⏩ 2x */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-[10px] font-bold">
          <button
            onClick={() => setGameSpeed(0)}
            className={`px-1.5 py-0.5 rounded ${state.gameSpeed === 0 ? 'bg-amber-400 text-white' : 'text-slate-600'}`}
            title="Tạm dừng"
          >
            ⏸
          </button>
          <button
            onClick={() => setGameSpeed(1)}
            className={`px-1.5 py-0.5 rounded ${state.gameSpeed === 1 ? 'bg-pink-500 text-white' : 'text-slate-600'}`}
            title="Chuẩn"
          >
            ▶
          </button>
          <button
            onClick={() => setGameSpeed(2)}
            className={`px-1.5 py-0.5 rounded ${state.gameSpeed === 2 ? 'bg-purple-600 text-white' : 'text-slate-600'}`}
            title="Nhanh"
          >
            ⏩
          </button>
        </div>

        {/* View Mode Switcher */}
        <button
          onClick={onToggleViewMode || (() => setActiveTab('shop'))}
          className="px-2 py-1 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-lg font-bold text-[10px] border border-pink-300 flex items-center gap-1"
          title="Chuyển sang Mặt Bằng Tổng Thể"
        >
          <ArrowLeftRight className="w-3 h-3" />
          <span className="hidden sm:inline">Tổng Thể</span>
        </button>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={toggleSound}
          className="p-1.5 rounded-lg bg-pink-50 text-pink-600 border border-pink-200"
          title={isSoundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
        >
          {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </motion.button>
      </div>

      {/* Financial Bar (Revenue vs Cash vs Pending Cart) */}
      <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] bg-slate-50 p-1.5 rounded-xl border border-slate-200 font-semibold">
        {/* Cash */}
        <div className="bg-white p-1 rounded-lg border border-emerald-200 shadow-xs">
          <span className="text-slate-400 block text-[9px]">Tiền Mặt</span>
          <span className="text-emerald-700 font-extrabold flex items-center justify-center gap-0.5">
            <Coins className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            {state.cash.toLocaleString('vi-VN')}đ
          </span>
        </div>

        {/* Paid Revenue */}
        <div className="bg-white p-1 rounded-lg border border-indigo-200 shadow-xs">
          <span className="text-slate-400 block text-[9px]">Đã Thu Hôm Nay</span>
          <span className="text-indigo-700 font-extrabold">
            +{state.currentDayStats.revenue.toLocaleString('vi-VN')}đ
          </span>
        </div>

        {/* Pending Cart Value (NOT in cash) */}
        <div className="bg-white p-1 rounded-lg border border-amber-200 shadow-xs" title="Giá trị quần áo đang thử hoặc chờ thanh toán POS (Chưa tính vào tiền mặt)">
          <span className="text-slate-400 block text-[9px]">🛒 Chờ Thu</span>
          <span className="text-amber-700 font-extrabold">
            {state.currentDayStats.pendingCartValue.toLocaleString('vi-VN')}đ
          </span>
        </div>
      </div>

      {/* Sub-bar: Stars & Cleanliness */}
      <div className="flex items-center justify-between px-1 text-[10px] font-semibold text-slate-500">
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < state.reputationStars ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} 
              />
            ))}
          </div>
          <span className="text-amber-700 font-bold">({state.reputationExp}/{state.reputationNextExp})</span>
        </div>

        <div className="flex items-center gap-1">
          <span>🧹 Sàn:</span>
          <span className={state.cleanliness >= 80 ? 'text-emerald-600 font-bold' : state.cleanliness >= 50 ? 'text-amber-600 font-bold' : 'text-rose-600 font-bold'}>
            {state.cleanliness}%
          </span>
        </div>
      </div>
    </div>
  );
};
