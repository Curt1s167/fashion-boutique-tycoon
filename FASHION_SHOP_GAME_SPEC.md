# FASHION SHOP GAME — MASTER BUSINESS & IMPLEMENTATION SPEC
Version: 0.1
Target: Improve an existing web-game project with Google Antigravity
Domain: Fashion retail — clothing, footwear, bags, accessories
Language: Vietnamese-first UI, code identifiers in English

> This is the source-of-truth business specification for transforming the existing shop-management game into a fashion retail simulation. Preserve the existing project stack and working features whenever possible. Do not rewrite the application from scratch unless the repository is demonstrably unrecoverable.

---

## 1. PRODUCT VISION

Build a cozy, mobile-first fashion-shop management game inspired by the interaction density and playful visual language of the reference game, but with original fashion-themed content, original icons/artwork, and retail-specific business logic.

The player owns a small boutique and grows it into a multi-branch fashion brand. The moment-to-moment loop is not merely "click to earn money": customers have style, size, color, budget and urgency needs; the player must merchandise the shop, maintain correct variant inventory, serve fitting rooms, complete checkout, handle returns/exchanges, replenish stock, run promotions, fulfill online orders and eventually manage a chain.

Primary fantasy:
- "Từ một shop nhỏ thành thương hiệu thời trang nổi tiếng."
- "Mỗi ngày mở cửa, đón khách, tư vấn, thử đồ, bán hàng, nhập hàng, tối ưu tồn kho và mở rộng chi nhánh."
- "Sản phẩm đẹp nhưng sai size/sai màu vẫn là mất doanh thu."

Core design pillars:
1. Cozy and readable.
2. Fashion-specific business depth.
3. Short satisfying daily sessions.
4. Strong visual feedback for every action.
5. Systems interlock: customer demand ↔ assortment ↔ variants ↔ inventory ↔ staff ↔ reputation ↔ expansion.
6. Existing project first: audit, reuse, refactor incrementally.

---

## 2. REFERENCE GAME — OBSERVED SURFACE & TRANSFORMATION

The reference surface exposes a day-based shop loop with money, rating, branch count, a main shop/counter entry, a mascot-based patience boost, delivery map/vehicles, chain/franchise management, social feed, and a collection system.

Do NOT duplicate proprietary artwork or branding. Reproduce interaction patterns and information architecture with original fashion assets.

### 2.1 Reference-to-fashion mapping

| Reference concept | Fashion-game equivalent | Notes |
|---|---|---|
| Day / Preparation | Ngày bán hàng / Chuẩn bị mở shop | Daily planning and open/close cycle |
| Money | Tiền mặt / Doanh thu | Track revenue, cost, profit separately |
| Star rating | Danh tiếng shop | Affects traffic and customer quality |
| Branch count | Chi nhánh | Owned store or franchise |
| Main counter | Sàn bán hàng / Quầy thu ngân | Main gameplay scene |
| Customer patience | Kiên nhẫn khách | Reduced by queues, missing sizes, slow fitting |
| Mascot boost | Stylist mascot / Shop assistant | Temporary patience/service/reputation buff |
| Delivery vehicles | Đơn online / Shipper / Fulfillment | Ship-from-store, pickup, delivery |
| Chain management | Quản lý chuỗi | Inventory transfers, branch KPI |
| Social feed | Fashion Feed / Lookbook | Trends, UGC, promotions, reviews |
| Ingredient/recipe collection | Bộ sưu tập sản phẩm / Outfit / Collection | Discover styles and outfit combos |
| Recipe unlock | Product/collection unlock | Requires level, supplier, trend, capital |
| Preparation state | Store setup | Refill racks, assign staff, create promotions |

---

## 3. CORE GAME LOOP

### 3.1 Daily macro loop

1. **Morning planning**
   - Read trend/weather/event hints.
   - Review yesterday KPI.
   - Replenish racks from backroom.
   - Receive pending purchase orders.
   - Set display/mannequin items.
   - Configure promotion if desired.
   - Assign staff to floor/cashier/fitting/stock.
   - Confirm opening.

2. **Open shop**
   - Customer waves spawn based on traffic score.
   - Customers browse categories and products.
   - Customer selects style → color → size.
   - If available, customer may enter fitting room.
   - Player/staff resolves requests.
   - Customer queues at cashier.
   - Checkout reduces exact SKU inventory.
   - Satisfaction/reputation updated.
   - Parallel online orders can arrive.

