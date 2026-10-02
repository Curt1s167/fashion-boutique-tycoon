# ANTIGRAVITY MASTER SPEC — FASHION RETAIL BUSINESS SIMULATOR

**Version:** 1.0  
**Target:** Google Antigravity working on an **existing project**  
**Domain:** Fashion retail — clothing, footwear, bags, accessories  
**Goal:** A cozy but deep retail-business simulation that teaches store operations through gameplay.

---

## 0. How Antigravity must use this document

This file is the product/business/technical source of truth.

The project already exists. **Improve it incrementally. Do not rebuild it from scratch.**

Mandatory rules:

1. Inspect the repository before changing architecture or installing packages.
2. Detect and keep the existing package manager and lockfile.
3. Never create a second lockfile.
4. Reuse equivalent existing libraries before adding new ones.
5. Preserve working features unless this specification intentionally replaces the behavior.
6. Implement business logic before presentation polish.
7. Fashion inventory is authoritative at exact SKU/variant level.
8. Every inventory change must be traceable.
9. Reviews, traffic, staffing, stock, finance and branches must affect each other.
10. A feature is not complete if it is only a static card/mock.
11. Save/load is core infrastructure and must work across browser/device sessions as specified.
12. Use original fashion artwork/icons. Do not copy reference-game proprietary assets.
13. Keep mobile-first usability.
14. After meaningful changes run the project's formatter, lint, typecheck, tests and build.
15. Fix regressions before continuing to another phase.

---

# 1. First required task: repository audit

Before substantial implementation, create:

`docs/REPO_AUDIT.md`

The audit must include:

### Foundation
- framework and version
- TypeScript/JavaScript
- package manager and lockfile
- build tool
- router
- styling solution
- state management
- animation library
- 2D/game engine
- chart/map libraries
- icon system
- audio system
- testing stack
- local persistence
- backend/API/cloud save

### Existing gameplay
- entry points and routes
- game/day loop
- money/economy
- products/inventory
- purchase/restock
- customers
- patience/queues
- employees
- upgrades
- reviews/ratings/replies
- branches
- delivery
- map
- missions/progression
- save/load

### Classify each subsystem
- `KEEP`
- `REFACTOR`
- `REPLACE`
- `MISSING`

### Risks
- giant components
- duplicated state
- hardcoded game data
- broken domain boundaries
- performance bottlenecks
- save corruption risk
- mobile issues
- untested logic

### Plan
Provide a file-by-file change plan and dependency plan before large edits.

---

# 2. Product vision

The player starts with a small fashion boutique and can eventually manage a national and international retail chain.

The game must teach through **cause and effect**, not textbook lessons.

Examples:

- wrong size distribution causes lost sales even when total inventory is high
- understaffing lowers payroll but creates queues, bad reviews and lower future traffic
- overstaffing increases cost and can make a branch unprofitable
- a high-revenue branch can still lose money because of rent, payroll and discounting
- excessive inventory ties up cash
- poor cleanliness lowers satisfaction
- a good manager improves an entire branch
- opening too many stores can create a cash-flow crisis
- a store concept can succeed in one location and fail in another
- sometimes the right decision is to restructure or close a branch

Player progression:

`Shop Owner → Store Operator → Multi-Store Manager → Retail Executive`

---

# 3. Core gameplay loop

## Daily macro loop

1. **Morning planning**
   - review yesterday KPI
   - inspect stock
   - receive purchase orders
   - refill sales floor
   - choose displays/mannequins
   - configure promotions
   - assign staff and shifts
   - review events/trends
   - open store

2. **Store operation**
   - customers arrive in variable waves
   - browse
   - request products
   - request size/color
   - fitting room
   - cashier queue
   - checkout
   - reviews/complaints
   - online orders if unlocked
   - restock floor
   - clean store
   - handle staff incidents

3. **Closing**
   - stop new arrivals
   - complete active customers
   - calculate sales/cost/profit
   - update reputation
   - create reviews
   - update traffic forecast
   - update staff fatigue/morale
   - update trends/missions
   - autosave
   - show end-of-day report

---

# 4. Recommended technical architecture

For a React/Vite codebase, prefer hybrid rendering:

```text
                  FASHION RETAIL GAME
                         |
             +-----------+-----------+
             |                       |
         React UI                2D Game Scene
             |                       |
 Inventory / HR / Finance        PixiJS or existing
 Reviews / Branch / Maps          Phaser/2D engine
             +-----------+-----------+
                         |
                    Domain Logic
                         |
                     State Layer
                         |
              Persistence / Backend
```

React handles management UI.

PixiJS or the existing 2D engine handles:
- NPC customers
- employees
- store floor
- racks
- fitting rooms
- checkout scene
- floating effects
- vehicle movement
- illustrated world scenes

Do not animate large NPC populations through React DOM every frame.

If Phaser or another engine already exists and is stable, keep it unless migration is clearly justified.

---

# 5. Library installation policy

**Do not blindly install this entire list.**

Antigravity must first inspect `package.json`, lockfile and existing capabilities.

Package-manager detection:

```text
pnpm-lock.yaml     -> pnpm
yarn.lock          -> yarn
package-lock.json  -> npm
bun.lock/bun.lockb -> bun
```

Never generate another lockfile.

---

# 6. Recommended libraries

## 6.1 State — `zustand`

Use for active game/application state:

```text
gameStore
├── timeSlice
├── financeSlice
├── inventorySlice
├── customerSlice
├── employeeSlice
├── reviewSlice
├── orderSlice
├── branchSlice
├── eventSlice
└── progressionSlice
```

Use selectors to minimize rerenders.

Optional: `immer` only when complex immutable transitions become clearer.

---

## 6.2 2D renderer — `pixi.js`

Use if the current project has no suitable 2D engine.

Responsibilities:
- customers
- employees
- shop scene
- object animation
- particles
- visual queues
- delivery animation

Optional: `@pixi/react` only if compatible with the current React version. Do not upgrade React only to satisfy the adapter.

---

## 6.3 Responsive styling — Tailwind CSS

Use if already present or clearly beneficial.

Use for:
- HUD
- panels
- responsive layout
- dialogs
- tables
- forms

Do not ship a generic SaaS/admin visual style. The visible identity remains custom/cozy/game-like.

---

## 6.4 UI primitives — Radix

Install only the primitives actually needed, such as:

```text
@radix-ui/react-dialog
@radix-ui/react-alert-dialog
@radix-ui/react-popover
@radix-ui/react-tooltip
@radix-ui/react-tabs
@radix-ui/react-dropdown-menu
@radix-ui/react-select
@radix-ui/react-slider
```

Use Radix for interaction/accessibility; fully reskin to the game's visual language.

---

## 6.5 UI animation — `motion`

Use for:
- transitions
- panel animation
- money/XP feedback
- rating pulses
- branch unlock
- card/layout transitions

Do not use it as the continuous NPC simulation engine.

---

## 6.6 Drag & drop — dnd-kit

Candidate packages:

```text
@dnd-kit/core
@dnd-kit/sortable
@dnd-kit/utilities
```

Use for:
- shift scheduling
- employee assignment
- store layout
- rack/mannequin arrangement

Every essential drag operation should also have a non-drag fallback.

---

## 6.7 Charts — `echarts`

Use for:
- customer traffic
- revenue/profit
- conversion
- AOV/UPT
- sell-through
- stockout
- payroll
- employee productivity
- branch comparison
- marketing ROI

---

## 6.8 Map — `maplibre-gl`

Use for:
- Vietnam branch map
- international expansion
- branch markers
- regional status
- city drill-down

If an illustrated cozy map is more appropriate, use SVG/GeoJSON/Pixi and keep real geography where needed.

---

## 6.9 Persistent local database — `dexie`

Use IndexedDB through Dexie for:
- save slots
- branches
- employees
- inventory
- sales
- inventory movements
- reviews
- KPI history
- customers
- events
- settings

Optional:
`dexie-react-hooks`

Do not use `localStorage` as the authoritative main save database.

---

## 6.10 Validation — `zod`

Use for:
- save schema
- migrations
- product data
- event data
- imported data
- configuration validation
- form validation where appropriate

---

## 6.11 Audio — `howler`

Use for:
- music
- register sounds
- barcode scan
- stock receipt
- notification
- reviews
- branch opening
- achievements

Persist volume/mute settings.

---

## 6.12 Server/cloud state — `@tanstack/react-query`

Use only when backend/server state exists.

Use for:
- cloud save
- account
- remote configuration
- server events
- leaderboard/API

Do not replace game state with Query.

---

## 6.13 Forms — `react-hook-form`

Optional:
`@hookform/resolvers`

Use for complex forms such as:
- hiring
- purchase orders
- branch opening
- campaigns
- promotion setup

---

## 6.14 Large data views — optional

`@tanstack/react-table`

For:
- inventory
- employees
- transactions
- branch P&L

`@tanstack/react-virtual`

For very large lists.

Install only when actual data size justifies them.

---

## 6.15 IDs — optional `nanoid`

Use only if no ID strategy already exists.

---

## 6.16 PWA — optional `vite-plugin-pwa`

Only after persistence is correct.

PWA/offline asset caching does **not** replace save persistence.

---

# 7. Suggested install groups

These are suggestions, not commands that must all be executed.

### Foundation
```text
zustand
zod
motion
pixi.js
```

### UI behavior
```text
@radix-ui/react-dialog
@radix-ui/react-alert-dialog
@radix-ui/react-popover
@radix-ui/react-tooltip
@radix-ui/react-tabs
@radix-ui/react-dropdown-menu
@radix-ui/react-select
@radix-ui/react-slider
```

### HR / scheduling
```text
@dnd-kit/core
@dnd-kit/sortable
@dnd-kit/utilities
```

### Analytics
```text
echarts
```

### Save
```text
dexie
zod
```

### Audio
```text
howler
```

### Map
```text
maplibre-gl
```

### Backend/cloud
```text
@tanstack/react-query
react-hook-form
@hookform/resolvers
```

