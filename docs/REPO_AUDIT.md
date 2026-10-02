# REPO AUDIT REPORT — FASHION BOUTIQUE TYCOON
**Date**: 2026-10-02  
**Target Specification**: `FASHION_SHOP_GAME_SPEC.md`

---

## 1. Stack and Package Manager
- **Core Framework**: React 19 (`react`, `react-dom`)
- **Build Tool**: Vite 8.3.2 with `@vitejs/plugin-react`
- **Language**: TypeScript 6.0 (`strict: true`, `verbatimModuleSyntax: true`)
- **Styling**: Tailwind CSS 3.4 + PostCSS + Autoprefixer
- **UI Animation**: Framer Motion 14
- **Icons**: Lucide React
- **Audio Engine**: Web Audio API Synthesizer (`src/utils/sound.ts`) + Howler installed
- **Special Effects**: Canvas-Confetti
- **Package Manager**: `npm` (`package-lock.json` authoritative, no second lockfile)

---

## 2. Entry Points
- `index.html`: Mobile-first viewport, Google Fonts (Fredoka & Quicksand), boutique title and favicon.
- `src/main.tsx`: React DOM client mount to `#root`.
- `src/App.tsx`: Top-level component wrapped with `GameProvider`, tab switcher (Desktop top bar + Mobile fixed bottom bar), floating overlays.

---

## 3. Route / Screen Map
- **Mặt Bằng Shop (Shop Floor)**: 4 fashion racks, VIP fitting rooms, POS checkout queue, interactive customer cards with patience bar, quick rush buttons.
- **Kho Nhập Sỉ (Wholesale Market)**: Catalog overview, unit cost, retail price, profit margin calculation, bulk purchase buttons (+5, +10, Max).
- **Nâng Cấp Tiệm (Shop Upgrades)**: Fitting room upgrade, POS register, shop floor expansion, TikTok viral marketing, stylist assistant.
- **Tổng Kết Ngày (Day Summary Modal)**: End of 60s business day report showing revenue, wholesale cost, net profit, customer count, satisfaction rate.

---

## 4. Current Game State Model
- Context-driven state in `src/context/GameContext.tsx` with:
  - `cash`, `totalEarned`, `reputationStars`, `reputationExp`, `day`, `dayTime`, `isDayRunning`
  - `inventory`: Record of `FashionItem`
  - `customers`: Array of `Customer`
  - `upgrades`: Fitting rooms, POS counter, shop space, marketing, stylist
  - `currentDayStats`: Daily financial metrics
  - `floatingNumbers`: Floating animation items for income, tips, lost customer alerts

---

## 5. Current Data Model
- `FashionItem`: ID, name, category, costPrice, sellPrice, stock, shelfCapacity, level, emoji.
- `Customer`: ID, name, avatar, targetCategory, budget, patience, state, stateProgress, billAmount.
- `UpgradeItem`: Level, maxLevel, baseCost, costMultiplier, effect.

---

## 6. Current Persistence
- Currently state resides in memory (`useState` + `useRef`).
- **Required by Spec**: Add `localStorage` persistence with versioned schema (`FASHION_TYCOON_SAVE_V1`), auto-save on major transactions and day end, plus reset/new game option.

---

## 7. Current Asset Folders
- `public/favicon.svg`
- `public/icons.svg`
- `src/assets/hero.png`
- SVG icons supplied cleanly via Lucide React and custom SVG styling.

---

## 8. Current Audio System
- Synthesizer in `src/utils/sound.ts` using Web Audio API:
  - `playCash()`: Satisfying stereo cash register chime
  - `playPop()`: Button and interaction pop
  - `playLevelUp()`: Arpeggio fanfare for upgrades and star level-up
  - `playAngry()`: Low buzzer for lost customers
  - `playBell()`: Shop entrance door chime
  - Full toggle support on UI (Header & mobile).

---

