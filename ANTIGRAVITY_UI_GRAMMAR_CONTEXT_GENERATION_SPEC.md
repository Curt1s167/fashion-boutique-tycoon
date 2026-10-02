# ANTIGRAVITY SPEC — UI GRAMMAR LEARNING & CONTEXTUAL GAMEPLAY GENERATION

**Version:** 1.0  
**Priority:** HIGH  
**Purpose:** Make Antigravity study the visual/interaction grammar of the supplied reference UI, then creatively apply that grammar to different fashion-retail gameplay contexts without copying proprietary assets or reproducing the reference screen literally.

---

# 1. CORE INTENT

Antigravity must NOT treat the reference screenshot as a single screen to clone.

Instead, Antigravity must infer a reusable **UI grammar** from it.

The reference interface communicates gameplay using:

- compact top HUD
- current customer/order card
- patience/progress indicator
- explicit current instruction
- large touch-first interactive work area
- visible inventory/resource quantities
- locked/unlocked progression
- direct manipulation
- strong visual hierarchy
- portrait mobile layout
- illustrated cozy game identity

Antigravity must preserve these interaction principles while generating **new fashion-specific operational contexts**.

The goal is:

```text
Same interaction language
+
Different business context
+
Original assets
+
Fashion-retail logic
```

Not:

```text
Copy the same screen and replace tea with shirts.
```

---

# 2. WHAT ANTIGRAVITY MUST LEARN FROM THE REFERENCE UI

Antigravity should infer the following design grammar.

## 2.1 Visual hierarchy

Priority order:

1. business state / HUD
2. current customer need
3. urgency / patience
4. current task instruction
5. main interactive station
6. resource quantities
7. unlock/progression states
8. background decoration

The player must always understand:

```text
What is happening?
Who needs something?
What do I need to do now?
Where do I tap?
How urgent is it?
What resource will be consumed?
```

---

# 3. PORTRAIT GAME COMPOSITION

Default target:

```text
9:16 portrait
```

Recommended screen zones:

```text
┌────────────────────────────┐
│ HUD                        │
├────────────────────────────┤
│ Customer / Situation       │
│ Patience / Urgency         │
├────────────────────────────┤
│ Current Step / Instruction │
├────────────────────────────┤
│                            │
│  Interactive Workstation   │
│                            │
│  Objects / Stock / Tools   │
│                            │
├────────────────────────────┤
│ Context Actions            │
└────────────────────────────┘
```

Antigravity may change proportions by context, but the information priority should remain understandable.

---

# 4. UI GRAMMAR, NOT PIXEL COPYING

Antigravity must learn:

- relative placement
- interaction density
- visual priority
- feedback style
- touch ergonomics
- compact instruction flow
- resource visibility
- progression cues

Antigravity must NOT copy:

- exact background
- exact colors
- proprietary characters
- exact icons
- exact illustrations
- brand name
- mascot
- exact object shapes
- exact decorative details

Create original fashion-themed equivalents.

---

# 5. CONTEXTUAL UI GENERATION RULE

Every gameplay context should answer five questions:

```text
1. Who/what triggered this context?
2. What is the player trying to accomplish?
3. Which objects can be manipulated?
4. Which business state changes if successful?
5. What failure/alternative outcomes exist?
```

Antigravity must generate the UI from these answers.

---

# 6. CONTEXT TEMPLATE

Before implementing any new operational scene, define:

```text
Context Name
Actor
Trigger
Goal
Required Data
Primary Interactive Objects
Step Sequence
Success Condition
Failure Conditions
Business Effects
Persistence Effects
Tutorial Needs
```

Example:

```text
Context: Customer Item Fulfillment
Actor: Walk-in customer
Trigger: Customer asks for White Shirt / M
Goal: Give correct SKU
Objects: Shirt rack, size selector, preparation table
Success: Correct variant delivered
Failure: Wrong size / timeout / stockout
Business Effects: Satisfaction / patience / cart reservation
```

---

# 7. CONTEXT 1 — CUSTOMER ITEM FULFILLMENT

This is the closest context to the reference interaction model.

UI structure:

```text
HUD

Customer:
"Cho chị áo sơ mi trắng size M nhé."

Patience ███████░░

Current Step:
"Chạm Kệ Áo"

Interactive Area:
[Tops] [Bottoms] [Shoes]
[Backroom] [Preparation Table]

Flow:
Rack
→ Product
→ Color
→ Size
→ Prepare
→ Give Customer
```

