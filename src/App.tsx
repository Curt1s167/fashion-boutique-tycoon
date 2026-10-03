import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, 
  Boxes, 
  Sparkles, 
  Truck, 
  Globe, 
  Layers,
  Users,
  Star,
  MapPin,
  Smartphone
} from 'lucide-react';
import { GameProvider, useGame } from './context/GameContext';
import type { ActiveTabType } from './context/GameContext';
import { Header } from './components/Header';
import { InteractiveWorkstation } from './components/workstation/InteractiveWorkstation';
import { ShopFloor } from './components/ShopFloor';
import { InventoryWholesale } from './components/InventoryWholesale';
import { ProcurementOrders } from './components/ProcurementOrders';
import { StaffManagement } from './components/StaffManagement';
import { CustomerReviews } from './components/CustomerReviews';
import { VietnamBusinessMap } from './components/VietnamBusinessMap';
import { OmnichannelDelivery } from './components/OmnichannelDelivery';
import { FashionFeedLookbook } from './components/FashionFeedLookbook';
import { ShopUpgrades } from './components/ShopUpgrades';
import { FloatingMoney } from './components/FloatingMoney';
import { DaySummaryModal } from './components/DaySummaryModal';
import { BusinessAdvisorModal } from './components/BusinessAdvisorModal';
import { SaveSlotModal } from './components/SaveSlotModal';
import { CuteWhyModal } from './components/CuteWhyModal';
import { Week7ReviewModal } from './components/Week7ReviewModal';
import { PwaInstallPrompt } from './components/pwa/PwaInstallPrompt';
import { DesktopSidebars } from './components/desktop/DesktopSidebars';
import { FashionGachaModal } from './components/modals/FashionGachaModal';
import { FashionQuizModal } from './components/modals/FashionQuizModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { FinanceDeskModal } from './components/FinanceDeskModal';

