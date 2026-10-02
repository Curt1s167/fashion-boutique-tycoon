# ANTIGRAVITY ADDENDUM — MANUAL STOREPLAY, CUSTOMER FULFILLMENT & LONG DAY CYCLE

**Version:** 1.0  
**Applies to:** `ANTIGRAVITY_FASHION_RETAIL_MASTER_SPEC.md`  
**Priority:** HIGH — this document overrides any earlier assumption that customer orders are fulfilled automatically.  
**Product:** Fashion Retail Business Simulator

---

# 0. CORE DECISION

The game must combine **direct store-floor gameplay** and **business management**.

During store opening hours, the player is not only looking at dashboards.

The player directly controls an owner/avatar inside the store and can:

- walk around the sales floor
- inspect racks
- pick up exact fashion SKUs
- carry items
- bring requested items to customers
- bring another size/color to the fitting room
- return rejected items
- restock racks from the backroom
- operate the cashier/POS when necessary
- clean or resolve minor incidents when staff are unavailable
- supervise employees
- open quick-management panels

Employees gradually automate these tasks as the business grows.

This direct interaction is a central gameplay pillar.

---

# 1. IMPORTANT ACCOUNTING RULE

**Money/revenue must NOT be recorded when:**

- a customer enters the store
- a customer requests an item
- the player picks up an item
- an item is handed to the customer
- an item is placed in a customer basket/cart
- a customer enters the fitting room
- a customer joins the checkout queue

Money is recognized only when the customer successfully completes checkout/payment.

Required invariant:

```text
REQUEST != SALE
PICKUP != SALE
CART != SALE
CHECKOUT_QUEUE != SALE
PAYMENT_SUCCESS == SALE
```

This rule must be enforced in the domain layer, not only visually.

---

# 2. PLAYER ROLE

At the start of a new game, the player acts as:

- Owner
- Store Manager
- Sales Advisor
- Stock Associate
- Cashier
- basic cleaner

The player can perform most basic store operations manually.

As the company grows, the player hires employees and delegates tasks.

This creates natural progression:

```text
Early Game
Player does almost everything manually

        ↓

Growth
Player + several employees

        ↓

Mature Branch
Manager + staff automate daily operations

        ↓

Chain
Player focuses on high-level decisions
```

The game should teach why employees are valuable by allowing the player to experience workload personally.

---

# 3. STORE-FLOOR PLAYER CONTROLS

Antigravity must inspect the existing control system before implementing.

Preferred support:

## Desktop
- WASD / arrow movement OR click/tap-to-move
- interaction key/button
- mouse selection
- inventory/carry hotkeys if suitable

## Mobile
- tap-to-move OR virtual joystick
- large interaction button
- touch-friendly item/customer targets

Do not require precision controls unsuitable for mobile.

All important interactions must have visible interaction states.

---

# 4. DIRECT SERVICE LOOP

The minimum customer service loop is:

```text
CUSTOMER ENTERS
        ↓
CUSTOMER BROWSES
        ↓
CUSTOMER REQUESTS ITEM
        ↓
PLAYER / STAFF IDENTIFIES REQUEST
        ↓
FIND EXACT SKU
        ↓
PICK ITEM FROM RACK
or
GET ITEM FROM BACKROOM
        ↓
BRING ITEM TO CUSTOMER
        ↓
CUSTOMER ACCEPTS / TRIES ITEM
        ↓
OPTIONAL NEW SIZE/COLOR REQUEST
        ↓
CUSTOMER DECIDES TO BUY
        ↓
CHECKOUT QUEUE
        ↓
POS / PAYMENT
        ↓
PAYMENT SUCCESS
        ↓
SALE + REVENUE + INVENTORY FINALIZATION
```

This loop must be playable and not simulated entirely in a menu.

---

# 5. CUSTOMER REQUEST DATA

A request may include:

- product style
- category
- color
- size
- quantity
- budget
- acceptable alternatives
- patience timer
- fitting-room preference

Example:

```text
Customer Request

Essential Tee
Color: Black
Size: M
Qty: 1
```

For footwear:

```text
Street Sneaker 01
Color: White/Green
Size: EU 39
```

The request must reference an exact sellable product variant whenever size/color are required.

---

# 6. CUSTOMER REQUEST UI

When a customer needs help, show a readable request indicator.

Possible presentation:

- thought bubble
- product thumbnail
- color swatch
- size badge
- patience bar
- request icon