3. **Operational interruptions**
   - Rack empty while backroom has stock.
   - Customer requests another size/color.
   - Fitting-room queue.
   - POS queue.
   - Online order reserves the last unit.
   - Return/exchange arrives.
   - VIP/influencer customer.
   - Flash-trend event.
   - Damaged/missing item.
   - Staff fatigue.

4. **Closing**
   - Stop new traffic.
   - Finish active customers.
   - Reconcile cash/POS.
   - Calculate revenue, COGS, payroll, rent allocation, marketing, refunds.
   - Compute daily profit and KPI.
   - Update sell-through and trend signals.
   - Progress missions/unlocks.
   - Save game.

### 3.2 Micro loop per customer

`ENTER → BROWSE → REQUEST → TRY_ON(optional) → DECIDE → QUEUE_CHECKOUT → PAY → LEAVE`

Failure branches:
- missing size/color → WAIT_FOR_HELP → substitute accepted OR abandon.
- price too high → promo/cross-sell attempt OR leave.
- fitting queue too long → abandon fitting or leave.
- checkout queue too long → leave.
- bad fit after purchase → later return/exchange.

### 3.3 Customer satisfaction model

Suggested score 0–100:

`Satisfaction = base 60
+ serviceBonus
+ exactMatchBonus
+ fittingSuccessBonus
+ promoValueBonus
+ storeAmbienceBonus
- waitPenalty
- stockoutPenalty
- wrongRecommendationPenalty
- queuePenalty`

Clamp to [0,100].

Result:
- 85–100: delighted; higher review/social-share chance.
- 70–84: satisfied.
- 50–69: neutral.
- 30–49: dissatisfied.
- 0–29: likely negative review.

Do not hardcode final tuning values in UI components. Put balance constants in a dedicated config module.

---

## 4. FASHION RETAIL DOMAIN MODEL

### 4.1 Product hierarchy — mandatory

Fashion inventory MUST be variant-aware.

Recommended hierarchy:

`ProductStyle → ProductColorway → SKU Variant`

Example:
- ProductStyle: "Áo thun Essential"
- Colorway: "Đen"
- SKU Variant: "Áo thun Essential / Đen / M"

For footwear:
- ProductStyle: "Sneaker Street 01"
- Colorway: "White/Green"
- SKU Variant: "EU 42"

Each sellable variant has its own:
- `sku`
- `barcode`
- `size`
- `colorId`
- `costPrice`
- `sellingPriceOverride?`
- inventory position per location
- sales history
- return history

Never decrement stock at style level.

### 4.2 Product taxonomy

Minimum categories:
- Tops: T-shirt, Shirt, Blouse, Polo, Hoodie, Sweater
- Bottoms: Jeans, Trousers, Shorts, Skirt
- Dresses/Jumpsuits
- Outerwear: Jacket, Blazer, Coat
- Footwear: Sneakers, Loafers, Sandals, Heels, Boots
- Bags
- Accessories: Hat, Belt, Scarf, Jewelry, Socks

Optional customer-facing facets:
- gender/unisex
- style: basic, streetwear, office, minimal, sporty, vintage, luxury
- fit: slim, regular, relaxed, oversized
- material
- season
- collection
- occasion
- brand
- price band

### 4.3 Size systems

Support category-specific size systems:
- Apparel alpha: XS, S, M, L, XL, XXL
- Apparel numeric: 26–38, etc.
- Shoes EU: 35–46
- Accessories: One Size

Do not mix raw strings everywhere. Use a normalized `SizeOption` model with display labels and sortable order.

### 4.4 Core entities

#### Catalog
- `Category`
- `Brand`
- `Supplier`
- `Season`
- `Collection`
- `ProductStyle`
- `ProductColorway`
- `ProductVariant`
- `SizeChart`
- `ProductImage`
- `PriceList`
- `MarkdownRule`

#### Inventory
- `InventoryLocation`
- `InventoryBalance`
- `InventoryMovement`
- `StockReservation`
- `StockCount`
- `StockAdjustment`
- `TransferOrder`
- `TransferOrderLine`

#### Procurement
- `PurchaseOrder`
- `PurchaseOrderLine`
- `InboundShipment`
- `GoodsReceipt`
- `GoodsReceiptLine`

#### Sales
- `StoreVisit`
- `Customer`
- `CustomerPreference`
- `Cart`
- `CartLine`
- `SaleOrder`
- `SaleOrderLine`
- `Payment`
- `Receipt`
- `Discount`
- `Promotion`

#### Fitting & service
- `FittingRoom`
- `FittingSession`
- `TryOnItem`
- `ServiceRequest`
- `QueueTicket`

