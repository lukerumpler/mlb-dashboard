# PREAMBLE — AI SYSTEM CONTEXT
(Paste this at the top of your project instructions / AI prompt / docs)

## ⚾ PROJECT IDENTITY
This project is a **Baseball Intelligence Terminal** — not a consumer website.
It is designed to function as:
* an MLB front-office analytics system
* a scouting department evaluation tool
* a Statcast / Savant visualization layer
* a Bloomberg-style data terminal

**Core philosophy:**
* Dense but controlled information
* Every panel has purpose
* No decorative UI
* All visuals are functional

This is the **"Bloomberg Terminal for Baseball."**

## 🧠 SYSTEM PURPOSE
The system transforms raw baseball data into:
1. Decision-ready insights
2. Player evaluations
3. Scouting-grade outputs
4. Comparative league context (percentiles, value, ranks)

The system is **NOT** designed to:
* entertain
* simplify for casual users
* display raw stats without interpretation

## 📊 DATA ARCHITECTURE PRINCIPLES

### 1) ALL DATA FLOWS THROUGH PROXIES
🚨 **CRITICAL RULE:**
* **NEVER** call external APIs directly from the browser
* **ALWAYS** use serverless proxy routes:
    * `/api/mlb?path=...`
    * `/api/savant?endpoint=...`

This ensures:
* no CORS failures
* centralized caching
* consistent request behavior

### 2) DATA SOURCES
The system integrates:
* **MLB Stats API**
    * roster
    * career stats
    * splits
* **Baseball Savant (Statcast)**
    * xwOBA, xBA, xSLG
    * EV metrics
    * HardHit%
    * Barrel%
    * sprint speed, OAA
* **Derived (internal)**
    * percentiles
    * z-scores
    * scouting grades (20–80)
    * player valuation ($/WAR)

### 3) NO FABRICATED DATA
🚨 **ABSOLUTE RULE:**
If data is missing:
* show "—" or "N/A"
* **DO NOT** guess
* **DO NOT** simulate
* **DO NOT** fill with averages

This applies especially to:
* Stuff+
* Command+
* advanced scouting metrics

## 📈 ANALYTICS PHILOSOPHY

### 1) Raw stats are NOT enough
The system must always prefer:
* percentiles > raw stats
* relative performance > absolute numbers
* league context > isolated values

### 2) Percentiles are PRIMARY UI
All key metrics must be expressed as:
* percentile (0–100)
* color-coded meaning
* position within league distribution

### 3) Percentile meaning
| Range | Meaning |
| :--- | :--- |
| 80–100 | Elite |
| 60–79 | Above Avg |
| 40–59 | Average |
| 20–39 | Below Avg |
| 0–19 | Poor |

### 4) Direction matters
Some metrics invert:
| Metric | Better Direction |
| :--- | :--- |
| xwOBA | High |
| HardHit% | High |
| Barrel% | High |
| K% | **LOW** |
| Chase% | **LOW** |
| Whiff% | **LOW** |

The system must correctly invert percentiles where needed.

## 🎨 UI / VISUAL SYSTEM RULES

### 1) Percentile bars (STRICT SPEC)
Each bar must:
* fill left → right
* use a light gray track
* include a colored fill
* include a bubble at endpoint

**Bubble rules:**
* Position: sits **ON** the fill edge
* Shape: circle
* Size: ~22px
* Text: percentile number

This is **NOT optional** — this defines the system’s visual language.

### 2) Color = meaning (not decoration)
* **Red** → elite / exploit
* **Orange** → above average
* **Gray** → average
* **Blue** → below average
* **Dark blue** → poor

### 3) Layout hierarchy
Every profile follows:
* **LEFT** → identity + value + scouting
* **CENTER** → analytics engine (percentiles, splits, career)
* **RIGHT** → advanced scouting / pitch data / visualizations

### 4) Information density rules
* Panels must be compact
* No unnecessary whitespace
* No oversized UI elements
* Always prioritize scan speed

## ⚙️ PROCESSING RULES

### 1) Percentile calculation
Percentiles must be:
* computed from full league dataset
* based on current season
* consistent across players

### 2) Scouting grades (20–80 scale)
If distributions exist:
`Grade = 50 + (z-score × 10)`
Clamp between 20–80

### 3) Player valuation
**Baseline:**
`Market Value = WAR × $/WAR`
`$/WAR ≈ 7.125M`

**Optional:**
* show range ±1 WAR
* include surplus value