Example:

```text
[Shirt Icon]
BLACK
SIZE M
⏳ 72%
```

Do not force the player to repeatedly open a large menu just to understand the request.

The player should be able to inspect the request in the store scene.

---

# 7. PRODUCT PICKUP

The player must physically interact with stock.

Possible sources:

- sales rack
- shelf
- footwear wall
- accessory display
- backroom bin
- delivery receiving area

When the player picks an item:

```text
AVAILABLE ON FLOOR
        ↓
HELD BY PLAYER
```

This is NOT a sale.

The item is temporarily unavailable for other customers while held.

---

# 8. PLAYER CARRY CAPACITY

The player should not carry unlimited products.

Recommended initial capacity:

```text
2–4 item units
```

Keep the value configurable.

Possible progression:
- basic hand carry
- shopping basket
- stock cart
- employee trolley

Carry capacity creates meaningful route planning.

Do not hardcode the final value in UI components.

---

# 9. ACTIVE ITEM ALLOCATION

Items currently being handled must have explicit semantic ownership/status.

Possible live states:

```text
ON_RACK
IN_BACKROOM
HELD_BY_PLAYER
HELD_BY_EMPLOYEE
CUSTOMER_HOLD
FITTING_ROOM
CUSTOMER_CART
CHECKOUT_QUEUE
SOLD
RETURN_TO_RACK
DAMAGED
```

These are not necessarily all persistent database inventory locations.

Implementation choice:

- permanent inventory locations remain authoritative for stock ownership
- active-day handling can use an `ActiveStockAllocation` / reservation model
- active allocations must be included in an autosave/checkpoint if resume during an open day is supported

Critical invariant:

An allocated unit cannot simultaneously be sold/reserved to another customer.

---

# 10. WRONG ITEM HANDLING

The player can make mistakes.

Examples:
- wrong style
- wrong color
- wrong size

Customer reaction depends on flexibility and service quality.

Possible outcomes:
- customer refuses item
- customer accepts alternative
- patience decreases
- satisfaction decreases
- review impact later

Do not silently convert a wrong SKU into the requested SKU.

---

# 11. SALES FLOOR VS BACKROOM

This mechanic is mandatory.

Example:

```text
Essential Tee / Black / M

Sales Floor: 0
Backroom: 8
```

Customer sees no item on the rack.

The player/staff must:

```text
Customer Request
    ↓
Go to Backroom
    ↓
Find Exact SKU
    ↓
Pick Item
    ↓
Return to Customer
```

This makes replenishment operationally meaningful.

---

# 12. FLOOR RESTOCKING

The player/staff can restock racks.

Flow:

```text
BACKROOM
    ↓
PICK RESTOCK QTY
    ↓
CARRY / STOCK CART
    ↓
SALES FLOOR FIXTURE
    ↓
RESTOCK
```

Restocking consumes time.

Poor replenishment leads to:
- slower service
- more requests
- lost sales
- lower satisfaction

---

# 13. FITTING ROOM SERVICE

Customer can take items to the fitting room.

Flow:

```text
ITEM GIVEN
    ↓
FITTING QUEUE
    ↓
ENTER FITTING ROOM
    ↓
TRY ON
    ↓
ACCEPT
or
REQUEST DIFFERENT SIZE/COLOR
or
REJECT
```

If another size is requested:

```text
Customer waits
    ↓
Player/Staff finds new SKU
    ↓
Bring item
    ↓
Try again
```

This must consume player/staff time.

---

# 14. REJECTED FITTING ITEMS

Rejected items do not disappear.

They become:

```text
FITTING_RETURN
```

Player/staff must eventually:
- collect them
- inspect if needed
- return to sales floor or backroom

Until returned, the unit may remain temporarily unavailable.

This creates realistic store-floor workload.

---

# 15. CUSTOMER CART / HOLD

When a customer chooses to buy:

```text
PRODUCT OWNED BY STORE
        ↓
CUSTOMER_CART / RESERVED
```

Still no revenue.

The exact SKU is reserved for that customer.

Other customers cannot buy the same physical/allocated unit.

If the customer abandons:

```text
CUSTOMER_CART
    ↓
RESERVATION RELEASED
    ↓
RETURN_TO_RACK / BACKROOM
```

No revenue is created.

---

# 16. CHECKOUT QUEUE

A customer who wants to buy enters checkout.