#### Returns
- `ReturnRequest`
- `ReturnLine`
- `ExchangeOrder`
- `Refund`
- `ReturnInspection`

#### Store operations
- `Store`
- `StoreZone`
- `DisplayFixture`
- `RackSlot`
- `Mannequin`
- `Employee`
- `Shift`
- `StaffAssignment`

#### Omnichannel
- `OnlineOrder`
- `Fulfillment`
- `DeliveryTask`
- `PickupOrder`
- `Shipment`

#### Marketing & CRM
- `LoyaltyAccount`
- `LoyaltyTransaction`
- `Campaign`
- `Coupon`
- `SocialPost`
- `Review`
- `TrendSignal`

#### Game progression
- `PlayerProfile`
- `GameDay`
- `BusinessLevel`
- `Reputation`
- `Mission`
- `Achievement`
- `Unlock`
- `Branch`
- `FranchiseAgreement`
- `GameEvent`

---

## 5. INVENTORY — AUTHORITATIVE RULES

Inventory is the most important domain invariant.

### 5.1 Per-location quantities

For every `variantId + locationId` keep:
- `onHand`
- `reserved`
- `damaged`
- `inTransit`
- `availableToSell`

Recommended:
`availableToSell = max(0, onHand - reserved - damaged)`

Avoid persisting `availableToSell` if it can be safely derived; if persisted for performance, update transactionally.

### 5.2 Inventory locations

Start with:
- store sales floor
- store backroom
- central warehouse (unlock later)
- each branch store
- in-transit virtual location
- damaged/quarantine virtual location

### 5.3 Inventory movements

Every stock change must produce an immutable movement:
- PURCHASE_RECEIPT
- FLOOR_REPLENISHMENT
- SALE
- ONLINE_RESERVATION
- RESERVATION_RELEASE
- RETURN_RESTOCK
- RETURN_DAMAGED
- TRANSFER_OUT
- TRANSFER_IN
- STOCK_ADJUSTMENT
- SHRINKAGE
- SAMPLE_OR_DISPLAY

Do not directly edit quantities without a movement reason.

### 5.4 Stockout behavior

Stockout must be SKU-specific:
- Customer wants black M; black L does not satisfy exact match.
- Staff can suggest nearby size/color/style depending on customer flexibility.
- Exact match gives higher conversion/satisfaction.
- Alternative match has acceptance probability.

### 5.5 Rack vs backroom

A sale can fail from poor operations even when total store stock exists:
- rack quantity = 0
- backroom quantity > 0
- customer may request staff
- restock action takes time
- smart staff may proactively replenish

This creates useful gameplay beyond purchasing.

---

## 6. PROCUREMENT & SUPPLIERS

### 6.1 Supplier attributes

Each supplier can have:
- categories supplied
- reliability
- lead time
- MOQ
- wholesale cost multiplier
- defect rate
- exclusivity
- payment terms
- trendiness
- unlock level

### 6.2 Purchase order flow

`DRAFT → SUBMITTED → CONFIRMED → PARTIALLY_RECEIVED → RECEIVED → CLOSED`
Alternative: `CANCELLED`

Rules:
- Cannot receive more than ordered unless over-receipt policy explicitly allows.
- Receipt creates inventory movement.
- Defective units go to quarantine/damaged, not sellable stock.
- Cash is reduced according to configured payment timing.
- PO costs feed COGS/landed-cost reporting.

### 6.3 Replenishment suggestions

Generate a suggestion; do not auto-buy without game setting:
- recent sales velocity
- current ATS
- lead time
- season remaining
- minimum display quantity
- size curve
- open purchase orders

Simple initial formula:
`recommendedQty = max(0, targetStock - ATS - incomingQty)`

---

## 7. MERCHANDISING & STORE LAYOUT

The fashion game needs visual merchandising, not only inventory tables.

### 7.1 Store zones
- Window display
- New arrivals
- Tops
- Bottoms
- Footwear
- Accessories
- Sale zone
- Fitting rooms
- Cashier
- Backroom

### 7.2 Fixture mechanics
Each rack/shelf/mannequin has:
- capacity
- accepted category
- appeal modifier
- visibility
- restock threshold

### 7.3 Mannequin / outfit combo
Player can compose:
- top
- bottom
- footwear
- accessory

A coherent outfit can:
- increase discovery of all included styles
- improve bundle/cross-sell chance
- create social-content bonus

Outfit compatibility can use explicit tags rather than AI initially.

---

## 8. CUSTOMER MODEL

### 8.1 Customer archetypes
- Student budget shopper
- Office worker
- Trend hunter
- Sneaker fan
- Parent/family buyer
- Luxury/VIP
- Tourist
- Influencer
- Deal seeker
- Loyal regular

