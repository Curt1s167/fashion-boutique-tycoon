# ANTIGRAVITY IMPLEMENTATION ADDENDUM
# INTERACTIVE FASHION WORKSTATION UI + TOUCH GAMEPLAY

Version: 1.0
Priority: HIGH
Applies with:
- docs/ANTIGRAVITY_FASHION_RETAIL_MASTER_SPEC.md
- docs/ANTIGRAVITY_MANUAL_STOREPLAY_DAY_CYCLE_SPEC.md

## 1. Target experience

Implement the main store gameplay as a portrait, touch-first **Interactive Workstation**.

Do NOT assume the player must control a free-roaming avatar.

The desired interaction is:
Customer request
→ tap category/rack
→ select exact product
→ select color
→ select size
→ place on preparation table/customer hold
→ fitting when required
→ customer decides
→ checkout
→ payment success
→ only then recognize money/revenue.

This should feel like directly operating a fashion counter/shop rather than clicking "Sell" in an inventory dashboard.

## 2. Existing-project-first rule

Before editing:

1. Read package.json.
2. Detect lockfile/package manager.
3. Identify React/Vue/Svelte/etc.
4. Identify current state library.
5. Identify current game/canvas renderer.
6. Identify current CSS system.
7. Identify existing save layer.
8. Identify current customer/order/checkout state.
9. Create/update docs/REPO_AUDIT.md.
10. Reuse equivalents before installing packages.

Never create a second lockfile.

## 3. Dependency policy

If React/Vite is confirmed and equivalent libraries are absent, preferred packages are:

Core immediate:
- pixi.js
- zustand
- motion
- zod
- dexie
- howler

Only add as needed:
- @dnd-kit/core
- @dnd-kit/sortable
- @dnd-kit/utilities
- echarts
- maplibre-gl
- @tanstack/react-query
- react-hook-form
- @hookform/resolvers

Do NOT install every package blindly.

If the repository already uses Phaser, Redux, MobX, XState, Framer Motion, another IndexedDB wrapper, or another appropriate engine, reuse it unless migration is justified in REPO_AUDIT.md.

Package manager:
- pnpm-lock.yaml -> pnpm
- yarn.lock -> yarn
- package-lock.json -> npm
- bun.lock/bun.lockb -> bun

After dependency changes:
- format
- lint
- typecheck
- test
- build

## 4. Portrait logical viewport

Use a logical portrait design coordinate system.

Recommended:
- 1080 × 1920 logical units
or
- an equivalent 9:16 coordinate space already used by the project.

Requirements:
- game viewport width 100%
- portrait aspect ratio 9:16
- centered on wide screens
- no dependence on one specific phone resolution
- safe-area support
- mobile-first touch targets

Do NOT position interaction hotspots using raw browser-screen pixel values.

Scene objects and hotspots must use logical coordinates transformed by the viewport scale.

## 5. Layer architecture

Preferred architecture in React projects:

GameViewport
├── GameCanvas / Pixi renderer
│   ├── BackgroundLayer
│   ├── FurnitureLayer
│   ├── ProductLayer
│   ├── InteractionLayer
│   ├── CharacterLayer
│   └── SceneEffectLayer
├── HudOverlay
├── CustomerRequestOverlay
├── TutorialOverlay
├── FloatingFeedbackLayer
└── DialogLayer

Canvas/renderer handles:
- illustrated store
- racks
- product sprites
- fitting room
- backroom
- POS
- scene effects

React/DOM overlay handles:
- day/time
- money
- reputation
- customer request text
- patience
- step/tutorial
- dialogs
- management overlays

Text that must remain readable should normally stay in DOM/React rather than being baked into raster artwork.

## 6. Main screen composition

Top HUD:
- pause
- settings
- day
- in-game time
- cash
- today's paid revenue
- branch
- reputation

Customer request block:
- avatar
- request sentence
- product thumbnail
- requested color
- requested size
- patience bar

Tutorial/current step:
- compact banner
- example: "Bước 1: Chạm Kệ Áo"

Interactive scene:
- category racks
- products
- backroom
- preparation table
- fitting room
- cashier/POS

Bottom/secondary navigation should not obscure the scene.

## 7. Fashion interaction flow

Example request:
"Cho chị áo sơ mi trắng size M và quần jeans xanh size 29."

Flow:

1. Customer request generated.
2. CustomerRequestOverlay renders exact requirements.
3. CurrentTask selects first unresolved request line.
4. Highlight the appropriate rack.
5. Player taps rack.
6. Rack product chooser opens.
7. Player selects style.
8. Player selects color.
9. Player selects size.
10. Validate exact variant availability.
11. Allocate one exact SKU.
12. Place item into player/preparation allocation.
13. Mark request line as prepared.
14. Repeat remaining lines.
15. Send items to customer/fitting.
16. Customer accepts/rejects/requests another size.
17. Accepted items move to customer cart reservation.
18. Customer queues at POS.
19. Checkout/payment.
20. Only PAYMENT_SUCCESS creates recognized sale/revenue.

