import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Save, RotateCcw, X } from 'lucide-react';
import { useGame } from '../../context/GameContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    isSoundEnabled, 
    toggleSound, 
    setIsSaveModalOpen, 
    resetGame,
    setGameSpeed,
    state
  } = useGame();

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tiến trình và chơi lại từ Ngày 1 không?')) {
      resetGame();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-[#FFFDF9] border-4 border-[#EAD7BD] rounded-3xl p-5 md:p-6 max-w-sm w-full shadow-2xl relative text-[#3A2317]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF2E6] border border-[#EAD7BD] flex items-center justify-center text-[#7A5A48] hover:bg-rose-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-sm mb-2">
            ⚙️
          </div>
          <h2 className="text-lg font-extrabold text-[#3A2317] tracking-tight">
            Cài Đặt Tiệm Nini
          </h2>
          <p className="text-xs text-[#7A5A48]">Tùy chỉnh âm thanh, tốc độ & quản lý file lưu</p>
        </div>

        <div className="space-y-3">
          {/* Audio toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF2E6] border border-[#EAD7BD]">
            <div className="flex items-center gap-2">
              {isSoundEnabled ? <Volume2 className="w-5 h-5 text-pink-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
              <div>
                <div className="font-extrabold text-xs">Hiệu Ứng Âm Thanh</div>
                <div className="text-[10px] text-[#7A5A48]">Tiếng ting ting & âm thanh vui nhộn</div>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition-colors ${
                isSoundEnabled ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {isSoundEnabled ? 'Bật' : 'Tắt'}
            </button>
          </div>

          {/* Speed control */}
          <div className="p-3 rounded-2xl bg-[#FAF2E6] border border-[#EAD7BD]">
            <div className="font-extrabold text-xs mb-2">Tốc Độ Vận Hành Tiệm</div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setGameSpeed(0)}
                className={`py-1.5 rounded-xl font-bold text-xs border transition-all ${
                  state.gameSpeed === 0 ? 'bg-[#EF6F8E] text-white border-[#C24C69]' : 'bg-white border-[#EAD7BD] text-[#3A2317]'
                }`}
              >
                ⏸ Tạm dừng
              </button>
              <button
                onClick={() => setGameSpeed(1)}
                className={`py-1.5 rounded-xl font-bold text-xs border transition-all ${
                  state.gameSpeed === 1 ? 'bg-[#EF6F8E] text-white border-[#C24C69]' : 'bg-white border-[#EAD7BD] text-[#3A2317]'
                }`}
              >
                ▶ 1x Chuẩn
              </button>
              <button
                onClick={() => setGameSpeed(2)}
                className={`py-1.5 rounded-xl font-bold text-xs border transition-all ${
                  state.gameSpeed === 2 ? 'bg-[#EF6F8E] text-white border-[#C24C69]' : 'bg-white border-[#EAD7BD] text-[#3A2317]'
                }`}
              >
                ⏩ 2x Nhanh
              </button>
            </div>
          </div>

          {/* Save Slots */}
          <button
            onClick={() => {
              onClose();
              setIsSaveModalOpen(true);
            }}
            className="w-full p-3 rounded-2xl bg-white border-2 border-[#EAD7BD] hover:border-pink-300 flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4 text-pink-600" />
              <span className="font-extrabold text-xs">Quản Lý File Lưu (3 Slots)</span>
            </div>
            <span className="text-[10px] text-[#7A5A48] font-bold">Mở ➜</span>
          </button>

          {/* Reset Game */}
          <button
            onClick={handleReset}
            className="w-full p-3 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-700 hover:bg-rose-100 flex items-center justify-center gap-2 font-extrabold text-xs transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi Lại Từ Đầu (Reset)</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-2xl font-bold text-xs bg-[#FAF2E6] border border-[#EAD7BD] text-[#7A5A48] hover:bg-slate-100 transition-all text-center"
        >
          Đóng
        </button>
      </motion.div>
    </div>
  );
};