Queue performance depends on:
- number of cashier positions
- player cashier activity
- cashier staff skill
- POS upgrades
- payment method
- customer basket size

Long queue:
- patience decreases
- abandonment can occur before payment
- negative review probability increases

If customer leaves before payment:
- sale does not exist
- revenue remains zero
- item reservations are released

---

# 17. PLAYER AS CASHIER

In early game, player can operate POS manually.

Minimum flow:

```text
Customer reaches counter
    ↓
Start Checkout
    ↓
Scan / confirm items
    ↓
Promotion calculated
    ↓
Payment
    ↓
Payment Success
    ↓
Complete Sale
```

Later, cashier employees can automate this.

Player can still step in when queues become overloaded.

---

# 18. REVENUE RECOGNITION

Only after `PAYMENT_SUCCESS`:

```text
Create Sale
Create Sale Lines
Finalize Exact SKU Inventory
Create SALE Inventory Movement
Record Payment
Increase Cash / appropriate account
Increase Net Sales
Update Revenue KPI
Update Employee/Branch KPI
Trigger Sale Feedback
Autosave
```

All of these must happen in one consistent transaction/action boundary.

---

# 19. PENDING CART VALUE VS REAL MONEY

UI must distinguish:

### Pending value
Value of customer baskets/cart before payment.

### Actual revenue
Only completed paid sales.

Do NOT add cart value to the main money counter.

Recommended UI:

```text
Cash:          4,850,000 ₫
Today Revenue: 3,420,000 ₫

Pending Cart:    780,000 ₫
```

`Pending Cart` is informational only.

---

# 20. SALE ATOMICITY

Checkout must be atomic.

Required sequence:

```text
Validate Customer Cart
        ↓
Validate Reservation
        ↓
Calculate Final Price
        ↓
Apply Promotion
        ↓
Process Payment
        ↓
IF PAYMENT SUCCESS:
    Finalize Sale
    Finalize Inventory
    Record Payment
    Update KPI
    Autosave
ELSE:
    Do not recognize revenue
```

Never allow:
- revenue without stock finalization
- stock sold without payment
- double payment
- duplicate sale after reload

---

# 21. CUSTOMER ABANDONMENT

A customer may abandon at:

- browsing
- waiting for item
- fitting queue
- fitting room
- checkout queue

Each stage must clean up state safely.

Example checkout abandonment:

```text
CHECKOUT_QUEUE
    ↓
ABANDON
    ↓
NO SALE
NO REVENUE
RELEASE RESERVATION
ITEMS -> RETURN TASK
SATISFACTION DOWN
```

---

# 22. PARTIAL PURCHASE

Customer may select multiple products.

Example:

```text
T-Shirt / M
Jeans / 30
Sneaker / EU39
```

Customer may buy only some items.

Checkout must create sale lines only for purchased items.

Rejected items return to store ownership/return workflow.

---

# 23. STAFF AUTOMATION

Employees perform the same physical task model.

Examples:

Sales Advisor:
- respond to customer request
- retrieve product
- deliver product
- recommend alternative

Stock Associate:
- restock rack
- collect fitting returns
- move backroom stock

Cashier:
- process checkout

Cleaning Staff:
- clean floor/fitting area

Store Manager:
- prioritize tasks
- coordinate staff
- resolve incidents

Employees should not teleport between tasks unless the existing game's visual abstraction explicitly supports it.

---

# 24. TASK SYSTEM

Use a store-floor task queue.

Examples:

```text
CUSTOMER_ITEM_REQUEST
RESTOCK_FIXTURE
FITTING_SIZE_REQUEST
RETURN_FITTING_ITEM
CASHIER_NEEDED
CLEANING_NEEDED
ONLINE_PICKING
```

Task fields can include:

- taskId
- type
- branchId
- targetEntityId
- requiredRole
- priority
- createdAtGameTime
- deadline/patience
- assignedActorId
- state

Task state:

```text
OPEN
-> ASSIGNED
-> IN_PROGRESS
-> COMPLETED
```

Alternative:
- CANCELLED
- EXPIRED
- FAILED

---

# 25. PLAYER PRIORITY DECISIONS

The player must regularly choose between competing tasks.

Example:

```text
Customer A needs Size M      25s patience remaining
Checkout queue               4 customers
Rack #3 empty
Fitting Room #2 dirty
New delivery waiting
```

