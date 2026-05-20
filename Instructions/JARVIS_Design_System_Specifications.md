# JARVIS MLB PLAYER INTELLIGENCE PLATFORM
## UI/UX Design System & Formatting Guide

---

## 📐 COLOR PALETTE

### Primary Colors
- **Orange (Primary Action)**: `#e8722a`
  - Dim variant: `rgba(232,114,42,.14)`
  - Hover: `rgba(232,114,42,.25)`
  - Dark: `#c4561a`

### Alert & Status Colors
- **Red (Alert/Elite)**: `#e85a5a`
  - Dim: `rgba(232,90,90,.12)`
- **Green (Success)**: `#4dce8a`
  - Dim: `rgba(77,206,138,.12)`
- **Gold (Warning)**: `#f5c842`
  - Dim: `rgba(245,200,66,.12)`
- **Blue (Info)**: `#5ab4f5`
  - Dim: `rgba(90,180,245,.12)`

### Navy/Dark Theme
- **Navy (Primary BG)**: `#07102d`
- **Navy Mid**: `#0d1c3a`
- **Navy Light**: `#0f2040`
- **Navy Border**: `#1a2e50`
- **Ultra Dark**: `#020810`

### Text Colors
- **Text Bright**: `#fff`
- **Text Dim**: `#8ca0b8`
- **Text Muted**: `#4a6080`

### Semantic Panel Colors
- **Panel BG**: `rgba(6,14,42,.92)`
- **Panel Border**: `rgba(255,255,255,.07)`

---

## 🔤 TYPOGRAPHY

### Font Stack
```css
Primary Display: 'Bebas Neue', sans-serif
Condensed Labels: 'Barlow Condensed', sans-serif
Body Text: 'Barlow', sans-serif
Monospace: 'JetBrains Mono', monospace
```

### Type Scale

| Usage | Font | Size | Weight | Letter-Spacing |
|-------|------|------|--------|-----------------|
| Hero Name | Bebas Neue | 50px | 700 | 3px |
| Panel Title | Bebas Neue | 17px | 700 | 2.5px |
| Section Title | Bebas Neue | 13px | 700 | 2px |
| Stat Value | Bebas Neue | 27px | 700 | — |
| Label | Barlow Condensed | 8-11px | 700 | 1.5-2px |
| Body | Barlow | 12-13px | 400-600 | — |

---

## 📏 SPACING SYSTEM (Rem/px)

```
4px (xs)   → buttons, small badges
8px (sm)   → gaps, padding small
12px (md)  → padding, gap standard
16px (lg)  → gaps, padding medium
20px (xl)  → padding large, gaps
24px (2xl) → padding xlarge
28px (3xl) → padding header/footer
```

### Application
- **Panel Padding**: 18-22px
- **Section Gap**: 14px (cards), 18px (panels)
- **Border Radius**: 8px (small), 12px (medium), 16-20px (large)

---

## 🎨 COMPONENT SPECIFICATIONS

### Command Bar
```
Height: 56px
Background: rgba(2,8,16,.97)
Backdrop Filter: blur(20px)
Border: 1px solid var(--navy-border)
Padding: 0 24px
Display: flex, align-items: center, gap: 14px
Sticky: top: 0, z-index: 200
```

**Elements:**
- Wordmark: 28px Bebas Neue, gradient text
- Subtext: 10px Barlow Condensed, gray
- Search Input: 360px max-width, 13px, 34px left padding for icon
- Player Select: 200px min-width, dropdown arrow
- Load Button: 16px Bebas Neue, gradient background
- Live Indicator: 10px font, animated green dot

### Hero Section
```
Background: rgba(6,14,42,.92)
Border: 1px solid rgba(255,255,255,.07)
Border-Radius: 20px
Padding: 22px 26px
Margin-Bottom: 14px
Display: flex, gap: 20px, align-items: flex-start
Position: relative
```

