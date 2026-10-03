import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Receipt, 
  AlertTriangle, 
  HelpCircle, 
  X,
  CreditCard,
  Scale,
  FileText,
  Clock
} from 'lucide-react';
import { useGame } from '../context/GameContext';

interface FinanceDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FinanceDeskModal: React.FC<FinanceDeskModalProps> = ({ isOpen, onClose }) => {
  const { state, payTaxObligation, openWhyModal } = useGame();
  const [activeTab, setActiveTab] = useState<'tax' | 'accounting' | 'policy'>('tax');

  if (!isOpen) return null;

  const { taxState, cash } = state;
  const totalTaxDue = taxState.vatPayable + taxState.citPayable + taxState.penaltyFee;
  const canAfford = cash >= totalTaxDue && totalTaxDue > 0;

  const handlePayFull = () => {
    payTaxObligation(totalTaxDue);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#fffaf2] rounded-[32px] max-w-lg w-full border-4 border-[#ead7bd] shadow-[0_12px_30px_rgba(91,59,51,0.25)] p-5 sm:p-6 text-[#3a2317] relative overflow-hidden my-auto max-h-[92vh] overflow-y-auto scrollbar-none font-sans"
        >
          {/* Stitch Scallop Trim */}
          <div className="stitch-scallop-trim"></div>

          {/* Modal Header */}
          <div className="flex items-center justify-between mb-4 pt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-2xl bg-[#ffe9e4] border-2 border-[#ead7bd] flex items-center justify-center text-2xl shadow-[0_3px_0_#936451]">
                🏛️
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase text-[#ef6f8e] bg-white px-2 py-0.5 rounded-full border border-[#ead7bd]">
                    QUẢN LÝ TÀI CHÍNH & THUẾ
                  </span>
                  <span className="text-[10px] text-[#4fa883] font-bold">● {taxState.ruleVersion}</span>
                </div>
                <h3 className="text-base sm:text-lg font-heading font-extrabold text-[#3a2317] m-0">
                  Bàn Kế Toán & Nghĩa Vụ Thuế Việt Nam
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-[#ead7bd] flex items-center justify-center text-[#7a5a48] hover:bg-[#ffe9e4] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 bg-[#ffe9e4] p-1 rounded-2xl border border-[#ead7bd] mb-4 text-xs font-bold">
            <button
              onClick={() => setActiveTab('tax')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                activeTab === 'tax' ? 'bg-white text-[#ef6f8e] shadow-xs' : 'text-[#7a5a48]'
              }`}
            >
              Nghĩa Vụ Thuế
            </button>
            <button
              onClick={() => setActiveTab('accounting')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                activeTab === 'accounting' ? 'bg-white text-[#ef6f8e] shadow-xs' : 'text-[#7a5a48]'
              }`}
            >
              Kế Toán Bán Lẻ
            </button>
            <button
              onClick={() => setActiveTab('policy')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                activeTab === 'policy' ? 'bg-white text-[#ef6f8e] shadow-xs' : 'text-[#7a5a48]'
              }`}
            >
              Quy Định Pháp Luật
            </button>
          </div>

          {/* TAB 1: TAX OBLIGATIONS */}
          {activeTab === 'tax' && (
            <div className="space-y-3.5">
              {/* Overdue Warning Alert */}
              {taxState.taxDebt > 0 && (
                <div className="bg-[#ffdad2] border-2 border-[#ba1a1a] p-3 rounded-2xl flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-[#ba1a1a] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-[#ba1a1a] m-0">Cảnh Báo Nợ Thuế Quá Hạn</h5>
                    <p className="text-[11px] text-[#462922] mt-0.5 leading-relaxed">
                      Shop có khoản thuế chưa hoàn thành. Tiền chậm nộp tính <strong>0,03%/ngày</strong> theo Điều 59 Luật Quản Lý Thuế 2019.
                    </p>
                  </div>
                </div>
              )}

              {/* Tax Summary Card */}
              <div className="stitch-panel-solid p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-[#ead7bd] pb-2">
                  <span className="text-xs font-bold text-[#7a5a48] flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-[#ef6f8e]" /> Thuế GTGT (VAT 10%):
                  </span>
                  <span className="text-xs font-extrabold text-[#3a2317]">
                    {taxState.vatPayable.toLocaleString('vi-VN')}₫
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#ead7bd] pb-2">
                  <span className="text-xs font-bold text-[#7a5a48] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#7d5637]" /> Thuế TNDN (CIT 20%):
                  </span>
                  <span className="text-xs font-extrabold text-[#3a2317]">
                    {taxState.citPayable.toLocaleString('vi-VN')}₫
                  </span>
                </div>

                {taxState.penaltyFee > 0 && (
                  <div className="flex items-center justify-between border-b border-[#ead7bd] pb-2 text-[#ba1a1a]">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Tiền chậm nộp phát sinh:
                    </span>
                    <span className="text-xs font-extrabold">
                      +{taxState.penaltyFee.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-black text-[#3a2317] uppercase">Tổng nghĩa vụ thuế phải nộp:</span>
                  <span className="text-sm font-black text-[#ef6f8e]">
                    {totalTaxDue.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>

              {/* Payment Action Bar */}
              <div className="bg-white p-3.5 rounded-2xl border-2 border-[#ead7bd] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-left w-full sm:w-auto">
                  <span className="text-[11px] text-[#7a5a48] block">Tiền mặt hiện có:</span>
                  <span className="text-xs font-extrabold text-[#3a2317]">
                    {cash.toLocaleString('vi-VN')}₫
                  </span>
                </div>

                <button
                  onClick={handlePayFull}
                  disabled={!canAfford}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-2xl font-heading font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                    canAfford
                      ? 'bg-gradient-to-r from-[#ef6f8e] to-[#fcc7a1] text-white border-2 border-[#936451] shadow-[0_3px_0_#936451] active:translate-y-0.5'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border-2 border-slate-300'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Nộp Thuế Điện Tử (KBNN)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ACCOUNTING PRINCIPLES */}
          {activeTab === 'accounting' && (
            <div className="space-y-3">
              <div className="bg-white p-3.5 rounded-2xl border-2 border-[#ead7bd] text-xs space-y-2">
                <h5 className="font-bold text-[#3a2317] flex items-center gap-1.5 m-0">
                  <Scale className="w-4 h-4 text-[#ef6f8e]" /> Nguyên Tắc Kế Toán Bán Lẻ Nini
                </h5>
                <p className="text-[#7a5a48] leading-relaxed">
                  • <strong>Doanh thu thực tế:</strong> Chỉ ghi nhận khi giao dịch POS thành công (Khách quét mã/quẹt thẻ).
                </p>
                <p className="text-[#7a5a48] leading-relaxed">
                  • <strong>Tiền mặt khác Lợi nhuận:</strong> Doanh thu chưa trừ chi phí nhập hàng sỉ, tiền thuê mặt bằng và nghĩa vụ thuế.
                </p>
                <p className="text-[#7a5a48] leading-relaxed">
                  • <strong>Hao hụt (Shrinkage):</strong> Hàng mất mát hoặc lỗi hỏng phải kiểm kê và lập biên bản bù trừ giá vốn.
                </p>
              </div>

              <div className="stitch-panel-solid p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] text-[#7a5a48] block">Doanh thu tích lũy:</span>
                  <span className="font-extrabold text-[#3a2317]">{state.totalEarned.toLocaleString('vi-VN')}₫</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#7a5a48] block">Đã nộp NSNN:</span>
                  <span className="font-extrabold text-[#4fa883]">{taxState.totalTaxPaid.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LEGAL POLICY REFERENCE */}
          {activeTab === 'policy' && (
            <div className="space-y-3">
              <div className="bg-white p-3.5 rounded-2xl border-2 border-[#ead7bd] text-xs space-y-2">
                <h5 className="font-bold text-[#3a2317] flex items-center gap-1.5 m-0">
                  <FileText className="w-4 h-4 text-[#7d5637]" /> Căn Cứ Pháp Lý Áp Dụng
                </h5>
                <div className="space-y-1.5 text-[11px] text-[#7a5a48]">
                  <p>• <strong>Luật Thuế Giá Trị Gia Tăng</strong>: Thuế suất áp dụng đối với hàng thời trang may mặc là 10%.</p>
                  <p>• <strong>Luật Thuế Thu Nhập Doanh Nghiệp</strong>: Thuế suất chuẩn 20% trên thu nhập chịu thuế sau khi trừ chi phí hợp lệ.</p>
                  <p>• <strong>Luật Quản Lý Thuế 2019 (Luật số 38/2019/QH14)</strong>: Khoản tiền chậm nộp tính theo mức 0,03%/ngày trên số tiền thuế chậm nộp.</p>
                </div>
              </div>

              <button
                onClick={openWhyModal}
                className="w-full py-2 bg-[#ffe9e4] hover:bg-[#ffd9d2] text-[#7d5637] rounded-xl text-xs font-bold border border-[#ead7bd] flex items-center justify-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#ef6f8e]" />
                <span>Xem giải thích "Vì sao?" trong vận hành bán lẻ</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
