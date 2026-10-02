import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface InstructionBannerProps {
  currentStepIndex: number;
  totalSteps: number;
  stepTitle: string;
  stepInstruction: string;
}

export const InstructionBanner: React.FC<InstructionBannerProps> = ({
  currentStepIndex,
  totalSteps,
  stepTitle,
  stepInstruction
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white p-2.5 rounded-2xl shadow-game-btn flex items-center justify-between gap-2"
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <div className="truncate">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-pink-200">
            {stepTitle}
          </div>
          <div className="text-xs font-heading font-extrabold truncate">
            {stepInstruction}
          </div>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-1 shrink-0">
        {[...Array(totalSteps)].map((_, i) => (
          <div 
            key={i}
            className={`transition-all rounded-full ${
              i < currentStepIndex 
                ? 'w-4 h-2 bg-emerald-400' 
                : i === currentStepIndex 
                ? 'w-5 h-2 bg-white animate-pulse' 
                : 'w-2 h-2 bg-white/40'
            }`}
          />
        ))}
        {currentStepIndex >= totalSteps - 1 && (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 ml-0.5" />
        )}
      </div>
    </motion.div>
  );
};