## 8. Exact SKU rule

A request such as:
- White Shirt / M
is NOT fulfilled by:
- White Shirt / L
unless the customer explicitly accepts an alternative.

A shoe request:
- Sneaker White/Green / EU39
must not be fulfilled by EU38 or EU40 without alternative acceptance.

Inventory must remain variant-aware.

## 9. Interactive hotspot model

Use explicit data for touch regions.

Suggested type:

type InteractiveHotspot = {
  id: string
  kind:
    | "rack"
    | "product"
    | "backroom"
    | "prep-table"
    | "fitting-room"
    | "pos"
    | "customer"
    | "upgrade-slot"
  x: number
  y: number
  width: number
  height: number
  enabled: boolean
  targetId?: string
}

Hotspots:
- are in logical scene coordinates
- have large enough touch targets
- support pointer/touch and mouse
- can expose debug bounds in development
- do not depend on the dimensions of a single screenshot

For Pixi:
- use pointer events/eventMode according to the installed Pixi version.
- provide selected/pressed/disabled visual feedback.

## 10. Product selector

When a rack is tapped, do not open the full inventory management screen.

Use a fast in-scene selector:

Category
→ Style
→ Color
→ Size

Show:
- thumbnail
- name
- color swatches
- available floor qty
- backroom qty where useful
- size quantity

If floor qty = 0 but backroom qty > 0:
show:
"Quầy: 0 • Kho sau: 4"
and route the player to backroom retrieval rather than pretending the rack contains the item.

## 11. Preparation table

Prepared items appear visually on a preparation area.

State examples:
- EMPTY
- PREPARED
- CUSTOMER_HOLD
- FITTING
- CART_RESERVED
- RETURN_REQUIRED

Preparation table should show:
- required item lines
- completion status
- incorrect variant warning
- item count

Do not create revenue when an item is placed here.

## 12. Customer patience

Patience must visibly decrease while waiting.

Different phases may use different penalty rates:
- waiting assistance
- waiting for stock
- fitting
- waiting another size
- checkout

Wrong item:
- reduce patience/satisfaction
- never silently correct it.

## 13. Fitting interaction

Accepted-for-fitting item:
PREPARED
→ FITTING_QUEUE
→ FITTING
→ KEEP or REQUEST_NEW_VARIANT or REJECT

If customer requests another size/color:
- create a new service task
- reserve/allocate only when correct variant is selected

Rejected item:
- never disappear
- becomes RETURN_REQUIRED
- must return to floor/backroom.

## 14. Checkout and revenue invariant

Hard invariant:

REQUEST != SALE
PICKED_ITEM != SALE
PREPARED_ITEM != SALE
FITTING != SALE
CUSTOMER_CART != SALE
CHECKOUT_QUEUE != SALE
PAYMENT_SUCCESS == REVENUE_RECOGNITION

UI must never directly call:
setCash(cash + itemPrice)

Instead:

UI action
→ checkout/application service
→ validate cart/reservations
→ calculate price/promotion
→ payment result
→ on success:
   create sale
   create sale lines
   finalize exact SKU
   inventory movement
   payment record
   finance update
   KPI update
   autosave
→ UI reacts to committed result

Money float animation appears only after successful payment.

## 15. Pending cart vs recognized revenue

Show optional informational metric:
Pending Cart Value

But keep it visually distinct from:
- Cash
- Today Revenue

Example:
Cash: 4,850,000
Today Revenue: 3,420,000
Pending Cart: 780,000

Pending cart does not modify money.

## 16. Abandonment cleanup

Customer may abandon before payment.

Required cleanup:
- no sale
- no recognized revenue
- release exact variant reservations
- create item return tasks when needed
- update satisfaction/lost-sales metrics

No "ghost" reservations.

## 17. Store clock/day

Use centralized configuration.

Recommended baseline:
- open: 08:00
- close: 22:00
- approximately 28–35 real minutes at 1x
- suggested initial balance: 1 game hour ~= 2 real minutes

Do not hardcode throughout components.

Suggested config:

type GameTimeConfig = {
  openHour: number
  closeHour: number
  realSecondsPerGameHour: number
  closingGraceEnabled: boolean
  maxClosingGraceGameMinutes: number
}

## 18. Traffic retuning

Longer days must not automatically multiply customer volume.

Compute daily customer target from:
- market potential
- reputation
- recent satisfaction
- stock availability
- marketing
- events
- seasonality
- competition

Then distribute target across daypart weights.

Example:
- Morning 15%
- Lunch 20%
- Afternoon 20%
- Evening Peak 35%
- Late 10%

