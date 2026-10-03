import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, X, Check } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import confetti from 'canvas-confetti';

interface FashionGachaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FashionGachaModal: React.FC<FashionGachaModalProps> = ({ isOpen, onClose }) => {
  const { addCash, addReputationExp } = useGame();
  const [isOpening, setIsOpening] = useState(false);
  const [reward, setReward] = useState<{ title: string; desc: string; icon: string; cashBonus: number; expBonus: number } | null>(null);

  const rewardsPool = [
    { title: 'Túi Tiền Tips May Mắn', desc: 'Khách hàng để lại tiền tips hậu hĩnh vì phục vụ quá chu đáo!', icon: '💰', cashBonus: 150000, expBonus: 20 },
    { title: 'Cuộn Vải Lụa Satin Cao Cấp', desc: 'Nguyên liệu may mặc thượng hạng vừa được nhà cung cấp tặng riêng!', icon: '🧵', cashBonus: 200000, expBonus: 35 },
    { title: 'Thẻ Bài Stylist VIP', desc: 'Thần Mèo Nini ban phước lành: Tăng sự chú ý và kiên nhẫn của khách!', icon: '✨', cashBonus: 100000, expBonus: 50 },
    { title: 'Bộ Phụ Kiện Ngọc Trai', desc: 'Điểm nhấn phối đồ hoàn hảo cho Lookbook mùa lễ hội!', icon: '💎', cashBonus: 250000, expBonus: 40 },
    { title: 'Trà Sữa Trân Châu Nạp Năng Lượng', desc: 'Chủ shop tự thưởng một ly trà sữa ngọt ngào siêu ngon!', icon: '🧋', cashBonus: 80000, expBonus: 15 },
  ];

  const handleOpenGacha = () => {
    if (isOpening) return;
    setIsOpening(true);

    setTimeout(() => {
      const selected = rewardsPool[Math.floor(Math.random() * rewardsPool.length)];
      setReward(selected);
      addCash(selected.cashBonus);
      addReputationExp(selected.expBonus);
      setIsOpening(false);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-[#FFFDF9] border-4 border-[#EAD7BD] rounded-3xl p-5 md:p-6 max-w-md w-full shadow-2xl relative text-[#3A2317]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF2E6] border border-[#EAD7BD] flex items-center justify-center text-[#7A5A48] hover:bg-rose-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#EF6F8E] to-[#F0B43C] flex items-center justify-center text-3xl shadow-md mb-2">
            🎁
          </div>
          <h2 className="text-xl font-extrabold text-[#3A2317] tracking-tight flex items-center justify-center gap-1.5">
            <span>Rút Thưởng May Mắn</span>
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
          </h2>
          <p className="text-xs text-[#7A5A48] mt-0.5">
            Mở hộp quà phong cách mỗi ngày để nhận tiền thưởng & kinh nghiệm uy tín!
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-[#FAF2E6] border-2 border-[#EAD7BD] rounded-2xl p-4 text-center my-4 min-h-[160px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {reward ? (
              <motion.div
                key="reward"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-2"
              >
                <div className="text-5xl animate-bounce">{reward.icon}</div>
                <div className="font-extrabold text-base text-[#C24C69]">{reward.title}</div>
                <p className="text-xs text-[#7A5A48] max-w-xs">{reward.desc}</p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-full border border-emerald-300">
                    +{reward.cashBonus.toLocaleString('vi-VN')}đ
                  </span>
                  <span className="bg-amber-100 text-amber-800 font-bold text-xs px-2.5 py-1 rounded-full border border-amber-300">
                    +{reward.expBonus} Uy Tín ★
                  </span>
                </div>
              </motion.div>
            ) : isOpening ? (
              <motion.div
                key="opening"
                animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-6xl"
              >
                📦
              </motion.div>
            ) : (
              <motion.div key="ready" className="space-y-2">
                <div className="text-5xl">🎀</div>
                <p className="text-xs font-semibold text-[#7A5A48]">
                  Hộp quà thời trang đang chờ mở. Bấm nút bên dưới để nhận lộc vía từ Nini!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {!reward ? (
            <button
              onClick={handleOpenGacha}
              disabled={isOpening}
              className="flex-1 py-3 px-4 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-[#EF6F8E] to-[#F0B43C] border-2 border-[#8A5A3B] shadow-[0_4px_0_#8A5A3B] active:translate-y-1 active:shadow-[0_1px_0_#8A5A3B] transition-all flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4" />
              <span>{isOpening ? 'Đang Mở Hộp...' : 'Mở Quà Ngay (Miễn Phí)'}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setReward(null);
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-2xl font-extrabold text-sm text-white bg-emerald-600 border-2 border-emerald-800 shadow-[0_4px_0_#065f46] active:translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Nhận Thưởng & Đóng</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
