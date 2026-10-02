import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '../context/GameContext';
import { WEEK_2_FOCUS_OPTIONS } from '../data/journeyConfig';
import type { Week2FocusChoice } from '../types/journey';

export const Week7ReviewModal: React.FC = () => {
  const { state, isWeek7ReviewOpen, closeWeek7Review, selectWeek2Focus } = useGame();

  useEffect(() => {
    if (isWeek7ReviewOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // confetti fallback
      }
    }
  }, [isWeek7ReviewOpen]);

  if (!isWeek7ReviewOpen) return null;

  const totalEarned = state.totalEarned;
  const customersServed = state.currentDayStats.customersServed;
  const repStars = state.reputationStars;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-[32px] max-w-lg w-full border-4 border-purple-300 shadow-2xl p-5 sm:p-6 text-center relative my-auto max-h-[90vh] overflow-y-auto scrollbar-none"
        >
          {/* Close button */}
          <button
            onClick={closeWeek7Review}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge & Trophy */}
          <div className="relative inline-block mb-3">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-purple-400 via-pink-400 to-amber-300 border-4 border-white flex items-center justify-center text-4xl shadow-game-btn animate-bounceShort">
              🏆
            </div>
            <span className="absolute -bottom-2 inset-x-0 mx-auto w-max px-2.5 py-0.5 rounded-full bg-amber-400 border border-white text-amber-950 text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
              Chủ Shop Tập Sự
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-600 to-amber-600 mb-1 mt-2">
            Đại Kết Hoàn 7 Ngày Đầu Tiên!
          </h2>
          <p className="text-xs text-slate-500 mb-4 max-w-xs mx-auto">
            Chúc mừng bạn đã xuất sắc làm chủ toàn bộ quy trình vận hành và xây dựng nên một tiệm thời trang đáng mơ ước ✨
          </p>

          {/* Core 7-Day Performance Cards */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-purple-50 p-2.5 rounded-2xl border border-purple-200 text-center">
              <span className="text-[10px] font-bold text-purple-600 block mb-0.5">Tổng Doanh Thu</span>
              <span className="text-xs sm:text-sm font-heading font-extrabold text-purple-900 block truncate">
                {totalEarned.toLocaleString('vi-VN')}đ
              </span>
            </div>

            <div className="bg-pink-50 p-2.5 rounded-2xl border border-pink-200 text-center">
              <span className="text-[10px] font-bold text-pink-600 block mb-0.5">Khách Phục Vụ</span>
              <span className="text-xs sm:text-sm font-heading font-extrabold text-pink-900 block">
                {customersServed + 15} lượt
              </span>
            </div>

            <div className="bg-amber-50 p-2.5 rounded-2xl border border-amber-200 text-center">
              <span className="text-[10px] font-bold text-amber-600 block mb-0.5">Uy Tín Đạt Được</span>
              <span className="text-xs sm:text-sm font-heading font-extrabold text-amber-900 block">
                {'⭐'.repeat(Math.min(5, repStars))} ({repStars} sao)
              </span>
            </div>
          </div>

          {/* Cause and Effect Retrospective */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-4 text-left">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span className="text-[11px] font-heading font-extrabold text-slate-800">
                Nhìn Lại Hành Trình Tuần 1:
              </span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1 m-0 pl-4 list-disc font-medium">
              <li>Lượng khách tăng đều qua các ngày nhờ điểm đánh giá 5 sao từ phòng thử đồ.</li>
              <li>Size M và L bán chạy nhất; việc bổ sung kệ kịp thời giúp giảm 80% tình trạng mất khách.</li>
              <li>Tuyển thêm nhân viên giúp giải tỏa hàng dài tại quầy POS trong ca tối cao điểm.</li>
            </ul>
          </div>

          {/* Week 2 Strategic Focus Selection */}
          <div className="text-left mb-4">
            <h4 className="text-xs font-heading font-extrabold text-slate-800 mb-1 flex items-center gap-1">
              <span>🎯 Chọn Định Hướng Chiến Lược Cho Tuần 2:</span>
            </h4>
            <p className="text-[11px] text-slate-400 mb-2">
              Chọn mục tiêu trọng tâm để nhận ngay đặc quyền tăng trưởng tương ứng:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {WEEK_2_FOCUS_OPTIONS.map((opt) => {
                const isSelected = state.week2FocusChoice === opt.id;
                return (
                  <motion.div
                    key={opt.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectWeek2Focus(opt.id as Week2FocusChoice)}
                    className={`p-3 rounded-2xl border-2 text-left cursor-pointer transition-all relative ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50/80 shadow-md ring-2 ring-purple-300'
                        : 'border-slate-200 bg-white hover:border-purple-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl">{opt.emoji}</span>
                        <div>
                          <span className="font-heading font-extrabold text-xs text-slate-800 block">
                            {opt.title}
                          </span>
                          <span className="text-[9px] font-bold text-purple-600">
                            {opt.badge}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-600 m-0 leading-tight">
                      {opt.benefit}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Confirm & Close */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={closeWeek7Review}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-heading font-extrabold text-sm shadow-game-btn flex items-center justify-center gap-2"
          >
            <span>Bắt Đầu Tuần 2 — Mở Rộng Đế Chế Thời Trang!</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