const GameMain: React.FC = () => {
  const { activeTab, setActiveTab, state } = useGame();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGachaOpen, setIsGachaOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);

  const unrepliedReviewsCount = state.reviews.filter(r => !r.replied).length;

  const tabs: { id: ActiveTabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number }[] = [
    { 
      id: 'workstation', 
      label: 'Bàn Làm Việc', 
      icon: Smartphone, 
      badge: state.customers.length > 0 ? `${state.customers.length}` : undefined 
    },
    { 
      id: 'shop', 
      label: 'Mặt Bằng Shop', 
      icon: Store, 
      badge: undefined 
    },
    { 
      id: 'inventory', 
      label: 'Tồn Kho SKU', 
      icon: Boxes, 
      badge: undefined 
    },
    { 
      id: 'procurement', 
      label: 'Đặt Hàng Sỉ', 
      icon: Truck, 
      badge: state.purchaseOrders.length > 0 ? state.purchaseOrders.length : undefined 
    },
    { 
      id: 'staff', 
      label: 'Nhân Sự', 
      icon: Users, 
      badge: state.employees.length 
    },
    { 
      id: 'reviews', 
      label: 'Đánh Giá Shop', 
      icon: Star, 
      badge: unrepliedReviewsCount > 0 ? `${unrepliedReviewsCount}` : undefined 
    },
    { 
      id: 'map', 
      label: 'Chi Nhánh', 
      icon: MapPin, 
      badge: undefined 
    },
    { 
      id: 'orders', 
      label: 'Đơn Online', 
      icon: Globe, 
      badge: state.onlineOrders.length > 0 ? state.onlineOrders.length : undefined 
    },
    { 
      id: 'lookbook', 
      label: 'Lookbook', 
      icon: Layers, 
      badge: state.lookbookOutfits.filter(o => !o.isCompleted).length > 0 ? 'Mới' : undefined 
    },
    { 
      id: 'upgrades', 
      label: 'Nâng Cấp', 
      icon: Sparkles, 
      badge: undefined 
    },
  ];

  return (
    <div className="min-h-screen boutique-floor flex flex-col pb-24 md:pb-8 text-[#3A2317] selection:bg-pink-300 selection:text-pink-900 font-sans">
      {/* 🖥️ DESKTOP COMPANION SIDEBARS (Mạng Xã Hội bên trái - Đánh Giá bên phải) */}
      <DesktopSidebars 
        onOpenGacha={() => setIsGachaOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
      />

      {/* 🧋 Tiệm Trà Mơ Ước Style Header & Striped Awning */}
      <Header 
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenGacha={() => setIsGachaOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenFinance={() => setIsFinanceOpen(true)}
      />

      {/* Floating numbers / Money alerts */}
      <FloatingMoney />

      {/* Game Modals */}
      <DaySummaryModal />
      <BusinessAdvisorModal />
      <SaveSlotModal />
      <CuteWhyModal />
      <Week7ReviewModal />
      <PwaInstallPrompt />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <FashionGachaModal isOpen={isGachaOpen} onClose={() => setIsGachaOpen(false)} />
      <FashionQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
      <FinanceDeskModal isOpen={isFinanceOpen} onClose={() => setIsFinanceOpen(false)} />

      {/* Central Boutique Simulator Container */}
      <main className="max-w-2xl w-full mx-auto px-2 sm:px-4 py-3 sm:py-5 flex-1 flex flex-col z-10">
        {/* Navigation Tabs (Tiệm Trà Mơ Ước rounded style) */}
        <div className="boutique-tabs mb-4 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`boutique-tab ${isActive ? 'active' : ''}`}
                role="tab"
                aria-selected={isActive}
              >
                <div className="relative flex items-center gap-1">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#ef6f8e]' : 'text-[#7a5a48]'}`} />
                  <span className="font-heading font-extrabold text-[11px] sm:text-xs">{tab.label}</span>

                  {/* Badge */}
                  {tab.badge !== undefined && (
                    <span className={`px-1 py-0.2 rounded-full text-[9px] font-extrabold ${
                      tab.badge.toString().includes('Mới')
                        ? 'bg-rose-500 text-white animate-bounce'
                        : isActive
                        ? 'bg-[#ef6f8e] text-white'
                        : 'bg-[#ead7bd] text-[#3a2317]'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="flex-1 bg-[#fffaf2] border-2 border-[#ead7bd] rounded-2xl p-3 sm:p-4 shadow-sm">
          <AnimatePresence mode="wait">
            {activeTab === 'workstation' && (
              <motion.div
                key="workstation"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full flex justify-center"
              >
                <InteractiveWorkstation />
              </motion.div>
            )}

            {activeTab === 'shop' && (
              <motion.div
                key="shop"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <ShopFloor />
              </motion.div>
            )}

            {activeTab === 'inventory' && (
              <motion.div
                key="inventory"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <InventoryWholesale />
              </motion.div>
            )}

            {activeTab === 'procurement' && (
              <motion.div
                key="procurement"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <ProcurementOrders />
              </motion.div>
            )}

            {activeTab === 'staff' && (
              <motion.div
                key="staff"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <StaffManagement />
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <CustomerReviews />
              </motion.div>
            )}

            {activeTab === 'map' && (
              <motion.div
                key="map"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <VietnamBusinessMap />
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <OmnichannelDelivery />
              </motion.div>
            )}

            {activeTab === 'lookbook' && (
              <motion.div
                key="lookbook"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <FashionFeedLookbook />
              </motion.div>
            )}

            {activeTab === 'upgrades' && (
              <motion.div
                key="upgrades"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <ShopUpgrades />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Floating Navigation Bar for Mobile */}
      <nav className="fixed bottom-0 inset-x-0 bg-[#fdf3e4]/95 backdrop-blur-lg border-t-2 border-[#ead7bd] py-1.5 px-2 md:hidden z-40 shadow-lg flex justify-around items-center overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl relative transition-all min-w-[46px] ${
                isActive ? 'text-[#ef6f8e] font-extrabold scale-105' : 'text-[#7a5a48] font-semibold'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-[#ffe9e5]' : 'bg-transparent'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-heading leading-tight truncate">{tab.label.split(' ')[0]}</span>
              {tab.badge !== undefined && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <GameMain />
    </GameProvider>
  );
}