## 🔄 INTERACTION MODEL
**Profile load workflow:**
`loadPlayerProfile()`
↓
Fetch MLB data
Fetch Savant data
↓
Parse + compute metrics
↓
Compute percentiles
↓
Render UI

**Updates must be:**
* instant (no refresh required)
* modular (re-render sections, not entire page)
* stateless-safe

## ⚠️ AI BEHAVIOR RULES
When an AI edits this system, it **MUST**:
✅ Make surgical edits only
✅ Preserve working logic
✅ Follow proxy routing rules
✅ Respect UI consistency

❌ **MUST NOT:**
* rewrite entire files
* change API architecture
* introduce direct fetch to external APIs
* fabricate data

## ✅ SUCCESS CRITERIA
The system is correct when:
1. All data is real or clearly marked missing
2. Percentiles are meaningful and consistent
3. UI is dense but readable
4. Information is actionable (not just displayed)
5. Nothing feels like a "fan site"

---

## ✅ PART 2 — DATA MODELING + ANALYTICS ENGINE (DEEP IMPLEMENTATION)
This is where your system becomes professional-grade instead of just “fetch and display.”
Everything here determines:
* how accurate your percentiles are
* how scalable your system is
* how future-proof your architecture becomes

### 🧠 SECTION 1 — YOUR INTERNAL DATA MODEL (CRITICAL)
You need a single, unified structure that everything flows through.

✅ **GOLD STANDARD: PlayerAnalyticsModel**
Every time you load a player, you should convert ALL data into ONE object:
```javascript
var PlayerAnalyticsModel = {
  // ✅ Identity
  info: {
    name: '',
    team: '',
    position: '',
    bats: '',
    throws: ''
  },

  // ✅ Raw stats (from APIs)
  raw: {
    mlb: {},      // MLB Stats API
    savant: {},   // statcast_leaderboard
    expected: {}  // expected_statistics
  },

  // ✅ Derived stats (you calculate)
  derived: {
    iso: null,
    bbRate: null,
    kRate: null,
    kbb: null
  },

  // ✅ League distributions (arrays)
  league: {
    xwOBA: [],
    xBA: [],
    xSLG: [],
    EV: [],
    HardHit: [],
    Barrel: [],
    Chase: [],
    Whiff: []
  },

  // ✅ Percentiles (core system output)
  percentiles: {},

  // ✅ UI-ready grouped format
  grouped: []
};
```

**💡 Why this is so important**
* Without this: ❌ you’ll recompute values everywhere, ❌ percentiles will be inconsistent, ❌ UI logic gets mixed with data logic
* With it: ✅ clean pipeline, ✅ easy debugging, ✅ easy feature expansion

### 📊 SECTION 2 — ADVANCED STAT FORMULAS (REAL BASEBALL LOGIC)
Now we define true derived stats.

✅ **1) ISO (Isolated Power)**
```javascript
function calcISO(avg, slg){
  if(avg==null || slg==null) return null;
  return slg - avg;
}
```

✅ **2) BB% (walk rate)**
```javascript
function calcBBRate(bb, pa){
  if(!bb || !pa) return null;
  return (bb / pa) * 100;
}
```

✅ **3) K% (strikeout rate)**
```javascript
function calcKRate(k, pa){
  if(!k || !pa) return null;
  return (k / pa) * 100;
}
```

✅ **4) K-BB% (IMPORTANT SCOUTING METRIC)**
```javascript
function calcKBB(kRate, bbRate){
  if(kRate==null || bbRate==null) return null;
  return kRate - bbRate;
}
```

✅ **5) OPS (basic but useful)**
```javascript
function calcOPS(obp, slg){
  if(obp==null || slg==null) return null;
  return obp + slg;
}
```

✅ **6) OPTIONAL — wOBA (advanced)**
If you want to add league-weighted formula:
```javascript
function calcWOBA(stats){
  // simplified example (weights vary by season)
  return (0.7*stats.bb + 0.9*stats.h + 1.2*stats.hr) / stats.pa;
}
```
⚠️ Only use real weights if you pull them — otherwise label as estimate.

### 📈 SECTION 3 — TRUE PERCENTILE ENGINE (NOT FAKE)
This is your core differentiator.

✅ **Correct percentile computation**
```javascript
function computePercentile(arr, val, higherBetter){
  if(val==null) return null;

  var valid = arr.filter(v => v != null).sort((a,b)=>a-b);

  var idx = valid.findIndex(v => v >= val);
  if(idx < 0) idx = valid.length - 1;

  var pct = Math.round((idx / valid.length) * 100);

  if(!higherBetter) pct = 100 - pct;

  return Math.max(1, Math.min(99, pct));
}
```

