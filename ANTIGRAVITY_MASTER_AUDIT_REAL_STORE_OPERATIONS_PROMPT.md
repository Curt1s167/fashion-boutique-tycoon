# ANTIGRAVITY MASTER AUDIT & IMPLEMENTATION PROMPT
# NINI — REAL STORE OPERATIONS, UI-FUNCTION MATCHING & VIETNAM BUSINESS SIMULATION

**Version:** 1.0  
**Priority:** CRITICAL  
**Game:** Nini — Fashion Shop Simulator  
**Purpose:** Verify that every business function is actually represented by the UI and playable through real player actions, while expanding the game into a realistic store-operation simulation for Vietnam.

---

# 0. CORE PRODUCT REQUIREMENT

The game must be a **real playable store-operation simulation**, not a passive clicker, fake management dashboard, or visual demo.

The player must actually perform meaningful actions such as:

- choosing products
- checking size/color
- retrieving stock
- restocking shelves
- serving customers
- handling fitting
- scanning items
- collecting payment
- processing return/exchange
- hiring staff
- assigning shifts
- responding to incidents
- managing inventory
- ordering stock
- handling supplier receipts
- managing branch performance
- reviewing tax obligations
- paying tax obligations
- dealing with tax debt and late-payment consequences
- handling theft/shrinkage
- handling employee lateness/absence
- handling customer complaints
- handling wrong-item sales
- handling operational loss
- restructuring or closing failing branches

The player should feel:

```text
"I am operating this shop."
```

not:

```text
"I am watching systems run automatically."
```

---

# 1. UI-FUNCTION MATCHING AUDIT — MANDATORY

Before adding any new feature, Antigravity must inspect the existing project and create/update:

`docs/UI_FUNCTION_TRACEABILITY.md`

For every feature, record:

| Feature | Existing UI | Player Action | Business Logic | Persistence | Failure State | Status |
|---|---|---|---|---|---|---|

Status:
- COMPLETE
- PARTIAL
- UI ONLY
- LOGIC ONLY
- MISSING
- BROKEN

A feature is COMPLETE only if:

1. UI exists.
2. Player can actually interact with it.
3. Interaction changes authoritative game state.
4. Result affects another relevant system.
5. Data is saved.
6. Failure/error path exists where appropriate.
7. UI gives clear feedback.

Static cards do not count as implemented.

---

# 2. UI MUST MATCH THE GIVEN VISUAL SYSTEM

Preserve the established Nini UI grammar:

- portrait 9:16
- cute/cozy pastel style
- compact HUD
- customer request area
- patience/urgency
- one clear current action
- large direct-touch interaction zone
- original Nini art
- rounded panels
- warm cocoa outlines
- large mobile touch targets
- restrained animations
- clear business information

The visual system must remain consistent with the previously defined Nini branding.

Do NOT redesign the entire game into:
- enterprise dashboard
- flat admin panel
- spreadsheet simulator
- realistic POS software

Management screens may contain data, but must retain the Nini visual language.

---

# 3. NO EXCESSIVE LOOPS / NO EXCESSIVE EFFECTS

The game must avoid artificial loops whose only purpose is to create screen activity.

Do NOT use:
- constant reward spam
- random particle explosions
- unnecessary coin rain
- repeated popup loops
- idle income loops that replace actual operation
- auto-sale loops that bypass player interaction
- aggressive screen shake
- continuous flashing alerts
- meaningless tap-to-collect systems

Use effects only when they communicate:
- success
- failure
- important state change
- transaction
- warning
- progression

Animations should be short, soft and readable.

---

# 4. MANUAL GAMEPLAY FIRST

Core store operation must remain manually playable.

A customer purchase should be:

```text
Customer enters
→ customer requests
→ player/staff finds exact item
→ fitting if needed
→ customer decides
→ checkout
→ payment success
→ sale created
→ revenue recognized
```

No money before payment.

Hard invariant:

```text
REQUEST != SALE
PICKUP != SALE
FITTING != SALE
CART != SALE
QUEUE != SALE
PAYMENT_SUCCESS == SALE
```

---

