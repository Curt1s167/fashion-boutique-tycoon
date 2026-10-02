# ANTIGRAVITY SPEC — APPLY NINI BRANDING + PWA

**Version:** 1.0  
**Priority:** VERY HIGH  
**Brand:** Nini  
**Purpose:** Apply the supplied Nini branding board and palette to the existing game and configure the web game as an installable mobile PWA without breaking current gameplay, persistence, or package-manager conventions.

---

# 1. REQUIRED INPUTS

Brand source provided in this bundle:

- `public/brand/nini-brand-board.png`
- `public/pwa/nini-192.png`
- `public/pwa/nini-512.png`
- `public/pwa/nini-maskable-512.png`
- `public/pwa/apple-touch-icon.png`
- `public/pwa/favicon-32.png`
- `public/pwa/favicon-48.png`
- `public/manifest.webmanifest`
- `src/styles/nini-theme.css`

Treat the branding board as the visual source of truth for:
- Nini logo
- mascot/character mood
- boutique atmosphere
- color language
- app-icon direction
- cuteness level

Do not redraw the reference tea-game branding. Nini must be its own identity.

---

# 2. FIRST ACTION — AUDIT

Before changing code:

1. Read `package.json`.
2. Detect current package manager from lockfile.
3. Check whether the project is Vite, Next, CRA, Vue, etc.
4. Check whether PWA support already exists.
5. Check current theme system/Tailwind/CSS variables.
6. Check current favicon/manifest/service worker.
7. Check routing/base path/deployment path.
8. Check current save layer.
9. Update `docs/REPO_AUDIT.md` with a Branding & PWA section.

Do NOT create another lockfile.

---

# 3. BRAND NAME MIGRATION

Visible player-facing product name:

```text
Nini
```

Full descriptor where useful:

```text
Nini — Fashion Shop Simulator
```

Update visible:
- app title
- home screen
- loading/splash
- manifest
- document title
- install prompt
- save-slot header if brand is shown
- settings/about

Do not rename internal identifiers blindly if it risks breaking saves or code.

---

# 4. BRAND PALETTE

Use these extracted/specified Nini tokens:

```text
Nini Pink       #FDA0A2
Peach           #FCC7A1
Cream           #FAE2D2
Tan             #DDAA8C
Cocoa           #936451
Mint            #BAD5BC
Powder Blue     #D0E0E2

Surface         #FFF7F3
Surface Strong  #FFE9E5
Text            #5B3B33
Muted Text      #8B6A60
```

Semantic:

```text
Success         #97C8A4
Warning         #F2C879
Danger          #E98282
```

Use CSS/theme tokens, not repeated literal values inside components.

---

# 5. COLOR ROLE

Primary Nini Pink:
- selected states
- primary CTA
- important highlights
- hearts
- brand/logo accents

Cream:
- main panels
- dialogue surfaces
- cards

Cocoa:
- warm outline
- primary text/accent outline

Mint:
- success
- available
- positive operational status

Powder Blue:
- secondary info
- utility panels
- calm management surfaces

Peach:
- supporting accent
- warning-adjacent friendly emphasis

Do not make every surface pink. The UI should remain readable and soft.

---

# 6. VISUAL APPLICATION

Apply Nini style consistently to:

## Main store
- HUD
- customer request bubble
- patience bar
- tutorial banner
- rack labels
- size chips
- preparation table
- fitting room controls
- POS
- stock warning

## Management
- inventory
- staff
- shift scheduler
- reviews
- finance
- branch cards
- map pins
- analytics cards

## System
- save slots
- settings
- install-PWA card
- loading/splash
- empty/error states

---

# 7. BRAND ART USAGE

Use the branding board as reference, not as one giant runtime UI image.

Use production assets:
- cropped icon files supplied here for PWA
- logo/character art extracted or recreated as project assets only where needed
- do not use the full branding-board screenshot as an interactive screen background

If additional crops are needed:
- preserve quality
- avoid text being rasterized when dynamic
- maintain safe margins

---

# 8. LOGO PLACEMENT

Recommended:
- splash/loading
- main menu/home
- install prompt
- about/settings
- marketing/share card

Do not permanently occupy too much game-screen space with the logo during active store operations.

The HUD can use a small Nini mark/icon rather than full wordmark.

---

# 9. PWA GOAL

The web game must be installable to the user's phone home screen where supported.

Desired experience:

```text
Browser
→ Open Nini
→ Install/Add to Home Screen
→ Nini icon appears on Home Screen
→ Tap icon
→ Game opens in standalone portrait mode
→ Save data persists
```

PWA is additive to the existing web game.

---

# 10. PWA LIBRARY POLICY

