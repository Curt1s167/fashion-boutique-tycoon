import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpCircle, CheckCheck } from 'lucide-react';
import { useGame } from '../context/GameContext';
import type { GameState } from '../types/game';

export const ShopUpgrades: React.FC = () => {
  const { state, upgradeShop } = useGame();

  const upgradeKeys: (keyof GameState['upgrades'])[] = [
    'fittingRooms',
    'posCounter',
    'shopSpace',
    'marketing',
    'staffAuto',
    'backroomStorage',
    'deliverySpeed'
  ];

  return (
    <div className="space-y-6">
      {/* 🚀 STITCH BRANCH UPGRADES HERO BANNER (Screen 10) */}
      <div className="stitch-panel overflow-hidden p-4 md:p-5 bg-[#fffaf2]">
        <div className="stitch-scallop-trim"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#ead7bd] shadow-[0_3px_0_#936451] shrink-0 bg-white">
              <img 
                src="/stitch/10_screen_fitting.png" 
                alt="Shop Upgrades" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-black uppercase text-[#ef6f8e] bg-[#ffe9e4] px-2 py-0.5 rounded-full border border-[#ead7bd]">
                  ĐẦU TƯ CƠ SỞ VẬT CHẤT
                </span>
                <span className="text-xs text-[#4fa883] font-bold">✨ Tối Ưu Năng Suất</span>
              </div>
              <h2 className="text-lg md:text-xl font-heading font-extrabold text-[#3a2317] m-0">
                Quản Trị & Nâng Cấp Chi Nhánh
              </h2>
              <p className="text-xs text-[#7a5a48] mt-0.5">
                Đầu tư mở rộng phòng thử đồ nhung cao cấp, máy tính tiền POS và không gian boutique.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-white px-3.5 py-2 rounded-2xl border-2 border-[#ead7bd] shadow-[0_2px_0_#936451] text-xs font-bold text-[#ef6f8e]">
              <span>Ngân sách: <b className="text-[#3a2317]">{state.cash.toLocaleString('vi-VN')}₫</b></span>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrades List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upgradeKeys.map((key) => {
          const item = state.upgrades[key];
          const isMax = item.level >= item.maxLevel;
          const nextCost = Math.round(item.baseCost * Math.pow(item.costMultiplier, item.level - 1));
          const canAfford = state.cash >= nextCost;

          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-5 border-2 border-purple-100 hover:border-purple-300 shadow-game-card flex flex-col justify-between transition-all"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 border-2 border-purple-200 flex items-center justify-center text-3xl shadow-sm">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-heading font-bold text-slate-800 m-0">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                          Cấp {item.level} / {item.maxLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Effect Badge */}
                <div className="bg-pink-50 border border-pink-200 rounded-2xl p-2.5 mb-4">
                  <div className="text-[10px] font-bold text-pink-500 uppercase tracking-wider mb-0.5">
                    Hiệu quả mang lại:
                  </div>
                  <div className="text-xs font-bold text-pink-700">
                    ⚡ {item.effect}
                  </div>
                </div>
              </div>

              {/* Upgrade Button */}
              <div>
                {isMax ? (
                  <div className="w-full py-3 rounded-2xl bg-slate-100 text-slate-400 font-heading font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200">
                    <CheckCheck className="w-4 h-4 text-emerald-500" />
                    <span>ĐÃ ĐẠT CẤP TỐI ĐA</span>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => upgradeShop(key)}
                    disabled={!canAfford}
                    className={`btn-3d w-full py-3 px-4 rounded-2xl font-heading font-bold text-xs md:text-sm flex items-center justify-between transition-all ${
                      canAfford
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-game-btn'
                        : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <ArrowUpCircle className="w-4 h-4" />
                      Nâng cấp lên Cấp {item.level + 1}
                    </span>
                    <span className="font-extrabold">
                      {nextCost.toLocaleString('vi-VN')} đ
                    </span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