⚠️ **CRITICAL — Metric direction logic**
You MUST define this once:
```javascript
var METRIC_DIRECTION = {
  xwOBA: true,
  xBA: true,
  xSLG: true,
  EV: true,
  HardHit: true,
  Barrel: true,

  K: false,
  Chase: false,
  Whiff: false
};
```

✅ **Centralized percentile builder**
```javascript
function buildPercentiles(model){
  var p = {};

  p.XWOBA = {
    pct: computePercentile(model.league.xwOBA, model.raw.expected.xwoba, true),
    raw: model.raw.expected.xwoba
  };

  p.XBA = {
    pct: computePercentile(model.league.xBA, model.raw.expected.xba, true),
    raw: model.raw.expected.xba
  };

  p.XSLG = {
    pct: computePercentile(model.league.xSLG, model.raw.expected.xslg, true),
    raw: model.raw.expected.xslg
  };

  p.AVG_EV = {
    pct: computePercentile(model.league.EV, model.raw.savant.avg_hit_speed, true),
    raw: model.raw.savant.avg_hit_speed
  };

  return p;
}
```

### 🧱 SECTION 4 — GROUPING ENGINE (UI STRUCTURE)
This converts percentiles → UI

✅ **Standard grouping**
```javascript
function buildGroups(p){
  return [
    {
      title: 'VALUE',
      items: [
        {label:'WAR', pct:null, raw:'—'},
        {label:'OPS+', pct:null, raw:'—'}
      ]
    },
    {
      title: 'BATTING',
      items: [
        p.XWOBA,
        p.XBA,
        p.XSLG,
        p.AVG_EV
      ]
    },
    {
      title: 'PLATE DISCIPLINE',
      items: [
        p.K,
        p.BB
      ]
    }
  ];
}
```

### ⚙️ SECTION 5 — FULL PIPELINE (THIS IS YOUR SYSTEM)
This is the entire system flow:
```javascript
async function buildPlayerAnalytics(playerName){
  var model = {...PlayerAnalyticsModel};

  // 1. fetch data
  var [lbCSV, expCSV] = await Promise.all([
    fetchSavantCSV('statcast_leaderboard', SEASON),
    fetchSavantCSV('expected_statistics', SEASON)
  ]);

  // 2. parse
  var lbRows = parseCSV(lbCSV);
  var expRows = parseCSV(expCSV);

  // 3. find player
  var playerRow = findPlayer(lbRows, playerName);
  var expRow = expRows.find(r => r.player_id === playerRow.player_id);

  model.raw.savant = playerRow;
  model.raw.expected = expRow;

  // 4. build league arrays
  model.league.xwOBA = getColumnArray(expRows, 'xwoba');
  model.league.xBA   = getColumnArray(expRows, 'xba');
  model.league.xSLG  = getColumnArray(expRows, 'xslg');

  // 5. compute percentiles
  model.percentiles = buildPercentiles(model);

  // 6. group
  model.grouped = buildGroups(model.percentiles);

  return model;
}
```

### 🎯 SECTION 6 — WHY THIS MATTERS
This architecture gives you:
✅ TRUE statcast percentiles
✅ reproducible analytics
✅ scalable system
✅ no duplicated logic
✅ clean separation of concerns

---

## ✅ PART 3 — UI ENGINE (RENDER SYSTEM + VISUAL LOGIC)
This is the layer that turns your analytics into a true terminal interface.

### 🎯 SECTION 1 — UI ARCHITECTURE (CRITICAL CONCEPT)
You are not “building HTML.” You are building a **rendering engine**.

🧠 **Think like this:**
Instead of: `element.innerHTML = "some string";`
You do: `renderPercentilesGrouped(target, data);`

✅ **UI SYSTEM STRUCTURE**
You should split the UI into render modules:
* `renderPercentilesGrouped()`
* `renderPercentiles()` (horizontal)
* `renderPercentilesVertical()`
* `renderPercentilesRing()`
* `renderSectionHeader()`
* `renderProfileLayout()`

**💡 Why this matters**
* Without modular UI: ❌ impossible to maintain, ❌ hard to update, ❌ inconsistent
* With it: ✅ reusable, ✅ scalable, ✅ clean

### ✅ SECTION 2 — CORE UI BUILDING BLOCK: PERCENTILE ROW
This is the most important UI element in your system.