If the project is Vite and has no existing PWA system:

Preferred:
```text
vite-plugin-pwa
```

Install with the current package manager only.

Examples are illustrative:

```text
npm install -D vite-plugin-pwa
pnpm add -D vite-plugin-pwa
yarn add -D vite-plugin-pwa
```

Run only the command matching the existing lockfile.

If the project already has:
- service worker
- Workbox
- PWA plugin
- framework-native PWA support

reuse it.

Do not add duplicate PWA systems.

---

# 11. MANIFEST REQUIREMENTS

Use/adapt `public/manifest.webmanifest`.

Required values:

```json
{
  "name": "Nini — Fashion Shop Simulator",
  "short_name": "Nini",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#FDA0A2",
  "background_color": "#FFF7F3"
}
```

Icons:
- 192x192
- 512x512
- maskable 512x512

Validate actual deployed URLs.

If app uses a non-root base path, fix `start_url`, `scope`, and asset URLs accordingly.

---

# 12. HTML / HEAD

Ensure the project outputs equivalent metadata:

```html
<meta name="viewport"
      content="width=device-width, initial-scale=1, viewport-fit=cover">

<meta name="theme-color" content="#FDA0A2">

<link rel="manifest" href="/manifest.webmanifest">
<link rel="apple-touch-icon" href="/pwa/apple-touch-icon.png">
```

Set page title:

```text
Nini — Fashion Shop Simulator
```

Adapt paths for project base path.

---

# 13. SAFE AREA

Portrait game must support device notches/home indicators.

Use equivalent of:

```css
padding-top: env(safe-area-inset-top);
padding-right: env(safe-area-inset-right);
padding-bottom: env(safe-area-inset-bottom);
padding-left: env(safe-area-inset-left);
```

Do not let:
- HUD
- pause
- settings
- bottom controls

sit under device cutouts.

---

# 14. STANDALONE MODE

When launched from home screen:
- app should remain usable without browser chrome
- portrait 9:16 game viewport remains centered/scaled correctly
- routing works after reload
- direct deep links do not break where applicable
- safe area works

Do not assume browser toolbar dimensions.

---

# 15. SERVICE WORKER / ASSET CACHE

Cache stable application-shell assets appropriately:
- JS/CSS
- Nini icons
- common UI sprites
- small core scene assets
- fonts where licensing allows

Be careful with large game assets:
- do not precache the entire future game blindly
- use runtime caching/lazy asset loading where suitable
- invalidate old assets correctly after updates

A PWA update must not trap users forever on an old incompatible build.

---

# 16. SAVE DATA IS SEPARATE FROM PWA CACHE

PWA asset cache != save game.

Authoritative local game save remains:
- Dexie/IndexedDB or current equivalent

PWA setup must not replace save architecture.

Do not wipe IndexedDB during ordinary service-worker update.

Test:
- install app
- play
- close app
- reopen
- save remains
- update service worker
- save remains

---

# 17. INSTALL UX

Add a cute Nini install surface where supported.

Example:

```text
Cài Nini vào màn hình chính ♡

Mở shop nhanh hơn
và chơi như một ứng dụng.

[Cài Nini]
[Để sau]
```

Use Nini icon/character.

Do not show install CTA if:
- app is already running standalone
- browser does not expose install flow

---

# 18. CHROMIUM INSTALL FLOW

If browser supports `beforeinstallprompt`:
- capture event
- prevent automatic prompt if custom UI is used
- show Nini install CTA
- call `prompt()` only after user action
- clear saved prompt after completion

Do not repeatedly nag after user dismisses.

Persist a soft "remind later" cooldown if desired.

---

# 19. IOS INSTALL FLOW

Do not pretend programmatic installation is available if it is not.

On iPhone/iPad Safari, show a cute instructional sheet when appropriate:

```text
Thêm Nini vào màn hình chính

1. Nhấn Chia sẻ
2. Chọn “Add to Home Screen”
3. Chọn “Open as Web App” nếu hệ thống hiển thị
4. Nhấn Add
```

Use icons/illustrations and concise text.

Allow:
- close
- don't show again / remind later

---

# 20. INSTALLED DETECTION

Detect standalone state using appropriate supported checks.

When installed:
- hide install button
- optionally show small "Đã cài" state
- do not show browser-specific instructions

---

# 21. OFFLINE EXPERIENCE

Minimum:
- app shell loads where cached
- existing local save can be read
- clear friendly status if an uncached remote resource is unavailable

Do not promise full offline gameplay unless all required assets/data are actually available.

Use Nini-styled offline messaging.

---

# 22. UPDATE UX

When a new service-worker version is ready:

