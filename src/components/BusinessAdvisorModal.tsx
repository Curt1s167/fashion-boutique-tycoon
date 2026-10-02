import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  X
} from 'lucide-react';
import { useGame } from '../context/GameContext';

export const BusinessAdvisorModal: React.FC = () => {
  const { state, isAdvisorOpen, setIsAdvisorOpen } = useGame();

  if (!isAdvisorOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl max-w-xl w-full border-4 border-amber-300 shadow-2xl p-6 relative max-h-[85vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl shadow-xs">
                💡
              </div>
              <div>
                <h3 className="text-lg font-heading font-extrabold text-slate-800 m-0 flex items-center gap-1.5">
                  Cố Vấn Kinh Doanh & Phân Tích "Tại Sao?"
                </h3>
                <span className="text-xs text-slate-500">
                  Phân tích dữ liệu thực tế để tìm ra nguyên nhân và giải pháp kinh doanh
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsAdvisorOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Diagnostic */}
          <div className="grid grid-cols-3 gap-2 bg-amber-50/60 p-3 rounded-2xl border border-amber-200 mb-5 text-center text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Độ Sạch Sẽ Shop</span>
              <span className={`font-bold ${state.cleanliness >= 80 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {state.cleanliness}%
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Đánh Giá TB</span>
              <span className="font-bold text-amber-600">
                {state.reviews.length > 0 
                  ? (state.reviews.reduce((s, r) => s + r.stars, 0) / state.reviews.length).toFixed(1) 
                  : '5.0'} ★
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Tỷ Lệ Mất Khách</span>
              <span className={`font-bold ${state.currentDayStats.customersLost === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {state.currentDayStats.customersLost} người
              </span>
            </div>
          </div>

          {/* Advisor Insights List */}
          <div className="space-y-3 mb-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Các vấn đề trọng tâm cần lưu ý:
            </h4>

            {state.advisorInsights.map(item => (
              <div 
                key={item.id}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  item.type === 'warning' 
                    ? 'border-rose-200 bg-rose-50/40' 
                    : item.type === 'opportunity'
                    ? 'border-amber-200 bg-amber-50/40'
                    : 'border-emerald-200 bg-emerald-50/40'
                }`}
              >
                <div className="flex items-start gap-2.5 mb-2">
                  {item.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  ) : item.type === 'opportunity' ? (
                    <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h5 className="text-xs md:text-sm font-heading font-bold text-slate-800 m-0">
                      {item.title}
                    </h5>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 mt-3 pt-2.5 border-t border-slate-200/60 text-xs">
                  <div className="flex items-start gap-1.5 text-slate-700">
                    <span className="font-bold text-rose-700 shrink-0 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" /> Tại sao?
                    </span>
                    <span>{item.rootCause}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-800 font-medium">
                    <span className="font-bold text-emerald-700 shrink-0">⚡ Giải pháp:</span>
                    <span>{item.recommendation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsAdvisorOpen(false)}
            className="btn-3d w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 font-heading font-extrabold text-xs md:text-sm shadow-game-btn-gold"
          >
            Đã Hiểu & Tiếp Tục Tối Ưu Tiệm
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
