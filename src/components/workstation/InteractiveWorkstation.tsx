import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  RotateCcw,
  Truck
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { WorkstationHUD } from './WorkstationHUD';
import { SituationCard } from './SituationCard';
import { InstructionBanner } from './InstructionBanner';
import { ProductSelectorDrawer } from './ProductSelectorDrawer';
import { PreparationTable } from './PreparationTable';
import { POSRegisterModal } from './POSRegisterModal';
import { GoodsReceivingStation } from './GoodsReceivingStation';
import { ReturnExchangeStation } from './ReturnExchangeStation';
import { WorkstationContextSwitcher } from './WorkstationContextSwitcher';
import { First7DaysJourneyWidget } from '../First7DaysJourneyWidget';
import type { WorkstationContextType } from '../../types/workstation';

export const InteractiveWorkstation: React.FC = () => {
  const { 
    state, 
    placeItemOnPrepTable, 
    removeItemFromPrepTable, 
    clearPrepTable, 
    handPrepTableToCustomer, 
    processPOSPayment, 
    receiveGoodsPackage,
    inspectAndResolveReturn,
    cleanIncidentArea,
    pickItemToCarry,
    rushFitting,
    fulfillFittingSizeRequest,
    setActiveTab,
    addFloatingNumber,
    openStoreFromPreparation
  } = useGame();

  const [activeContext, setActiveContext] = useState<WorkstationContextType>('CUSTOMER_ITEM_FULFILLMENT');
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('tops');
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [isPOSOpen, setIsPOSOpen] = useState(false);
  const [isReceivingOpen, setIsReceivingOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);

  // Active customer prioritization
  const browsingCustomer = state.customers.find(c => c.state === 'browsing' || c.state === 'entering');
  const fittingCustomer = state.customers.find(c => c.state === 'fitting');
  const checkoutCustomer = state.customers.find(c => c.state === 'checkout');

  const activeCustomer = 
    activeContext === 'CHECKOUT_POS' ? checkoutCustomer :
    activeContext === 'FITTING_ROOM_REQUEST' ? fittingCustomer :
    browsingCustomer || fittingCustomer || checkoutCustomer;

  const targetStyle = activeCustomer ? state.styles[activeCustomer.targetStyleId] : undefined;

  // Context Counts
  const contextCounts = {
    browsingCustomers: state.customers.filter(c => c.state === 'browsing' || c.state === 'entering').length,
    fittingRequests: state.customers.filter(c => c.state === 'fitting' && c.requestedAlternativeSize).length,
    checkoutQueue: state.customers.filter(c => c.state === 'checkout').length,
    lowStockRacks: Object.values(state.styles).filter(s => s.variants.some(v => v.floorStock <= 2 && v.backroomStock > 0)).length,
    inboundPOs: state.purchaseOrders.length,
    returnsPending: state.returnRequests.length,
    isDirty: state.cleanliness < 70,
    onlineOrders: state.onlineOrders.length
  };

  // Derive Current Step and Guidance
  let stepTitle = 'Bước 1: Chạm Kệ Hàng';
  let stepInstruction = 'Chạm vào kệ Áo/Quần để lấy đúng size cho khách';
  let currentStepIndex = 0;
  const totalSteps = 4;

  const expectedSize = activeCustomer?.requestedAlternativeSize || activeCustomer?.requestedSize;
  const isItemOnPrep = state.prepTableItems.some(
    i => i.styleId === activeCustomer?.targetStyleId && i.size === expectedSize
  );

  if (activeCustomer) {
    if (activeCustomer.state === 'checkout') {
      stepTitle = 'Bước 4: Quẹt Mã POS';
      stepInstruction = `Bấm Quầy Thu Ngân POS để quẹt mã và thu tiền cho ${activeCustomer.name}`;
      currentStepIndex = 3;
    } else if (activeCustomer.state === 'fitting') {
      if (activeCustomer.requestedAlternativeSize) {
        stepTitle = 'Đổi Size Phòng Thử';
        stepInstruction = `Lấy size ${activeCustomer.requestedAlternativeSize} đưa vào phòng thử cho khách`;
        currentStepIndex = 2;
      } else {
        stepTitle = 'Bước 3: Khách Thử Đồ';
        stepInstruction = `${activeCustomer.name} đang thử đồ trong phòng thử. Chờ khách ưng ý!`;
        currentStepIndex = 2;
      }
    } else if (isItemOnPrep) {
      stepTitle = 'Bước 2: Giao Đồ Cho Khách';
      stepInstruction = `Đồ đã sẵn sàng trên bàn! Bấm "Đưa Cho Khách Thử Đồ"`;
      currentStepIndex = 1;
    } else {
      stepTitle = 'Bước 1: Lấy Đúng Size & Màu';
      stepInstruction = `Chạm Kệ để lấy ${targetStyle?.name || 'sản phẩm'} (Size ${expectedSize})`;
      currentStepIndex = 0;
    }
  }

  // Category list
  const categoryRacks = [
    { key: 'tops', label: 'Kệ Áo Nữ', emoji: '👕', bg: 'bg-pink-100/80 border-pink-300' },
    { key: 'bottoms', label: 'Kệ Quần Jeans', emoji: '👖', bg: 'bg-indigo-100/80 border-indigo-300' },
    { key: 'footwear', label: 'Kệ Giày Sneaker', emoji: '👟', bg: 'bg-amber-100/80 border-amber-300' },
    { key: 'bags', label: 'Kệ Túi Xách', emoji: '👜', bg: 'bg-purple-100/80 border-purple-300' },
    { key: 'outerwear', label: 'Áo Khoác Blazer', emoji: '🧥', bg: 'bg-rose-100/80 border-rose-300' }
  ];

  const handleRackTap = (categoryKey: string) => {
    setSelectedCategoryKey(categoryKey);
    setIsProductDrawerOpen(true);
  };

  const filteredStyles = Object.values(state.styles).filter(
    s => s.category === selectedCategoryKey || categoryRacks.some(r => r.key === selectedCategoryKey)
  );

  return (
    <div className="w-full flex justify-center py-1 sm:py-3">
      {/* 9:16 Portrait Canvas Shell */}
      <div className="w-full max-w-md bg-gradient-to-b from-rose-50 via-pink-50/50 to-purple-50 rounded-3xl sm:rounded-[36px] border-4 border-pink-200/90 shadow-2xl p-3 sm:p-4 space-y-3 relative overflow-hidden">
        
        {/* 1. Workstation HUD (Time, Cash, Paid Revenue, Pending Cart, Star Reputation) */}
        <WorkstationHUD onToggleViewMode={() => setActiveTab('shop')} />

        {/* 1b. First 7 Days Journey Companion Bar */}
        <First7DaysJourneyWidget />

        {/* 1c. Morning Preparation & Store Opening Notice */}
        {state.dayPhase === 'PREPARATION' && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-r from-amber-50 via-[#fff8ef] to-orange-50 border-2 border-amber-300 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[#3a2317] shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">☀️</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-200/90 px-2 py-0.5 rounded-full">
                    GIỜ CHUẨN BỊ (08:00 AM)
                  </span>
                  <span className="text-[11px] font-bold text-[#7a5a48]">Ngày {state.day}</span>
                </div>
                <div className="text-xs font-bold text-[#3a2317] mt-0.5">
                  Tiệm chưa mở cửa đón khách!
                </div>
              </div>
            </div>
            <button
              onClick={openStoreFromPreparation}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all shrink-0"
            >
              <span>🔔 MỞ CỬA TIỆM ĐÓN KHÁCH</span>
            </button>
          </motion.div>
        )}

        {/* 2. Context Switcher Bar (10 Retail Contexts) */}
        <WorkstationContextSwitcher
          activeContext={activeContext}
          onSelectContext={(ctx) => {
            setActiveContext(ctx);
            if (ctx === 'CHECKOUT_POS') setIsPOSOpen(true);
            else if (ctx === 'GOODS_RECEIVING') setIsReceivingOpen(true);
            else if (ctx === 'RETURN_EXCHANGE') setIsReturnOpen(true);
            else if (ctx === 'STAFF_SHIFT_COVERAGE') setActiveTab('staff');
            else if (ctx === 'REVIEW_RESPONSE') setActiveTab('reviews');
          }}
          counts={contextCounts}
        />

        {/* 3. Customer / Situation Block */}
        <SituationCard
          customer={activeCustomer}
          targetStyle={targetStyle}
          onAssistanceClick={() => {
            if (activeCustomer) {
              addFloatingNumber('💁‍♀️ Stylist tư vấn tận tâm!', 'clean');
            }
          }}
        />

        {/* 4. Current Step Instruction Banner */}
        <InstructionBanner
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
          stepTitle={stepTitle}
          stepInstruction={stepInstruction}
        />

        {/* 5. Main Interactive Workstation Area */}
        <div className="space-y-3">
          {/* 5a. Visual Fashion Racks (Direct Tap Target Hotspots) */}
          <div className="bg-white/90 p-3 rounded-3xl border-2 border-pink-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-heading font-extrabold text-slate-800 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-pink-500" />
                Kệ Hàng Trưng Bày (Chạm để chọn Size/Màu)
              </span>
              <span className="text-[10px] text-pink-600 font-bold">
                Chạm để mở khay 👆
              </span>
            </div>

            {/* Racks Grid */}
            <div className="grid grid-cols-3 gap-2">
              {categoryRacks.map(rack => {
                const matchedStyle = Object.values(state.styles).find(s => s.category === rack.key) || Object.values(state.styles)[0];
                const totalFloor = matchedStyle ? matchedStyle.variants.reduce((sum, v) => sum + v.floorStock, 0) : 0;
                const totalBackroom = matchedStyle ? matchedStyle.variants.reduce((sum, v) => sum + v.backroomStock, 0) : 0;
                const isTarget = activeCustomer?.targetCategory === rack.key;

                return (
                  <motion.button
                    key={rack.key}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleRackTap(rack.key)}
                    className={`p-2.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between h-24 relative overflow-hidden ${
                      isTarget 
                        ? 'border-pink-500 bg-pink-50 shadow-game-btn ring-2 ring-pink-400' 
                        : rack.bg
                    }`}
                  >
                    {isTarget && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl filter drop-shadow-xs">{rack.emoji}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-white/80 text-slate-700">
                        {totalFloor} cái
                      </span>
                    </div>

                    <div>
                      <span className="font-heading font-extrabold text-xs text-slate-800 line-clamp-1 block leading-tight">
                        {rack.label}
                      </span>
                      <span className="text-[9px] text-slate-500 block">
                        Kho: {totalBackroom}
                      </span>
                    </div>
                  </motion.button>
                );
              })}

              {/* Backroom Shortcut Hotspot */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setActiveTab('inventory')}
                className="p-2.5 rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50/70 hover:bg-purple-100 text-left transition-all flex flex-col justify-between h-24"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">📦</span>
                  <span className="text-[9px] font-bold px-1 py-0.2 rounded-md bg-purple-200 text-purple-800">
                    Kho sau
                  </span>
                </div>
                <div>
                  <span className="font-heading font-extrabold text-xs text-purple-900 block leading-tight">
                    Kho Dự Trữ
                  </span>
                  <span className="text-[9px] text-purple-600 block">
                    Nhập/Chuyển hàng
                  </span>
                </div>
              </motion.button>
            </div>
          </div>

          {/* 5b. Preparation Table (Bàn Chuẩn Bị Trang Phục) */}
          <PreparationTable
            items={state.prepTableItems}
            customer={activeCustomer}
            onRemoveItem={removeItemFromPrepTable}
            onClearTable={clearPrepTable}
            onHandToCustomer={handPrepTableToCustomer}
          />

          {/* 5c. Workstations Row: VIP Fitting Cubicle & POS Cashier Counter */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* VIP Fitting Room Cubicle */}
            <div className="bg-white p-3 rounded-3xl border-2 border-purple-200 shadow-sm flex flex-col justify-between min-h-[140px]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl">🪞</span>
                <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  Phòng Thử ({state.customers.filter(c => c.state === 'fitting').length})
                </span>
              </div>

              {fittingCustomer ? (
                <div className="text-center my-auto space-y-1">
                  <div className="text-2xl animate-bounceShort">{fittingCustomer.avatar}</div>
                  <span className="font-heading font-bold text-xs text-purple-900 truncate block">
                    {fittingCustomer.name}
                  </span>
                  
                  {fittingCustomer.requestedAlternativeSize ? (
                    <button
                      onClick={() => fulfillFittingSizeRequest(fittingCustomer.id, fittingCustomer.requestedAlternativeSize!)}
                      className="w-full py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-[10px] shadow-xs"
                    >
                      Đưa size {fittingCustomer.requestedAlternativeSize} 🪞
                    </button>
                  ) : (
                    <div className="w-full bg-purple-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-purple-600 h-full rounded-full transition-all"
                        style={{ width: `${fittingCustomer.stateProgress}%` }}
                      />
                    </div>
                  )}

                  <button
                    onClick={rushFitting}
                    className="text-[9px] text-purple-700 hover:underline font-bold flex items-center justify-center gap-0.5 mx-auto"
                  >
                    <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                    Thử nhanh
                  </button>
                </div>
              ) : (
                <div className="text-center my-auto text-slate-300 text-xs">
                  <span className="text-xl opacity-40 block mb-0.5">🚪</span>
                  Phòng trống
                </div>
              )}
            </div>

            {/* POS Cashier Counter */}
            <div className="bg-white p-3 rounded-3xl border-2 border-emerald-200 shadow-sm flex flex-col justify-between min-h-[140px]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl">💳</span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  Quầy POS ({state.customers.filter(c => c.state === 'checkout').length})
                </span>
              </div>

              {checkoutCustomer ? (
                <div className="text-center my-auto space-y-1.5">
                  <div className="text-2xl animate-bounceShort">{checkoutCustomer.avatar}</div>
                  <span className="font-heading font-bold text-xs text-slate-800 truncate block">
                    {checkoutCustomer.name}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700 block">
                    {checkoutCustomer.billAmount?.toLocaleString('vi-VN')}đ
                  </span>
                  <button
                    onClick={() => setIsPOSOpen(true)}
                    className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-heading font-extrabold text-[10px] shadow-game-btn-green flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Quét & Thu Tiền</span>
                  </button>
                </div>
              ) : (
                <div className="text-center my-auto text-slate-300 text-xs">
                  <span className="text-xl opacity-40 block mb-0.5">🛒</span>
                  Chờ khách tính tiền
                </div>
              )}
            </div>
          </div>

          {/* 5d. Quick Operations Bar (Inbound POs, Returns, Cleaning) */}
          <div className="bg-slate-50/90 p-2.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-1.5 text-xs font-bold">
            {/* Goods Receiving Button */}
            <button
              onClick={() => setIsReceivingOpen(true)}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-purple-50 text-purple-800 rounded-xl border border-purple-200 flex items-center justify-center gap-1 shadow-2xs"
            >
              <Truck className="w-3.5 h-3.5 text-purple-600" />
              <span>Kiện Sỉ ({state.purchaseOrders.length})</span>
            </button>

            {/* Return & Exchange Desk Button */}
            <button
              onClick={() => setIsReturnOpen(true)}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-rose-50 text-rose-800 rounded-xl border border-rose-200 flex items-center justify-center gap-1 shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span>Đổi Trả ({state.returnRequests.length})</span>
            </button>

            {/* Sweep Floor Cleanliness Action */}
            <button
              onClick={() => cleanIncidentArea('floor')}
              className="flex-1 py-1.5 px-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl border border-amber-300 flex items-center justify-center gap-1 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Quét Sàn</span>
            </button>
          </div>
        </div>

        {/* 6. Context Modals */}
        {/* Product Selector In-scene Drawer */}
        <ProductSelectorDrawer
          isOpen={isProductDrawerOpen}
          onClose={() => setIsProductDrawerOpen(false)}
          styles={filteredStyles.length > 0 ? filteredStyles : Object.values(state.styles)}
          selectedCategoryName={categoryRacks.find(r => r.key === selectedCategoryKey)?.label || 'Thời Trang'}
          onPlaceOnPrepTable={placeItemOnPrepTable}
          onPickToCarry={pickItemToCarry}
        />

        {/* POS Checkout & Barcode Scanner Modal */}
        <POSRegisterModal
          isOpen={isPOSOpen}
          onClose={() => setIsPOSOpen(false)}
          customer={checkoutCustomer}
          onProcessPayment={processPOSPayment}
        />

        {/* Inbound Goods Receiving Modal */}
        <GoodsReceivingStation
          isOpen={isReceivingOpen}
          onClose={() => setIsReceivingOpen(false)}
          purchaseOrders={state.purchaseOrders}
          onReceivePackage={receiveGoodsPackage}
        />

        {/* Customer Return & Exchange Modal */}
        <ReturnExchangeStation
          isOpen={isReturnOpen}
          onClose={() => setIsReturnOpen(false)}
          returnRequests={state.returnRequests}
          onResolveReturn={inspectAndResolveReturn}
        />
      </div>
    </div>
  );
};