After changes run all available:
- formatter
- lint
- typecheck
- unit tests
- integration tests
- build

---

# 8. Fashion product domain

Fashion inventory must be variant-aware.

Hierarchy:

```text
ProductStyle
  -> ProductColorway
      -> ProductVariant / SKU
```

Example:

```text
Essential Tee
  Black
    S
    M
    L
    XL
```

Each variant contains:
- `variantId`
- `sku`
- `barcode`
- `styleId`
- `colorwayId`
- `sizeId`
- `costPrice`
- `retailPrice`
- `supplierId`
- status
- inventory by location
- sales history
- return history

Never decrement stock only at style level.

---

# 9. Product taxonomy

Minimum categories:
- T-shirt
- Shirt / Blouse
- Polo
- Hoodie / Sweater
- Jeans / Trousers
- Shorts
- Skirt
- Dress
- Jacket
- Blazer
- Coat
- Sneakers
- Loafers
- Sandals
- Heels
- Boots
- Bags
- Hats
- Belts
- Scarves
- Jewelry
- Socks

Metadata:
- style tags
- fit
- material
- season
- collection
- occasion
- price band
- brand
- supplier
- trend score

---

# 10. Size system

Normalize sizes.

Apparel:
- XS
- S
- M
- L
- XL
- XXL

Numeric apparel:
- 26–38 etc.

Footwear:
- EU size range

Accessories:
- One Size where appropriate

Create `SizeOption` with:
- code
- displayName
- category
- sortOrder

Do not compare arbitrary raw size strings across the codebase.

---

# 11. Inventory

For each:

`variantId + inventoryLocationId`

track:
- `onHand`
- `reserved`
- `damaged`
- `inTransit`

Derived:

```text
availableToSell = max(0, onHand - reserved - damaged)
```

Locations:
- sales floor
- store backroom
- central warehouse
- branch warehouse
- in transit
- damaged/quarantine

---

# 12. Inventory movement ledger

Every stock change creates a traceable movement:

- PURCHASE_RECEIPT
- FLOOR_REPLENISHMENT
- SALE
- ONLINE_RESERVATION
- RESERVATION_RELEASE
- CUSTOMER_RETURN
- RETURN_DAMAGED
- TRANSFER_OUT
- TRANSFER_IN
- STOCK_ADJUSTMENT
- SHRINKAGE
- DISPLAY_SAMPLE
- WRITE_OFF

Never silently modify stock.

---

# 13. Sales floor vs backroom

Example:

```text
Black Tee / M
Backroom: 8
Sales floor: 0
```

The store technically owns stock, but the customer may still fail to buy if:
- no employee helps
- replenishment is slow
- patience expires

This is intentional operational gameplay.

---

# 14. Suppliers and procurement

Supplier data:
- category coverage
- MOQ
- lead time
- reliability
- defect rate
- wholesale cost
- payment terms
- exclusivity
- trendiness
- unlock level

PO lifecycle:

```text
DRAFT
-> SUBMITTED
-> CONFIRMED
-> PARTIALLY_RECEIVED
-> RECEIVED
-> CLOSED
```

Alternative:
`CANCELLED`

Receiving stock must:
- validate quantities
- create inventory
- create movement records
- handle defects
- update cash/payables according to game rules

---

# 15. Customer simulation

Customer archetypes:
- student
- office worker
- trend hunter
- sneaker fan
- budget shopper
- premium/VIP
- tourist
- influencer
- deal seeker
- loyal regular

Customer intent:
- target category
- style preference
- color
- size
- budget
- trend sensitivity
- promo sensitivity
- patience
- service need
- willingness to substitute
- channel

---

# 16. Customer state machine

```text
SPAWNING
-> ENTERING
-> BROWSING
-> REQUESTING
-> FITTING (optional)
-> DECIDING
-> QUEUEING
-> CHECKOUT
-> EXITING
-> COMPLETED
```

Failure:
`ABANDONED`

Causes:
- wrong/missing size
- missing color
- long fitting wait
- long checkout wait
- poor service
- price mismatch
- low patience

---

# 17. Customer satisfaction

Concept:

```text
Satisfaction =
base
+ service quality
+ exact-match bonus
+ fitting success
+ promotion value
+ ambience
+ cleanliness
- wait penalty
- stockout penalty
- wrong recommendation
- checkout delay
```

Keep balance constants centralized.

---

# 18. Variable daily customer traffic

Customer volume must differ each day and may rise or fall.

Do not make traffic grow automatically with level.

Suggested model:

```text
DailyTraffic =
BaseMarketPotential
* BranchAwareness
* Reputation
* ServiceQuality
* StockAvailability
* ProductDemand
* MarketingEffect
* EventModifier
* Seasonality
* CompetitionModifier
* RandomVariation
```

Recent performance must affect future traffic.

Maintain rolling indicators:
- recent review score
- satisfaction
- abandonment
- stockout
- average queue time
- conversion

Good operation:
`better reviews -> reputation up -> more future traffic`

Poor operation:
`bad service -> bad reviews -> reputation down -> fewer future customers`

---

# 19. Fitting rooms

Flow:

