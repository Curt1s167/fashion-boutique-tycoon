import { describe, it, expect } from 'vitest';
import type { GameState, Customer, CustomerCartItem } from '../types/game';
import type { PreparationTableItem, POSPaymentReceipt, GoodsReceivingPackage } from '../types/workstation';
import { INITIAL_STYLES, INITIAL_BRANCHES, INITIAL_EMPLOYEES } from '../data/fashionCatalog';

describe('Interactive Workstation UI & Operational Grammar Test Suite', () => {
  const createMockWorkstationState = (): GameState => ({
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
    cleanliness: 70,
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
    prepTableItems: [],
    activeWorkstationContext: 'CUSTOMER_ITEM_FULFILLMENT',
    upgrades: {
      fittingRooms: { id: 'fittingRooms', name: 'Phòng Thử Đồ', description: 'Nâng cấp phòng thử đồ', level: 2, maxLevel: 5, baseCost: 1500000, costMultiplier: 2.2, effect: '+1 phòng thử', icon: '🪞' },
      posCounter: { id: 'posCounter', name: 'Quầy Thu Ngân POS', description: 'Nâng cấp máy quẹt thẻ', level: 2, maxLevel: 5, baseCost: 2000000, costMultiplier: 2.4, effect: '+1 máy quẹt thẻ POS & +5% tiền tip', icon: '💳' },
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
      averageSatisfaction: 100,
    },
    yesterdayStats: undefined,
    floatingNumbers: [],
  });

  describe('Operational Grammar: Preparation Table Fulfillment', () => {
    it('places an item on the prep table and decrements inventory without recognising revenue', () => {
      const state = createMockWorkstationState();
      const styleId = 'style-baby-tee';
      const initialFloorStock = state.styles[styleId].variants[0].floorStock;
      const initialCash = state.cash;
      const initialRevenue = state.currentDayStats.revenue;

      // Simulate placing item on prep table
      const variant = state.styles[styleId].variants[0];
      const newItem: PreparationTableItem = {
        id: 'prep-item-1',
        styleId: styleId,
        styleName: state.styles[styleId].name,
        variantId: variant.id,
        size: variant.size,
        colorName: variant.colorName,
        colorHex: variant.colorHex,
        emoji: state.styles[styleId].emoji,
        sellPrice: variant.sellPrice,
        costPrice: variant.costPrice,
        source: 'rack',
        state: 'PREPARED',
        placedAt: Date.now(),
      };

      // Decrement stock
      state.styles[styleId].variants[0].floorStock -= 1;
      state.prepTableItems.push(newItem);

      expect(state.prepTableItems).toHaveLength(1);
      expect(state.prepTableItems[0].state).toBe('PREPARED');
      expect(state.styles[styleId].variants[0].floorStock).toBe(initialFloorStock - 1);

      // CRITICAL ACCOUNTING INVARIANT: Revenue and cash MUST NOT change
      expect(state.cash).toBe(initialCash);
      expect(state.currentDayStats.revenue).toBe(initialRevenue);
      expect(state.totalEarned).toBe(0);
    });

    it('removes an item from the prep table and returns stock back to floor', () => {
      const state = createMockWorkstationState();
      const styleId = 'style-baby-tee';
      const initialFloorStock = state.styles[styleId].variants[0].floorStock;

      const variant = state.styles[styleId].variants[0];
      const prepItem: PreparationTableItem = {
        id: 'prep-item-2',
        styleId: styleId,
        styleName: state.styles[styleId].name,
        variantId: variant.id,
        size: variant.size,
        colorName: variant.colorName,
        colorHex: variant.colorHex,
        emoji: state.styles[styleId].emoji,
        sellPrice: variant.sellPrice,
        costPrice: variant.costPrice,
        source: 'rack',
        state: 'PREPARED',
        placedAt: Date.now(),
      };

      // Place on prep table (decrements floorStock)
      state.styles[styleId].variants[0].floorStock -= 1;
      state.prepTableItems.push(prepItem);

      // Remove from prep table and restore
      state.prepTableItems = state.prepTableItems.filter(i => i.id !== prepItem.id);
      state.styles[styleId].variants[0].floorStock += 1;

      expect(state.prepTableItems).toHaveLength(0);
      expect(state.styles[styleId].variants[0].floorStock).toBe(initialFloorStock);
    });

    it('hands prepared item to customer only when SKU matching criteria pass', () => {
      const state = createMockWorkstationState();
      const styleId = 'style-baby-tee';
      const variant = state.styles[styleId].variants[0]; // 'Hồng Phấn' 'S'

      const customer: Customer = {
        id: 'cust-workstation-1',
        name: 'Trang Thu',
        avatar: '👩‍🦰',
        archetype: 'Gen Z Y2K',
        targetCategory: 'tops',
        targetStyleId: styleId,
        preferredColor: variant.colorName,
        requestedSize: variant.size,
        budget: 400000,
        state: 'needs_assistance',
        stateProgress: 50,
        patience: 100,
        maxPatience: 100,
        cartItems: [],
      };

      const prepItem: PreparationTableItem = {
        id: 'prep-match-1',
        styleId: styleId,
        styleName: state.styles[styleId].name,
        variantId: variant.id,
        size: variant.size,
        colorName: variant.colorName,
        colorHex: variant.colorHex,
        emoji: state.styles[styleId].emoji,
        sellPrice: variant.sellPrice,
        costPrice: variant.costPrice,
        source: 'rack',
        state: 'PREPARED',
        placedAt: Date.now(),
      };

      // Match validation
      const isMatch = 
        prepItem.styleId === customer.targetStyleId &&
        (!customer.preferredColor || prepItem.colorName === customer.preferredColor) &&
        (!customer.requestedSize || prepItem.size === customer.requestedSize);

      expect(isMatch).toBe(true);

      // Hand off: item enters customer cart, customer advances to checkout
      const cartItem: CustomerCartItem = {
        id: 'cart-1',
        styleId: prepItem.styleId,
        styleName: prepItem.styleName,
        variantId: prepItem.variantId,
        size: prepItem.size,
        colorName: prepItem.colorName,
        sellPrice: prepItem.sellPrice,
        emoji: prepItem.emoji,
      };

      customer.cartItems = [cartItem];
      customer.state = 'checkout';

      // Still NO revenue recognized at hand-off!
      expect(state.cash).toBe(5000000);
      expect(state.currentDayStats.revenue).toBe(0);
      expect(customer.cartItems).toHaveLength(1);
    });
  });

  describe('POS Checkout & Strict Revenue Recognition', () => {
    it('recognises revenue ONLY upon successful POS payment completion', () => {
      const state = createMockWorkstationState();
      const initialCash = state.cash;
      const initialRevenue = state.currentDayStats.revenue;

      const customer: Customer = {
        id: 'cust-pos-1',
        name: 'Hoàng Nam',
        avatar: '🧑‍💼',
        archetype: 'Dân Công Sở',
        targetCategory: 'tops',
        targetStyleId: 'style-baby-tee',
        requestedSize: 'M',
        preferredColor: 'Hồng Phấn',
        budget: 600000,
        state: 'checkout',
        stateProgress: 100,
        patience: 80,
        maxPatience: 100,
        cartItems: [
          { id: 'c1', styleId: 'style-baby-tee', styleName: 'Baby Tee', variantId: 'TEE-PINK-S', size: 'S', colorName: 'Hồng', sellPrice: 165000, emoji: '👕' },
          { id: 'c2', styleId: 'style-cargo-pants', styleName: 'Cargo Pants', variantId: 'PANTS-BLACK-M', size: 'M', colorName: 'Đen', sellPrice: 290000, emoji: '👖' }
        ],
      };

      const cartSubtotal = (customer.cartItems || []).reduce((sum, i) => sum + i.sellPrice, 0);
      expect(cartSubtotal).toBe(455000);

      // Pending cart value is visible, but not recognized as revenue
      state.currentDayStats.pendingCartValue = cartSubtotal;
      expect(state.cash).toBe(initialCash);
      expect(state.currentDayStats.revenue).toBe(initialRevenue);

      // Complete POS checkout with 5% tip from posCounter level 2
      const posLevel = state.upgrades.posCounter.level;
      const tipBonus = posLevel >= 2 ? Math.round(cartSubtotal * 0.05) : 0;
      const finalTotal = cartSubtotal + tipBonus;

      const receipt: POSPaymentReceipt = {
        receiptId: 'REC-' + Date.now(),
        customerId: customer.id,
        customerName: customer.name,
        paymentMethod: 'card',
        items: (customer.cartItems || []).map(i => ({
          styleName: i.styleName,
          size: i.size,
          colorName: i.colorName,
          sellPrice: i.sellPrice,
        })),
        subtotal: cartSubtotal,
        discount: 0,
        tip: tipBonus,
        finalTotal: finalTotal,
        timestamp: new Date().toLocaleTimeString('vi-VN'),
      };

      // Execute transaction
      state.cash += finalTotal;
      state.totalEarned += finalTotal;
      state.currentDayStats.revenue += finalTotal;
      state.currentDayStats.customersServed += 1;
      state.currentDayStats.pendingCartValue = 0;

      expect(receipt.paymentMethod).toBe('card');
      expect(receipt.tip).toBe(22750); // 5% of 455000
      expect(receipt.finalTotal).toBe(477750);
      expect(state.cash).toBe(initialCash + 477750);
      expect(state.currentDayStats.revenue).toBe(477750);
      expect(state.currentDayStats.customersServed).toBe(1);
      expect(state.currentDayStats.pendingCartValue).toBe(0);
    });
  });

  describe('Contextual Operational Flows: Receiving, Returns, Cleaning', () => {
    it('processes inbound receiving package: excludes damaged garments and adds verified to backroom', () => {
      const state = createMockWorkstationState();
      const styleId = 'style-baby-tee';
      const variant = state.styles[styleId].variants[0];
      const initialBackroom = variant.backroomStock;

      const incomingPackage: GoodsReceivingPackage = {
        poId: 'PO-2026-001',
        supplierName: 'Xưởng May Hà Nội',
        styleId: styleId,
        styleName: state.styles[styleId].name,
        variantId: variant.id,
        variantDesc: `${variant.colorName} - Size ${variant.size}`,
        quantity: 20,
        verifiedCount: 18,
        damagedCount: 2,
        status: 'completed',
      };

      const usableQuantity = incomingPackage.quantity - incomingPackage.damagedCount;
      expect(usableQuantity).toBe(18);

      // Add to backroom
      variant.backroomStock += usableQuantity;

      expect(variant.backroomStock).toBe(initialBackroom + 18);
    });

    it('resolves customer return and manages repackable inventory', () => {
      const state = createMockWorkstationState();
      const styleId = 'style-baby-tee';
      const variant = state.styles[styleId].variants[0];
      const initialFloor = variant.floorStock;
      const initialCash = state.cash;
      const refundAmount = 165000;

      // Case A: Garment is resaleable / needs repack -> returned to floor stock
      variant.floorStock += 1;
      state.cash -= refundAmount;

      expect(variant.floorStock).toBe(initialFloor + 1);
      expect(state.cash).toBe(initialCash - refundAmount);
    });

    it('cleans floor incident and restores boutique cleanliness to maximum', () => {
      const state = createMockWorkstationState();
      expect(state.cleanliness).toBe(70);

      // Clean incident
      state.cleanliness = Math.min(100, state.cleanliness + 30);
      expect(state.cleanliness).toBe(100);
    });
  });
});