The player cannot solve everything instantly.

This tension is intentional and is one of the reasons to hire staff.

---

# 26. DAY LENGTH — CORE CHANGE

A day must be long enough for manual store-floor gameplay.

Do NOT use a very short idle/clicker-style day.

Recommended store hours:

```text
08:00 -> 22:00
```

14 in-game hours.

Recommended default real-time duration at 1x:

```text
approximately 28–35 real minutes
```

The exact duration must be a balance/config value.

Suggested baseline:

```text
1 in-game hour = 2 real minutes
14 hours = 28 real minutes
```

This is a starting balance target, not a magic hardcoded value.

---

# 27. CENTRAL TIME CONFIG

Create centralized config, for example:

```ts
type GameTimeConfig = {
  openHour: number
  closeHour: number
  realSecondsPerGameHour: number
  preparationTimed: boolean
  closingGraceEnabled: boolean
  maxClosingGraceGameMinutes: number
}
```

Do not scatter time ratios across components.

---

# 28. DAY PHASES

Recommended day state:

```text
PREPARATION
-> OPENING
-> MORNING
-> LUNCH_PEAK
-> AFTERNOON
-> EVENING_PEAK
-> CLOSING
-> END_OF_DAY
```

Traffic/spawn patterns should vary by phase.

Example:

```text
08:00–10:00  Low/Medium
10:00–12:00  Medium
12:00–14:00  High
14:00–17:00  Medium
17:00–20:00  Peak
20:00–22:00  Medium
```

Actual curve depends on branch/city/customer segment.

---

# 29. PREPARATION PHASE

Before opening:

- game clock can be paused or preparation can be untimed
- receive stock
- restock racks
- inspect cleanliness
- assign employees
- schedule roles
- configure promotion
- review forecast
- choose displays

This prevents the player from losing the morning because of menu work.

---

# 30. OPEN STORE TIME

During opening hours:

- customer traffic runs
- patience runs
- employee tasks run
- queues run
- cleaning decays
- store operations happen

Management must coexist with direct gameplay.

---

# 31. QUICK MANAGEMENT DURING OPEN HOURS

Provide quick panels without forcing the player to leave the store scene entirely.

Examples:
- quick staff assignment
- current inventory
- task list
- sales summary
- queue status
- branch alerts

Avoid opening heavy full-screen accounting pages repeatedly during a rush.

---

# 32. DEEP MANAGEMENT DURING A DAY

Deep management actions should preferably occur during:

- preparation
- closing
- pause
- low-traffic moments

Examples:
- full weekly scheduling
- supplier negotiation
- branch expansion
- long analytics review

If deep panels can open during active store time, explicitly define whether time:
- continues
- slows
- pauses

Recommended normal-mode behavior:

```text
Quick operational overlays: time continues
Full management screens: player may explicitly pause
```

Do not silently pause the simulation without feedback.

---

# 33. PAUSE AND SPEED

Required:
- Pause
- 1x

Optional after testing:
- 2x speed
- 3x speed

Do not make high speed available during active manual customer requests if it breaks fairness.

Possible rule:
- 2x/3x available only when no urgent player-assigned tasks exist
or
- always available but clearly risky

This is a balance decision.

---

# 34. CLOSING TIME

At closing time:

```text
22:00
```

Stop spawning new walk-in customers.

Do NOT instantly delete customers already inside.

Existing customers may:
- finish fitting
- finish checkout
- leave

Use closing grace.

Example:

```text
STORE CLOSED TO NEW CUSTOMERS
3 customers still inside
```

Once all active customers finish, end the day.

Also define a maximum closing grace to avoid endless days.

---

# 35. TIME SHOULD HAVE BUSINESS MEANING

Time affects:

- traffic
- staff shift start/end
- fatigue
- cleaning
- supplier arrival
- online orders
- promotions
- events
- store closing

Do not use the clock only as decoration.

---

# 36. DAY LENGTH VS PROGRESSION

As the company grows, the player should not be required to manually serve every branch.

For current branch:
- direct gameplay remains possible

Other mature branches:
- staff/manager simulation handles operations

Player can:
- visit a branch
- take direct control
- inspect problems
- temporarily help staff

This prevents multi-branch gameplay from becoming impossible.

---

# 37. VISITING BRANCHES

When multiple branches exist:

```text
Business Map
    ↓
Select Branch
    ↓
Visit Store
```