✅ **HTML template (DO THIS ONCE)**
```html
<template id="tpl-pct-row">
  <div class="pct-row">
    <div class="pct-label"></div>
    <div class="pct-track">
      <div class="pct-fill"></div>
      <div class="pct-bubble"></div>
    </div>
    <div class="pct-raw"></div>
  </div>
</template>
```

✅ **CSS (STRICT SPEC IMPLEMENTATION)**
```css
.pct-row{
  display:grid;
  grid-template-columns: 110px 1fr 60px;
  gap:10px;
  align-items:center;
  padding:6px 0;
}

.pct-label{
  text-align:right;
  font-size:11px;
  letter-spacing:1px;
  color:var(--text-dim);
}

.pct-track{
  position:relative;
  height:18px;
  background:rgba(255,255,255,.10);
  border-radius:10px;
}

.pct-fill{
  height:100%;
  width:0%;
  border-radius:10px;
}

.pct-bubble{
  position:absolute;
  top:50%;
  transform:translate(-50%,-50%);
  width:22px;
  height:22px;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:11px;
}

.pct-raw{
  text-align:right;
  font-size:11px;
}
```

### ✅ SECTION 3 — COLOR ENGINE (VERY IMPORTANT)
This defines how your system “feels”.

✅ **Core function**
```javascript
function pctColor(p){
  if(p == null){
    return {
      fill: 'rgba(255,255,255,.25)',
      bubble: 'rgba(255,255,255,.20)'
    };
  }

  if(p >= 80) return {fill:'#C0392B', bubble:'#C0392B'};
  if(p >= 60) return {fill:'#E8722A', bubble:'#E8722A'};
  if(p >= 40) return {fill:'#7F8C8D', bubble:'#7F8C8D'};
  if(p >= 20) return {fill:'#5AB4F5', bubble:'#5AB4F5'};
  return {fill:'#1A3A5C', bubble:'#1A3A5C'};
}
```

### ✅ SECTION 4 — HORIZONTAL BAR RENDERER

✅ **Renderer function**
```javascript
function renderPercentiles(targetId, items){
  var host = document.getElementById(targetId);
  host.innerHTML = '';

  var tpl = document.getElementById('tpl-pct-row');

  items.forEach(function(it){
    var node = tpl.content.cloneNode(true);

    var pct = parseInt(it.pct);
    var hasPct = isFinite(pct);

    var label = node.querySelector('.pct-label');
    var fill  = node.querySelector('.pct-fill');
    var bubble= node.querySelector('.pct-bubble');
    var raw   = node.querySelector('.pct-raw');

    var c = pctColor(pct);

    label.textContent = it.label || '';

    fill.style.width = hasPct ? pct + '%' : '0%';
    fill.style.background = c.fill;

    bubble.textContent = hasPct ? pct : '—';
    bubble.style.left = hasPct ? pct + '%' : '2%';
    bubble.style.background = c.bubble;

    raw.textContent = it.raw || '—';

    host.appendChild(node);
  });
}
```

### ✅ SECTION 5 — GROUPED RENDERER (KEY SYSTEM)

✅ **Code**
```javascript
function renderPercentilesGrouped(targetId, groups){
  var host = document.getElementById(targetId);
  host.innerHTML = '';

  groups.forEach(function(group){
    // section container
    var section = document.createElement('div');
    section.className = 'pct-section';

    // header
    var hdr = document.createElement('div');
    hdr.className = 'pct-header';
    hdr.innerHTML =
      '<div class="title">'+group.title+'</div>'+
      '<div class="scale">POOR ▲   AVG ▲   GREAT ▲</div>';

    section.appendChild(hdr);

    // inner container
    var inner = document.createElement('div');
    section.appendChild(inner);

    host.appendChild(section);

    // render bars into inner
    renderPercentiles(inner.id = 'tmp'+Math.random(), group.items);
  });
}
```

### ✅ SECTION 6 — VERTICAL BAR ENGINE
Used for “terminal density”.

✅ **CSS**
```css
.pct-v{
  width:16px;
  height:90px;
  background:rgba(255,255,255,.08);
  position:relative;
}

.pct-v-fill{
  position:absolute;
  bottom:0;
  width:100%;
}
```