```text
REQUEST_FITTING
-> WAIT
-> ENTER
-> TRY_ON
-> KEEP / REQUEST_OTHER_SIZE / REJECT
```

Track:
- capacity
- queue
- cleanliness
- average wait

Staff can:
- bring another size
- recommend an alternative
- collect abandoned items

---

# 20. Checkout / POS

Checkout must atomically:

1. validate exact SKU
2. calculate price
3. apply promotion
4. apply loyalty/coupon if used
5. record payment abstraction
6. create sale/order lines
7. create stock movement
8. update inventory
9. update KPI
10. update customer history
11. autosave

Payment abstractions:
- cash
- card
- QR/e-wallet

---

# 21. Promotions

Support:
- percentage discount
- fixed discount
- category discount
- style discount
- buy X get Y
- outfit bundle
- threshold discount
- member discount
- coupon
- clearance markdown

Define stacking and priority rules.

---

# 22. Returns and exchanges

Flow:

```text
REQUESTED
-> ELIGIBILITY_CHECK
-> INSPECTED
-> APPROVED / REJECTED
-> REFUNDED / EXCHANGED
-> CLOSED
```

Inspection:
- SELLABLE
- NEEDS_REPACK
- DAMAGED
- NON_RESELLABLE

Only sellable returns go back to ATS.

Track reasons:
- wrong size
- wrong color
- defect
- changed mind
- wrong fulfillment

---

# 23. Reviews and merchant replies

Customers can create star ratings and text reviews.

Review categories:
- product
- service
- fitting room
- stock availability
- cleanliness
- delivery
- wrong size
- checkout wait

Reviews affect:
- branch reputation
- future traffic
- loyalty
- local perception

Player can reply:
- thank customer
- apologize
- explain
- offer voucher
- exchange
- resolution/refund

A good reply can partially recover reputation/loyalty, but it must not magically remove underlying operational problems.

---

# 24. Persistent customer history

Some customers persist.

Store:
- visits
- purchases
- lifetime value
- preferred styles
- sizes
- categories
- loyalty
- reviews
- returns
- last branch

Loyal customers can return more often and react to repeated service quality.

---

# 25. Employee roles

Minimum:
- Store Manager
- Assistant Manager
- Sales Advisor
- Cashier
- Stock Associate
- Fitting Room Assistant
- Cleaning Staff
- Online Fulfillment Staff

Later:
- Regional Manager
- Warehouse Staff

---

# 26. Employee model

Skills:
- salesSkill
- customerService
- fashionKnowledge
- cashierSkill
- inventorySkill
- cleaningSkill
- leadership
- reliability
- speed
- accuracy

Dynamic:
- wage
- morale
- energy
- stress
- loyalty
- attendance
- fatigue
- performance
- training
- experience

Do not represent employees only as a single level number.

---

# 27. Store Manager

Manager attributes:
- leadership
- scheduling
- inventory control
- service management
- staff development
- cost control
- crisis handling
- reliability

Strong manager:
- better scheduling
- lower bottlenecks
- better morale
- better replenishment
- lower shrinkage
- faster incident resolution

Weak manager:
- bad shifts
- overtime
- poor morale
- inventory mistakes
- lower service
- lower branch profit

---

# 28. Shift scheduling

Support:
- day/week view
- role coverage
- employee availability
- demand forecast
- labor cost
- overtime
- understaffing/overstaffing warnings

Example:

```text
Employee   08-12   12-16   16-22
Lan          X       X
Hung                 X       X
Mai          X
Nam                          X
```

Traffic varies by hour.

Understaffing at peak:
- queue up
- fitting wait up
- abandonment up
- review score down

Overstaffing:
- payroll efficiency down

This must be a real management tradeoff.

---

# 29. Workload / overtime / leave

Game-friendly abstraction:
- regular hours
- break
- days off
- overtime
- sick leave
- leave

Repeated overtime:

```text
energy down
stress up
morale down
mistakes up
resignation chance up
```

---

# 30. Cleaning staff

Track:
- overall cleanliness
- sales floor cleanliness
- fitting room cleanliness
- display cleanliness
- restroom cleanliness if included

Traffic decreases cleanliness.

Cleaning staff restores standards.

Poor cleanliness:
- satisfaction down
- reviews down
- premium conversion down
- morale down

Cleaning staff must be functional, not cosmetic.

---

# 31. Store upgrades

Examples:
- store size
- rack capacity
- better fixtures
- fitting rooms
- POS capacity
- backroom
- employee facilities
- cleaning equipment
- lighting
- decoration
- security
- packing station

Upgrades must improve measurable systems.

---

# 32. Visual merchandising

Support:
- window display
- mannequin outfits
- new arrivals
- category zoning
- sale zone
- footwear wall
- accessories zone

Effects:
- discovery
- bundle chance
- category demand
- branch appeal

---

# 33. City/market expansion

Unlock a business map as the chain grows.

Map shows:
- cities
- branch count
- revenue
- profit
- warnings
- opportunities

City data is a **game simulation profile** unless explicitly sourced from factual datasets.

Possible `CityMarketProfile` fields:

