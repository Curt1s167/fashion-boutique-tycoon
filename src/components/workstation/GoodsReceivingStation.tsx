import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import type { PurchaseOrder } from '../../types/game';

interface GoodsReceivingStationProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseOrders: PurchaseOrder[];
  onReceivePackage: (poId: string, damagedCount: number) => void;
}

export const GoodsReceivingStation: React.FC<GoodsReceivingStationProps> = ({
  isOpen,
  onClose,
  purchaseOrders,
  onReceivePackage
}) => {
  const [selectedPoId, setSelectedPoId] = useState<string>(purchaseOrders[0]?.id || '');
  const [isInspected, setIsInspected] = useState(false);
  const [damagedCount, setDamagedCount] = useState(0);

  if (!isOpen) return null;

  const currentPo = purchaseOrders.find(p => p.id === selectedPoId) || purchaseOrders[0];

  const handleInspect = () => {
    // 15% chance of 1 damaged item
    const hasDamage = Math.random() < 0.15;
    setDamagedCount(hasDamage ? 1 : 0);
    setIsInspected(true);
  };

  const handleAccept = () => {
    if (currentPo) {
      onReceivePackage(currentPo.id, damagedCount);
      setIsInspected(false);
      setDamagedCount(0);
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
          className="bg-white w-full max-w-lg rounded-3xl border-4 border-purple-300 shadow-2xl p-5 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-purple-100">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📦</span>
              <div>
                <h3 className="text-base font-heading font-extrabold text-slate-800 m-0">
                  Cửa Nhập Hàng Sỉ (Goods Receiving)
                </h3>
                <span className="text-[11px] text-purple-600 font-bold">
                  Kiểm đếm kiện hàng từ xưởng may & Nhập vào kho sau
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

          {purchaseOrders.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              Hiện tại không có kiện hàng sỉ nào đang trên đường giao tới.
            </div>
          ) : (
            <div>
              {/* Package selector */}
              <div className="mb-3">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wide block mb-1">
                  Kiện Hàng Sắp Đến / Đã Đến
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {purchaseOrders.map(po => (
                    <button
                      key={po.id}
                      onClick={() => {
                        setSelectedPoId(po.id);
                        setIsInspected(false);
                      }}
                      className={`w-full p-2.5 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                        po.id === currentPo?.id
                          ? 'border-purple-500 bg-purple-50/80 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-purple-200'
                      }`}
                    >
                      <div>
                        <div className="font-heading font-bold text-xs text-slate-800">
                          {po.styleName} ({po.variantDesc})
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Từ: {po.supplierName} • Mã đơn: #{po.id.slice(-6)}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-purple-700 text-xs block">
                          +{po.quantity} chiếc
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {po.secondsRemaining > 0 ? `Còn ${po.secondsRemaining}s` : 'Đã đến cửa!'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Inspection Box */}
              {currentPo && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-extrabold text-xs text-slate-800">
                      Quy trình kiểm hàng thùng #{currentPo.id.slice(-4)}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      isInspected ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-900'
                    }`}>
                      {isInspected ? 'ĐÃ KIỂM ĐẾM' : 'CHƯA MỞ THÙNG'}
                    </span>
                  </div>

                  {!isInspected ? (
                    <button
                      onClick={handleInspect}
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-heading font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Package className="w-4 h-4" />
                      <span>Rọc Băng Keo & Đếm Hàng 🔍</span>
                    </button>
                  ) : (
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-700">
                        <span>Số lượng theo hóa đơn:</span>
                        <span className="font-bold">{currentPo.quantity} chiếc</span>
                      </div>
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Hàng chuẩn nguyên vẹn:</span>
                        <span>{Math.max(0, currentPo.quantity - damagedCount)} chiếc</span>
                      </div>
                      {damagedCount > 0 && (
                        <div className="flex justify-between text-rose-600 font-bold">
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Hàng lỗi đường chỉ:
                          </span>
                          <span>{damagedCount} chiếc (đã hoàn xưởng)</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Accept into backroom */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAccept}
                disabled={!isInspected}
                className={`btn-3d w-full py-3 px-4 rounded-2xl font-heading font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                  isInspected 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-game-btn-green' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isInspected 
                    ? `Nhập +${Math.max(0, (currentPo?.quantity || 0) - damagedCount)} chiếc vào Kho Sau 📦` 
                    : 'Hãy kiểm hàng trước khi nhập kho!'}
                </span>
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