✅ **JS**
```javascript
function renderPercentilesVertical(targetId, items){
  var host = document.getElementById(targetId);
  host.innerHTML = '';

  items.forEach(function(it){
    var pct = parseInt(it.pct);
    var c = pctColor(pct);

    var box = document.createElement('div');
    box.className = 'pct-v-box';

    var track = document.createElement('div');
    track.className = 'pct-v';

    var fill = document.createElement('div');
    fill.className = 'pct-v-fill';
    fill.style.height = pct + '%';
    fill.style.background = c.fill;

    track.appendChild(fill);

    box.appendChild(track);
    host.appendChild(box);
  });
}
```

### ✅ SECTION 7 — CIRCULAR (RING) ENGINE

✅ **SVG version**
```javascript
function renderPercentilesRing(targetId, items){
  var host = document.getElementById(targetId);
  host.innerHTML = '';

  items.forEach(function(it){
    var pct = parseInt(it.pct);
    var c = pctColor(pct);

    var r = 18;
    var circumference = 2 * Math.PI * r;
    var offset = circumference * (1 - pct/100);

    var div = document.createElement('div');
    div.className = 'pct-ring';

    div.innerHTML = `
      <svg viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="18"
          stroke="rgba(255,255,255,.10)"
          stroke-width="6" fill="none"></circle>
        <circle cx="22" cy="22" r="18"
          stroke="${c.fill}"
          stroke-width="6"
          fill="none"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
          transform="rotate(-90 22 22)"></circle>
      </svg>
      <div class="ring-val">${pct}</div>
    `;

    host.appendChild(div);
  });
}
```

### ✅ SECTION 8 — DYNAMIC UPDATE SYSTEM

✅ **One global state**
```javascript
var currentProfile = {
  grouped: [],
  snapshot: []
};
```

✅ **Re-render function**
```javascript
function rerenderProfile(){
  renderPercentilesGrouped('pp-bars', currentProfile.grouped);

  renderPercentilesVertical(
    'pp-bars-vertical',
    currentProfile.snapshot.slice(0,4)
  );

  renderPercentilesRing(
    'pp-bars-circles',
    currentProfile.snapshot.slice(0,6)
  );
}
```

✅ **Update call**
```javascript
function updateProfileUI(grouped){
  currentProfile.grouped = grouped;
  currentProfile.snapshot = grouped[0].items;

  rerenderProfile();
}
```

### ✅ SECTION 9 — PERFORMANCE RULES
🚨 **MUST DO**
* **ONLY** re-render sections that changed
* **NEVER** rebuild entire HTML page
* **CACHE** fetched data (`sessionStorage`)

✅ **Example caching**
```javascript
var key = 'savant_' + playerId + '_' + SEASON;

if(sessionStorage[key]){
  return JSON.parse(sessionStorage[key]);
}

sessionStorage[key] = JSON.stringify(data);
```

### ✅ SECTION 10 — FINAL SYSTEM VIEW
You now have:
**DATA ENGINE** → **ANALYTICS ENGINE** → **GROUPED DATA MODEL** → **UI RENDER ENGINE**

---

## ✅ PART 4 — SCOUTING GRADES ENGINE (20–80) + VALUATION ENGINE ($)

### SECTION 1 — SCOUTING GRADES (20–80) ENGINE

#### 1.1 What “scouting grades” are in your system
Your spec requires the Player Profile left column to show a 20–80 scouting table (Hit, Raw Power, Game Power, Speed, Field, Arm, Overall FV) plus a Scout Note paragraph.
The key challenge: MLB Stats API does **NOT** provide real scouting grades.
So your system must support three sources:
* ✅ **Tier A (Best):** Real grades from your internal scouting JSON (future or existing dataset)
* ✅ **Tier B (Good):** User-entered grades from Scout Notes tab (manual)
* ✅ **Tier C (Fallback):** Stats-derived proxy grades (deterministic math; clearly labeled)

The fallback must never pretend it’s a real scouting report—your spec says do not fabricate.

#### 1.2 Core math: Z-score → 20–80 mapping (the professional method)
If you have league distributions (mean & std dev), use:
**Z-score:** `z = (x − μ) / σ`
**Grade:** `grade = clamp(20, 80, round(50 + 10·z))`

This produces:
* 50 at average
* 60 at +1 SD
* 70 at +2 SD
* 80 at +3 SD

**Drop-in code:**
```javascript
function clamp(min, max, v){ return Math.max(min, Math.min(max, v)); }

function zScore(x, mu, sigma){
  x=parseFloat(x); mu=parseFloat(mu); sigma=parseFloat(sigma);
  if(!isFinite(x)||!isFinite(mu)||!isFinite(sigma)||sigma===0) return null;
  return (x - mu) / sigma;
}

function grade20_80_fromZ(z){
  if(z==null || !isFinite(z)) return null;
  return clamp(20, 80, Math.round(50 + 10*z));
}
```