**Photo:**
- Size: 108x108px
- Border-Radius: 16px
- Border: 2px solid rgba(255,255,255,.14)
- Badge: position absolute bottom, 14px font, background rgba(0,0,0,.65)

**Bio Section:**
- Team Label: 10px, letter-spacing 3px, orange
- Name: 50px Bebas Neue, gradient text (white → orange)
- Attributes: 12px, flex gap 14px, separator dividers
- Chips: flex gap 6px, background rgba(13,28,58,.8), border 1px panel-border

**Contract Strip:**
- Background: rgba(232,114,42,.07)
- Border: 1px solid rgba(232,114,42,.18)
- Border-Radius: 12px
- Padding: 10px 14px
- Flex: gap 16px

**JARVIS Score Widget:**
- Width: 155px
- Background: rgba(3,8,20,.65)
- Border: 1px solid var(--panel-border)
- Border-Radius: 16px
- Padding: 14px 18px
- Ring: 96x96px SVG, 9px stroke width
- Arc Animation: 1s cubic-bezier(.4,0,.2,1)

### Dimension Bars
```
Grid: 3 columns
Gap: 18px
Padding: 14px 26px
Border-Top: 1px solid panel-border
Background: rgba(3,8,20,.5)

Per Row:
- Label: 11px, min-width 108px
- Track: flex-1, height 7px, radius 4px
- Fill: transition width 0.9s cubic-bezier
- Value: 15px Bebas Neue, min-width 30px
```

### Tab Navigation
```
Background: rgba(3,8,20,.85)
Padding: 5px
Border-Radius: 14px
Border: 1px solid panel-border
Display: flex, gap 2px, overflow-x auto
Margin: 14px 0

Tab:
- Padding: 8px 16px
- Font: 11px Barlow Condensed, 700
- Letter-Spacing: 1.5px
- Cursor: pointer
- Border-Radius: 10px
- Transition: all 0.15s
- Background: transparent (default)

Tab.on:
- Background: rgba(232,114,42,.16)
- Color: var(--orange)
- Box-Shadow: 0 0 16px rgba(232,114,42,.08)
```

### Panel Container
```
Background: rgba(6,14,42,.92)
Border: 1px solid rgba(255,255,255,.07)
Border-Radius: 18px
Padding: 18px 20px
Backdrop-Filter: blur(12px)
Margin-Bottom: 14px

Title:
- Font: 17px Bebas Neue, 700
- Letter-Spacing: 2.5px
- Color: var(--orange)
- Padding-Bottom: 10px
- Border-Bottom: 1px solid panel-border
- Margin-Bottom: 13px
- Display: flex, space-between
```

### Stat Cells
```
Background: rgba(13,28,58,.6)
Border: 1px solid rgba(255,255,255,.06)
Border-Radius: 12px
Padding: 11px 12px
Text-Align: center

Label: 8px, uppercase, gray, letter-spacing 1.5px
Value: 27px Bebas Neue
Subtext: 9px gray, margin-top 2px
```

### Data Tables
```
Font-Size: 12-13px
Border-Collapse: collapse

TH:
- Padding: 8px 9px
- Font: 9px Barlow Condensed, 700, uppercase
- Color: var(--text-dim)
- Border-Bottom: 1px solid var(--navy-border)
- Text-Align: right (default), left (first column)

TD:
- Padding: 8px 9px
- Border-Bottom: 1px solid rgba(255,255,255,.03)
- Text-Align: right (default), left (first column)
- Font-Weight: 700 (first column)

Row Hover:
- Background: rgba(255,255,255,.025)
```

### Grade Rows
```
Display: flex
Align-Items: center
Gap: 10px
Padding: 9px 0
Border-Bottom: 1px solid rgba(255,255,255,.04)

Components:
- Label: 12px, min-width 116px
- Description: 10px, flex-1, gray
- Track: flex-1, max-width 150px, 8px height
- Grade Box: 36x36px, 18px font, border-radius 9px
- Projection: 10px, min-width 30px, right-aligned

Grade Box Colors:
- g80: red bg, red text, red border
- g70: orange bg, orange text, orange border
- g60: gold bg, gold text, gold border
- g50: blue bg, blue text, blue border
```