Use a friendly non-destructive prompt:

```text
Nini có phiên bản mới ✨
Cập nhật để nhận các cải tiến mới nhé.

[Cập nhật]
[Để sau]
```

Do not reload in the middle of a checkout/payment transaction.

Safe update points:
- home screen
- pause
- end of day
- after transaction completion

---

# 23. SPLASH / LOADING

Use Nini branding:
- Nini icon or wordmark
- cream/pink surface
- small cute loading feedback

Keep load screen lightweight.

Do not display the full large brand-board image as the splash if it slows startup.

---

# 24. APP ICON REQUIREMENTS

Use supplied icons:

```text
/pwa/nini-192.png
/pwa/nini-512.png
/pwa/nini-maskable-512.png
/pwa/apple-touch-icon.png
```

Maskable icon includes additional safe-area padding.

Test icon appearance on:
- rounded square
- circle-like mask
- Android adaptive icon masks where relevant

---

# 25. THEME CSS

A reference theme file is included:

`src/styles/nini-theme.css`

Antigravity must either:
- import it
or
- translate its tokens into the project's existing Tailwind/theme/token architecture.

Do not create parallel conflicting theme systems.

---

# 26. TAILWIND PROJECT

If Tailwind exists:
map Nini tokens to Tailwind theme/CSS variables.

Examples:
- `nini-pink`
- `nini-cream`
- `nini-cocoa`
- `nini-mint`
- `nini-blue`

Prefer CSS variables so runtime/components remain semantically themed.

---

# 27. ACCESSIBILITY

Nini's cute palette must still meet usability needs.

Validate:
- readable text contrast
- selected state not shown only by pink color
- warning/success include icon/text
- touch targets
- reduced motion
- screen-reader labels for install controls

---

# 28. TESTS

Required PWA checks:

1. manifest loads
2. icon URLs return 200
3. service worker registers in production
4. app starts from root/start_url
5. standalone portrait layout works
6. safe-area layout works
7. custom install button only appears when eligible
8. installed mode hides install CTA
9. iOS guide can be opened/dismissed
10. app update does not delete save
11. browser close/reopen preserves IndexedDB save
12. installed app close/reopen preserves save
13. offline cached shell has a graceful experience

Brand checks:
1. page/app name is Nini
2. old visible brand names removed
3. Nini palette tokens used
4. no random competing primary palette
5. PWA icons use supplied Nini asset

---

# 29. QUALITY COMMANDS

After implementation run all available:

```text
format
lint
typecheck
tests
build
```

Additionally:
- run production preview
- inspect manifest
- inspect service worker
- test mobile viewport
- test Add to Home Screen/Install where possible

---

# 30. ANTIGRAVITY IMPLEMENTATION PROMPT

> Apply the supplied Nini branding assets and palette to the existing game as the primary visual identity. Read `docs/ANTIGRAVITY_NINI_BRAND_PWA_IMPLEMENTATION_SPEC.md` before editing. Audit the current theme, package manager, PWA/service-worker setup, favicon, manifest, save layer and deployment base path first. Use the supplied Nini icon assets and brand board; do not create a competing brand. Translate the Nini palette into the existing theme/token system and apply it consistently across the store HUD, customer request UI, tutorial banners, fitting, POS, inventory, staff, reviews, finance, branches, map, save screens and settings while preserving readability and the cute/cozy UX specs. Then make the existing web game installable as a PWA. If the project is Vite and has no PWA solution, install `vite-plugin-pwa` with the existing package manager only; otherwise reuse the current PWA system. Configure manifest name `Nini — Fashion Shop Simulator`, short name `Nini`, standalone display, portrait orientation, Nini theme/background colors, supplied 192/512/maskable icons, Apple touch icon, safe-area CSS and viewport-fit=cover. Add a cute in-game install card for supported Chromium browsers and an iOS Add-to-Home-Screen instruction sheet. Keep IndexedDB/Dexie save data separate from service-worker caches and verify that install, close/reopen and service-worker updates do not delete or duplicate game progress. Do not auto-reload during an active payment transaction. Run format/lint/typecheck/tests/build and production-preview validation before completion.

---

# 31. DEFINITION OF DONE

Complete only when:

- the game visibly uses Nini identity
- Nini palette is centralized
- Nini logo/icon appears in appropriate brand surfaces
- old visible product branding is removed
- active gameplay remains uncluttered
- PWA manifest is valid
- icons are valid
- app can be installed where supported
- iOS gets proper install instructions
- installed launch uses standalone portrait presentation
- safe-area works
- save survives close/reopen
- save survives normal PWA update
- no second package-manager lockfile exists
- build/tests pass
