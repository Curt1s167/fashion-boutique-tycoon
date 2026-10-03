import { describe, it, expect } from 'vitest';

describe('Vietnam Tax Management & Retail Accounting Invariants', () => {
  it('calculates VAT 10% and CIT 20% on taxable revenue and net profit', () => {
    const revenue = 1000000;
    const cost = 400000;
    const rent = 100000;
    const payroll = 100000;
    const netProfit = revenue - cost - rent - payroll; // 400,000

    const vatRate = 0.10;
    const citRate = 0.20;

    const vatPayable = Math.round(revenue * vatRate);
    const citPayable = Math.round(netProfit * citRate);

    expect(vatPayable).toBe(100000);
    expect(citPayable).toBe(80000);
    expect(vatPayable + citPayable).toBe(180000);
  });

  it('accrues late penalty fee at 0.03% per day on overdue tax debt', () => {
    const initialDebt = 1000000;
    const dailyPenaltyRate = 0.0003; // 0.03% theo Luật Quản Lý Thuế 2019
    const overdueDays = 5;

    const penaltyAccrued = Math.round(initialDebt * dailyPenaltyRate * overdueDays);
    expect(penaltyAccrued).toBe(1500);

    const totalObligation = initialDebt + penaltyAccrued;
    expect(totalObligation).toBe(1001500);
  });

  it('settles tax obligation prioritizing penalty fee first then principal', () => {
    const penaltyFee = 50000;
    const vatPayable = 200000;
    const citPayable = 100000;
    const totalObligation = penaltyFee + vatPayable + citPayable; // 350,000

    const paymentAmount = 100000;

    const remainingPenalty = Math.max(0, penaltyFee - paymentAmount); // 0
    const remainderAfterPenalty = Math.max(0, paymentAmount - penaltyFee); // 50,000
    const remainingVat = Math.max(0, vatPayable - remainderAfterPenalty); // 150,000
    const remainderAfterVat = Math.max(0, remainderAfterPenalty - vatPayable); // 0
    const remainingCit = Math.max(0, citPayable - remainderAfterVat); // 100,000

    const newDebt = remainingPenalty + remainingVat + remainingCit;
    expect(remainingPenalty).toBe(0);
    expect(remainingVat).toBe(150000);
    expect(remainingCit).toBe(100000);
    expect(newDebt).toBe(250000);
    expect(totalObligation - paymentAmount).toBe(newDebt);
  });
});
