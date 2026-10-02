import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, RotateCcw, AlertCircle, ShoppingBag } from 'lucide-react';
import type { Customer } from '../../types/game';

interface PrepItem {
  id: string;
  styleId: string;
  styleName: string;
  variantId: string;
  size: string;
  colorName: string;
  colorHex: string;
  emoji: string;
  sellPrice: number;
  costPrice: number;
  source: 'rack' | 'backroom' | 'fitting_return';
  state: 'EMPTY' | 'PREPARED' | 'CUSTOMER_HOLD' | 'FITTING' | 'CART_RESERVED' | 'RETURN_REQUIRED';
}

interface PreparationTableProps {
  items: PrepItem[];
  customer?: Customer;
  onRemoveItem: (itemId: string, returnTarget: 'rack' | 'backroom') => void;
  onClearTable: () => void;
  onHandToCustomer: (customerId: string) => void;
}

export const PreparationTable: React.FC<PreparationTableProps> = ({
  items,
  customer,
  onRemoveItem,
  onClearTable,
  onHandToCustomer
}) => {
  const expectedSize = customer?.requestedAlternativeSize || customer?.requestedSize;
  const isTargetMatched = customer && items.some(
    i => i.styleId === customer.targetStyleId && i.size === expectedSize
  );

  return (
    <div className="bg-gradient-to-br from-amber-50/90 via-pink-50/80 to-purple-50/90 p-3.5 rounded-3xl border-2 border-amber-200 shadow-game-card">
      {/* Table Header */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-amber-200/80">
        <div className="flex items-center gap-2">
          <span className="text-xl">🪡</span>
          <div>
            <h3 className="text-xs md:text-sm font-heading font-extrabold text-slate-800 m-0">
              Bàn Chuẩn Bị Trang Phục ({items.length}/6 món)
            </h3>
            <span className="text-[10px] text-amber-800 font-semibold">
              Khu vực phối đồ & đóng gói trước khi chuyển giao khách
            </span>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={onClearTable}
            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold flex items-center gap-1"
            title="Cất tất cả về kệ"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Dọn bàn</span>
          </button>
        )}
      </div>

      {/* Accounting Notice */}
      <div className="bg-white/80 py-1 px-2.5 rounded-xl border border-amber-200/60 text-[10px] text-slate-500 font-semibold flex items-center justify-between mb-2.5">
        <span>⚠️ Hàng trên bàn chuẩn bị:</span>
        <span className="font-extrabold text-amber-700">CHƯA CỘNG DOANH THU & TIỀN MẶT</span>
      </div>

      {/* 6 Grid Slots */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
        {[...Array(6)].map((_, index) => {
          const item = items[index];
          if (!item) {
            return (
              <div 
                key={index}
                className="h-20 rounded-2xl border-2 border-dashed border-amber-200/70 bg-white/40 flex flex-col items-center justify-center text-slate-300 text-[10px]"
              >
                <span>Vị trí #{index + 1}</span>
                <span className="text-xs opacity-40">Trống</span>
              </div>
            );
          }

          const isExactMatch = customer && item.styleId === customer.targetStyleId && item.size === expectedSize;
          const isWrongSize = customer && item.styleId === customer.targetStyleId && item.size !== expectedSize;

          return (
            <motion.div
              key={item.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-2 rounded-2xl border-2 bg-white flex flex-col justify-between shadow-xs transition-all ${
                isExactMatch 
                  ? 'border-emerald-400 bg-emerald-50/40 ring-2 ring-emerald-300' 
                  : isWrongSize
                  ? 'border-amber-400 bg-amber-50/40'
                  : 'border-pink-200'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-2xl">{item.emoji}</span>
                <div className="min-w-0">
                  <span className="font-heading font-extrabold text-[11px] text-slate-800 line-clamp-1 block">
                    {item.styleName}
                  </span>
                  <div className="text-[10px] text-pink-600 font-bold flex items-center gap-1">
                    <span>Size {item.size}</span>
                    <span 
                      className="w-2.5 h-2.5 rounded-full inline-block border border-slate-300"
                      style={{ backgroundColor: item.colorHex }}
                      title={item.colorName}
                    />
                  </div>
                </div>
              </div>

              {/* Status & Quick Clear */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[9px] font-bold">
                <span className={isExactMatch ? 'text-emerald-700' : 'text-slate-500'}>
                  {item.state}
                </span>
                <button
                  onClick={() => onRemoveItem(item.id, 'rack')}
                  className="text-slate-400 hover:text-rose-600 underline"
                  title="Cất lại về kệ"
                >
                  Cất kệ
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Hand to Customer CTA */}
      {customer && (
        <div>
          {isTargetMatched ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onHandToCustomer(customer.id)}
              className="btn-3d w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-heading font-extrabold text-xs shadow-game-btn-green flex items-center justify-center gap-2 animate-bounceShort"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Đưa Đúng Size {expectedSize} Cho {customer.name} Thử Đồ! ✨</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <div className="py-2 px-3 rounded-xl bg-slate-100 text-slate-500 text-[11px] font-semibold flex items-center justify-center gap-1.5 border border-slate-200">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Chưa có đúng {customer.targetCategory} size {expectedSize} trên bàn. Hãy chọn từ kệ hàng!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
