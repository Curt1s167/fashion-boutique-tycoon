# ANTIGRAVITY SPEC — CUTE ART DIRECTION & GAME VISUAL SYSTEM

**Version:** 1.0  
**Priority:** VERY HIGH  
**Applies to:** Fashion Retail Business Simulator  
**Goal:** Make the game consistently cute, cozy, tactile, readable, memorable, and emotionally warm without sacrificing business clarity.

---

# 1. ART DIRECTION GOAL

The game should feel like:

```text
Cute boutique management
+ cozy illustrated world
+ tactile mobile toy
+ clear business simulation
```

The player should think:

- "Nhìn đáng yêu quá"
- "Mình muốn chạm vào mấy thứ này"
- "Cửa hàng của mình trông có hồn"
- "Dữ liệu nhiều nhưng không bị khô"
- "Mình muốn quay lại xem shop phát triển"

The game must NOT look like:
- an admin dashboard
- a generic SaaS product
- a finance app
- a spreadsheet with pastel colors
- a realistic retail simulator with cold corporate styling

---

# 2. VISUAL IDENTITY PRINCIPLES

Use these principles throughout the game:

1. Soft
2. Friendly
3. Playful
4. Rounded
5. Tactile
6. Cozy
7. Clear
8. Consistent
9. Fashion-aware
10. Mobile-first

---

# 3. SHAPE LANGUAGE

Primary visual language:

- rounded rectangles
- pill badges
- rounded tabs
- soft cloud-like bubbles
- friendly compact cards
- slightly oversized interactive objects
- softened corners on furniture and panels
- curved dividers rather than harsh straight separators where appropriate

Avoid:
- razor-sharp corners
- overly thin outlines
- technical wireframe appearance
- brutalist layouts
- dense spreadsheet grids as the default presentation

---

# 4. OUTLINE STYLE

Game objects and key UI can use warm outlines.

Recommended direction:

```text
2–4 px equivalent logical outline
warm dark brown / muted charcoal
not pure black where avoidable
```

Use outline consistently across:
- buttons
- cards
- shop props
- product icons
- characters
- badges

Do not mix:
- flat no-outline icons
with
- heavily cartoon outlined objects
without a deliberate hierarchy.

---

# 5. CORNER RADIUS SYSTEM

Create design tokens.

Example:

```text
radius-xs   = compact chip
radius-sm   = small control
radius-md   = card
radius-lg   = important panel
radius-xl   = modal / major cute container
radius-pill = status / tag / small CTA
```

Do not hardcode random border radii in each component.

---

# 6. COLOR SYSTEM

The color palette should be soft, warm, and fashion-friendly.

Recommended families:

## Core neutrals
- warm cream
- soft beige
- warm white
- muted cocoa
- soft charcoal

## Primary accents
- dusty pink
- peach
- soft coral
- lavender
- mint
- butter yellow
- sky blue

## Semantic colors

Success:
- soft mint / green

Warning:
- warm amber / apricot

Danger:
- soft coral / red

Info:
- sky / lavender-blue

Do not use:
- highly saturated neon everywhere
- pure red for every warning
- pure black text on every surface

---

# 7. COLOR TOKEN RULE

Create centralized semantic tokens such as:

```text
--game-bg
--game-surface
--game-card
--game-text
--game-muted
--game-outline
--game-primary
--game-secondary
--game-success
--game-warning
--game-danger
--game-locked
--game-highlight
```

Game logic must reference semantic meaning, not arbitrary color literals.

---

# 8. TYPOGRAPHY

Typography should be:
- rounded
- friendly
- highly readable
- compact enough for portrait layouts
- strong Vietnamese diacritic support

Use a clear hierarchy:

```text
HUD Value
Screen Title
Customer Dialogue
Instruction Banner
Card Title
Body
Meta
Caption
Badge
```

Avoid:
- overly decorative fonts for functional data
- tiny text for critical information
- excessive font-weight variations

Cute does not mean illegible.

---

# 9. TEXT TONE

UI text should feel warm.

Prefer:

- "Khách đang chờ bạn nè!"
- "Kệ này sắp hết hàng"
- "Tuyệt! Khách đã tìm được đúng size"
- "Ca tối hơi thiếu người"
- "Chi nhánh này cần được quan tâm"

Avoid:
- robotic error language
- cold corporate terminology
- overly technical messages in primary UI

Advanced business terms can appear in deeper analytics with short explanation.

---

# 10. CHARACTER ART STYLE

Recommended character direction:

- chibi / super-deformed proportions
- expressive faces
- simple silhouettes
- fashion-conscious outfits
- readable emotions at small size
- clean color blocking
- subtle accessories

Important:
Characters should feel:
- charming
- diverse in fashion style
- visually distinct by role/personality
- not overly detailed for small-screen readability

---

# 11. CUSTOMER EMOTION STATES

Each customer should support readable expressions:

- happy
- excited
- neutral
- curious
- waiting
- impatient
- disappointed
- grateful
- delighted

Use:
- face
- pose
- bubble icon
- small motion

Do not rely only on text.

---

# 12. EMPLOYEE VISUAL IDENTITY

Roles should be identifiable visually without requiring labels every time.

Examples:

Store Manager:
- slightly more formal
- clipboard/tablet
- distinct badge

Sales Advisor:
- fashion-forward
- hanger/tag accessory

Cashier:
- POS badge/apron variation

Stock Associate:
- utility apron/box icon

Cleaner:
- cleaning-tool cue

Fitting Assistant:
- measuring tape / fitting badge

Keep it cute, not costume-like.

---

# 13. PRODUCT ART

Products should be easy to identify at a glance.

Each category needs a distinct silhouette:

- tee
- shirt
- jeans
- dress
- sneaker
- heel
- bag
- hat
- belt

For colorways:
- use real visible color swatches
- product image should update where practical

For sizes:
- use readable badges rather than tiny text hidden on the product.

---

# 14. ICON SYSTEM

Create an original icon library.

Categories:

## Navigation
- home
- store
- inventory
- staff
- reviews
- finance
- map
- settings

## Fashion
- shirt
- pants
- dress
- sneaker
- bag
- hanger

## Operations
- rack
- backroom
- fitting
- scanner
- cashier
- box
- delivery
- cleaning

## Business
- money
- review
- branch
- manager
- shift
- analytics
- warning

Use a consistent stroke/fill/outline style.

Generic icon libraries may be used for minor utility controls, but core identity should use custom icons.

---

# 15. HUD ART DIRECTION

HUD must be:
- compact
- charming
- readable
- not visually dominant

Recommended items:
- pause
- day
- time
- money
- branch
- reputation
- maybe today's revenue

Use illustrated badges/pills.

Avoid:
- giant opaque top bars
- excessive numeric clutter

---

# 16. CUSTOMER REQUEST CARD

This is a key emotional surface.

Use:
- cute avatar
- dialogue bubble
- product thumbnail
- color chip
- size badge
- patience bar

The request card should make the customer feel like a character, not a row in a queue.

---

# 17. PATIENCE BAR

Patience should feel emotional rather than mechanical.

Possible visual language:
- rounded meter
- expression changes as meter falls
- gentle color transition
- tiny clock icon

Avoid:
- harsh flashing red too early
- stressful alarm behavior

---

# 18. INSTRUCTION BANNER

Style:
- rounded ribbon / soft pill
- short instruction
- high contrast
- one clear action

Example:

```text
Bước 1: Chạm Kệ Áo
```

Do not put long paragraphs here.

---

# 19. STORE SCENE ART

The store should feel:
- warm
- lived-in
- charming
- customizable
- visually layered

Scene components:
- walls
- shelves
- racks
- tables
- mannequins
- fitting rooms
- cashier
- backroom access
- plants
- lights
- decorative props

Do not overload the background with detail that competes with gameplay.

Interactive objects must remain visually obvious.

---

# 20. VISUAL DEPTH

Use subtle:
- shadows
- overlap
- foreground/background contrast
- highlights

Avoid:
- flatness that makes interactive objects blend into the background
- heavy realism

---

# 21. INTERACTIVE OBJECT STATES

Every interactive object should have visual states:

```text
idle
hover/focus
pressed
selected
targeted
disabled
locked
attention-needed
completed
```

Examples:
- rack glows when current target
- size chip depresses on tap
- locked drawer has cute padlock badge
- completed order line gains check mark

---

# 22. LOCKED CONTENT

Locked content should feel aspirational, not frustrating.

Use:
- soft silhouette
- cute lock
- preview hint
- unlock condition

Example:

```text
Kệ Túi Xách
Mở khóa ở Level 6
```

Do not hide all information behind a blank padlock.

---

# 23. ANIMATION SYSTEM

Create shared motion tokens:

```text
tap-duration
panel-enter
panel-exit
success-pop
warning-pulse
highlight-loop
reward-float
```

Motion principles:
- soft easing
- quick enough to feel responsive
- slow enough to remain readable

---

# 24. MICRO-ANIMATION LIBRARY

Recommended reusable animations:

- button squash
- card pop
- item pickup bounce
- item drop settle
- customer smile pop
- heart sparkle
- star pulse
- coin/revenue float
- stock fill animation
- review star fill
- branch unlock reveal
- map pin bounce

Do not invent a new animation style for every feature.

---

# 25. CUSTOMER REACTION ANIMATIONS

Correct item:
- smile
- tiny heart/sparkle

Wrong item:
- confused face
- small shake
- soft warning bubble

Perfect fitting:
- delighted pose

Long wait:
- subtle impatient motion

Payment complete:
- happy goodbye

Keep reactions short and readable.

---

# 26. AUDIO ART DIRECTION

