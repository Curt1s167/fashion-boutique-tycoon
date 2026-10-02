import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Sparkles, 
  ArrowDownToLine,
  Truck,
  Layers
} from 'lucide-react';
import { useGame } from '../context/GameContext';

export const InventoryWholesale: React.FC = () => {
  const { state, replenishVariantToFloor, replenishAllStyleToFloor, setActiveTab } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'tops', label: 'Áo Nữ' },
    { id: 'bottoms', label: 'Quần Jeans' },
    { id: 'footwear', label: 'Giày Sneaker' },
    { id: 'bags', label: 'Túi Xách' },
    { id: 'outerwear', label: 'Áo Khoác' },
    { id: 'accessories', label: 'Phụ Kiện' }
  ];

  const filteredStyles = Object.values(state.styles).filter(style => {
    if (selectedCategory === 'all') return true;
    return style.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-100 via-pink-100 to-rose-100 p-5 rounded-3xl border-2 border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-amber-500 shadow-sm font-bold text-2xl">
            📦
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-heading font-extrabold text-slate-800 m-0 flex items-center gap-2">
              Quản Lý Tồn Kho & Ma Trận Phân Loại (SKU)
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            </h2>
            <p className="text-xs md:text-sm text-slate-600">
              Kiểm soát số lượng từng màu và size giữa Sàn bán hàng và Kho sau.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('procurement')}
          className="btn-3d px-4 py-2.5 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-heading font-bold text-xs flex items-center gap-1.5 shadow-game-btn-pink"
        >
          <Truck className="w-4 h-4" />
          <span>Đặt hàng từ xưởng sỉ →</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-heading font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-pink-50 border border-pink-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* List of Styles and Variant Matrix */}
      <div className="space-y-4">
        {filteredStyles.map(style => {
          const totalFloor = style.variants.reduce((sum, v) => sum + v.floorStock, 0);
          const totalBackroom = style.variants.reduce((sum, v) => sum + v.backroomStock, 0);
          const totalSold = style.variants.reduce((sum, v) => sum + v.salesCount, 0);
          const profitPerItem = style.basePrice - style.baseCost;
          const margin = Math.round((profitPerItem / style.basePrice) * 100);

          return (
            <motion.div
              key={style.id}
              whileHover={{ y: -2 }}
              className="bg-white rounded-3xl p-5 border-2 border-pink-200 shadow-game-card"
            >
              {/* Style Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-pink-50 border-2 border-pink-200 flex items-center justify-center text-3xl shadow-sm">
                    {style.emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-heading font-bold text-slate-800 m-0">
                        {style.name}
                      </h3>
                      <span className="text-[10px] bg-pink-100 text-pink-700 font-bold px-2 py-0.5 rounded-full">
                        {style.categoryLabel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {style.description}
                    </p>
                  </div>
                </div>

                {/* Price & Margins */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-700">
                      Giá sỉ: {style.baseCost.toLocaleString('vi-VN')}đ • Giá bán: <span className="text-pink-600">{style.basePrice.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-1 mt-0.5">
                      <TrendingUp className="w-3.5 h-3.5" /> Biên lãi: +{margin}% (Lãi {(profitPerItem / 1000).toFixed(0)}k/cái)
                    </div>
                  </div>

                  {totalBackroom > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => replenishAllStyleToFloor(style.id)}
                      className="btn-3d px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-xs font-heading font-bold flex items-center gap-1 shadow-game-btn"
                    >
                      <ArrowDownToLine className="w-3.5 h-3.5" />
                      <span>Đưa tất cả lên kệ</span>
                    </motion.button>
                  )}
                </div>
              </div>

              {/* SKU Variant Matrix Table */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-100 font-semibold text-[11px]">
                      <th className="pb-2">Mã SKU</th>
                      <th className="pb-2">Màu Sắc</th>
                      <th className="pb-2">Size</th>
                      <th className="pb-2 text-center">Trên Kệ</th>
                      <th className="pb-2 text-center">Kho Sau</th>
                      <th className="pb-2 text-center">Đã Bán</th>
                      <th className="pb-2 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {style.variants.map(variant => (
                      <tr key={variant.id} className="hover:bg-pink-50/40 transition-colors">
                        <td className="py-2.5 font-mono font-bold text-slate-600">
                          {variant.id}
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-1.5">
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block shadow-xs" 
                              style={{ backgroundColor: variant.colorHex }}
                            />
                            <span className="font-semibold text-slate-700">{variant.colorName}</span>
                          </div>
                        </td>
                        <td className="py-2.5">
                          <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md text-[11px]">
                            {variant.size}
                          </span>
                        </td>
                        <td className="py-2.5 text-center">
                          <span className={`font-bold ${variant.floorStock === 0 ? 'text-rose-500' : 'text-slate-800'}`}>
                            {variant.floorStock}
                          </span>
                        </td>
                        <td className="py-2.5 text-center font-bold text-purple-600">
                          {variant.backroomStock}
                        </td>
                        <td className="py-2.5 text-center text-slate-500">
                          {variant.salesCount}
                        </td>
                        <td className="py-2.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => replenishVariantToFloor(style.id, variant.id, 2)}
                              disabled={variant.backroomStock === 0}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                variant.backroomStock > 0
                                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              +2 lên kệ
                            </motion.button>
                            <button
                              onClick={() => setActiveTab('procurement')}
                              className="px-2 py-1 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-lg text-[10px] font-bold"
                            >
                              Đặt thêm
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Style Footer Totals */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1 text-slate-700">
                  <Layers className="w-3.5 h-3.5 text-pink-500" />
                  Tổng tồn kho sản phẩm: <b className="text-slate-900">{totalFloor + totalBackroom} chiếc</b>
                </span>
                <span>
                  Đã bán tích lũy: <b className="text-emerald-600">{totalSold} chiếc</b>
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