### Pitch Cards
```
Background: rgba(6,14,42,.9)
Border: 1px solid panel-border
Border-Radius: 14px
Margin-Bottom: 10px
Overflow: hidden

Stripe: 4px colored top bar

Body:
- Padding: 13px 15px

Top:
- Display: flex, space-between
- Margin-Bottom: 11px

Metrics Grid:
- Grid: 5 columns
- Gap: 5px
- Margin-Bottom: 10px

Metric Cell:
- Background: rgba(13,28,58,.7)
- Border-Radius: 8px
- Padding: 6px 5px
- Text-Align: center
- Border: 1px solid rgba(255,255,255,.05)
```

### Flag Cards
```
Background: rgba(13,28,58,.5)
Border-Radius: 10px
Padding: 10px 13px
Border: 1px solid panel-border
Display: flex
Gap: 10px
Margin-Bottom: 8px

Icon: 17px, flex-shrink 0
Title: 13px Barlow Condensed, 700
Description: 11px, gray, line-height 1.5
```

### Percentile Row
```
Display: grid
Grid-Template-Columns: 130px 34px 1fr 58px
Align-Items: center
Gap: 8px

Metric: 11px, 700
Bubble: 32x32px, border-radius 50%, centered content
Track: height 10px, border-radius 5px
Fill: height 100%, animated width
Raw Value: 11px, right-aligned, 700
```

### Risk/Verdict Pills
```
Display: inline-flex
Align-Items: center
Gap: 5px
Padding: 4px 12px
Border-Radius: 20px
Font: 10px Barlow Condensed, 700, uppercase
Border: 1px solid

Variants:
- Low Risk: green text/border on green-dim bg
- Medium Risk: gold text/border on gold-dim bg
- High Risk: red text/border on red-dim bg
```

---

## 🎬 ANIMATIONS & TRANSITIONS

### Global Transitions
```css
Fade In: opacity 0 → 1, 0.4s ease-out
Pulse: scale 1 → 0.7 → 1, 1.6s infinite
Slide Down: translateY(-12px) → 0, 0.4s ease-out
```

### Component Animations
```
Buttons/Links: all 0.15s ease
Text/Color: 0.2s ease
Dimension Bars: width 0.9s cubic-bezier(.4,0,.2,1)
JARVIS Ring Arc: stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)
Data/Tables: hover background 0.12s ease
```

---

## 📱 RESPONSIVE BREAKPOINTS

### Desktop (1200px+)
- 3-column grids
- Full dimension display
- All features visible
- Sidebar optional

### Tablet (900px-1199px)
- 2-column grids
- Dimension bars: 2 columns
- Responsive spacing
- Touch-friendly sizing

### Mobile (<900px)
- 1-column layouts
- Hero: flexible wrap
- Panel padding reduced
- Font sizes adjusted
- Hidden non-essential elements

---

## 🔗 GRID SYSTEMS

### Multi-Column Grids
```css
Grid-2: grid-template-columns: 1fr 1fr; gap: 14px;
Grid-3: grid-template-columns: 1fr 1fr 1fr; gap: 14px;
Grid-4: grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px;
Grid-Profile: grid-template-columns: 1.15fr 1fr 1fr; gap: 14px;
```

### Flex Layouts
```
Row with Wrap: display: flex; gap: 6px; flex-wrap: wrap;
Row no-Wrap: display: flex; gap: 14px; (command bar style)
Column: display: flex; flex-direction: column; gap: 8px;
```

---

## 🎯 VISUAL HIERARCHY

### Primary Elements
- Hero name (50px)
- Panel titles (17px)
- Section titles (13px)