- marketPotential
- footTrafficIndex
- averageSpendIndex
- priceSensitivity
- studentDemand
- officeDemand
- tourismDemand
- premiumDemand
- onlineShoppingIndex
- rentIndex
- wageIndex
- logisticsCost
- competitionIndex
- growthPotential
- streetwearDemand
- basicDemand
- officeWearDemand
- footwearDemand
- luxuryDemand
- accessoriesDemand
- seasonality

---

# 34. Location archetypes

Within a city:

- student district
- office district
- mall
- tourist district
- residential district
- premium downtown
- transit-heavy area

One concept can succeed in one location and fail in another.

Expansion must not guarantee success.

---

# 35. Branch lifecycle

```text
MARKET_RESEARCH
-> SITE_SELECTION
-> LEASE
-> SETUP
-> RECRUITMENT
-> INVENTORY_SETUP
-> GRAND_OPENING
-> OPERATING
```

Later:
- RESTRUCTURING
- TEMPORARILY_CLOSED
- CLOSING
- CLOSED

Opening cost can include:
- deposit
- renovation
- fixtures
- inventory
- recruitment
- opening marketing
- working capital

---

# 36. Branch P&L

Track per branch:
- gross sales
- discounts
- net sales
- refunds
- COGS
- gross profit
- payroll
- rent
- utilities
- marketing
- logistics
- maintenance
- shrinkage
- operating profit

High revenue does not guarantee profit.

---

# 37. Branch failure

Possible causes:
- poor location
- high rent
- bad assortment
- bad manager
- excessive payroll
- poor reviews
- low awareness
- wrong size mix
- strong competition
- market downturn
- poor inventory allocation

Player actions:
- replace/train manager
- change assortment
- change staffing
- adjust shifts
- transfer inventory
- marketing
- renovate
- reduce scale
- temporarily close
- permanently close

Sometimes closing a bad branch is the correct decision.

---

# 38. Cross-branch transfer

Transfer lifecycle:

```text
DRAFT
-> REQUESTED
-> PICKING
-> IN_TRANSIT
-> RECEIVED
```

Consider:
- transfer cost
- transfer time
- source future demand
- destination stockout/lost-sales risk

---

# 39. Central warehouse

Unlock as the chain grows:

```text
Supplier
-> Central Warehouse
-> Branch Backroom
-> Sales Floor
-> Customer
```

Possible systems:
- capacity
- receiving
- outbound
- accuracy
- backlog
- staffing

---

# 40. Fashion lifecycle / dead stock

Product lifecycle:

```text
Launch -> Growth -> Peak -> Decline -> Clearance
```

Overbuy:
- dead stock
- tied-up cash
- markdown

Underbuy:
- lost sales
- stockout

---

# 41. Markdown / pricing

Support staged markdown.

Tradeoff:
- discount up -> conversion often up
- margin down

Track:
- full-price sell-through
- markdown rate
- clearance recovery

Different customer segments have different price sensitivity.

---

# 42. Marketing

Campaign types:
- grand opening
- new collection
- influencer
- member day
- flash sale
- back-to-school
- holiday
- online campaign
- loyalty voucher

Track:
- budget
- target
- reach
- awareness
- conversion
- revenue
- customer acquisition cost abstraction
- ROI

Marketing may fail.

---

# 43. Fashion/social feed

Simulated feed:
- new drop
- outfit inspiration
- customer review
- influencer mention
- sale campaign
- store opening
- complaint
- sold-out trend

Effects:
- awareness
- traffic
- demand
- reputation

Do not build a real social network for MVP.

---

# 44. Event / crisis engine

Staff:
- absence
- resignation
- conflict
- burnout

Supplier:
- delay
- price increase
- defect
- shortage

Store:
- POS issue
- equipment issue
- maintenance
- unexpected crowd

Customer:
- VIP
- influencer
- viral complaint
- large return

Inventory:
- discrepancy
- shrinkage
- damage
- bestseller stockout

Market:
- new competitor
- rent increase
- seasonal demand
- local event
- demand slowdown

Most probabilities should have understandable modifiers.

Example:

```text
low maintenance -> failure probability up
high staff stress -> absence/resignation probability up
```

Avoid unfair pure randomness.

---

# 45. Chain-level crises

Later:
- warehouse delay affecting multiple branches
- supplier recall
- brand reputation incident
- logistics disruption
- regional demand shift
- failed national campaign

Gameplay should evolve from serving individual customers to executive decisions.

---

# 46. Finance and cash flow

Track progressively:

Basic:
- cash
- revenue
- profit

Advanced:
- gross sales
- net sales
- discounts
- refunds
- COGS
- gross profit
- payroll
- rent
- utilities
- marketing
- logistics
- maintenance
- shrinkage
- operating profit
- inventory value
- working capital abstraction

**Cash is not profit.**

Purchasing too much inventory or opening too many branches can create cash-flow problems even when accounting profit appears positive.

---

# 47. Retail KPI

