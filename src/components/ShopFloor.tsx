import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  ShoppingBag, 
  PlusCircle, 
  AlertCircle, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import type { ItemCategory } from '../types/game';

export const ShopFloor: React.FC = () => {
  const { 
    state, 
    serveCustomer, 
    rushFitting, 
    rushCheckout, 
    setActiveTab, 
    restockItem 
  } = useGame();

  const fittingCustomers = state.customers.filter(c => c.state === 'fitting');
  const checkoutCustomers = state.customers.filter(c => c.state === 'checkout');
  const browsingCustomers = state.customers.filter(c => c.state === 'browsing' || c.state === 'entering');

  const categories: ItemCategory[] = ['tshirt', 'jeans', 'sneaker', 'handbag'];

  return (
    <div className="space-y-6">
      {/* Top Banner Quick Actions */}
      <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-amber-100 p-4 rounded-3xl border-2 border-pink-200 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-pink-500 shadow-sm font-bold text-lg">
            👗
          </div>
          <div>
            <h2 className="text-base md:text-lg font-heading font-bold text-slate-800 m-0">
              Mặt Bằng Cửa Hàng ({state.customers.length}/{3 + state.upgrades.shopSpace.level * 2} khách)
            </h2>
            <p className="text-xs text-slate-500">
              Chạm vào khách để Stylist tư vấn tăng kiên nhẫn!
            </p>
          </div>
        </div>

        {/* Quick Rush Action Buttons */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={rushFitting}
            disabled={fittingCustomers.length === 0}
            className={`btn-3d px-3 py-2 rounded-2xl font-heading text-xs font-bold flex items-center gap-1.5 transition-all ${
              fittingCustomers.length > 0
                ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-game-btn'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Thử đồ nhanh ({fittingCustomers.length})</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={rushCheckout}
            disabled={checkoutCustomers.length === 0}
            className={`btn-3d px-3 py-2 rounded-2xl font-heading text-xs font-bold flex items-center gap-1.5 transition-all ${
              checkoutCustomers.length > 0
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-game-btn-green'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Thu ngân nhanh ({checkoutCustomers.length})</span>
          </motion.button>
        </div>
      </div>

      {/* 4 Fashion Racks with Juicy Floating Animation */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-heading font-bold text-slate-700 flex items-center gap-1.5 m-0">
            <ShoppingBag className="w-4 h-4 text-pink-500" />
            Kệ Hàng Thời Trang
          </h3>
          <button 
            onClick={() => setActiveTab('inventory')}
            className="text-xs font-bold text-pink-600 hover:text-pink-700 hover:underline flex items-center gap-1"
          >
            Quản lý kho sỉ →
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {categories.map((catKey) => {
            const item = state.inventory[catKey];
            const isOutOfStock = item.stock === 0;
            const isLowStock = item.stock <= 3 && !isOutOfStock;
            const stockPercent = Math.min(100, (item.stock / item.shelfCapacity) * 100);

            return (
              <motion.div
                key={item.id}
                animate={{ y: [0, -6, 0] }}
                transition={{ 
                  duration: 3 + (catKey.length % 2), 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className={`relative bg-white rounded-3xl p-4 border-2 shadow-game-card transition-all ${
                  isOutOfStock 
                    ? 'border-rose-300 bg-rose-50/50' 
                    : isLowStock 
                    ? 'border-amber-300' 
                    : 'border-pink-200'
                }`}
              >
                {/* Out of Stock Ribbon */}
                {isOutOfStock && (
                  <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-heading font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 animate-bounceShort">
                    <AlertCircle className="w-3 h-3" /> HẾT HÀNG!
                  </div>
                )}

                <div className="flex items-start justify-between mb-2">
                  <div className="text-3xl md:text-4xl filter drop-shadow">
                    {item.emoji}
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-pink-600 block">
                      {item.sellPrice.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Gốc: {item.costPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                <h4 className="text-xs md:text-sm font-heading font-bold text-slate-800 line-clamp-1 mb-1">
                  {item.name}
                </h4>

                {/* Stock progress */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <span>Còn lại:</span>
                    <span className={isOutOfStock ? 'text-rose-500 font-bold' : 'text-slate-700'}>
                      {item.stock} / {item.shelfCapacity}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOutOfStock 
                          ? 'bg-rose-400' 
                          : isLowStock 
                          ? 'bg-amber-400' 
                          : 'bg-gradient-to-r from-pink-400 to-rose-400'
                      }`}
                      style={{ width: `${stockPercent}%` }}
                    />
                  </div>
                </div>

                {/* Quick Restock Button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => restockItem(catKey, 5)}
                  disabled={item.stock >= item.shelfCapacity || state.cash < item.costPrice * 5}
                  className={`w-full py-1.5 px-2 rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-1 transition-all ${
                    item.stock >= item.shelfCapacity
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : state.cash < item.costPrice * 5
                      ? 'bg-rose-100 text-rose-400 cursor-not-allowed'
                      : 'bg-pink-500 hover:bg-pink-600 text-white shadow-game-btn-pink'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Nhập +5 ({((item.costPrice * 5) / 1000).toFixed(0)}k)</span>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Main Floor Interactive Areas: Fitting Rooms & POS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. VIP Fitting Rooms Section */}
        <div className="bg-white rounded-3xl p-5 border-2 border-purple-200 shadow-game-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪞</span>
              <div>
                <h3 className="text-sm md:text-base font-heading font-bold text-slate-800 m-0">
                  Phòng Thử Đồ VIP
                </h3>
                <span className="text-[11px] text-purple-600 font-semibold">
                  Cấp {state.upgrades.fittingRooms.level} • {fittingCustomers.length}/{state.upgrades.fittingRooms.level} đang dùng
                </span>
              </div>
            </div>
            {fittingCustomers.length > 0 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={rushFitting}
                className="px-2.5 py-1 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Zap className="w-3 h-3 fill-current" />
                Hối thúc ⚡
              </motion.button>
            )}
          </div>

          {/* Fitting Stalls */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[...Array(state.upgrades.fittingRooms.level)].map((_, index) => {
              const cust = fittingCustomers[index];
              return (
                <div 
                  key={index}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center min-h-[110px] transition-all ${
                    cust 
                      ? 'border-purple-300 bg-purple-50/60 shadow-sm' 
                      : 'border-dashed border-slate-200 bg-slate-50/40 text-slate-400'
                  }`}
                >
                  {cust ? (
                    <motion.div 
                      className="w-full text-center cursor-pointer"
                      onClick={() => serveCustomer(cust.id)}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-2xl mb-1 animate-bounceShort">
                        {cust.avatar}
                      </div>
                      <div className="text-[11px] font-heading font-bold text-purple-900 truncate">
                        {cust.name}
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                        <div 
                          className="bg-purple-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${cust.stateProgress}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-purple-600 font-bold block mt-0.5">
                        Thử đồ {cust.stateProgress}%
                      </span>
                    </motion.div>
                  ) : (
                    <div className="text-center">
                      <span className="text-xl opacity-40">🚪</span>
                      <span className="text-[10px] block mt-1">Phòng trống</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. POS Checkout Counter Section */}
        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-200 shadow-game-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💳</span>
              <div>
                <h3 className="text-sm md:text-base font-heading font-bold text-slate-800 m-0">
                  Quầy Thu Ngân POS
                </h3>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  Cấp {state.upgrades.posCounter.level} • {checkoutCustomers.length} khách đang đợi tính tiền
                </span>
              </div>
            </div>
            {checkoutCustomers.length > 0 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={rushCheckout}
                className="px-2.5 py-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Zap className="w-3 h-3 fill-current" />
                Quẹt thẻ ngay ⚡
              </motion.button>
            )}
          </div>

          {/* Checkout Queue */}
          {checkoutCustomers.length === 0 ? (
            <div className="h-[110px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/40 text-slate-400">
              <span className="text-xl opacity-40">🛒</span>
              <span className="text-xs mt-1">Chưa có khách chờ tính tiền</span>
            </div>
          ) : (
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {checkoutCustomers.map((cust) => (
                <motion.div
                  key={cust.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => serveCustomer(cust.id)}
                  className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-2 cursor-pointer shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{cust.avatar}</span>
                    <div>
                      <div className="text-xs font-heading font-bold text-slate-800">
                        {cust.name}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold">
                        Hóa đơn: {cust.billAmount?.toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  </div>

                  <div className="w-24">
                    <div className="w-full bg-emerald-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${cust.stateProgress}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-right block text-emerald-600 font-bold mt-0.5">
                      {cust.stateProgress}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Browsing Customers on Shop Floor */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 border-2 border-pink-200 shadow-game-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm md:text-base font-heading font-bold text-slate-800 flex items-center gap-2 m-0">
            <HeartHandshake className="w-4 h-4 text-pink-500" />
            Khách Đang Xem Hàng ({browsingCustomers.length})
          </h3>
          <span className="text-xs text-slate-400">
            Bấm vào khách để Stylist tư vấn phục vụ!
          </span>
        </div>

        {browsingCustomers.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <span className="text-3xl block mb-2">🛍️</span>
            Tiệm đang đón lượt khách tiếp theo...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {browsingCustomers.map((cust) => {
              const targetItem = state.inventory[cust.targetCategory];
              const isTargetOutOfStock = targetItem.stock === 0;

              return (
                <motion.div
                  key={cust.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => serveCustomer(cust.id)}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                    isTargetOutOfStock
                      ? 'bg-rose-50 border-rose-300 shadow-sm'
                      : 'bg-white border-pink-200 hover:border-pink-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{cust.avatar}</span>
                      <div>
                        <div className="text-xs font-heading font-bold text-slate-800">
                          {cust.name}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          Tìm {targetItem.emoji} {targetItem.name.split(' ')[0]}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Patience Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                      <span>Độ kiên nhẫn</span>
                      <span className={cust.patience < 30 ? 'text-rose-500 font-bold' : ''}>
                        {cust.patience}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          cust.patience > 60 
                            ? 'bg-emerald-500' 
                            : cust.patience > 30 
                            ? 'bg-amber-500' 
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${cust.patience}%` }}
                      />
                    </div>
                  </div>

                  {isTargetOutOfStock && (
                    <div className="mt-2 text-[10px] text-rose-600 font-bold flex items-center gap-1 bg-rose-100/70 px-2 py-0.5 rounded-lg">
                      <AlertCircle className="w-3 h-3" /> Hết món này rồi!
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
