import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ScanLine, CreditCard, Banknote, QrCode } from 'lucide-react';
import type { Customer } from '../../types/game';

interface POSRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer;
  onProcessPayment: (customerId: string, method: 'cash' | 'card' | 'qr', tipBonus?: number) => void;
}

export const POSRegisterModal: React.FC<POSRegisterModalProps> = ({
  isOpen,
  onClose,
  customer,
  onProcessPayment
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'card' | 'qr'>('card');
  const [isScanned, setIsScanned] = useState(false);
  const [receipt, setReceipt] = useState<{
    id: string;
    total: number;
    method: string;
  } | null>(null);

  if (!isOpen || !customer) return null;

  const billAmount = customer.billAmount || 180000;
  const tipBonus = 0.05; // 5% POS service tip
  const finalTotal = Math.round(billAmount * (1 + tipBonus));

  const handleScan = () => {
    setIsScanned(true);
  };

  const handlePay = () => {
    onProcessPayment(customer.id, selectedMethod, tipBonus);
    setReceipt({
      id: 'REC-' + Date.now().toString().slice(-6),
      total: finalTotal,
      method: selectedMethod === 'cash' ? 'Tiền Mặt' : selectedMethod === 'card' ? 'Thẻ Quẹt' : 'Quét QR'
    });
    setTimeout(() => {
      setReceipt(null);
      setIsScanned(false);
      onClose();
    }, 1800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white w-full max-w-md rounded-3xl border-4 border-emerald-300 shadow-2xl p-5 overflow-hidden relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-emerald-100">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💳</span>
              <div>
                <h3 className="text-base font-heading font-extrabold text-slate-800 m-0">
                  Quầy Thu Ngân POS Thông Minh
                </h3>
                <span className="text-[11px] text-emerald-600 font-bold">
                  Quét mã vạch & Thu tiền chính xác
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

          {/* Receipt View when paid */}
          {receipt ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-8 text-center space-y-3"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-game-btn-green text-3xl">
                ✓
              </div>
              <h4 className="text-lg font-heading font-extrabold text-emerald-800 m-0">
                Thanh Toán Thành Công!
              </h4>
              <p className="text-xs text-slate-500 m-0">
                Hóa đơn #{receipt.id} • Phương thức: {receipt.method}
              </p>
              <div className="text-2xl font-heading font-extrabold text-emerald-600">
                +{receipt.total.toLocaleString('vi-VN')}đ
              </div>
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                💵 Tiền đã được cộng vào két tiệm!
              </span>
            </motion.div>
          ) : (
            <div>
              {/* Customer Info & Basket */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{customer.avatar}</span>
                  <div>
                    <span className="font-heading font-extrabold text-xs text-slate-800 block">
                      {customer.name}
                    </span>
                    <span className="text-[10px] text-pink-600 font-semibold">
                      {customer.targetCategory} • Size {customer.requestedSize}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500 block">
                    Giỏ hàng: 1 món
                  </span>
                  <span className="text-sm font-heading font-extrabold text-emerald-700 block">
                    {billAmount.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              {/* Barcode Scanner Area */}
              <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-3.5 rounded-2xl mb-3 text-center relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-emerald-300">
                    BARCODE SCANNER • READY
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${isScanned ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-900'}`}>
                    {isScanned ? 'ĐÃ QUÉT XONG' : 'CHƯA QUÉT'}
                  </span>
                </div>

                {/* Laser animation */}
                <div className="h-10 border border-emerald-500/40 rounded-xl flex items-center justify-center relative bg-emerald-950/40">
                  <span className="font-mono text-xs text-emerald-200 tracking-widest">
                    ||| | |||| | |||||| || |
                  </span>
                  {!isScanned && (
                    <motion.div 
                      animate={{ y: [-15, 15, -15] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className="absolute left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_8px_#f43f5e]"
                    />
                  )}
                </div>

                {!isScanned && (
                  <button
                    onClick={handleScan}
                    className="mt-2.5 w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <ScanLine className="w-4 h-4" />
                    <span>Bấm Quét Mã Vạch ⚡</span>
                  </button>
                )}
              </div>

              {/* Payment Methods */}
              <div className="mb-3.5">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wide block mb-1.5">
                  Phương Thức Thanh Toán
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedMethod('card')}
                    className={`p-2.5 rounded-xl border-2 font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                      selectedMethod === 'card'
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-800 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Thẻ Quẹt</span>
                  </button>

                  <button
                    onClick={() => setSelectedMethod('qr')}
                    className={`p-2.5 rounded-xl border-2 font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                      selectedMethod === 'qr'
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-800 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-purple-600" />
                    <span>Quét QR</span>
                  </button>

                  <button
                    onClick={() => setSelectedMethod('cash')}
                    className={`p-2.5 rounded-xl border-2 font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                      selectedMethod === 'cash'
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-800 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-amber-600" />
                    <span>Tiền Mặt</span>
                  </button>
                </div>
              </div>

              {/* Total Summary */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1 mb-4 text-xs font-semibold">
                <div className="flex justify-between text-slate-600">
                  <span>Tiền hàng:</span>
                  <span>{billAmount.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Tiền tip quầy POS (+5%):</span>
                  <span>+{(finalTotal - billAmount).toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-1 border-t border-slate-200">
                  <span>Tổng thực thu:</span>
                  <span className="text-emerald-700">{finalTotal.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              {/* Complete Payment Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePay}
                disabled={!isScanned}
                className={`btn-3d w-full py-3 px-4 rounded-2xl font-heading font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
                  isScanned 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-game-btn-green' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {isScanned 
                    ? `Thu Tiền & In Hóa Đơn (${finalTotal.toLocaleString('vi-VN')}đ) 💳` 
                    : 'Hãy quét mã vạch sản phẩm trước!'}
                </span>
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
