import React from 'react';
import { motion } from 'framer-motion';
import type { WorkstationContextType } from '../../types/workstation';

interface WorkstationContextSwitcherProps {
  activeContext: WorkstationContextType;
  onSelectContext: (ctx: WorkstationContextType) => void;
  counts: {
    browsingCustomers: number;
    fittingRequests: number;
    checkoutQueue: number;
    lowStockRacks: number;
    inboundPOs: number;
    returnsPending: number;
    isDirty: boolean;
    onlineOrders: number;
  };
}

export const WorkstationContextSwitcher: React.FC<WorkstationContextSwitcherProps> = ({
  activeContext,
  onSelectContext,
  counts
}) => {
  const contexts: Array<{
    type: WorkstationContextType;
    label: string;
    icon: string;
    badgeCount?: number;
    badgeColor?: string;
  }> = [
    { type: 'CUSTOMER_ITEM_FULFILLMENT', label: 'Lấy Size Khách', icon: '🛍️', badgeCount: counts.browsingCustomers, badgeColor: 'bg-pink-500 text-white' },
    { type: 'FITTING_ROOM_REQUEST', label: 'Đổi Size Thử', icon: '🪞', badgeCount: counts.fittingRequests, badgeColor: 'bg-purple-600 text-white animate-pulse' },
    { type: 'CHECKOUT_POS', label: 'Quẹt POS Thu Tiền', icon: '💳', badgeCount: counts.checkoutQueue, badgeColor: 'bg-emerald-600 text-white' },
    { type: 'RESTOCK_FLOOR', label: 'Tiếp Hàng Kệ', icon: '📦', badgeCount: counts.lowStockRacks, badgeColor: 'bg-amber-500 text-white' },
    { type: 'GOODS_RECEIVING', label: 'Nhập Kiện Sỉ', icon: '🚚', badgeCount: counts.inboundPOs, badgeColor: 'bg-blue-600 text-white' },
    { type: 'RETURN_EXCHANGE', label: 'Đổi Trả Hàng', icon: '🔄', badgeCount: counts.returnsPending, badgeColor: 'bg-rose-500 text-white' },
    { type: 'CLEANING_INCIDENT', label: 'Quét Dọn Sàn', icon: '🧹', badgeCount: counts.isDirty ? 1 : 0, badgeColor: 'bg-amber-600 text-white' },
    { type: 'ONLINE_ORDER_PICKING', label: 'Đơn Online', icon: '🛵', badgeCount: counts.onlineOrders, badgeColor: 'bg-indigo-600 text-white' },
    { type: 'STAFF_SHIFT_COVERAGE', label: 'Xếp Ca Nhân Sự', icon: '👥' },
    { type: 'REVIEW_RESPONSE', label: 'Phản Hồi Khách', icon: '⭐' }
  ];

  return (
    <div className="overflow-x-auto pb-1 scrollbar-none">
      <div className="flex items-center gap-1.5 min-w-max">
        {contexts.map(c => {
          const isActive = activeContext === c.type;
          return (
            <motion.button
              key={c.type}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectContext(c.type)}
              className={`px-2.5 py-1.5 rounded-xl font-heading font-bold text-xs flex items-center gap-1.5 transition-all relative ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm ring-2 ring-pink-400'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
              {c.badgeCount !== undefined && c.badgeCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${c.badgeColor || 'bg-pink-500 text-white'}`}>
                  {c.badgeCount}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
