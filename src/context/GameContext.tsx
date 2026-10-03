import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { 
  GameState, 
  Customer, 
  PurchaseOrder, 
  OnlineOrder,
  StaffRole,
  WorkShift,
  BusinessAdvisorInsight,
  Employee,
  CustomerReview,
  DayPhase,
  PlayerCarryItem,
  StoreTask
} from '../types/game';
import { 
  INITIAL_STYLES, 
  INITIAL_SUPPLIERS, 
  INITIAL_LOOKBOOK, 
  INITIAL_BRANCHES, 
  INITIAL_SOCIAL_POSTS,
  INITIAL_EMPLOYEES,
  INITIAL_REVIEWS,
  INITIAL_ADVISOR_INSIGHTS
} from '../data/fashionCatalog';
import type { Week2FocusChoice } from '../types/journey';
import { FIRST_7_DAYS_JOURNEY_DATA } from '../data/journeyConfig';
import { sound } from '../utils/sound';
import { 
  saveGameState, 
  loadGameState, 
  clearGameState, 
  setActiveSlotId 
} from '../utils/saveManager';

export type ActiveTabType = 
  | 'workstation'
  | 'shop' 
  | 'inventory' 
  | 'procurement' 
  | 'staff' 
  | 'reviews' 
  | 'map' 
  | 'orders' 
  | 'lookbook' 
  | 'upgrades';

export const GAME_TIME_CONFIG = {
  openHour: 8,
  closeHour: 22,
  totalGameMinutes: 840, // (22 - 8) * 60 = 840
  realSecondsPerDay: 180, // 3 minutes per business day
  preparationTimed: false,
  closingGraceEnabled: true,
  maxClosingGraceSeconds: 20
};

export const DAY_DURATION = GAME_TIME_CONFIG.realSecondsPerDay;

interface GameContextType {
  state: GameState;
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  // Inventory & Logistics
  replenishVariantToFloor: (styleId: string, variantId: string, amount: number) => void;
  replenishAllStyleToFloor: (styleId: string) => void;
  createPurchaseOrder: (styleId: string, variantId: string, quantity: number) => void;
  // Customer floor service
  serveCustomer: (customerId: string) => void;
  fetchItemForCustomer: (customerId: string) => void;
  checkoutCustomerManual: (customerId: string) => void;
  rushFitting: () => void;
  rushCheckout: () => void;
  sweepFloor: () => void;
  // Manual Storeplay Carry & Tasks
  pickItemToCarry: (styleId: string, variantId: string, source: 'rack' | 'backroom') => void;
  dropCarriedItem: (itemId: string, target: 'rack' | 'backroom') => void;
  giveCarriedItemToCustomer: (customerId: string, itemId: string) => void;
  collectFittingReturn: (returnId: string, target: 'rack' | 'backroom') => void;
  fulfillFittingSizeRequest: (customerId: string, newSize: string) => void;
  setGameSpeed: (speed: number) => void;
  openStoreFromPreparation: () => void;
  // Interactive Workstation & Preparation Table (ANTIGRAVITY_INTERACTIVE_WORKSTATION_UI_SPEC)
  placeItemOnPrepTable: (styleId: string, variantId: string, source: 'rack' | 'backroom') => void;
  removeItemFromPrepTable: (itemId: string, returnTarget: 'rack' | 'backroom') => void;
  clearPrepTable: () => void;
  handPrepTableToCustomer: (customerId: string) => void;
  processPOSPayment: (customerId: string, paymentMethod: 'cash' | 'card' | 'qr', tipBonus?: number) => void;
  receiveGoodsPackage: (poId: string, damagedCount?: number) => void;
  inspectAndResolveReturn: (returnId: string, condition: 'sellable' | 'repack' | 'damaged', resolution: 'refund' | 'exchange', exchangeSize?: string) => void;
  cleanIncidentArea: (targetArea: 'fitting' | 'floor') => void;
  setActiveWorkstationContext: (contextType: string) => void;
  // Returns & Online Orders
  resolveReturn: (returnId: string, approve: boolean) => void;
  speedUpOnlineOrder: (orderId: string) => void;
  // HR & Employees
  hireEmployee: (role: StaffRole, shift: WorkShift) => void;
  fireEmployee: (empId: string) => void;
  trainEmployee: (empId: string) => void;
  changeEmployeeShift: (empId: string, newShift: WorkShift) => void;
  // Customer Reviews & Merchant Replies
  replyToReview: (reviewId: string, replyType: 'thank' | 'apologize' | 'voucher', note: string) => void;
  // Upgrades & Branches
  upgradeShop: (upgradeKey: keyof GameState['upgrades']) => void;
  unlockBranch: (branchId: string) => void;
  setActiveBranch: (branchId: string) => void;
  claimLookbookOutfit: (lookbookId: string) => void;
  // Day Cycle & Persistence
  startNextDay: () => void;
  toggleSound: () => void;
  isSoundEnabled: boolean;
  isDaySummaryOpen: boolean;
  closeDaySummary: () => void;
  isAdvisorOpen: boolean;
  setIsAdvisorOpen: (open: boolean) => void;
  isSaveModalOpen: boolean;
  setIsSaveModalOpen: (open: boolean) => void;
  switchSlot: (slotId: string) => void;
  manualSave: () => void;
  resetGame: () => void;
  addFloatingNumber: (text: string, type: 'money' | 'rep' | 'heart' | 'sad' | 'order' | 'clean', x?: number, y?: number) => void;
  // Journey & Cute Learning
  isWhyModalOpen: boolean;
  openWhyModal: () => void;
  closeWhyModal: () => void;
  isWeek7ReviewOpen: boolean;
  openWeek7Review: () => void;
  closeWeek7Review: () => void;
  selectWeek2Focus: (choice: Week2FocusChoice) => void;
  trackJourneyGoal: (goalId: string, increment?: number) => void;
  addCash: (amount: number) => void;
  addReputationExp: (amount: number) => void;
}

const INITIAL_GAME_STATE: GameState = {
  cash: 750000,
  totalEarned: 750000,
  reputationStars: 1,
  reputationExp: 0,
  reputationNextExp: 100,
  day: 1,
  dayTime: 0,
  isDayRunning: true,

  gameSpeed: 1,
  dayPhase: 'MORNING',
  currentInGameMinutes: 480, // 08:00 AM

  playerCarry: [],
  playerCarryCapacity: 3,

  storeTasks: [],
  fittingReturns: [],

  cleanliness: 95,
  trafficMultiplier: 1.0,

  styles: INITIAL_STYLES,
  suppliers: INITIAL_SUPPLIERS,
  purchaseOrders: [],
  customers: [],
  employees: INITIAL_EMPLOYEES,
  reviews: INITIAL_REVIEWS,
  returnRequests: [],
  onlineOrders: [],
  lookbookOutfits: INITIAL_LOOKBOOK,
  socialPosts: INITIAL_SOCIAL_POSTS,
  branches: INITIAL_BRANCHES,
  activeBranchId: 'branch-main',

  upgrades: {
    fittingRooms: {
      id: 'fittingRooms',
      name: 'Phòng Thử Đồ Gương Led',
      description: 'Gương selfie lung linh, tăng buồng thử và giảm thời gian thử đồ.',
      level: 1,
      maxLevel: 5,
      baseCost: 350000,
      costMultiplier: 1.8,
      icon: '🪞',
      effect: '+1 Buồng thử đồ, Tốc độ thử +30%'
    },
    posCounter: {
      id: 'posCounter',
      name: 'Quầy POS Quét Mã Tự Động',
      description: 'Máy quẹt mã QR và in hóa đơn siêu tốc, khách tip thêm tiền boa.',
      level: 1,
      maxLevel: 5,
      baseCost: 280000,
      costMultiplier: 1.7,
      icon: '💳',
      effect: 'Thanh toán nhanh +35%, Khách tip +12%'
    },
    shopSpace: {
      id: 'shopSpace',
      name: 'Mở Rộng Diện Tích Sàn Bán Hàng',
      description: 'Mở rộng mặt bằng đón nhiều khách ghé mua sắm cùng lúc.',
      level: 1,
      maxLevel: 5,
      baseCost: 500000,
      costMultiplier: 2.1,
      icon: '🏬',
      effect: 'Sức chứa tối đa +2 khách'
    },
    marketing: {
      id: 'marketing',
      name: 'Chiến Dịch Lookbook & Viral TikTok',
      description: 'Booking KOC/Influencer diện đồ shop, kéo khách VIP chịu chi.',
      level: 0,
      maxLevel: 5,
      baseCost: 400000,
      costMultiplier: 2.0,
      icon: '📢',
      effect: 'Tăng 35% lượt khách, +20% khách VIP mua combo'
    },
    staffAuto: {
      id: 'staffAuto',
      name: 'Thuê Stylist Tư Vấn Chăm Sóc Khách',
      description: 'Nhân viên tự động tư vấn hỗ trợ size khi khách chờ lâu.',
      level: 0,
      maxLevel: 3,
      baseCost: 600000,
      costMultiplier: 2.5,
      icon: '💁‍♀️',
      effect: 'Tự động hồi phục kiên nhẫn khi khách sắp bỏ đi'
    },
    backroomStorage: {
      id: 'backroomStorage',
      name: 'Kệ Kho Trung Chuyển Phía Sau',
      description: 'Mở rộng sức chứa kho sau giúp trữ nhiều hàng sỉ giá tốt.',
      level: 1,
      maxLevel: 5,
      baseCost: 300000,
      costMultiplier: 1.8,
      icon: '📦',
      effect: 'Tăng +25 sức chứa kho chứa hàng phía sau'
    },
    deliverySpeed: {
      id: 'deliverySpeed',
      name: 'Hợp Tác Đội Shipper Hỏa Tốc',
      description: 'Đóng gói và giao đơn online thần tốc, tăng đơn hàng online.',
      level: 0,
      maxLevel: 4,
      baseCost: 450000,
      costMultiplier: 2.2,
      icon: '🛵',
      effect: 'Đơn online xử lý nhanh +50%, hoa hồng +20%'
    }
  },

  currentDayStats: {
    revenue: 0,
    cost: 0,
    payroll: 0,
    rent: 0,
    profit: 0,
    customersServed: 0,
    customersLost: 0,
    lostSalesValue: 0,
    pendingCartValue: 0,
    stockoutLostCount: 0,
    queueAbandonCount: 0,
    conversionRate: 0,
    onlineOrdersCompleted: 0,
    returnsProcessed: 0,
    averageSatisfaction: 95
  },

  advisorInsights: INITIAL_ADVISOR_INSIGHTS,
  prepTableItems: [],
  activeWorkstationContext: 'CUSTOMER_ITEM_FULFILLMENT',
  completedJourneyGoalIds: [],
  journeyGoalProgress: {},
  week2FocusChoice: undefined,
  floatingNumbers: []
};

const CUSTOMER_NAMES = [
  'Minh Anh', 'Hà My', 'Linh Chi', 'Khánh Vy', 'Bảo Ngọc', 
  'Thùy Tiên', 'Gia Hân', 'Phương Thảo', 'Quỳnh Anh', 'Trâm Anh',
  'Hoàng Nam', 'Minh Khang', 'Đức Anh', 'Tuấn Kiệt', 'Thanh Tùng'
];