# 5. STORE MANAGEMENT — REQUIRED FUNCTIONS

The game must support actual management of:

- opening/closing
- store hours
- customer traffic
- queue
- fitting rooms
- cleanliness
- shelf availability
- backroom
- display arrangement
- staff coverage
- cashier capacity
- branch health
- daily report

Each must have:
- visible UI
- player action
- business impact

---

# 6. INVENTORY MANAGEMENT

Inventory must be tracked by exact SKU:

```text
Style
→ Color
→ Size
→ Variant/SKU
```

Track:
- onHand
- reserved
- damaged
- inTransit
- floor
- backroom
- availableToSell

No silent stock mutation.

Every stock change must create an inventory movement.

Movement types:

- PURCHASE_RECEIPT
- FLOOR_REPLENISHMENT
- SALE
- RESERVATION
- RESERVATION_RELEASE
- RETURN
- DAMAGED_RETURN
- TRANSFER_OUT
- TRANSFER_IN
- SHRINKAGE
- STOCK_ADJUSTMENT
- WRITE_OFF

---

# 7. PURCHASING / PROCUREMENT

Player must be able to:

- browse suppliers
- compare price
- compare MOQ
- compare lead time
- submit PO
- receive order
- check shortage
- check overage
- check damaged goods
- pay supplier according to rules

PO states:

```text
DRAFT
SUBMITTED
CONFIRMED
PARTIALLY_RECEIVED
RECEIVED
CLOSED
CANCELLED
```

Receiving must be a real interaction.

---

# 8. CASHIER / PAYMENT

Checkout must include:

- scan item
- exact SKU validation
- promotion
- total
- payment method
- payment success/failure

Possible payment types:
- cash
- card
- QR/e-wallet

A payment failure must NOT create revenue.

Prevent:
- duplicate payment
- duplicate sale
- revenue without inventory movement

---

# 9. RETURN / EXCHANGE

Player must handle:

- return request
- receipt/order validation
- reason
- condition
- refund
- exchange size
- exchange color

Product condition:

- SELLABLE
- NEEDS_REPACK
- DAMAGED
- NON_RESELLABLE

Returned stock only becomes sellable when condition allows it.

---

# 10. EMPLOYEE MANAGEMENT

Required roles:

- Store Manager
- Assistant Manager
- Sales Advisor
- Cashier
- Stock Associate
- Fitting Room Assistant
- Cleaning Staff
- Online Fulfillment Staff

Each employee can have:

- wage
- role
- service skill
- sales skill
- cashier skill
- inventory skill
- cleaning skill
- leadership
- reliability
- speed
- accuracy
- morale
- energy
- stress
- loyalty
- attendance

---

# 11. EMPLOYEE SHIFT MANAGEMENT

Player must be able to:

- schedule shift
- change shift
- assign role
- respond to understaffing
- respond to overtime
- approve absence if implemented

Shift effects:

```text
Too few staff
→ queue increases
→ service worsens
→ reviews worsen

Too many staff
→ payroll increases
→ branch efficiency drops
```

---

# 12. EMPLOYEE LATENESS / ABSENCE

Operational situations:

- employee late
- employee absent
- employee sick
- employee leaves early
- manager unavailable
- employee burnout

Example:

```text
Employee late 30 minutes
→ role coverage reduced
→ queue pressure increases
→ manager may reassign staff
```

Player choices:
- wait
- call replacement
- reassign staff
- approve overtime
- disciplinary action if system supports it

Do not make every incident random.

Probability should depend on:
- stress
- morale
- reliability
- recent overtime
- attendance record

---

# 13. EMPLOYEE PERFORMANCE / MISTAKES

Possible mistakes:

- sold wrong size
- sold wrong item
- incorrect price
- checkout error
- misplaced stock
- failed restock
- wrong online order
- poor customer handling

Consequences:
- return
- complaint
- lower review
- inventory discrepancy
- compensation cost

Player can:
- train employee
- reassign role
- warn
- replace
- promote

---

# 14. THEFT / SHRINKAGE

The game should include controlled retail-loss situations.

Examples:
- shoplifting
- employee theft
- inventory discrepancy
- damaged stock
- missing stock
- barcode/count mismatch