#### 1.3 Stats-derived proxy scouting grades (Tier C fallback)
For fallback grades, use objective proxies:
* **HIT tool proxy:** `z_hit = 0.70·z(xBA) + 0.30·z(−K%)`
* **RAW POWER proxy:** `z_raw = 0.60·z(MaxEV) + 0.40·z(ISO)`
* **GAME POWER proxy:** `z_game = 0.50·z(xSLG) + 0.30·z(Barrel%) + 0.20·z(HR/650)`
* **SPEED proxy:** `z_spd = z(SprintSpeed)`
* **OVERALL FV proxy:** `z_fv = 0.35·z_hit + 0.30·z_game + 0.15·z_raw + 0.10·z_spd + 0.10·z_fld`

#### 1.4 Implementing proxy grades using your “live Savant percentiles arrays”
Reuse the league arrays built in Part 2.
**Drop-in helpers:**
```javascript
function mean(arr){
  var a=arr.filter(v=>v!=null && isFinite(v));
  if(!a.length) return null;
  return a.reduce((s,v)=>s+v,0)/a.length;
}
function stdev(arr){
  var m=mean(arr); if(m==null) return null;
  var a=arr.filter(v=>v!=null && isFinite(v));
  if(a.length<2) return null;
  var v=a.reduce((s,x)=>s+Math.pow(x-m,2),0)/(a.length-1);
  return Math.sqrt(v);
}
```

#### 1.5 Tool labels (Elite/Plus/etc.)
| Grade | Label |
| :--- | :--- |
| 80 | Elite |
| 70 | Plus |
| 60 | Above Avg |
| 55 | Solid Avg |
| 50 | Average |
| 45 | Below Avg |
| 40 | Fringe |
| 30 | Poor |
| 20 | Deficient |

#### 1.6 Wiring scouting grades into the UI
```javascript
function setTool(idGrade, idLbl, g){
  var el = document.getElementById(idGrade);
  var lb = document.getElementById(idLbl);
  if(el) el.textContent = (g==null ? '—' : g);
  if(lb) lb.textContent = (g==null ? '—' : gradeLabel(g));
  if(el && g!=null) el.className = 'tool-grade ' + gradeClass(g);
}

function applyScoutingGrades(gr){
  setTool('ppg-hit','ppg-hit-lbl', gr.HIT);
  setTool('ppg-raw','ppg-raw-lbl', gr.RAW);
  setTool('ppg-game','ppg-game-lbl', gr.GAME);
  setTool('ppg-spd','ppg-spd-lbl', gr.SPD);
  setTool('ppg-fld','ppg-fld-lbl', gr.FLD);
  setTool('ppg-arm','ppg-arm-lbl', gr.ARM);
  setTool('ppg-fv','ppg-fv-lbl', gr.FV);

  var note = document.getElementById('pp-scoutnote');
  if(note && (!note.textContent || note.textContent.trim()==='—')){
    note.textContent = (gr._src === 'stats-derived')
      ? 'Scout grades shown are stats-derived proxies (no manual report available).'
      : note.textContent;
  }
}
```

### SECTION 2 — PLAYER VALUATION ($) ENGINE

#### 2.1 What the spec demands in valuation
* WAR projected
* $/WAR shown as $7.125M/WAR (standard market rate)
* Market value + range (±1σ)
* Surplus value in Contract & Value box

#### 2.2 Valuation math (baseline)
* **Market Value ($M):** `WAR · 7.125`
* **Range (±1 WAR band):** `Low = (WAR − 1) · 7.125`, `High = (WAR + 1) · 7.125`
* **Contract Cost ($M):** `AAV · Years`
* **Surplus ($M):** `Market Value − Contract Cost`

```javascript
var DOLLARS_PER_WAR_M = 7.125;

function marketValueM(war){
  war=parseFloat(war);
  if(!isFinite(war)) return null;
  return war * DOLLARS_PER_WAR_M;
}

function valueRangeM(war){
  war=parseFloat(war);
  if(!isFinite(war)) return {low:null, base:null, high:null};
  return {
    low: marketValueM(war-1),
    base: marketValueM(war),
    high: marketValueM(war+1)
  };
}

function fmtM(x){
  x=parseFloat(x);
  return isFinite(x) ? ('$' + x.toFixed(1) + 'M') : '—';
}
```