const CUSTOMER_AVATARS = ['👱‍♀️', '👩‍🦰', '👧', '👩‍🦱', '👩', '🧕', '👱‍♂️', '🧑‍🦱', '🧔', '🧑'];

const CUSTOMER_ARCHETYPES: Customer['archetype'][] = [
  'Gen Z Y2K', 'Dân Công Sở', 'Tín Đồ Streetwear', 'Khách VIP Sang Trọng', 'Học Sinh Sinh Viên'
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => {
    const saved = loadGameState();
    if (saved && saved.styles) {
      return {
        ...INITIAL_GAME_STATE,
        ...saved,
        isDayRunning: true,
        floatingNumbers: []
      };
    }
    return INITIAL_GAME_STATE;
  });

  const [activeTab, setActiveTab] = useState<ActiveTabType>('workstation');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isDaySummaryOpen, setIsDaySummaryOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [isWeek7ReviewOpen, setIsWeek7ReviewOpen] = useState(false);

  const openWhyModal = useCallback(() => {
    sound.playPop();
    setIsWhyModalOpen(true);
  }, []);

  const closeWhyModal = useCallback(() => {
    setIsWhyModalOpen(false);
  }, []);

  const openWeek7Review = useCallback(() => {
    sound.playLevelUp();
    setIsWeek7ReviewOpen(true);
  }, []);

  const closeWeek7Review = useCallback(() => {
    setIsWeek7ReviewOpen(false);
  }, []);

  const stateRef = useRef(state);
  stateRef.current = state;

  // Auto-save on significant updates
  useEffect(() => {
    saveGameState(state);
  }, [state]);

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setIsSoundEnabled(sound.enabled);
    if (sound.enabled) sound.playPop();
  };

  const addFloatingNumber = useCallback((text: string, type: 'money' | 'rep' | 'heart' | 'sad' | 'order' | 'clean', x = 50, y = 50) => {
    const newId = 'float-' + Date.now() + '-' + Math.random();
    setState(prev => ({
      ...prev,
      floatingNumbers: [...prev.floatingNumbers, { id: newId, text, type, x, y }]
    }));

    setTimeout(() => {
      setState(prev => ({
        ...prev,
        floatingNumbers: prev.floatingNumbers.filter(f => f.id !== newId)
      }));
    }, 1500);
  }, []);

  const selectWeek2Focus = useCallback((choice: Week2FocusChoice) => {
    setState(prev => {
      sound.playPop();
      return {
        ...prev,
        week2FocusChoice: choice,
        completedJourneyGoalIds: prev.completedJourneyGoalIds.includes('day7_choose_focus')
          ? prev.completedJourneyGoalIds
          : [...prev.completedJourneyGoalIds, 'day7_choose_focus']
      };
    });
    addFloatingNumber('🏆 Đã chọn định hướng Tuần 2!', 'rep');
  }, [addFloatingNumber]);

  const trackJourneyGoal = useCallback((goalId: string, increment = 1) => {
    setState(prev => {
      if (prev.completedJourneyGoalIds.includes(goalId)) return prev;
      const current = (prev.journeyGoalProgress[goalId] || 0) + increment;
      const dayMeta = FIRST_7_DAYS_JOURNEY_DATA[prev.day] || FIRST_7_DAYS_JOURNEY_DATA[7];
      const targetGoal = dayMeta?.goals.find(g => g.id === goalId);
      const isComplete = targetGoal ? current >= targetGoal.targetCount : true;

      const newCompleted = isComplete 
        ? [...prev.completedJourneyGoalIds, goalId]
        : prev.completedJourneyGoalIds;

      if (isComplete) {
        sound.playPop();
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.5 }
          });
        } catch {}
        addFloatingNumber('✨ Hoàn thành mục tiêu ngày!', 'rep');
      }

      return {
        ...prev,
        completedJourneyGoalIds: newCompleted,
        journeyGoalProgress: {
          ...prev.journeyGoalProgress,
          [goalId]: current
        }
      };
    });
  }, [addFloatingNumber]);

  // Quick manual cleaning of floor
  const sweepFloor = useCallback(() => {
    setState(prev => {
      sound.playPop();
      addFloatingNumber('✨ Quét dọn sạch bóng!', 'clean');
      const newGoals = [...prev.completedJourneyGoalIds];
      if (!newGoals.includes('day4_sweep_floor')) newGoals.push('day4_sweep_floor');
      if (!newGoals.includes('day4_keep_cleanliness')) newGoals.push('day4_keep_cleanliness');
      return {
        ...prev,
        cleanliness: Math.min(100, prev.cleanliness + 25),
        completedJourneyGoalIds: newGoals
      };
    });
  }, [addFloatingNumber]);

  // Replenish stock to sales floor
  const replenishVariantToFloor = useCallback((styleId: string, variantId: string, amount: number) => {
    setState(prev => {
      const style = prev.styles[styleId];
      if (!style) return prev;

      const updatedVariants = style.variants.map(v => {
        if (v.id === variantId) {
          const moveAmount = Math.min(amount, v.backroomStock);
          return {
            ...v,
            floorStock: v.floorStock + moveAmount,
            backroomStock: v.backroomStock - moveAmount
          };
        }
        return v;
      });

      sound.playPop();
      const newGoals = [...prev.completedJourneyGoalIds];
      if (!newGoals.includes('day2_restock_rack')) newGoals.push('day2_restock_rack');

      return {
        ...prev,
        styles: {
          ...prev.styles,
          [styleId]: {
            ...style,
            variants: updatedVariants
          }
        },
        completedJourneyGoalIds: newGoals
      };
    });
  }, []);

  const replenishAllStyleToFloor = useCallback((styleId: string) => {
    setState(prev => {
      const style = prev.styles[styleId];
      if (!style) return prev;

      let moved = false;
      const updatedVariants = style.variants.map(v => {
        if (v.backroomStock > 0) {
          moved = true;
          return {
            ...v,
            floorStock: v.floorStock + v.backroomStock,
            backroomStock: 0
          };
        }
        return v;
      });

      if (moved) sound.playPop();
      return {
        ...prev,
        styles: {
          ...prev.styles,
          [styleId]: {
            ...style,
            variants: updatedVariants
          }
        }
      };
    });
  }, []);

  // Order goods from supplier
  const createPurchaseOrder = useCallback((styleId: string, variantId: string, quantity: number) => {
    setState(prev => {
      const style = prev.styles[styleId];
      if (!style) return prev;
      const variant = style.variants.find(v => v.id === variantId);
      if (!variant) return prev;

      const supplier = prev.suppliers[style.supplierId];
      const totalCost = variant.costPrice * quantity;

      if (prev.cash < totalCost) return prev;

      sound.playPop();
      const newOrder: PurchaseOrder = {
        id: 'PO-' + Date.now(),
        supplierId: supplier.id,
        supplierName: supplier.name,
        styleId: style.id,
        styleName: style.name,
        variantId: variant.id,
        variantDesc: `${variant.colorName} - Size ${variant.size}`,
        quantity,
        totalCost,
        secondsRemaining: supplier.leadTimeSeconds,
        status: 'shipping'
      };

      return {
        ...prev,
        cash: prev.cash - totalCost,
        purchaseOrders: [newOrder, ...prev.purchaseOrders],
        currentDayStats: {
          ...prev.currentDayStats,
          cost: prev.currentDayStats.cost + totalCost,
          profit: prev.currentDayStats.profit - totalCost
        }
      };
    });
  }, []);

  // Fetch and hand product to browsing customer manually
  const fetchItemForCustomer = useCallback((customerId: string) => {
    setState(prev => {
      const idx = prev.customers.findIndex(c => c.id === customerId);
      if (idx === -1) return prev;
      const cust = prev.customers[idx];
      if (cust.state !== 'browsing' && cust.state !== 'entering') return prev;

      const style = prev.styles[cust.targetStyleId];
      if (!style) return prev;

      // Find the specific variant requested or fallback to one with stock
      let targetVariant = style.variants.find(v => v.id === cust.cartVariantId);
      if (!targetVariant) {
        targetVariant = style.variants.find(v => v.size === cust.requestedSize && (v.floorStock > 0 || v.backroomStock > 0));
      }
      if (!targetVariant) {
        targetVariant = style.variants.find(v => v.floorStock > 0 || v.backroomStock > 0) || style.variants[0];
      }

      if (!targetVariant || (targetVariant.floorStock <= 0 && targetVariant.backroomStock <= 0)) {
        sound.playAngry();
        addFloatingNumber('❌ Hết hàng cả kệ lẫn kho! Hãy nhập sỉ thêm!', 'sad');
        return prev;
      }

      let fromBackroom = false;
      const updatedVariants = style.variants.map(v => {
        if (v.id === targetVariant.id) {
          if (v.floorStock > 0) {
            return { ...v, floorStock: v.floorStock - 1, salesCount: v.salesCount + 1 };
          } else {
            fromBackroom = true;
            return { ...v, backroomStock: v.backroomStock - 1, salesCount: v.salesCount + 1 };
          }
        }
        return v;
      });

      sound.playPop();
      if (fromBackroom) {
        addFloatingNumber(`📦 Lấy kho: ${style.name} (${targetVariant.size})`, 'order');
      } else {
        addFloatingNumber(`🛍️ Đã đưa: ${style.name} (${targetVariant.size})`, 'clean');
      }

      const updatedCustomers = [...prev.customers];
      updatedCustomers[idx] = {
        ...cust,
        state: 'fitting',
        stateProgress: 20,
        patience: Math.min(100, cust.patience + 40),
        cartVariantId: targetVariant.id,
        billAmount: targetVariant.sellPrice
      };

      return {
        ...prev,
        styles: {
          ...prev.styles,
          [style.id]: {
            ...style,
            variants: updatedVariants
          }
        },
        customers: updatedCustomers
      };
    });
  }, [addFloatingNumber]);

  // Manual POS checkout & payment collection (Money is only credited here or via cashier)
  const checkoutCustomerManual = useCallback((customerId: string) => {
    setState(prev => {
      const idx = prev.customers.findIndex(c => c.id === customerId);
      if (idx === -1) return prev;
      const cust = prev.customers[idx];
      if (cust.state !== 'checkout') return prev;

      const branchBonus = prev.branches.filter(b => b.isUnlocked).reduce((sum, b) => sum + b.revenueBonusPercent, 0) / 100;
      const tipMultiplier = 1 + (0.05 * prev.upgrades.posCounter.level) + branchBonus;
      const finalBill = Math.round((cust.billAmount || 180000) * tipMultiplier);

      sound.playCash();
      addFloatingNumber(`+${finalBill.toLocaleString('vi-VN')}đ (Đã thu tiền 💳)`, 'money');

      let newReviews = [...prev.reviews];
      if (Math.random() < 0.35) {
        newReviews.unshift({
          id: 'rev-' + Date.now() + '-' + Math.random(),
          customerName: cust.name,
          customerAvatar: cust.avatar,
          stars: 5,
          category: 'service',
          comment: `Chủ shop thu ngân nhanh nhẹn, tư vấn nhiệt tình và đồ mặc siêu đẹp! ⭐⭐⭐⭐⭐`,
          timestamp: 'Vừa xong',
          replied: false
        });
      }

      const updatedCustomers = prev.customers.filter(c => c.id !== customerId);

      // Recalculate pending cart and conversion rate
      const nextServed = prev.currentDayStats.customersServed + 1;
      const totalVisitors = nextServed + prev.currentDayStats.customersLost;
      const newConversionRate = Math.round((nextServed / Math.max(1, totalVisitors)) * 100);

      return {
        ...prev,
        cash: prev.cash + finalBill,
        totalEarned: prev.totalEarned + finalBill,
        reputationExp: prev.reputationExp + 25,
        customers: updatedCustomers,
        reviews: newReviews.slice(0, 30),
        currentDayStats: {
          ...prev.currentDayStats,
          revenue: prev.currentDayStats.revenue + finalBill,
          profit: prev.currentDayStats.profit + finalBill,
          customersServed: nextServed,
          conversionRate: newConversionRate
        }
      };
    });
  }, [addFloatingNumber]);

  // Pick up an item from rack or backroom to carry in hand
  const pickItemToCarry = useCallback((styleId: string, variantId: string, source: 'rack' | 'backroom') => {
    setState(prev => {
      if (prev.playerCarry.length >= prev.playerCarryCapacity) {
        sound.playAngry();
        addFloatingNumber(`⚠️ Đã đầy tay (${prev.playerCarry.length}/${prev.playerCarryCapacity})!`, 'sad');
        return prev;
      }

      const style = prev.styles[styleId];
      if (!style) return prev;
      const variant = style.variants.find(v => v.id === variantId);
      if (!variant) return prev;

      if (source === 'rack' && variant.floorStock <= 0) {
        sound.playAngry();
        addFloatingNumber('❌ Hết hàng trên kệ!', 'sad');
        return prev;
      }
      if (source === 'backroom' && variant.backroomStock <= 0) {
        sound.playAngry();
        addFloatingNumber('❌ Hết hàng trong kho!', 'sad');
        return prev;
      }

      const updatedVariants = style.variants.map(v => {
        if (v.id === variantId) {
          return {
            ...v,
            floorStock: source === 'rack' ? v.floorStock - 1 : v.floorStock,
            backroomStock: source === 'backroom' ? v.backroomStock - 1 : v.backroomStock
          };
        }
        return v;
      });

      const newCarryItem: PlayerCarryItem = {
        id: 'carry-' + Date.now() + '-' + Math.random(),
        styleId: style.id,
        styleName: style.name,
        variantId: variant.id,
        size: variant.size,
        colorName: variant.colorName,
        colorHex: variant.colorHex,
        emoji: style.emoji,
        costPrice: variant.costPrice,
        sellPrice: variant.sellPrice,
        source
      };

      sound.playPop();
      addFloatingNumber(`📦 Cầm: ${style.name} (${variant.size}) [${prev.playerCarry.length + 1}/${prev.playerCarryCapacity}]`, 'clean');

      return {
        ...prev,
        styles: {
          ...prev.styles,
          [styleId]: {
            ...style,
            variants: updatedVariants
          }
        },
        playerCarry: [...prev.playerCarry, newCarryItem]
      };
    });
  }, [addFloatingNumber]);

  // Drop or return carried item back to rack or backroom
  const dropCarriedItem = useCallback((itemId: string, target: 'rack' | 'backroom') => {
    setState(prev => {
      const item = prev.playerCarry.find(i => i.id === itemId);
      if (!item) return prev;

      const style = prev.styles[item.styleId];
      if (!style) return prev;

      const updatedVariants = style.variants.map(v => {
        if (v.id === item.variantId) {
          return {
            ...v,
            floorStock: target === 'rack' ? v.floorStock + 1 : v.floorStock,
            backroomStock: target === 'backroom' ? v.backroomStock + 1 : v.backroomStock
          };
        }
        return v;
      });

      sound.playPop();
      addFloatingNumber(`Trả về ${target === 'rack' ? 'kệ' : 'kho'}: ${item.styleName} (${item.size})`, 'order');

      return {
        ...prev,
        styles: {
          ...prev.styles,
          [style.id]: {
            ...style,
            variants: updatedVariants
          }
        },
        playerCarry: prev.playerCarry.filter(i => i.id !== itemId)
      };
    });
  }, [addFloatingNumber]);

  // Hand carried item to waiting customer
  const giveCarriedItemToCustomer = useCallback((customerId: string, itemId: string) => {
    setState(prev => {
      const custIdx = prev.customers.findIndex(c => c.id === customerId);
      const carryIdx = prev.playerCarry.findIndex(i => i.id === itemId);
      if (custIdx === -1 || carryIdx === -1) return prev;

      const cust = prev.customers[custIdx];
      const item = prev.playerCarry[carryIdx];

      // Match check: Style and Size
      const expectedSize = cust.requestedAlternativeSize || cust.requestedSize;
      const isMatch = (item.styleId === cust.targetStyleId) && (item.size === expectedSize);

      if (!isMatch) {
        sound.playAngry();
        addFloatingNumber(`❌ Nhầm size! Khách cần ${expectedSize}, bạn đưa ${item.size}`, 'sad');
        
        // Patience penalty for wrong item (Section 10)
        const updatedCustomers = [...prev.customers];
        updatedCustomers[custIdx] = {
          ...cust,
          patience: Math.max(0, cust.patience - 18)
        };
        return {
          ...prev,
          customers: updatedCustomers
        };
      }

      // Exact match success!
      sound.playPop();
      addFloatingNumber(`✨ Khách nhận: ${item.styleName} (${item.size})`, 'clean');

      const updatedCustomers = [...prev.customers];
      updatedCustomers[custIdx] = {
        ...cust,
        state: 'fitting',
        stateProgress: 20,
        patience: Math.min(100, cust.patience + 40),
        cartVariantId: item.variantId,
        billAmount: item.sellPrice,
        cartItems: [
          ...(cust.cartItems || []),
          {
            id: 'cart-' + Date.now(),
            styleId: item.styleId,
            styleName: item.styleName,
            variantId: item.variantId,
            size: item.size,
            colorName: item.colorName,
            sellPrice: item.sellPrice,
            emoji: item.emoji
          }
        ],
        requestedAlternativeSize: undefined
      };

      const updatedTasks = prev.storeTasks.map(t => 
        t.targetCustomerId === customerId ? { ...t, status: 'completed' as const } : t
      );

      return {
        ...prev,
        playerCarry: prev.playerCarry.filter(i => i.id !== itemId),
        customers: updatedCustomers,
        storeTasks: updatedTasks
      };
    });
  }, [addFloatingNumber]);

  // Collect rejected fitting return item and return it to rack or backroom
  const collectFittingReturn = useCallback((returnId: string, target: 'rack' | 'backroom') => {
    setState(prev => {
      const returnItem = prev.fittingReturns.find(r => r.id === returnId);
      if (!returnItem) return prev;

      const style = prev.styles[returnItem.styleId];
      if (!style) return prev;

      const updatedVariants = style.variants.map(v => {
        if (v.id === returnItem.variantId) {
          return {
            ...v,
            floorStock: target === 'rack' ? v.floorStock + 1 : v.floorStock,
            backroomStock: target === 'backroom' ? v.backroomStock + 1 : v.backroomStock
          };
        }
        return v;
      });

      sound.playPop();
      addFloatingNumber(`✨ Đã cất đồ thử về ${target === 'rack' ? 'kệ' : 'kho'}!`, 'clean');

      return {
        ...prev,
        styles: {
          ...prev.styles,
          [style.id]: {
            ...style,
            variants: updatedVariants
          }
        },
        fittingReturns: prev.fittingReturns.filter(r => r.id !== returnId),
        storeTasks: prev.storeTasks.filter(t => t.id !== `task-return-${returnId}`)
      };
    });
  }, [addFloatingNumber]);

  // Fulfill alternative size request for customer inside fitting room
  const fulfillFittingSizeRequest = useCallback((customerId: string, newSize: string) => {
    setState(prev => {
      const custIdx = prev.customers.findIndex(c => c.id === customerId);
      if (custIdx === -1) return prev;
      const cust = prev.customers[custIdx];
      const style = prev.styles[cust.targetStyleId];
      if (!style) return prev;

      const variant = style.variants.find(v => v.size === newSize && (v.floorStock > 0 || v.backroomStock > 0));
      if (!variant) {
        sound.playAngry();
        addFloatingNumber(`❌ Size ${newSize} hết sạch cả kệ lẫn kho!`, 'sad');
        return prev;
      }

      const updatedVariants = style.variants.map(v => {
        if (v.id === variant.id) {
          if (v.floorStock > 0) {
            return { ...v, floorStock: v.floorStock - 1, salesCount: v.salesCount + 1 };
          } else {
            return { ...v, backroomStock: v.backroomStock - 1, salesCount: v.salesCount + 1 };
          }
        }
        return v;
      });

      sound.playPop();
      addFloatingNumber(`🪞 Đưa size ${newSize} vào phòng thử!`, 'clean');

      const updatedCustomers = [...prev.customers];
      updatedCustomers[custIdx] = {
        ...cust,
        requestedSize: newSize,
        requestedAlternativeSize: undefined,
        cartVariantId: variant.id,
        billAmount: variant.sellPrice,
        patience: Math.min(100, cust.patience + 40),
        stateProgress: 30,
        fittingAttempts: (cust.fittingAttempts || 0) + 1
      };

      const newGoals = [...prev.completedJourneyGoalIds];
      if (!newGoals.includes('day3_fitting_assist')) newGoals.push('day3_fitting_assist');
      if (!newGoals.includes('day3_fitting_exchange')) newGoals.push('day3_fitting_exchange');
      if (!newGoals.includes('day3_get_review')) newGoals.push('day3_get_review');

      return {
        ...prev,
        styles: {
          ...prev.styles,
          [style.id]: {
            ...style,
            variants: updatedVariants
          }
        },
        customers: updatedCustomers,
        completedJourneyGoalIds: newGoals,
        storeTasks: prev.storeTasks.map(t => 
          (t.targetCustomerId === customerId && t.type === 'FITTING_SIZE_REQUEST') ? { ...t, status: 'completed' as const } : t
        )
      };
    });
  }, [addFloatingNumber]);

  // Set game simulation speed: 0 (paused), 1 (1x normal), 2 (2x fast)
  const setGameSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, gameSpeed: speed }));
  }, []);

  // Transition from morning preparation to open store
  const openStoreFromPreparation = useCallback(() => {
    sound.playBell();
    setState(prev => ({
      ...prev,
      dayPhase: 'MORNING',
      isDayRunning: true,
      gameSpeed: 1
    }));
  }, []);

  // 1. Place exact SKU onto Preparation Table (Accounting Invariant: NO REVENUE!)
  const placeItemOnPrepTable = useCallback((styleId: string, variantId: string, source: 'rack' | 'backroom') => {
    setState(prev => {
      if (prev.prepTableItems.length >= 6) {
        sound.playAngry();
        addFloatingNumber('⚠️ Bàn chuẩn bị đã đầy 6 món!', 'sad');
        return prev;
      }
      const style = prev.styles[styleId];
      if (!style) return prev;
      const variant = style.variants.find(v => v.id === variantId);
      if (!variant) return prev;

      if (source === 'rack' && variant.floorStock <= 0) {
        sound.playAngry();
        addFloatingNumber('❌ Kệ đã hết size này! Lấy từ kho sau.', 'sad');
        return prev;
      }
      if (source === 'backroom' && variant.backroomStock <= 0) {
        sound.playAngry();
        addFloatingNumber('❌ Kho sau đã hết size này! Đặt sỉ thêm.', 'sad');
        return prev;
      }

      const updatedVariants = style.variants.map(v => {
        if (v.id === variantId) {
          return {
            ...v,
            floorStock: source === 'rack' ? v.floorStock - 1 : v.floorStock,
            backroomStock: source === 'backroom' ? v.backroomStock - 1 : v.backroomStock
          };
        }
        return v;
      });

      const newItem = {
        id: 'prep-' + Date.now() + '-' + Math.random(),
        styleId: style.id,
        styleName: style.name,
        variantId: variant.id,
        size: variant.size,
        colorName: variant.colorName,
        colorHex: variant.colorHex,
        emoji: style.emoji,
        sellPrice: variant.sellPrice,
        costPrice: variant.costPrice,
        source,
        state: 'PREPARED' as const,
        placedAt: Date.now()
      };

      sound.playPop();
      addFloatingNumber(`🪡 Đặt lên bàn: ${style.name} (${variant.size})`, 'order');

      const newGoals = [...prev.completedJourneyGoalIds];
      if (!newGoals.includes('day1_prep_table')) newGoals.push('day1_prep_table');
      if (!newGoals.includes('day1_pick_shirt')) newGoals.push('day1_pick_shirt');
      if (source === 'backroom' && !newGoals.includes('day2_backroom_retrieve')) newGoals.push('day2_backroom_retrieve');

      return {
        ...prev,
        styles: {
          ...prev.styles,
          [styleId]: {
            ...style,
            variants: updatedVariants
          }
        },
        prepTableItems: [...prev.prepTableItems, newItem],
        completedJourneyGoalIds: newGoals
      };
    });
  }, [addFloatingNumber]);

  // 2. Remove item from Prep Table back to stock
  const removeItemFromPrepTable = useCallback((itemId: string, returnTarget: 'rack' | 'backroom') => {
    setState(prev => {
      const item = prev.prepTableItems.find(i => i.id === itemId);
      if (!item) return prev;
      const style = prev.styles[item.styleId];
      if (!style) return prev;

      const updatedVariants = style.variants.map(v => {
        if (v.id === item.variantId) {
          return {
            ...v,
            floorStock: returnTarget === 'rack' ? v.floorStock + 1 : v.floorStock,
            backroomStock: returnTarget === 'backroom' ? v.backroomStock + 1 : v.backroomStock
          };
        }
        return v;
      });

      sound.playPop();
      addFloatingNumber(`Trả về ${returnTarget === 'rack' ? 'kệ' : 'kho'}: ${item.styleName}`, 'clean');

      return {
        ...prev,
        styles: {
          ...prev.styles,
          [style.id]: {
            ...style,
            variants: updatedVariants
          }
        },
        prepTableItems: prev.prepTableItems.filter(i => i.id !== itemId)
      };
    });
  }, [addFloatingNumber]);

  // 3. Clear all items from prep table
  const clearPrepTable = useCallback(() => {
    setState(prev => {
      if (prev.prepTableItems.length === 0) return prev;
      const updatedStyles = { ...prev.styles };
      for (const item of prev.prepTableItems) {
        const style = updatedStyles[item.styleId];
        if (style) {
          style.variants = style.variants.map(v => 
            v.id === item.variantId ? { ...v, floorStock: v.floorStock + 1 } : v
          );
        }
      }
      sound.playPop();
      addFloatingNumber('🧹 Đã cất toàn bộ đồ trên bàn về kệ!', 'clean');
      return {
        ...prev,
        styles: updatedStyles,
        prepTableItems: []
      };
    });
  }, [addFloatingNumber]);

  // 4. Hand prepared items to customer
  const handPrepTableToCustomer = useCallback((customerId: string) => {
    setState(prev => {
      const custIdx = prev.customers.findIndex(c => c.id === customerId);
      if (custIdx === -1) return prev;
      const cust = prev.customers[custIdx];

      const expectedSize = cust.requestedAlternativeSize || cust.requestedSize;
      const matchedItemIdx = prev.prepTableItems.findIndex(
        i => i.styleId === cust.targetStyleId && i.size === expectedSize
      );

      if (matchedItemIdx === -1) {
        // Customer rejects! Wrong item or not yet prepared on table
        sound.playAngry();
        addFloatingNumber(`❌ Chưa có đúng ${cust.targetCategory} size ${expectedSize} trên bàn!`, 'sad');
        const updatedCusts = [...prev.customers];
        updatedCusts[custIdx] = {
          ...cust,
          patience: Math.max(0, cust.patience - 15)
        };
        return {
          ...prev,
          customers: updatedCusts
        };
      }

      const matchedItem = prev.prepTableItems[matchedItemIdx];
      sound.playPop();
      addFloatingNumber(`✨ Khách nhận: ${matchedItem.styleName} (${matchedItem.size})`, 'clean');

      const updatedCusts = [...prev.customers];
      updatedCusts[custIdx] = {
        ...cust,
        state: 'fitting',
        stateProgress: 20,
        patience: Math.min(100, cust.patience + 40),
        cartVariantId: matchedItem.variantId,
        billAmount: matchedItem.sellPrice,
        cartItems: [
          ...(cust.cartItems || []),
          {
            id: 'cart-' + Date.now(),
            styleId: matchedItem.styleId,
            styleName: matchedItem.styleName,
            variantId: matchedItem.variantId,
            size: matchedItem.size,
            colorName: matchedItem.colorName,
            sellPrice: matchedItem.sellPrice,
            emoji: matchedItem.emoji
          }
        ],
        requestedAlternativeSize: undefined
      };

      const updatedPrep = prev.prepTableItems.filter((_, idx) => idx !== matchedItemIdx);
      const updatedTasks = prev.storeTasks.map(t => 
        t.targetCustomerId === customerId ? { ...t, status: 'completed' as const } : t
      );

      const newGoals = [...prev.completedJourneyGoalIds];
      if (!newGoals.includes('day2_match_size')) newGoals.push('day2_match_size');
      if (!newGoals.includes('day3_fitting_assist')) newGoals.push('day3_fitting_assist');

      return {
        ...prev,
        prepTableItems: updatedPrep,
        customers: updatedCusts,
        storeTasks: updatedTasks,
        completedJourneyGoalIds: newGoals
      };
    });
  }, [addFloatingNumber]);

  // 5. Context-aware POS checkout with payment method (Cash / Card / QR)
  const processPOSPayment = useCallback((customerId: string, paymentMethod: 'cash' | 'card' | 'qr', tipBonus: number = 0) => {
    setState(prev => {
      const custIdx = prev.customers.findIndex(c => c.id === customerId);
      if (custIdx === -1) return prev;
      const cust = prev.customers[custIdx];
      if (cust.state !== 'checkout') return prev;

      const branchBonus = prev.branches.filter(b => b.isUnlocked).reduce((sum, b) => sum + b.revenueBonusPercent, 0) / 100;
      const posLevelBonus = 0.05 * prev.upgrades.posCounter.level;
      const tipMultiplier = 1 + posLevelBonus + branchBonus + tipBonus;
      const finalBill = Math.round((cust.billAmount || 180000) * tipMultiplier);

      sound.playCash();
      const methodLabels = { cash: 'Tiền Mặt 💵', card: 'Thẻ Quẹt 💳', qr: 'Mã QR 📱' };
      addFloatingNumber(`+${finalBill.toLocaleString('vi-VN')}đ (${methodLabels[paymentMethod]})`, 'money');

      // 5-star review chance
      const newReviews = [...prev.reviews];
      if (Math.random() < 0.40) {
        newReviews.unshift({
          id: 'rev-' + Date.now() + '-' + Math.random(),
          customerName: cust.name,
          customerAvatar: cust.avatar,
          stars: 5,
          category: 'service',
          comment: `Quầy thu ngân thanh toán cực chuyên nghiệp qua ${methodLabels[paymentMethod]}! Đồ đẹp xuất sắc ⭐⭐⭐⭐⭐`,
          timestamp: 'Vừa xong',
          replied: false
        });
      }

      const updatedCustomers = prev.customers.filter(c => c.id !== customerId);
      const nextServed = prev.currentDayStats.customersServed + 1;
      const totalVisitors = nextServed + prev.currentDayStats.customersLost;
      const newConversionRate = Math.round((nextServed / Math.max(1, totalVisitors)) * 100);

      const newGoals = [...prev.completedJourneyGoalIds];
      if (!newGoals.includes('day1_pos_checkout')) newGoals.push('day1_pos_checkout');
      if (!newGoals.includes('day4_serve_customers')) newGoals.push('day4_serve_customers');
      if (!newGoals.includes('day5_high_volume')) newGoals.push('day5_high_volume');
      if (!newGoals.includes('day7_serve_master')) newGoals.push('day7_serve_master');
      if (prev.day === 6 && !newGoals.includes('day6_evening_peak')) newGoals.push('day6_evening_peak');

      return {
        ...prev,
        cash: prev.cash + finalBill,
        totalEarned: prev.totalEarned + finalBill,
        reputationExp: prev.reputationExp + 30,
        customers: updatedCustomers,
        reviews: newReviews.slice(0, 30),
        completedJourneyGoalIds: newGoals,
        currentDayStats: {
          ...prev.currentDayStats,
          revenue: prev.currentDayStats.revenue + finalBill,
          profit: prev.currentDayStats.profit + finalBill,
          customersServed: nextServed,
          conversionRate: newConversionRate
        }
      };
    });
  }, [addFloatingNumber]);

  // 6. Goods Receiving from Inbound Purchase Order
  const receiveGoodsPackage = useCallback((poId: string, damagedCount: number = 0) => {
    setState(prev => {
      const poIdx = prev.purchaseOrders.findIndex(p => p.id === poId);
      if (poIdx === -1) return prev;
      const po = prev.purchaseOrders[poIdx];

      const style = prev.styles[po.styleId];
      if (!style) return prev;

      const receivedGoodQty = Math.max(0, po.quantity - damagedCount);

      const updatedVariants = style.variants.map(v => {
        if (v.id === po.variantId) {
          return {
            ...v,
            backroomStock: v.backroomStock + receivedGoodQty
          };
        }
        return v;
      });

      sound.playPop();
      if (damagedCount > 0) {
        addFloatingNumber(`📦 Nhận +${receivedGoodQty} vào kho (-${damagedCount} lỗi)`, 'sad');
      } else {
        addFloatingNumber(`📦 Nhập kho thành công +${receivedGoodQty} chiếc!`, 'clean');
      }

      return {
        ...prev,
        styles: {
          ...prev.styles,
          [style.id]: {
            ...style,
            variants: updatedVariants
          }
        },
        purchaseOrders: prev.purchaseOrders.filter(p => p.id !== poId)
      };
    });
  }, [addFloatingNumber]);

  // 7. Inspect & Resolve Return/Exchange
  const inspectAndResolveReturn = useCallback((
    returnId: string, 
    condition: 'sellable' | 'repack' | 'damaged', 
    resolution: 'refund' | 'exchange', 
    exchangeSize?: string
  ) => {
    setState(prev => {
      const reqIdx = prev.returnRequests.findIndex(r => r.id === returnId);
      if (reqIdx === -1) return prev;
      const req = prev.returnRequests[reqIdx];

      if (resolution === 'refund') {
        const refundAmt = condition === 'damaged' ? Math.round(req.refundAmount * 0.7) : req.refundAmount;
        sound.playCash();
        addFloatingNumber(`-${refundAmt.toLocaleString('vi-VN')}đ (Hoàn tiền)`, 'sad');
        return {
          ...prev,
          cash: Math.max(0, prev.cash - refundAmt),
          returnRequests: prev.returnRequests.filter(r => r.id !== returnId),
          currentDayStats: {
            ...prev.currentDayStats,
            returnsProcessed: prev.currentDayStats.returnsProcessed + 1
          }
        };
      } else {
        // Exchange
        sound.playPop();
        addFloatingNumber(`🔄 Đổi sang size ${exchangeSize || 'chuẩn'}!`, 'clean');
        return {
          ...prev,
          returnRequests: prev.returnRequests.filter(r => r.id !== returnId),
          currentDayStats: {
            ...prev.currentDayStats,
            returnsProcessed: prev.currentDayStats.returnsProcessed + 1
          }
        };
      }
    });
  }, [addFloatingNumber]);

  // 8. Clean Incident Area
  const cleanIncidentArea = useCallback((targetArea: 'fitting' | 'floor') => {
    setState(prev => {
      sound.playPop();
      addFloatingNumber(`✨ Đã làm sạch ${targetArea === 'fitting' ? 'phòng thử' : 'sàn tiệm'}!`, 'clean');
      return {
        ...prev,
        cleanliness: Math.min(100, prev.cleanliness + 30),
        storeTasks: prev.storeTasks.filter(t => t.type !== 'CLEANING_NEEDED')
      };
    });
  }, [addFloatingNumber]);

  // 9. Set active workstation context
  const setActiveWorkstationContext = useCallback((contextType: string) => {
    setState(prev => ({ ...prev, activeWorkstationContext: contextType }));
  }, []);

  // Context-aware serve customer handler
  const serveCustomer = useCallback((customerId: string) => {
    const currentCust = stateRef.current.customers.find(c => c.id === customerId);
    if (!currentCust) return;

    if (currentCust.state === 'browsing' || currentCust.state === 'entering' || currentCust.state === 'needs_assistance') {
      fetchItemForCustomer(customerId);
    } else if (currentCust.state === 'checkout') {
      checkoutCustomerManual(customerId);
    } else if (currentCust.state === 'fitting') {
      sound.playPop();
      setState(prev => ({
        ...prev,
        customers: prev.customers.map(c => c.id === customerId ? {
          ...c,
          stateProgress: Math.min(100, c.stateProgress + 40),
          patience: Math.min(100, c.patience + 25)
        } : c)
      }));
    }
  }, [fetchItemForCustomer, checkoutCustomerManual]);

  // Rush fitting for all customers currently trying on clothes
  const rushFitting = useCallback(() => {
    setState(prev => {
      let boosted = false;
      const updated = prev.customers.map(c => {
        if (c.state === 'fitting') {
          boosted = true;
          return { ...c, stateProgress: Math.min(100, c.stateProgress + 45) };
        }
        return c;
      });
      if (boosted) sound.playPop();
      return { ...prev, customers: updated };
    });
  }, []);

  // Rush checkout: collect all pending bills at once & credit cash
  const rushCheckout = useCallback(() => {
    setState(prev => {
      const checkoutCusts = prev.customers.filter(c => c.state === 'checkout');
      if (checkoutCusts.length === 0) return prev;

      const branchBonus = prev.branches.filter(b => b.isUnlocked).reduce((sum, b) => sum + b.revenueBonusPercent, 0) / 100;
      const tipMultiplier = 1 + (0.05 * prev.upgrades.posCounter.level) + branchBonus;

      let totalRushedCash = 0;
      for (const cust of checkoutCusts) {
        totalRushedCash += Math.round((cust.billAmount || 180000) * tipMultiplier);
      }

      sound.playCash();
      addFloatingNumber(`+${totalRushedCash.toLocaleString('vi-VN')}đ (Thanh toán hết! 💳)`, 'money');

      return {
        ...prev,
        cash: prev.cash + totalRushedCash,
        totalEarned: prev.totalEarned + totalRushedCash,
        reputationExp: prev.reputationExp + checkoutCusts.length * 20,
        customers: prev.customers.filter(c => c.state !== 'checkout'),
        currentDayStats: {
          ...prev.currentDayStats,
          revenue: prev.currentDayStats.revenue + totalRushedCash,
          profit: prev.currentDayStats.profit + totalRushedCash,
          customersServed: prev.currentDayStats.customersServed + checkoutCusts.length
        }
      };
    });
  }, [addFloatingNumber]);

  // Customer Return Resolution
  const resolveReturn = useCallback((returnId: string, approve: boolean) => {
    setState(prev => {
      const ret = prev.returnRequests.find(r => r.id === returnId);
      if (!ret) return prev;

      if (approve) {
        sound.playCash();
        addFloatingNumber(`-${ret.refundAmount.toLocaleString('vi-VN')}đ`, 'sad');
      } else {
        sound.playAngry();
      }

      return {
        ...prev,
        cash: approve ? Math.max(0, prev.cash - ret.refundAmount) : prev.cash,
        returnRequests: prev.returnRequests.filter(r => r.id !== returnId),
        currentDayStats: {
          ...prev.currentDayStats,
          returnsProcessed: prev.currentDayStats.returnsProcessed + 1
        }
      };
    });
  }, [addFloatingNumber]);

  // Online Orders
  const speedUpOnlineOrder = useCallback((orderId: string) => {
    setState(prev => {
      sound.playPop();
      return {
        ...prev,
        onlineOrders: prev.onlineOrders.map(o => {
          if (o.id === orderId) {
            return { ...o, progress: Math.min(100, o.progress + 45) };
          }
          return o;
        })
      };
    });
  }, []);

  // HR / Staff Management
  const hireEmployee = useCallback((role: StaffRole, shift: WorkShift) => {
    setState(prev => {
      const roleLabels: Record<StaffRole, { label: string; wage: number; avatar: string }> = {
        manager: { label: 'Cửa Hàng Trưởng (Store Manager)', wage: 50000, avatar: '👩‍💼' },
        sales: { label: 'Stylist Tư Vấn Bán Lẻ', wage: 28000, avatar: '💁‍♀️' },
        cashier: { label: 'Thu Ngân Quầy POS', wage: 25000, avatar: '🧑‍💻' },
        stock: { label: 'Nhân Viên Kho Vận & Tiếp Hàng', wage: 24000, avatar: '📦' },
        fitting: { label: 'Trợ Lý Phòng Thử Đồ', wage: 22000, avatar: '🪞' },
        cleaning: { label: 'Nhân Viên Vệ Sinh Sàn & Gương', wage: 20000, avatar: '🧹' }
      };

      const info = roleLabels[role];
      const hiringFee = info.wage * 2;
      if (prev.cash < hiringFee) return prev;

      const randomName = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];
      const newEmp: Employee = {
        id: 'emp-' + Date.now(),
        name: randomName,
        avatar: info.avatar,
        role,
        roleLabel: info.label,
        wagePerDay: info.wage,
        skillLevel: 2,
        morale: 90,
        energy: 90,
        stress: 15,
        shift,
        branchId: prev.activeBranchId
      };

      sound.playPop();
      const newGoals = [...prev.completedJourneyGoalIds];
      if (!newGoals.includes('day5_hire_staff')) newGoals.push('day5_hire_staff');
      if (!newGoals.includes('day5_assign_role')) newGoals.push('day5_assign_role');

      return {
        ...prev,
        cash: prev.cash - hiringFee,
        employees: [...prev.employees, newEmp],
        completedJourneyGoalIds: newGoals
      };
    });
  }, []);

  const fireEmployee = useCallback((empId: string) => {
    setState(prev => ({
      ...prev,
      employees: prev.employees.filter(e => e.id !== empId)
    }));
  }, []);

  const trainEmployee = useCallback((empId: string) => {
    setState(prev => {
      const emp = prev.employees.find(e => e.id === empId);
      if (!emp || emp.skillLevel >= 5) return prev;
      const trainCost = emp.wagePerDay * 3;
      if (prev.cash < trainCost) return prev;

      sound.playLevelUp();
      return {
        ...prev,
        cash: prev.cash - trainCost,
        employees: prev.employees.map(e => e.id === empId ? {
          ...e,
          skillLevel: e.skillLevel + 1,
          morale: Math.min(100, e.morale + 15),
          stress: Math.max(0, e.stress - 10)
        } : e)
      };
    });
  }, []);

  const changeEmployeeShift = useCallback((empId: string, newShift: WorkShift) => {
    setState(prev => ({
      ...prev,
      employees: prev.employees.map(e => e.id === empId ? { ...e, shift: newShift } : e)
    }));
  }, []);

  // Customer Reviews & Merchant Replies
  const replyToReview = useCallback((reviewId: string, replyType: 'thank' | 'apologize' | 'voucher', note: string) => {
    setState(prev => {
      sound.playPop();
      addFloatingNumber('+20 EXP Phản Hồi', 'rep');

      return {
        ...prev,
        reputationExp: prev.reputationExp + 20,
        reviews: prev.reviews.map(r => r.id === reviewId ? {
          ...r,
          replied: true,
          replyType,
          replyNote: note
        } : r)
      };
    });
  }, [addFloatingNumber]);

  // Shop Upgrades
  const upgradeShop = useCallback((upgradeKey: keyof GameState['upgrades']) => {
    setState(prev => {
      const item = prev.upgrades[upgradeKey];
      if (item.level >= item.maxLevel) return prev;

      const cost = Math.round(item.baseCost * Math.pow(item.costMultiplier, item.level - 1));
      if (prev.cash < cost) return prev;

      sound.playLevelUp();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      return {
        ...prev,
        cash: prev.cash - cost,
        upgrades: {
          ...prev.upgrades,
          [upgradeKey]: {
            ...item,
            level: item.level + 1
          }
        }
      };
    });
  }, []);

  // Unlock expansion branch
  const unlockBranch = useCallback((branchId: string) => {
    setState(prev => {
      const branch = prev.branches.find(b => b.id === branchId);
      if (!branch || branch.isUnlocked || prev.cash < branch.unlockCost) return prev;

      sound.playLevelUp();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 }
      });

      return {
        ...prev,
        cash: prev.cash - branch.unlockCost,
        branches: prev.branches.map(b => b.id === branchId ? { ...b, isUnlocked: true } : b)
      };
    });
  }, []);

  const setActiveBranch = (branchId: string) => {
    setState(prev => ({ ...prev, activeBranchId: branchId }));
  };

  const addCash = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      cash: prev.cash + amount,
      totalEarned: amount > 0 ? prev.totalEarned + amount : prev.totalEarned,
      currentDayStats: {
        ...prev.currentDayStats,
        revenue: amount > 0 ? prev.currentDayStats.revenue + amount : prev.currentDayStats.revenue
      }
    }));
    sound.playCash();
  }, []);

  const addReputationExp = useCallback((amount: number) => {
    setState(prev => {
      let exp = prev.reputationExp + amount;
      let stars = prev.reputationStars;
      let nextExp = prev.reputationNextExp;
      while (exp >= nextExp && stars < 5) {
        exp -= nextExp;
        stars += 1;
        nextExp = Math.round(nextExp * 1.5);
        sound.playLevelUp();
      }
      return {
        ...prev,
        reputationExp: exp,
        reputationStars: stars,
        reputationNextExp: nextExp
      };
    });
  }, []);

  // Claim lookbook combo reward
  const claimLookbookOutfit = useCallback((lookbookId: string) => {
    setState(prev => {
      const outfit = prev.lookbookOutfits.find(o => o.id === lookbookId);
      if (!outfit || outfit.isCompleted) return prev;

      sound.playLevelUp();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.4 }
      });

      return {
        ...prev,
        reputationExp: prev.reputationExp + outfit.expReward,
        lookbookOutfits: prev.lookbookOutfits.map(o => o.id === lookbookId ? { ...o, isCompleted: true } : o)
      };
    });
  }, []);

  // Start next business day & reconcile financial P&L
  const startNextDay = useCallback(() => {
    setIsDaySummaryOpen(false);
    sound.playBell();

    if (stateRef.current.day === 7) {
      setIsWeek7ReviewOpen(true);
    }

    setState(prev => {
      // Calculate daily payroll and active rent
      const totalDailyPayroll = prev.employees.reduce((sum, e) => sum + e.wagePerDay, 0);
      const totalDailyRent = prev.branches.filter(b => b.isUnlocked).reduce((sum, b) => sum + b.dailyRent, 0);

      // Diagnostic Business Advisor Generator
      const newInsights: BusinessAdvisorInsight[] = [];
      const stats = prev.currentDayStats;

      if (stats.customersLost > 3) {
        newInsights.push({
          id: 'insight-lost-' + Date.now(),
          type: 'warning',
          title: 'Khách Hàng Bỏ Đi Do Hết Hàng Hoặc Chờ Quá Lâu',
          description: `Có ${stats.customersLost} khách đã rời tiệm trong ngày hôm nay mà không mua được hàng.`,
          rootCause: 'Kệ hàng thiếu size chính xác hoặc phòng thử/quầy thu ngân bị quá tải.',
          recommendation: 'Bổ sung nhân viên quầy POS hoặc đặt thêm hàng sỉ các size bán chạy.'
        });
      }

      if (prev.cleanliness < 70) {
        newInsights.push({
          id: 'insight-clean-' + Date.now(),
          type: 'warning',
          title: 'Độ Vệ Sinh Sàn Cần Được Cải Thiện',
          description: `Độ sạch sẽ cửa hàng hiện ở mức ${prev.cleanliness}%, làm giảm tỷ lệ đánh giá 5 sao.`,
          rootCause: 'Lưu lượng khách lớn nhưng chưa có đủ nhân viên vệ sinh dọn dẹp.',
          recommendation: 'Thuê thêm Nhân Viên Vệ Sinh hoặc chủ động dùng nút Quét Dọn Sàn.'
        });
      }

      if (stats.profit > 500000) {
        newInsights.push({
          id: 'insight-profit-' + Date.now(),
          type: 'success',
          title: 'Lợi Nhuận Bùng Nổ! Thời Điểm Mở Rộng',
          description: `Lợi nhuận ròng đạt ${stats.profit.toLocaleString('vi-VN')}đ, dòng tiền dồi dào.`,
          rootCause: 'Sự kết hợp ăn ý giữa ma trận hàng hóa đủ size và nhân viên phục vụ tận tình.',
          recommendation: 'Tận dụng vốn để mở thêm chi nhánh mới trên Bản Đồ Việt Nam.'
        });
      }

      const newGoals = [...prev.completedJourneyGoalIds];
      if (prev.day === 6) {
        if (!newGoals.includes('day6_check_traffic')) newGoals.push('day6_check_traffic');
        if (!newGoals.includes('day6_low_loss')) newGoals.push('day6_low_loss');
      }
      if (prev.day === 7) {
        if (!newGoals.includes('day7_serve_master')) newGoals.push('day7_serve_master');
        if (!newGoals.includes('day7_review_report')) newGoals.push('day7_review_report');
      }

      return {
        ...prev,
        day: prev.day + 1,
        dayTime: 0,
        isDayRunning: true,
        gameSpeed: 1,
        dayPhase: 'MORNING',
        currentInGameMinutes: 480, // 08:00 AM
        playerCarry: [],
        fittingReturns: [],
        storeTasks: [],
        cash: Math.max(0, prev.cash - (totalDailyPayroll + totalDailyRent)),
        customers: [],
        yesterdayStats: { ...prev.currentDayStats, payroll: totalDailyPayroll, rent: totalDailyRent },
        advisorInsights: newInsights.length > 0 ? newInsights : prev.advisorInsights,
        completedJourneyGoalIds: newGoals,
        currentDayStats: {
          revenue: 0,
          cost: 0,
          payroll: totalDailyPayroll,
          rent: totalDailyRent,
          profit: 0,
          customersServed: 0,
          customersLost: 0,
          lostSalesValue: 0,
          pendingCartValue: 0,
          stockoutLostCount: 0,
          queueAbandonCount: 0,
          conversionRate: 0,
          onlineOrdersCompleted: 0,
          returnsProcessed: 0,
          averageSatisfaction: 95
        }
      };
    });
  }, []);

  const closeDaySummary = () => {
    setIsDaySummaryOpen(false);
  };

  const manualSave = () => {
    saveGameState(state);
    sound.playPop();
    addFloatingNumber('💾 Đã lưu dữ liệu!', 'clean');
  };

  const switchSlot = (slotId: string) => {
    setActiveSlotId(slotId);
    const loaded = loadGameState(slotId);
    if (loaded && loaded.styles) {
      setState({
        ...INITIAL_GAME_STATE,
        ...loaded,
        isDayRunning: true,
        floatingNumbers: []
      });
    } else {
      setState(INITIAL_GAME_STATE);
    }
    sound.playBell();
  };

  const resetGame = () => {
    clearGameState();
    setState(INITIAL_GAME_STATE);
  };

  // 1-SECOND GAME LOOP
  useEffect(() => {
    const timer = setInterval(() => {
      const current = stateRef.current;
      if (!current.isDayRunning) return;
      if (current.gameSpeed === 0) return; // ⏸ Paused simulation

      // Do not advance clock while in morning preparation
      if (current.dayPhase === 'PREPARATION') return;

      const speedMult = current.gameSpeed || 1;

      // 1. Advance Day Timer and In-Game Clock
      const nextDayTime = Math.min(DAY_DURATION, current.dayTime + speedMult);
      const inGameMinutes = Math.min(1320, 480 + Math.floor((nextDayTime / DAY_DURATION) * 840));

      // Determine Day Phase based on clock and customer count
      let currentPhase: DayPhase = current.dayPhase;
      if (inGameMinutes < 660) {
        currentPhase = 'MORNING';
      } else if (inGameMinutes < 840) {
        currentPhase = 'LUNCH_PEAK';
      } else if (inGameMinutes < 1020) {
        currentPhase = 'AFTERNOON';
      } else if (inGameMinutes < 1200) {
        currentPhase = 'EVENING_PEAK';
      } else if (nextDayTime < DAY_DURATION && inGameMinutes < 1320) {
        currentPhase = 'CLOSING';
      } else {
        // After 22:00 or day duration elapsed: Grace period or End of Day
        if (current.customers.length > 0) {
          currentPhase = 'CLOSING_GRACE';
        } else {
          currentPhase = 'END_OF_DAY';
        }
      }

      // Check for End of Day trigger
      if (currentPhase === 'END_OF_DAY') {
        sound.playLevelUp();
        confetti({
          particleCount: 150,
          spread: 85,
          origin: { y: 0.5 }
        });
        setIsDaySummaryOpen(true);
        setState(prev => ({
          ...prev,
          dayTime: DAY_DURATION,
          currentInGameMinutes: 1320,
          dayPhase: 'END_OF_DAY',
          isDayRunning: false,
          gameSpeed: 1
        }));
        return;
      }

      // Phase Traffic Multipliers
      let phaseTrafficMultiplier = 1.0;
      switch (currentPhase) {
        case 'MORNING': phaseTrafficMultiplier = 0.9; break;
        case 'LUNCH_PEAK': phaseTrafficMultiplier = 1.4; break;
        case 'AFTERNOON': phaseTrafficMultiplier = 1.0; break;
        case 'EVENING_PEAK': phaseTrafficMultiplier = 1.6; break;
        case 'CLOSING': phaseTrafficMultiplier = 0.6; break;
        case 'CLOSING_GRACE': phaseTrafficMultiplier = 0.0; break; // STRICT: NO NEW WALK-INS
        default: phaseTrafficMultiplier = 1.0; break;
      }

      // 2. Cleanliness Logic (Traffic reduces, cleaners restore)
      let nextCleanliness = current.cleanliness;
      const cleanersOnShift = current.employees.filter(e => e.role === 'cleaning');
      if (current.customers.length > 0 && Math.random() < 0.2 * speedMult) {
        nextCleanliness = Math.max(10, nextCleanliness - 1);
      }
      if (cleanersOnShift.length > 0 && nextCleanliness < 100 && Math.random() < 0.35 * speedMult) {
        nextCleanliness = Math.min(100, nextCleanliness + cleanersOnShift.length * 2);
      }

      // 3. Purchase Orders Inbound
      let updatedStyles = { ...current.styles };
      let remainingPOs: PurchaseOrder[] = [];

      for (const po of current.purchaseOrders) {
        if (po.secondsRemaining <= speedMult) {
          const style = updatedStyles[po.styleId];
          if (style) {
            const updatedVariants = style.variants.map(v => {
              if (v.id === po.variantId) {
                return {
                  ...v,
                  backroomStock: v.backroomStock + po.quantity
                };
              }
              return v;
            });
            updatedStyles[po.styleId] = {
              ...style,
              variants: updatedVariants
            };
          }
          sound.playPop();
          addFloatingNumber(`📦 Đã nhận +${po.quantity} ${po.styleName}`, 'order');
        } else {
          remainingPOs.push({
            ...po,
            secondsRemaining: po.secondsRemaining - speedMult
          });
        }
      }

      // 4. Online Orders
      let nextOnlineOrders: OnlineOrder[] = [];
      let onlineOrderCashEarned = 0;
      const deliverySpeedBonus = current.upgrades.deliverySpeed.level * 10;

      for (const ord of current.onlineOrders) {
        const nextProgress = ord.progress + (20 + deliverySpeedBonus) * speedMult;
        if (nextProgress >= 100) {
          onlineOrderCashEarned += ord.totalAmount;
          sound.playCash();
          addFloatingNumber(`+${ord.totalAmount.toLocaleString('vi-VN')}đ (Đơn Online)`, 'order');
        } else {
          nextOnlineOrders.push({
            ...ord,
            progress: nextProgress
          });
        }
      }

      // Spawn new online order
      if (current.upgrades.deliverySpeed.level > 0 && nextOnlineOrders.length < 3 && Math.random() < (0.25 * speedMult)) {
        const styleKeys = Object.keys(updatedStyles);
        const randomStyle = updatedStyles[styleKeys[Math.floor(Math.random() * styleKeys.length)]];
        const randomVar = randomStyle.variants[Math.floor(Math.random() * randomStyle.variants.length)];
        
        if (randomVar && (randomVar.floorStock > 0 || randomVar.backroomStock > 0)) {
          if (randomVar.floorStock > 0) randomVar.floorStock -= 1;
          else randomVar.backroomStock -= 1;

          nextOnlineOrders.push({
            id: 'ORD-' + Date.now(),
            customerName: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
            customerAvatar: CUSTOMER_AVATARS[Math.floor(Math.random() * CUSTOMER_AVATARS.length)],
            styleName: randomStyle.name,
            variantDesc: `${randomVar.colorName} (${randomVar.size})`,
            totalAmount: randomVar.sellPrice,
            status: 'shipping',
            progress: 10
          });
        }
      }

      // 5. Customer Traffic Spawning (No spawning during CLOSING_GRACE!)
      const avgReviewRating = current.reviews.length > 0 
        ? current.reviews.reduce((sum, r) => sum + r.stars, 0) / current.reviews.length 
        : 4.8;
      
      const reviewModifier = avgReviewRating >= 4.5 ? 1.25 : avgReviewRating >= 3.5 ? 1.0 : 0.75;
      const cleanlinessModifier = nextCleanliness >= 80 ? 1.15 : nextCleanliness < 50 ? 0.7 : 0.95;
      const manager = current.employees.find(e => e.role === 'manager');
      const managerBonus = manager ? 1 + (manager.skillLevel * 0.05) : 0.95;

      const dynamicTrafficRate = (0.28 + (current.reputationStars * 0.06) + (current.upgrades.marketing.level * 0.08)) 
        * reviewModifier 
        * cleanlinessModifier 
        * managerBonus
        * phaseTrafficMultiplier;

      const maxCustomersInShop = 3 + current.upgrades.shopSpace.level * 2;
      let nextCustomers = [...current.customers];

      if (currentPhase !== 'CLOSING_GRACE' && nextCustomers.length < maxCustomersInShop && Math.random() < (dynamicTrafficRate * speedMult)) {
        const styleKeys = Object.keys(updatedStyles);
        const chosenStyle = updatedStyles[styleKeys[Math.floor(Math.random() * styleKeys.length)]];
        const chosenVar = chosenStyle.variants[Math.floor(Math.random() * chosenStyle.variants.length)];
        const archetype = CUSTOMER_ARCHETYPES[Math.floor(Math.random() * CUSTOMER_ARCHETYPES.length)];
        const isVip = archetype === 'Khách VIP Sang Trọng';

        const newCust: Customer = {
          id: 'cust-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          name: isVip ? `⭐ VIP ${CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)]}` : CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
          avatar: CUSTOMER_AVATARS[Math.floor(Math.random() * CUSTOMER_AVATARS.length)],
          archetype,
          targetStyleId: chosenStyle.id,
          targetCategory: chosenStyle.category,
          requestedSize: chosenVar.size,
          preferredColor: chosenVar.colorName,
          budget: isVip ? chosenVar.sellPrice * 2.5 : chosenVar.sellPrice * 1.5,
          patience: 100,
          maxPatience: 100,
          state: 'entering',
          stateProgress: 0,
          cartVariantId: chosenVar.id,
          billAmount: chosenVar.sellPrice,
          cartItems: []
        };
        nextCustomers.push(newCust);
        sound.playBell();
      }

      // 6. Process Staff Automation & Customer Micro-loop
      const salesAssociates = current.employees.filter(e => e.role === 'sales');
      const stockAssociates = current.employees.filter(e => e.role === 'stock');
      const fittingAssistants = current.employees.filter(e => e.role === 'fitting');
      const cashiers = current.employees.filter(e => e.role === 'cashier');

      // 6a. Stock Associate Automation (Returns fitting returns or restocks low racks)
      let nextFittingReturns = [...current.fittingReturns];
      if (stockAssociates.length > 0 && Math.random() < (0.28 * stockAssociates.length * speedMult)) {
        if (nextFittingReturns.length > 0) {
          // Stock associate returns one fitting return item to rack or backroom
          const returnToClear = nextFittingReturns[0];
          nextFittingReturns = nextFittingReturns.slice(1);
          const style = updatedStyles[returnToClear.styleId];
          if (style) {
            style.variants = style.variants.map(v => 
              v.id === returnToClear.variantId ? { ...v, floorStock: v.floorStock + 1 } : v
            );
          }
          addFloatingNumber(`📦 Nhân viên kho cất đồ thử về kệ`, 'clean');
        } else {
          // Stock associate restocks a low rack variant (floorStock <= 2 && backroomStock > 0)
          for (const sId of Object.keys(updatedStyles)) {
            const st = updatedStyles[sId];
            const lowVar = st.variants.find(v => v.floorStock <= 2 && v.backroomStock > 0);
            if (lowVar) {
              const transferAmount = Math.min(3, lowVar.backroomStock);
              lowVar.floorStock += transferAmount;
              lowVar.backroomStock -= transferAmount;
              addFloatingNumber(`📦 Kho tiếp +${transferAmount} ${st.name} lên kệ`, 'clean');
              break;
            }
          }
        }
      }

      const fittingSpeed = (12 + current.upgrades.fittingRooms.level * 6 + (fittingAssistants.length * 6)) * speedMult;
      const cashierScanSpeed = (16 + current.upgrades.posCounter.level * 8 + (cashiers.length * 10)) * speedMult;

      let floorSalesCash = 0;
      let expEarned = 0;
      let servedCount = 0;
      let lostCount = 0;
      let lostSalesVal = 0;
      let stockoutLost = 0;
      let queueAbandonLost = 0;
      let newReviews: CustomerReview[] = [];
      let salesStaffAssisted = false;

      nextCustomers = nextCustomers.map(cust => {
        let updated = { ...cust };

        switch (updated.state) {
          case 'entering':
            updated.state = 'browsing';
            break;

          case 'browsing': {
            // If Sales Consultant is on duty, can assist waiting customer
            if (!salesStaffAssisted && salesAssociates.length > 0 && Math.random() < (0.28 * salesAssociates.length * speedMult)) {
              const style = updatedStyles[updated.targetStyleId];
              if (style) {
                const matchedVar = style.variants.find(v => v.id === updated.cartVariantId) || style.variants.find(v => v.floorStock > 0 || v.backroomStock > 0);
                if (matchedVar && (matchedVar.floorStock > 0 || matchedVar.backroomStock > 0)) {
                  if (matchedVar.floorStock > 0) matchedVar.floorStock -= 1;
                  else matchedVar.backroomStock -= 1;
                  matchedVar.salesCount += 1;
                  updated.state = 'fitting';
                  updated.stateProgress = 15;
                  updated.patience = Math.min(100, updated.patience + 35);
                  updated.cartItems = [{
                    id: 'cart-' + Date.now(),
                    styleId: style.id,
                    styleName: style.name,
                    variantId: matchedVar.id,
                    size: matchedVar.size,
                    colorName: matchedVar.colorName,
                    sellPrice: matchedVar.sellPrice,
                    emoji: style.emoji
                  }];
                  salesStaffAssisted = true;
                  addFloatingNumber('💁‍♀️ Stylist lấy size cho khách', 'clean');
                  break;
                }
              }
            }

            // Customer waits for player or stylist! Patience ticks down
            const style = updatedStyles[updated.targetStyleId];
            const hasStock = style?.variants.some(v => v.floorStock > 0 || v.backroomStock > 0);
            if (hasStock) {
              updated.patience -= 1 * speedMult;
            } else {
              updated.patience -= 3 * speedMult;
            }
            break;
          }

          case 'fitting': {
            // Fitting Room Progress
            updated.stateProgress += fittingSpeed;
            if (updated.stateProgress >= 100) {
              // Fitting Room Decision Logic (Section 4)
              const attempts = updated.fittingAttempts || 0;
              const rand = Math.random();

              if (attempts < 1 && rand < 0.20) {
                // Customer requests an alternative size
                const sizeList = ['S', 'M', 'L', 'XL'];
                const curIdx = sizeList.indexOf(updated.requestedSize);
                const altSize = curIdx >= 2 ? sizeList[curIdx - 1] : sizeList[curIdx + 1] || 'L';

                updated.requestedAlternativeSize = altSize;
                updated.state = 'fitting';
                updated.stateProgress = 25;
                updated.patience = Math.min(100, updated.patience + 25);
                updated.fittingAttempts = attempts + 1;
                sound.playPop();
                addFloatingNumber(`🪞 Khách muốn đổi size ${altSize}!`, 'order');
              } else if (rand < 0.10) {
                // Customer rejects fit: item sent to fitting return bin
                const style = updatedStyles[updated.targetStyleId];
                if (style) {
                  nextFittingReturns.push({
                    id: 'ret-' + Date.now() + '-' + Math.random(),
                    styleId: updated.targetStyleId,
                    styleName: style.name,
                    variantId: updated.cartVariantId || '',
                    size: updated.requestedSize,
                    colorName: updated.preferredColor,
                    sellPrice: updated.billAmount || 0,
                    emoji: style.emoji,
                    timestamp: new Date().toLocaleTimeString(),
                    returnedAt: Date.now()
                  });
                }
                updated.state = 'angry';
                updated.patience = 0;
                addFloatingNumber('🪞 Đồ thử không vừa, khách gửi lại đồ!', 'sad');
              } else {
                // Accepted fit! Customer walks to checkout counter
                updated.state = 'checkout';
                updated.stateProgress = 0;
              }
            } else {
              updated.patience -= (nextCleanliness < 60 ? 2 : 1) * speedMult;
            }
            break;
          }

          case 'checkout':
            // If Cashiers are hired, they scan and process payment automatically
            if (cashiers.length > 0) {
              updated.stateProgress += cashierScanSpeed;
              if (updated.stateProgress >= 100) {
                updated.state = 'satisfied'; // Cashier finishes scanning -> payment credited!
              } else {
                updated.patience -= 1 * speedMult;
              }
            } else {
              // No cashier hired: customer waits in queue for player POS action
              updated.patience -= 1 * speedMult;
            }
            break;

          case 'satisfied':
          case 'angry':
            break;
        }

        if (updated.state !== 'satisfied' && updated.patience <= 0) {
          updated.state = 'angry';
        }

        return updated;
      });

      // 7. Resolve finished customers
      const remainingCustomers: Customer[] = [];
      const branchBonus = current.branches.filter(b => b.isUnlocked).reduce((sum, b) => sum + b.revenueBonusPercent, 0) / 100;

      for (const cust of nextCustomers) {
        if (cust.state === 'satisfied') {
          // Cashier automated checkout completion
          const tipMultiplier = 1 + (0.05 * current.upgrades.posCounter.level) + branchBonus;
          const finalBill = Math.round((cust.billAmount || 180000) * tipMultiplier);

          floorSalesCash += finalBill;
          expEarned += 25;
          servedCount += 1;
          sound.playCash();
          addFloatingNumber(`+${finalBill.toLocaleString('vi-VN')}đ (Thu ngân)`, 'money');

          if (Math.random() < 0.25) {
            newReviews.push({
              id: 'rev-' + Date.now() + '-' + Math.random(),
              customerName: cust.name,
              customerAvatar: cust.avatar,
              stars: 5,
              category: 'product',
              comment: `Đồ đẹp chuẩn form, nhân viên thu ngân siêu nhanh và tiệm rất sạch sẽ! ⭐⭐⭐⭐⭐`,
              timestamp: 'Vừa xong',
              replied: false
            });
          }
        } else if (cust.state === 'angry') {
          lostCount += 1;
          lostSalesVal += cust.billAmount || 0;

          if (cust.stateProgress === 0 && (cust.cartItems?.length || 0) === 0) {
            stockoutLost += 1;
          } else {
            queueAbandonLost += 1;
          }

          // Return any unpurchased carried/cart item to fittingReturns bin so inventory is not lost
          if (cust.cartVariantId) {
            const style = updatedStyles[cust.targetStyleId];
            if (style) {
              nextFittingReturns.push({
                id: 'ret-abandon-' + Date.now() + '-' + Math.random(),
                styleId: cust.targetStyleId,
                styleName: style.name,
                variantId: cust.cartVariantId,
                size: cust.requestedSize,
                colorName: cust.preferredColor,
                sellPrice: cust.billAmount || 0,
                emoji: style.emoji,
                timestamp: new Date().toLocaleTimeString(),
                returnedAt: Date.now()
              });
            }
          }

          sound.playAngry();
          addFloatingNumber('💔 Khách giận bỏ về!', 'sad');

          if (Math.random() < 0.40) {
            newReviews.push({
              id: 'rev-' + Date.now() + '-' + Math.random(),
              customerName: cust.name,
              customerAvatar: cust.avatar,
              stars: Math.random() < 0.5 ? 2 : 1,
              category: 'queue',
              comment: `Chờ đợi lấy đồ lâu quá, hết size trên kệ! Shop cần tăng cường nhân sự phục vụ.`,
              timestamp: 'Vừa xong',
              replied: false
            });
          }
        } else {
          remainingCustomers.push(cust);
        }
      }

      // 8. Sync Store Tasks Queue (Section 6)
      const tasks: StoreTask[] = [];

      // 8a. Item requests for browsing customers
      for (const c of remainingCustomers) {
        if (c.state === 'browsing' || c.state === 'entering') {
          tasks.push({
            id: `task-req-${c.id}`,
            type: 'CUSTOMER_ITEM_REQUEST',
            title: `Lấy ${c.targetCategory} size ${c.requestedSize}`,
            priority: c.patience < 40 ? 'high' : 'normal',
            targetCustomerId: c.id,
            targetStyleId: c.targetStyleId,
            targetSize: c.requestedSize,
            createdAt: Date.now(),
            status: 'open'
          });
        } else if (c.state === 'fitting' && c.requestedAlternativeSize) {
          tasks.push({
            id: `task-alt-${c.id}`,
            type: 'FITTING_SIZE_REQUEST',
            title: `Đổi size ${c.requestedAlternativeSize} phòng thử`,
            priority: 'urgent',
            targetCustomerId: c.id,
            targetStyleId: c.targetStyleId,
            targetSize: c.requestedAlternativeSize,
            createdAt: Date.now(),
            status: 'open'
          });
        }
      }

      // 8b. Fitting return items to put back
      for (const ret of nextFittingReturns) {
        tasks.push({
          id: `task-return-${ret.id}`,
          type: 'RETURN_FITTING_ITEM',
          title: `Cất ${ret.styleName} (${ret.size}) về kệ`,
          priority: 'normal',
          targetStyleId: ret.styleId,
          targetSize: ret.size,
          createdAt: ret.returnedAt || Date.now(),
          status: 'open'
        });
      }

      // 8c. Checkout queue tasks
      const checkoutWaiting = remainingCustomers.filter(c => c.state === 'checkout');
      if (checkoutWaiting.length > 0 && cashiers.length === 0) {
        tasks.push({
          id: 'task-cashier-queue',
          type: 'CASHIER_NEEDED',
          title: `Quẹt POS cho ${checkoutWaiting.length} khách đang đợi`,
          priority: checkoutWaiting.length >= 2 ? 'urgent' : 'high',
          createdAt: Date.now(),
          status: 'open'
        });
      }

      // 8d. Cleaning needed
      if (nextCleanliness < 70) {
        tasks.push({
          id: 'task-cleaning-dirty',
          type: 'CLEANING_NEEDED',
          title: `Sàn tiệm dơ (${nextCleanliness}%) - Cần quét dọn`,
          priority: nextCleanliness < 50 ? 'urgent' : 'normal',
          createdAt: Date.now(),
          status: 'open'
        });
      }

      // 8e. Restock fixtures
      for (const sId of Object.keys(updatedStyles)) {
        const st = updatedStyles[sId];
        const lowV = st.variants.find(v => v.floorStock <= 2 && v.backroomStock > 0);
        if (lowV) {
          tasks.push({
            id: `task-restock-${st.id}-${lowV.id}`,
            type: 'RESTOCK_FIXTURE',
            title: `Châm thêm ${st.name} (${lowV.size}) lên kệ`,
            priority: 'normal',
            targetStyleId: st.id,
            targetSize: lowV.size,
            createdAt: Date.now(),
            status: 'open'
          });
          break; // limit to 1 restock reminder per tick
        }
      }

      // 9. Calculate Financial Metrics (Section 8)
      // Pending cart value: sum of uncollected bills of customers currently in fitting or checkout
      const pendingCartTotal = remainingCustomers
        .filter(c => c.state === 'fitting' || c.state === 'checkout')
        .reduce((sum, c) => sum + (c.billAmount || 0), 0);

      const totalServedSoFar = current.currentDayStats.customersServed + servedCount;
      const totalLostSoFar = current.currentDayStats.customersLost + lostCount;
      const totalVisitors = totalServedSoFar + totalLostSoFar;
      const conversionRateVal = Math.round((totalServedSoFar / Math.max(1, totalVisitors)) * 100);

      // 10. Reputation Star Level Up
      let nextRepExp = current.reputationExp + expEarned;
      let nextStars = current.reputationStars;
      let nextThreshold = current.reputationNextExp;

      if (nextRepExp >= nextThreshold && nextStars < 5) {
        nextStars += 1;
        nextRepExp -= nextThreshold;
        nextThreshold = Math.round(nextThreshold * 2.2);
        sound.playLevelUp();
        confetti({
          particleCount: 100,
          spread: 75,
          origin: { y: 0.4 }
        });
        addFloatingNumber(`⭐ ĐẠT UY TÍN ${nextStars} SAO!`, 'rep');
      }

      const totalEarnedThisTick = floorSalesCash + onlineOrderCashEarned;

      setState(prev => ({
        ...prev,
        dayTime: nextDayTime,
        currentInGameMinutes: inGameMinutes,
        dayPhase: currentPhase,
        cash: prev.cash + totalEarnedThisTick,
        totalEarned: prev.totalEarned + totalEarnedThisTick,
        cleanliness: nextCleanliness,
        trafficMultiplier: dynamicTrafficRate,
        reputationExp: nextRepExp,
        reputationStars: nextStars,
        reputationNextExp: nextThreshold,
        styles: updatedStyles,
        purchaseOrders: remainingPOs,
        onlineOrders: nextOnlineOrders,
        fittingReturns: nextFittingReturns,
        storeTasks: tasks,
        reviews: newReviews.length > 0 ? [...newReviews, ...prev.reviews].slice(0, 20) : prev.reviews,
        customers: remainingCustomers,
        currentDayStats: {
          ...prev.currentDayStats,
          revenue: prev.currentDayStats.revenue + totalEarnedThisTick,
          profit: prev.currentDayStats.profit + totalEarnedThisTick,
          customersServed: totalServedSoFar,
          customersLost: totalLostSoFar,
          lostSalesValue: prev.currentDayStats.lostSalesValue + lostSalesVal,
          pendingCartValue: pendingCartTotal,
          stockoutLostCount: prev.currentDayStats.stockoutLostCount + stockoutLost,
          queueAbandonCount: prev.currentDayStats.queueAbandonCount + queueAbandonLost,
          conversionRate: conversionRateVal,
          onlineOrdersCompleted: prev.currentDayStats.onlineOrdersCompleted + (onlineOrderCashEarned > 0 ? 1 : 0)
        }
      }));

    }, 1000);

    return () => clearInterval(timer);
  }, [addFloatingNumber]);

  return (
    <GameContext.Provider
      value={{
        state,
        activeTab,
        setActiveTab,
        replenishVariantToFloor,
        replenishAllStyleToFloor,
        createPurchaseOrder,
        serveCustomer,
        fetchItemForCustomer,
        checkoutCustomerManual,
        rushFitting,
        rushCheckout,
        sweepFloor,
        pickItemToCarry,
        dropCarriedItem,
        giveCarriedItemToCustomer,
        collectFittingReturn,
        fulfillFittingSizeRequest,
        setGameSpeed,
        openStoreFromPreparation,
        placeItemOnPrepTable,
        removeItemFromPrepTable,
        clearPrepTable,
        handPrepTableToCustomer,
        processPOSPayment,
        receiveGoodsPackage,
        inspectAndResolveReturn,
        cleanIncidentArea,
        setActiveWorkstationContext,
        resolveReturn,
        speedUpOnlineOrder,
        hireEmployee,
        fireEmployee,
        trainEmployee,
        changeEmployeeShift,
        replyToReview,
        upgradeShop,
        unlockBranch,
        setActiveBranch,
        claimLookbookOutfit,
        startNextDay,
        toggleSound,
        isSoundEnabled,
        isDaySummaryOpen,
        closeDaySummary,
        isAdvisorOpen,
        setIsAdvisorOpen,
        isSaveModalOpen,
        setIsSaveModalOpen,
        switchSlot,
        manualSave,
        resetGame,
        addFloatingNumber,
        isWhyModalOpen,
        openWhyModal,
        closeWhyModal,
        isWeek7ReviewOpen,
        openWeek7Review,
        closeWeek7Review,
        selectWeek2Focus,
        trackJourneyGoal,
        addCash,
        addReputationExp
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