The player can enter that branch's physical scene.

During the visit:
- direct manual gameplay is available
- local employees operate
- local demand and inventory apply

Other branches continue through management simulation according to configured time model.

Antigravity must define a deterministic policy to prevent branches from double-simulating time.

---

# 38. OFF-BRANCH SIMULATION

Only one branch should require full NPC visual simulation at a time.

Other branches use abstract/aggregated simulation.

This is required for performance.

Example:

```text
Active Branch:
full store-floor NPC simulation

Other Branches:
interval/batch business simulation
```

Results must remain compatible:
- sales
- stock
- staff
- reviews
- costs
- traffic

---

# 39. PLAYER LEARNING GOAL

Manual service exists to teach:

- how much time customer service consumes
- why rack organization matters
- why backroom placement matters
- why stock associates matter
- why fitting-room staff matter
- why cashier capacity matters
- why peak-hour staffing matters
- why managers matter

Do not reduce the manual loop to meaningless clicking.

---

# 40. PROGRESSION THROUGH AUTOMATION

Early:
```text
Player manually retrieves almost every requested item.
```

Mid:
```text
Sales staff handle most requests.
Player handles rushes and management.
```

Late:
```text
Store Manager coordinates branch.
Player intervenes strategically.
```

This should feel like genuine business growth.

---

# 41. STORE LAYOUT AFFECTS MANUAL GAMEPLAY

Distance matters.

Examples:
- backroom far from fitting rooms increases service time
- cashier placement affects queue
- poor rack layout increases walking
- more fitting rooms reduce fitting queue but consume space
- stock-cart upgrade improves restocking

This makes store upgrades meaningful.

---

# 42. OPTIONAL PATHFINDING

If the existing project uses a tile/grid store:

Recommended:
- grid/tile occupancy
- pathfinding for staff/NPCs
- player collision/navigation

Possible implementation:
- lightweight A*
- existing engine pathfinding
- custom grid algorithm

Do not install a pathfinding package unless the existing engine cannot support the requirement cleanly.

---

# 43. INTERACTION FEEDBACK

Every manual action should have feedback.

Examples:

Pick product:
```text
+ Essential Tee / Black / M
Carry 1/3
```

Give product:
```text
Customer accepted item
```

Wrong size:
```text
Customer wanted M, this is L
```

Payment:
```text
+ 459,000 ₫
SALE COMPLETED
```

Important:
Money animation appears only after successful payment.

---

# 44. HUD REQUIREMENTS

During store-floor gameplay display at minimum:

- in-game time
- day
- cash
- today completed revenue
- reputation
- current carry slots
- urgent tasks
- optional customer count
- pause

Do not display pending cart value as earned cash.

---

# 45. CUSTOMER PATIENCE

Patience decreases while waiting for service.

Different waits can have different penalty weights:

- initial assistance
- item retrieval
- fitting queue
- second-size request
- checkout queue

Employees/player can recover some satisfaction with fast service.

---

# 46. TRAFFIC AND DAY LENGTH INTERACTION

Longer day must NOT simply spawn 3x more customers than before.

Antigravity must retune:

- spawn rate
- customer dwell time
- patience
- staff service speed
- rack capacity
- daily demand target

Use a target customer count per day and distribute it across the traffic curve.

Example:

```text
Target Daily Traffic: 40
```

A 28-minute day should distribute ~40 arrivals meaningfully, not flood continuously.

---

# 47. TRAFFIC GENERATION MODEL

Use:

```text
DailyTargetCustomers =
BaseMarketPotential
* Reputation
* Marketing
* RecentServiceQuality
* StockAvailability
* EventModifier
* Seasonality
* Competition
```

Then distribute across time-of-day weights.

Example weights:

```text
Morning       15%
Lunch         20%
Afternoon     20%
Evening Peak  35%
Late          10%
```

Keep values data-driven.

---

# 48. CUSTOMER CAPACITY

Store capacity must limit active customers.

Possible factors:
- floor size
- available staff
- fitting rooms
- queue space
- store upgrade

If target traffic exceeds capacity:
- customers queue outside
or
- some potential traffic is lost

This teaches capacity planning.

---

# 49. DAY-END REVENUE

End-of-day report must use only completed paid sales.

Metrics:

```text
Completed Sales
Net Revenue
Pending/Abandoned Cart Value
Lost Sales
Stockout Lost Sales
Queue Abandonment
```