Do not make theft happen constantly.

Risk factors can include:
- low security
- crowd density
- weak manager
- inventory inaccuracy
- poor staff coverage

Player response:
- investigate
- recount stock
- improve security
- adjust procedures
- write off loss
- disciplinary action if evidence supports it

Do not portray accusations casually.
Require evidence/verification in-game before disciplinary outcomes.

---

# 15. CUSTOMER COMPLAINTS

Possible complaints:

- wrong item
- wrong size
- slow checkout
- poor service
- dirty fitting room
- return rejected
- damaged product
- delivery delay
- wrong online fulfillment

The player must:
- inspect the case
- respond
- compensate if appropriate
- fix underlying issue

---

# 16. NEGATIVE REVIEWS

Review impacts:

- reputation
- future traffic
- branch perception
- repeat customer probability

Player reply can improve recovery but not erase bad operations.

Example:

```text
2-star review
"Shop đẹp nhưng mình chờ 20 phút."

Reply:
"Shop xin lỗi và sẽ điều chỉnh nhân sự giờ cao điểm."

Effect:
partial recovery
```

Actual scheduling should still need improvement.

---

# 17. BRANCH MANAGEMENT

Every branch has:

- rent
- staff
- manager
- inventory
- traffic
- conversion
- reviews
- local demand
- local competition
- profit/loss
- tax-related obligations
- maintenance

Player can:

- open branch
- appoint manager
- change assortment
- change staff
- transfer stock
- launch campaign
- renovate
- restructure
- close branch

---

# 18. BRANCH FAILURE

A branch can fail.

Possible causes:

- weak location
- high rent
- low traffic
- poor assortment
- high payroll
- poor manager
- bad reviews
- stockout
- low conversion
- tax debt
- maintenance costs
- shrinkage
- bad pricing

Branch states can include:

```text
HEALTHY
WARNING
LOSS_MAKING
RESTRUCTURING
INSOLVENT
CLOSING
CLOSED
```

Do not instantly declare bankruptcy after one bad day.

Use sustained financial stress.

---

# 19. BRANCH BANKRUPTCY / INSOLVENCY

If branch is no longer sustainable:

- show financial cause
- show debt/obligations
- allow recovery actions
- allow closure

Recovery options:
- reduce staff
- adjust assortment
- transfer stock
- replace manager
- renegotiate rent event
- stop marketing
- temporary closure
- liquidation

If closure:
- settle inventory
- transfer/release staff
- close liabilities where applicable
- record loss

---

# 20. COMPANY-LEVEL CASH FLOW

Track:
- cash
- revenue
- cost
- gross profit
- operating profit
- inventory value
- tax payable
- supplier payable
- payroll
- rent
- branch losses

The player must understand:

```text
Revenue != Profit
Profit != Cash
```

---

# 21. VIETNAM TAX SYSTEM — IMPLEMENTATION PRINCIPLE

Tax features must be implemented carefully and should reflect **Vietnamese law applicable to the simulated entity and effective period**.

Do NOT hardcode current real-world tax rates in scattered UI components.

Instead create:

```text
TaxRule
TaxType
EffectiveFrom
EffectiveTo
Rate/Formula
EntityType
Threshold
SourceReference
Version
```

Tax rules must be configurable and versioned.

---

# 22. OFFICIAL-SOURCE RULE FOR TAX

Whenever Antigravity implements or updates tax calculations:

1. Verify the current applicable Vietnamese legal rules.
2. Prefer official sources:
   - Vietnamese laws
   - government decrees
   - Ministry of Finance
   - tax authority / official government portals
3. Store:
   - source
   - effective date
   - version
4. Do not invent tax rates.
5. Do not present outdated rates as current.

If current law cannot be verified:
- mark tax rule as simulation placeholder
- do not claim legal accuracy

---

# 23. TAX TYPES THE GAME MAY MODEL

Depending on game/entity scope, the simulation may include:

- VAT
- corporate income tax
- personal income tax withholding for employees
- invoice/e-invoice obligations
- late tax payment
- tax payable
- penalties/interest abstraction
- other applicable business obligations

