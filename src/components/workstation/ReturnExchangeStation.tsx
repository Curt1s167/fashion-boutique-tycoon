import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, X, Check, ArrowRightLeft } from 'lucide-react';
import type { ReturnExchange } from '../../types/game';

interface ReturnExchangeStationProps {
  isOpen: boolean;
  onClose: () => void;
  returnRequests: ReturnExchange[];
  onResolveReturn: (returnId: string, condition: 'sellable' | 'repack' | 'damaged', resolution: 'refund' | 'exchange', exchangeSize?: string) => void;
}

export const ReturnExchangeStation: React.FC<ReturnExchangeStationProps> = ({
  isOpen,
  onClose,
  returnRequests,
  onResolveReturn
}) => {
  const [selectedReqId, setSelectedReqId] = useState<string>(returnRequests[0]?.id || '');
  const [condition, setCondition] = useState<'sellable' | 'repack' | 'damaged'>('sellable');
  const [resolution, setResolution] = useState<'refund' | 'exchange'>('refund');
  const [exchangeSize, setExchangeSize] = useState<string>('L');

  if (!isOpen) return null;

  const currentReq = returnRequests.find(r => r.id === selectedReqId) || returnRequests[0];

  const handleConfirm = () => {
    if (currentReq) {
      onResolveReturn(currentReq.id, condition, resolution, exchangeSize);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white w-full max-w-lg rounded-3xl border-4 border-rose-300 shadow-2xl p-5 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-rose-100">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔄</span>
              <div>
                <h3 className="text-base font-heading font-extrabold text-slate-800 m-0">
                  Quầy Thẩm Định Đổi Trả
                </h3>
                <span className="text-[11px] text-rose-600 font-bold">
                  Kiểm tra tình trạng sản phẩm & Xử lý hoàn tiền hoặc đổi size
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {returnRequests.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <RotateCcw className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              Không có yêu cầu đổi trả nào đang chờ xử lý.
            </div>
          ) : (
            <div>
              {/* Request selector if multiple */}
              {returnRequests.length > 1 && (
                <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-none">
                  {returnRequests.map(r => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedReqId(r.id)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all shrink-0 ${
                        (currentReq?.id === r.id) ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {r.customerAvatar} {r.customerName}
                    </button>
                  ))}
                </div>
              )}

              {/* Request Details */}
              {currentReq && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{currentReq.customerAvatar}</span>
                    <div>
                      <span className="font-heading font-extrabold text-xs text-slate-800 block">
                        {currentReq.customerName}
                      </span>
                      <span className="text-[10px] text-rose-600 font-semibold block">
                        {currentReq.styleName} ({currentReq.variantDesc})
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Lý do: {currentReq.reasonText}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Giá trị:</span>
                    <span className="text-xs font-heading font-extrabold text-slate-800 block">
                      {currentReq.refundAmount.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              )}

              {/* 1. Inspect Condition */}
              <div className="mb-3">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wide block mb-1.5">
                  1. Thẩm Định Tình Trạng Hàng
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setCondition('sellable')}
                    className={`p-2 rounded-xl border-2 text-center text-xs font-bold transition-all ${
                      condition === 'sellable'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    ✨ Nguyên Tag
                  </button>
                  <button
                    onClick={() => setCondition('repack')}
                    className={`p-2 rounded-xl border-2 text-center text-xs font-bold transition-all ${
                      condition === 'repack'
                        ? 'border-amber-500 bg-amber-50 text-amber-800 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    📦 Cần Đóng Gói
                  </button>
                  <button
                    onClick={() => setCondition('damaged')}
                    className={`p-2 rounded-xl border-2 text-center text-xs font-bold transition-all ${
                      condition === 'damaged'
                        ? 'border-rose-500 bg-rose-50 text-rose-800 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    ⚠️ Bị Vết Bẩn/Lỗi
                  </button>
                </div>
              </div>

              {/* 2. Choose Resolution */}
              <div className="mb-4">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wide block mb-1.5">
                  2. Hướng Giải Quyết
                </span>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    onClick={() => setResolution('refund')}
                    className={`p-2.5 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      resolution === 'refund'
                        ? 'border-pink-500 bg-pink-50 text-pink-800 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>Hoàn Tiền Cho Khách</span>
                  </button>
                  <button
                    onClick={() => setResolution('exchange')}
                    className={`p-2.5 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      resolution === 'exchange'
                        ? 'border-purple-500 bg-purple-50 text-purple-800 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                    <span>Đổi Sang Size Khác</span>
                  </button>
                </div>

                {resolution === 'exchange' && (
                  <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-xl border border-purple-200">
                    <span className="text-[11px] font-bold text-purple-800">Chọn size đổi:</span>
                    {['S', 'M', 'L', 'XL'].map(sz => (
                      <button
                        key={sz}
                        onClick={() => setExchangeSize(sz)}
                        className={`px-2 py-1 rounded-lg text-xs font-extrabold ${
                          exchangeSize === sz ? 'bg-purple-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                className="btn-3d w-full py-3 px-4 rounded-2xl font-heading font-extrabold text-xs bg-rose-500 hover:bg-rose-600 text-white shadow-game-btn flex items-center justify-center gap-2"
              >
                <span>Xác Nhận Xử Lý Yêu Cầu Đổi Trả ✨</span>
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
