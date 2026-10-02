import React from 'react';
import { motion } from 'framer-motion';
import { 
  Boxes, 
  TrendingUp, 
  Sparkles, 
  CheckCircle,
  Truck
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import type { ItemCategory } from '../types/game';

export const InventoryWholesale: React.FC = () => {
  const { state, restockItem } = useGame();
  const categories: ItemCategory[] = ['tshirt', 'jeans', 'sneaker', 'handbag'];

  return (
    <div className="space-y-6">
      {/* Wholesale Banner */}
      <div className="bg-gradient-to-r from-amber-100 via-pink-100 to-rose-100 p-5 rounded-3xl border-2 border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-amber-500 shadow-sm font-bold text-2xl">
            📦
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-heading font-extrabold text-slate-800 m-0 flex items-center gap-2">
              Chợ Đầu Mối Nhập Hàng Sỉ
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            </h2>
            <p className="text-xs md:text-sm text-slate-600">
              Nhập hàng giá xuất xưởng, tối ưu biên lợi nhuận để phát triển tiệm!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-2xl border border-amber-300">
          <Truck className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-amber-900">
            Giao hàng tức thì 0 giây
          </span>
        </div>
      </div>

      {/* Grid of 4 Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((catKey) => {
          const item = state.inventory[catKey];
          const spaceLeft = item.shelfCapacity - item.stock;
          const profitPerItem = item.sellPrice - item.costPrice;
          const profitMargin = Math.round((profitPerItem / item.sellPrice) * 100);

          const costFor5 = item.costPrice * 5;
          const costFor10 = item.costPrice * 10;
          const costForMax = item.costPrice * spaceLeft;

          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-5 border-2 border-pink-200 shadow-game-card relative overflow-hidden"
            >
              {/* Product Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-pink-50 border-2 border-pink-200 flex items-center justify-center text-3xl shadow-sm">
                    {item.emoji}
                  </div>
                  <div>
                    <h3 className="text-base font-heading font-bold text-slate-800 m-0">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 text-right">
                  <span className="text-[10px] font-bold text-emerald-600 block">
                    Biên lãi
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +{profitMargin}%
                  </span>
                </div>
              </div>

              {/* Price comparison metrics */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl mb-4 border border-slate-100 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Giá sỉ</span>
                  <span className="text-xs font-bold text-slate-700">
                    {item.costPrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Giá bán lẻ</span>
                  <span className="text-xs font-bold text-pink-600">
                    {item.sellPrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Lãi ròng/cái</span>
                  <span className="text-xs font-bold text-emerald-600">
                    +{profitPerItem.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              {/* Stock Bar */}
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1">
                    <Boxes className="w-3.5 h-3.5 text-pink-500" />
                    Tồn kho kệ hàng:
                  </span>
                  <span>{item.stock} / {item.shelfCapacity} món</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      item.stock === 0 
                        ? 'bg-rose-400' 
                        : item.stock < 5 
                        ? 'bg-amber-400' 
                        : 'bg-gradient-to-r from-pink-400 to-rose-500'
                    }`}
                    style={{ width: `${(item.stock / item.shelfCapacity) * 100}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons for Restocking */}
              <div className="grid grid-cols-3 gap-2">
                {/* Buy 5 */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => restockItem(catKey, 5)}
                  disabled={spaceLeft < 1 || state.cash < costFor5}
                  className={`btn-3d py-2 px-1 rounded-2xl text-xs font-heading font-bold flex flex-col items-center justify-center transition-all ${
                    spaceLeft < 1 || state.cash < costFor5
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-pink-500 hover:bg-pink-600 text-white shadow-game-btn-pink'
                  }`}
                >
                  <span>+5 chiếc</span>
                  <span className="text-[10px] font-normal opacity-90">
                    {(costFor5 / 1000).toFixed(0)}k đ
                  </span>
                </motion.button>

                {/* Buy 10 */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => restockItem(catKey, 10)}
                  disabled={spaceLeft < 5 || state.cash < costFor10}
                  className={`btn-3d py-2 px-1 rounded-2xl text-xs font-heading font-bold flex flex-col items-center justify-center transition-all ${
                    spaceLeft < 5 || state.cash < costFor10
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-purple-500 hover:bg-purple-600 text-white shadow-game-btn'
                  }`}
                >
                  <span>+10 chiếc</span>
                  <span className="text-[10px] font-normal opacity-90">
                    {(costFor10 / 1000).toFixed(0)}k đ
                  </span>
                </motion.button>

                {/* Fill Max */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => restockItem(catKey, spaceLeft)}
                  disabled={spaceLeft === 0 || state.cash < item.costPrice}
                  className={`btn-3d py-2 px-1 rounded-2xl text-xs font-heading font-bold flex flex-col items-center justify-center transition-all ${
                    spaceLeft === 0 || state.cash < item.costPrice
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-game-btn-green'
                  }`}
                >
                  <span className="flex items-center gap-0.5">
                    <CheckCircle className="w-3 h-3" /> Đầy kệ ({spaceLeft})
                  </span>
                  <span className="text-[10px] font-normal opacity-90">
                    {(costForMax / 1000).toFixed(0)}k đ
                  </span>
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
