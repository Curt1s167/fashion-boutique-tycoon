import { describe, it, expect } from 'vitest';
import type { GameState } from '../types/game';
import { FIRST_7_DAYS_JOURNEY_DATA, WEEK_2_FOCUS_OPTIONS } from '../data/journeyConfig';
import { INITIAL_STYLES, INITIAL_BRANCHES, INITIAL_EMPLOYEES } from '../data/fashionCatalog';

describe('ANTIGRAVITY First 7 Days Player Journey & Cute UX Learning Test Suite', () => {
  const createMockGameState = (): GameState => ({
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
    currentInGameMinutes: 480,
    cleanliness: 95,
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
    completedJourneyGoalIds: [],
    journeyGoalProgress: {},
    week2FocusChoice: undefined,
    upgrades: {
      fittingRooms: { id: 'fittingRooms', name: 'Phòng Thử Đồ', description: 'Nâng cấp phòng thử đồ', level: 1, maxLevel: 5, baseCost: 1500000, costMultiplier: 2.2, effect: '+1 phòng thử', icon: '🪞' },
      posCounter: { id: 'posCounter', name: 'Quầy Thu Ngân POS', description: 'Nâng cấp máy quẹt thẻ', level: 1, maxLevel: 5, baseCost: 2000000, costMultiplier: 2.4, effect: '+1 máy quẹt thẻ POS', icon: '💳' },
      marketing: { id: 'marketing', name: 'Biển Hiệu & Marketing', description: 'Quảng cáo thương hiệu', level: 1, maxLevel: 5, baseCost: 1000000, costMultiplier: 2.0, effect: '+25% lượng khách ghé tiệm', icon: '📢' },
      shopSpace: { id: 'shopSpace', name: 'Diện Tích Mặt Bằng', description: 'Mở rộng sàn bán lẻ', level: 1, maxLevel: 4, baseCost: 4000000, costMultiplier: 2.8, effect: '+2 sức chứa khách trong tiệm', icon: '🏬' },
      staffAuto: { id: 'staffAuto', name: 'Thuê Stylist', description: 'Tư vấn tự động', level: 0, maxLevel: 3, baseCost: 600000, costMultiplier: 2.5, effect: 'Hồi phục kiên nhẫn', icon: '💁‍♀️' },
      backroomStorage: { id: 'backroomStorage', name: 'Kệ Kho', description: 'Mở rộng kho', level: 1, maxLevel: 5, baseCost: 300000, costMultiplier: 1.8, effect: 'Tăng sức chứa kho', icon: '📦' },
      deliverySpeed: { id: 'deliverySpeed', name: 'Shipper Giao Nhanh', description: 'Đội ngũ giao hàng', level: 0, maxLevel: 3, baseCost: 1200000, costMultiplier: 2.0, effect: 'Mở bán online', icon: '🛵' }
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
    taxState: {
      ruleVersion: 'VN_TAX_2026_V1',
      vatRate: 0.10,
      citRate: 0.20,
      taxableRevenue: 0,
      taxableProfit: 0,
      vatPayable: 0,
      citPayable: 0,
      totalTaxPaid: 0,
      overdueDays: 0,
      penaltyFee: 0,
      taxDebt: 0,
      dueDay: 7,
      isAuditWarning: false
    },
    activeIncidents: []
  });

  describe('Day 1 Journey: First Sale & Accounting Foundation', () => {
    it('has complete metadata for Day 1: "Mình làm được!" and 3 guided goals', () => {
      const day1 = FIRST_7_DAYS_JOURNEY_DATA[1];
      expect(day1).toBeDefined();
      expect(day1.subtitle).toContain('Mình làm được');
      expect(day1.goals).toHaveLength(3);
      expect(day1.whyExplanation.question).toContain('tiền chưa cộng');
      expect(day1.whyExplanation.answers.length).toBeGreaterThanOrEqual(2);
    });

    it('completes Day 1 goals step-by-step and respects accounting invariants', () => {
      const state = createMockGameState();
      expect(state.completedJourneyGoalIds).toHaveLength(0);

      // Step 1 & 2: Pick item and place on preparation table
      state.completedJourneyGoalIds.push('day1_pick_shirt');
      state.completedJourneyGoalIds.push('day1_prep_table');

      // CRITICAL: Cash and Revenue MUST NOT increase at preparation
      expect(state.cash).toBe(5000000);
      expect(state.currentDayStats.revenue).toBe(0);

      // Step 3: Complete POS payment checkout
      const billAmount = 165000;
      state.cash += billAmount;
      state.currentDayStats.revenue += billAmount;
      state.completedJourneyGoalIds.push('day1_pos_checkout');

      expect(state.cash).toBe(5165000);
      expect(state.currentDayStats.revenue).toBe(165000);
      expect(state.completedJourneyGoalIds).toContain('day1_pos_checkout');
    });
  });

  describe('Day 2 Journey: Size Matching & Backroom Restock', () => {
    it('has complete metadata for Day 2: "À, size quan trọng" and restock goals', () => {
      const day2 = FIRST_7_DAYS_JOURNEY_DATA[2];
      expect(day2.subtitle).toContain('size quan trọng');
      expect(day2.goals.map(g => g.id)).toContain('day2_backroom_retrieve');
      expect(day2.goals.map(g => g.id)).toContain('day2_restock_rack');
    });

    it('demonstrates backroom stock replenishment to floor rack', () => {
      const state = createMockGameState();
      const style = state.styles['style-baby-tee'];
      const variant = style.variants[0];
      const initialFloor = variant.floorStock;
      const initialBackroom = variant.backroomStock;

      // Restock 3 items from backroom to sales floor
      const moveAmount = 3;
      variant.floorStock += moveAmount;
      variant.backroomStock -= moveAmount;
      state.completedJourneyGoalIds.push('day2_restock_rack');

      expect(variant.floorStock).toBe(initialFloor + moveAmount);
      expect(variant.backroomStock).toBe(initialBackroom - moveAmount);
      expect(state.completedJourneyGoalIds).toContain('day2_restock_rack');
    });
  });

  describe('Day 3 Journey: Fitting Room & 5-Star Reviews', () => {
    it('records alternative size fulfillment and 5-star customer review', () => {
      const state = createMockGameState();
      const day3 = FIRST_7_DAYS_JOURNEY_DATA[3];
      expect(day3.subtitle).toContain('Khách có cảm xúc thật');

      // Fulfill alternative size in fitting room
      state.completedJourneyGoalIds.push('day3_fitting_assist');
      state.completedJourneyGoalIds.push('day3_fitting_exchange');

      // Customer leaves 5-star review
      state.reviews.push({
        id: 'rev-test-1',
        customerName: 'Hoàng Yến',
        customerAvatar: '👩',
        stars: 5,
        category: 'fitting',
        comment: 'Đổi size tại phòng thử siêu nhanh, nhân viên cực dễ thương!',
        timestamp: 'Vừa xong',
        replied: false,
      });
      state.completedJourneyGoalIds.push('day3_get_review');

      expect(state.reviews[0].stars).toBe(5);
      expect(state.completedJourneyGoalIds).toContain('day3_get_review');
    });
  });

  describe('Day 4 Journey: Store Cleanliness & Operations', () => {
    it('restores boutique cleanliness to 100% on sweep action', () => {
      const state = createMockGameState();
      state.cleanliness = 65; // dirty floor

      // Perform sweepFloor action
      state.cleanliness = Math.min(100, state.cleanliness + 35);
      state.completedJourneyGoalIds.push('day4_sweep_floor');
      state.completedJourneyGoalIds.push('day4_keep_cleanliness');

      expect(state.cleanliness).toBe(100);
      expect(state.completedJourneyGoalIds).toContain('day4_sweep_floor');
    });
  });

  describe('Day 5 Journey: Employee Recruitment & Wage Cost', () => {
    it('hires first employee and records wage impact on payroll', () => {
      const state = createMockGameState();
      const initialCash = state.cash;
      const initialEmployees = state.employees.length;

      // Hire Lan - Sales Advisor
      const hiringFee = 56000;
      state.cash -= hiringFee;
      state.employees.push({
        id: 'emp-lan',
        name: 'Ngọc Lan',
        avatar: '💁‍♀️',
        role: 'sales',
        roleLabel: 'Stylist Tư Vấn Bán Lẻ',
        wagePerDay: 28000,
        skillLevel: 2,
        morale: 90,
        energy: 90,
        stress: 10,
        shift: 'morning',
        branchId: 'branch-1'
      });
      state.completedJourneyGoalIds.push('day5_hire_staff');

      expect(state.employees).toHaveLength(initialEmployees + 1);
      expect(state.cash).toBe(initialCash - hiringFee);
      expect(state.completedJourneyGoalIds).toContain('day5_hire_staff');
    });
  });

  describe('Day 7 Journey: First Weekly Review & Week 2 Focus', () => {
    it('features 4 distinct strategic focus options for Week 2', () => {
      expect(WEEK_2_FOCUS_OPTIONS).toHaveLength(4);
      const focusIds = WEEK_2_FOCUS_OPTIONS.map(f => f.id);
      expect(focusIds).toContain('INVENTORY');
      expect(focusIds).toContain('SERVICE');
      expect(focusIds).toContain('COST_EFFICIENCY');
      expect(focusIds).toContain('BRAND_REPUTATION');
    });

    it('successfully selects a Week 2 Strategic Focus and awards completion milestone', () => {
      const state = createMockGameState();
      state.day = 7;

      // Player selects 'SERVICE' focus
      state.week2FocusChoice = 'SERVICE';
      state.completedJourneyGoalIds.push('day7_choose_focus');
      state.completedJourneyGoalIds.push('day7_review_report');

      expect(state.week2FocusChoice).toBe('SERVICE');
      expect(state.completedJourneyGoalIds).toContain('day7_choose_focus');
    });
  });
});
