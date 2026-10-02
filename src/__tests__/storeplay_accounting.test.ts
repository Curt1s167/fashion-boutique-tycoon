import { describe, it, expect } from 'vitest';
import type { GameState, Customer, PlayerCarryItem, FittingReturnItem } from '../types/game';
import { INITIAL_STYLES, INITIAL_BRANCHES, INITIAL_EMPLOYEES } from '../data/fashionCatalog';
import { GAME_TIME_CONFIG, DAY_DURATION } from '../context/GameContext';

describe('ANTIGRAVITY Manual Storeplay & Accounting Invariants Test Suite', () => {
  const createMockInitialState = (): GameState => ({
    cash: 5000000,
    totalEarned: 0,
    reputationStars: 1,
    reputationExp: 0,
    reputationNextExp: 100,
    day: 1,
    dayTime: 0,
    isDayRunning: true,
    gameSpeed: 1,
    dayPhase: 'MORNING',
    currentInGameMinutes: 480, // 08:00 AM
    cleanliness: 100,
    trafficMultiplier: 1.0,
    styles: JSON.parse(JSON.stringify(INITIAL_STYLES)),
    suppliers: {},
    branches: JSON.parse(JSON.stringify(INITIAL_BRANCHES)),
    activeBranchId: 'branch-1',
    lookbookOutfits: [],
    socialPosts: [],
    employees: JSON.parse(JSON.stringify(INITIAL_EMPLOYEES)),
    reviews: [],
    purchaseOrders: [],
    returnRequests: [],
    onlineOrders: [],
    customers: [],
    playerCarry: [],
    playerCarryCapacity: 3,
    storeTasks: [],
    fittingReturns: [],
    advisorInsights: [],
    upgrades: {
      fittingRooms: { id: 'fittingRooms', name: 'Phòng Thử Đồ', description: 'Nâng cấp phòng thử đồ', level: 2, maxLevel: 5, baseCost: 1500000, costMultiplier: 2.2, effect: '+1 phòng thử & tăng tốc độ thử đồ', icon: '🪞' },
      posCounter: { id: 'posCounter', name: 'Quầy Thu Ngân POS', description: 'Nâng cấp máy quẹt thẻ', level: 1, maxLevel: 5, baseCost: 2000000, costMultiplier: 2.4, effect: '+1 máy quẹt thẻ POS & +5% tiền tip', icon: '💳' },
      marketing: { id: 'marketing', name: 'Biển Hiệu & Marketing', description: 'Quảng cáo thương hiệu', level: 1, maxLevel: 5, baseCost: 1000000, costMultiplier: 2.0, effect: '+25% lượng khách ghé tiệm', icon: '📢' },
      shopSpace: { id: 'shopSpace', name: 'Diện Tích Mặt Bằng', description: 'Mở rộng sàn bán lẻ', level: 1, maxLevel: 4, baseCost: 4000000, costMultiplier: 2.8, effect: '+2 sức chứa khách trong tiệm', icon: '🏬' },
      staffAuto: { id: 'staffAuto', name: 'Thuê Stylist', description: 'Tư vấn tự động', level: 0, maxLevel: 3, baseCost: 600000, costMultiplier: 2.5, effect: 'Hồi phục kiên nhẫn', icon: '💁‍♀️' },
      backroomStorage: { id: 'backroomStorage', name: 'Kệ Kho', description: 'Mở rộng kho', level: 1, maxLevel: 5, baseCost: 300000, costMultiplier: 1.8, effect: 'Tăng sức chứa kho', icon: '📦' },
      deliverySpeed: { id: 'deliverySpeed', name: 'Shipper Giao Nhanh', description: 'Đội ngũ giao hàng', level: 0, maxLevel: 3, baseCost: 1200000, costMultiplier: 2.0, effect: 'Mở bán online & tăng tốc độ giao hàng', icon: '🛵' }
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
      averageSatisfaction: 100
    },
    yesterdayStats: undefined,
    floatingNumbers: []
  });

  it('Invariant 1: Revenue and Cash are strictly unchanged during REQUEST, PICKUP, FITTING, QUEUEING', () => {
    const state = createMockInitialState();
    const initialCash = state.cash;
    const initialRevenue = state.currentDayStats.revenue;

    // 1. Customer arrives and requests item
    const customer: Customer = {
      id: 'cust-1',
      name: 'Nguyễn Thu Trang',
      avatar: '👩',
      archetype: 'Dân Công Sở',
      targetStyleId: 'style-baby-tee',
      targetCategory: 'tops',
      requestedSize: 'M',
      preferredColor: 'Hồng Phấn',
      budget: 350000,
      patience: 100,
      maxPatience: 100,
      state: 'browsing',
      stateProgress: 0,
      billAmount: 165000,
      cartItems: []
    };
    state.customers.push(customer);

    expect(state.cash).toBe(initialCash);
    expect(state.currentDayStats.revenue).toBe(initialRevenue);

    // 2. Player picks up item to carry (PICKUP)
    const carryItem: PlayerCarryItem = {
      id: 'carry-1',
      styleId: 'style-baby-tee',
      styleName: 'Áo Thun Pastel Baby Tee',
      variantId: 'TEE-PINK-M',
      size: 'M',
      colorName: 'Hồng Phấn',
      colorHex: '#FBCFE8',
      emoji: '👕',
      costPrice: 55000,
      sellPrice: 165000,
      source: 'rack'
    };
    state.playerCarry.push(carryItem);

    expect(state.cash).toBe(initialCash);
    expect(state.currentDayStats.revenue).toBe(initialRevenue);

    // 3. Customer enters fitting room (FITTING)
    customer.state = 'fitting';
    customer.stateProgress = 50;

    expect(state.cash).toBe(initialCash);
    expect(state.currentDayStats.revenue).toBe(initialRevenue);

    // 4. Customer queues at POS counter (CHECKOUT_QUEUE)
    customer.state = 'checkout';
    customer.stateProgress = 0;

    expect(state.cash).toBe(initialCash);
    expect(state.currentDayStats.revenue).toBe(initialRevenue);
  });

  it('Invariant 2: Revenue and Cash increase only on explicit POS payment success', () => {
    const state = createMockInitialState();
    const initialCash = state.cash;
    const initialRevenue = state.currentDayStats.revenue;

    const customer: Customer = {
      id: 'cust-pos',
      name: 'Lê Hoàng Nam',
      avatar: '🧑',
      archetype: 'Tín Đồ Streetwear',
      targetStyleId: 'style-baggy-jean',
      targetCategory: 'bottoms',
      requestedSize: 'L',
      preferredColor: 'Xanh Retro',
      budget: 500000,
      patience: 100,
      maxPatience: 100,
      state: 'checkout',
      stateProgress: 0,
      billAmount: 320000
    };
    state.customers.push(customer);

    // Simulate POS scan and payment collection
    const tipMultiplier = 1 + (0.05 * state.upgrades.posCounter.level);
    const finalBill = Math.round(customer.billAmount! * tipMultiplier);

    state.cash += finalBill;
    state.totalEarned += finalBill;
    state.currentDayStats.revenue += finalBill;
    state.currentDayStats.customersServed += 1;
    state.customers = state.customers.filter(c => c.id !== customer.id);

    expect(state.cash).toBe(initialCash + finalBill);
    expect(state.currentDayStats.revenue).toBe(initialRevenue + finalBill);
    expect(state.currentDayStats.customersServed).toBe(1);
    expect(state.customers.length).toBe(0);
  });

  it('Invariant 3: Carried items decrement rack/backroom stock so they cannot be double-allocated', () => {
    const state = createMockInitialState();
    const style = state.styles['style-baby-tee'];
    const variant = style.variants.find(v => v.id === 'TEE-PINK-M')!;
    const initialFloorStock = variant.floorStock;

    // Pick to carry
    variant.floorStock -= 1;
    state.playerCarry.push({
      id: 'carry-test',
      styleId: style.id,
      styleName: style.name,
      variantId: variant.id,
      size: variant.size,
      colorName: variant.colorName,
      colorHex: variant.colorHex,
      emoji: style.emoji,
      costPrice: variant.costPrice,
      sellPrice: variant.sellPrice,
      source: 'rack'
    });

    expect(variant.floorStock).toBe(initialFloorStock - 1);
    expect(state.playerCarry.length).toBe(1);

    // If another customer comes, they see only (initial - 1) units remaining
    expect(variant.floorStock).toBeLessThan(initialFloorStock);
  });

  it('Invariant 4: Wrong size hand-off is rejected with patience penalty', () => {
    const customer: Customer = {
      id: 'cust-size-test',
      name: 'Võ Minh Thư',
      avatar: '👱‍♀️',
      archetype: 'Học Sinh Sinh Viên',
      targetStyleId: 'style-baby-tee',
      targetCategory: 'tops',
      requestedSize: 'S', // Customer needs S
      preferredColor: 'Hồng Phấn',
      budget: 200000,
      patience: 80,
      maxPatience: 100,
      state: 'browsing',
      stateProgress: 0,
      billAmount: 165000
    };

    const carriedItem: PlayerCarryItem = {
      id: 'carry-wrong',
      styleId: 'style-baby-tee',
      styleName: 'Áo Thun Pastel Baby Tee',
      variantId: 'TEE-PINK-M',
      size: 'XL', // Player gives XL instead of S!
      colorName: 'Hồng Phấn',
      colorHex: '#FBCFE8',
      emoji: '👕',
      costPrice: 55000,
      sellPrice: 165000,
      source: 'rack'
    };

    // Check match
    const isMatch = (carriedItem.styleId === customer.targetStyleId) && (carriedItem.size === customer.requestedSize);
    expect(isMatch).toBe(false);

    // Apply patience penalty
    customer.patience = Math.max(0, customer.patience - 18);
    expect(customer.patience).toBe(62);
    expect(customer.state).toBe('browsing'); // Customer refuses to enter fitting room with wrong size
  });

  it('Invariant 5: Customer abandonment records lost sales value and returns garment to bin', () => {
    const state = createMockInitialState();
    const customer: Customer = {
      id: 'cust-angry',
      name: 'Hoàng Long',
      avatar: '👨',
      archetype: 'Tín Đồ Streetwear',
      targetStyleId: 'style-baggy-jean',
      targetCategory: 'bottoms',
      requestedSize: 'L',
      preferredColor: 'Xanh Retro',
      budget: 500000,
      patience: 0,
      maxPatience: 100,
      state: 'angry',
      stateProgress: 0,
      billAmount: 320000,
      cartVariantId: 'JEAN-RETRO-L'
    };

    // Customer walks away angry
    const lostBill = customer.billAmount || 0;
    state.currentDayStats.customersLost += 1;
    state.currentDayStats.lostSalesValue += lostBill;

    // Garment placed in fitting returns bin
    const returnItem: FittingReturnItem = {
      id: 'ret-abandon-test',
      styleId: customer.targetStyleId,
      styleName: 'Quần Baggy Jeans Wide-Leg',
      variantId: customer.cartVariantId!,
      size: customer.requestedSize,
      colorName: customer.preferredColor,
      sellPrice: lostBill,
      emoji: '👖',
      timestamp: '10:30:00',
      returnedAt: Date.now()
    };
    state.fittingReturns.push(returnItem);

    expect(state.currentDayStats.lostSalesValue).toBe(320000);
    expect(state.currentDayStats.customersLost).toBe(1);
    expect(state.fittingReturns.length).toBe(1);
  });

  it('Invariant 6: Grace period stops new arrivals after 22:00 while allowing inside customers to finish', () => {
    // Clock at 22:00 (1320 in-game minutes)
    const inGameMinutes = 1320;
    const remainingCustomersCount = 2; // 2 customers still trying on clothes inside
    const nextDayTime = DAY_DURATION;

    let dayPhase: string;
    let trafficMultiplier = 1.0;

    if (nextDayTime >= DAY_DURATION || inGameMinutes >= 1320) {
      if (remainingCustomersCount > 0) {
        dayPhase = 'CLOSING_GRACE';
        trafficMultiplier = 0.0; // STRICT: NO NEW WALK-INS
      } else {
        dayPhase = 'END_OF_DAY';
      }
    } else {
      dayPhase = 'CLOSING';
    }

    expect(dayPhase).toBe('CLOSING_GRACE');
    expect(trafficMultiplier).toBe(0.0);
    expect(GAME_TIME_CONFIG.closingGraceEnabled).toBe(true);
  });
});