Business effects:
- exact SKU allocation
- patience
- satisfaction
- no revenue yet

---

# 8. CONTEXT 2 — FITTING ROOM REQUEST

Antigravity must reinterpret the same grammar.

Example:

```text
Customer:
"Size M hơi chật, cho chị thử L nhé."

Patience █████░░░

Current Step:
"Lấy size L"

Interactive Area:
[Return item]
[Size S] [M] [L] [XL]
[Backroom]
[Fitting Room]
```

Success:
- correct replacement delivered

Failure:
- no stock
- slow service
- wrong size

Business effects:
- satisfaction
- conversion probability
- fitting queue
- inventory allocation

---

# 9. CONTEXT 3 — CHECKOUT / POS

Reuse grammar differently.

```text
Customer Basket
3 items
Total before discount: ...

Patience ███████░

Current Step:
"Quét sản phẩm đầu tiên"

Interactive Area:
[Scanner]
[Product 1]
[Product 2]
[Product 3]

Then:
[Apply Promotion]
[Cash]
[Card]
[QR]
```

Important:
- money changes only after successful payment
- pending total is not revenue

Visual feedback:
- scan animation
- payment success
- receipt
- only then cash/revenue animation

---

# 10. CONTEXT 4 — SALES FLOOR RESTOCK

Trigger:
- rack low/empty
- backroom has stock

UI:

```text
Alert:
"Kệ Áo Basic Tee sắp hết"

Current Step:
"Lấy hàng từ kho sau"

Interactive Area:
[Backroom stock bins]
[Carry capacity]
[Target rack]

Flow:
Select SKU
→ Select quantity
→ Carry
→ Restock
```

Business effects:
- backroom decreases
- floor quantity increases
- stock availability improves

No financial revenue.

---

# 11. CONTEXT 5 — GOODS RECEIVING

Trigger:
supplier delivery arrives.

UI:

```text
Delivery:
PO #1042

Expected:
Tee Black M x 12
Sneaker EU39 x 8

Current Step:
"Kiểm đếm thùng 1"

Interactive Area:
[Box 1]
[Box 2]
[Scanner]
[Damaged bin]
[Accept]
```

Possible outcomes:
- exact
- shortage
- overage
- damaged goods

Business effects:
- PO state
- inventory receipt
- damaged stock
- payable/cash according to rules

---

# 12. CONTEXT 6 — RETURN / EXCHANGE

Customer:

```text
"Em muốn đổi áo size M sang L."
```

UI grammar:

```text
Return Request
Receipt / Order reference
Item condition
Reason

Current Step:
"Kiểm tra tình trạng sản phẩm"

Interactive Area:
[Sellable]
[Needs Repack]
[Damaged]
[Reject Return]

Then:
[Refund]
or
[Choose Exchange Size]
```

Business effects:
- return transaction
- inventory
- refund
- customer satisfaction
- return KPI

---

# 13. CONTEXT 7 — CLEANING INCIDENT

Trigger:
fitting room / floor becomes dirty.

UI:

```text
Store Alert:
"Phòng thử đồ #2 cần vệ sinh"

Urgency ██████░░

Current Step:
"Chọn nhân viên vệ sinh"

Interactive Area:
[Cleaner A]
[Cleaner B]
[Cleaning Supplies]
[Room #2]
```

Alternative early-game:
player performs simple cleaning manually.

Business effects:
- cleanliness
- staff workload
- customer satisfaction

---

# 14. CONTEXT 8 — STAFF SHIFT / COVERAGE

This context is more managerial but must still follow the same clarity grammar.

```text
Tonight 18:00–21:00
Expected Traffic: HIGH

Problem:
Cashier Coverage: LOW

Current Step:
"Thêm 1 nhân viên thu ngân"

Interactive Area:
Available Staff
→ Shift Slots
```

Show:
- labor cost
- overtime
- skill fit
- warnings

Business effects:
- schedule
- payroll
- queue capacity
- fatigue

---

# 15. CONTEXT 9 — CUSTOMER COMPLAINT / REVIEW RESPONSE

Example:

```text
★★☆☆☆
"Shop đẹp nhưng mình chờ thanh toán quá lâu."
```

Current Step:
"Chọn cách phản hồi"

Actions:
- thank and apologize
- offer voucher
- promise operational review
- compensation if applicable

Show consequence preview carefully:
- recovery potential
- voucher cost
- no magical full reputation reset

---

# 16. CONTEXT 10 — BRANCH CRISIS

Example:

```text
Da Nang Branch
Profit: -12%
Reviews: 3.2
Stockout: 28%
```

Instruction:
"Xác định nguyên nhân chính"

Interactive diagnostic cards:
- staffing
- inventory
- manager
- rent
- marketing
- traffic

Then decision:
- train/replace manager
- change assortment
- add staff
- reduce staff
- transfer stock
- close/restructure

The screen should still use:
- problem first
- urgency/health
- clear current step
- direct action objects

---

# 17. CONTEXT 11 — MARKETING CAMPAIGN

Situation:
New sneaker collection launch.

UI:

```text
Campaign Goal
Increase awareness

Current Step:
"Chọn đối tượng"

Audience:
[Students]
[Office]
[Trend Hunters]

Channel:
[Social]
[Influencer]
[Member Push]

Budget:
...
```

Feedback:
- estimated reach
- cost
- uncertainty
- projected range, not guaranteed success

---

# 18. CONTEXT 12 — STORE OPENING

Opening a new branch should also inherit the grammar.

```text
New Branch Setup

Current Step:
"Chọn khu vực trưng bày giày"

Interactive Store Layout:
[Window]
[Tops]
[Bottoms]
[Footwear]
[Fitting]
[Cashier]
```

Then:
- hire manager
- staff schedule
- opening inventory
- opening campaign

This becomes a guided setup sequence.

---

# 19. CONTEXT 13 — INVENTORY COUNT

Situation:
system detects discrepancy.

```text
Expected:
Black Tee M = 12

Counted:
?
```

Player physically taps/counts stacks/bins or enters actual quantity.

Possible result:
- match
- shortage
- overage

Business effects:
- inventory adjustment
- shrinkage
- manager KPI
- audit trail

---

# 20. CONTEXT 14 — ONLINE ORDER PICKING

Request:

```text
Order #A184
Shirt White M
Jeans Blue 29
Sneaker EU39
```

UI grammar:
- order card
- SLA timer
- current picking step
- rack/backroom interactions
- packing station

Success:
- exact items packed
- order ready

Wrong item:
- fulfillment error risk

---

# 21. CONTEXT 15 — PRICE MARKDOWN / CLEARANCE

Situation:
collection aging.

```text
Sell-through: 34%
Season Remaining: Low
Stock: High
```

Instruction:
"Chọn chiến lược markdown"

Options:
- 10%
- 20%
- 30%
- transfer
- hold
- bundle

Show:
- estimated margin
- stock risk
- no guaranteed demand

---

# 22. CONTEXT GENERATION ALGORITHM FOR ANTIGRAVITY

When asked to implement a new gameplay feature:

## Step A — Identify the business event
Example:
"customer requests new shoe size"

## Step B — Identify player objective
Example:
"retrieve correct EU39"

## Step C — Identify manipulated game objects
Example:
shoe wall, backroom, fitting room

## Step D — Identify urgency
Example:
customer patience

## Step E — Identify business transaction
Example:
inventory allocation, satisfaction

## Step F — Apply UI grammar
Render:
- compact status
- actor/situation
- urgency
- current step
- direct interactive station
- immediate feedback

## Step G — Add context-specific originality
Do not reuse the same props/layout literally if a different workflow deserves a new workstation.

---

# 23. VISUAL VARIATION RULE

Different contexts should feel part of the same game, but not like the exact same screen.

Shared:
- typography
- borders
- panel style
- HUD tokens
- instruction banner
- feedback animation
- spacing rhythm
- button language

Context-specific:
- workstation layout
- background
- tools
- objects
- customer pose
- employee pose
- animations
- station-specific icons

Example:

```text
Sales Counter
≠
Stock Room
≠
Fitting Room
≠
Receiving Dock
≠
Manager Office
```

But all should look like one game.

---

# 24. DESIGN SYSTEM TOKENS

Antigravity should derive/create reusable tokens:

```text
colors
panel surfaces
outline widths
rounded corners
shadow depths
font sizes
HUD height
instruction banner style
patience colors
success state
warning state
danger state
locked state
highlight pulse
```

Do not style every screen independently.

---

# 25. TUTORIAL GENERATION

Every new player-facing workflow should support guided steps.

Tutorial rule:

- highlight exactly one main action at a time
- use short Vietnamese instruction
- reuse real interaction
- do not create a fake tutorial-only path
- wait for actual successful action before advancing

Example:

```text
Bước 1: Chạm Kệ Giày
Bước 2: Chọn Sneaker Street 01
Bước 3: Chọn màu White/Green
Bước 4: Chọn size 39
Bước 5: Đưa cho khách thử
```

---

# 26. RESPONSIVE / TOUCH RULE

Target mobile-first.

Requirements:
- minimum comfortable touch target
- no tiny click-only controls
- portrait layout first
- logical coordinate scaling
- no hotspot drift
- no interaction hidden only on hover
- desktop supports mouse using same interaction model

---

# 27. ORIGINALITY RULE

Antigravity may learn interaction principles from the supplied screenshot.

It must create:
- original fashion artwork
- original characters
- original racks
- original store background
- original icons
- original colors/branding

Do not reproduce proprietary reference assets.

---

# 28. DATA-DRIVEN UI

Each workstation should render from game data.

Do not hardcode customer dialogue and stock quantities directly into visual components.

Example:

```ts
type GameplayContext = {
  id: string
  contextType: string
  actorId?: string
  urgency?: number
  instruction: string
  steps: ContextStep[]
  availableActions: ContextAction[]
}
```

This allows new contexts without rebuilding the entire screen architecture.

---

# 29. CONTEXT REGISTRY

Recommended concept:

```text
GameplayContextRegistry
├── customer-fulfillment
├── fitting-request
├── checkout
├── restock
├── goods-receiving
├── return-exchange
├── cleaning
├── shift-coverage
├── review-response
├── branch-crisis
├── campaign-setup
├── branch-opening
├── stock-count
├── online-picking
└── markdown
```

Each context defines:
- view model
- interaction steps
- success/failure
- business effects

---

# 30. ANTIGRAVITY MUST BE CREATIVE, BUT NOT RANDOM

Creativity must be constrained by business logic.

Bad:
- adding visually fun mini-games unrelated to retail outcome
- making inventory magically refill
- turning returns into arbitrary puzzles

Good:
- creating a stock-count interaction that teaches inventory accuracy
- creating fitting-room retrieval that teaches size availability
- creating shift scheduling that teaches peak coverage
- creating branch diagnosis that teaches P&L/root cause

Every creative interaction should reinforce the retail simulation.

---

# 31. FEATURE ACCEPTANCE CHECK

For every newly invented context, Antigravity must answer:

1. What retail/business concept does this teach?
2. What game state changes?
3. What can fail?
4. What does the player learn?
5. Is the interaction visually understandable in <3 seconds?
6. Does it reuse the game's UI grammar?
7. Is it original rather than copied?
8. Is it persisted if needed?
9. Does it connect to KPI/reputation/finance/inventory/staff?

If the answer is weak, redesign before implementation.

---

# 32. REQUIRED FIRST SET OF CONTEXTS

Before expanding further, implement/polish these contexts:

1. Customer Item Fulfillment
2. Fitting Room Request
3. Checkout / Payment
4. Restock from Backroom
5. Goods Receiving
6. Return / Exchange
7. Cleaning Incident
8. Staff Shift Coverage
9. Review Response
10. Online Order Picking

These form the core reusable interaction language.

---

# 33. ANTIGRAVITY EXECUTION PROMPT

Use:

> Study the supplied reference screenshot as an interaction and visual-hierarchy reference, not as artwork to copy. Infer a reusable UI grammar: portrait HUD, current actor/situation, patience or urgency, one clear current instruction, a large touch-first interactive workstation, visible quantities, locked/unlocked progression, immediate feedback and cozy illustrated presentation. Then apply this grammar creatively to the fashion-retail domain. Do not make every scene a clone of the tea-counter screen. Generate context-specific workstations for customer item fulfillment, fitting-room size requests, checkout, restocking, goods receiving, return/exchange, cleaning, staff shift coverage, review response and online-order picking. Each context must be driven by real business state and affect inventory, satisfaction, staffing, reviews, finance or KPI. Reuse one consistent visual design system while changing the workstation layout and objects according to the business workflow. Use original fashion assets and branding. Implement from data and context state machines, not hardcoded screenshots. Before each new context, document Actor, Trigger, Goal, Interactive Objects, Steps, Success, Failure and Business Effects. Keep mobile portrait touch usability and preserve the rule that money is recognized only after successful payment.

---

# 34. FINAL INTENT

The player should feel:

```text
"I immediately understand what the customer/store needs,
I know what to touch,
and the interaction teaches me how this retail operation works."
```

Every new business mechanic should feel like a natural new workstation or situation in the same fashion retail world, rather than a disconnected admin form.
