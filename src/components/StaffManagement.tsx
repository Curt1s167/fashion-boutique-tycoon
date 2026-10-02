import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  Clock, 
  Sparkles, 
  DollarSign, 
  Trash2
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import type { StaffRole, WorkShift } from '../types/game';

export const StaffManagement: React.FC = () => {
  const { state, hireEmployee, fireEmployee, trainEmployee, changeEmployeeShift } = useGame();
  const [selectedRole, setSelectedRole] = useState<StaffRole>('sales');
  const [selectedShift, setSelectedShift] = useState<WorkShift>('morning');

  const rolesConfig: Record<StaffRole, { name: string; desc: string; icon: string; wage: number }> = {
    manager: { name: 'Cửa Hàng Trưởng', desc: 'Nâng cao tinh thần toàn tiệm, giảm sai sót tồn kho và tăng doanh thu chi nhánh.', icon: '👩‍💼', wage: 50000 },
    sales: { name: 'Stylist Bán Lẻ', desc: 'Tư vấn phối đồ và chủ động chăm sóc khách, hồi phục thanh kiên nhẫn.', icon: '💁‍♀️', wage: 28000 },
    cashier: { name: 'Thu Ngân Quầy POS', desc: 'Tăng 30% tốc độ thanh toán, tránh tắc nghẽn quầy tính tiền giờ cao điểm.', icon: '🧑‍💻', wage: 25000 },
    stock: { name: 'Nhân Viên Kho Vận', desc: 'Tiếp nhận kiện hàng sỉ và chủ động đưa đồ từ kho sau lên kệ bán.', icon: '📦', wage: 24000 },
    fitting: { name: 'Trợ Lý Phòng Thử', desc: 'Hỗ trợ khách đổi size ngay trong phòng thử đồ, tăng tỷ lệ mua hàng.', icon: '🪞', wage: 22000 },
    cleaning: { name: 'Nhân Viên Vệ Sinh', desc: 'Quét dọn sàn và lau gương LED, giữ độ sạch sẽ trên 90% giúp tăng review 5 sao.', icon: '🧹', wage: 20000 }
  };

  const totalPayrollPerDay = state.employees.reduce((sum, e) => sum + e.wagePerDay, 0);

  const handleHire = () => {
    hireEmployee(selectedRole, selectedShift);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 p-5 rounded-3xl border-2 border-indigo-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm font-bold text-2xl">
            👥
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-heading font-extrabold text-slate-800 m-0 flex items-center gap-2">
              Quản Trị Nhân Sự & Lịch Ca Trực (HR)
              <Sparkles className="w-4 h-4 text-indigo-500 fill-indigo-500" />
            </h2>
            <p className="text-xs md:text-sm text-slate-600">
              Đội ngũ nhân viên chuyên nghiệp là chìa khóa để vận hành chuỗi thời trang thành công!
            </p>
          </div>
        </div>

        <div className="bg-white/90 px-4 py-2 rounded-2xl border border-indigo-200 text-xs font-bold text-slate-700 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <span>Tổng lương: <b className="text-indigo-700">{totalPayrollPerDay.toLocaleString('vi-VN')}đ / ngày</b></span>
        </div>
      </div>

      {/* Staff Roster Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-heading font-bold text-slate-800 flex items-center gap-2 m-0">
            <Users className="w-4 h-4 text-indigo-600" />
            Đội Ngũ Nhân Viên Hiện Tại ({state.employees.length} người)
          </h3>
          <span className="text-xs text-slate-500">
            Bấm "Đào tạo" để nâng sao kỹ năng & tăng hiệu suất
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.employees.map(emp => {
            const trainCost = emp.wagePerDay * 3;
            const canTrain = state.cash >= trainCost && emp.skillLevel < 5;

            return (
              <motion.div
                key={emp.id}
                whileHover={{ y: -3 }}
                className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-game-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{emp.avatar}</span>
                      <div>
                        <h4 className="text-sm font-heading font-bold text-slate-800 m-0">
                          {emp.name}
                        </h4>
                        <span className="text-[11px] text-indigo-600 font-semibold block mt-0.5">
                          {emp.roleLabel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`text-xs ${i < emp.skillLevel ? 'text-amber-400' : 'text-slate-200'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Morale, Energy & Stress Bars */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl mb-3 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Tinh thần</span>
                      <span className="font-bold text-emerald-600">{emp.morale}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Thể lực</span>
                      <span className="font-bold text-blue-600">{emp.energy}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Mức lương</span>
                      <span className="font-bold text-slate-700">{emp.wagePerDay.toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>

                  {/* Shift Selection */}
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" /> Ca làm việc:
                    </span>
                    <select
                      value={emp.shift}
                      onChange={(e) => changeEmployeeShift(emp.id, e.target.value as WorkShift)}
                      className="bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-xl px-2 py-1 text-xs font-bold outline-none"
                    >
                      <option value="morning">Ca Sáng (08:00 - 12:00)</option>
                      <option value="afternoon">Ca Chiều (12:00 - 16:00)</option>
                      <option value="evening">Ca Tối (16:00 - 22:00)</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => trainEmployee(emp.id)}
                    disabled={!canTrain}
                    className={`btn-3d flex-1 py-2 px-3 rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition-all ${
                      canTrain
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-game-btn'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{emp.skillLevel >= 5 ? 'Kỹ năng tối đa' : `Đào tạo (+1★) - ${trainCost.toLocaleString('vi-VN')}đ`}</span>
                  </motion.button>

                  <button
                    onClick={() => fireEmployee(emp.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Cho thôi việc"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recruitment Office (Tuyển Dụng Thêm Nhân Viên) */}
      <div className="bg-white rounded-3xl p-5 border-2 border-indigo-200 shadow-game-card">
        <h3 className="text-base font-heading font-bold text-slate-800 flex items-center gap-2 mb-4 m-0">
          <UserPlus className="w-4 h-4 text-indigo-600" />
          Phòng Tuyển Dụng Nhân Sự Mới
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">
              1. Chọn vị trí công việc cần tuyển
            </label>
            <div className="space-y-2">
              {(Object.keys(rolesConfig) as StaffRole[]).map(roleKey => {
                const info = rolesConfig[roleKey];
                const isSelected = selectedRole === roleKey;

                return (
                  <div
                    key={roleKey}
                    onClick={() => setSelectedRole(roleKey)}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      isSelected ? 'border-indigo-500 bg-indigo-50/50 shadow-xs' : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{info.icon}</span>
                      <div>
                        <h5 className="text-xs font-heading font-bold text-slate-800 m-0">{info.name}</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{info.desc}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-indigo-700 whitespace-nowrap">
                      {info.wage.toLocaleString('vi-VN')}đ/ngày
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">
                2. Phân bổ ca làm việc ban đầu
              </label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { id: 'morning', label: 'Ca Sáng', time: '08:00 - 12:00' },
                  { id: 'afternoon', label: 'Ca Chiều', time: '12:00 - 16:00' },
                  { id: 'evening', label: 'Ca Tối', time: '16:00 - 22:00' }
                ].map(shift => (
                  <button
                    key={shift.id}
                    onClick={() => setSelectedShift(shift.id as WorkShift)}
                    className={`p-3 rounded-2xl border-2 text-center transition-all ${
                      selectedShift === shift.id 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-900 font-bold' 
                        : 'border-slate-100 text-slate-600'
                    }`}
                  >
                    <span className="text-xs font-heading block">{shift.label}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{shift.time}</span>
                  </button>
                ))}
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1 mb-4">
                <div className="flex justify-between">
                  <span>Phí tuyển dụng & đồng phục ban đầu:</span>
                  <b className="text-slate-800">{(rolesConfig[selectedRole].wage * 2).toLocaleString('vi-VN')}đ</b>
                </div>
                <div className="flex justify-between">
                  <span>Lương chi trả mỗi ca ngày:</span>
                  <b className="text-indigo-600">{rolesConfig[selectedRole].wage.toLocaleString('vi-VN')}đ</b>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleHire}
              disabled={state.cash < rolesConfig[selectedRole].wage * 2}
              className={`btn-3d w-full py-3 rounded-2xl font-heading font-extrabold text-xs md:text-sm flex items-center justify-center gap-2 transition-all ${
                state.cash >= rolesConfig[selectedRole].wage * 2
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-game-btn'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Tuyển Ngay {rolesConfig[selectedRole].name}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