### 8.2 Customer intent generated on spawn
- target category
- preferred style tags
- preferred color palette
- size or shoe size
- budget min/max
- quality sensitivity
- trend sensitivity
- promotion sensitivity
- patience
- service need
- willingness to substitute
- channel: walk-in / online / pickup

### 8.3 Demand scoring

For a candidate SKU:

`MatchScore =
styleMatch*w1
+ colorMatch*w2
+ sizeMatch*w3
+ priceFit*w4
+ trendFit*w5
+ brandFit*w6
+ merchandisingVisibility*w7`

Exact size is usually a hard constraint for footwear and many apparel purchases.

### 8.4 Conversion probability

Start simple and deterministic enough to tune:
`P(buy) = sigmoid(
  matchScore
  + serviceQuality
  + promotionValue
  + reputation
  - waitCost
  - priceResistance
)`

For a simpler MVP, replace sigmoid with a 0–100 threshold score.

---

## 9. FITTING ROOM

A dedicated fashion mechanic.

### 9.1 Flow
`REQUEST_FITTING → WAIT → ENTER_ROOM → TRY_ON → RESULT → KEEP / REQUEST_OTHER_SIZE / REJECT`

### 9.2 Fit result factors
- correct size
- fit preference
- product fit metadata
- customer body/size profile abstraction
- staff recommendation quality

Do not simulate sensitive body attributes in a derogatory way. Keep it abstract and respectful.

### 9.3 Gameplay
- More fitting rooms = capacity but higher upgrade cost.
- Good assistant reduces repeated failed tries.
- Queue length impacts patience.
- Items left in fitting room must be returned to rack/backroom.

---

## 10. POS / CHECKOUT

### 10.1 Checkout flow
1. Scan/add exact variants.
2. Apply eligible promotions.
3. Optional loyalty redemption.
4. Select payment method.
5. Confirm.
6. Create sale.
7. Record payment.
8. Create stock movements.
9. Print/show receipt.
10. Update KPI and customer history.

### 10.2 Payment methods
- cash
- card
- QR/e-wallet
Game can abstract provider details.

### 10.3 Promotion engine
Support:
- percentage off
- fixed amount
- category discount
- buy X get Y
- bundle/outfit discount
- threshold discount
- member discount
- coupon code
- clearance markdown

Prevent impossible stacking with `stackingGroup` / priority rules.

---

## 11. RETURNS & EXCHANGES

Fashion retail requires first-class return/exchange logic.

### 11.1 Return flow
`REQUESTED → ELIGIBILITY_CHECK → INSPECTED → APPROVED / REJECTED → REFUNDED / EXCHANGED → CLOSED`

### 11.2 Inspection result
- SELLABLE
- NEEDS_STEAM_OR_REPACK
- DAMAGED
- HYGIENE_RESTRICTED (optional category rule)

### 11.3 Exchange
An exchange is:
- return old SKU
- reserve new SKU
- calculate price difference
- new sale/exchange transaction
- update inventory independently

### 11.4 Game effects
- generous service may improve reputation.
- high returns indicate poor size/fit recommendation.
- damaged return creates cost.
- abuse/fraud can be an advanced event, not MVP.

---

## 12. STAFF & QUEUES

Roles:
- Sales Advisor
- Cashier
- Fitting Room Assistant
- Stock Associate
- Store Manager
- Online Fulfillment Staff

Attributes:
- serviceSpeed
- stylingSkill
- cashierSpeed
- restockSpeed
- accuracy
- stamina
- wage

Gameplay:
- assign by shift/zone
- staff fatigue lowers speed
- training upgrades a skill
- queue bottlenecks are visible and actionable

---

## 13. OMNICHANNEL, DELIVERY & SHIPPER MAP

### 13.1 Online order lifecycle
`PLACED → PAYMENT_CONFIRMED → STOCK_RESERVED → PICKING → PACKED → READY_FOR_PICKUP / OUT_FOR_DELIVERY → DELIVERED`
Failure states:
`CANCELLED`, `FAILED_DELIVERY`, `RETURNED`

### 13.2 Allocation rule
For MVP:
1. Prefer branch with exact SKU ATS > safety stock.
2. If none, use central warehouse.
3. Never allocate already reserved units.

### 13.3 Delivery map
Replace beverage-delivery fantasy with:
- city map
- branch pins
- courier icons
- live-ish progress animation
- order badges
- delivery vehicles unlocked by growth

No need for real maps in MVP; use an original illustrated map.

---