Only enable a tax type when it makes sense for the simulated business.

Do not overload early gameplay.

---

# 24. TAX GAMEPLAY

Tax should be a management system, not a background number only.

Player can:

- view tax summary
- view taxable base
- view tax payable
- see due date
- pay tax
- review prior periods
- receive tax warning

UI should explain simply:

```text
Thuế kỳ này
Hạn nộp
Đã nộp
Còn phải nộp
```

Advanced explanation available via:
- “Vì sao?”
- details panel

---

# 25. TAX DEBT

If tax is not paid on time:

```text
TAX_DUE
→ OVERDUE
→ TAX_DEBT
```

Possible consequences:
- late payment amount
- warning
- cash pressure
- reputation/management score impact
- escalation event

Do not immediately shut down a branch after one missed payment.

Use staged consequences.

---

# 26. TAX DEBT UI

Show clearly:

```text
Thuế phải nộp: ...
Đã quá hạn: ...
Phát sinh do chậm nộp: ...
Tổng nghĩa vụ hiện tại: ...
```

Player options:
- pay full
- partial payment if game model allows
- view details
- plan cash flow

---

# 27. TAX AND SAVE VERSIONING

Tax rules must be save-compatible.

A saved game should record:
- applicable tax rule version
- period
- calculated amount
- paid amount

Do not recalculate old periods using future tax rates unless explicit migration logic requires it.

---

# 28. ELECTRONIC INVOICE / SALES RECORD

If e-invoice is modeled:

A successful sale may create:
- sales record
- invoice record
- tax basis data

Do not create invoice/revenue before successful payment unless the selected simulation rule specifically requires another timing model.

Keep simulation internally consistent.

---

# 29. SUPPLIER INCIDENTS

Possible:

- late delivery
- partial delivery
- damaged goods
- price increase
- wrong shipment
- shortage
- supplier unavailable

Player decisions:
- accept
- reject
- claim
- switch supplier
- adjust PO

---

# 30. EQUIPMENT / STORE INCIDENTS

Possible:
- POS failure
- electricity outage
- fitting room issue
- air conditioning failure
- door/lighting issue
- network/QR payment issue

These should:
- affect operations
- be understandable
- require action
- not occur too frequently

---

# 31. INVENTORY INCIDENTS

Possible:
- misplaced stock
- wrong count
- damaged stock
- barcode mismatch
- missing size
- overstock
- dead stock

Fashion-specific:
- seasonal decline
- trend change
- size imbalance

---

# 32. HUMAN RESOURCE INCIDENTS

Possible:
- late employee
- absence
- conflict
- resignation
- burnout
- skill mismatch
- promotion request
- wage pressure
- training opportunity

Each should connect to:
- morale
- stress
- coverage
- payroll
- manager skill

---

# 33. CUSTOMER INCIDENTS

Possible:
- angry customer
- VIP customer
- influencer visit
- large purchase
- return abuse suspicion
- lost item
- queue abandonment
- service complaint
- fitting-room complaint

Handle carefully and fairly.

---

# 34. SECURITY INCIDENTS

Possible:
- theft suspicion
- stock discrepancy
- unusual refund pattern
- cashier discrepancy

Player should:
- investigate
- review logs
- perform stock count
- take action only with evidence

Avoid sensationalizing.

---

# 35. COMPETITION / MARKET INCIDENTS

Possible:
- competitor opens nearby
- rent increases
- local event
- seasonal traffic drop
- trend shift
- shopping area decline
- tourism increase
- online demand shift

These affect:
- traffic
- demand
- price sensitivity
- branch viability

---

# 36. STORE CLOSURE / RESTRUCTURING

If branch performs badly:

Player can:
- change manager
- retrain staff
- reduce staff
- change shifts
- change inventory
- reduce rent through event
- reposition assortment
- transfer stock
- close branch

Closure must have consequences:
- staff
- inventory
- lease
- loss
- branch reputation
- cash

---

# 37. DAILY OPERATION EVENTS

Daily events must be limited.

A normal day should not contain 10 crises.

