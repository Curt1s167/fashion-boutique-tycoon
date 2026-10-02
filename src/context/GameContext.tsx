import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { 
  GameState, 
  ItemCategory, 
  Customer 
} from '../types/game';
import { sound } from '../utils/sound';

interface GameContextType {
  state: GameState;
  activeTab: 'shop' | 'inventory' | 'upgrades' | 'stats';
  setActiveTab: (tab: 'shop' | 'inventory' | 'upgrades' | 'stats') => void;
  restockItem: (category: ItemCategory, amount: number) => void;
  upgradeShop: (upgradeKey: keyof GameState['upgrades']) => void;
  serveCustomer: (customerId: string) => void;
  rushCheckout: () => void;
  rushFitting: () => void;
  startNextDay: () => void;
  toggleSound: () => void;
  isSoundEnabled: boolean;
  isDaySummaryOpen: boolean;
  closeDaySummary: () => void;
  addFloatingNumber: (text: string, type: 'money' | 'rep' | 'heart' | 'sad', x?: number, y?: number) => void;
}

const INITIAL_STATE: GameState = {
  cash: 650000,
  totalEarned: 650000,
  reputationStars: 1,
  reputationExp: 0,
  reputationNextExp: 100,
  day: 1,
  dayTime: 0, // 0 to 60s
  isDayRunning: true,

  inventory: {
    tshirt: {
      id: 'tshirt-1',
      name: 'Áo Thun Pastel Baby Tee',
      category: 'tshirt',
      emoji: '👕',
      costPrice: 50000,
      sellPrice: 150000,
      stock: 15,
      shelfCapacity: 25,
      level: 1,
      color: 'bg-pink-100 border-pink-300 text-pink-700',
      description: 'Chất cotton 100% thoáng mát, form baby tee hot trend Gen Z.'
    },
    jeans: {
      id: 'jeans-1',
      name: 'Quần Baggy Jeans Y2K',
      category: 'jeans',
      emoji: '👖',
      costPrice: 120000,
      sellPrice: 320000,
      stock: 10,
      shelfCapacity: 20,
      level: 1,
      color: 'bg-indigo-100 border-indigo-300 text-indigo-700',
      description: 'Jeans ống rộng phong cách Y2K tôn dáng, wash màu vintage.'
    },
    sneaker: {
      id: 'sneaker-1',
      name: 'Sneaker Chunky Trắng',
      category: 'sneaker',
      emoji: '👟',
      costPrice: 220000,
      sellPrice: 550000,
      stock: 6,
      shelfCapacity: 15,
      level: 1,
      color: 'bg-emerald-100 border-emerald-300 text-emerald-700',
      description: 'Đế bánh mì hack dáng 5cm, siêu êm và cực dễ phối đồ.'
    },
    handbag: {
      id: 'handbag-1',
      name: 'Túi Kẹp Nách Da Mềm',
      category: 'handbag',
      emoji: '👜',
      costPrice: 160000,
      sellPrice: 420000,
      stock: 8,
      shelfCapacity: 18,
      level: 1,
      color: 'bg-amber-100 border-amber-300 text-amber-700',
      description: 'Da PU cao cấp khóa kim loại vàng gold sang trọng.'
    }
  },

  customers: [],

  upgrades: {
    fittingRooms: {
      id: 'fittingRooms',
      name: 'Phòng Thử Đồ Gương Led',
      description: 'Thêm buồng thử đồ và đèn selfie lung linh, thử đồ nhanh gấp đôi.',
      level: 1,
      maxLevel: 5,
      baseCost: 350000,
      costMultiplier: 1.8,
      icon: '🪞',
      effect: '+1 Buồng thử đồ, Tốc độ thử +30%'
    },
    posCounter: {
      id: 'posCounter',
      name: 'Quầy POS Chạm Quét Tự Động',
      description: 'Máy thanh toán quẹt mã QR cực nhạy, khách boa thêm tiền tip.',
      level: 1,
      maxLevel: 5,
      baseCost: 280000,
      costMultiplier: 1.7,
      icon: '💳',
      effect: 'Thanh toán nhanh +35%, Khách tip +10%'
    },
    shopSpace: {
      id: 'shopSpace',
      name: 'Mở Rộng Không Gian Tiệm',
      description: 'Mở rộng diện tích, chứa được nhiều khách ghé tiệm cùng lúc hơn.',
      level: 1,
      maxLevel: 5,
      baseCost: 500000,
      costMultiplier: 2.2,
      icon: '🏬',
      effect: 'Sức chứa tối đa +2 khách'
    },
    marketing: {
      id: 'marketing',
      name: 'Chiến Dịch Viral TikTok',
      description: 'Hợp tác Fashion Influencer, kéo nhiều khách VIP chịu chi đến mua sắm.',
      level: 0,
      maxLevel: 5,
      baseCost: 400000,
      costMultiplier: 2.0,
      icon: '📢',
      effect: 'Tăng 40% tốc độ khách đến, 25% khách VIP'
    },
    staffAuto: {
      id: 'staffAuto',
      name: 'Thuê Trợ Lý Stylist Chăm Sóc',
      description: 'Nhân viên tự động tư vấn, hồi phục kiên nhẫn khi khách chờ lâu.',
      level: 0,
      maxLevel: 3,
      baseCost: 600000,
      costMultiplier: 2.5,
      icon: '💁‍♀️',
      effect: 'Tự động chăm sóc khách, giảm 50% nguy cơ khách giận bỏ đi'
    }
  },

  currentDayStats: {
    revenue: 0,
    cost: 0,
    profit: 0,
    customersServed: 0,
    customersLost: 0
  },

  floatingNumbers: []
};