Weights are balance data, not hardcoded UI constants.

## 19. Closing

At close time:
- stop spawning new walk-ins
- keep active customers
- allow fitting/checkout completion
- show closing state
- use capped closing grace
- then end day

Do not instantly delete customers at 22:00.

## 20. Assets

Do not use one giant screenshot as the interactive scene.

Split interactive assets.

Suggested:

assets/game/store/
├── backgrounds/
├── furniture/
├── racks/
├── fitting/
├── pos/
├── backroom/
├── characters/
├── products/
└── effects/

Core icons:
- shirt
- pants
- dress
- sneaker
- bag
- hanger
- rack
- fitting room
- cashier
- backroom
- money
- reputation

Use original artwork.

Prefer:
- WebP/PNG for raster game sprites
- SVG for suitable interface icons
- sprite atlases when asset count becomes large

## 21. State boundaries

Suggested slices/modules:

storeFloor
customers
orders
inventory
checkout
fitting
employees
time
finance
ui

Do not put the whole game in one component or one unstructured global store.

## 22. Persistence

Active-day save must preserve semantic state:
- game time
- active customers
- requests
- patience
- prepared items
- reservations
- active fitting states
- checkout queues
- exact SKU inventory
- completed sales
- staff state

Do not persist:
- particles
- floating text frames
- decorative animation frames

Reload must not:
- duplicate customer
- duplicate inventory
- duplicate payment
- duplicate sale
- lose allocated products

## 23. Required tests

Revenue:
1. request -> revenue unchanged
2. pick -> unchanged
3. prep table -> unchanged
4. fitting -> unchanged
5. customer cart -> unchanged
6. checkout queue -> unchanged
7. payment failure -> unchanged
8. abandonment -> unchanged
9. payment success -> revenue increases once
10. reload -> no duplicate revenue

Inventory:
1. exact variant only
2. allocated unit cannot be double-used
3. abandonment releases allocation
4. wrong size does not satisfy exact request
5. floor zero/backroom positive can be served via backroom
6. fitting reject becomes return task

Time:
1. central config controls day length
2. pause stops simulation
3. close stops new arrivals
4. existing customers finish in grace period
5. extended day does not automatically triple daily traffic

Responsive:
1. portrait phone
2. narrow Android
3. tablet
4. desktop centered portrait
5. no scene hotspot drift after scaling

## 24. Recommended implementation steps

STEP 0
Audit existing repo and create/update docs/REPO_AUDIT.md.

STEP 1
Build/normalize GameViewport and coordinate transform.

STEP 2
Create layered store scene.

STEP 3
Add hotspot interaction and debug hotspot overlay.

STEP 4
Create customer request overlay + patience.

STEP 5
Create in-scene rack/product/color/size selector.

STEP 6
Implement preparation table and exact SKU allocation.

STEP 7
Implement fitting loop.

STEP 8
Implement POS/payment transaction.

STEP 9
Enforce revenue only after successful payment.

STEP 10
Extend day duration and retune traffic.

STEP 11
Connect autosave/reload.

STEP 12
Tests, responsive QA, animation/audio polish.

Do not skip STEP 8/9 and fake money changes in UI.

## 25. Definition of Done

Complete only when:

- portrait interactive scene works on touch
- rack/product/size/color interaction works
- exact variant is validated
- backroom retrieval is represented
- preparation table works
- patience works
- fitting can request another variant
- wrong item has consequences
- customer cart is reservation only
- POS checkout works
- payment failure creates no money
- successful payment creates money exactly once
- day is configurable and longer
- traffic is rebalanced
- closing grace works
- reload during active day is safe
- build/lint/typecheck/tests pass

## 26. Antigravity execution prompt

Read:
- AGENTS.md
- docs/ANTIGRAVITY_FASHION_RETAIL_MASTER_SPEC.md
- docs/ANTIGRAVITY_MANUAL_STOREPLAY_DAY_CYCLE_SPEC.md
- docs/ANTIGRAVITY_INTERACTIVE_WORKSTATION_UI_SPEC.md

Then audit the existing repository before installing anything. Reuse the existing stack and package manager. Implement the store gameplay as a portrait 9:16 interactive workstation inspired by the interaction structure of the provided reference screenshot, but use original fashion artwork and branding. Use a layered 2D scene plus UI overlays where appropriate. The player must tap racks/products, choose exact style/color/size, prepare items, handle fitting requests, then complete POS checkout. Do not recognize revenue at request, pickup, preparation, fitting, customer-cart or checkout-queue stages. Recognize cash/revenue exactly once only after successful payment. Extend the day using central configuration to an initial target around 28–35 real minutes for 08:00–22:00, and retune customer arrival targets rather than multiplying spawn rate. Preserve active-day save data and prevent duplicate allocations/sales after reload. Add the required tests and run all repository quality commands.
