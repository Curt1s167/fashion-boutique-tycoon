# ANTIGRAVITY UI-FUNCTION TRACEABILITY MATRIX
# NINI — REAL STORE OPERATIONS, UI-FUNCTION MATCHING & VIETNAM BUSINESS SIMULATION

Version: 1.0  
Date: 2026-10-03  
Entity Scope: Hộ kinh doanh thời trang / Doanh nghiệp bán lẻ thời trang Nini Boutique Việt Nam  

---

## 1. Traceability Matrix

| Feature | Existing UI | Player Action | Business Logic | Persistence | Failure State | Status |
|---|---|---|---|---|---|---|
| **Manual Stock Fetch & Carry** | ShopFloor Hands Tray (`✋ Đồ Đang Cầm`) & Racks | Tap "Cầm ✋", "Bỏ lại", "Đưa khách" | Exact SKU size/color matched with Customer request; capacity check | Dexie/LocalStorage save layer | Wrong size/item rejected by customer; Hand capacity full | COMPLETE |
| **Interactive Fitting Room** | ShopFloor fitting booths & progress bars | Tap "Thử đồ nhanh", "Đổi size khác" | Fitting duration, patience preservation, alternative size fallback | Dexie/LocalStorage save layer | Customer rejects outfit if out of alternative stock; patience decays | COMPLETE |
| **POS Checkout & Strict Revenue** | POS Checkout Counter & rush button | Tap "Quẹt thẻ POS ⚡" / "Tính tiền" | Invariant: Revenue & Cash strictly credit ONLY upon manual payment | Dexie/LocalStorage save layer | Customer abandons queue if wait too long; unserved customer loss recorded | COMPLETE |
| **Inventory Matrix (Exact SKU)** | InventoryWholesale SKU cards & size badges | Tap "Chuyển lên kệ", Filter categories | SKU-level floor vs backroom balance; no silent mutation | Dexie/LocalStorage save layer | Backroom out of stock; Shelf capacity reached | COMPLETE |
| **Procurement & QC Inspection** | ProcurementOrders & QC Modal | Submit PO, Click "Kiểm Định QC & Nhận Hàng" | PO transit timer, interactive QC inspection check, defect claim | Dexie/LocalStorage save layer | Insufficient cash to place order; Defect items rejected | COMPLETE |
| **Customer Returns & Exchanges** | ShopFloor returns strip (`Đổi trả hàng`) | Tap "Đồng ý" (Check) / "Từ chối" (X) | Refund amount deducted, customer sentiment updated | Dexie/LocalStorage save layer | False claim rejection, customer disappointment | COMPLETE |
| **Store Cleanliness & Sanitation** | ShopFloor cleanliness bar & sweep button | Tap "Quét dọn tiệm 🧹 (+25%)" | Cleanliness decays over time; <60% triggers customer complaints | Dexie/LocalStorage save layer | Store dirty (<60%), negative reviews & dynamic incident triggered | COMPLETE |
| **Branch Health & Restructuring** | VietnamBusinessMap with 5 cities | "Tái cấu trúc", "Xả thanh lý", "Đóng chi nhánh" | Evaluates consecutive loss days, reduces rent by 25%, liquidates stock | Dexie/LocalStorage save layer | Insufficient capital, branch insolvency risk | COMPLETE |
| **Vietnam Tax Obligations (VAT & CIT)** | ManagementDesk / Finance Desk | Review payable, Click "Nộp thuế kỳ này" | VAT (10% Law on VAT) on checkout sales + CIT (20% Law on CIT) on audited net profit | Dexie/LocalStorage save layer | Overdue tax generates late-payment penalty (0.03%/day) and debt warning | COMPLETE |
| **Operational Incidents & Shrinkage** | ShopFloor Alert Bar & Incident resolution modal | Investigate incident, recount stock, resolve complaint | Dynamically triggered by low cleanliness, high stress, or lack of cashier | Dexie/LocalStorage save layer | Unresolved incident damages reputation and financial loss | COMPLETE |
| **HR Shifts & Employee Management** | StaffManagement & Staff on Duty | Assign role/shift, train staff, handle lateness | Service speed, checkout throughput, payroll expense | Dexie/LocalStorage save layer | High stress -> burnout, lateness, absenteeism | COMPLETE |

---

## 2. Invariants & Legal Foundations

1. **Strict Accounting Invariant**:
   `REQUEST != SALE`, `PICKUP != SALE`, `FITTING != SALE`, `CART != SALE`, `QUEUE != SALE`.
   `PAYMENT_SUCCESS == SALE`. Cash & Revenue recorded ONLY upon POS payment.
2. **Vietnam Tax Law Compliance**:
   - Luật Thuế Giá Trị Gia Tăng (Luật số 13/2008/QH12 & sửa đổi bổ sung).
   - Luật Thuế Thu Nhập Doanh Nghiệp (Luật số 14/2008/QH12 & sửa đổi bổ sung, thuế suất chuẩn 20%).
   - Luật Quản Lý Thuế (Luật số 38/2019/QH14, điều 59 về tiền chậm nộp 0,03%/ngày).
   - Rules are versioned (`VN_TAX_2026_V1`), preserving historical records without silent retroactive rewrite.