Recommended:
- mostly normal operation
- occasional small issue
- rare major incident

This protects the cozy feeling.

---

# 38. EVENT ENGINE RULE

Events should have:
- cause
- probability
- severity
- duration
- business impact
- player response

Example:

```text
Staff Stress High
→ Lateness Chance +
→ Absence Chance +
```

Not:

```text
Random bad event because RNG
```

---

# 39. REAL PLAYER ACTION REQUIREMENT

For every important system, ensure a real interaction exists.

Examples:

Inventory:
- choose stock
- move stock
- count stock

Tax:
- review payable
- approve/pay

Staff:
- assign shift
- respond to absence

Supplier:
- inspect delivery

Review:
- respond to customer

Branch:
- choose corrective action

No feature should exist only as a background number.

---

# 40. UI CONTEXT MAPPING

Each business context should have its own interaction surface.

Examples:

```text
Sales Floor
Fitting Room
Backroom
Receiving Dock
Checkout
Manager Office
Tax / Finance Desk
Branch Overview
Incident Resolution
```

Do not force every operation into one generic modal.

---

# 41. MANAGEMENT OFFICE CONTEXT

Create a cute “Manager Office” or management scene.

Use for:
- finance
- tax
- staff overview
- branch alerts
- supplier
- reports

Keep Nini style.

This gives management tasks a physical/game context.

---

# 42. TAX / FINANCE DESK CONTEXT

Instead of raw tax spreadsheet only, use:

```text
Nini Manager Desk
├── Revenue
├── Payroll
├── Supplier Payable
├── Tax Payable
├── Rent
└── Cash
```

The player can open:
- tax book
- finance report
- payment screen

Deep details can still use tables.

---

# 43. MINIMAL EFFECT POLICY

Allowed:
- short button squash
- small sparkle
- customer smile
- subtle money float after payment
- gentle warning pulse
- compact transition

Avoid:
- endless animations
- confetti for normal actions
- excessive screen shake
- giant popups every action

The main reward is:
**successful operation**, not visual noise.

---

# 44. CUSTOMER FLOW REALISM

Customers should:
- wait
- browse
- request
- fit
- decide
- queue
- pay
- leave

Do not auto-teleport through all states instantly.

But do not simulate walking so slowly that gameplay becomes tedious.

Balance realism with usability.

---

# 45. STAFF AUTOMATION

Employees can automate repetitive work later.

But:
- player can inspect
- player can intervene
- player can reassign

Early game:
player does most work.

Late game:
management becomes primary.

---

# 46. MULTI-BRANCH SIMULATION

Only active branch needs detailed visual simulation.

Other branches can use aggregate simulation.

Avoid running hundreds of visual NPCs.

Branch outcomes must still use:
- local demand
- staff
- manager
- inventory
- reviews
- costs
- tax
- events

---

# 47. KPI REQUIRED

Store/branch KPI:

- Visitors
- Conversion
- Revenue
- Gross Profit
- Operating Profit
- AOV
- UPT
- Stockout Rate
- Return Rate
- Average Wait
- Review Score
- Cleanliness
- Payroll Ratio
- Shrinkage
- Tax Payable
- Tax Debt
- Branch Health

Do not show all KPI simultaneously in early game.

---

# 48. WHY BUTTON

Every important problem should support:

```text
Vì sao?
```

Example:

```text
Profit down
→ rent high
→ discount high
→ payroll high
```

This is core learning UX.

---

# 49. SAVE / PERSISTENCE

All management outcomes must persist:

- inventory
- employees
- shifts
- tax periods
- tax debt
- branch health
- supplier obligations
- reviews
- incidents
- closures
- finance

Use existing save system or Dexie/IndexedDB.

No loss after closing game.

---

# 50. TESTING REQUIREMENTS

Required tests include:

## Sales
- no revenue before payment
- exact SKU
- no duplicate sale

## Inventory
- shrinkage
- transfer
- adjustment
- return

## Staff
- lateness affects coverage
- absence affects role
- training affects performance

## Tax
- effective date
- tax rule version
- payable calculation
- overdue state
- payment reduces debt
- old periods preserve old rule version