Track:
- Revenue
- Net Sales
- Gross Margin
- Operating Profit
- AOV
- UPT
- Conversion Rate
- Sell-Through
- Full-Price Sell-Through
- Return Rate
- Stockout Rate
- Abandonment Rate
- Inventory Turnover
- Weeks/Days of Cover
- Markdown Rate
- Sales by Category
- Sales by Style
- Sales by Color
- Sales by Size
- Employee Productivity
- Customer Satisfaction
- Reputation
- Repeat Rate
- Branch Productivity

Allow drill-down.

---

# 48. Business Advisor

Create a data-driven advisor.

Start rule-based/deterministic.

It must explain actual game data.

Example:

```text
Traffic +8%
Conversion -9%
Footwear stockout 38%
Checkout wait +22%
Recent review score 3.4

Conclusion:
Demand exists, but operations are failing to convert traffic.
```

Suggested actions:
- rebalance size inventory
- add peak-hour cashier
- improve fitting capacity
- train/replace manager

Do not invent a cause that the data does not support.

---

# 49. Educational UX

Do not present lessons like a textbook.

Use:
- "Why?" buttons
- advisor explanations
- charts
- end-of-day insights
- trend arrows
- root-cause breakdown

Example:

```text
Revenue +18%
Profit -4%

Why?
Discount cost +11%
COGS +4%
Return cost +6%
```

---

# 50. International expansion

Later markets can vary by:
- local demand
- rent/wage indices
- average spend
- competition
- brand awareness
- logistics
- currency abstraction
- local trends

International expansion must not simply multiply revenue.

---

# 51. Soft failure

If cash is critical, allow recovery:
- stop expansion
- close branch
- liquidate stock
- reduce procurement
- reduce marketing
- restructure staff
- optional business loan

Severe failure can lead to bankruptcy, but recovery choices should usually exist.

---

# 52. Data-driven game architecture

Do not bury content in UI components.

Suggested data folders:

```text
data/
├── cities/
├── market-archetypes/
├── products/
├── variants/
├── suppliers/
├── employee-roles/
├── customer-segments/
├── trends/
├── events/
├── promotions/
├── missions/
├── upgrades/
├── progression/
└── economy-balance/
```

Adding products/cities/events should not require rewriting core logic.

---

# 53. Save game is mandatory

Player data must survive:
- closing tab
- closing browser
- restarting computer
- returning days later

Manual Save alone is not acceptable.

---

# 54. Save architecture

Preferred:

```text
Game State
   |
Save Service
   |
   +-> Zod validation
   |
   +-> Dexie / IndexedDB
   |
   +-> Cloud Sync (optional later)
```

IndexedDB is the main local persistence layer.

---

# 55. What must be persisted

Player:
- business name
- level
- XP
- unlocks

World:
- day
- simulation time
- trends
- events

Finance:
- cash
- financial summaries

Branches:
- locations
- upgrades
- manager
- staff
- reputation
- P&L

Employees:
- role
- wage
- skills
- morale
- energy
- stress
- loyalty
- shifts
- training

Inventory:
- exact SKU quantities
- reserved
- damaged
- in transit

Procurement:
- suppliers
- PO
- shipments

Sales:
- active orders
- summaries/history

Customers:
- persistent customers
- loyalty/preferences

Reviews:
- reviews
- replies
- resolution

Progression:
- missions
- achievements
- unlocks

Settings:
- audio
- accessibility
- language
- graphics preferences if used

---

# 56. Active vs historical state

Do not load huge history into Zustand.

Active state:
- current day
- active branch
- active customers
- current staff
- active orders
- current cash

Dexie/history:
- past sales
- inventory movements
- reviews
- customer history
- KPI history
- financial reports
- event history

Query only when needed.

---

# 57. Autosave

Save immediately after important transactions:
- sale
- return
- exchange
- PO receipt
- hire/fire
- schedule update
- upgrade
- branch open/close
- transfer
- promotion launch
- end of day
- mission reward

Also save periodically at a reasonable interval.

Never save every frame.

---

# 58. Exit safety

Do not rely on `beforeunload` as the main save mechanism.

Browsers may terminate without finishing async work.

Persist during gameplay.

Optionally flush a lightweight checkpoint when visibility changes where safe.

---

# 59. Save versioning and migration

Every save needs:
- `saveVersion`
- `gameVersion`
- `createdAt`
- `updatedAt`

Load flow:

```text
Read
-> Detect Version
-> Migrate
-> Validate
-> Load
```

Create explicit:
- v1 -> v2
- v2 -> v3
- etc.

Migration must be tested.

---

# 60. Save backup and recovery

Maintain:
- current save
- recent backup
- emergency backup

If the newest save is invalid:
- do not overwrite backups
- offer recovery

---

# 61. Save slots

Support multiple campaigns.

Example:

```text
Slot 1
Fashion Empire
Day 184
12 branches

Slot 2
My Boutique
Day 26
1 branch

Slot 3
Empty
```

---

# 62. Manual Save

Pause menu:
- Continue
- Save Game
- Load Game
- Settings
- Exit

Manual Save creates a checkpoint.

---

# 63. Save indicator

Use subtle feedback:
- `Saving...`
- `Saved`
- `Saved 5 seconds ago`

