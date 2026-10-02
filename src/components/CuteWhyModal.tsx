import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { FIRST_7_DAYS_JOURNEY_DATA } from '../data/journeyConfig';

export const CuteWhyModal: React.FC = () => {
  const { state, isWhyModalOpen, closeWhyModal } = useGame();

  if (!isWhyModalOpen) return null;

  const currentDayConfig = FIRST_7_DAYS_JOURNEY_DATA[state.day] || FIRST_7_DAYS_JOURNEY_DATA[7];
  const { whyExplanation } = currentDayConfig;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="bg-white rounded-[28px] max-w-md w-full border-4 border-amber-200 shadow-2xl p-5 text-left relative overflow-hidden"
        >
          {/* Top Cute Accent Ribbon */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-100 rounded-full blur-xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={closeWhyModal}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Mascot & Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-300 via-orange-300 to-yellow-200 border-2 border-amber-900/10 flex items-center justify-center text-3xl shadow-sm animate-bounceShort shrink-0">
              🐱
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-wide">
                  Bé Mèo Giải Thích
                </span>
                <span className="text-[11px] font-bold text-slate-400">Ngày {state.day}/7</span>
              </div>
              <h3 className="text-base font-heading font-extrabold text-slate-800 leading-tight m-0 mt-0.5">
                Vì Sao Lại Như Thế? 🤔
              </h3>
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-amber-50/80 border-2 border-amber-200/80 rounded-2xl p-3.5 mb-3.5">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs font-heading font-extrabold text-amber-950 leading-relaxed m-0">
                "{whyExplanation.question}"
              </p>
            </div>
          </div>

          {/* Cause and Effect Explanations */}
          <div className="space-y-2 mb-4">
            {whyExplanation.answers.map((ans, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs text-slate-700 font-medium leading-relaxed">
                  {ans}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Pro Tip Box */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200/60 rounded-2xl p-3 mb-4">
            <div className="flex items-center gap-1.5 mb-1 text-[11px] font-extrabold text-pink-700 font-heading">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>Mẹo Bỏ Túi Của Bé Mèo:</span>
            </div>
            <p className="text-xs text-pink-900 font-medium m-0 leading-relaxed">
              {whyExplanation.proTip}
            </p>
          </div>

          {/* Footer Close CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={closeWhyModal}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-amber-950 font-heading font-extrabold text-xs shadow-game-btn flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Đã Hiểu Rõ, Trở Lại Bán Hàng Thôi!</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