## Branch
- loss state
- restructuring
- closure

## Incident
- no duplicate event
- correct consequence

## Save
- reload restores all states

---

# 51. TAX SAFETY NOTE FOR ANTIGRAVITY

Tax implementation must be treated as a game simulation based on verified current Vietnamese law.

Do not claim legal/tax advisory accuracy beyond verified sources.

If tax law changes:
- add a new rule version
- preserve historical save periods

Never silently rewrite old tax periods.

---

# 52. ACCEPTANCE MATRIX

A feature passes only if:

```text
UI exists
AND
player can interact
AND
business state changes
AND
result persists
AND
failure path exists
AND
feedback is clear
AND
fits Nini UI
```

Otherwise mark PARTIAL.

---

# 53. FINAL MASTER EXECUTION PROMPT FOR ANTIGRAVITY

> Audit the entire existing Nini game against the real playable store-operation requirements. Do not assume a feature is complete because a screen exists. Create or update `docs/UI_FUNCTION_TRACEABILITY.md` mapping every business feature to its UI, player interaction, domain logic, persistence and failure states. Preserve the established Nini 9:16 cute/cozy visual language and interaction grammar. The game must remain manually playable: customers request exact fashion products, the player/staff finds the correct style/color/size, fitting is handled, checkout occurs, and revenue is recognized only after successful payment. Implement and verify store management, exact-SKU inventory, purchasing, supplier receiving, checkout, returns/exchanges, staff hiring, employee roles, shift scheduling, manager performance, cleaning, customer reviews, branch management, cash flow, branch restructuring and closure.
>
> Expand the simulation with realistic operational situations: shoplifting/shrinkage, inventory discrepancies, staff lateness, absence, burnout, wrong-item sales, wrong-size sales, checkout errors, supplier delays, damaged deliveries, equipment failures, customer complaints, negative reviews, queue abandonment, rent increases, local competition, stockout, overstock, dead stock, branch losses, tax debt and branch insolvency. Events must be caused or probability-modified by real game state where possible, not arbitrary RNG spam. Normal days should remain mostly normal; crises should be occasional and meaningful.
>
> Add a Vietnam tax management system designed around versioned, configurable tax rules with effective dates and official source references. Do not scatter or invent tax rates in UI code. Before implementing or updating any tax rule, verify the applicable Vietnamese law from official legal/government/tax authority sources and record the source and effective period. Model only tax obligations appropriate to the simulated business, such as VAT, corporate income tax, relevant employee withholding/e-invoice obligations and late-payment/tax-debt states where applicable. Provide a simple player-facing tax UI showing taxable basis, tax payable, due date, paid amount, overdue amount and current tax debt, with deeper explanation available through a “Vì sao?” or details panel. Preserve historical tax-rule versions in save data.
>
> Every important system must have a real player interaction surface, not just a background number. Use context-specific Nini workstations such as Sales Floor, Fitting Room, Backroom, Receiving Dock, Checkout, Manager Office, Tax/Finance Desk and Branch Overview. Do not turn the game into an ERP dashboard. Avoid excessive loops, reward spam, particle explosions, screen shake, constant flashing alerts or idle-income systems that replace operation. Use only restrained feedback such as soft tap animation, small sparkle, customer expression, gentle warning pulse and a money float only after successful payment.
>
> For every feature, verify: UI exists; action is playable; authoritative state changes; persistence works; failure path exists; result affects related systems; feedback is understandable; and the screen still follows the Nini design system. If any criterion fails, mark the feature PARTIAL and implement the missing layer. Run formatter, lint, typecheck, unit/integration tests and production build before declaring completion.

---

# 54. FINAL PRODUCT STANDARD

The game should feel like:

```text
A cute fashion shop game
where the player truly operates a business
and naturally learns retail management.
```

The player should learn:

- stock management
- exact size/color availability
- customer service
- fitting operations
- checkout
- payroll
- staff scheduling
- employee reliability
- store cleanliness
- reviews
- supplier management
- shrinkage
- taxation
- cash flow
- branch profitability
- restructuring
- business failure/recovery

through actual play, not through passive text or fake automation.
