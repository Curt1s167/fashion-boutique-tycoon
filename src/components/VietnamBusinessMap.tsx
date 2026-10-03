import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Store, 
  TrendingUp, 
  DollarSign, 
  Check, 
  Building,
  UserCheck
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { VIETNAM_CITIES } from '../data/fashionCatalog';

export const VietnamBusinessMap: React.FC = () => {
  const { state, unlockBranch, setActiveBranch } = useGame();
  const [selectedCityId, setSelectedCityId] = useState<string>('city-hcm');

  const selectedCity = VIETNAM_CITIES.find(c => c.id === selectedCityId) || VIETNAM_CITIES[0];
  const branchInCity = state.branches.find(b => b.cityId === selectedCity.id);
  const manager = branchInCity?.managerId ? state.employees.find(e => e.id === branchInCity.managerId) : null;

  const totalBranchesUnlocked = state.branches.filter(b => b.isUnlocked).length;

  return (
    <div className="space-y-6">
      {/* 🗺️ STITCH BRANCHES & BUSINESS NETWORK HERO BANNER (Screen 07) */}
      <div className="stitch-panel overflow-hidden p-4 md:p-5 bg-[#fffaf2]">
        <div className="stitch-scallop-trim"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#ead7bd] shadow-[0_3px_0_#936451] shrink-0 bg-white">
              <img 
                src="/stitch/07_screen_branches.png" 
                alt="Branches Network" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-black uppercase text-[#ef6f8e] bg-[#ffe9e4] px-2 py-0.5 rounded-full border border-[#ead7bd]">
                  HỆ THỐNG PHỦ SÓNG TOÀN QUỐC
                </span>
                <span className="text-xs text-[#4fa883] font-bold">● {totalBranchesUnlocked} Điểm Bán Hoạt Động</span>
              </div>
              <h2 className="text-lg md:text-xl font-heading font-extrabold text-[#3a2317] m-0">
                Chuỗi Chi Nhánh & Bản Đồ Kinh Doanh
              </h2>
              <p className="text-xs text-[#7a5a48] mt-0.5">
                Mở rộng cửa hàng tại các thành phố trọng điểm, khảo sát hành vi mua sắm địa phương.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-white px-3.5 py-2 rounded-2xl border-2 border-[#ead7bd] shadow-[0_2px_0_#936451] text-xs font-bold text-[#7a5a48]">
              <span>Quy mô: <b className="text-[#ef6f8e]">{totalBranchesUnlocked} / {state.branches.length} chi nhánh</b></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Map & City Detail Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Visual Map View */}
        <div className="lg:col-span-2 bg-gradient-to-b from-sky-50 via-teal-50/50 to-emerald-50 rounded-3xl p-6 border-2 border-emerald-200 shadow-game-card relative min-h-[420px] flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-heading font-bold text-emerald-900 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Bản đồ thị trường Việt Nam
            </span>
            <span className="text-[11px] text-slate-500">Chạm vào thành phố để khảo sát</span>
          </div>

          {/* Interactive City Pins on Map Layout */}
          <div className="relative my-8 h-[300px] w-full">
            {VIETNAM_CITIES.map(city => {
              const hasBranch = state.branches.some(b => b.cityId === city.id && b.isUnlocked);
              const isSelected = selectedCity.id === city.id;

              return (
                <motion.div
                  key={city.id}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCityId(city.id)}
                  style={{
                    position: 'absolute',
                    left: `${city.coordinates.x}%`,
                    top: `${city.coordinates.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className={`cursor-pointer flex flex-col items-center z-20 group`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-md transition-all ${
                    isSelected
                      ? 'bg-rose-500 text-white ring-4 ring-rose-200 scale-110'
                      : hasBranch
                      ? 'bg-emerald-500 text-white ring-2 ring-emerald-200'
                      : 'bg-white text-slate-600 border border-slate-300'
                  }`}>
                    {hasBranch ? '🏬' : '📍'}
                  </div>
                  <span className={`text-[10px] font-heading font-bold px-2 py-0.5 rounded-md shadow-xs mt-1 whitespace-nowrap ${
                    isSelected ? 'bg-rose-600 text-white' : 'bg-white text-slate-800'
                  }`}>
                    {city.cityName}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 bg-white/60 p-2.5 rounded-2xl border border-emerald-100 z-10">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Đã mở chi nhánh
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" /> Đang khảo sát mặt bằng
            </span>
          </div>
        </div>

        {/* Right: Selected City Market Profile & Branch Actions */}
        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-200 shadow-game-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                  Khu vực {selectedCity.region} Bộ
                </span>
                <h3 className="text-lg font-heading font-bold text-slate-800 m-0">
                  {selectedCity.cityName}
                </h3>
              </div>
              <span className="text-2xl">
                {branchInCity?.isUnlocked ? '🏬' : '🏙️'}
              </span>
            </div>

            {/* City Profile Metrics */}
            <div className="space-y-2 mb-4 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-2xl flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> Lưu lượng khách (Traffic):
                </span>
                <b className="text-slate-800">x{selectedCity.footTrafficIndex}</b>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-2xl flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Mức chi tiêu trung bình:
                </span>
                <b className="text-emerald-700">{selectedCity.avgSpending.toLocaleString('vi-VN')}đ / khách</b>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-2xl flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-purple-500" /> Tiền thuê mặt bằng:
                </span>
                <b className="text-slate-700">{selectedCity.rentPerDay.toLocaleString('vi-VN')}đ / ngày</b>
              </div>

              <div className="bg-pink-50 p-2.5 rounded-2xl border border-pink-100">
                <span className="text-[10px] text-pink-600 font-bold block mb-0.5">Xu hướng thời trang chủ đạo:</span>
                <span className="font-semibold text-pink-900">{selectedCity.dominantDemand}</span>
              </div>
            </div>

            {/* Branch Status in this city */}
            {branchInCity ? (
              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 mb-4 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-heading font-bold text-emerald-900">{branchInCity.name}</span>
                  <span className="text-emerald-700 font-bold">⭐ {branchInCity.rating}</span>
                </div>
                <p className="text-[11px] text-slate-600 m-0 mb-2">{branchInCity.district}</p>
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Quản lý trưởng: <b>{manager ? manager.name : 'Chưa bổ nhiệm'}</b></span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-4 text-xs text-slate-500">
                Chưa có mặt bằng phù hợp tại thành phố này. Hãy tiếp tục phát triển chuỗi để mở thêm.
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div>
            {branchInCity?.isUnlocked ? (
              <div className="space-y-2">
                <div className="w-full py-2.5 bg-emerald-100 text-emerald-800 rounded-2xl text-xs font-heading font-bold flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>CHI NHÁNH ĐANG KINH DOANH</span>
                </div>
                {state.activeBranchId !== branchInCity.id && (
                  <button
                    onClick={() => setActiveBranch(branchInCity.id)}
                    className="w-full py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-xl text-xs font-bold transition-colors"
                  >
                    Chuyển đến quản lý tiệm này
                  </button>
                )}
              </div>
            ) : branchInCity ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => unlockBranch(branchInCity.id)}
                disabled={state.cash < branchInCity.unlockCost}
                className={`btn-3d w-full py-3 rounded-2xl font-heading font-bold text-xs md:text-sm flex items-center justify-between px-4 transition-all ${
                  state.cash >= branchInCity.unlockCost
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-game-btn-green'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Store className="w-4 h-4" /> Mở Chi Nhánh
                </span>
                <span>{branchInCity.unlockCost.toLocaleString('vi-VN')}đ</span>
              </motion.button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
