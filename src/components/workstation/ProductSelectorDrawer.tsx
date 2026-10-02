import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowDownToLine, ShoppingBag, AlertCircle, Sparkles } from 'lucide-react';
import type { ProductStyle } from '../../types/game';

interface ProductSelectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  styles: ProductStyle[];
  selectedCategoryName: string;
  onPlaceOnPrepTable: (styleId: string, variantId: string, source: 'rack' | 'backroom') => void;
  onPickToCarry: (styleId: string, variantId: string, source: 'rack' | 'backroom') => void;
}

export const ProductSelectorDrawer: React.FC<ProductSelectorDrawerProps> = ({
  isOpen,
  onClose,
  styles,
  selectedCategoryName,
  onPlaceOnPrepTable,
  onPickToCarry
}) => {
  const [selectedStyleId, setSelectedStyleId] = useState<string>(styles[0]?.id || '');
  const currentStyle = styles.find(s => s.id === selectedStyleId) || styles[0];
  const [selectedVariantId, setSelectedVariantId] = useState<string>(currentStyle?.variants[0]?.id || '');

  if (!isOpen || !currentStyle) return null;

  const currentVariant = currentStyle.variants.find(v => v.id === selectedVariantId) || currentStyle.variants[0];
  const hasFloorStock = currentVariant ? currentVariant.floorStock > 0 : false;
  const hasBackroomStock = currentVariant ? currentVariant.backroomStock > 0 : false;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl border-4 border-pink-200 shadow-2xl p-4 sm:p-5 max-h-[85vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-pink-100">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👗</span>
              <div>
                <h3 className="text-base font-heading font-extrabold text-slate-800 m-0">
                  Kệ Hàng: {selectedCategoryName}
                </h3>
                <span className="text-[11px] text-pink-600 font-semibold">
                  Chọn phân loại size & màu chính xác theo yêu cầu khách
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 1. Style Carousel / Selector */}
          <div className="mb-3.5">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wide block mb-1.5">
              1. Chọn Mẫu Thiết Kế
            </span>
            <div className="grid grid-cols-2 gap-2">
              {styles.map(st => (
                <button
                  key={st.id}
                  onClick={() => {
                    setSelectedStyleId(st.id);
                    setSelectedVariantId(st.variants[0]?.id || '');
                  }}
                  className={`p-2.5 rounded-2xl border-2 text-left transition-all flex items-center gap-2 ${
                    st.id === currentStyle.id
                      ? 'border-pink-500 bg-pink-50/80 shadow-xs'
                      : 'border-slate-200 hover:border-pink-200 bg-white'
                  }`}
                >
                  <span className="text-3xl">{st.emoji}</span>
                  <div className="min-w-0">
                    <span className="font-heading font-bold text-xs text-slate-800 line-clamp-1 block">
                      {st.name}
                    </span>
                    <span className="text-[10px] text-pink-600 font-bold block">
                      {st.basePrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Color & Size Matrix */}
          <div className="mb-4">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wide block mb-1.5">
              2. Chọn Phân Loại Size & Màu Cụ Thể
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {currentStyle.variants.map(v => {
                const isSelected = v.id === currentVariant?.id;
                const outOfStock = v.floorStock <= 0 && v.backroomStock <= 0;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`p-2 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/90 shadow-xs'
                        : outOfStock
                        ? 'border-slate-200 bg-slate-50/60 opacity-60'
                        : 'border-slate-200 hover:border-purple-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs text-slate-800">
                        Size {v.size}
                      </span>
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs"
                        style={{ backgroundColor: v.colorHex }}
                        title={v.colorName}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 line-clamp-1 mb-1.5">
                      {v.colorName}
                    </span>

                    {/* Stock status */}
                    <div className="text-[9px] font-semibold flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className={v.floorStock > 0 ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                        Kệ: {v.floorStock}
                      </span>
                      <span className={v.backroomStock > 0 ? 'text-purple-700 font-bold' : 'text-slate-400'}>
                        Kho: {v.backroomStock}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Real-time SKU Availability Notice & Action Buttons */}
          {currentVariant && (
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{currentStyle.emoji}</span>
                  <div>
                    <span className="font-heading font-extrabold text-xs text-slate-800 block">
                      {currentStyle.name}
                    </span>
                    <span className="text-[10px] text-purple-700 font-bold">
                      Size: {currentVariant.size} • Màu: {currentVariant.colorName}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-heading font-extrabold text-pink-600 block">
                    {currentVariant.sellPrice.toLocaleString('vi-VN')}đ
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Giá bán niêm yết
                  </span>
                </div>
              </div>

              {/* Exact Stock Location Routing (Section 10) */}
              <div className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold">
                <span>Trạng thái hàng:</span>
                {hasFloorStock ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    Sẵn trên quầy ({currentVariant.floorStock} cái)
                  </span>
                ) : hasBackroomStock ? (
                  <span className="text-purple-700 flex items-center gap-1">
                    📦 Quầy: 0 • Kho sau: {currentVariant.backroomStock} chiếc
                  </span>
                ) : (
                  <span className="text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Hết hàng cả kệ lẫn kho!
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Dual Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {/* Action 1: Place on Prep Table */}
            <button
              onClick={() => {
                if (currentVariant) {
                  const source = hasFloorStock ? 'rack' : 'backroom';
                  onPlaceOnPrepTable(currentStyle.id, currentVariant.id, source);
                  onClose();
                }
              }}
              disabled={!hasFloorStock && !hasBackroomStock}
              className={`py-2.5 px-3 rounded-xl font-heading font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all ${
                hasFloorStock || hasBackroomStock
                  ? 'btn-3d bg-pink-500 hover:bg-pink-600 text-white shadow-game-btn'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Đặt lên Bàn Chuẩn Bị 🪡</span>
            </button>

            {/* Action 2: Carry directly in hand */}
            <button
              onClick={() => {
                if (currentVariant) {
                  const source = hasFloorStock ? 'rack' : 'backroom';
                  onPickToCarry(currentStyle.id, currentVariant.id, source);
                  onClose();
                }
              }}
              disabled={!hasFloorStock && !hasBackroomStock}
              className={`py-2.5 px-3 rounded-xl font-heading font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all ${
                hasFloorStock || hasBackroomStock
                  ? 'btn-3d bg-purple-600 hover:bg-purple-700 text-white shadow-game-btn'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cầm Lên Tay ✋</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