## 14. SOCIAL / FASHION FEED

The feed is both feedback and gameplay.

Post types:
- New drop
- Outfit inspiration
- Customer review
- Influencer mention
- Sale campaign
- Store opening
- Sold-out trend
- Complaint
- Delivery milestone

Metrics:
- likes
- shares
- comments
- reach
- sentiment

Effects:
- traffic boost
- category demand boost
- reputation gain/loss
- trend duration
- promotion awareness

Do not implement a real social network backend for MVP; simulate feed entries from game events.

---

## 15. COLLECTIONS, LOOKBOOK & DISCOVERY

Replace ingredient/recipe collection with:

### 15.1 Product collection book
Tracks:
- styles discovered
- colorways owned
- rare/limited drops
- supplier exclusives
- seasonal pieces

### 15.2 Outfit recipe
An outfit recipe is a curated combination of category slots + style tags:
Example:
- "Office Minimal": Shirt + Trousers + Loafers + Belt
- "Street Weekend": Oversized Tee + Jeans/Cargo + Sneakers + Cap

Unlock rewards:
- display preset
- higher bundle chance
- social post
- achievement
- small permanent reputation modifier

---

## 16. CHAIN & FRANCHISE MANAGEMENT

### 16.1 Branch lifecycle
`LOCKED → AVAILABLE → SETUP → OPEN → OPERATING → UPGRADING`

Each branch:
- location archetype
- rent
- floor size
- local demand mix
- staff capacity
- inventory
- reputation
- P&L
- online fulfillment capacity

Location archetypes:
- school district
- office district
- mall
- tourist street
- premium downtown
- residential area

### 16.2 Cross-branch transfer
`DRAFT → REQUESTED → APPROVED(optional) → PICKING → IN_TRANSIT → RECEIVED`

Use transfers to rebalance sizes/colors.

### 16.3 Franchise advanced mode
Later unlock:
- franchise fee
- royalty
- brand standards
- audit score
- franchise reputation impact

Keep owned branches first for MVP.

---

## 17. FINANCE & KPI

### 17.1 Daily P&L
Track:
- gross sales
- discounts
- net sales
- refunds
- COGS
- gross profit
- payroll
- rent allocation
- marketing spend
- delivery cost
- shrinkage/damage
- operating profit

### 17.2 Fashion KPI
- Revenue
- Gross margin
- Average order value (AOV)
- Units per transaction (UPT)
- Conversion rate
- Sell-through
- Full-price sell-through
- Return rate
- Stockout rate
- Inventory turnover
- Days/weeks of cover
- Markdown rate
- Sales by category/style/color/size
- Branch comparison
- Customer satisfaction
- Reputation
- Loyalty repeat rate

### 17.3 Sell-through
Initial formula:
`SellThrough = unitsSold / max(1, openingUnits + receivedUnits)`

Always allow drill-down:
Collection → Style → Colorway → Size/SKU.

---

## 18. GAME ECONOMY & PROGRESSION

Currencies/resources:
- Cash
- Reputation
- Business XP
- Optional premium-like currency should NOT be introduced unless project already has it.

Unlock examples:
- L1: small boutique, tops/bottoms, 1 fitting room
- L2: footwear
- L3: accessories + mannequin outfits
- L4: online orders
- L5: second branch
- L6: transfer system
- L7: advanced campaigns
- L8: central warehouse
- L9: premium supplier
- L10: franchise

Upgrade categories:
- shop capacity
- racks
- fitting rooms
- cashier/POS
- backroom
- staff slots
- delivery capacity
- visual merchandising
- analytics

Avoid pure exponential idle-game inflation. Keep prices interpretable and connected to product economics.

---

## 19. EVENTS & TREND SYSTEM

Trend dimensions:
- category
- style tag
- color family
- occasion
- season

Event examples:
- Back to school
- Office season
- Weekend streetwear trend
- Rainy week → jackets/closed shoes
- Holiday gifting
- Viral sneaker
- Flash sale competitor
- Influencer post

Trend changes demand, not guaranteed purchases.

---

## 20. UI / SCREEN MAP

### 20.1 Home / town screen
Header:
- Day
- Store state
- Cash
- Reputation stars
- Branch count

Main:
- illustrated boutique card/building
- open/enter shop CTA
- mascot assistant
- quick status chips

Secondary panels:
- Delivery Map
- Chain Management
- Fashion Feed
- Collection/Lookbook
- Calendar/Missions

### 20.2 Main shop floor
Required visible systems:
- door/spawn area
- racks/fixtures
- fitting rooms
- cashier
- staff avatars
- customer avatars
- thought bubbles
- queue indicators
- floating money/XP feedback
- low-stock warning

