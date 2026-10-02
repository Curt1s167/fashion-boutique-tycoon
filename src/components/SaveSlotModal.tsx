import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  RotateCcw, 
  X, 
  Check, 
  Calendar, 
  Coins, 
  Star, 
  Building
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getSaveSlotsMetadata, getActiveSlotId } from '../utils/saveManager';

export const SaveSlotModal: React.FC = () => {
  const { isSaveModalOpen, setIsSaveModalOpen, switchSlot, manualSave, resetGame } = useGame();

  if (!isSaveModalOpen) return null;

  const currentActiveSlot = getActiveSlotId();
  const slots = getSaveSlotsMetadata();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl max-w-lg w-full border-4 border-pink-300 shadow-2xl p-6 relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center text-xl shadow-xs">
                💾
              </div>
              <div>
                <h3 className="text-base md:text-lg font-heading font-extrabold text-slate-800 m-0">
                  Quản Lý Bản Lưu Trò Chơi (Save Slots)
                </h3>
                <span className="text-[11px] text-slate-500">
                  Dữ liệu được tự động bảo toàn trên trình duyệt của bạn
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsSaveModalOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Manual Save Button */}
          <div className="flex items-center gap-2 mb-4">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={manualSave}
              className="btn-3d flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-game-btn-green"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Ngay Bây Giờ (Manual Checkpoint)</span>
            </motion.button>
          </div>

          {/* Slots List */}
          <div className="space-y-3 mb-5">
            {slots.map(slot => {
              const isCurrent = slot.slotId === currentActiveSlot;

              return (
                <div
                  key={slot.slotId}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                    isCurrent 
                      ? 'border-pink-500 bg-pink-50/50 shadow-xs' 
                      : 'border-slate-200 bg-slate-50/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-xs md:text-sm font-heading font-bold text-slate-800 m-0">
                        {slot.slotName}
                      </h4>
                      {isCurrent && (
                        <span className="text-[9px] bg-pink-500 text-white px-2 py-0.5 rounded-full font-bold">
                          ĐANG CHƠI
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-semibold">
                      <span className="flex items-center gap-1 text-purple-700">
                        <Calendar className="w-3 h-3" /> Ngày {slot.day}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700">
                        <Coins className="w-3 h-3" /> {slot.cash.toLocaleString('vi-VN')}đ
                      </span>
                      <span className="flex items-center gap-1 text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {slot.reputationStars} sao
                      </span>
                      <span className="flex items-center gap-1 text-blue-600">
                        <Building className="w-3 h-3" /> {slot.branchCount} chi nhánh
                      </span>
                    </div>
                  </div>

                  <div>
                    {isCurrent ? (
                      <div className="p-2 text-emerald-600 bg-emerald-100 rounded-xl" title="Slot hiện tại">
                        <Check className="w-4 h-4" />
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          switchSlot(slot.slotId);
                          setIsSaveModalOpen(false);
                        }}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-pink-500 hover:text-white text-slate-700 rounded-xl text-xs font-bold transition-all"
                      >
                        Chuyển sang slot này
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reset Game button */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Muốn xóa dữ liệu hiện tại?</span>
            <button
              onClick={() => {
                if (window.confirm('Xóa dữ liệu và bắt đầu lại từ đầu?')) {
                  resetGame();
                  setIsSaveModalOpen(false);
                }
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Chơi lại từ đầu
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