This distinction helps the player learn conversion.

---

# 50. LOST SALES

Track lost sales estimates.

Examples:

```text
Requested Item Missing
Potential Value: 399,000 ₫

Checkout Abandonment
Cart Value: 850,000 ₫
```

Do not add lost-sale value to revenue.

Show it separately as an educational KPI.

---

# 51. CONVERSION RATE

Suggested:

```text
Conversion Rate =
Completed Purchasing Customers
/
Eligible Store Visitors
```

Do not count a customer as converted merely because they added an item to cart.

---

# 52. PLAYER WORKLOAD KPI

Optional but useful:

- tasks completed by player
- tasks completed by staff
- average response time
- distance walked
- urgent tasks missed

This can demonstrate when the player needs more employees.

---

# 53. SAVE DURING MANUAL GAMEPLAY

Autosave must preserve important semantic active-day state.

Save:
- game time
- active customers
- customer states
- request
- cart/reservation
- patience
- active tasks
- held item allocations
- staff states
- inventory
- current sales

Do not require persistence of:
- particle frame
- temporary animation frame
- floating text
- exact decorative interpolation state

---

# 54. ACTIVE-DAY RELOAD

On reload:

```text
Load Save
    ↓
Restore Day/Time
    ↓
Restore Inventory
    ↓
Restore Active Allocations
    ↓
Restore Customer Semantic States
    ↓
Rebuild Scene Positions Safely
    ↓
Resume
```

No duplicated customer.
No duplicated item.
No duplicate sale.
No duplicated payment.

---

# 55. REQUIRED DOMAIN ENTITIES / TYPES

Antigravity may adapt naming to current architecture, but concepts should exist:

```text
PlayerActor
CustomerVisit
CustomerRequest
CustomerCart
ActiveStockAllocation
StoreTask
CheckoutSession
PaymentRecord
Sale
SaleLine
InventoryPosition
InventoryMovement
StoreClock
GameDay
DayPhase
StaffAssignment
```

---

# 56. REQUIRED STATE MACHINES

## Customer

```text
ENTERING
-> BROWSING
-> NEEDS_ASSISTANCE
-> WAITING_ITEM
-> ITEM_RECEIVED
-> FITTING optional
-> DECIDING
-> CART_READY
-> CHECKOUT_QUEUE
-> PAYMENT
-> COMPLETED
```

Failure:
- ABANDONED

## Store task

```text
OPEN
-> ASSIGNED
-> IN_PROGRESS
-> COMPLETED
```

Alternatives:
- CANCELLED
- EXPIRED
- FAILED

## Checkout

```text
WAITING
-> SCANNING
-> PRICED
-> PAYMENT_PENDING
-> PAID
-> COMPLETED
```

Alternatives:
- PAYMENT_FAILED
- ABANDONED
- CANCELLED

Revenue only after `PAID`.

---

# 57. REQUIRED TESTS — REVENUE

Antigravity must add tests for:

1. item requested -> revenue unchanged
2. item picked -> revenue unchanged
3. item handed to customer -> revenue unchanged
4. item added to cart -> revenue unchanged
5. customer enters checkout queue -> revenue unchanged
6. payment fails -> revenue unchanged
7. customer abandons -> revenue unchanged
8. payment succeeds -> revenue increases exactly once
9. reloading after payment does not duplicate revenue
10. retrying a completed checkout does not create a duplicate sale

---

# 58. REQUIRED TESTS — INVENTORY ALLOCATION

1. player-held unit unavailable to another customer
2. customer-cart unit cannot be double allocated
3. abandoned cart releases allocation
4. fitting reject creates return task
5. successful sale finalizes exact SKU
6. wrong size does not satisfy exact request unless accepted as alternative
7. floor zero + backroom positive can be fulfilled manually
8. crash/reload preserves active allocation

---

# 59. REQUIRED TESTS — TIME

1. default day duration matches central config
2. pause stops simulation clock
3. 1x advances correctly
4. no new walk-in after closing
5. existing customers may finish during closing grace
6. end-of-day starts only after closing conditions
7. shift start/end respects game time
8. traffic distribution follows time-of-day weights
9. longer day does not accidentally multiply target traffic without retuning

---

# 60. REQUIRED TESTS — MANUAL VS STAFF SERVICE