### 20.3 Inventory screen
Views:
- style cards
- size/color matrix
- branch/location selector
- ATS/on-hand/reserved
- low stock
- incoming
- sell-through

### 20.4 Catalog screen
- category tabs
- product style cards
- color swatches
- size availability
- cost / retail / margin
- supplier
- season/collection
- unlock state

### 20.5 Procurement screen
- supplier cards
- purchase order builder
- variant matrix order quantities
- delivery ETA
- total cost

### 20.6 POS screen
- current cart
- scanned items
- promo
- payment
- receipt

### 20.7 End-of-day report
Cards:
- sales
- profit
- customers
- conversion
- AOV
- best style
- worst stockout
- returns
- reputation movement
- mission progress

---

## 21. VISUAL DESIGN SYSTEM

Target feel:
- pastel
- cozy
- hand-illustrated / soft skeuomorphic
- rounded forms
- dark warm outlines
- small highlights/shadows
- compact mobile-first HUD
- game-like, not enterprise dashboard

### 21.1 Fashion icon set
Create original icons for:
- pause
- settings
- calendar
- wardrobe
- hanger
- shirt
- pants
- dress
- sneaker
- heel
- bag
- hat
- fitting room
- cashier
- barcode
- box
- delivery scooter
- branch/store
- rating/star
- money
- inventory
- social feed
- lookbook

Primary controls should use original SVG/PNG game icons, not generic emoji.

### 21.2 UI tokens
Define tokens centrally:
- background surfaces
- card border radius
- outline width
- shadow elevation
- spacing
- typography scale
- status colors
- animation duration

Do not scatter magic pixel values.

### 21.3 Responsive behavior
Priority:
1. Mobile portrait
2. Mobile landscape
3. Tablet
4. Desktop

On desktop, keep the game viewport centered with side panels rather than stretching every element to full width.

---

## 22. SOUND & ANIMATION

Optional but recommended if existing project supports it.

SFX:
- cash register
- barcode scan
- cloth/rack tap
- fitting-room curtain
- success chime
- low-stock alert
- delivery complete

Animation:
- customers walking
- thought bubble pop
- rack restock
- product pickup
- fitting-room enter/exit
- cashier checkout
- floating revenue
- rating/reputation pulse
- day transition

Respect reduced-motion preference if web stack allows.

---

## 23. SAVE / PERSISTENCE

MVP can be local-first unless backend already exists.

Save:
- player profile
- day
- cash
- reputation
- catalog unlocks
- exact SKU inventory
- branches
- staff
- purchase orders
- missions
- settings
- progression

Requirements:
- version save schema.
- migration function between save versions.
- autosave after important transactions and end-of-day.
- never save transient animation state.

If project already uses backend persistence, adapt to it rather than adding a second source of truth.

---

## 24. STATE MACHINES

### Customer visit
`SPAWNING → ENTERING → BROWSING → REQUESTING → FITTING(optional) → DECIDING → QUEUEING → CHECKOUT → EXITING → COMPLETED`
Failure:
`ABANDONED`

### Sale
`DRAFT → PRICED → PAYMENT_PENDING → PAID → COMPLETED`
Alternative:
`CANCELLED`

### Purchase order
`DRAFT → SUBMITTED → CONFIRMED → PARTIALLY_RECEIVED → RECEIVED → CLOSED`
Alternative:
`CANCELLED`

### Online order
`PLACED → RESERVED → PICKING → PACKED → READY → OUT_FOR_DELIVERY → DELIVERED`
Alternative:
`CANCELLED`, `RETURNED`

### Return
`REQUESTED → INSPECTED → APPROVED → REFUND_OR_EXCHANGE → CLOSED`
Alternative:
`REJECTED`

Guard every state transition in domain/service logic, not only button visibility.

---

## 25. RECOMMENDED CODE BOUNDARIES

Adapt names to the existing stack.

Suggested feature modules:
- `game-core`
- `catalog`
- `inventory`
- `procurement`
- `customers`
- `fitting`
- `pos`
- `returns`
- `staff`
- `store-layout`
- `orders`
- `delivery`
- `marketing`
- `social-feed`
- `branches`
- `finance`
- `progression`
- `missions`
- `save`
- `audio`
- `ui-game`

Avoid one giant `Game.tsx` with all logic.

### 25.1 Pure domain functions
Prefer testable pure functions for:
- price calculation
- promotion eligibility
- inventory availability
- demand scoring
- customer satisfaction
- sell-through
- end-of-day P&L
- XP/unlock thresholds

