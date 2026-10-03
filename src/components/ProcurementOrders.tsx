import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Clock, 
  Star, 
  PlusCircle, 
  Building2
} from 'lucide-react';
import { useGame } from '../context/GameContext';

export const ProcurementOrders: React.FC = () => {
  const { state, createPurchaseOrder } = useGame();
  const [selectedStyleId, setSelectedStyleId] = useState<string>(Object.keys(state.styles)[0]);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [orderQty, setOrderQty] = useState<number>(5);

  const selectedStyle = state.styles[selectedStyleId] || Object.values(state.styles)[0];
  const selectedSupplier = state.suppliers[selectedStyle.supplierId];

  // Set default variant if none selected
  const activeVariantId = selectedVariantId || selectedStyle.variants[0]?.id;
  const currentVariant = selectedStyle.variants.find(v => v.id === activeVariantId) || selectedStyle.variants[0];

  const totalCost = (currentVariant?.costPrice || 0) * orderQty;
  const canAfford = state.cash >= totalCost;

  const handleOrder = () => {
    if (!currentVariant || !canAfford) return;
    createPurchaseOrder(selectedStyle.id, currentVariant.id, orderQty);
  };

  return (
    <div className="space-y-6">
      {/* 🏭 STITCH FACTORY & QC INSPECTION HERO BANNER (Screen 09) */}
      <div className="stitch-panel overflow-hidden p-4 md:p-5 bg-[#fffaf2]">
        <div className="stitch-scallop-trim"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#ead7bd] shadow-[0_3px_0_#936451] shrink-0 bg-white">
              <img 
                src="/stitch/09_screen_checkout.png" 
                alt="QC Factory" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-black uppercase text-[#ef6f8e] bg-[#ffe9e4] px-2 py-0.5 rounded-full border border-[#ead7bd]">
                  QUY TRÌNH QC TIÊU CHUẨN
                </span>
                <span className="text-xs text-[#4fa883] font-bold">✓ Đạt 99.4%</span>
              </div>
              <h2 className="text-lg md:text-xl font-heading font-extrabold text-[#3a2317] m-0">
                Nhập Hàng Xưởng Sỉ & Kiểm Định QC
              </h2>
              <p className="text-xs text-[#7a5a48] mt-0.5">
                Kiểm định chất lượng từng lô may trước khi nhập kho lưu trữ sau shop.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-white px-3.5 py-2 rounded-2xl border-2 border-[#ead7bd] shadow-[0_2px_0_#936451] text-xs font-bold text-[#7a5a48] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#ef6f8e]" />
              <span>{state.purchaseOrders.length} kiện đang giao</span>
            </div>
          </div>
        </div>
      </div>

      {/* Suppliers Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Object.values(state.suppliers).map(sup => (
          <div 
            key={sup.id}
            className={`p-4 rounded-3xl border-2 transition-all bg-white shadow-xs ${
              selectedSupplier.id === sup.id ? 'border-indigo-400 bg-indigo-50/20 shadow-sm' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-3xl">{sup.avatar}</span>
              <div>
                <h4 className="text-sm font-heading font-bold text-slate-800 m-0">{sup.name}</h4>
                <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {sup.rating}
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-2">{sup.specialty}</p>
            <div className="text-[11px] font-semibold text-slate-600 flex items-center justify-between bg-slate-50 p-2 rounded-xl">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                Thời gian giao:
              </span>
              <span className="font-bold text-indigo-700">{sup.leadTimeSeconds} giây</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Inbound Shipments Tracking */}
      {state.purchaseOrders.length > 0 && (
        <div className="bg-indigo-50/80 border-2 border-indigo-200 rounded-3xl p-5 shadow-sm">
          <h3 className="text-sm md:text-base font-heading font-bold text-indigo-950 flex items-center gap-2 mb-3 m-0">
            <Truck className="w-4 h-4 text-indigo-600 animate-bounceShort" />
            Kiện Hàng Đang Vận Chuyển Về Kho Sau ({state.purchaseOrders.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {state.purchaseOrders.map(po => (
              <div key={po.id} className="bg-white p-3.5 rounded-2xl border border-indigo-200 shadow-xs">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="text-xs font-heading font-bold text-slate-800 m-0">
                      {po.styleName} ({po.variantDesc})
                    </h5>
                    <span className="text-[10px] text-slate-500">
                      Từ: {po.supplierName} • SL: <b className="text-indigo-700">+{po.quantity} chiếc</b>
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {po.secondsRemaining}s
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    className="bg-indigo-500 h-full rounded-full"
                    animate={{ width: `${Math.max(5, 100 - (po.secondsRemaining * 12))}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Purchase Order Builder */}
      <div className="bg-white rounded-3xl p-5 border-2 border-indigo-200 shadow-game-card">
        <h3 className="text-base font-heading font-bold text-slate-800 flex items-center gap-2 mb-4 m-0">
          <Building2 className="w-4 h-4 text-indigo-600" />
          Tạo Đơn Nhập Sỉ Theo Yêu Cầu
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Step 1: Select Style */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">
              1. Chọn sản phẩm
            </label>
            <select
              value={selectedStyleId}
              onChange={(e) => {
                setSelectedStyleId(e.target.value);
                const s = state.styles[e.target.value];
                if (s && s.variants[0]) setSelectedVariantId(s.variants[0].id);
              }}
              className="w-full p-2.5 rounded-2xl border-2 border-slate-200 bg-white text-xs font-bold text-slate-800 focus:border-indigo-400 outline-none"
            >
              {Object.values(state.styles).map(s => (
                <option key={s.id} value={s.id}>
                  {s.emoji} {s.name} ({s.categoryLabel})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Select Variant (Color & Size) */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">
              2. Chọn phân loại (Màu & Size)
            </label>
            <select
              value={activeVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              className="w-full p-2.5 rounded-2xl border-2 border-slate-200 bg-white text-xs font-bold text-slate-800 focus:border-indigo-400 outline-none"
            >
              {selectedStyle.variants.map(v => (
                <option key={v.id} value={v.id}>
                  {v.colorName} - Size {v.size} (Giá sỉ: {v.costPrice.toLocaleString('vi-VN')}đ)
                </option>
              ))}
            </select>
          </div>

          {/* Step 3: Quantity */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">
              3. Số lượng kiện nhập
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[5, 10, 20].map(qty => (
                <button
                  key={qty}
                  onClick={() => setOrderQty(qty)}
                  className={`py-2 rounded-xl text-xs font-heading font-bold transition-all ${
                    orderQty === qty
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  +{qty}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cost Summary & Order Confirmation */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500">
              Tổng chi phí đơn sỉ ({orderQty} chiếc {currentVariant?.colorName} - {currentVariant?.size}):
            </div>
            <div className="text-lg font-heading font-extrabold text-indigo-700">
              {totalCost.toLocaleString('vi-VN')} đ
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleOrder}
            disabled={!canAfford}
            className={`btn-3d px-6 py-3 rounded-2xl font-heading font-extrabold text-xs md:text-sm flex items-center gap-2 transition-all ${
              canAfford
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-game-btn'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {canAfford ? (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Xác nhận đặt hàng sỉ</span>
              </>
            ) : (
              <span>Không đủ tiền mặt</span>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};