### Secondary Elements
- Stat values (27px)
- Labels (11px)
- Table headers (9px)

### Tertiary Elements
- Descriptions (10-11px)
- Metadata (8-9px)
- Timestamps (9px)

### Color Hierarchy
1. **Orange** (primary action, alerts)
2. **Red** (elite/critical)
3. **Green** (success/positive)
4. **Gold** (warning/average)
5. **Blue** (info/below-average)
6. **White** (primary text)
7. **Gray** (secondary text)

---

## 🎨 SEMANTIC CLASSES

### Color Utilities
```css
.tier-elite { color: var(--red); }
.tier-above { color: var(--orange); }
.tier-avg { color: var(--gold); }
.tier-below { color: var(--blue); }
.tier-poor { color: #6080a0; }

.val-elite { color: var(--red); font-weight: 700; }
.val-above { color: var(--orange); }
.val-good { color: var(--green); }
.val-dim { color: var(--text-dim); }
```

### Background Colors
```css
.bg-elite { background: rgba(232,90,90,.22); }
.bg-above { background: rgba(232,114,42,.2); }
.bg-avg { background: rgba(245,200,66,.18); }
.bg-below { background: rgba(90,180,245,.18); }

.fill-elite { background: var(--red); }
.fill-above { background: var(--orange); }
.fill-avg { background: var(--gold); }
.fill-below { background: var(--blue); }
```

### Spacing Utilities
```css
.mb-2 { margin-bottom: 14px; }
.mt-2 { margin-top: 14px; }
.gap-2 { gap: 14px; }
.p-2 { padding: 14px; }
```

---

## 🔲 BORDER & SHADOW SYSTEM

### Borders
- **Default Panel Border**: `1px solid rgba(255,255,255,.07)`
- **Navy Border**: `1px solid var(--navy-border)`
- **Colored Border** (orange): `1px solid rgba(232,114,42,.18)`

### Shadows
- **Panel Shadow**: `0 8px 32px rgba(0,0,0,.45)`
- **Hover Shadow**: `0 12px 40px rgba(232,114,42,.15)`
- **Card Shadow**: `0 4px 12px rgba(0,0,0,.2)`
- **Inset Shadow**: `inset 0 2px 4px rgba(0,0,0,.3)`

---

## 📐 BORDER RADIUS SCALE

```
Small: 4px (inputs, small badges)
Medium: 8px (buttons, small containers)
Large: 12px (medium panels)
XL: 16px (cards, widgets)
2XL: 20px (hero section)
```

---

## 🔐 Z-Index Scale

```
Base: 0
Grid Background: 0
Content: 1
Command Bar: 200
Dropdown/Modal: 300
```

---

## 📋 LAYOUT PATTERNS

### Page Structure
```
Command Bar (sticky, z-200)
  ↓
Hero Section (full-width, margin-bottom 14px)
  ├─ Photo
  ├─ Bio
  └─ JARVIS Widget
  ↓
  ├─ Dimension Bars
  └─ Insights
  ↓
Tab Navigation (margin 14px 0)
  ↓
Content Panes (display: none / block)
  ↓
Panels (margin-bottom 14px, responsive grid)
```

### Panel Patterns
```
Panel Title (with optional badge)
  ↓
Section Title (optional)
  ↓
Content (grid, table, or list)
```

---

## ✅ DESIGN CHECKLIST

- [ ] All text follows type scale
- [ ] All spacing uses 4px grid
- [ ] All colors from palette
- [ ] Hover states on interactive elements
- [ ] Responsive breakpoints tested
- [ ] Animations smooth and purposeful
- [ ] Borders and shadows consistent
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets 44px+ (mobile)
- [ ] z-index hierarchy respected

---

**Design System Version**: 2.7 PROFESSIONAL GRADE  
**Last Updated**: May 2026  
**Status**: PRODUCTION READY