1. player can complete customer request
2. assigned Sales Advisor can complete same task
3. cashier staff can complete checkout
4. no cashier + player absent increases queue
5. cleaner reduces cleanliness task backlog
6. Store Manager changes task/staff effectiveness according to rules

---

# 61. PERFORMANCE REQUIREMENTS

The manual loop must remain responsive.

Rules:

- only the active branch uses detailed NPC rendering
- other branches use aggregate simulation
- do not persist every animation frame
- avoid saving on every movement step
- autosave transactional state changes
- use selectors for UI state
- separate simulation tick from render loop when appropriate

---

# 62. IMPLEMENTATION ORDER

Antigravity must implement in this order:

## Step 1
Audit existing store-floor controls and customer loop.

## Step 2
Create central store clock/day configuration.

## Step 3
Extend day duration and retune traffic.

## Step 4
Implement semantic product handling:
- rack
- backroom
- player carry
- customer hold/cart

## Step 5
Implement customer request/task system.

## Step 6
Implement player manual fulfillment.

## Step 7
Implement fitting-room repeated size requests.

## Step 8
Implement checkout/payment state machine.

## Step 9
Enforce revenue recognition only after successful payment.

## Step 10
Connect employees to the same task model.

## Step 11
Implement active-day autosave/reload.

## Step 12
Add tests and performance tuning.

Do not attempt visual polish before Steps 1–9 are functionally correct.

---

# 63. DEFINITION OF DONE

This addendum is complete only when:

1. Player can move/interact in the store.
2. Customer requests a specific product variant.
3. Player can inspect the request.
4. Player can get the exact item from rack/backroom.
5. Player has limited carry capacity.
6. Player can bring product to customer.
7. Customer can accept/reject/request another size.
8. Fitting-room loop works.
9. Rejected items create a return/restock responsibility.
10. Customer cart reserves stock but does not create revenue.
11. Customer can queue for checkout.
12. Player can operate checkout.
13. Employees can automate appropriate tasks.
14. Money is added only after payment succeeds.
15. Abandoned customers never create revenue.
16. Inventory cannot be double allocated.
17. Day duration is substantially longer and configurable.
18. Traffic is rebalanced for the longer day.
19. No new customers enter after closing.
20. Existing customers can finish during closing grace.
21. End-of-day report distinguishes paid revenue from lost/pending value.
22. Save/reload during an active day does not duplicate or lose sales/items.
23. Core unit/integration tests pass.
24. Build/typecheck/lint pass.

---

# 64. ANTIGRAVITY EXECUTION PROMPT

Use this prompt after adding this file to the project:

> Read `docs/ANTIGRAVITY_FASHION_RETAIL_MASTER_SPEC.md` and `docs/ANTIGRAVITY_MANUAL_STOREPLAY_DAY_CYCLE_SPEC.md` completely. The manual-storeplay addendum has higher priority wherever it changes assumptions about automatic customer service or revenue recognition. Audit the existing store-floor scene, controls, customer state machine, inventory, checkout, employee automation and game-time system before changing code. The player must directly retrieve exact products for customers during early gameplay; employees later automate the same task system. A product request, pickup, fitting, customer cart or checkout queue must never count as revenue. Revenue and cash are recognized only once after successful payment. Extend a normal store day to a configurable target of roughly 28–35 real minutes at 1x for 08:00–22:00, then retune traffic so the longer day does not simply multiply customer count. Implement semantic item allocation, customer request tasks, player carry, rack/backroom retrieval, fitting-size requests, checkout/payment state, closing grace and active-day persistence. Add tests covering no-revenue-before-payment, no duplicate sales, no double allocation, abandonment cleanup, closing behavior and save/reload. Reuse the existing package manager and libraries where suitable; do not rebuild the project or create a second lockfile. Run format/lint/typecheck/tests/build before completion.

---

# 65. FINAL DESIGN INTENT

The desired feeling is:

```text
"I am actually running this shop."
```

not:

```text
"I clicked a customer and the game automatically sold an item."
```

The player should feel the pressure of:

- finding the requested size
- walking to the backroom
- deciding which customer to serve first
- helping fitting rooms
- watching the cashier queue grow
- restocking racks
- realizing one person cannot do everything

That experience naturally teaches the player why:

- staffing matters
- scheduling matters
- layout matters
- inventory accuracy matters
- cashiers matter
- managers matter
- operational discipline matters

Then, as the company grows, the game should reward the player by allowing those manual tasks to be delegated to a well-managed team.
