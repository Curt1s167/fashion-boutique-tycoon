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
  CustomerReview
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
import { sound } from '../utils/sound';
import { 
  saveGameState, 
  loadGameState, 
  clearGameState, 
  setActiveSlotId 
} from '../utils/saveManager';

export type ActiveTabType = 
  | 'shop' 
  | 'inventory' 
  | 'procurement' 
  | 'staff' 
  | 'reviews' 
  | 'map' 
  | 'orders' 
  | 'lookbook' 
  | 'upgrades';

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
  rushFitting: () => void;
  rushCheckout: () => void;
  sweepFloor: () => void;
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
    onlineOrdersCompleted: 0,
    returnsProcessed: 0,
    averageSatisfaction: 90
  },

  advisorInsights: INITIAL_ADVISOR_INSIGHTS,
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

  const [activeTab, setActiveTab] = useState<ActiveTabType>('shop');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isDaySummaryOpen, setIsDaySummaryOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

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

  // Quick manual cleaning of floor
  const sweepFloor = useCallback(() => {
    setState(prev => {
      sound.playPop();
      addFloatingNumber('✨ Quét dọn sạch bóng!', 'clean');
      return {
        ...prev,
        cleanliness: Math.min(100, prev.cleanliness + 25)
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

  // Serve a customer
  const serveCustomer = useCallback((customerId: string) => {
    setState(prev => {
      const idx = prev.customers.findIndex(c => c.id === customerId);
      if (idx === -1) return prev;
      const cust = prev.customers[idx];
      sound.playPop();

      let nextState = cust.state;
      let nextProgress = cust.stateProgress + 40;

      if (cust.state === 'browsing') {
        const style = prev.styles[cust.targetStyleId];
        const variant = style?.variants.find(v => v.id === cust.cartVariantId || (v.floorStock > 0));
        if (variant && variant.floorStock > 0) {
          nextState = 'fitting';
          nextProgress = 30;
        }
      } else if (cust.state === 'fitting' && nextProgress >= 100) {
        nextState = 'checkout';
        nextProgress = 40;
      } else if (cust.state === 'checkout' && nextProgress >= 100) {
        nextState = 'satisfied';
      }

      const updated = [...prev.customers];
      updated[idx] = {
        ...cust,
        patience: Math.min(100, cust.patience + 30),
        state: nextState,
        stateProgress: Math.min(100, nextProgress)
      };

      return {
        ...prev,
        customers: updated
      };
    });
  }, []);

  // Rush fitting
  const rushFitting = useCallback(() => {
    setState(prev => {
      let boosted = false;
      const updated = prev.customers.map(c => {
        if (c.state === 'fitting') {
          boosted = true;
          return { ...c, stateProgress: Math.min(100, c.stateProgress + 40) };
        }
        return c;
      });
      if (boosted) sound.playPop();
      return { ...prev, customers: updated };
    });
  }, []);

  // Rush checkout
  const rushCheckout = useCallback(() => {
    setState(prev => {
      let boosted = false;
      const updated = prev.customers.map(c => {
        if (c.state === 'checkout') {
          boosted = true;
          return { ...c, stateProgress: Math.min(100, c.stateProgress + 50) };
        }
        return c;
      });
      if (boosted) sound.playPop();
      return { ...prev, customers: updated };
    });
  }, []);

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
      return {
        ...prev,
        cash: prev.cash - hiringFee,
        employees: [...prev.employees, newEmp]
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

      return {
        ...prev,
        day: prev.day + 1,
        dayTime: 0,
        isDayRunning: true,
        cash: Math.max(0, prev.cash - (totalDailyPayroll + totalDailyRent)),
        customers: [],
        yesterdayStats: { ...prev.currentDayStats, payroll: totalDailyPayroll, rent: totalDailyRent },
        advisorInsights: newInsights.length > 0 ? newInsights : prev.advisorInsights,
        currentDayStats: {
          revenue: 0,
          cost: 0,
          payroll: totalDailyPayroll,
          rent: totalDailyRent,
          profit: 0,
          customersServed: 0,
          customersLost: 0,
          onlineOrdersCompleted: 0,
          returnsProcessed: 0,
          averageSatisfaction: 90
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

      // 1. Advance day timer
      const nextDayTime = current.dayTime + 1;
      if (nextDayTime >= 60) {
        sound.playLevelUp();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
        setIsDaySummaryOpen(true);
        setState(prev => ({
          ...prev,
          dayTime: 60,
          isDayRunning: false
        }));
        return;
      }

      // 2. Cleanliness Logic (Traffic reduces, cleaners restore)
      let nextCleanliness = current.cleanliness;
      const cleanersOnShift = current.employees.filter(e => e.role === 'cleaning');
      if (current.customers.length > 0 && Math.random() < 0.2) {
        nextCleanliness = Math.max(10, nextCleanliness - 1);
      }
      if (cleanersOnShift.length > 0 && nextCleanliness < 100 && Math.random() < 0.3) {
        nextCleanliness = Math.min(100, nextCleanliness + cleanersOnShift.length * 2);
      }

      // 3. Purchase Orders Inbound
      let updatedStyles = { ...current.styles };
      let remainingPOs: PurchaseOrder[] = [];

      for (const po of current.purchaseOrders) {
        if (po.secondsRemaining <= 1) {
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
            secondsRemaining: po.secondsRemaining - 1
          });
        }
      }

      // 4. Online Orders
      let nextOnlineOrders: OnlineOrder[] = [];
      let onlineOrderCashEarned = 0;
      const deliverySpeedBonus = current.upgrades.deliverySpeed.level * 10;

      for (const ord of current.onlineOrders) {
        const nextProgress = ord.progress + 20 + deliverySpeedBonus;
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
      if (current.upgrades.deliverySpeed.level > 0 && nextOnlineOrders.length < 3 && Math.random() < 0.25) {
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

      // 5. Customer Traffic Spawning (Influenced by cleanliness, manager, reviews)
      const avgReviewRating = current.reviews.length > 0 
        ? current.reviews.reduce((sum, r) => sum + r.stars, 0) / current.reviews.length 
        : 4.8;
      
      const reviewModifier = avgReviewRating >= 4.5 ? 1.25 : avgReviewRating >= 3.5 ? 1.0 : 0.75;
      const cleanlinessModifier = nextCleanliness >= 80 ? 1.15 : nextCleanliness < 50 ? 0.7 : 0.95;
      const manager = current.employees.find(e => e.role === 'manager');
      const managerBonus = manager ? 1 + (manager.skillLevel * 0.05) : 0.95;

      const dynamicTrafficRate = (0.4 + (current.reputationStars * 0.08) + (current.upgrades.marketing.level * 0.1)) 
        * reviewModifier 
        * cleanlinessModifier 
        * managerBonus;

      const maxCustomersInShop = 3 + current.upgrades.shopSpace.level * 2;
      let nextCustomers = [...current.customers];

      if (nextCustomers.length < maxCustomersInShop && Math.random() < dynamicTrafficRate) {
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
          billAmount: chosenVar.sellPrice
        };
        nextCustomers.push(newCust);
        sound.playBell();
      }

      // 6. Process Customer Micro-loop
      const fittingAssistants = current.employees.filter(e => e.role === 'fitting');
      const cashiers = current.employees.filter(e => e.role === 'cashier');
      const fittingSpeed = 16 + current.upgrades.fittingRooms.level * 8 + (fittingAssistants.length * 6);
      const checkoutSpeed = 22 + current.upgrades.posCounter.level * 10 + (cashiers.length * 8);

      let floorSalesCash = 0;
      let expEarned = 0;
      let servedCount = 0;
      let lostCount = 0;
      let newReviews: CustomerReview[] = [];

      nextCustomers = nextCustomers.map(cust => {
        let updated = { ...cust };

        switch (updated.state) {
          case 'entering':
            updated.state = 'browsing';
            break;

          case 'browsing': {
            const style = updatedStyles[updated.targetStyleId];
            if (style) {
              const matchedVar = style.variants.find(v => v.id === updated.cartVariantId);
              if (matchedVar && matchedVar.floorStock > 0) {
                matchedVar.floorStock -= 1;
                matchedVar.salesCount += 1;
                updated.state = 'fitting';
                updated.stateProgress = 10;
              } else if (matchedVar && matchedVar.backroomStock > 0) {
                updated.patience -= 6;
              } else {
                updated.patience -= 22;
              }
            }
            break;
          }

          case 'fitting':
            updated.stateProgress += fittingSpeed;
            if (updated.stateProgress >= 100) {
              updated.state = 'checkout';
              updated.stateProgress = 0;
            } else {
              updated.patience -= (nextCleanliness < 60 ? 4 : 2);
            }
            break;

          case 'checkout':
            updated.stateProgress += checkoutSpeed;
            if (updated.stateProgress >= 100) {
              updated.state = 'satisfied';
            } else {
              updated.patience -= 3;
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

      // 7. Resolve finished customers & Reviews Generation
      const remainingCustomers: Customer[] = [];
      const branchBonus = current.branches.filter(b => b.isUnlocked).reduce((sum, b) => sum + b.revenueBonusPercent, 0) / 100;

      for (const cust of nextCustomers) {
        if (cust.state === 'satisfied') {
          const tipMultiplier = 1 + (0.05 * current.upgrades.posCounter.level) + branchBonus;
          const finalBill = Math.round((cust.billAmount || 180000) * tipMultiplier);

          floorSalesCash += finalBill;
          expEarned += 25;
          servedCount += 1;
          sound.playCash();
          addFloatingNumber(`+${finalBill.toLocaleString('vi-VN')}đ`, 'money');

          // Chance to leave a 5-star review
          if (Math.random() < 0.2) {
            newReviews.push({
              id: 'rev-' + Date.now() + '-' + Math.random(),
              customerName: cust.name,
              customerAvatar: cust.avatar,
              stars: 5,
              category: 'product',
              comment: `Đồ đẹp chuẩn form, nhân viên thân thiện và shop siêu sạch sẽ! Rất hài lòng ⭐⭐⭐⭐⭐`,
              timestamp: 'Vừa xong',
              replied: false
            });
          }
        } else if (cust.state === 'angry') {
          lostCount += 1;
          sound.playAngry();
          addFloatingNumber('💔 Khách giận bỏ về!', 'sad');

          // Chance to leave negative review
          if (Math.random() < 0.45) {
            newReviews.push({
              id: 'rev-' + Date.now() + '-' + Math.random(),
              customerName: cust.name,
              customerAvatar: cust.avatar,
              stars: Math.random() < 0.5 ? 2 : 1,
              category: 'queue',
              comment: `Chờ đợi lâu quá, tìm size thì hết hàng trên kệ. Shop cần bổ sung thêm nhân viên quầy!`,
              timestamp: 'Vừa xong',
              replied: false
            });
          }
        } else {
          remainingCustomers.push(cust);
        }
      }

      // 8. Level Up Star Reputation
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
        reviews: newReviews.length > 0 ? [...newReviews, ...prev.reviews].slice(0, 20) : prev.reviews,
        customers: remainingCustomers,
        currentDayStats: {
          ...prev.currentDayStats,
          revenue: prev.currentDayStats.revenue + totalEarnedThisTick,
          profit: prev.currentDayStats.profit + totalEarnedThisTick,
          customersServed: prev.currentDayStats.customersServed + servedCount,
          customersLost: prev.currentDayStats.customersLost + lostCount,
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
        rushFitting,
        rushCheckout,
        sweepFloor,
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
        addFloatingNumber
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