Sound should be:
- soft
- bright
- satisfying
- short
- non-fatiguing

Examples:
- tap: soft pop
- pickup: fabric/soft chime
- scanner: gentle beep
- payment: cute register chime
- review: sparkle tone
- warning: soft bell
- branch unlock: warm celebratory flourish

Avoid:
- harsh beeps
- industrial alarms
- repeated loud notification sounds

---

# 27. MUSIC

Music should support:
- cozy shop ambience
- light productivity
- relaxed focus

Possible variations:
- morning
- busy evening
- closing
- special event
- branch opening

Keep loops non-fatiguing.

---

# 28. STORE AMBIENCE

Optional:
- light crowd murmur
- door chime
- fabric/rack movement
- footsteps
- soft POS ambience

Ambience must remain subtle.

---

# 29. BUSINESS DATA PRESENTATION

Data screens must still feel cute.

Use:
- illustrated cards
- small icons
- mini charts
- rounded segments
- advisor mascot/character
- compact explanations

Avoid raw tables as the only presentation.

Tables are acceptable for deep views, but primary summary should be visual.

---

# 30. CHART STYLE

Charts should be:
- simple
- readable
- lightly illustrated
- use consistent semantic colors
- not overly technical

Always explain:
- what changed
- why it matters

---

# 31. MAP ART DIRECTION

For Vietnam/international expansion:

- use friendly branch pins
- store status shown with simple facial/status cue
- profitable branch = positive state
- struggling branch = gentle warning

Map should feel like part of the same illustrated game world.

---

# 32. REVIEW CARD STYLE

Reviews should look like social/game content, not enterprise tickets.

Include:
- customer avatar
- stars
- short comment
- branch
- response status
- cute reaction cue

---

# 33. CRISIS PRESENTATION

Crisis should not visually destroy the cozy tone.

Use:
- clear alert
- slightly more serious colors
- calm wording
- actionable choices

Example:

```text
Chi nhánh Đà Nẵng đang gặp khó
Lợi nhuận giảm 12%

Hãy xem nguyên nhân chính.
```

Avoid:
- flashing red screens
- alarm spam

---

# 34. STORE UPGRADE VISUALS

Upgrades should visibly change the scene.

Examples:
- better lighting
- prettier racks
- larger fitting area
- nicer cashier
- extra decorations
- cleaner store
- better signage

Progress should be visually obvious.

---

# 35. CUSTOMIZATION

Where scope allows, let players personalize:
- store theme
- wall colors
- signage
- counter
- rack style
- employee uniform details
- branch identity

Customization increases emotional attachment.

---

# 36. ASSET PIPELINE

Recommended asset organization:

```text
assets/
├── ui/
├── icons/
├── characters/
│   ├── customers/
│   └── employees/
├── products/
├── store/
│   ├── furniture/
│   ├── backgrounds/
│   └── upgrades/
├── fx/
└── audio/
```

Use:
- SVG for many UI icons
- WebP/PNG for illustrated sprites
- texture atlas when sprite count grows

---

# 37. CONSISTENCY CHECK

Before shipping a screen, Antigravity must verify:

- same outline style
- same corner family
- same typography scale
- same semantic color meanings
- same animation language
- same icon language
- same tone of microcopy

---

# 38. ACCESSIBILITY

Cute must not reduce accessibility.

Requirements:
- readable contrast
- text not too small
- status not communicated only with color
- optional reduced motion
- sound controls
- keyboard support for desktop dialogs
- comfortable touch targets

---

# 39. ART DIRECTION ACCEPTANCE QUESTIONS

For every major screen:

1. Does it feel cute immediately?
2. Is the visual hierarchy clear?
3. Can the player identify the primary action quickly?
4. Are the interactive objects inviting?
5. Do the colors feel warm and consistent?
6. Are animations soft and satisfying?
7. Is important business information still readable?
8. Does it look like the same game as every other screen?
9. Is the screen too visually noisy?
10. Would the player enjoy looking at this for a long session?

---

# 40. ANTIGRAVITY EXECUTION PROMPT

> Apply the Cute Art Direction specification across the project as a coherent design system, not as scattered styling. Build centralized tokens for color, radius, typography, outline, shadow, animation and semantic states. Keep the game portrait/mobile-first, cozy, rounded, tactile and fashion-focused. Use original characters, icons, products and store artwork. Ensure customers and employees are expressive, frequent touch targets feel satisfying, data screens remain game-like, and warnings/crises remain readable without becoming visually harsh. Do not sacrifice clarity or accessibility for cuteness. Reuse the same visual language across store floor, fitting, checkout, inventory, staff, reviews, finance, branches and map.

---

# 41. FINAL STANDARD

The final visual experience should make players feel:

```text
"Mình yêu cửa hàng này."
```

The player should become emotionally attached to:
- the shop
- the employees
- recurring customers
- the growing brand

Cute art is not decoration. It is part of retention, usability, emotional reward and learning.
