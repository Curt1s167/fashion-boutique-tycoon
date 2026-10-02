import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, DollarSign, Percent, ShoppingCart, HelpCircle, Award, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { FIRST_7_DAYS_JOURNEY_DATA } from '../data/journeyConfig';

export const DaySummaryModal: React.FC = () => {
  const { state, isDaySummaryOpen, startNextDay, setIsAdvisorOpen, openWhyModal, openWeek7Review } = useGame();

  if (!isDaySummaryOpen) return null;

  const { revenue, cost, profit, customersServed, customersLost } = state.currentDayStats;
  const totalCustomers = customersServed + customersLost;
  const satisfactionRate = totalCustomers > 0 ? Math.round((customersServed / totalCustomers) * 100) : 100;

  const currentJourney = FIRST_7_DAYS_JOURNEY_DATA[state.day] || FIRST_7_DAYS_JOURNEY_DATA[7];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0 }}
          className="bg-white rounded-[32px] max-w-md w-full border-4 border-pink-300 shadow-2xl p-5 sm:p-6 text-center relative overflow-hidden my-auto max-h-[90vh] overflow-y-auto scrollbar-none"
        >
          {/* Header Trophy Banner */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-300 to-yellow-400 border-4 border-white flex items-center justify-center text-3xl sm:text-4xl shadow-game-btn mb-2.5 animate-bounceShort">
            🐱
          </div>

          <div className="inline-block px-3 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[10px] font-extrabold uppercase tracking-wide mb-1">
            Ngày {state.day}/7: {currentJourney.subtitle}
          </div>

          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-1">
            Tổng Kết Ngày {state.day} Rực Rỡ!
          </h2>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            {currentJourney.storyOpening}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2.5 mb-3.5">
            {/* Revenue */}
            <div className="bg-pink-50 p-2.5 rounded-2xl border border-pink-200 text-left">
              <span className="text-[10px] font-bold text-pink-600 flex items-center gap-1 mb-0.5">
                <DollarSign className="w-3 h-3" /> Tổng doanh thu thực tế
              </span>
              <span className="text-xs sm:text-sm font-heading font-extrabold text-slate-800">
                +{revenue.toLocaleString('vi-VN')} đ
              </span>
            </div>

            {/* Wholesale Cost */}
            <div className="bg-rose-50 p-2.5 rounded-2xl border border-rose-200 text-left">
              <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1 mb-0.5">
                <ShoppingCart className="w-3 h-3" /> Tiền nhập hàng sỉ
              </span>
              <span className="text-xs sm:text-sm font-heading font-extrabold text-slate-800">
                -{cost.toLocaleString('vi-VN')} đ
              </span>
            </div>

            {/* Profit */}
            <div className="bg-emerald-50 p-2.5 rounded-2xl border border-emerald-200 text-left">
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mb-0.5">
                <Trophy className="w-3 h-3" /> Lợi nhuận ròng
              </span>
              <span className="text-xs sm:text-sm font-heading font-extrabold text-emerald-700">
                {profit >= 0 ? '+' : ''}{profit.toLocaleString('vi-VN')} đ
              </span>
            </div>

            {/* Satisfaction Rate */}
            <div className="bg-amber-50 p-2.5 rounded-2xl border border-amber-200 text-left">
              <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1 mb-0.5">
                <Percent className="w-3 h-3" /> Khách phục vụ
              </span>
              <span className="text-xs sm:text-sm font-heading font-extrabold text-amber-700">
                {satisfactionRate}% ({customersServed} người)
              </span>
            </div>
          </div>

          {/* Operational Expenses Notice */}
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-[10px] sm:text-[11px] text-slate-600 mb-3 flex items-center justify-between">
            <span>Chi phí lương & mặt bằng ngày:</span>
            <b className="text-rose-600">
              -{(state.employees.reduce((s, e) => s + e.wagePerDay, 0) + state.branches.filter(b => b.isUnlocked).reduce((s, b) => s + b.dailyRent, 0)).toLocaleString('vi-VN')}đ
            </b>
          </div>

          {/* Cute Learning Insight Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2.5 text-left mb-3">
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-amber-900 font-heading mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Bài Học Kinh Doanh Hôm Nay:</span>
            </div>
            <p className="text-[11px] text-amber-950 font-medium m-0 leading-relaxed">
              {currentJourney.learningInsight}
            </p>
          </div>

          {/* Action Row: Why Modal & Advisor */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => openWhyModal()}
              className="py-2.5 px-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-heading font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>Bé Mèo: Vì Sao?</span>
            </button>

            <button
              onClick={() => setIsAdvisorOpen(true)}
              className="py-2.5 px-3 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 font-heading font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
            >
              <span>💡 Cố Vấn Tiệm</span>
            </button>
          </div>

          {/* Day 7 Finale Prompt */}
          {state.day >= 7 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openWeek7Review}
              className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-heading font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 mb-3 transition-all"
            >
              <Award className="w-4 h-4 text-yellow-300" />
              <span>Xem Đại Kết Hoàn Tuần 1 & Chọn Định Hướng</span>
            </motion.button>
          )}

          {/* Next Day Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startNextDay}
            className="btn-3d w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-heading font-extrabold text-sm sm:text-base shadow-game-btn flex items-center justify-center gap-2"
          >
            <span>Mở Cửa Ngày {state.day + 1}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
