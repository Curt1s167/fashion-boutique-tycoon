import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  ShoppingBag, 
  AlertCircle, 
  HeartHandshake,
  CheckCircle2,
  ArrowDownToLine,
  Undo2,
  Check,
  X
} from 'lucide-react';
import { useGame } from '../context/GameContext';

export const ShopFloor: React.FC = () => {
  const { 
    state, 
    serveCustomer, 
    rushFitting, 
    rushCheckout, 
    replenishAllStyleToFloor,
    resolveReturn,
    setActiveTab 
  } = useGame();

  const fittingCustomers = state.customers.filter(c => c.state === 'fitting');
  const checkoutCustomers = state.customers.filter(c => c.state === 'checkout');
  const browsingCustomers = state.customers.filter(c => c.state === 'browsing' || c.state === 'entering');

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
              Sàn Bán Hàng ({state.customers.length}/{3 + state.upgrades.shopSpace.level * 2} khách)
            </h2>
            <p className="text-xs text-slate-500">
              Chạm vào khách để Stylist tư vấn phục vụ và hồi phục kiên nhẫn!
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

      {/* Return & Exchange Desk (If any pending) */}
      {state.returnRequests.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-heading font-bold text-rose-800 flex items-center gap-2 m-0">
              <Undo2 className="w-4 h-4 text-rose-600" />
              Quầy Yêu Cầu Đổi Trả Hàng ({state.returnRequests.length})
            </h3>
            <span className="text-[11px] text-rose-500 font-semibold">
              Giải quyết nhanh để giữ uy tín shop
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {state.returnRequests.map(ret => (
              <div key={ret.id} className="bg-white p-3 rounded-2xl border border-rose-200 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{ret.customerAvatar}</span>
                  <div>
                    <div className="text-xs font-heading font-bold text-slate-800">
                      {ret.customerName} • <span className="text-rose-600">{ret.styleName}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Lý do: {ret.reasonText}
                    </div>
                    <div className="text-[10px] font-bold text-slate-700">
                      Hoàn: {ret.refundAmount.toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => resolveReturn(ret.id, true)}
                    className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-xs"
                    title="Đồng ý đổi/hoàn tiền"
                  >
                    <Check className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => resolveReturn(ret.id, false)}
                    className="p-2 bg-slate-200 hover:bg-rose-200 text-slate-600 hover:text-rose-700 rounded-xl"
                    title="Từ chối"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6 Fashion Racks with Variant Availability */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-heading font-bold text-slate-700 flex items-center gap-1.5 m-0">
            <ShoppingBag className="w-4 h-4 text-pink-500" />
            Kệ Hàng Thời Trang Trưng Bày
          </h3>
          <button 
            onClick={() => setActiveTab('inventory')}
            className="text-xs font-bold text-pink-600 hover:text-pink-700 hover:underline flex items-center gap-1"
          >
            Chi tiết ma trận Size & Màu →
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {Object.values(state.styles).map((style) => {
            const totalFloor = style.variants.reduce((sum, v) => sum + v.floorStock, 0);
            const totalBackroom = style.variants.reduce((sum, v) => sum + v.backroomStock, 0);
            const isOutOfStock = totalFloor === 0;
            const canReplenish = totalBackroom > 0;

            return (
              <motion.div
                key={style.id}
                animate={{ y: [0, -5, 0] }}
                transition={{ 
                  duration: 3 + (style.id.length % 2), 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className={`relative bg-white rounded-3xl p-4 border-2 shadow-game-card transition-all flex flex-col justify-between ${
                  isOutOfStock && !canReplenish
                    ? 'border-rose-300 bg-rose-50/40' 
                    : isOutOfStock && canReplenish
                    ? 'border-amber-300 bg-amber-50/30'
                    : 'border-pink-200'
                }`}
              >
                <div>
                  {/* Out of Stock Badges */}
                  {isOutOfStock && !canReplenish && (
                    <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-heading font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 animate-bounceShort">
                      <AlertCircle className="w-3 h-3" /> HẾT CẢ KHO
                    </div>
                  )}
                  {isOutOfStock && canReplenish && (
                    <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-heading font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                      📦 KHO CÒN HÀNG
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-2">
                    <div className="text-3xl md:text-4xl filter drop-shadow">
                      {style.emoji}
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-pink-600 block">
                        {style.basePrice.toLocaleString('vi-VN')}đ
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {style.variants.length} phân loại size
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xs md:text-sm font-heading font-bold text-slate-800 line-clamp-1 mb-1">
                    {style.name}
                  </h4>

                  {/* Stock Metrics (Floor vs Backroom) */}
                  <div className="space-y-1 mb-3 bg-slate-50 p-2 rounded-xl text-[11px] font-semibold">
                    <div className="flex justify-between text-slate-700">
                      <span>Trên kệ bán lẻ:</span>
                      <span className={totalFloor === 0 ? 'text-rose-500 font-bold' : 'text-emerald-700 font-bold'}>
                        {totalFloor} / {style.shelfCapacity}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[10px]">
                      <span>Kho chứa phía sau:</span>
                      <span className="text-purple-600 font-bold">
                        {totalBackroom} chiếc
                      </span>
                    </div>
                  </div>

                  {/* Variant Pills Preview */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {style.variants.slice(0, 3).map(v => (
                      <span key={v.id} className="text-[9px] bg-pink-100/70 text-pink-700 px-1.5 py-0.5 rounded-md font-semibold">
                        {v.size} ({v.floorStock})
                      </span>
                    ))}
                    {style.variants.length > 3 && (
                      <span className="text-[9px] text-slate-400 py-0.5">+{style.variants.length - 3}</span>
                    )}
                  </div>
                </div>

                {/* Replenish Button from Backroom */}
                <div>
                  {canReplenish ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => replenishAllStyleToFloor(style.id)}
                      className="btn-3d w-full py-1.5 px-2 rounded-xl text-xs font-heading font-bold bg-purple-500 hover:bg-purple-600 text-white shadow-game-btn flex items-center justify-center gap-1.5"
                    >
                      <ArrowDownToLine className="w-3.5 h-3.5" />
                      <span>Đưa {totalBackroom} cái lên kệ</span>
                    </motion.button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('procurement')}
                      className="w-full py-1.5 px-2 rounded-xl text-xs font-heading font-bold bg-slate-100 hover:bg-pink-100 text-slate-500 hover:text-pink-600 border border-slate-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Đặt thêm từ xưởng →</span>
                    </button>
                  )}
                </div>
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
                      <div className="text-[9px] text-purple-600 font-medium truncate">
                        Thử Size {cust.requestedSize}
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div 
                          className="bg-purple-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${cust.stateProgress}%` }}
                        />
                      </div>
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
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 border-2 border-pink-200 shadow-game-card">
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
            Tiệm đang chuẩn bị đón lượt khách tiếp theo...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {browsingCustomers.map((cust) => {
              const targetStyle = state.styles[cust.targetStyleId];
              const targetVar = targetStyle?.variants.find(v => v.id === cust.cartVariantId);
              const isFloorOutOfStock = targetVar ? targetVar.floorStock === 0 : false;
              const hasBackroomStock = targetVar ? targetVar.backroomStock > 0 : false;

              return (
                <motion.div
                  key={cust.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => serveCustomer(cust.id)}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                    isFloorOutOfStock
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
                        <div className="text-[10px] text-pink-600 font-semibold flex items-center gap-1">
                          {cust.archetype}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 mb-2">
                    Tìm: <span className="font-bold text-slate-800">{targetStyle?.name}</span> ({cust.preferredColor} - Size {cust.requestedSize})
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

                  {isFloorOutOfStock && (
                    <div className="mt-2 text-[10px] font-bold flex items-center justify-between bg-rose-100 text-rose-700 px-2 py-1 rounded-xl">
                      <span>{hasBackroomStock ? 'Kho còn size này!' : 'Đã hết hàng!'}</span>
                      {hasBackroomStock && (
                        <span className="underline">Lấy ngay</span>
                      )}
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
