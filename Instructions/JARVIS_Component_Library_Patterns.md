# JARVIS COMPONENT LIBRARY & INTERACTION PATTERNS
## Detailed Component Behavior, States, and Usage Patterns

---

## 📦 COMPONENT LIBRARY

### COMMAND BAR COMPONENT

#### Structure
```
Command Bar (sticky top container)
├── JARVIS Wordmark (gradient text)
├── Subtext (gray label)
├── Search Input (with icon)
├── Player Selector (dropdown)
├── Load Button (action primary)
└── Live Indicator (with pulsing dot)
```

#### States

**Default State**
- Background opacity: 0.97
- Backdrop blur: 20px
- All elements visible
- Search placeholder text visible

**Search Active State**
- Input border color: var(--orange)
- Dropdown opens below
- Results render with hover states
- Icon remains visible

**Player Selected State**
- Dropdown shows selected player name
- Load Button becomes primary action
- Ready for interaction

**Loading State**
- Load Button text changes to "⚡ LOADING..."
- Button opacity: 0.6
- Cursor disabled

#### Interactions
- Search: debounced input (300ms)
- Dropdown: click outside closes
- Select: updates hidden value
- Load: prevents double-click

#### Keyboard Navigation
- Tab: focus through elements
- Enter in search: trigger search
- Escape: close dropdown
- Arrow keys: navigate dropdown (optional)

---

### HERO SECTION COMPONENT

#### Structure
```
Hero Container (full-width panel)
├── Gradient Overlay (absolute positioning)
└── Hero Body (flex container)
    ├── Photo Section
    │   ├── Image (108x108px)
    │   └── Badge (position absolute bottom)
    ├── Bio Section
    │   ├── Team Label
    │   ├── Name (gradient text)
    │   ├── Attributes (flex row with separators)
    │   ├── Chips (flex wrap)
    │   └── Contract Strip (flex wrap, orange bg)
    └── JARVIS Widget
        ├── Label
        ├── SVG Ring with animated arc
        ├── Score text (centered in ring)
        ├── Letter grade
        ├── Verdict chip
        ├── Risk pill
        └── Comparable box
```

