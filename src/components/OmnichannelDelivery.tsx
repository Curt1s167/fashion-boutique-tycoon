import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Zap, 
  Check, 
  Globe, 
  Store
} from 'lucide-react';
import { useGame } from '../context/GameContext';

export const OmnichannelDelivery: React.FC = () => {
  const { state, speedUpOnlineOrder, unlockBranch } = useGame();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-100 via-emerald-100 to-cyan-100 p-5 rounded-3xl border-2 border-emerald-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm font-bold text-2xl">
            🛵
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-heading font-extrabold text-slate-800 m-0 flex items-center gap-2">
              Đơn Online Đa Kênh & Bản Đồ Chi Nhánh
            </h2>
            <p className="text-xs md:text-sm text-slate-600">
              Giao hàng hỏa tốc cho khách đặt qua mạng và mở rộng chuỗi thời trang khắp toàn quốc.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Live Online Orders Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-heading font-bold text-slate-800 flex items-center gap-2 m-0">
            <Globe className="w-4 h-4 text-emerald-600" />
            Đơn Hàng Online Đang Xử Lý ({state.onlineOrders.length})
          </h3>
          <span className="text-xs text-slate-500">
            {state.upgrades.deliverySpeed.level === 0 ? 'Nâng cấp Shipper ở tab Nâng Cấp để nhận thêm đơn' : 'Đang tự động nhận đơn từ App'}
          </span>
        </div>

        {state.onlineOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-slate-200 text-center text-slate-400">
            <span className="text-4xl block mb-2">📦</span>
            <p className="text-xs font-semibold m-0">
              Chưa có đơn hàng online mới. Hãy nâng cấp "Đội Shipper Hỏa Tốc" để tăng đơn đặt hàng!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {state.onlineOrders.map(ord => (
              <div key={ord.id} className="bg-white rounded-3xl p-4 border-2 border-emerald-200 shadow-game-card">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{ord.customerAvatar}</span>
                    <div>
                      <h4 className="text-xs font-heading font-bold text-slate-800 m-0">
                        {ord.customerName}
                      </h4>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        {ord.styleName} ({ord.variantDesc})
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600">
                    +{ord.totalAmount.toLocaleString('vi-VN')}đ
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                    <span>Đang đóng gói & giao hàng</span>
                    <span className="text-emerald-700 font-bold">{ord.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className="bg-emerald-500 h-full rounded-full"
                      animate={{ width: `${ord.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => speedUpOnlineOrder(ord.id)}
                  className="w-full py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Đẩy nhanh shipper (+40%)</span>
                </motion.button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Chain Branch Management Section */}
      <div>
        <h3 className="text-base font-heading font-bold text-slate-800 flex items-center gap-2 mb-3 m-0">
          <Store className="w-4 h-4 text-purple-600" />
          Mạng Lưới Chi Nhánh Thương Hiệu
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {state.branches.map(branch => {
            const canAfford = state.cash >= branch.unlockCost;

            return (
              <div 
                key={branch.id}
                className={`p-5 rounded-3xl border-2 transition-all bg-white shadow-game-card flex flex-col justify-between ${
                  branch.isUnlocked ? 'border-purple-300 bg-purple-50/20' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{branch.icon}</span>
                    <div>
                      <h4 className="text-sm font-heading font-bold text-slate-800 m-0">
                        {branch.name}
                      </h4>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-pink-500" /> {branch.district}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-2xl my-3 text-xs space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Cộng dồn doanh thu:</span>
                      <b className="text-purple-600">+{branch.revenueBonusPercent}%</b>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[10px]">
                      <span>Chi phí mặt bằng:</span>
                      <span>{branch.dailyRent > 0 ? `${branch.dailyRent.toLocaleString('vi-VN')}đ/ngày` : 'Miễn phí'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {branch.isUnlocked ? (
                    <div className="w-full py-2.5 bg-emerald-100 text-emerald-800 rounded-2xl text-xs font-heading font-bold flex items-center justify-center gap-1">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>ĐANG HOẠT ĐỘNG</span>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => unlockBranch(branch.id)}
                      disabled={!canAfford}
                      className={`btn-3d w-full py-2.5 rounded-2xl font-heading font-bold text-xs flex items-center justify-between px-3 transition-all ${
                        canAfford
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-game-btn'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <span>Mở chi nhánh</span>
                      <span>{branch.unlockCost.toLocaleString('vi-VN')}đ</span>
                    </motion.button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
