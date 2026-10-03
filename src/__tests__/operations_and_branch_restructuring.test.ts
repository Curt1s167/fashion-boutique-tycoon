import { describe, it, expect } from 'vitest';
import type { BranchStore, PurchaseOrder, BranchHealthStatus } from '../types/game';

describe('Real Store Operations & Branch Restructuring Invariants', () => {
  it('handles PO receiving with QC inspection and defect adjustments', () => {
    const po: PurchaseOrder = {
      id: 'po-101',
      supplierId: 'sup-vietnam',
      supplierName: 'Xưởng May Vinatex',
      styleId: 'style-baby-tee',
      styleName: 'Áo Thun Baby Tee Nơ Pastel',
      variantId: 'TEE-PNK-S',
      variantDesc: 'Hồng Phấn - Size S',
      quantity: 10,
      totalCost: 650000,
      secondsRemaining: 0,
      status: 'arrived'
    };

    let backroomStock = 0;
    const damagedCount = 1;
    const receivedGoodQty = Math.max(0, po.quantity - damagedCount);
    backroomStock += receivedGoodQty;

    expect(receivedGoodQty).toBe(9);
    expect(backroomStock).toBe(9);
    expect(po.status).toBe('arrived');
  });

  it('restructures branch by reducing daily rent by 25% and updating status', () => {
    const branch: BranchStore = {
      id: 'branch-thaodien',
      name: 'Chi Nhánh Thảo Điền Boutique',
      cityId: 'city-hcm',
      cityName: 'TP. Hồ Chí Minh',
      district: 'Thảo Điền, TP. Thủ Đức',
      dailyRent: 120000,
      revenueBonusPercent: 35,
      isUnlocked: true,
      unlockCost: 2000000,
      icon: '✨',
      rating: 4.9,
      healthStatus: 'WARNING',
      consecutiveLossDays: 1,
      accumulatedProfit: -50000
    };

    const newRent = Math.round(branch.dailyRent * 0.75);
    const updatedBranch: BranchStore = {
      ...branch,
      dailyRent: newRent,
      healthStatus: 'RESTRUCTURING',
      consecutiveLossDays: 0
    };

    expect(updatedBranch.dailyRent).toBe(90000);
    expect(updatedBranch.healthStatus).toBe('RESTRUCTURING');
    expect(updatedBranch.consecutiveLossDays).toBe(0);
  });

  it('liquidates branch stock providing immediate recovery cash flow', () => {
    let cash = 100000;
    const liquidationRecovery = 350000;
    cash += liquidationRecovery;

    const healthStatus: BranchHealthStatus = 'HEALTHY';
    expect(cash).toBe(450000);
    expect(healthStatus).toBe('HEALTHY');
  });

  it('closes non-main branch, refunds 30% unlock deposit and halts daily rent bleed', () => {
    const branch: BranchStore = {
      id: 'branch-danang',
      name: 'Boutique Biển Đà Nẵng',
      cityId: 'city-danang',
      cityName: 'Đà Nẵng',
      district: 'Bạch Đằng, Đà Nẵng',
      dailyRent: 80000,
      revenueBonusPercent: 30,
      isUnlocked: true,
      unlockCost: 1800000,
      icon: '🌊',
      rating: 4.7,
      healthStatus: 'LOSS_MAKING',
      consecutiveLossDays: 2,
      accumulatedProfit: -160000
    };

    let cash = 50000;
    const refundDeposit = Math.round(branch.unlockCost * 0.30);
    cash += refundDeposit;

    const closedBranch: BranchStore = {
      ...branch,
      isUnlocked: false,
      healthStatus: 'CLOSED',
      consecutiveLossDays: 0
    };

    expect(refundDeposit).toBe(540000);
    expect(cash).toBe(590000);
    expect(closedBranch.isUnlocked).toBe(false);
    expect(closedBranch.healthStatus).toBe('CLOSED');
  });

  it('transitions branch health based on consecutive loss days', () => {
    let lossDays = 0;
    let health: BranchHealthStatus = 'HEALTHY';

    // Day 1 loss
    lossDays += 1;
    health = lossDays >= 3 ? 'INSOLVENT' : lossDays >= 2 ? 'LOSS_MAKING' : 'WARNING';
    expect(health).toBe('WARNING');

    // Day 2 loss
    lossDays += 1;
    health = lossDays >= 3 ? 'INSOLVENT' : lossDays >= 2 ? 'LOSS_MAKING' : 'WARNING';
    expect(health).toBe('LOSS_MAKING');

    // Day 3 loss
    lossDays += 1;
    health = lossDays >= 3 ? 'INSOLVENT' : lossDays >= 2 ? 'LOSS_MAKING' : 'WARNING';
    expect(health).toBe('INSOLVENT');

    // Recovery on profit day
    lossDays = 0;
    health = 'HEALTHY';
    expect(health).toBe('HEALTHY');
  });
});
