import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share, PlusSquare, X, RefreshCw, Check } from 'lucide-react';
import { usePwa } from '../../hooks/usePwa';

interface PwaInstallPromptProps {
  isTransactionActive?: boolean;
}

export const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({ isTransactionActive = false }) => {
  const {
    isStandalone,
    canInstallChromium,
    canShowIosGuide,
    showIosGuide,
    setShowIosGuide,
    installApp,
    dismissInstall,
    needRefresh,
    handleUpdate,
    dismissUpdate,
  } = usePwa(isTransactionActive);

  return (
    <>
      {/* 1. Safe Service Worker Update Prompt */}
      <AnimatePresence>
        {needRefresh && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-3 inset-x-3 sm:max-w-md sm:mx-auto z-50 bg-gradient-to-r from-[#FFF7F3] to-[#FFE9E5] border-2 border-[#FDA0A2] rounded-2xl shadow-xl p-3 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#FDA0A2] text-white flex items-center justify-center text-xl shrink-0 shadow-xs">
                ✨
              </div>
              <div>
                <h4 className="text-xs font-heading font-extrabold text-[#5B3B33] m-0">
                  Nini có phiên bản mới!
                </h4>
                <p className="text-[11px] text-[#8B6A60] m-0">
                  Cập nhật để trải nghiệm mượt mà hơn nhé.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleUpdate}
                disabled={isTransactionActive}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold shadow-xs flex items-center gap-1 transition-all ${
                  isTransactionActive
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#FDA0A2] text-[#5B3B33] hover:bg-[#FFB7B2]'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isTransactionActive ? 'Đang thanh toán...' : 'Cập nhật'}</span>
              </button>
              <button
                onClick={dismissUpdate}
                className="p-1 rounded-lg text-[#8B6A60] hover:text-[#5B3B33]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Chromium In-Game Install CTA Card */}
      <AnimatePresence>
        {canInstallChromium && !isStandalone && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-20 md:bottom-6 right-3 md:right-6 max-w-sm z-40 bg-white/95 backdrop-blur-md border-2 border-[#FDA0A2] rounded-3xl shadow-2xl p-3.5"
          >
            <div className="flex items-start gap-3">
              <img
                src="/pwa/nini-192.png"
                alt="Nini"
                className="w-12 h-12 rounded-2xl border border-[#936451]/20 shadow-xs shrink-0 object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-heading font-extrabold text-[#5B3B33] m-0 flex items-center gap-1">
                    <span>Cài Nini vào màn hình chính ♡</span>
                  </h4>
                  <button
                    onClick={dismissInstall}
                    className="p-0.5 rounded-full text-[#8B6A60] hover:text-[#5B3B33]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-[#8B6A60] mt-0.5 mb-2 leading-tight">
                  Mở shop nhanh hơn và chơi toàn màn hình như một ứng dụng điện thoại.
                </p>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={installApp}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#FDA0A2] to-[#FCC7A1] border border-[#936451] text-[#5B3B33] font-heading font-extrabold text-[11px] shadow-xs flex items-center justify-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Cài Nini Ngay</span>
                  </motion.button>
                  <button
                    onClick={dismissInstall}
                    className="py-1.5 px-2.5 rounded-xl text-[11px] font-heading font-bold text-[#8B6A60] hover:bg-slate-100"
                  >
                    Để sau
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. iOS Floating Install Button (Opens Guide) */}
      {canShowIosGuide && !isStandalone && !showIosGuide && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowIosGuide(true)}
          className="fixed bottom-20 md:bottom-6 right-3 md:right-6 z-40 bg-[#FFF7F3] border-2 border-[#FDA0A2] text-[#5B3B33] font-heading font-extrabold text-xs px-3 py-2 rounded-2xl shadow-xl flex items-center gap-1.5"
        >
          <img src="/pwa/favicon-32.png" alt="Nini" className="w-5 h-5 rounded-lg" />
          <span>Cài Nini (iOS) 📲</span>
        </motion.button>
      )}

      {/* 4. iOS Add to Home Screen Instruction Sheet */}
      <AnimatePresence>
        {showIosGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-[#FFF7F3] rounded-[32px] max-w-sm w-full border-4 border-[#FDA0A2] shadow-2xl p-5 text-left relative overflow-hidden"
            >
              <button
                onClick={() => setShowIosGuide(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white text-[#8B6A60] hover:text-[#5B3B33]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/pwa/apple-touch-icon.png"
                  alt="Nini"
                  className="w-14 h-14 rounded-2xl border-2 border-[#936451]/20 shadow-sm object-cover"
                />
                <div>
                  <h3 className="text-sm font-heading font-extrabold text-[#5B3B33] m-0">
                    Thêm Nini Vào Màn Hình Chính
                  </h3>
                  <span className="text-[11px] text-[#FDA0A2] font-extrabold">
                    Trải nghiệm app mượt mà trên iPhone / iPad
                  </span>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-2.5 mb-5 text-xs text-[#5B3B33]">
                <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-2xl border border-[#936451]/10">
                  <div className="w-6 h-6 rounded-xl bg-pink-100 text-[#FDA0A2] flex items-center justify-center shrink-0">
                    <Share className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <b className="block font-heading">Bước 1:</b>
                    <span>Chạm vào nút <b>Chia sẻ (Share)</b> ở thanh dưới Safari.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-2xl border border-[#936451]/10">
                  <div className="w-6 h-6 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <PlusSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <b className="block font-heading">Bước 2:</b>
                    <span>Cuộn xuống và chọn <b>“Thêm vào MH chính” (Add to Home Screen)</b>.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-2xl border border-[#936451]/10">
                  <div className="w-6 h-6 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <b className="block font-heading">Bước 3:</b>
                    <span>Nhấn <b>Thêm (Add)</b> ở góc trên bên phải để hoàn tất!</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIosGuide(false)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FDA0A2] to-[#FCC7A1] text-[#5B3B33] font-heading font-extrabold text-xs shadow-xs"
              >
                Đã Hiểu ♡
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