#### Data Binding Points
- `hero-photo`: src dynamically loaded from API
- `hero-photo-badge`: player number (#)
- `hero-team`: team + position string
- `hero-name`: player name (caps)
- `hero-attrs`: data-driven attribute rows
- `bio-chips`: dynamic chip generation
- `contract-strip`: contract data mapping
- `jarvis-score-num`: 0-100 number
- `jarvis-letter`: A+ through F
- `jarvis-verdict`: verdict type (acquire/monitor/avoid/hold)
- `risk-pill`: risk level (low/med/high)
- `jarvis-comp`: comparable player text

#### Visual States

**Loading State**
- Skeleton loaders in place of text
- Placeholder image (gray gradient)
- Dimension bars empty/minimal

**Data Loaded State**
- Fade-in animation (0.4s ease-out)
- All values populated
- Ring arc animates to score value
- Dimension bars fill dynamically

**Error State**
- Placeholder image remains
- Text shows "Data unavailable"
- JARVIS score shows "--"
- Error message in insights

#### Animations
- Ring arc: 1s cubic-bezier(.4,0,.2,1) when loaded
- Fade in: 0.4s ease-out on load
- Dimension fill: 0.9s cubic-bezier on update
- Pulsing dot: 1.6s infinite

---

### DIMENSION BAR SYSTEM

#### Structure (3-Column Grid)
```
Dimensions Container
├── Column 1: Hitting Dimensions
│   ├── Group Title
│   └── 6 Dimension Rows (each with label, track, value)
├── Column 2: Pitching Dimensions
│   ├── Group Title
│   └── 6 Dimension Rows
└── Column 3: Value Dimensions
    ├── Group Title
    └── 7 Dimension Rows
```

#### Dimension Row Anatomy
```
Dimension Row
├── Label (108px min-width, right-aligned)
├── Track Container (flex-1)
│   └── Fill Bar (animated, color-coded)
└── Value Display (30px min-width, right-aligned)
```

#### Color Mapping (by fill percentage)
- 90-100%: red (elite)
- 75-89%: orange (above avg)
- 60-74%: gold (average)
- 40-59%: blue (below avg)
- 0-39%: gray (poor)

#### Data Binding
- Label: dimension name string
- Track fill: percentage value (0-100)
- Color: determined by percentage band
- Value display: numeric score

#### Responsive Behavior
```
Desktop (1200px+): 3 columns
Tablet (900-1199px): 2 columns (shift to grid-template-columns: 1fr 1fr)
Mobile (<900px): 1 column (full width)
```

---

### INSIGHT BOX SYSTEM

#### Structure
```
Insights Container (3-column grid, gap 10px)
├── Insight Card 1 (elite/positive)
├── Insight Card 2 (strength/value)
└── Insight Card 3 (unique/positioning)
```

#### Insight Card Anatomy
```
Insight Card
├── Left Border (3px, color-coded)
├── Icon/Emoji (inline, margin-right 4px)
├── Bold Title (with colon)
└── Description Text (normal weight, line-height 1.6)
```

#### Variants

**Positive (Elite, Success)**
- Border: green (#4dce8a)
- Background: rgba(77,206,138,.12)
- Text color: rgba(77,206,138,.8)
- Icon: 🔴 red emoji

**Warning (Monitor, Value)**
- Border: gold (#f5c842)
- Background: rgba(245,200,66,.12)
- Text color: rgba(245,200,66,.8)
- Icon: 🟢 green emoji

**Info (Unique, Positioning)**
- Border: blue (#5ab4f5)
- Background: rgba(90,180,245,.12)
- Text color: rgba(90,180,245,.8)
- Icon: 🔵 blue emoji

#### Content Pattern
- Title: 2-4 words, bold
- Description: 1-2 sentences, specific stat/comparison
- Emoji: contextual to message

---

### TAB NAVIGATION SYSTEM

#### Structure
```
Tab Navigation Container (flex, gap 2px, overflow-x auto)
├── Tab 1 (Overview)
├── Tab 2 (Statcast)
├── Tab 3 (Splits)
├── Tab 4 (Scouting)
├── Tab 5 (Arsenal)
├── Tab 6 (Projections)
├── Tab 7 (Fantasy)
└── Tab 8 (Trade Value)
```

#### Tab States

**Default State**
- Background: transparent
- Color: var(--text-dim)
- Border-bottom: none
- Cursor: pointer

**Hover State**
- Background: rgba(255,255,255,.05)
- Color: #fff (brighter)
- Transition: 0.15s

**Active (On) State**
- Background: rgba(232,114,42,.16)
- Color: var(--orange)
- Box-Shadow: 0 0 16px rgba(232,114,42,.08)
- Border-Bottom: implicit from background

#### Interaction Behavior
- Click: toggle on state, hide all panes, show matching pane
- Tab index follows DOM order
- Only one tab can be "on" at a time
- Smooth fade-in for pane content (0.3s)

#### Responsive Behavior
- Desktop: all tabs visible
- Tablet: all tabs visible, may scroll horizontally
- Mobile: may need to reduce font-size to 10px

#### Keyboard Accessibility
- Tab key: focus next
- Shift+Tab: focus previous
- Arrow Right: next tab (optional advanced)
- Arrow Left: previous tab (optional advanced)
- Enter/Space: activate

---

### PANEL CONTAINER SYSTEM

#### Structure
```
Panel (reusable wrapper)
├── Panel Title
│   ├── Title Text (orange)
│   └── Badge (optional)
├── Content Area
│   ├── Section Title (optional)
│   ├── Stat Cells Grid (optional)
│   ├── Data Table (optional)
│   ├── Grade Rows (optional)
│   └── Other content
└── Footer (optional)
```

#### Panel Title Anatomy
```
Panel Title (flex, space-between)
├── Left: Title + Badge
│   ├── Title Text (17px Bebas Neue, orange)
│   └── Badge (9px Barlow Condensed, gray bg)
└── Right: Control (optional)
    └── Button or Status indicator
```

#### Content Area Patterns

**Grid Layout**
```
grid-template-columns: 1fr 1fr (or 1fr 1fr 1fr 1fr)
gap: 14px (or 10px for tight layouts)
Responsive: 2 col → 1 col at <900px
```

**Table Layout**
```
width: 100%
border-collapse: collapse
font-size: 12-13px
Row hover: background rgba(255,255,255,.025)
```

**List Layout**
```
flex-direction: column
gap: 5-8px
border-bottom: 1px solid rgba(255,255,255,.03)
```

#### Panel States

**Empty State**
- Background visible
- Center: "No data available" message
- Gray text color
- Appropriate icon (📭)

**Loading State**
- Skeleton loaders for each content piece
- Pulsing animation (opacity 0.6 → 1)
- Same dimensions as final content

**Error State**
- Red text color
- Error icon (⚠️)
- Retry button (optional)
- Error message in gray text below

**Data Loaded State**
- Fade-in animation (0.3s ease-out)
- All content visible
- Interactive states available

---

### STAT CELL COMPONENT

#### Structure
```
Stat Cell (individual card)
├── Label (uppercase)
├── Value (large number)
└── Subtext (gray, small)
```

#### Variants

**Standard Stat**
- Background: rgba(13,28,58,.6)
- Border: 1px solid rgba(255,255,255,.06)
- Text: white
- Value size: 27px

**Colored Stat**
- Label color: varies (orange/red/green/gold)
- Value color: matches label
- Border color: matches or subtle variant
- Emphasis via color, not size

**Compact Stat** (when space limited)
- Padding reduced to 8px 10px
- Font sizes reduced by 1-2px
- Still maintains hierarchy

#### Content Pattern
- Label: 1-2 words, abbreviation OK
- Value: number, percentage, or short text
- Subtext: context, ranking, or comparison

#### Interactive Behavior
- Hover: optional subtle background shift
- Tooltip on hover: optional full label
- No action required (display only)

---

### DATA TABLE COMPONENT

#### Structure
```
Data Table
├── Header Row
│   ├── TH cells (8-11 columns)
│   └── Right-aligned (default), left-aligned (first column)
└── Body Rows
    ├── TD cells (matching column count)
    └── Color-coded values (using semantic classes)
```

#### Header Cell Styling
- Font: 9px Barlow Condensed, 700, uppercase
- Color: var(--text-dim)
- Border-bottom: 1px solid var(--navy-border)
- Padding: 8px 9px
- Text-align: right (except first column)

#### Body Cell Styling
- Font: 13px Barlow Condensed, 600
- Color: white (default), semantic class override
- Border-bottom: 1px solid rgba(255,255,255,.03)
- Padding: 8px 9px
- Font-weight: 700 (first column only)
- Text-align: right (except first column)

#### Row Hover Effect
- Background: rgba(255,255,255,.025)
- Transition: 0.12s ease
- Cursor: default (not a link)

#### Semantic Value Coloring
```
val-elite (.val-elite): red text + 700 weight
val-above (.val-above): orange text
val-good (.val-good): green text
val-dim (.val-dim): gray text (default)
```

#### Responsive Behavior
```
Desktop: all columns visible
Tablet (900px+): all columns visible, slight font reduction
Mobile (<900px): horizontal scroll OR columns hidden (choose pattern)
```

---

### GRADE ROW COMPONENT

#### Structure
```
Grade Row
├── Tool Label (116px min-width)
├── Description (flex-1)
├── Grade Track (max-width 150px)
│   ├── Fill bar (animated)
│   └── Color-coded background
├── Grade Box (36x36px)
│   ├── Grade number/letter
│   ├── Colored background
│   └── Matching text color
└── Projection Text (30px min-width)
    └── Future grade (gray text, smaller)
```

#### Grade Box Color System
```
g80: red bg, red text - elite tier (80-89 grade)
g70: orange bg, orange text - above average (70-79)
g60: gold bg, gold text - average (60-69)
g55: green bg, green text - plus (55-59)
g50: blue bg, blue text - average (50-54)
g45: gray bg, gray text - below average (45-49)
g40: very gray bg, gray text - poor (0-44)
```

#### Grade Track Display
- Length: flex-1, max 150px
- Height: 8px
- Background: rgba(255,255,255,.05)
- Filled portion: colored (matches grade box)
- Animation: smooth fill 0.7s on load/update
- Purpose: visual representation of grade strength

#### Projection Format
- Font: 10px Barlow Condensed, 700, gray
- Text: "(XX)" format, e.g., "(65)"
- Right-aligned
- Optional: show arrow (↑/↓) if trending

#### Content Pattern
- Label: tool name (Hit Tool, Power, etc.)
- Description: 1 brief sentence on strength/weakness
- Current Grade: 20-80 scale
- Projection: future grade in parentheses

---

### PITCH CARD COMPONENT

#### Structure
```
Pitch Card
├── Colored Stripe (4px top, color per pitch type)
├── Card Body
│   ├── Top Section (flex, space-between)
│   │   ├── Pitch Name + Description
│   │   └── Usage Percentage (right-aligned, large)
│   ├── Metrics Grid (5 columns)
│   │   ├── Velocity Cell
│   │   ├── Spin Cell
│   │   ├── Movement Cell
│   │   ├── Special Cell
│   │   └── Rating Cell
│   └── Optional Table (detailed stats)
└── Notes Section (optional)
```

#### Pitch Type Colors
- **Four-Seam Fastball**: red stripe
- **Sweeper**: gold/yellow stripe
- **Splitter**: blue stripe
- **Changeup**: orange stripe
- **Curveball**: purple stripe
- **Sinker**: green stripe

#### Metrics Cell Anatomy
```
Cell (13px font)
├── Label (8px, uppercase, gray)
├── Value (17px Bebas Neue, bold)
└── Delta (9px, colored arrow + text)
    ├── Up: ▲ green
    ├── Down: ▼ red
    └── Flat: — gray
```

#### Pitch Name Display
- Font: 18px Bebas Neue, 700
- Color: matches stripe color
- Description: 10px gray, secondary info
- Usage: 28px Bebas Neue, right-aligned, percentage

#### Responsive Behavior
```
Desktop: full metrics visible
Tablet: metrics grid may wrap
Mobile: metrics stack (optional, or horizontal scroll)
```

---

### FLAG CARD COMPONENT

#### Structure
```
Flag Card (alert/insight container)
├── Icon (emoji, 17px, left-aligned)
├── Content
│   ├── Title (13px Barlow Condensed, 700)
│   ├── Description (11px, gray, line-height 1.5)
│   └── Optional Data (table, badge, etc.)
└── Optional Actions (right-aligned)
```

#### Variants

**Risk Flag** (red accent)
- Border-left: 3px solid red
- Background: rgba(232,90,90,.15)
- Icon: 🔴 or ⚠️

**Positive Flag** (green accent)
- Border-left: 3px solid green
- Background: rgba(77,206,138,.15)
- Icon: 🟢 or ✓

**Neutral Flag** (blue accent)
- Border-left: 3px solid blue
- Background: rgba(90,180,245,.15)
- Icon: 🔵 or ℹ️

**Warning Flag** (gold accent)
- Border-left: 3px solid gold
- Background: rgba(245,200,66,.15)
- Icon: 🟡 or ⚡

#### Title Pattern
- 2-3 words, concise
- Severity level in parentheses (optional)
- Risk pill inline: `— (span.risk-pill)`

#### Description Pattern
- 1-3 sentences
- Specific numbers/stats when relevant
- Context on why this matters

#### Interactive Flags
- Optional: expand/collapse for details
- Optional: action buttons (View, Retry, etc.)
- Default: display only

---

### PERCENTILE BUBBLE COMPONENT

#### Structure
```
Percentile Row (4-column grid)
├── Metric Label (130px)
├── Bubble (34px)
│   ├── Background (colored, opacity 0.22)
│   ├── Centered Text (colored, bold)
│   └── Number (0-100)
├── Track Bar (flex-1, 1fr)
│   ├── Container (background rgba, 10px height)
│   └── Fill (animated width, matching color)
└── Raw Value (58px)
    ├── Text (11px, 700 weight)
    └── Right-aligned
```

#### Bubble Color System (by score band)
```
90-100: red (elite)
75-89: orange (above avg)
60-74: gold (average)
40-59: blue (below avg)
0-39: gray (poor)
```

#### Track Fill Animation
- Default: 0% width on load
- Animation: width increases to percentile value
- Duration: 0.8s cubic-bezier(.4,0,.2,1)
- Easing: smooth acceleration

#### Value Display Format
- Metric: statistic name (xwOBA, Exit Velocity, etc.)
- Percentile: 0-100 number in bubble
- Raw: actual value with unit (mph, %, etc.)

#### Interactive Behavior
- Hover: optional tooltip with description
- Click: optional link to detailed explanation
- Default: display only

---

### VERDICT CHIP COMPONENT

#### Structure
```
Verdict Chip (inline badge)
├── Background (colored, low opacity)
├── Text (colored, bold)
├── Border (colored, subtle)
└── Border-Radius: 20px (pill shape)
```

#### Verdict Types

**Acquire (Green)**
- Background: var(--green-dim)
- Text: var(--green)
- Border: 1px solid rgba(77,206,138,.25)
- Text: "PRIORITY ACQUISITION" or "STRONG BUY"

**Monitor (Gold)**
- Background: var(--gold-dim)
- Text: var(--gold)
- Border: 1px solid rgba(245,200,66,.22)
- Text: "MONITOR CLOSELY" or "HOLD"

**Avoid (Red)**
- Background: var(--red-dim)
- Text: var(--red)
- Border: 1px solid rgba(232,90,90,.22)
- Text: "AVOID" or "PASS"

**Hold (Blue)**
- Background: var(--blue-dim)
- Text: var(--blue)
- Border: 1px solid rgba(90,180,245,.22)
- Text: "HOLD" or "MONITOR"

#### Placement
- Typically inline with other verdict indicators
- Usually in hero section or summary area
- Can appear in multiple contexts

---

## 🔄 INTERACTION PATTERNS

### Data Loading Flow
```
1. Component mounts
2. Show skeleton/placeholder state
3. Fetch data from API
4. Validate response
5. Animate in actual values
6. Show error state if fail
7. Provide retry mechanism
```

### Hover Effects Hierarchy
```
Level 1 (Subtle): Text color change (0.15s)
Level 2 (Medium): Background shift (0.15s)
Level 3 (Strong): Shadow/scale change (0.2s)
Level 4 (Heavy): Border color + background (0.2s)
```

### Error Handling Pattern
```
1. Show error message (red text, 11px)
2. Display error icon (⚠️ or 🚨)
3. Provide context ("Data unavailable", "Network error", etc.)
4. Optional: show last known value (dimmed)
5. Optional: provide retry button
```

### Focus States (Keyboard Navigation)
```
All interactive elements:
- Outline: 2px solid var(--orange)
- Outline-offset: 2px
- Transition: 0.15s
- High contrast for accessibility
```

---

## 📊 DATA BINDING PATTERNS

### Component Props/Data Structure
```javascript
Player Profile Data: {
  id: number,
  name: string,
  team: string,
  number: number,
  position: string,
  bats: string,
  throws: string,
  height: string,
  weight: number,
  dob: date,
  nationality: string,
  
  // Contract
  contract: {
    total: string ($700M),
    years: number (10),
    aav: number (46),
    deferred: number (68),
    faEligible: year
  },
  
  // JARVIS Score
  jarvisScore: number (0-100),
  jarvisGrade: string (A+, A, B+, etc.),
  verdict: enum (acquire, monitor, avoid, hold),
  riskLevel: enum (low, med, high),
  comparable: string,
  
  // Dimensions
  dimensions: {
    hitting: {
      hitTool: number,
      rawPower: number,
      gamePower: number,
      plateDiscipline: number,
      contactQuality: number,
      speed: number
    },
    pitching: {
      stuff: number,
      command: number,
      arsenal: number,
      whiffGen: number,
      gb: number,
      deception: number
    },
    value: {
      warProj: number,
      contractVal: number,
      health: number,
      ageCurve: number,
      fantasy: number,
      orgFit: number
    }
  },
  
  // Stats
  batting2026: {
    g: number,
    pa: number,
    avg: number,
    obp: number,
    slg: number,
    ops: number,
    hr: number,
    rbi: number,
    woba: number,
    warProj: number
  },
  
  pitching2026: {
    gs: number,
    ip: number,
    era: number,
    fip: number,
    k9: number,
    bb9: number,
    csw: number,
    whip: number
  },
  
  // Percentiles (0-100)
  statcast: {
    xwoba: number,
    xba: number,
    xslg: number,
    exitVelo: number,
    barrel: number,
    hardHit: number,
    batSpeed: number,
    sprintSpeed: number
  },
  
  // Grades (20-80)
  scouting: {
    hitting: {
      hitTool: number,
      rawPower: number,
      gamePower: number,
      discipline: number,
      speed: number
    },
    pitching: {
      fastball: number,
      sweeper: number,
      splitter: number,
      command: number,
      deception: number
    }
  },
  
  // Pitch Arsenal
  pitches: [
    {
      type: string (Fastball, Sweeper, etc.),
      color: hex,
      usage: number (0-100%),
      velocity: number,
      spin: number,
      movement: {
        hb: number,
        ivb: number,
        drop: number
      },
      whiff: number,
      stuff: number,
      stats: object
    }
  ],
  
  // Insights
  insights: [
    {
      type: enum (elite, value, unique),
      icon: emoji,
      title: string,
      description: string
    }
  ],
  
  // Risks
  risks: [
    {
      type: enum (injury, regression, workload, market, age),
      level: enum (low, med, high),
      title: string,
      description: string,
      icon: emoji
    }
  ]
}
```

---

## 🎨 ANIMATION TRIGGER POINTS

### On Page Load
- Hero fade-in: 0.4s ease-out
- JARVIS ring arc: 1s after load
- Dimension bars: staggered 0.1s apart, each 0.9s
- Tab fade: instant (not animated)

### On Data Update
- All bar fills: 0.9s cubic-bezier
- Color changes: 0.2s ease
- Text updates: no animation (instant)
- Hover states: 0.15s

### On Interaction
- Button click: scale 0.98 (0.1s) + opacity change
- Tab switch: fade pane in 0.3s ease-out
- Dropdown open: slide down 0.2s ease-out
- Input focus: border color 0.2s

---

## 📋 ACCESSIBILITY CHECKLIST

- [ ] All text has sufficient color contrast (WCAG AA)
- [ ] Interactive elements have focus states (outline 2px)
- [ ] Touch targets are 44px+ on mobile
- [ ] Form inputs have associated labels
- [ ] Images have alt text (or are decorative)
- [ ] Keyboard navigation works (Tab, Arrow keys, Enter)
- [ ] Screen reader announcements for live updates
- [ ] Error messages are associated with fields
- [ ] Animations respect prefers-reduced-motion
- [ ] Skip links present (optional)

---

## 🔗 STATE MANAGEMENT PATTERNS

### Component States Tree
```
App
├── Hero
│   ├── Loading (skeleton)
│   ├── Loaded (display data)
│   └── Error (show message)
├── TabNav
│   ├── Active (0-8 index)
│   └── Panes hidden/visible
├── Panes (8 variants)
│   ├── Overview
│   │   ├── Loading
│   │   ├── Loaded
│   │   └── Error
│   ├── Arsenal
│   │   └── Similar pattern
│   └── ...
└── Global
    ├── Selected player (store/context)
    ├── Viewport size (responsive)
    └── Preferences (dark/light, etc.)
```

### Event Flow
```
User selects player
→ Update selected player state
→ Trigger data fetch
→ Show loading state in Hero
→ Receive data
→ Animate in values
→ User can interact with tabs
→ Tab click updates active tab index
→ Pane visibility updates
→ Content fades in
```

---

**Component Library Version**: 2.7  
**Last Updated**: May 2026  
**Status**: PRODUCTION READY
