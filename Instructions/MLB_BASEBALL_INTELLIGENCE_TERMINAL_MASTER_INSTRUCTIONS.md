# ⚾ MLB BASEBALL INTELLIGENCE TERMINAL — MASTER INSTRUCTION SYSTEM
**AI-Optimized | Modular | Production Blueprint | Canonical Version**

---

## TABLE OF CONTENTS

- [PART 0 — SYSTEM IDENTITY & HARD RULES](#part-0)
- [PART 1 — DATA ARCHITECTURE](#part-1)
- [PART 2 — ANALYTICS ENGINE](#part-2)
- [PART 3 — UI ENGINE (RENDER SYSTEM)](#part-3)
- [PART 4 — KPI ENGINE (META METRICS)](#part-4)
- [PART 5 — INSIGHT ENGINE](#part-5)
- [PART 6 — COMPARISON ENGINE](#part-6)
- [PART 7 — SCOUTING ENGINE](#part-7)
- [PART 8 — VALUATION ENGINE](#part-8)
- [PART 9 — PERFORMANCE & CACHING](#part-9)
- [PART 10 — AI LAYER (JARVIS ENGINE)](#part-10)
- [PART 11 — STRATEGY ENGINE (TANGO CORE / RE24)](#part-11)
- [PART 12 — PROJECTION ENGINE](#part-12)
- [PART 13 — ML SYSTEM (PHASE 3)](#part-13)
- [PART 14 — GM MODE (SIMULATION ENGINE)](#part-14)
- [PART 15 — MILB & PROSPECT SYSTEM](#part-15)
- [PART 16 — FANTASY SYSTEM](#part-16)
- [PART 17 — REAL-TIME STATCAST PIPELINE](#part-17)
- [PART 18 — BACKEND ARCHITECTURE (FASTAPI)](#part-18)
- [PART 19 — DATABASE SCHEMA (POSTGRES)](#part-19)
- [PART 20 — FRONTEND ARCHITECTURE (NEXT.JS)](#part-20)
- [PART 21 — DEPLOYMENT & INFRASTRUCTURE](#part-21)
- [PART 22 — USER SYSTEM, AUTH & ROLES](#part-22)
- [PART 23 — ADMIN PANEL & SCOUTING UPLOAD SYSTEM](#part-23)
- [PART 24 — UI DESIGN SYSTEM & BRANDING](#part-24)
- [PART 25 — MOBILE-FIRST UI SYSTEM](#part-25)
- [PART 26 — PRODUCT LAYER (SAAS FEATURES)](#part-26)
- [PART 27 — LANDING PAGE & MARKETING COPY](#part-27)
- [PART 28 — BUILD ROADMAP (PHASED EXECUTION)](#part-28)

---

<a name="part-0"></a>
## PART 0 — SYSTEM IDENTITY & HARD RULES

### SYSTEM DEFINITION

```
SYSTEM  = "BASEBALL INTELLIGENCE TERMINAL"
MODE    = "FRONT OFFICE / SCOUTING / ANALYTICS"
PURPOSE = Transform raw baseball data into decision-ready outputs
```

### WHAT THIS SYSTEM IS

```
YOU ARE BUILDING:
  → Baseball Intelligence Platform
  → Decision Engine
  → Front Office Tool

YOU ARE NOT BUILDING:
  → A dashboard
  → A stat viewer
  → A fan site
  → A decorative UI tool
```

### NON-NEGOTIABLE HARD RULES

**RULE 1 — NO FABRICATED DATA**
```
IF data == missing:
    display "—"
    DO NOT:
        estimate
        average-fill
        simulate
        hallucinate
```

**RULE 2 — PERCENTILES ARE PRIMARY**
```
USE:
    percentiles
    relative metrics

DO NOT PRIORITIZE:
    raw numbers alone
```

**RULE 3 — RELATIVE CONTEXT REQUIRED**
```
Every output must answer:
    "Compared to league, how good is it?"
```

**RULE 4 — COLOR IS MEANING**

| Percentile Range | Meaning     | Color   |
|------------------|-------------|---------|
| 80–100           | Elite       | Red     |
| 60–79            | Above Avg   | Orange  |
| 40–59            | Average     | Gray    |
| 20–39            | Below Avg   | Blue    |
| 0–19             | Poor        | Dark    |

**RULE 5 — AI CAN SPEAK, NOT INVENT**
```
AI may:    generate language / summaries
AI CANNOT: generate or fabricate data
```

**RULE 6 — API ROUTING**
```
NEVER:  fetch("https://baseballsavant...")   ← CORS violation
ALWAYS: fetch("/api/savant?...")             ← proxy via your backend

REASON:
    - CORS safety
    - caching
    - consistent structure
```

---

<a name="part-1"></a>
## PART 1 — DATA ARCHITECTURE

### DATA FLOW (MANDATORY ORDER)

```
CLIENT
  ↓
/api/mlb  OR  /api/savant
  ↓
PROCESSING LAYER
  ↓
ANALYTICS ENGINE
  ↓
UI RENDER ENGINE
```

### DATA SOURCES

**MLB API** provides:
- Roster data
- Splits
- Career statistics

**Baseball Savant** provides:
- xwOBA, xBA, xSLG
- Exit Velocity (EV)
- Barrel%, HardHit%
- K%, BB%, Chase%, Whiff%
- Sprint Speed
- OAA (Outs Above Average)

### INTERNAL DATA TYPE HIERARCHY

```
RAW    → from APIs (unmodified)
DERIVED → calculated from raw
LEAGUE  → arrays for percentile computation
OUTPUT  → percentiles + KPIs (what reaches the UI)
```

### REQUIRED FUNCTIONS — DATA ENGINE

```javascript
function fetchSavantCSV(endpoint, year)
function parseCSV(text)
function normalizeRow(row)
function buildLeagueArrays(rows)
```

**CORE RULES:**
```
DO:
    normalize column names
    parse numbers safely
    cache results

DO NOT:
    pass raw CSV directly into UI
    hit external APIs on user request
```

---

<a name="part-2"></a>
## PART 2 — ANALYTICS ENGINE

### CORE PLAYER MODEL (MANDATORY OBJECT SHAPE)

```javascript
var PlayerAnalyticsModel = {
  info:       {},    // identity data
  raw:        {},    // from APIs
  derived:    {},    // calculated fields
  league:     {},    // arrays for percentile calc
  percentiles:{},    // final computed percentiles
  grouped:    []     // grouped for UI rendering
};
```

### DERIVED METRIC FORMULAS

```javascript
ISO   = SLG - AVG
BB%   = BB / PA
K%    = K / PA
K-BB% = K% - BB%
OPS   = OBP + SLG
wOBA  = (per linear weight formula)
```

### PERCENTILE COMPUTATION ENGINE

```javascript
function computePercentile(arr, val, higherBetter) {
  if (val == null) return null;
  var clean = arr.filter(x => x != null).sort((a, b) => a - b);
  var idx   = clean.findIndex(v => v >= val);
  if (idx < 0) idx = clean.length - 1;
  var pct   = Math.round((idx / clean.length) * 100);
  if (!higherBetter) pct = 100 - pct;
  return Math.max(1, Math.min(99, pct));
}
```

### METRIC DIRECTION MAP (true = higher is better)

```javascript
var METRIC_DIRECTION = {
  XWOBA:   true,
  XSLG:    true,
  HARDHIT: true,
  BARREL:  true,
  BB:      true,
  EV:      true,
  K:       false,   // lower K% is better
  CHASE:   false,   // lower chase is better
  WHIFF:   false    // lower whiff is better
};
```

### METRIC GROUPING SYSTEM

```
VALUE GROUP:
    WAR
    OPS+

BATTING GROUP:
    xwOBA
    xBA
    xSLG
    EV
    Barrel%
    HardHit%

DISCIPLINE GROUP:
    BB%
    K%
    Chase%
    Whiff%
```

### REQUIRED FUNCTIONS — ANALYTICS ENGINE

```javascript
function computePercentile(arr, val, higherBetter)
function buildPercentiles(player, leagueArrays)
function computeKPIs(percentiles)
function generateInsights(percentiles, kpis)
```

### FULL ANALYTICS PIPELINE (TypeScript)

```typescript
// engine/analytics.ts
export function buildPlayerModel(raw: any, league: any) {
  const derived   = computeDerived(raw);
  const pct       = buildPercentiles(raw, league);
  const kpis      = computeKPIs(pct);
  const insights  = generateInsights(pct, kpis);
  return { raw, derived, percentiles: pct, kpis, insights };
}
```

---

<a name="part-3"></a>
## PART 3 — UI ENGINE (RENDER SYSTEM)

### CORE PRINCIPLE

```
UI = PURE RENDER ENGINE (not static HTML)
UI = PURE FUNCTION OF DATA

Input:  { percentiles, kpis, insights }
Output: visual panels
```

### REQUIRED RENDER FUNCTIONS

```javascript
renderPercentiles()          // flat percentile bars
renderPercentilesGrouped()   // grouped by category
renderVertical()             // vertical bar layout
renderRings()                // circular ring indicators
renderKPIs()                 // top KPI strip
renderInsights()             // scouting text insights
```

### PERCENTILE BAR SPECIFICATION

```
TRACK:  gray background
FILL:   colored by percentile value
BUBBLE:
    position: sits ON endpoint
    size:     22px diameter
    content:  percentile number
```

### COLOR ENGINE

```javascript
function pctColor(p) {
  if (p >= 80) return '#C0392B';   // Elite — Red
  if (p >= 60) return '#E8722A';   // Above Avg — Orange
  if (p >= 40) return '#7F8C8D';   // Average — Gray
  if (p >= 20) return '#5AB4F5';   // Below Avg — Blue
  return '#1A3A5C';                 // Poor — Dark
}
```

### THREE-COLUMN LAYOUT

```
LEFT   → Identity + Scouting + Value
CENTER → KPIs + Insights + Percentiles
RIGHT  → Advanced Scouting Panels
```

### UI RULES

```
YES:
    structured panels
    modular rendering
    data-driven components

NO:
    loose elements
    arbitrary decorative text
    raw stat display without context
```

### PLAYER SCREEN STRUCTURE — MLB PLAYER

```
1. HEADER (name, team, position, headshot)
2. KPIs
3. INSIGHTS (scouting-style text)
4. PERCENTILE BARS (grouped)
5. SCOUTING PANELS
6. COMPS
7. FANTASY
```

### PLAYER SCREEN STRUCTURE — PROSPECT / MiLB

```
1. HEADER
2. TOOLS (20–80 scale grades)
3. PROJECTION
4. MLB EQUIVALENT (translated stats)
5. RISK PROFILE
6. COMPS
```

---

<a name="part-4"></a>
## PART 4 — KPI ENGINE (META METRICS)

### PURPOSE

```
Reduce 10+ metrics → 4 decisive KPIs
```

### KPI DEFINITIONS

**CAS — Contact Authority Score**
```javascript
CAS = 0.5 * xwOBA_pct + 0.3 * HardHit_pct + 0.2 * Barrel_pct
```

**DQS — Decision Quality Score**
```javascript
DQS = 0.5 * BB_pct + 0.3 * (100 - K_pct) + 0.2 * (100 - Chase_pct)
// Higher = better plate discipline
```

**DPI — Damage Potential Index**
```javascript
DPI = 0.6 * xSLG_pct + 0.25 * Barrel_pct + 0.15 * EV_pct
```

**TPVI — True Player Value Index**
```javascript
TPVI = weighted blend of CAS + DQS + DPI + WAR_pct
// Represents overall player value signal
```

### KPI COMPUTATION (TypeScript)

```typescript
// engine/kpis.ts
export function computeKPIs(p: any) {
  return {
    CAS:  0.5 * p.xwoba + 0.3 * p.hardhit + 0.2 * p.barrel,
    DQS:  0.5 * p.bb + 0.3 * (100 - p.k) + 0.2 * (100 - p.chase),
    DPI:  0.6 * p.xslg + 0.25 * p.barrel + 0.15 * p.ev,
    TPVI: /* weighted blend of all above + WAR */
  };
}
```

---

<a name="part-5"></a>
## PART 5 — INSIGHT ENGINE

### PURPOSE

Generate scouting-style English statements from data — NO fabrication.

### INSIGHT RULE SYSTEM

```javascript
// engine/insights.ts
export function generateInsights(p: any) {
  let out = [];

  if (p.xwoba  >= 90)                      out.push("Elite production — top-tier offensive profile");
  if (p.xslg   >= 85 && p.barrel >= 80)    out.push("High-damage hitter — elite power profile");
  if (p.chase  >= 75)                      out.push("Chase risk — susceptible to breaking balls away");
  if (p.bb     >= 70 && p.k <= 40)         out.push("Advanced plate approach — elite discipline");
  if (p.barrel > 10)                        out.push("High power profile — elevated HR upside");
  if (p.xwoba  > 80)                        out.push("Elite hitter — consistent hard contact");

  return out;
}
```

### CONTEXTUAL INSIGHT FORMAT

```
WRONG: "High barrel%"
RIGHT: "Top 5% MLB — strong HR upside"

Always include: what the number means relative to league
```

### PRIORITY SORTING

```javascript
// Sort insights by importance weight
// Most impactful metrics surface first
insights.sort((a, b) => b.weight - a.weight);
```

---

<a name="part-6"></a>
## PART 6 — COMPARISON ENGINE

### METHOD

```
Compare PERCENTILE VECTORS — NOT raw stats
```

### SIMILARITY FUNCTION

```javascript
// Compare two players by percentile distance
function similarityScore(p1, p2) {
  const metrics = ['xwoba','xslg','hardhit','barrel','bb','k','chase','sprint'];
  const diffs   = metrics.map(m => Math.abs((p1[m] || 0) - (p2[m] || 0)));
  const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  return Math.round(100 - avgDiff);
}
```

### VECTOR MODEL (Python / ML)

```python
vector = [xwoba, xslg, hardhit, barrel, bb, k, sprint]

from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity

scaler   = StandardScaler()
X_scaled = scaler.fit_transform(X)
sim      = cosine_similarity([player_vector], all_vectors)
```

### OUTPUT FORMAT

```
TOP 5 COMPARABLE PLAYERS:
    - Player name
    - Similarity score (0–100)
    - Key shared traits
    - Key differences
```

---

<a name="part-7"></a>
## PART 7 — SCOUTING ENGINE

### PURPOSE

```
Turn data → tactical decisions
Answer: "How do we attack this player?"
```

### CORE SCOUTING MODEL

```javascript
var AdvancedScoutingModel = {
  vulnerability:  {},  // xSLG by pitch type and handedness
  countMatrix:    {},  // pitch usage by count
  zoneHeatmap:    [],  // 3x3 grid of xSLG by zone
  arsenal:        [],  // pitcher pitch arsenal stats
  pitchLocations: {}   // spray of pitch location data
};
```

---

### COMPONENT 1 — PITCH VULNERABILITY MATRIX

**Purpose:** Show hitter xSLG vs each pitch type, by pitcher handedness.

**Logic:**
```
Metric: xSLG vs pitch type
Higher = BAD (hitter is dangerous against this pitch)
Lower  = GOOD (pitcher has advantage)
```

**Data Structure:**
```javascript
var vulnerability = {
  vsLHP: { FB: 0.52, SL: 0.38, CB: 0.64, CH: 0.44 },
  vsRHP: { FB: 0.47, SL: 0.34, CB: 0.60, CH: 0.42 }
};
```

**Render Function:**
```javascript
function renderVulnerability(data) {
  const el     = document.getElementById('pp-vulnerability');
  let rows     = ['vsLHP', 'vsRHP'];
  let pitches  = ['FB', 'SL', 'CB', 'CH'];
  let html     = "<table class='scout'>";

  rows.forEach(r => {
    html += "<tr>";
    pitches.forEach(p => {
      let val = data[r][p];
      let cls = val > 0.500 ? "bad" : "good";
      html   += `<td class="${cls}">${val.toFixed(3)}</td>`;
    });
    html += "</tr>";
  });

  el.innerHTML = html;
}
```

**Color Interpretation:**
```
RED  → hitter crushes this pitch (avoid)
BLUE → pitcher advantage (attack here)
```

---

### COMPONENT 2 — COUNT MATRIX

**Purpose:** "What does the pitcher throw in this count?"

**Data Structure:**
```javascript
var matrix = {
  "0-0": { FB: 32, SL: 28, CB: 16, CH: 15 },
  "1-0": { FB: 40, SL: 22, CB: 14, CH: 12 },
  "2-0": { FB: 45, SL: 25, CB: 10, CH: 12 },
  "3-0": { FB: 72, SL: 12, CB:  6, CH:  8 },
  "0-1": { FB: 28, SL: 32, CB: 22, CH: 14 },
  "0-2": { FB: 20, SL: 38, CB: 28, CH: 12 },
  "3-2": { FB: 50, SL: 26, CB: 12, CH: 10 }
};
```

**Render Function:**
```javascript
function renderCountMatrix(matrix) {
  const el  = document.getElementById('pp-countmatrix');
  let html  = "<table>";

  Object.entries(matrix).forEach(([count, pitches]) => {
    html += `<tr><td>${count}</td>`;
    Object.entries(pitches).forEach(([type, val]) => {
      html += `<td>${val}%</td>`;
    });
    html += "</tr>";
  });

  el.innerHTML = html;
}
```

---

### COMPONENT 3 — ZONE HEATMAP (CRITICAL)

**Purpose:** 3×3 grid showing xSLG by zone location. Red = danger zone.

**Data Structure:**
```javascript
var zone = [
  [0.650, 0.412, 0.671],   // top row
  [0.421, 0.312, 0.389],   // middle row
  [0.258, 0.245, 0.301]    // bottom row
];
```

**Render Function:**
```javascript
function renderZone(grid) {
  const el  = document.getElementById('pp-zoneheat');
  let html  = "<div class='grid'>";

  grid.forEach(row => {
    row.forEach(val => {
      let c = val > 0.5 ? "red"
            : val > 0.4 ? "orange"
            : val > 0.3 ? "gray"
            : "blue";
      html += `<div class="${c}">${val.toFixed(3)}</div>`;
    });
  });

  el.innerHTML = html + "</div>";
}
```

---

### COMPONENT 4 — ARSENAL TABLE (PITCHERS)

**Purpose:** Show pitcher's complete pitch mix with velocity, spin, and effectiveness.

**Data Structure:**
```javascript
var arsenal = [
  { pitch: 'FF', name: 'Four-Seam FB', velo: 96.2, spin: 2400, whiff: 25, usage: 42 },
  { pitch: 'SL', name: 'Slider',       velo: 88.1, spin: 2300, whiff: 35, usage: 28 },
  { pitch: 'CH', name: 'Changeup',     velo: 85.4, spin: 1800, whiff: 30, usage: 18 },
  { pitch: 'CU', name: 'Curveball',    velo: 80.2, spin: 2600, whiff: 28, usage: 12 }
];
```

**Render Function:**
```javascript
function renderArsenal(data) {
  let html = "<table>";
  data.forEach(p => {
    html += `<tr>
      <td>${p.pitch}</td>
      <td>${p.velo} mph</td>
      <td>${p.spin} rpm</td>
      <td>${p.whiff}% whiff</td>
      <td>${p.usage}% usage</td>
    </tr>`;
  });
  return html + "</table>";
}
```

---

<a name="part-8"></a>
## PART 8 — VALUATION ENGINE

### BASE MARKET VALUE MODEL

```
VALUE     = WAR × $7.125M   (current MLB market rate per WAR)
LOW       = (WAR - 1) × $7.125M
HIGH      = (WAR + 1) × $7.125M
SURPLUS   = Market Value - Contract Cost
```

### VALUATION FUNCTION

```javascript
function computeValuation(war, salary) {
  const perWAR     = 7.125; // million USD
  const midValue   = war * perWAR;
  const lowValue   = (war - 1) * perWAR;
  const highValue  = (war + 1) * perWAR;
  const surplus    = midValue - salary;

  return {
    midValue,
    lowValue,
    highValue,
    surplus,
    signal: surplus > 5   ? "High Surplus Value"
          : surplus > 0   ? "Fair Value"
          : surplus > -5  ? "Slightly Overpaid"
          : "Overpaid"
  };
}
```

---

<a name="part-9"></a>
## PART 9 — PERFORMANCE & CACHING

### 3-LAYER CACHE ARCHITECTURE

```
LAYER 1: Memory (in-process dict / object)    — fastest
LAYER 2: sessionStorage (browser client)      — session-level
LAYER 3: CDN / API edge cache                 — global
```

### CACHING RULES

```
DO:
    cache everything possible
    re-render only changed components
    precompute nightly

DO NOT:
    rebuild entire page on every request
    hit external APIs on user-facing requests
    recompute heavy logic per request
```

### NIGHTLY PRECOMPUTE PIPELINE

```
NIGHTLY JOB:
    1. fetch data from MLB API + Savant
    2. build league arrays
    3. compute all percentiles
    4. build KPIs
    5. generate insights
    6. store complete profile JSON

USER REQUEST:
    → return cached JSON instantly
```

### CACHE IMPLEMENTATION (Python)

```python
CACHE = {}

def get_cache(key):
    return CACHE.get(key, None)

def set_cache(key, val):
    CACHE[key] = val

# Preload hot players on startup
HOT_PLAYERS = [123, 456, 789]  # top-searched IDs

@app.on_event("startup")
def preload():
    for player_id in HOT_PLAYERS:
        CACHE[player_id] = build_profile(player_id)
```

### CACHE IMPLEMENTATION (Client-Side)

```javascript
// Client: sessionStorage cache
function getCachedProfile(playerId) {
  const cached = sessionStorage.getItem(playerId);
  if (cached) return JSON.parse(cached);
  return null;
}

function setCachedProfile(playerId, data) {
  sessionStorage.setItem(playerId, JSON.stringify(data));
}
```

### FRONTEND PERFORMANCE RULES

```javascript
// 1. Cache profiles client-side
sessionStorage.setItem(playerId, JSON.stringify(data));

// 2. Prefetch on hover
router.prefetch(`/player/${id}`);

// 3. Skeleton UI while loading
if (!data) return <div className="animate-pulse">Loading...</div>;

// 4. Lazy-load charts
const Chart = dynamic(() => import('./HeavyChart'), { ssr: false });
```

---

<a name="part-10"></a>
## PART 10 — AI LAYER (JARVIS ENGINE)

### PURPOSE

```
Summarize all intelligence → one clear decision output
Transform: data + analytics + scouting → actionable recommendation
```

### JARVIS OUTPUT STRUCTURE

```javascript
var JarvisOutput = {
  summary:        "",   // one-paragraph player assessment
  archetype:      "",   // player type label
  strengths:      [],   // 2–3 key strengths
  risks:          [],   // 2–3 key risks
  recommendation: "",   // trade/use/avoid
  confidence:     "",   // High / Medium / Volatile
  valueSignal:    ""    // surplus / fair / overpaid
};
```

### CORE JARVIS FUNCTION

```javascript
function runJarvis(p) {
  return {
    summary:        buildSummary(p),
    archetype:      getArchetype(p),
    strengths:      getStrengths(p),
    risks:          getRisks(p),
    recommendation: getRecommendation(p),
    confidence:     getConfidence(p)
  };
}
```

### SUMMARY ENGINE

```javascript
function buildSummary(p) {
  if (p.TPVI >= 90) return "Elite impact hitter with top-tier offensive profile";
  if (p.TPVI >= 75) return "Above-average offensive contributor with real upside";
  if (p.TPVI >= 50) return "Average profile — value depends on role and salary";
  return "Below-average profile with limited upside — monitor closely";
}
```

### ARCHETYPE ENGINE

```javascript
function getArchetype(p) {
  if (p.barrel  > 80 && p.xslg > 85)   return "Power Hitter";
  if (p.k       > 75 && p.bb   > 70)   return "3 True Outcomes";
  if (p.chase   < 25 && p.bb   > 65)   return "Contact Hitter";
  if (p.sprint  > 80)                   return "Speed Threat";
  return "Balanced";
}
```

### RECOMMENDATION ENGINE

```javascript
function getRecommendation(p) {
  if (p.CAS  >= 90)  return "Aggressive acquisition target";
  if (p.DQS  <= 30)  return "Approach risk — monitor discipline metrics";
  if (p.TPVI >= 75)  return "Strong value — buy at current price";
  return "Neutral evaluation — context-dependent decision";
}
```

### CONFIDENCE ENGINE

```javascript
function getConfidence(p) {
  let spread = Math.abs(p.CAS - p.DQS);
  if (spread < 10) return "High";
  if (spread < 25) return "Medium";
  return "Volatile";
}
```

### "WHAT SHOULD WE DO?" BUTTON (KEY PRODUCT MOMENT)

```tsx
// React component
<button onClick={runJarvis}>
  What should we do?
</button>

// Output format:
// RECOMMENDATION:  Trade target ✅
// Power upside:    High ✅
// Approach risk:   ⚠️
// Confidence:      Medium
```

### ASK JARVIS (NATURAL LANGUAGE INTERFACE)

```javascript
// engine/askJarvis.ts
export function askJarvis(question: string, player: any) {
  if (question.includes("trade")) {
    return player.CAS > 85
      ? "Strong acquisition target based on CAS and TPVI"
      : "Moderate to high risk — verify approach metrics";
  }
  if (question.includes("power")) {
    return player.DPI > 80
      ? "High power upside — top 20% MLB in damage potential"
      : "Limited power profile — contact-first approach";
  }
  if (question.includes("worth")) {
    return player.surplus > 5
      ? "Strong surplus value — buy now"
      : "Fair to negative value — negotiate carefully";
  }
}
```

**JARVIS RULE:**
```
AI GENERATES:   language, summaries, recommendations
AI NEVER:       generates or fabricates data points
```

---

<a name="part-11"></a>
## PART 11 — STRATEGY ENGINE (TANGO CORE / RE24)

### PURPOSE

```
Real baseball decision-making using run expectancy
Answer: "WHAT SHOULD WE DO IN THIS SITUATION?"
```

### CORE EQUATION

```javascript
function runValue(oldRE, newRE, runsScored) {
  return newRE - oldRE + runsScored;
}
// Positive = good outcome, Negative = bad outcome
```

### RE24 SYSTEM — 24 BASE/OUT STATES

```javascript
var RE24 = {
  // Key: "{outs}_out__{basestate}"
  "0_out__empty":  0.53,
  "0_out__1st":    0.90,
  "0_out__2nd":    1.14,
  "0_out__3rd":    1.43,
  "0_out__1st2nd": 1.51,
  "0_out__1st3rd": 1.79,
  "0_out__2nd3rd": 1.98,
  "0_out__loaded": 2.28,
  "1_out__empty":  0.29,
  "1_out__1st":    0.55,
  "1_out__2nd":    0.71,
  "1_out__3rd":    0.99,
  // ... all 24 states
};
```

### STRATEGY EVALUATION EXAMPLES

**Bunt Decision:**
```javascript
let before = RE24["0_out__1st"];   // 0.90
let after  = RE24["1_out__2nd"];   // 0.68
let value  = after - before;       // -0.22
// OUTPUT: "Sacrifice bunt reduces expected runs by 0.22 → REJECT"
```

**Decision Engine:**
```javascript
function evaluateDecision(state, decision) {
  let before = RE24[state.before];
  let after  = RE24[state.after];
  let val    = runValue(before, after, state.runsScored);

  return {
    value:          val,
    recommendation: val > 0 ? "ACCEPT" : "REJECT",
    explanation:    `Move changes run expectancy by ${val.toFixed(2)}`
  };
}
```

### LINEAR WEIGHTS SYSTEM

```javascript
// wOBA weights (approximate, calibrate annually)
var WEIGHTS = {
  BB:  0.69,
  HBP: 0.72,
  S:   0.89,
  D:   1.27,
  T:   1.62,
  HR:  2.10
};

function calcWOBA(player) {
  return (WEIGHTS.BB * player.BB + WEIGHTS.S * player.singles +
          WEIGHTS.D * player.doubles + WEIGHTS.T * player.triples +
          WEIGHTS.HR * player.HR) / player.PA;
}
```

---

<a name="part-12"></a>
## PART 12 — PROJECTION ENGINE

### BASE PROJECTION MODEL

```javascript
function project(currentStat, leagueAvg) {
  // Regress toward league mean
  return 0.7 * currentStat + 0.3 * leagueAvg;
}
```

### AGING CURVE ADJUSTMENTS

```javascript
function agingAdjustment(stat, age) {
  if (age  < 27)  return stat * 1.02;   // improving
  if (age  < 30)  return stat * 1.00;   // peak / stable
  if (age  < 33)  return stat * 0.98;   // mild decline
  return stat * 0.95;                    // steeper decline
}
```

### PROJECTION OUTPUT FORMAT

```javascript
var Projection = {
  nextSeason:  { xwOBA: 0.365, WAR: 3.2 },
  peakValue:   { xwOBA: 0.380, WAR: 4.5 },
  floorValue:  { xwOBA: 0.320, WAR: 1.8 },
  confidence:  "Medium",
  ageFlag:     "Peak years — buy window open"
};
```

### MiLB-TO-MLB TRANSLATION (CRITICAL)

```javascript
function milbToMLB(stat, level) {
  const factors = {
    AAA: 0.92,
    AA:  0.87,
    "A+": 0.82,
    A:   0.78
  };
  return stat * (factors[level] || 0.80);
}
```

---

<a name="part-13"></a>
## PART 13 — ML SYSTEM (PHASE 3)

### ML MODELS OVERVIEW

```
1. Linear Projection Model (regression)
2. Player Classification (tiers)
3. Similarity / Embedding Vectors
4. Clustering
5. Outcome Probability Model
6. Pitch Simulation
```

### ML PIPELINE

```
Fetch → Normalize → Feature Engineering → Model → Predict → Learn → Render
```

### MODEL 1 — LINEAR PROJECTION

```python
from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(X_train, y_train)   # X: [xwOBA, age, EV, K%, BB%]
                               # y: next_season_xwOBA

def project_player(x):
    return model.predict([x])[0]
```

### MODEL 2 — CLASSIFICATION (PLAYER TIERS)

```python
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)
# Classes: ["Elite", "Above Average", "Average", "Replacement"]
```

### MODEL 3 — PLAYER EMBEDDINGS (SIMILARITY)

```python
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity

features = ['xwoba', 'xslg', 'hardhit', 'barrel', 'bb', 'k', 'sprint']

scaler   = StandardScaler()
X_scaled = scaler.fit_transform(X)

def find_comps(player_idx, top_n=5):
    sims = cosine_similarity([X_scaled[player_idx]], X_scaled)[0]
    return sorted(range(len(sims)), key=lambda i: -sims[i])[1:top_n+1]
```

### MODEL 4 — PITCH SIMULATION (AT-BAT)

```javascript
// State machine: COUNT → PITCH → RESULT → UPDATE

function simulatePitch(count) {
  let probs = getPitchProb(count);
  let rand  = Math.random();
  if (rand < probs.strike) return "strike";
  if (rand < probs.ball)   return "ball";
  if (rand < probs.hit)    return "hit";
  return "out";
}

function simulateAB() {
  let count = { balls: 0, strikes: 0 };
  while (true) {
    let result = simulatePitch(count);
    if (result === "strike") {
      count.strikes++;
      if (count.strikes === 3) return "K";
    }
    if (result === "ball") {
      count.balls++;
      if (count.balls === 4) return "BB";
    }
    if (result === "hit")  return "H";
    if (result === "out")  return "OUT";
  }
}
```

---

<a name="part-14"></a>
## PART 14 — GM MODE (SIMULATION ENGINE)

### PURPOSE

```
From: "How good is this player?"
To:   "How does he impact OUR team?"

Answer:
  • What is this player worth to our team?
  • What happens if we trade him?
  • How does this roster perform?
  • Who should we acquire?
```

### GM DATA MODEL

```javascript
var GMModel = {
  roster:      [],    // array of PlayerAnalyticsModel
  projections: {},    // per-player projected stats
  teamStrength:{},    // aggregated team metrics
  wins:        null,  // estimated wins
  playoffOdds: null   // estimated playoff probability
};
```

### TEAM STRENGTH ENGINE

```javascript
function computeTeamStrength(players) {
  let offense    = 0;
  let discipline = 0;
  let power      = 0;

  players.forEach(p => {
    offense    += p.TPVI;
    discipline += p.DQS;
    power      += p.DPI;
  });

  let n = players.length;
  return {
    offense:    offense / n,
    discipline: discipline / n,
    power:      power / n
  };
}
```

### WIN ESTIMATION MODEL

```javascript
function estimateWins(team) {
  let base          = 81;
  let offenseAdj    = (team.offense    - 50) * 0.6;
  let disciplineAdj = (team.discipline - 50) * 0.3;
  let powerAdj      = (team.power      - 50) * 0.1;
  return Math.round(base + offenseAdj + disciplineAdj + powerAdj);
}
```

### TRADE SIMULATION ENGINE

```javascript
function simulateTrade(roster, add, remove) {
  let beforeTeam = computeTeamStrength(roster);
  let beforeWins = estimateWins(beforeTeam);

  let newRoster  = roster.filter(p => p.id !== remove.id);
  newRoster.push(add);

  let afterTeam  = computeTeamStrength(newRoster);
  let afterWins  = estimateWins(afterTeam);

  return {
    beforeWins,
    afterWins,
    delta:  afterWins - beforeWins,
    verdict: afterWins - beforeWins > 2  ? "Strong trade — recommend"
           : afterWins - beforeWins > 0  ? "Slight upgrade — proceed with caution"
           : afterWins - beforeWins === 0 ? "Neutral — no projected impact"
           : "Bad trade — avoid"
  };
}
```

### MONTE CARLO SEASON SIMULATION

```javascript
function simulateSeason(players, runs = 1000) {
  let wins = [];

  for (let i = 0; i < runs; i++) {
    let team  = computeTeamStrength(players);
    let noise = (Math.random() - 0.5) * 10;  // variance
    let w     = estimateWins(team) + noise;
    wins.push(w);
  }

  return {
    avg:       Math.round(wins.reduce((a, b) => a + b, 0) / wins.length),
    min:       Math.round(Math.min(...wins)),
    max:       Math.round(Math.max(...wins)),
    p10:       /* 10th percentile */,
    p90:       /* 90th percentile */
  };
}
```

### ROSTER VALUE ENGINE

```javascript
function rosterValue(players) {
  return players.reduce((sum, p) => sum + (p.WAR_proj || 0), 0);
}
```

---

<a name="part-15"></a>
## PART 15 — MiLB & PROSPECT SYSTEM

### PURPOSE

Elevate product beyond 99% of existing tools by supporting the full player development pipeline.

### SCOPE

```
Supports:
    • MLB Players (current roster)
    • MiLB Players (AAA, AA, A+, A)
    • Top 100 Prospects (national)
    • Top 30 Prospects by Organization
```

### MiLB PROFILE MODEL

```javascript
var ProspectProfile = {
  info:         {},
  level:        "AA",
  scoutingGrades: {
    hit:        55,   // 20-80 scale
    power:      60,
    run:        50,
    arm:        55,
    field:      60,
    overall:    58
  },
  projection:   {},
  mlEquivalent: {},   // translated stats
  comps:        []
};
```

### MLB/MiLB DISPLAY DIFFERENCES

| Feature       | MLB               | MiLB                |
|---------------|-------------------|---------------------|
| Primary Stats | Current KPIs      | Projected KPIs      |
| Focus         | Results           | Tools               |
| Grading       | Percentiles       | 20-80 Grades        |
| Headline      | Performance now   | Development ceiling |

### UI ROUTING BY LEVEL

```javascript
if (player.level !== "MLB") {
  renderProspectProfile();
} else {
  renderMLBProfile();
}
```

### MiLB API INTEGRATION

```
MLB Stats API supports minor league stats access.
Endpoint pattern: statsapi.mlb.com/api/v1/stats?...&sportId=11  (AAA=11, AA=12, A+=13, A=14)
```

---

<a name="part-16"></a>
## PART 16 — FANTASY SYSTEM

### CORE GOAL

```
Turn this system into a fantasy decision engine
```

### ESPN-STYLE SCORING BASE

```javascript
function fantasyPoints(p) {
  return (
    p.H   * 1 +
    p.HR  * 4 +
    p.RBI * 1 +
    p.BB  * 1 +
    p.SB  * 2
  );
}
// Note: league settings vary — make this configurable
```

### CUSTOM FANTASY METRICS

**%RSOT (Run-Scoring Opportunity Taken)**
```javascript
// Model definition — not sourced from ESPN
RSOT = runs_created / opportunities
```

**%START (Start Utilization Rate)**
```javascript
startPct = games_started / games_available
```

**+/- (Impact Differential)**
```javascript
plusMinus = team_runs_with_player - team_runs_without_player
```

### FANTASY KPI MODEL

```javascript
var FantasyKPIs = {
  FVI:         0.6 * fantasy_points + 0.4 * TPVI,  // Fantasy Value Index
  Consistency: stddev_fantasy_points,                // week-to-week variance
  Usage:       startPct
};
```

### FANTASY ENGINE (TypeScript)

```typescript
// engine/fantasy.ts
export function fantasyPoints(p: any) {
  let pts = p.H * 1 + p.HR * 4 + p.RBI * 1 + p.BB * 1;
  return {
    points:    pts,
    startPct:  p.starts / p.games,
    plusMinus: p.teamRuns - p.teamRunsWithout
  };
}
```

### FANTASY PANEL COMPONENT

```tsx
export default function FantasyPanel({ data }: any) {
  return (
    <div className="panel">
      <h3>Fantasy Impact</h3>
      <div>Points:  {data.points}</div>
      <div>%START:  {data.startPct}</div>
      <div>+/-:     {data.plusMinus}</div>
    </div>
  );
}
```

---

<a name="part-17"></a>
## PART 17 — REAL-TIME STATCAST PIPELINE

### TRUTH ABOUT STATCAST

```
MLB processes millions of data points per game in near real-time via
cameras and radar systems. Data is distributed through APIs — not a
public push stream.

WHAT YOU CAN BUILD:
    ✅ Near-real-time ingestion (polling + SSE)

WHAT YOU CANNOT BUILD:
    ❌ Raw stadium camera feed
    ❌ True push streaming from MLB publicly
```

### FINAL PIPELINE DESIGN

```
Statcast Source (Savant / MLB API)
   ↓
Python Ingestion Worker (poll every 15s)
   ↓
ETL + Normalize
   ↓
Redis / Memory Cache
   ↓
WebSocket Stream OR Server-Sent Events (SSE)
   ↓
Next.js UI (EventSource client)
```

### PYTHON INGESTION WORKER

```python
from pybaseball import statcast
import time

def fetch_live_data():
    from datetime import date
    today = date.today().strftime("%Y-%m-%d")
    df    = statcast(start_dt=today, end_dt=today)
    return df

def run_ingestion_loop():
    while True:
        data = fetch_live_data()
        push_to_cache(normalize(data))
        time.sleep(15)   # 15-second refresh interval
```

### KEY DESIGN RULE

```
NEVER:  hit API on user request
ALWAYS: preload → cache → return cached data
```

### SSE STREAM SERVER (FASTAPI)

```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import json, asyncio

app = FastAPI()

async def event_stream():
    while True:
        data = get_latest_data()
        yield f"data: {json.dumps(data)}\n\n"
        await asyncio.sleep(2)

@app.get("/stream")
def stream():
    return StreamingResponse(event_stream(), media_type="text/event-stream")
```

**Important Next.js Limit:**
```
Next.js serverless functions CANNOT hold WebSocket connections.
Solution A: Server-Sent Events (SSE) via FastAPI — RECOMMENDED
Solution B: Separate Node WebSocket server
```

### SSE CLIENT (NEXT.JS)

```typescript
useEffect(() => {
  const evtSource        = new EventSource("/api/stream");
  evtSource.onmessage    = (event) => {
    const data = JSON.parse(event.data);
    setLiveData(data);
  };
  return () => evtSource.close();
}, []);
```

### LIVE FEED COMPONENT

```tsx
// components/LiveFeed.tsx
"use client";
import { useEffect, useState } from "react";

export default function LiveFeed() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const evt          = new EventSource("/api/stream");
    evt.onmessage      = (e) => setData(JSON.parse(e.data));
    return () => evt.close();
  }, []);

  return (
    <div className="panel">
      <h3>Live Pitch Feed</h3>
      {data.map((p, i) => (
        <div key={i}>
          {p.pitch_type} • {p.velocity} mph • {p.result}
        </div>
      ))}
    </div>
  );
}
```

### SCHEDULING OPTIONS

```
Options for running the ingestion worker:
  1. Cron job (server-based)
  2. Railway background worker
  3. GitHub Actions (scheduled workflow)
  4. Vercel Cron (simple, limited)
```

---

<a name="part-18"></a>
## PART 18 — BACKEND ARCHITECTURE (FASTAPI)

### STACK

```
Frontend: Next.js (Vercel)
API:      FastAPI (Vercel serverless OR Railway)
DB:       PostgreSQL (Supabase recommended)
Cache:    Redis (Upstash) or in-memory dict
Storage:  S3 or Supabase storage
Worker:   Railway or GitHub Actions
```

### API ROUTE STRUCTURE

```
api/
  main.py                     ← FastAPI entry
  ├── routes/
  │     players.py            ← /players, /players/{id}/profile
  │     gm.py                 ← /gm/evaluate, /gm/trade
  │     strategy.py           ← /strategy/evaluate
  │     stream.py             ← /stream (SSE)
  │     auth.py               ← /auth/login, /auth/validate
  │     reports.py            ← /reports/upload
  │
  ├── engine/
  │     analytics.py          ← percentiles, KPIs
  │     jarvis.py             ← decision layer
  │     gm.py                 ← trade simulation
  │     ingestion.py          ← Statcast fetcher
  │
  └── db/
        models.py             ← SQLAlchemy models
        queries.py            ← common DB queries
```

### COMPLETE PROFILE ENDPOINT

```python
@app.get("/players/{id}/profile")
def profile(id: int):
    cached = get_cache(id)
    if cached:
        return cached

    # Build full profile
    data = {
        "info":       get_player_info(id),
        "kpis":       compute_kpis(id),
        "insights":   generate_insights(id),
        "percentiles": get_percentiles(id),
        "jarvis":     run_jarvis(id),
        "scouting":   get_scouting(id),
        "comps":      get_comps(id),
        "fantasy":    get_fantasy(id),
        "valuation":  get_valuation(id)
    }

    set_cache(id, data)
    return data
```

### KEY API ENDPOINTS

| Method | Endpoint                    | Purpose                    |
|--------|-----------------------------|----------------------------|
| GET    | /players                    | Search players             |
| GET    | /players/{id}/profile       | Full player profile        |
| GET    | /players/{id}/scouting      | Scouting data              |
| GET    | /prospects                  | Prospect lists             |
| POST   | /gm/evaluate                | Roster strength            |
| POST   | /gm/trade                   | Trade simulation           |
| POST   | /strategy/evaluate          | RE24 decision eval         |
| GET    | /stream                     | SSE live pitch feed        |
| POST   | /auth/login                 | User login                 |
| POST   | /reports/upload             | Scout report upload        |

### GM ENDPOINTS

```python
@app.post("/gm/evaluate")
def evaluate(roster: list):
    return {
        "wins":      estimate_wins(roster),
        "strength":  compute_team_strength(roster),
        "playoffOdds": estimate_playoff_odds(roster)
    }

@app.post("/gm/trade")
def trade(data: dict):
    return simulate_trade(
        roster=data["roster"],
        add=data["add"],
        remove=data["remove"]
    )
```

---

<a name="part-19"></a>
## PART 19 — DATABASE SCHEMA (POSTGRES)

### DESIGN GOALS

```
• Fast lookups via indexed MLB IDs
• Precomputed profile storage (JSON blob)
• Support MLB + MiLB
• Support fantasy + scouting + simulation
```

### CORE TABLES

**PLAYERS TABLE**
```sql
CREATE TABLE players (
  id         SERIAL PRIMARY KEY,
  mlb_id     INT UNIQUE,
  name       TEXT NOT NULL,
  team       TEXT,
  level      TEXT,           -- MLB, AAA, AA, A+, A
  position   TEXT,
  bats       TEXT,
  throws     TEXT,
  birthdate  DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_players_mlb_id ON players(mlb_id);
CREATE INDEX idx_players_name   ON players(name);
```

**PLAYER_STATS (SEASONAL)**
```sql
CREATE TABLE player_stats (
  id         SERIAL PRIMARY KEY,
  player_id  INT REFERENCES players(id),
  season     INT,
  level      TEXT,
  -- Counting stats
  games      INT,  pa INT,  ab INT,
  h INT,  singles INT,  doubles INT,  triples INT,
  hr INT,  rbi INT,  r INT,  bb INT,  k INT,  hbp INT,  sb INT,
  -- Rate stats
  avg FLOAT,  obp FLOAT,  slg FLOAT,  ops FLOAT,
  woba FLOAT,  wrc_plus FLOAT,  war FLOAT,
  -- Statcast
  xwoba FLOAT,  xba FLOAT,  xslg FLOAT,
  ev FLOAT,  hardhit FLOAT,  barrel FLOAT,
  launch_angle FLOAT,  chase FLOAT,  whiff FLOAT,
  sprint_speed FLOAT,  oaa FLOAT
);
```

**PERCENTILES (PRECOMPUTED)**
```sql
CREATE TABLE percentiles (
  player_id  INT REFERENCES players(id),
  season     INT,
  metric     TEXT,
  value      FLOAT,
  percentile INT,
  PRIMARY KEY (player_id, season, metric)
);
```

**PITCH DATA (SCOUTING + SIMULATION)**
```sql
CREATE TABLE pitch_events (
  id          SERIAL PRIMARY KEY,
  player_id   INT REFERENCES players(id),
  game_date   DATE,
  pitch_type  TEXT,
  velocity    FLOAT,
  spin_rate   FLOAT,
  zone        INT,        -- 1-9 for strikezone, 11-14 for ball
  result      TEXT,
  count_balls INT,
  count_strikes INT
);
```

**MiLB STATS TABLE**
```sql
CREATE TABLE milb_stats (
  id         SERIAL PRIMARY KEY,
  player_id  INT REFERENCES players(id),
  level      TEXT,        -- AAA, AA, A+, A
  season     INT,
  pa         INT,  hr INT,  sb INT,
  avg FLOAT,  obp FLOAT,  slg FLOAT,  ops FLOAT,
  xwoba      FLOAT,
  mlb_equiv_xwoba FLOAT  -- translated via level factor
);
```

**PROSPECTS TABLE**
```sql
CREATE TABLE prospects (
  id         SERIAL PRIMARY KEY,
  player_id  INT REFERENCES players(id),
  rank_overall INT,
  team       TEXT,
  level      TEXT,
  age        INT,
  -- 20-80 Scouting Grades
  grade_hit   INT,
  grade_power INT,
  grade_run   INT,
  grade_arm   INT,
  grade_field INT,
  grade_overall INT,
  eta_year    INT,        -- projected MLB ETA
  updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE prospect_lists (
  id        SERIAL PRIMARY KEY,
  year      INT,
  list_type TEXT,        -- "top_100", "team_top_30"
  team      TEXT,
  player_id INT REFERENCES players(id),
  rank      INT
);
```

**FANTASY STATS TABLE**
```sql
CREATE TABLE fantasy_stats (
  player_id     INT REFERENCES players(id),
  season        INT,
  fantasy_points FLOAT,
  points_per_game FLOAT,
  rsot           FLOAT,   -- %RSOT (custom metric)
  start_pct      FLOAT,   -- %START
  plus_minus     FLOAT    -- +/-
);
```

**SCOUTING REPORTS TABLE**
```sql
CREATE TABLE scouting_reports (
  id              SERIAL PRIMARY KEY,
  player_id       INT REFERENCES players(id),
  author          TEXT,
  report          TEXT,
  -- Structured grades
  grade_hit       INT,    -- 20-80 scale
  grade_power     INT,
  grade_run       INT,
  grade_field     INT,
  grade_arm       INT,
  role_projection TEXT,   -- "Starter", "Bench", "DH", etc.
  created_at      TIMESTAMP DEFAULT NOW(),
  approved        BOOLEAN DEFAULT FALSE
);
```

**USERS TABLE**
```sql
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  username    TEXT UNIQUE,
  email       TEXT UNIQUE,
  password    TEXT,       -- bcrypt hash, never plain text
  role        TEXT,       -- "admin", "scout", "user"
  pro         BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);
```

**WATCHLIST TABLE**
```sql
CREATE TABLE watchlist (
  user_id   INT REFERENCES users(id),
  player_id INT REFERENCES players(id),
  added_at  TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, player_id)
);
```

**PLAYER TIMELINE TABLE**
```sql
CREATE TABLE player_timeline (
  id        SERIAL PRIMARY KEY,
  player_id INT REFERENCES players(id),
  date      DATE,
  event     TEXT,         -- "Promoted AAA→MLB", "IL Stint", "Exit velo spike"
  value     FLOAT,        -- associated stat value if applicable
  category  TEXT          -- "development", "injury", "performance"
);
```

---

<a name="part-20"></a>
## PART 20 — FRONTEND ARCHITECTURE (NEXT.JS)

### PROJECT STRUCTURE

```
ai-baseball-terminal/
│
├── app/                              ← Next.js App Router
│   ├── layout.tsx                    ← Root layout (Header)
│   ├── page.tsx                      ← Home / Search page
│   ├── player/[id]/
│   │   └── page.tsx                  ← Player Profile page
│   ├── compare/
│   │   └── page.tsx                  ← Comparison tool
│   ├── prospects/
│   │   └── page.tsx                  ← Prospect lists
│   └── gm/
│       └── page.tsx                  ← GM Mode
│
├── components/
│   ├── Header.tsx                    ← Logo → home nav
│   ├── core/
│   │   ├── KPIBar.tsx                ← KPI strip
│   │   ├── PercentileBars.tsx        ← Percentile bars with bubbles
│   │   └── InsightBox.tsx            ← Scouting insight text
│   ├── profile/
│   │   ├── PlayerHeader.tsx          ← Identity + headshot
│   │   └── ProfileLayout.tsx         ← 3-column layout
│   ├── scouting/
│   │   ├── VulnerabilityMatrix.tsx
│   │   ├── ZoneHeatmap.tsx
│   │   ├── CountMatrix.tsx
│   │   └── ArsenalTable.tsx
│   ├── ai/
│   │   └── JarvisPanel.tsx           ← Decision output
│   ├── gm/
│   │   └── GMPanel.tsx
│   ├── FantasyPanel.tsx
│   ├── LiveFeed.tsx
│   ├── ProspectList.tsx
│   └── CompCards.tsx
│
├── engine/                           ← PURE ANALYTICS (no UI)
│   ├── analytics.ts
│   ├── percentiles.ts
│   ├── kpis.ts
│   ├── insights.ts
│   ├── comps.ts
│   └── fantasy.ts
│
├── lib/
│   ├── api.ts                        ← API client
│   ├── config.ts                     ← constants
│   ├── teamColors.ts                 ← dynamic team theming
│   └── utils.ts
│
├── api/                              ← Python FastAPI backend
│   └── main.py
│
├── styles/
│   └── globals.css
│
├── package.json
├── tailwind.config.js
└── vercel.json
```

### SETUP COMMANDS

```bash
npx create-next-app@latest ai-baseball-terminal
cd ai-baseball-terminal
npm install axios
npm install tailwindcss
npx tailwindcss init -p
```

### API CLIENT (lib/api.ts)

```typescript
const API_URL = "/api"; // Vercel same-origin proxy

export async function getPlayerProfile(id: string) {
  const res = await fetch(`${API_URL}/players/${id}/profile`);
  return res.json();
}

export async function searchPlayers(query: string) {
  const res = await fetch(`${API_URL}/players?query=${query}`);
  return res.json();
}

export async function getProspects(filter?: string) {
  const res = await fetch(`${API_URL}/prospects?filter=${filter || "top_100"}`);
  return res.json();
}
```

### ROOT LAYOUT

```typescript
// app/layout.tsx
import Header from "@/components/Header";

export default function Layout({ children }: any) {
  return (
    <html>
      <body className="bg-[#0f1116] text-white font-sans">
        <Header />
        {children}
      </body>
    </html>
  );
}
```

### HEADER COMPONENT (Logo → Home)

```typescript
// components/Header.tsx
"use client";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  return (
    <div
      className="p-4 border-b border-gray-800 cursor-pointer flex items-center"
      onClick={() => router.push("/")}
    >
      <span className="text-xl font-bold">⚾ AI Baseball Terminal</span>
    </div>
  );
}
```

### HOME PAGE (SEARCH UI)

```typescript
// app/page.tsx
"use client";
import { useState } from "react";
import { searchPlayers } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Home() {
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState([]);
  const router = useRouter();

  async function handleSearch() {
    const res = await searchPlayers(query);
    setResults(res);
  }

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-2">Baseball Intelligence Terminal</h1>
      <p className="text-gray-400 mb-6">Scouting • Analytics • Decisions</p>
      <div className="flex justify-center gap-2">
        <input
          className="p-2 rounded bg-[#1c1f26] text-white"
          value={query}
          placeholder="Search any player..."
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className="p-2 bg-green-600 rounded"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      {results.map((p: any) => (
        <div
          key={p.id}
          className="p-3 mt-2 bg-[#1c1f26] rounded cursor-pointer hover:bg-[#252830]"
          onClick={() => router.push(`/player/${p.id}`)}
        >
          {p.name} — {p.team} ({p.position})
        </div>
      ))}
    </div>
  );
}
```

### PLAYER PAGE

```typescript
// app/player/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { getPlayerProfile } from "@/lib/api";
import KPIBar          from "@/components/core/KPIBar";
import InsightBox      from "@/components/core/InsightBox";
import PercentileBars  from "@/components/core/PercentileBars";
import JarvisPanel     from "@/components/ai/JarvisPanel";
import FantasyPanel    from "@/components/FantasyPanel";

export default function PlayerPage({ params }: any) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getPlayerProfile(params.id).then(setData);
  }, []);

  if (!data) return <div className="animate-pulse p-8">Loading...</div>;

  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      <div className="col-span-2">
        <KPIBar          kpis={data.kpis} />
        <InsightBox      insights={data.insights} />
        <PercentileBars  groups={data.percentiles} />
        <JarvisPanel     jarvis={data.jarvis} />
      </div>
      <div>
        <FantasyPanel    data={data.fantasy} />
        {/* Scouting + Comps panels */}
      </div>
    </div>
  );
}
```

### SMART SEARCH FUNCTION

```javascript
function smartSearch(query, players) {
  return players
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.TPVI - a.TPVI);   // rank by TPVI
}
// Add level tags: MLB / MiLB / Prospect
```

---

<a name="part-21"></a>
## PART 21 — DEPLOYMENT & INFRASTRUCTURE

### SIMPLE DEPLOYMENT STACK (RECOMMENDED FOR ~1000 USERS)

```
Frontend:  Vercel (Next.js)
Backend:   Railway (FastAPI + Python worker)
Database:  Supabase (Postgres + auth)
Cache:     Upstash Redis (serverless Redis)
Storage:   Supabase Storage or S3
```

**You do NOT need at this scale:**
```
❌ Kubernetes
❌ Microservices explosion
❌ Complex infrastructure
```

### DEPLOY FRONTEND

```bash
npm run build
vercel
```

### DEPLOY BACKEND

```bash
pip install fastapi uvicorn
railway up
```

### CONNECT FRONTEND TO BACKEND

```typescript
// Update lib/config.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
```

### VERCEL.JSON PROXY CONFIG

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-railway-backend.railway.app/:path*"
    }
  ]
}
```

### ENVIRONMENT VARIABLES

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
DATABASE_URL=postgresql://user:pass@host/db
REDIS_URL=redis://...
JWT_SECRET=your-secret-key
```

---

<a name="part-22"></a>
## PART 22 — USER SYSTEM, AUTH & ROLES

### USER ROLES

| Role  | Access                              |
|-------|-------------------------------------|
| admin | Everything — full system access     |
| scout | Upload scouting reports             |
| user  | View profiles + watchlist           |

### JWT AUTH SYSTEM (PYTHON)

```python
import jwt
import bcrypt

SECRET = "your-secret-key"

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_token(username: str) -> str:
    return jwt.encode({"user": username}, SECRET, algorithm="HS256")

def decode_token(token: str) -> dict:
    return jwt.decode(token, SECRET, algorithms=["HS256"])
```

### LOGIN ENDPOINT

```python
@app.post("/auth/login")
def login(data: dict):
    user = get_user(data["username"])
    if user and verify_password(data["password"], user.password):
        return {"token": create_token(data["username"])}
    return {"error": "invalid credentials"}
```

### ROLE ENFORCEMENT

```python
from functools import wraps

def require_role(role: str):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            user = get_current_user()
            if user.role != role and user.role != "admin":
                raise HTTPException(status_code=403, detail="Insufficient permissions")
            return f(*args, **kwargs)
        return wrapper
    return decorator
```

### FRONTEND AUTH

```typescript
// Store token after login
localStorage.setItem("token", res.token);

// Include in API requests
const headers = {
  "Authorization": `Bearer ${localStorage.getItem("token")}`
};
```

---

<a name="part-23"></a>
## PART 23 — ADMIN PANEL & SCOUTING UPLOAD SYSTEM

### ADMIN FEATURES

```
- Approve / reject scouting reports
- Manage user accounts and roles
- Update Top 100 prospect rankings
- Monitor ingestion pipeline health
- System configuration
```

### ADMIN PANEL COMPONENT

```tsx
export default function Admin() {
  return (
    <div className="p-6">
      <h2>Admin Panel</h2>
      <button>Approve Scouting Reports</button>
      <button>Manage Users</button>
      <button>Update Prospect Rankings</button>
    </div>
  );
}
```

### SCOUT REPORT UPLOAD — STRUCTURED FORM

```tsx
// components/ScoutForm.tsx
export default function ScoutForm() {
  const [form, setForm] = useState({});

  async function submit() {
    const token = localStorage.getItem("token");
    await fetch("/api/reports/upload", {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
  }

  return (
    <div>
      <input   placeholder="Player Name" onChange={e => setForm({...form, player: e.target.value})} />
      <input   type="number" placeholder="Hit Tool (20-80)"   onChange={e => setForm({...form, grade_hit: e.target.value})} />
      <input   type="number" placeholder="Power Tool (20-80)" onChange={e => setForm({...form, grade_power: e.target.value})} />
      <input   type="number" placeholder="Speed (20-80)"      onChange={e => setForm({...form, grade_run: e.target.value})} />
      <input   type="number" placeholder="Arm (20-80)"        onChange={e => setForm({...form, grade_arm: e.target.value})} />
      <input   type="number" placeholder="Field (20-80)"      onChange={e => setForm({...form, grade_field: e.target.value})} />
      <textarea placeholder="Narrative scouting notes..." onChange={e => setForm({...form, report: e.target.value})} />
      <button onClick={submit}>Submit Report</button>
    </div>
  );
}
```

### UPLOAD ENDPOINT (FASTAPI)

```python
@app.post("/reports/upload")
def upload(report: dict, user=Depends(get_current_user)):
    if user.role not in ["scout", "admin"]:
        raise HTTPException(status_code=403)
    save_report(report, user.username)
    return {"status": "saved", "pending_approval": True}
```

---

<a name="part-24"></a>
## PART 24 — UI DESIGN SYSTEM & BRANDING

### DESIGN PHILOSOPHY

```
NOT: Dashboard / Stat viewer / Fan site
YES: Intelligence Terminal / Decision Engine

UI FEEL: Bloomberg Terminal meets Linear meets Notion
```

### DESIGN TOKENS

```javascript
const colors = {
  bg:          "#0f1116",    // near-black background
  panel:       "#1c1f26",    // panel cards
  border:      "#2a2d35",    // subtle dividers
  accent:      "#22C55E",    // terminal green (primary)
  accentGlow:  "#4ADE80",    // hover glow
  indigo:      "#6366F1",    // secondary accent
  cyan:        "#22D3EE",    // data accent
  eliteRed:    "#C0392B",    // 80th+ percentile
  goodOrange:  "#E67E22",    // 60-79th percentile
  avgGray:     "#7F8C8D",    // 40-59th percentile
  belowBlue:   "#5AB4F5",    // 20-39th percentile
  poorDark:    "#1A3A5C",    // 0-19th percentile
};
```

### GLOBAL CSS

```css
body {
  background:  #0f1116;
  color:       #ffffff;
  font-family: Inter, 'Plus Jakarta Sans', sans-serif;
}

.panel {
  background:    #1c1f26;
  border-radius: 16px;
  padding:       16px;
  border:        1px solid #2a2d35;
}

--terminal-accent:     #22C55E;
--terminal-accent-glow: #4ADE80;
```

### TYPOGRAPHY

```
Primary font:  Inter (clean SaaS)
Alt fonts:     Sora, Plus Jakarta Sans

Style rules:
  • Bold titles
  • Minimal labels (muted gray)
  • Clean consistent spacing
```

### VISUAL HIERARCHY

```
BIG:    KPI values (headline numbers)
MEDIUM: Insight text, Jarvis output
SMALL:  Raw stats, secondary data
```

### VISUAL RULES

```
YES:
  ✅ Dark backgrounds
  ✅ High contrast
  ✅ Neon/bright accents on dark
  ✅ Consistent panel padding
  ✅ Data-driven color only

NO:
  ❌ Clutter
  ❌ Bright backgrounds
  ❌ Random decoration
  ❌ Color for aesthetic only
```

### DYNAMIC TEAM COLOR SYSTEM (ADVANCED FEATURE)

```typescript
// lib/teamColors.ts
export const teamColors: Record<string, string> = {
  NYY: "#0C2340",   // Yankees navy
  BOS: "#BD3039",   // Red Sox red
  LAD: "#005A9C",   // Dodgers blue
  CHC: "#0E3386",   // Cubs blue
  ATL: "#CE1141",   // Braves red
  HOU: "#EB6E1F",   // Astros orange
  SFG: "#FD5A1E",   // Giants orange
  NYM: "#002D72",   // Mets blue
  // ... all 30 teams
};

export function getThemeColor(team?: string): string {
  if (!team) return "#22C55E";  // default green
  return teamColors[team] || "#22C55E";
}
```

**Apply Dynamic Color to Entire Page:**
```tsx
<div
  style={{ "--accent": getThemeColor(player.team) } as React.CSSProperties}
>
  {/* All children inherit --accent */}
</div>
```

```css
button    { background: var(--accent); }
.highlight { color:      var(--accent); }
.border-accent { border-color: var(--accent); }
```

**Result:**
```
Yankees player page → navy accent throughout
Red Sox player page → red accent throughout
Default / home page → terminal green
```

---

<a name="part-25"></a>
## PART 25 — MOBILE-FIRST UI SYSTEM

### CORE PRINCIPLE

```
Build MOBILE first → scale up to desktop
Mobile = 50–60%+ of traffic
```

### MOBILE SCREEN STRUCTURE

```
TOP:    Player header (sticky)
SCROLL: KPIs (horizontal scroll strip)
        Insights
        Percentile bars (stacked vertical)
        Scouting panels
        Fantasy panel
        Live data
BOTTOM: Navigation bar (sticky)
```

### LAYOUT SHIFT: DESKTOP → MOBILE

```
DESKTOP: Left | Center | Right   (3-column grid)
MOBILE:  Single vertical stack   (full width)
```

```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
  ...
</div>
```

### MOBILE COMPONENT PATTERNS

**KPI Horizontal Scroll Strip:**
```tsx
<div className="flex overflow-x-auto space-x-3 pb-2">
  {kpis.map(k => (
    <div key={k.name} className="min-w-[100px] p-3 bg-[#1c1f26] rounded-xl flex-shrink-0">
      <div className="text-xs text-gray-400">{k.name}</div>
      <div className="text-xl font-bold">{k.value}</div>
    </div>
  ))}
</div>
```

**Tappable Panels:**
```tsx
<div className="p-4 bg-[#1c1f26] rounded-2xl mb-3">
  <h3 className="font-bold mb-2">Scouting</h3>
  {/* content */}
</div>
```

**Floating Action Button:**
```tsx
<button className="fixed bottom-5 right-5 bg-green-600 p-4 rounded-full z-50">
  + Compare
</button>
```

### TOUCH UX RULES

```
✅ Large tap targets (min 44px)
✅ Swipe → change player / tab
✅ Tap KPI → expand explanation
✅ Avoid typing requirements
✅ Reduce actions per task
```

### MOBILE PERFORMANCE RULES

```
✅ Lazy-load charts (dynamic imports)
✅ Cache everything possible
✅ Minimal JavaScript payload
✅ No large data grids on mobile
✅ Must pass Core Web Vitals
```

---

<a name="part-26"></a>
## PART 26 — PRODUCT LAYER (SAAS FEATURES)

### PRODUCT ENGAGEMENT FLOW (ADDICTIVE LOOP)

```
Search player
  → View profile
    → Compare to comps
      → Explore similar players
        → Check fantasy impact
          → Add to watchlist
            → Receive alerts
              → Return tomorrow
```

### NEXT ACTIONS COMPONENT (CRITICAL FOR RETENTION)

```tsx
export default function NextActions() {
  return (
    <div className="flex gap-2 mt-4">
      <button>⚖️ Compare Player</button>
      <button>⭐ Add to Watchlist</button>
      <button>🔁 Simulate Trade</button>
    </div>
  );
}
```

### WATCHLIST SYSTEM

```tsx
// Add to watchlist
<button onClick={() => addToWatchlist(player.id)}>
  ⭐ Add to Watchlist
</button>
```

```python
# Backend
@app.post("/watchlist/add")
def add_to_watchlist(data: dict, user=Depends(get_current_user)):
    add_player_to_watchlist(user.id, data["player_id"])
    return {"status": "added"}
```

### ALERT ENGINE

```javascript
// Trigger alerts based on stat thresholds
if (p.exit_velocity > 105) sendAlert("Hard contact spike — check lineup");
if (p.barrel_pct   > 80)  sendAlert("Power surge — elite barrel rate");
if (p.k_streak     > 5)   sendAlert("Strikeout concern — monitor");
```

**Alert types:**
```
• Live in-game alerts (HR, high EV contact)
• Daily digest (player updates)
• Fantasy alerts (start/sit triggers)
```

### PLAYER TIMELINE FEATURE

```
Track development arc:
  • AAA → MLB promotion date
  • Exit velocity spikes
  • IL stints and injury recovery
  • Statistical breakout events
```

```tsx
// Timeline UI
const events = [
  { date: "2025-04-15", event: "Promoted AAA → MLB" },
  { date: "2025-05-02", event: "Exit velo spike: 108 mph avg" },
  { date: "2025-06-20", event: "IL stint — hamstring" },
];
```

### OFFLINE PROFILES

```javascript
// Cache player JSON locally for instant load
const profile = await getPlayerProfile(id);
localStorage.setItem(`player_${id}`, JSON.stringify(profile));
```

### FEATURE GATING (FREEMIUM MODEL)

```
FREE TIER:
  • Basic player profile
  • Limited search (10/day)
  • Basic percentiles

PRO TIER ($5–15/month):
  • GM Mode
  • Trade simulation
  • Player comparisons
  • Advanced insights
  • Scouting panels
  • Prospect system
  • Fantasy engine
  • Live alerts
```

```javascript
// Gating implementation
if (!user.pro) {
  return <PaywallPrompt feature="GM Mode" />;
}
```

### ROLE CLASSIFICATION SYSTEM

```javascript
function classify(p) {
  if (p.barrel > 80 && p.xslg  > 85)  return "Power Hitter";
  if (p.k      > 75 && p.bb    > 70)  return "3 True Outcomes";
  if (p.chase  < 25 && p.bb    > 65)  return "Elite Contact";
  if (p.sprint > 80)                   return "Speed Threat";
  if (p.oaa    > 70)                   return "Premium Glove";
  return "Balanced";
}
```

### RISK METER

```javascript
function risk(p) {
  let variance = Math.abs(p.CAS - p.DQS);
  if (variance > 30) return { level: "HIGH RISK",   label: "⚠️ Volatile profile" };
  if (variance > 15) return { level: "MEDIUM RISK", label: "⚡ Some variance" };
  return               { level: "LOW RISK",    label: "✅ Consistent" };
}
// Display: Upside: High | Risk: Medium | Floor: Moderate
```

### DATA QUALITY GUARD

```javascript
// MANDATORY: guard all display values
function safe(val) {
  return val == null ? "—" : val;
}

// Usage everywhere in UI:
<span>{safe(player.xwoba)}</span>
```

### MONETIZATION STRATEGY

```
Target users:
  • Fantasy baseball players
  • Amateur coaches
  • Advanced baseball analysts
  • Power fans
  • Scouts (independent)

Revenue model:
  1. Subscription ($5–15/month)
  2. Premium features (GM Mode, Comps, Simulations)
  3. Future: API access (sell to developers)

Launch strategy:
  Step 1: Soft launch to friends + fantasy players
  Step 2: Reddit (r/fantasybaseball), Twitter/X, Discord communities
  Step 3: Messaging: "See what MLB teams see"
```

---

<a name="part-27"></a>
## PART 27 — LANDING PAGE & MARKETING COPY

### HERO SECTION (PRIMARY — USE THIS)

```
HEADLINE:  The Baseball Intelligence Platform
SUBHEAD:   See players the way MLB teams do.
BODY:      Scouting. Projections. Strategy. Decisions — all in one system.

PRIMARY CTA:    [Search a Player]
SECONDARY CTA:  [Explore Prospects]
```

### HERO SECTION (AGGRESSIVE ALTERNATIVE)

```
HEADLINE:  Stop Looking at Stats. Start Making Decisions.
SUBHEAD:   Turn baseball data into scouting insight, player value, and winning strategy.
```

### VALUE PROPOSITION SECTION

```
TITLE: From Data → Decision

COPY:
  Raw stats don't win games.
  This platform turns advanced metrics, scouting data, and real-time information
  into clear, actionable decisions.
```

### FEATURE BLOCKS (BENEFITS-FIRST)

```
⚾ Player Intelligence
   Understand how good a player actually is — not just their stats.

📊 Advanced Analytics
   Percentiles, KPIs, and projections built for real evaluation.

🧠 Scouting System
   Identify strengths, weaknesses, and how to attack players.

🎮 GM Mode
   Simulate trades, rosters, and impact before you act.

🔮 Prospect + MiLB
   Track top prospects and future MLB talent.

💰 Fantasy Edge
   Make smarter decisions than your league.
```

### TRUST / CREDIBILITY SECTION

```
TITLE: Built Like a Front Office Tool

COPY:
  This isn't a stat site.
  It's a decision engine.
  Every player profile combines analytics, scouting, projections, and context —
  the same way real teams evaluate talent.
```

### FINAL CTA

```
HEADLINE: Start Seeing the Game Differently
BUTTON:   [Start Exploring]
```

### LANDING PAGE FLOW

```
1. Hero (value prop + CTA)
2. Product explanation
3. Features (benefits-first)
4. Visual demo / screenshot
5. Trust / credibility
6. Final CTA
```

### BRAND IDENTITY

```
Product:  Baseball Intelligence Platform
Brand:    Elite, analytical, modern
Voice:    Confident, clear, direct
Design:   Dark, minimal, data-driven
Feeling:  Power + insight

Name ideas (upgrade options):
  • Diamond Intelligence
  • ScoutCore
  • Baseball IQ
  • PlateIQ
  • RosterLab
```

### LOGO CONCEPTS

```
Option A — "Data Baseball"
  ⚾ baseball outline + 📊 data grid inside
  Meaning: Baseball + analytics fusion

Option B — "Terminal Intelligence"
  ⚾ baseball + subtle chart line overlay
  Like: Statcast meets Bloomberg Terminal

Option C — Minimal Pro
  "BI" (Baseball Intelligence) — sharp data-driven font
```

---

<a name="part-28"></a>
## PART 28 — BUILD ROADMAP (PHASED EXECUTION)

### GOLDEN RULE

```
DO NOT overbuild early.

Winning execution path:
  ✅ Get ONE perfect player profile working
  ✅ Make it fast, clean, decision-focused
  ✅ Then scale features

Not the other way around.
```

---

### PHASE 1 — MVP (Core Foundation)

**Goal:** Working player profile with live or seeded data.

**Build:**
- Next.js app setup
- API endpoint: `/players/{id}/profile`
- UI: KPI bar + Insights + Percentile bars
- Jarvis "What should we do?" output

**This alone beats most existing tools.**

---

### PHASE 2 — DATA PIPELINE

**Goal:** Live Statcast data flowing.

**Build:**
- `/api/savant` proxy endpoint
- CSV parsing + normalization
- League array builder
- Percentile computation
- Player model assembly

---

### PHASE 3 — ANALYTICS & SCOUTING

**Goal:** Real baseball intelligence.

**Build:**
- Full percentile system
- KPIs (CAS, DQS, DPI, TPVI)
- Insight engine (rule-based)
- Vulnerability matrix
- Zone heatmap
- Count matrix
- Arsenal table

---

### PHASE 4 — AI LAYER (JARVIS)

**Goal:** Decision output from structured data.

**Build:**
- Summary engine
- Archetype classifier
- Recommendation engine
- Confidence engine
- "Ask Jarvis" text interface

---

### PHASE 5 — COMPARISON + COMPS

**Goal:** Similar player discovery.

**Build:**
- Similarity vectors (cosine)
- Top 5 comps display
- Comparison overlay UI

---

### PHASE 6 — BACKEND PRODUCTION

**Goal:** Scalable, cached system.

**Build:**
- PostgreSQL schema
- FastAPI endpoints
- Redis caching
- Nightly precompute job
- SSE stream setup

---

### PHASE 7 — GM MODE

**Goal:** Team-level strategy tools.

**Build:**
- Roster builder UI
- Team strength engine
- Trade simulation
- Monte Carlo season simulation
- RE24 decision evaluator

---

### PHASE 8 — PRODUCT LAYER

**Goal:** SaaS product with users.

**Build:**
- JWT auth system
- User roles
- Watchlist + alerts
- Prospect system (Top 100 + org lists)
- Fantasy engine
- Player timeline
- Mobile optimization
- Admin panel + scouting upload
- Paywall / feature gating

---

### PHASE 9 — GROWTH & POLISH

**Goal:** Launch-ready product.

**Build:**
- Landing page
- Onboarding flow
- Dynamic team color theming
- Smart search
- Offline profiles
- Public launch

---

### PRIORITY RANKING (DO IN THIS ORDER)

**🔥 TIER 1 — MUST HAVE (defines your product)**
- ✅ Scouting + Percentiles UI (core experience)
- ✅ Jarvis "What should we do?" output
- ✅ Data pipeline → cached player profiles

**⚡ TIER 2 — DIFFERENTIATION (separates from stat sites)**
- Prospect system (MiLB + Top 100)
- Player comps
- Fantasy layer
- Smart search

**🧱 TIER 3 — PRODUCT LOCK-IN (creates stickiness)**
- Watchlist + alerts
- Player timeline
- Live Statcast feed
- GM simulation

---

## FINAL SYSTEM SUMMARY

```
SYSTEM LAYERS COMPLETE:
  DATA ENGINE         ✅ Fetch → Normalize → Cache
  ANALYTICS ENGINE    ✅ Percentiles → KPIs → Derived
  SCOUTING ENGINE     ✅ Vulnerability → Zones → Counts
  DECISION LAYER      ✅ Jarvis Summary + Recommendation
  COMPARISON ENGINE   ✅ Similarity Vectors + Comps
  GM ENGINE           ✅ Trade Sim + Team Strength + Monte Carlo
  STRATEGY ENGINE     ✅ RE24 + Linear Weights + Bunt Calc
  PROJECTION ENGINE   ✅ Regression + Aging Curve + MiLB Translation
  ML SYSTEM           ✅ Classification + Clustering + Embeddings
  REAL-TIME LAYER     ✅ Statcast Ingestion + SSE Stream
  MiLB + PROSPECTS    ✅ Full pipeline + 20-80 grades
  FANTASY SYSTEM      ✅ Scoring + FVI + Custom Metrics
  USER SYSTEM         ✅ Auth + Roles + Watchlist + Alerts
  ADMIN SYSTEM        ✅ Reports + Approval + Management
  PRODUCT LAYER       ✅ SaaS + Freemium + Monetization
  DESIGN SYSTEM       ✅ Dark terminal + Dynamic team colors
  MOBILE              ✅ Mobile-first + Touch UX
  BACKEND             ✅ FastAPI + Postgres + Redis + Vercel
  LANDING PAGE        ✅ Hero + Features + CTA copy ready
```

**You are not building a dashboard. You are building a Baseball Intelligence Operating System.**