No modal spam.

---

# 64. Atomic business transactions

Critical operations must be all-or-nothing.

Checkout:

```text
Validate exact SKU
-> Price
-> Promotion
-> Payment abstraction
-> Sale
-> Inventory movement
-> KPI
-> Commit/save
```

Never allow partial inconsistent state.

---

# 65. Resume during active day

Save semantic simulation state:
- customer ID
- customer state
- cart
- queue
- patience
- current service task

Do not persist:
- particle frame
- floating-text frame
- unnecessary animation state

Visual positions can be reconstructed where appropriate.

---

# 66. Cloud save — later

Architecture:

```text
Local IndexedDB
<-> Sync Service
<-> Backend
```

Offline:
- continue playing

Online:
- sync

Conflict:
- show local/cloud timestamps
- never silently overwrite newer progress

---

# 67. UI visual direction

Target:
- cozy
- playful
- rounded
- warm outlines
- fashion illustration
- tactile buttons
- compact game HUD
- strong animation feedback
- mobile-first

Avoid a sterile admin-dashboard look.

---

# 68. Original icon set

Core icons should be original:

UI:
- pause
- settings
- calendar
- save

Fashion:
- shirt
- pants
- dress
- sneaker
- heel
- bag
- hat
- hanger

Store:
- rack
- mannequin
- fitting room
- cashier
- barcode
- warehouse
- delivery

Business:
- branch
- employee
- manager
- shift
- money
- reputation
- review
- warning
- analytics

Generic icon libraries are acceptable for minor utility controls only.

---

# 69. Required main screens

1. Home / Business Overview
2. Store Floor
3. Inventory
4. Catalog
5. Procurement
6. Suppliers
7. Staff
8. Shift Scheduler
9. POS / Checkout
10. Fitting Management
11. Reviews
12. Marketing
13. Finance
14. End-of-Day Report
15. Business Map
16. Branch Detail
17. Branch Comparison
18. Warehouse
19. Transfers
20. Fashion Feed
21. Collection / Lookbook
22. Missions
23. Save Slots
24. Settings

Unlock progressively.

---

# 70. End-of-day report

Show:
- customer count
- orders
- conversion
- revenue
- gross profit
- operating profit
- refunds
- best product
- worst stockout
- top employee
- service bottleneck
- new reviews
- reputation change
- mission progress

Include `Why?` insights.

---

# 71. Performance requirements

- separate simulation from React rendering where needed
- use state selectors
- avoid full-app rerenders
- cap active visual NPCs
- object pooling where useful
- lazy-load heavy screens
- compress images
- query historical data on demand
- virtualize very large tables
- debounce non-critical writes/calculations safely

---

# 72. Accessibility

- mobile-sized tap targets
- keyboard-accessible dialogs
- focus management
- status not conveyed by color alone
- reduced-motion option
- music/SFX controls
- readable number formatting
- responsive text/layout

---

# 73. Testing

Reuse existing test tools.

If missing and appropriate:
- Vitest
- React Testing Library
- Playwright

Do not install without need.

Required unit coverage:

Inventory:
- ATS
- exact SKU sale
- reservation
- damaged inventory
- transfers
- returns

Pricing:
- promotions
- stacking
- markdown

Customer:
- satisfaction
- abandonment
- traffic

HR:
- shift coverage
- overtime
- fatigue/stress
- manager effects

Finance:
- gross profit
- operating profit
- cash changes

Persistence:
- schema
- migration
- recovery
- backup

Integration tests:
- PO receipt -> inventory
- sale -> money + inventory + KPI
- return -> refund + inventory
- exchange -> old + new SKU
- review -> reputation
- reply -> recovery effect
- poor operation -> future traffic down
- good operation -> future traffic up
- understaffing -> queues/service down
- transfer -> source/in-transit/destination
- branch closure -> inventory/staff/finance
- save -> reload -> equivalent business state

---

# 74. Implementation phases

## Phase 0 — Audit and stabilization
- run project
- create `docs/REPO_AUDIT.md`
- fix blockers
- understand save
- baseline tests

## Phase 1 — Fashion identity
- fashion naming
- original visual identity
- home/HUD
- remove visible beverage-domain content
- preserve working navigation

## Phase 2 — Catalog + exact SKU inventory
- styles
- colorways
- sizes
- variants
- inventory locations
- movement ledger

## Phase 3 — Customer retail loop
- traffic
- browsing
- exact product requests
- patience
- checkout

## Phase 4 — Fitting + reviews
- fitting rooms
- review creation
- merchant replies
- satisfaction/reputation

## Phase 5 — HR
- roles
- skills
- Store Manager
- cleaner
- morale/stress
- training

## Phase 6 — Shift scheduling
- schedules
- demand coverage
- overtime
- staffing effects

## Phase 7 — Procurement + finance
- suppliers
- PO
- receipts
- COGS
- P&L
- KPI
- cash flow

## Persistence hardening
Persistence infrastructure begins early. By this point complete:
- Dexie/IndexedDB
- autosave
- slots
- backups
- migrations
- recovery

