import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, DollarSign, Percent, ShoppingCart } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const DaySummaryModal: React.FC = () => {
  const { state, isDaySummaryOpen, startNextDay, setIsAdvisorOpen } = useGame();

  if (!isDaySummaryOpen) return null;

  const { revenue, cost, profit, customersServed, customersLost } = state.currentDayStats;
  const totalCustomers = customersServed + customersLost;
  const satisfactionRate = totalCustomers > 0 ? Math.round((customersServed / totalCustomers) * 100) : 100;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-3xl max-w-md w-full border-4 border-pink-300 shadow-2xl p-6 text-center relative overflow-hidden"
        >
          {/* Header Trophy Banner */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-300 to-yellow-400 border-4 border-white flex items-center justify-center text-4xl shadow-game-btn-gold mb-4 animate-bounceShort">
            🏆
          </div>

          <h2 className="text-2xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-1">
            Tổng Kết Ngày {state.day} Thành Công!
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Một ngày buôn bán tấp nập tại Tiệm Thời Trang Mơ Ước ✨
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Revenue */}
            <div className="bg-pink-50 p-3 rounded-2xl border border-pink-200 text-left">
              <span className="text-[10px] font-bold text-pink-600 flex items-center gap-1 mb-1">
                <DollarSign className="w-3 h-3" /> Tổng doanh thu
              </span>
              <span className="text-sm font-heading font-extrabold text-slate-800">
                +{revenue.toLocaleString('vi-VN')} đ
              </span>
            </div>

            {/* Wholesale Cost */}
            <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200 text-left">
              <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1 mb-1">
                <ShoppingCart className="w-3 h-3" /> Tiền nhập hàng
              </span>
              <span className="text-sm font-heading font-extrabold text-slate-800">
                -{cost.toLocaleString('vi-VN')} đ
              </span>
            </div>

            {/* Profit */}
            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-left">
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mb-1">
                <Trophy className="w-3 h-3" /> Lợi nhuận ròng
              </span>
              <span className="text-sm font-heading font-extrabold text-emerald-700">
                {profit >= 0 ? '+' : ''}{profit.toLocaleString('vi-VN')} đ
              </span>
            </div>

            {/* Satisfaction Rate */}
            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-left">
              <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1 mb-1">
                <Percent className="w-3 h-3" /> Khách phục vụ
              </span>
              <span className="text-sm font-heading font-extrabold text-amber-700">
                {satisfactionRate}% ({customersServed} người)
              </span>
            </div>
          </div>

          {/* Operational Expenses Notice */}
          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-[11px] text-slate-600 mb-4 flex items-center justify-between">
            <span>Chi phí lương & mặt bằng ca ngày:</span>
            <b className="text-rose-600">
              -{(state.employees.reduce((s, e) => s + e.wagePerDay, 0) + state.branches.filter(b => b.isUnlocked).reduce((s, b) => s + b.dailyRent, 0)).toLocaleString('vi-VN')}đ
            </b>
          </div>

          {/* Advisor Button */}
          <button
            onClick={() => setIsAdvisorOpen(true)}
            className="w-full py-2.5 px-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-heading font-bold text-xs flex items-center justify-center gap-1.5 mb-3 transition-colors"
          >
            <span>💡 Xem Cố Vấn Phân Tích "Tại Sao?" & Đề Xuất</span>
          </button>

          {/* Next Day Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={startNextDay}
            className="btn-3d w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-heading font-extrabold text-base shadow-game-btn flex items-center justify-center gap-2"
          >
            <span>Mở Cửa Ngày {state.day + 1}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
