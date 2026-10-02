import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Circle, 
  HelpCircle, 
  Sparkles,
  Award
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { FIRST_7_DAYS_JOURNEY_DATA } from '../data/journeyConfig';

export const First7DaysJourneyWidget: React.FC = () => {
  const { state, openWhyModal, openWeek7Review } = useGame();
  const [isExpanded, setIsExpanded] = useState(false);

  const dayNumber = Math.min(7, Math.max(1, state.day));
  const dayMeta = FIRST_7_DAYS_JOURNEY_DATA[dayNumber] || FIRST_7_DAYS_JOURNEY_DATA[7];

  // Calculate goal completions from state
  const completedGoalsCount = dayMeta.goals.filter(g => 
    state.completedJourneyGoalIds.includes(g.id)
  ).length;

  const totalGoals = dayMeta.goals.length;
  const progressPercent = Math.round((completedGoalsCount / totalGoals) * 100);

  return (
    <div className="w-full bg-gradient-to-r from-amber-50/90 via-pink-50/90 to-purple-50/90 border-2 border-amber-200/80 rounded-2xl p-2.5 shadow-xs mb-3 transition-all">
      {/* Top Bar with Mascot, Day Title & Quick Progress */}
      <div className="flex items-center justify-between gap-2">
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 cursor-pointer select-none flex-1 min-w-0"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-300 to-yellow-300 border border-amber-900/10 flex items-center justify-center text-lg shadow-2xs shrink-0">
            🐱
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-amber-200/80 text-amber-950 font-heading">
                Ngày {dayNumber}/7
              </span>
              <span className="text-[11px] font-heading font-extrabold text-slate-800 truncate">
                {dayMeta.subtitle}
              </span>
            </div>
            
            {/* Mini Progress Bar */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 bg-amber-200/50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-amber-400 to-pink-500 rounded-full"
                />
              </div>
              <span className="text-[10px] font-bold text-slate-500">
                {completedGoalsCount}/{totalGoals}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Why Button & Expand Toggle */}
        <div className="flex items-center gap-1 shrink-0">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              openWhyModal();
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white border border-amber-300 text-amber-900 text-[10px] font-heading font-bold shadow-2xs hover:bg-amber-50 transition-colors"
          >
            <HelpCircle className="w-3 h-3 text-amber-600" />
            <span>Vì sao?</span>
          </motion.button>

          {dayNumber === 7 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                openWeek7Review();
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-purple-500 text-white text-[10px] font-heading font-bold shadow-2xs hover:bg-purple-600 transition-colors animate-bounceShort"
            >
              <Award className="w-3 h-3" />
              <span>Tổng kết</span>
            </motion.button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/50"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Checklist & Learning Prompt */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2.5 pt-2 border-t border-amber-200/60 overflow-hidden"
          >
            <p className="text-[11px] text-slate-600 mb-2 leading-relaxed italic">
              "{dayMeta.storyOpening}"
            </p>

            {/* Goal Checklist */}
            <div className="space-y-1.5 mb-2.5">
              {dayMeta.goals.map((goal) => {
                const isDone = state.completedJourneyGoalIds.includes(goal.id);
                return (
                  <div
                    key={goal.id}
                    className={`flex items-start gap-2 p-2 rounded-xl border text-xs transition-colors ${
                      isDone 
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' 
                        : 'bg-white/90 border-slate-200/70 text-slate-700'
                    }`}
                  >
                    <span className="text-sm shrink-0">{goal.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`font-heading font-bold text-[11px] leading-tight ${isDone ? 'line-through text-emerald-800' : 'text-slate-800'}`}>
                          {goal.title}
                        </span>
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0 ml-1" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5 leading-snug">
                        {goal.hint}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Learning Insight Box */}
            <div className="bg-white/80 rounded-xl p-2 border border-amber-200 text-[10px] text-amber-950 flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.2" />
              <div>
                <span className="font-extrabold font-heading block text-amber-900">Bài học hôm nay:</span>
                <span className="font-medium text-slate-600 leading-snug">{dayMeta.learningInsight}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