## Phase 8 — Marketing + lifecycle
- trends
- campaigns
- markdown
- social feed

## Phase 9 — Multi-branch
- cities
- branch opening
- branch demand
- branch P&L
- manager assignment
- branch failure/closure

## Phase 10 — Transfer + warehouse
- transfers
- central warehouse
- supply chain

## Phase 11 — Vietnam business map
- city markers
- branch drill-down
- warning/health state

## Phase 12 — International
- country/market profiles
- logistics
- international expansion

## Phase 13 — Business Advisor
- deterministic root-cause analysis
- recommendations

## Phase 14 — Polish
- balance
- audio
- animation
- performance
- accessibility
- full QA

---

# 75. Definition of Done — core game

Core is complete only when the player can:

1. create/load a save
2. prepare shop
3. purchase exact SKU stock
4. replenish floor
5. open shop
6. receive variable traffic
7. serve size/color/category needs
8. use fitting rooms
9. checkout exact variants
10. receive customer reviews
11. reply to reviews
12. hire employees
13. assign roles
14. create shifts
15. use cleaning staff
16. see staffing affect operations
17. close day
18. see P&L/KPI
19. reorder
20. upgrade shop
21. autosave
22. close/reopen game without losing progress

---

# 76. Definition of Done — multi-branch

Chain layer is complete only when the player can:

1. research a market
2. open a branch
3. hire its staff
4. appoint manager
5. see local traffic/demand
6. see branch P&L
7. experience underperformance
8. intervene
9. transfer stock
10. restructure/close branch
11. view stores on the business map
12. save/reload the whole chain

---

# 77. Quality gate

A feature is NOT complete if:
- static only
- disconnected from authoritative state
- no persistence where required
- no validation
- no failure path
- no business effect
- breaks mobile
- bypasses inventory/financial rules

---

# 78. Feature implementation order

For every feature, follow:

```text
Business Goal
-> Actor
-> State
-> Business Rules
-> Data Model
-> Validation
-> Domain Service
-> Persistence
-> UI Flow
-> Error Handling
-> KPI/Analytics
-> Tests
-> Documentation
```

Do not start from visuals and invent the business model afterward.

---

# 79. First prompt for Antigravity

Place this file at:

`docs/ANTIGRAVITY_FASHION_RETAIL_MASTER_SPEC.md`

Then run:

> Read `docs/ANTIGRAVITY_FASHION_RETAIL_MASTER_SPEC.md` completely. This is an existing game project: improve it instead of rebuilding it. First inspect the repository, package.json and lockfile and create `docs/REPO_AUDIT.md` covering the stack, architecture, game loop, state, persistence, assets, tests, reusable modules, technical debt, missing fashion modules and a file-by-file migration plan. Reuse equivalent dependencies already present and never create a second lockfile. Implement Phase 0 and Phase 1 only. Preserve working behavior, add tests for changed business behavior, and run formatter/lint/typecheck/tests/build. Use original fashion assets rather than copying reference-game proprietary artwork.

---

# 80. Prompt for catalog/inventory/customer work

> Continue from the master specification. Implement Phase 2 and Phase 3 vertically. Fashion inventory must be tracked by exact SKU/variant including size/color. Every stock change creates a movement record. Completed sales atomically update sale, inventory and KPI. Add tests before moving to advanced features.

---

# 81. Prompt for HR

> Implement the HR/store-operations systems from the master specification: Store Manager, Assistant Manager, Sales Advisor, Cashier, Stock Associate, Fitting Room Assistant and Cleaning Staff; skills, wage, morale, energy, stress, performance and training; demand-based shift scheduling; overtime/fatigue; cleanliness; and manager effects. Ensure staffing decisions measurably affect queue time, satisfaction, reviews, traffic and branch P&L.

---

# 82. Prompt for persistence

> Harden persistence according to the master specification. Reuse the current persistence layer if it already satisfies requirements; otherwise use Dexie/IndexedDB plus Zod. Implement autosave after important business transactions, multiple save slots, save metadata, schema versioning, explicit migrations, backup snapshots, corrupted-save recovery and save/reload tests. Do not rely on beforeunload. Keep large historical records outside the active React state.

---

# 83. Prompt for branches/map

> Implement multi-branch expansion from the master specification: data-driven city/market profiles, site selection, branch lifecycle, branch P&L, manager assignment, local traffic/demand, reviews, transfers, underperformance, restructuring and closure. Growth must not be guaranteed. Then implement the Vietnam business map and branch drill-down. Treat city parameters as simulation values unless based on an explicit real dataset.

---

# 84. Final product standard

The final game should feel like:

**a real fashion retail business simulation hidden inside an approachable cozy management game.**

The player should learn through play:
- why customers increase/decrease
- why reviews matter
- why replies help but cannot replace good operations
- why staffing/shift design matters
- why manager quality matters
- why size/color inventory matters
- why cleanliness matters
- why revenue differs from profit
- why cash differs from profit
- why marketing can fail
- why some branches should close
- why expansion must fit the market
- why a large chain requires management systems rather than endless manual clicking
