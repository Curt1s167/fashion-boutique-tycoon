import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, MessageCircle, AlertTriangle } from 'lucide-react';
import type { Customer, ProductStyle } from '../../types/game';

interface SituationCardProps {
  customer?: Customer;
  targetStyle?: ProductStyle;
  onAssistanceClick?: () => void;
}

export const SituationCard: React.FC<SituationCardProps> = ({ 
  customer, 
  targetStyle,
  onAssistanceClick 
}) => {
  if (!customer) {
    return (
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-2xl border-2 border-dashed border-pink-200 text-center text-xs text-slate-400">
        <span className="text-2xl block mb-1">🚪</span>
        Cửa hàng đang thông thoáng. Đang chờ khách ghé thăm lượt tiếp theo...
      </div>
    );
  }

  const patiencePercent = customer.patience;
  const isUrgent = patiencePercent <= 30;
  const expectedSize = customer.requestedAlternativeSize || customer.requestedSize;

  // Generate friendly dialogue based on customer state
  let dialogueText = `Chào shop! Cho mình xem ${targetStyle?.name || 'món đồ'} màu ${customer.preferredColor}, size ${expectedSize} với ạ!`;
  if (customer.state === 'fitting') {
    if (customer.requestedAlternativeSize) {
      dialogueText = `Size ${customer.requestedSize} hơi chật một chút, shop lấy giúp mình size ${customer.requestedAlternativeSize} vào phòng thử nhé!`;
    } else {
      dialogueText = `Mình đang thử đồ trong phòng thử đây, form dáng lên đồ xinh quá!`;
    }
  } else if (customer.state === 'checkout') {
    dialogueText = `Mình ưng món này rồi! Quét mã tính tiền giúp mình nhé!`;
  }

  return (
    <div className={`p-3 rounded-2xl border-2 transition-all shadow-sm ${
      isUrgent 
        ? 'bg-rose-50/90 border-rose-300' 
        : customer.state === 'checkout'
        ? 'bg-emerald-50/90 border-emerald-300'
        : 'bg-white/95 border-pink-200'
    }`}>
      <div className="flex items-start gap-2.5">
        {/* Customer Avatar & Urgency Pulse */}
        <div className="relative">
          <motion.div 
            animate={{ scale: isUrgent ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-200 to-purple-200 flex items-center justify-center text-2xl shadow-xs"
          >
            {customer.avatar}
          </motion.div>
          {customer.archetype === 'Khách VIP Sang Trọng' && (
            <span className="absolute -top-1 -right-1 bg-amber-400 text-white rounded-full p-0.5 text-[10px]">
              ⭐
            </span>
          )}
        </div>

        {/* Content & Speech Bubble */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div>
              <span className="font-heading font-extrabold text-xs text-slate-800">
                {customer.name}
              </span>
              <span className="text-[10px] text-pink-600 font-semibold ml-1.5">
                • {customer.archetype}
              </span>
            </div>

            {/* Assistance Button */}
            {onAssistanceClick && (
              <button
                onClick={onAssistanceClick}
                className="px-2 py-0.5 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs"
                title="Tư vấn hồi phục kiên nhẫn"
              >
                <Sparkles className="w-3 h-3 text-pink-500" />
                <span>Tư vấn</span>
              </button>
            )}
          </div>

          {/* Speech Bubble */}
          <div className="bg-slate-50 p-2 rounded-xl text-xs text-slate-700 relative mb-2 border border-slate-100 flex items-start gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
            <p className="m-0 italic leading-snug font-medium">"{dialogueText}"</p>
          </div>

          {/* Requested Variant Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {targetStyle && (
              <span className="px-2 py-0.5 bg-pink-100 text-pink-800 rounded-lg font-bold text-[10px] flex items-center gap-1">
                <span>{targetStyle.emoji}</span>
                <span className="truncate max-w-[120px]">{targetStyle.name}</span>
              </span>
            )}
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-lg font-bold text-[10px]">
              Màu: {customer.preferredColor}
            </span>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-lg font-extrabold text-[10px] border border-amber-300">
              Size: {expectedSize}
            </span>
            {customer.requestedAlternativeSize && (
              <span className="px-2 py-0.5 bg-rose-500 text-white rounded-lg font-extrabold text-[10px] animate-pulse">
                Đổi size phòng thử!
              </span>
            )}
          </div>

          {/* Patience Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-slate-500 flex items-center gap-1">
                <Heart className={`w-3 h-3 ${patiencePercent > 30 ? 'text-pink-500 fill-pink-500' : 'text-rose-500 fill-rose-500'}`} />
                Độ kiên nhẫn của khách:
              </span>
              <span className={isUrgent ? 'text-rose-600 font-extrabold flex items-center gap-0.5' : 'text-slate-700'}>
                {isUrgent && <AlertTriangle className="w-3 h-3 text-rose-500" />}
                {patiencePercent}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <motion.div 
                className={`h-full rounded-full transition-all duration-300 ${
                  patiencePercent > 60 
                    ? 'bg-emerald-500' 
                    : patiencePercent > 30 
                    ? 'bg-amber-400' 
                    : 'bg-rose-500'
                }`}
                style={{ width: `${patiencePercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
