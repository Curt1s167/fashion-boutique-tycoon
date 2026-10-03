import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Store, Play, Pause, FastForward } from 'lucide-react';
import { useGame, DAY_DURATION } from '../context/GameContext';

interface HeaderProps {
  onOpenSettings?: () => void;
  onOpenGacha?: () => void;
  onOpenQuiz?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenGacha,
  onOpenQuiz
}) => {
  const { 
    state, 
    setGameSpeed,
    setActiveTab
  } = useGame();

  // Virtual retail business clock: 08:00 AM to 22:00 PM
  const virtualMinutes = state.currentInGameMinutes || (480 + Math.floor((state.dayTime / DAY_DURATION) * 840));
  const vHour = Math.floor(virtualMinutes / 60);
  const vMin = virtualMinutes % 60;
  const virtualClock = `${vHour < 10 ? '0' : ''}${vHour}:${vMin < 10 ? '0' : ''}${vMin}`;

  const phaseLabels: Record<string, { label: string; badge: string }> = {
    PREPARATION: { label: 'Chuẩn bị', badge: '🧹' },
    MORNING: { label: 'Sáng mở tiệm', badge: '☀️' },
    LUNCH_PEAK: { label: 'Trưa cao điểm', badge: '🔥' },
    AFTERNOON: { label: 'Chiều êm đềm', badge: '☕' },
    EVENING_PEAK: { label: 'Tối tấp nập', badge: '⚡' },
    CLOSING: { label: 'Sắp đóng cửa', badge: '🌙' },
    CLOSING_GRACE: { label: 'Phục vụ nốt', badge: '⏳' },
    END_OF_DAY: { label: 'Tổng kết ngày', badge: '🏁' }
  };

  const currentPhaseInfo = phaseLabels[state.dayPhase] || phaseLabels.MORNING;

  // Star calculation
  const totalReviews = state.reviews.length;
  const avgRating = totalReviews > 0
    ? (state.reviews.reduce((acc, r) => acc + r.stars, 0) / totalReviews).toFixed(1)
    : '5.0';

  const completedLookbooks = state.lookbookOutfits.filter(o => !o.isCompleted).length;

  const toggleSpeed = () => {
    if (state.gameSpeed === 0) setGameSpeed(1);
    else if (state.gameSpeed === 1) setGameSpeed(2);
    else setGameSpeed(0);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#fdf3e4] border-b-2 border-[#ead7bd] px-2.5 sm:px-4 py-2 flex items-center justify-between gap-1 sm:gap-2 shadow-xs select-none">
        {/* =========================================================================
            LEFT ZONE: 4 Action Buttons (.h-btns-grid) + Day status (.h-l)
            ========================================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-shrink-0">
          <div className="h-btns-grid">
            {/* 1. Pause / Speed button */}
            <button
              id="pauseBtn"
              type="button"
              className="pbtn"
              aria-label="Tạm dừng hoặc tăng tốc"
              title={`Tốc độ hiện tại: ${state.gameSpeed}x`}
              onClick={toggleSpeed}
            >
              {state.gameSpeed === 0 ? (
                <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              ) : state.gameSpeed === 2 ? (
                <FastForward className="w-3.5 h-3.5 text-pink-600 fill-pink-600" />
              ) : (
                <Pause className="w-3.5 h-3.5 text-[#3a2317] fill-[#3a2317]" />
              )}
            </button>

            {/* 2. Settings button */}
            <button
              id="setBtn"
              type="button"
              className="pbtn"
              aria-label="Cài đặt"
              title="Cài đặt tiệm (Âm thanh, File lưu, Reset)"
              onClick={onOpenSettings}
            >
              <span className="text-xs">⚙️</span>
            </button>

            {/* 3. Lucky Gacha button */}
            <button
              id="bcBtn"
              type="button"
              className="pbtn"
              aria-label="Gacha May Mắn"
              title="Rút thưởng thời trang & Hộp quà may mắn"
              onClick={onOpenGacha}
            >
              <span className="text-xs">🎁</span>
            </button>

            {/* 4. Mini Stylist Challenge button */}
            <button
              id="xdBtn"
              type="button"
              className="pbtn"
              aria-label="Thử thách Stylist"
              title="Mini game tư vấn thời trang nhận thưởng"
              onClick={onOpenQuiz}
            >
              <span className="text-xs">👗</span>
            </button>
          </div>

          {/* Day & Substatus */}
          <div className="leading-tight text-left">
            <div className="font-extrabold text-xs sm:text-sm text-[#3a2317] flex items-center gap-1">
              <span>Ngày {state.day}</span>
              <span className="text-[10px] text-[#ef6f8e] hidden xs:inline">• {virtualClock}</span>
            </div>
            <small className="block text-[10px] sm:text-[11px] font-bold text-[#7a5a48] truncate max-w-[85px] sm:max-w-none">
              {currentPhaseInfo.badge} {currentPhaseInfo.label}
            </small>
          </div>
        </div>

        {/* =========================================================================
            CENTER ZONE: Shop Name & Big Bouncy Cash (.h-m)
            ========================================================================= */}
        <div className="text-center px-1 flex-1 min-w-0 max-w-[200px] sm:max-w-[260px]">
          <small className="block text-[10px] sm:text-xs font-extrabold text-[#c24c69] truncate tracking-wide">
            Tiệm Thời Trang Nini ♡
          </small>
          <motion.div
            key={state.cash}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            className="text-base sm:text-lg md:text-xl font-extrabold text-[#3a2317] leading-none tracking-tight truncate font-sans drop-shadow-xs"
          >
            {state.cash.toLocaleString('vi-VN')}đ
          </motion.div>
        </div>

        {/* =========================================================================
            RIGHT ZONE: Lookbook, Branch & Star Rating (.h-r)
            ========================================================================= */}
        <div className="flex items-center justify-end gap-1 sm:gap-2 min-w-0 flex-shrink-0">
          {/* Lookbook / Collection Button */}
          <button
            type="button"
            onClick={() => setActiveTab('lookbook')}
            className="relative pbtn"
            title="Bộ Sưu Tập & Lookbook"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            {completedLookbooks > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-bounce">
                {completedLookbooks}
              </span>
            )}
          </button>

          {/* Branch / Chi Nhánh Button */}
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border border-amber-200 rounded-lg px-1.5 sm:px-2 py-1 text-[11px] font-extrabold shadow-xs hover:brightness-105 active:scale-95 transition-all flex items-center gap-1 shrink-0"
            title="Quản lý Chuỗi Chi Nhánh"
          >
            <Store className="w-3 h-3 hidden sm:inline" />
            <span>Chi nhánh</span>
          </button>

          {/* Star Rating Box */}
          <div 
            onClick={() => setActiveTab('reviews')}
            className="flex flex-col items-end justify-center cursor-pointer hover:opacity-80 transition-opacity leading-none pl-0.5"
            title={`Đánh giá shop: ${avgRating} sao`}
          >
            <span className="text-amber-500 text-[10px] sm:text-xs tracking-tighter font-mono">
              ★★★★★
            </span>
            <small className="text-[10px] font-extrabold text-[#7a5a48]">
              {avgRating.replace('.', ',')}★
            </small>
          </div>
        </div>
      </header>

      {/* =========================================================================
          BOUTIQUE AWNING (Mái hiên vải sọc hồng trắng ngay dưới Header)
          ========================================================================= */}
      <div className="awning" aria-hidden="true" />
    </>
  );
};