const CUSTOMER_NAMES = [
  'Minh Anh', 'Hà My', 'Linh Chi', 'Khánh Vy', 'Bảo Ngọc', 
  'Thùy Tiên', 'Gia Hân', 'Phương Thảo', 'Quỳnh Anh', 'Trâm Anh',
  'Hoàng Nam', 'Minh Khang', 'Đức Anh', 'Tuấn Kiệt', 'Thanh Tùng'
];

const CUSTOMER_AVATARS = ['👱‍♀️', '👩‍🦰', '👧', '👩‍🦱', '👩', '🧕', '👱‍♂️', '🧑‍🦱', '🧔', '🧑'];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<'shop' | 'inventory' | 'upgrades' | 'stats'>('shop');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isDaySummaryOpen, setIsDaySummaryOpen] = useState(false);
  
  const stateRef = useRef(state);
  stateRef.current = state;

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setIsSoundEnabled(sound.enabled);
    if (sound.enabled) sound.playPop();
  };

  // Add floating number effect
  const addFloatingNumber = useCallback((text: string, type: 'money' | 'rep' | 'heart' | 'sad', x = 50, y = 50) => {
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

  // Restock inventory wholesale
  const restockItem = useCallback((category: ItemCategory, amount: number) => {
    setState(prev => {
      const item = prev.inventory[category];
      const spaceLeft = item.shelfCapacity - item.stock;
      const actualAmount = Math.min(amount, spaceLeft);
      if (actualAmount <= 0) return prev;

      const totalCost = actualAmount * item.costPrice;
      if (prev.cash < totalCost) return prev; // Not enough money

      sound.playPop();
      return {
        ...prev,
        cash: prev.cash - totalCost,
        currentDayStats: {
          ...prev.currentDayStats,
          cost: prev.currentDayStats.cost + totalCost,
          profit: prev.currentDayStats.profit - totalCost
        },
        inventory: {
          ...prev.inventory,
          [category]: {
            ...item,
            stock: item.stock + actualAmount
          }
        }
      };
    });
  }, []);

  // Upgrade shop facility
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

  // Tap to serve / assist a specific customer (Stylist care)
  const serveCustomer = useCallback((customerId: string) => {
    setState(prev => {
      const custIndex = prev.customers.findIndex(c => c.id === customerId);
      if (custIndex === -1) return prev;

      const cust = prev.customers[custIndex];
      sound.playPop();

      // Give patience boost and advance state
      let nextState = cust.state;
      let nextProgress = cust.stateProgress + 40;

      if (cust.state === 'browsing') {
        const item = prev.inventory[cust.targetCategory];
        if (item.stock > 0) {
          nextState = 'fitting';
          nextProgress = 20;
        }
      } else if (cust.state === 'fitting' && nextProgress >= 100) {
        nextState = 'checkout';
        nextProgress = 30;
      } else if (cust.state === 'checkout' && nextProgress >= 100) {
        nextState = 'satisfied';
      }

      const updatedCustomers = [...prev.customers];
      updatedCustomers[custIndex] = {
        ...cust,
        patience: Math.min(100, cust.patience + 25),
        state: nextState,
        stateProgress: Math.min(100, nextProgress)
      };

      return {
        ...prev,
        customers: updatedCustomers
      };
    });
  }, []);

  // Tap button to speed up all fitting customers
  const rushFitting = useCallback(() => {
    setState(prev => {
      let boosted = false;
      const updatedCustomers = prev.customers.map(c => {
        if (c.state === 'fitting') {
          boosted = true;
          return { ...c, stateProgress: Math.min(100, c.stateProgress + 35) };
        }
        return c;
      });
      if (boosted) sound.playPop();
      return { ...prev, customers: updatedCustomers };
    });
  }, []);

  // Tap button to speed up checkout
  const rushCheckout = useCallback(() => {
    setState(prev => {
      let boosted = false;
      const updatedCustomers = prev.customers.map(c => {
        if (c.state === 'checkout') {
          boosted = true;
          return { ...c, stateProgress: Math.min(100, c.stateProgress + 45) };
        }
        return c;
      });
      if (boosted) sound.playPop();
      return { ...prev, customers: updatedCustomers };
    });
  }, []);

  // Start next business day
  const startNextDay = useCallback(() => {
    setIsDaySummaryOpen(false);
    sound.playBell();
    setState(prev => ({
      ...prev,
      day: prev.day + 1,
      dayTime: 0,
      isDayRunning: true,
      customers: [],
      currentDayStats: {
        revenue: 0,
        cost: 0,
        profit: 0,
        customersServed: 0,
        customersLost: 0
      }
    }));
  }, []);

  const closeDaySummary = () => {
    setIsDaySummaryOpen(false);
  };

  // MAIN 1-SECOND GAME LOOP
  useEffect(() => {
    const timer = setInterval(() => {
      const current = stateRef.current;
      if (!current.isDayRunning) return;

      // 1. Progress day timer (60s = 1 day)
      const nextDayTime = current.dayTime + 1;
      if (nextDayTime >= 60) {
        // End of the business day!
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

      // 2. Customer Capacity and Spawning
      const maxCustomersInShop = 3 + current.upgrades.shopSpace.level * 2;
      const categories: ItemCategory[] = ['tshirt', 'jeans', 'sneaker', 'handbag'];
      
      let nextCustomers = [...current.customers];
      let nextInventory = { ...current.inventory };
      let cashEarnedThisTick = 0;
      let expEarnedThisTick = 0;
      let servedCountThisTick = 0;
      let lostCountThisTick = 0;

      // Spawn rate based on stars & marketing
      const spawnChance = 0.45 + (current.reputationStars * 0.08) + (current.upgrades.marketing.level * 0.1);
      if (nextCustomers.length < maxCustomersInShop && Math.random() < spawnChance) {
        const chosenCat = categories[Math.floor(Math.random() * categories.length)];
        const isVip = Math.random() < (0.15 + current.upgrades.marketing.level * 0.1);
        const name = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];
        const avatar = CUSTOMER_AVATARS[Math.floor(Math.random() * CUSTOMER_AVATARS.length)];
        
        const newCustomer: Customer = {
          id: 'cust-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          name: isVip ? `⭐ VIP ${name}` : name,
          avatar,
          targetCategory: chosenCat,
          budget: isVip ? 800000 : 400000,
          patience: 100,
          maxPatience: 100,
          state: 'entering',
          stateProgress: 0
        };
        nextCustomers.push(newCustomer);
        sound.playBell();
      }

      // 3. Process existing customers
      const fittingSpeed = 15 + current.upgrades.fittingRooms.level * 8;
      const checkoutSpeed = 20 + current.upgrades.posCounter.level * 10;
      const staffAutoSkill = current.upgrades.staffAuto.level;

      nextCustomers = nextCustomers.map(cust => {
        let updated = { ...cust };

        // Auto stylist support
        if (staffAutoSkill > 0 && updated.patience < 40) {
          updated.patience = Math.min(100, updated.patience + staffAutoSkill * 5);
        }

        switch (updated.state) {
          case 'entering':
            // Moves to browsing
            updated.state = 'browsing';
            break;

          case 'browsing': {
            const item = nextInventory[updated.targetCategory];
            if (item.stock > 0) {
              // Customer takes item
              nextInventory = {
                ...nextInventory,
                [updated.targetCategory]: {
                  ...item,
                  stock: item.stock - 1
                }
              };
              updated.state = 'fitting';
              updated.stateProgress = 10;
              updated.cartItemId = item.id;
              updated.billAmount = item.sellPrice;
            } else {
              // Out of stock - customer gets impatient fast!
              updated.patience -= 18;
            }
            break;
          }

          case 'fitting':
            updated.stateProgress += fittingSpeed;
            if (updated.stateProgress >= 100) {
              updated.state = 'checkout';
              updated.stateProgress = 0;
            } else {
              updated.patience -= 2;
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

        // Check if patience drops to 0
        if (updated.state !== 'satisfied' && updated.patience <= 0) {
          updated.state = 'angry';
        }

        return updated;
      });

      // 4. Resolve completed transactions and leaving customers
      const remainingCustomers: Customer[] = [];
      for (const cust of nextCustomers) {
        if (cust.state === 'satisfied') {
          // Cash calculation + tip from POS upgrade
          const tipPercent = 0.05 * current.upgrades.posCounter.level;
          const baseBill = cust.billAmount || 150000;
          const finalBill = Math.round(baseBill * (1 + tipPercent));
          
          cashEarnedThisTick += finalBill;
          expEarnedThisTick += 20;
          servedCountThisTick += 1;
          sound.playCash();

          // Add floating text
          addFloatingNumber(`+${finalBill.toLocaleString('vi-VN')}đ`, 'money');
          // Customer departs happy
        } else if (cust.state === 'angry') {
          lostCountThisTick += 1;
          sound.playAngry();
          addFloatingNumber('💔 Khách bỏ về!', 'sad');
          // Customer departs angry
        } else {
          remainingCustomers.push(cust);
        }
      }

      // 5. Calculate Star Level Up
      let nextRepExp = current.reputationExp + expEarnedThisTick;
      let nextStars = current.reputationStars;
      let nextThreshold = current.reputationNextExp;

      if (nextRepExp >= nextThreshold && nextStars < 5) {
        nextStars += 1;
        nextRepExp -= nextThreshold;
        nextThreshold = Math.round(nextThreshold * 2.2);
        sound.playLevelUp();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.4 }
        });
        addFloatingNumber(`⭐ LÊN CẤP ${nextStars} SAO!`, 'rep');
      }

      setState(prev => ({
        ...prev,
        dayTime: nextDayTime,
        cash: prev.cash + cashEarnedThisTick,
        totalEarned: prev.totalEarned + cashEarnedThisTick,
        reputationExp: nextRepExp,
        reputationStars: nextStars,
        reputationNextExp: nextThreshold,
        inventory: nextInventory,
        customers: remainingCustomers,
        currentDayStats: {
          ...prev.currentDayStats,
          revenue: prev.currentDayStats.revenue + cashEarnedThisTick,
          profit: prev.currentDayStats.profit + cashEarnedThisTick,
          customersServed: prev.currentDayStats.customersServed + servedCountThisTick,
          customersLost: prev.currentDayStats.customersLost + lostCountThisTick
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
        restockItem,
        upgradeShop,
        serveCustomer,
        rushCheckout,
        rushFitting,
        startNextDay,
        toggleSound,
        isSoundEnabled,
        isDaySummaryOpen,
        closeDaySummary,
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
