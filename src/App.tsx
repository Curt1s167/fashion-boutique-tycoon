import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, 
  Boxes, 
  Sparkles, 
  Truck, 
  Globe, 
  Layers
} from 'lucide-react';
import { GameProvider, useGame } from './context/GameContext';
import type { ActiveTabType } from './context/GameContext';
import { Header } from './components/Header';
import { ShopFloor } from './components/ShopFloor';
import { InventoryWholesale } from './components/InventoryWholesale';
import { ProcurementOrders } from './components/ProcurementOrders';
import { OmnichannelDelivery } from './components/OmnichannelDelivery';
import { FashionFeedLookbook } from './components/FashionFeedLookbook';
import { ShopUpgrades } from './components/ShopUpgrades';
import { FloatingMoney } from './components/FloatingMoney';
import { DaySummaryModal } from './components/DaySummaryModal';

const GameMain: React.FC = () => {
  const { activeTab, setActiveTab, state } = useGame();

  const tabs: { id: ActiveTabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number }[] = [
    { 
      id: 'shop', 
      label: 'Sàn Bán Hàng', 
      icon: Store, 
      badge: state.customers.length > 0 ? state.customers.length : undefined 
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
      id: 'orders', 
      label: 'Đơn Online', 
      icon: Globe, 
      badge: state.onlineOrders.length > 0 ? state.onlineOrders.length : undefined 
    },
    { 
      id: 'lookbook', 
      label: 'Lookbook & Feed', 
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
    <div className="min-h-screen boutique-floor flex flex-col pb-24 md:pb-8 selection:bg-pink-300 selection:text-pink-900">
      {/* Sticky Header with Cash, Day, Stars */}
      <Header />

      {/* Floating money / popups */}
      <FloatingMoney />

      {/* Day summary modal */}
      <DaySummaryModal />

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-4 py-5 flex-1 flex flex-col">
        {/* Navigation Tabs (Desktop & Tablet) */}
        <div className="flex items-center justify-start md:justify-center gap-1.5 mb-6 bg-white/80 backdrop-blur-md p-2 rounded-3xl border-2 border-pink-200 overflow-x-auto shadow-sm scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3.5 py-2 rounded-2xl font-heading font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap justify-center ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-game-btn'
                    : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-pink-500'}`} />
                <span>{tab.label}</span>

                {/* Badge */}
                {tab.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    tab.badge === 'Mới'
                      ? 'bg-amber-400 text-amber-950 animate-bounceShort'
                      : isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-pink-100 text-pink-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
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
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t-2 border-pink-200 py-1.5 px-2 md:hidden z-40 shadow-lg flex justify-around items-center overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-2xl relative transition-all min-w-[54px] ${
                isActive ? 'text-pink-600 font-bold scale-105' : 'text-slate-400 font-medium'
              }`}
            >
              <div className={`p-1 rounded-xl ${isActive ? 'bg-pink-100' : 'bg-transparent'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-heading leading-tight truncate">{tab.label}</span>
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