#### 2.3 Wiring valuation into the UI
```javascript
function applyValuationToProfile(warProj){
  var rng = valueRangeM(warProj);

  var warEl = document.getElementById('pp-warproj');
  if(warEl) warEl.textContent = (warProj==null ? '—' : warProj);

  var dpw = document.getElementById('pp-dollarwar');
  if(dpw) dpw.textContent = '$' + DOLLARS_PER_WAR_M.toFixed(3) + 'M';

  var mv = document.getElementById('pp-mktval');
  if(mv) mv.textContent = fmtM(rng.base);

  var rg = document.getElementById('pp-mktrange');
  if(rg) rg.textContent = (rng.low==null) ? 'Range: —' : ('Range: ' + fmtM(rng.low) + ' – ' + fmtM(rng.high));
}
```

### SECTION 3 — CONNECT EVERYTHING IN loadPlayerProfile()
1. Fetch MLB player stats via `/api/mlb?path=...`
2. Fetch Savant CSV via `/api/savant?endpoint=...`
3. Build your unified model
4. Compute percentiles
5. Compute scouting grades fallback
6. Render percentiles grouped + vertical + rings
7. Apply scouting grades
8. Apply valuation

---

## ✅ PART 5 — ADVANCED SCOUTING ENGINE (RIGHT COLUMN “TERMINAL PANELS”)
This section implements the Bloomberg-style intelligence panels:
* Pitch Type Vulnerability Matrix
* Count Usage Matrix
* Zone Heat Map (xSLG allowed)
* Arsenal & Pitch Metrics
* Pitch Locations (LHB / RHB)

### 🧠 SECTION 1 — WHAT YOU ARE BUILDING
The right column is: **ADVANCE SCOUTING** → **COUNT USAGE MATRIX** → **ZONE HEATMAP** → **ARSENAL TABLE** → **PITCH LOCATIONS**

### ✅ SECTION 2 — DATA MODEL FOR SCOUTING
```javascript
var AdvancedScoutingModel = {
  vulnerability: { vsLHP: {}, vsRHP: {} },
  countMatrix: { "0-0": {}, "1-0": {}, "2-0": {} },
  zoneHeatmap: [],
  arsenal: [],
  pitchLocations: { vsLHB: [], vsRHB: [] }
};
```

### ✅ SECTION 3 — PITCH TYPE VULNERABILITY MATRIX
Shows how hitter performs vs different pitch types.

```javascript
function renderVulnerability(targetId, data){
  var host = document.getElementById(targetId);
  var pitches = ['FB','SL','CB','CH'];

  var html = '<table class="scout-table"><tr><th>Split</th>';
  pitches.forEach(p=> html += '<th>'+p+'</th>');
  html += '</tr>';

  ['vsLHP','vsRHP'].forEach(function(split){
    html += '<tr><td>'+split+'</td>';
    pitches.forEach(function(p){
      var val = data[split][p];
      var cls = val > .500 ? 'bad' : 'good';
      html += '<td class="'+cls+'">'+val.toFixed(3)+'</td>';
    });
    html += '</tr>';
  });

  html += '</table>';
  host.innerHTML = html;
}
```

### ✅ SECTION 4 — COUNT USAGE MATRIX
Tells what pitchers should throw; shows frequency by count.

```javascript
function renderCountMatrix(targetId, matrix){
  var host = document.getElementById(targetId);
  var pitches = ['FB','SL','CB','CH'];

  var html = '<table class="scout-table"><tr><th>Pitch</th>';
  Object.keys(matrix).forEach(c => html += '<th>'+c+'</th>');
  html += '</tr>';

  pitches.forEach(function(p){
    html += '<tr><td>'+p+'</td>';
    Object.keys(matrix).forEach(function(c){
      var val = matrix[c][p] || 0;
      var cls = val > 35 ? 'high' : 'low';
      html += '<td class="'+cls+'">'+val+'%</td>';
    });
    html += '</tr>';
  });

  html += '</table>';
  host.innerHTML = html;
}
```

### ✅ SECTION 5 — ZONE HEAT MAP (CRITICAL)
Shows where hitters do damage; drives pitch location strategy.