### 25.2 Transaction boundary
A checkout transaction must atomically:
- validate exact SKU availability
- create sale/order lines
- process payment abstraction
- decrement inventory / movement ledger
- update customer/reputation/KPI hooks
- persist

In local-only state, simulate atomicity by validating first then applying one reducer action.

---

## 26. LIBRARY SETUP POLICY

Antigravity must inspect the repository BEFORE installing anything.

### 26.1 Detect
- package manager from lockfile
- framework from package.json
- TypeScript or JavaScript
- state management already present
- router
- styling system
- animation library
- icon system
- test runner
- persistence library

### 26.2 Reuse first
If equivalent capability exists, reuse it.

### 26.3 Possible additions — only when missing and justified
For a React/TypeScript project, candidates:
- `zustand` for compact game state
- `immer` for immutable reducer ergonomics
- `zod` for save/data validation
- `framer-motion` for UI animation
- `howler` for sound
- `idb-keyval` for IndexedDB persistence
- `nanoid` for local identifiers

Do NOT blindly install all packages.

### 26.4 Package-manager rule
- `pnpm-lock.yaml` → pnpm
- `yarn.lock` → yarn
- `package-lock.json` → npm
- `bun.lockb` / `bun.lock` → bun

Never create a second lockfile.

After install:
- run lint
- run typecheck
- run tests
- run build

---

## 27. EXISTING PROJECT AUDIT — FIRST EXECUTION TASK

Before changing business logic, Antigravity MUST create an audit report containing:

1. stack and package manager
2. entry points
3. route/screen map
4. current game state model
5. current data model
6. current persistence
7. current asset folders
8. current audio system
9. existing gameplay mechanics
10. code duplication / technical debt
11. reusable components
12. missing fashion modules
13. proposed file-by-file change plan
14. dependencies that truly need installation
15. risk list

Then implement incrementally.

Never replace working code just to match this document's suggested structure.

---

## 28. IMPLEMENTATION PHASES

### Phase 0 — Audit and stabilization
- run project
- fix blocking errors
- document current behavior
- preserve save compatibility if possible
- establish tests for existing core loop

### Phase 1 — Fashion re-skin foundation
- rename game concepts
- new theme tokens
- original fashion icons
- home/town UI
- replace beverage-specific text/assets
- keep existing navigation stable

### Phase 2 — Catalog + variant inventory
- ProductStyle / Colorway / Variant
- size/color matrices
- exact SKU stock
- movement ledger
- seed fashion catalog

### Phase 3 — Store-floor customer loop
- customer intent
- browsing
- size/color requests
- patience
- rack/backroom
- checkout

### Phase 4 — Fitting room + staff
- fitting sessions
- queues
- staff assignments
- recommendations

### Phase 5 — Procurement + end-of-day finance
- suppliers
- POs
- receipts
- daily P&L
- KPI dashboard

### Phase 6 — Returns + promotions
- returns/exchanges
- promotion engine
- loyalty basics

### Phase 7 — Omnichannel + delivery map
- online orders
- reservation
- picking/packing
- delivery/pickup
- map scene

### Phase 8 — Social feed + collections
- game-generated social feed
- lookbook
- outfit recipes
- trends

### Phase 9 — Branches
- branch unlock
- per-branch inventory/P&L
- transfers
- chain dashboard

### Phase 10 — polish
- balance
- audio
- animations
- accessibility
- responsive testing
- save migration
- performance

---

## 29. SEED DATA — MVP

Create at least:
- 8 categories
- 24 styles
- 3–5 colorways per selected core styles
- realistic size runs
- 3 suppliers
- 6 customer archetypes
- 5 promotions
- 8 outfit recipes
- 12 trend events
- 10 missions

Example style:
```json
{
  "id": "style-essential-tee",
  "name": "Essential Tee",
  "categoryId": "tops-tshirt",
  "styleTags": ["basic", "minimal", "casual"],
  "fit": "regular",
  "season": "all-season",
  "baseCost": 90000,
  "basePrice": 229000,
  "colorways": [
    {
      "id": "essential-tee-black",
      "name": "Đen",
      "hex": "#242424",
      "sizes": ["S", "M", "L", "XL"]
    }
  ]
}
```

Do not use this example as production balancing truth.

---

## 30. TEST PLAN

### Unit tests
- exact variant availability
- sale reduces correct SKU only
- reserved units are not double-sold
- returns restock only sellable items
- promotions stack correctly
- sell-through formula
- P&L calculation
- state transition guards
- save migration