## 9. Existing Gameplay Mechanics
- 1-second real-time game loop.
- Customer spawning influenced by reputation stars and marketing level.
- Customer lifecycle: Entering → Browsing → Picking item → VIP Fitting room → POS queue → Satisfied checkout / Angry exit.
- Active player interaction: Rush fitting, Rush checkout, click customer to give Stylist patience boost (+25%).
- Day / Night cycle: 60-second shifts with confetti celebration and financial summary modal.

---

## 10. Code Duplication & Technical Debt
- Inventory was category-level only (`tshirt`, `jeans`, `sneaker`, `handbag`). Spec requires variant-aware architecture (`ProductStyle` → `Colorway` → `SKU` with size runs, e.g. S/M/L/XL, EU 36-42).
- Need distinct Sales Floor (Kệ bán lẻ) vs Backroom (Kho chứa phía sau).
- Need Supplier Procurement (Đơn đặt hàng sỉ PO có thời gian giao hàng).
- Need Customer Returns & Exchanges feature (Đổi trả size/màu).
- Need Lookbook / Outfit combo recipes.
- Need Social / Fashion Feed with simulated trends and influencer posts.
- Need Omnichannel online order fulfillment.

---

## 11. Reusable Components
- `src/components/Header.tsx`
- `src/components/FloatingMoney.tsx`
- `src/components/DaySummaryModal.tsx`
- `src/components/ShopFloor.tsx`
- `src/components/InventoryWholesale.tsx`
- `src/components/ShopUpgrades.tsx`

---

## 12. Missing Fashion Modules (from Spec)
1. **Variant Architecture**: Size & Colorway hierarchy for apparel & footwear.
2. **Floor vs Backroom Inventory**: Separate shelf ATS vs backroom stock + Quick Replenish mechanic.
3. **Suppliers & Purchase Orders**: Multiple suppliers with lead times, order tracking.
4. **Returns & Exchanges Desk**: Customers returning ill-fitting items for refund or exchange.
5. **Fashion Feed & Lookbook**: Trending styles, outfit matching combos giving sales boosts.
6. **Omnichannel Online Orders**: Ship-from-store delivery orders.
7. **Branch Management Foundation**: Expansion into secondary boutique branches.

---

## 13. Proposed File-by-File Change Plan
1. `src/types/game.ts`: Expand data models for styles, colorways, sizes, SKU variants, floor/backroom quantities, purchase orders, returns, online orders, lookbook outfits, social feed, and save schema.
2. `src/data/fashionCatalog.ts`: Seed catalog with 8+ fashion styles, colors, sizes, and suppliers.
3. `src/utils/saveManager.ts`: Safe localStorage versioned save/load/reset manager.
4. `src/context/GameContext.tsx`: Implement variant inventory management, floor vs backroom replenishment, purchase orders delivery timer, return/exchange processing, online order dispatch, outfit lookbook unlocks, and trend signals.
5. `src/components/ShopFloor.tsx`: Display floor vs backroom, restock buttons, return request counter.
6. `src/components/FittingRoomZone.tsx` & `src/components/PosCheckoutZone.tsx`: Enhanced customer service.
7. `src/components/ProcurementOrders.tsx`: Supplier order management with lead times.
8. `src/components/FashionFeedLookbook.tsx`: Social trend feed and outfit combo discovery.
9. `src/components/OmnichannelDelivery.tsx`: Online orders fulfillment & delivery dispatch.
10. `src/components/ReturnsExchangeModal.tsx`: Service desk for customer size exchanges.

---

## 14. Dependencies That Truly Need Installation
- All required libraries are already installed (`framer-motion`, `lucide-react`, `canvas-confetti`, `howler`, `clsx`, `tailwind-merge`).
- No additional heavy libraries needed; existing toolset is complete and performant.

---

## 15. Risk List & Mitigations
- **UI density on mobile**: Keep sub-systems accessible via clean tab navigation with status notification badges.
- **Simulation overhead**: Pure pure-state reducers with immutability, ensuring 60FPS fluid gameplay.
- **TypeScript strictness**: Keep all types cleanly exported and use `import type` for zero build warnings.