```javascript
function renderZoneHeatmap(targetId, grid){
  var host = document.getElementById(targetId);
  var html = '<div class="zone-grid">';

  grid.forEach(function(row){
    row.forEach(function(val){
      var color;
      if(val > .500) color = 'red';
      else if(val > .400) color = 'orange';
      else if(val > .300) color = 'gray';
      else color = 'blue';
      html += '<div class="zone '+color+'">'+val.toFixed(3)+'</div>';
    });
  });

  html += '</div>';
  host.innerHTML = html;
}
```

### ✅ SECTION 6 — ARSENAL TABLE (PITCH DATA)
Shows pitch mix and effectiveness.

```javascript
function renderArsenal(targetId, data){
  var host = document.getElementById(targetId);
  var html = '<table class="scout-table">';
  html += '<tr><th>Pitch</th><th>Usage%</th><th>Velo</th><th>Spin</th><th>Whiff%</th></tr>';

  data.forEach(function(p){
    html += `<tr>
      <td>${p.pitch}</td>
      <td>${p.usage}%</td>
      <td>${p.velo}</td>
      <td>${p.spin}</td>
      <td>${p.whiff}%</td>
    </tr>`;
  });

  html += '</table>';
  host.innerHTML = html;
}
```

---

## ✅ PART 6 — FINAL SYSTEM (PERFORMANCE, CACHING, POLISH, PRODUCTION)

### ⚡ SECTION 1 — PERFORMANCE & CACHING (CRITICAL)
**SOLUTION: Multi-layer caching**
* **Layer 1 — Browser cache (`sessionStorage`):** Instant reloads after first fetch.
* **Layer 2 — Vercel edge caching:** Data cached at CDN level.
* **Layer 3 — In-memory model cache:** Profile switching becomes instant.

### ⚡ SECTION 2 — UI PERFORMANCE (SMOOTH & FAST)
* **Rule:** **NEVER** rebuild entire page.
* **Rule:** Minimal DOM writes (use `DocumentFragment`).

### ✨ SECTION 3 — ANIMATION (PROFESSIONAL FEEL)
* Animate bar fill with CSS transitions.
* Stagger effect for elite polish.
* Fade-in panels.

### 🎯 SECTION 4 — ERROR HANDLING (PRODUCTION SAFE)
* Always wrap fetch in `try/catch`.
* UI safe fallback for missing data.
* Always guard undefined values with `?? null`.

### 🎯 SECTION 5 — FINAL PROFILE LOAD FLOW (COMPLETE)
```javascript
async function loadPlayerProfile(playerId){
  try{
    var model = await getPlayerModel(playerId);
    renderPercentilesGrouped('pp-bars', model.grouped);
    renderPercentiles('pp-bars-vertical', model.grouped[0].items, 'v');
    renderPercentiles('pp-bars-circles', model.grouped[0].items, 'ring');
    var grades = buildScoutingGradesFromModel(model);
    applyScoutingGrades(grades);
    applyValuationToProfile(model.derived.warProj);
    renderVulnerability('pp-advscout', model.scouting.vulnerability);
    renderCountMatrix('pp-countmatrix', model.scouting.countMatrix);
    renderZoneHeatmap('pp-zoneheat', model.scouting.zone);
    renderArsenal('pp-arsenal', model.scouting.arsenal);
  }catch(e){
    console.error(e);
  }
}
```

---

## ✅ PART 7 — ELITE ENGINEERING + EXTENSIONS (NEXT LEVEL)

### 🧠 SECTION 1 — UPGRADE YOUR DATA PIPELINE (CRITICAL STEP)
Upgrade to: **Fetch → Normalize → Model → Compute → Cache → Render**

### 📊 SECTION 2 — ADVANCED ANALYTICS (REAL MLB LOGIC)
* **1) Contact Quality Index (ELITE METRIC):** `CQI = weighted(xwOBA, Barrel%, HardHit%)`
* **2) Plate Discipline Score:** `disciplineScore = bb - k - chase/2`
* **3) “True Offensive Impact”:** Blend of percentiles.

### 🎯 SECTION 3 — ADD “VALUE MODELING LAYER”
Upgrade valuation beyond basic $/WAR by adding an **aging curve**.

### ⚡ SECTION 4 — BACKEND OPTIMIZATION (FASTAPI / PYTHON)
* **1. Use `lru_cache` for heavy math.**
* **2. Implement a profile cache.**
* **3. Preload hot players (Ohtani, Judge).**
* **4. Make Statcast fetch fast + stable.**
* **5. Reduce data size by keeping only needed columns.**
* **6. Add simple rate limit.**
* **7. Eliminate cold start delays.**

---
**END OF PREAMBLE**