### Integration tests
- receive PO → inventory increases
- customer buy → payment + sale + inventory movement
- exchange → old item return + new item sale
- online order → reserve → pick → deliver
- transfer → source decreases/in-transit/destination increases

### UI tests
- mobile viewport no overflow
- inventory matrix usable
- dialogs trap focus
- critical actions have visible feedback
- pause truly pauses timers/spawn

### Regression
- build succeeds
- no duplicate lockfile
- no beverage-domain strings in visible fashion UI after Phase 1
- existing save either migrates or intentionally resets with version notice

---

## 31. PERFORMANCE

Target:
- keep customer simulation separate from React render churn
- avoid re-rendering full shop scene every tick
- use selectors for state store
- cap active NPC count
- recycle simple visual effects
- lazy-load heavy secondary screens/assets
- compress images
- preload only critical scene assets

For large simulations, separate simulation tick from animation frame.

---

## 32. ACCESSIBILITY & UX

- tap targets suitable for mobile
- text not embedded into raster images when it must be dynamic
- color is not the only state indicator
- optional reduced motion
- sound toggle
- music toggle
- clear confirmation for destructive purchase/branch actions
- currency formatted consistently in VND
- inventory numbers readable at a glance

---

## 33. SECURITY / DATA SAFETY

If backend exists:
- server validates prices, payments, stock and progression if anti-cheat matters.
- client never becomes authority for paid economy.
- validate all save/import payloads.
- never trust localStorage strings without schema validation.

If entirely offline/single-player, security can be lighter, but save corruption must still be handled.

---

## 34. COPYRIGHT / ASSET RULE

Use the reference only for:
- interaction model
- hierarchy
- pacing
- layout inspiration
- cozy visual direction

Do not ship:
- reference logo
- reference mascot
- reference product artwork
- copied maps
- copied icon image files
- copied text/branding

Create an original fashion identity and original asset set with a similar level of visual polish.

---

## 35. DEFINITION OF DONE — FASHION MVP

A fashion MVP is complete when the player can:

1. start a new save
2. prepare the store
3. receive clothing/shoe stock by exact SKU variant
4. display stock on the sales floor
5. open the store
6. receive customers with category/size/color/budget intent
7. serve fitting requests
8. sell exact variants at checkout
9. see stock update correctly
10. process at least a basic exchange/return
11. close the day
12. see P&L + core KPI
13. reorder from supplier
14. unlock at least one new category/system
15. save and continue without data loss
16. use the experience comfortably on mobile

Secondary systems (online delivery, social feed, branches) may remain locked until their implementation phase.

---

## 36. ANTIGRAVITY EXECUTION CONTRACT

When executing this specification:

1. Read the repository before editing.
2. Produce `docs/REPO_AUDIT.md`.
3. Produce a minimal change plan.
4. Keep working features intact.
5. Implement vertically: domain → state/service → UI → tests.
6. Never fake completion with static mock cards when the feature requires state changes.
7. Use real in-game data paths after creating them.
8. Install dependencies only after proving a gap.
9. Use the existing package manager.
10. Run formatting/lint/typecheck/tests/build after every meaningful phase.
11. Fix regressions before starting the next phase.
12. Keep balance constants centralized.
13. Keep original fashion assets separate from reference assets.
14. Add TODOs only for genuinely deferred scope and explain why.
15. At the end of each phase, report:
   - files changed
   - dependencies changed
   - business behavior added
   - tests added
   - known remaining gaps

---

## 37. FIRST PROMPT TO RUN IN ANTIGRAVITY

Use this after placing this document and `AGENTS.md` in the repository:

> Audit the existing repository and improve it rather than rebuilding it. Read `AGENTS.md` and `docs/FASHION_SHOP_GAME_SPEC.md`. First create `docs/REPO_AUDIT.md` with the current stack, game loop, state model, assets, persistence, reusable modules, technical debt, and a file-by-file migration plan. Then execute Phase 1 only: convert the visible product/domain language and visual identity to an original fashion shop while preserving current working behavior. Detect the existing package manager and install only dependencies that are truly required. Run lint/typecheck/tests/build and fix errors before finishing. Do not copy third-party artwork from the reference site.

---

## 38. FUTURE EXTENSIONS — NOT MVP

Possible later systems:
- e-commerce storefront
- stylist appointments
- customer memberships
- wholesale/B2B
- private label design studio
- manufacturing
- staff scheduling optimization
- visual planogram editor
- richer franchise contracts
- AI trend forecasting
- AI styling assistant
- cloud saves
- multiplayer leaderboards

Do not introduce these before core retail loop is stable.
