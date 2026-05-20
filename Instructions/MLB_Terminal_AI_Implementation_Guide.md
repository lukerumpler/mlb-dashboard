# MLB Baseball Intelligence Terminal — AI Implementation Guide

> **Purpose:** This document is a step-by-step guide for an AI assistant (Claude, GPT-4, Cursor, etc.) to implement the full system spec into `index.html`. Read the entire guide before making any edits. Follow the rules in the preamble at all times.

---

## ⚠️ GROUND RULES FOR THE AI

Before touching any code, internalize these non-negotiable rules:

1. **Make surgical edits only.** Never rewrite the whole file. Identify the exact block to change and change only that.
2. **Never call external APIs directly from the browser.** All data must flow through proxy routes: `/api/mlb?path=...` and `/api/savant?endpoint=...`.
3. **Never fabricate data.** If a value is missing, render `—` or `N/A`. Do not guess, average, or simulate.
4. **Preserve all working logic.** If a feature already works, do not break it.
5. **Follow the UI spec exactly.** Percentile bars, bubble endpoints, color coding — these are not stylistic suggestions. They define the system's visual language.

---

## PHASE 1 — UNIFIED DATA MODEL

### What to do
Locate the top of the `<script>` section (or create a dedicated `<!-- DATA MODEL -->` comment block) and insert the `PlayerAnalyticsModel` object. This is the single source of truth that all data flows through.

### Code to insert

```javascript
var PlayerAnalyticsModel = {
  info: { name: '', team: '', position: '', bats: '', throws: '' },
  raw: { mlb: {}, savant: {}, expected: {} },
  derived: { iso: null, bbRate: null, kRate: null, kbb: null, warProj: null },
  league: { xwOBA: [], xBA: [], xSLG: [], EV: [], HardHit: [], Barrel: [], Chase: [], Whiff: [] },
  percentiles: {},
  grouped: []
};
```

### Why this matters
Without this unified model, percentiles become inconsistent, UI logic gets tangled with data logic, and expanding the system becomes impossible. Every fetch, computation, and render must read from and write to this object.

---

## PHASE 2 — DERIVED STAT FORMULAS

### What to do
Add these pure utility functions immediately after the data model declaration. They take raw numbers and return derived stats.

```javascript
// ISO (Isolated Power)
function calcISO(avg, slg) {
  if (avg == null || slg == null) return null;
  return slg - avg;
}

// BB% (walk rate)
function calcBBRate(bb, pa) {
  if (!bb || !pa) return null;
  return (bb / pa) * 100;
}

// K% (strikeout rate)
function calcKRate(k, pa) {
  if (!k || !pa) return null;
  return (k / pa) * 100;
}

// K-BB% (key scouting metric — lower is better)
function calcKBB(kRate, bbRate) {
  if (kRate == null || bbRate == null) return null;
  return kRate - bbRate;
}

// OPS
function calcOPS(obp, slg) {
  if (obp == null || slg == null) return null;
  return obp + slg;
}
```

### Notes
- These functions return `null` on missing input — never a fallback average.
- Call them after raw data is loaded and store results in `model.derived`.

---

## PHASE 3 — PERCENTILE ENGINE

### What to do
Add the following functions. These convert raw stat values into percentiles by comparing against the full league dataset.

```javascript
// Core percentile computer — direction-aware
function computePercentile(arr, val, higherBetter) {
  if (val == null) return null;
  var valid = arr.filter(v => v != null).sort((a, b) => a - b);
  var idx = valid.findIndex(v => v >= val);
  if (idx < 0) idx = valid.length - 1;
  var pct = Math.round((idx / valid.length) * 100);
  if (!higherBetter) pct = 100 - pct;
  return Math.max(1, Math.min(99, pct));
}

// Metric direction map — MUST be respected
var METRIC_DIRECTION = {
  xwOBA: true, xBA: true, xSLG: true,
  EV: true, HardHit: true, Barrel: true,
  K: false, Chase: false, Whiff: false
};

// Build full percentile object from model
function buildPercentiles(model) {
  var p = {};
  p.XWOBA = { label: 'xwOBA', pct: computePercentile(model.league.xwOBA, model.raw.expected.xwoba, true), raw: model.raw.expected.xwoba };
  p.XBA   = { label: 'xBA',   pct: computePercentile(model.league.xBA,   model.raw.expected.xba,   true), raw: model.raw.expected.xba };
  p.XSLG  = { label: 'xSLG',  pct: computePercentile(model.league.xSLG,  model.raw.expected.xslg,  true), raw: model.raw.expected.xslg };
  p.EV    = { label: 'Avg EV', pct: computePercentile(model.league.EV,   model.raw.savant.avg_hit_speed, true), raw: model.raw.savant.avg_hit_speed };
  p.HARDHIT = { label: 'HardHit%', pct: computePercentile(model.league.HardHit, model.raw.savant.hard_hit_percent, true), raw: model.raw.savant.hard_hit_percent };
  p.BARREL  = { label: 'Barrel%', pct: computePercentile(model.league.Barrel, model.raw.savant.barrel_batted_rate, true), raw: model.raw.savant.barrel_batted_rate };
  p.K       = { label: 'K%',    pct: computePercentile(model.league.xwOBA, model.derived.kRate, false), raw: model.derived.kRate };
  p.CHASE   = { label: 'Chase%', pct: computePercentile(model.league.Chase, model.raw.savant.oz_swing_percent, false), raw: model.raw.savant.oz_swing_percent };
  return p;
}

// Group percentiles for UI rendering
function buildGroups(p) {
  return [
    { title: 'EXPECTED BATTING', items: [p.XWOBA, p.XBA, p.XSLG] },
    { title: 'CONTACT QUALITY', items: [p.EV, p.HARDHIT, p.BARREL] },
    { title: 'PLATE DISCIPLINE', items: [p.K, p.CHASE] }
  ];
}
```

---

## PHASE 4 — SCOUTING GRADES ENGINE (20–80)

### What to do
Add the scouting grades engine. This maps statistical distributions to the professional 20–80 scouting scale. Tier C (stats-derived) is the fallback when no manual scouting report exists.

```javascript
function clamp(min, max, v) { return Math.max(min, Math.min(max, v)); }

function mean(arr) {
  var a = arr.filter(v => v != null && isFinite(v));
  if (!a.length) return null;
  return a.reduce((s, v) => s + v, 0) / a.length;
}

function stdev(arr) {
  var m = mean(arr); if (m == null) return null;
  var a = arr.filter(v => v != null && isFinite(v));
  if (a.length < 2) return null;
  return Math.sqrt(a.reduce((s, x) => s + Math.pow(x - m, 2), 0) / (a.length - 1));
}

function zScore(x, mu, sigma) {
  x = parseFloat(x); mu = parseFloat(mu); sigma = parseFloat(sigma);
  if (!isFinite(x) || !isFinite(mu) || !isFinite(sigma) || sigma === 0) return null;
  return (x - mu) / sigma;
}

function grade20_80_fromZ(z) {
  if (z == null || !isFinite(z)) return null;
  return clamp(20, 80, Math.round(50 + 10 * z));
}

function gradeLabel(g) {
  if (g == null) return '—';
  if (g >= 80) return 'Elite';
  if (g >= 70) return 'Plus';
  if (g >= 60) return 'Above Avg';
  if (g >= 55) return 'Solid Avg';
  if (g >= 50) return 'Average';
  if (g >= 45) return 'Below Avg';
  if (g >= 40) return 'Fringe';
  if (g >= 30) return 'Poor';
  return 'Deficient';
}

function gradeClass(g) {
  if (g == null) return '';
  if (g >= 70) return 'grade-elite';
  if (g >= 55) return 'grade-avg';
  return 'grade-poor';
}

// Tier C: Stats-derived proxy grades
function buildScoutingGradesFromModel(model) {
  var lg = model.league;
  function z(arr, val) { return zScore(val, mean(arr), stdev(arr)); }

  var z_xba  = z(lg.xBA,  model.raw.expected.xba);
  var z_kpct = model.derived.kRate != null ? -zScore(model.derived.kRate, mean(lg.xwOBA), stdev(lg.xwOBA)) : null; // inverted
  var z_ev   = z(lg.EV,   model.raw.savant.avg_hit_speed);
  var z_iso  = model.derived.iso != null ? zScore(model.derived.iso, 0.15, 0.05) : null;
  var z_xslg = z(lg.xSLG, model.raw.expected.xslg);
  var z_brl  = z(lg.Barrel, model.raw.savant.barrel_batted_rate);
  var z_spd  = model.raw.savant.sprint_speed != null ? zScore(model.raw.savant.sprint_speed, 27.0, 1.3) : null;

  function combo(weights) {
    var sum = 0, wt = 0;
    weights.forEach(([z, w]) => { if (z != null) { sum += z * w; wt += w; } });
    return wt > 0 ? sum / wt : null;
  }

  var z_hit  = combo([[z_xba, 0.70], [z_kpct, 0.30]]);
  var z_raw  = combo([[z_ev, 0.60], [z_iso, 0.40]]);
  var z_game = combo([[z_xslg, 0.50], [z_brl, 0.30]]);
  var z_fv   = combo([[z_hit, 0.35], [z_game, 0.30], [z_raw, 0.15], [z_spd, 0.10]]);

  return {
    HIT:  grade20_80_fromZ(z_hit),
    RAW:  grade20_80_fromZ(z_raw),
    GAME: grade20_80_fromZ(z_game),
    SPD:  grade20_80_fromZ(z_spd),
    FLD:  null,  // requires OAA — show — if unavailable
    ARM:  null,
    FV:   grade20_80_fromZ(z_fv),
    _src: 'stats-derived'
  };
}

// Wire grades into DOM
function setTool(idGrade, idLbl, g) {
  var el = document.getElementById(idGrade);
  var lb = document.getElementById(idLbl);
  if (el) { el.textContent = (g == null ? '—' : g); if (g != null) el.className = 'tool-grade ' + gradeClass(g); }
  if (lb) lb.textContent = (g == null ? '—' : gradeLabel(g));
}

function applyScoutingGrades(gr) {
  setTool('ppg-hit',  'ppg-hit-lbl',  gr.HIT);
  setTool('ppg-raw',  'ppg-raw-lbl',  gr.RAW);
  setTool('ppg-game', 'ppg-game-lbl', gr.GAME);
  setTool('ppg-spd',  'ppg-spd-lbl',  gr.SPD);
  setTool('ppg-fld',  'ppg-fld-lbl',  gr.FLD);
  setTool('ppg-arm',  'ppg-arm-lbl',  gr.ARM);
  setTool('ppg-fv',   'ppg-fv-lbl',   gr.FV);
  var note = document.getElementById('pp-scoutnote');
  if (note && gr._src === 'stats-derived') {
    note.textContent = 'Scout grades shown are stats-derived proxies (no manual report available).';
  }
}
```

---

## PHASE 5 — PLAYER VALUATION ENGINE

### What to do
Add the valuation engine. Uses WAR × $/WAR with a ±1 WAR range band.

```javascript
var DOLLARS_PER_WAR_M = 7.125;

function marketValueM(war) {
  war = parseFloat(war);
  if (!isFinite(war)) return null;
  return war * DOLLARS_PER_WAR_M;
}

function valueRangeM(war) {
  war = parseFloat(war);
  if (!isFinite(war)) return { low: null, base: null, high: null };
  return { low: marketValueM(war - 1), base: marketValueM(war), high: marketValueM(war + 1) };
}

function fmtM(x) {
  x = parseFloat(x);
  return isFinite(x) ? ('$' + x.toFixed(1) + 'M') : '—';
}

function applyValuationToProfile(warProj) {
  var rng = valueRangeM(warProj);
  var warEl = document.getElementById('pp-warproj');
  if (warEl) warEl.textContent = (warProj == null ? '—' : warProj);
  var dpw = document.getElementById('pp-dollarwar');
  if (dpw) dpw.textContent = '$' + DOLLARS_PER_WAR_M.toFixed(3) + 'M';
  var mv = document.getElementById('pp-mktval');
  if (mv) mv.textContent = fmtM(rng.base);
  var rg = document.getElementById('pp-mktrange');
  if (rg) rg.textContent = rng.low == null ? 'Range: —' : ('Range: ' + fmtM(rng.low) + ' – ' + fmtM(rng.high));
}
```

---

## PHASE 6 — UI RENDER ENGINE

### What to do
This is the rendering layer. Add the HTML template and CSS first, then the JS renderer functions.

### 6a. HTML template (inside `<body>`, before `</body>`)

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

### 6b. CSS (add to existing `<style>` block)

```css
.pct-row { display:grid; grid-template-columns:110px 1fr 60px; gap:10px; align-items:center; padding:6px 0; }
.pct-label { text-align:right; font-size:11px; letter-spacing:1px; color:var(--text-dim); }
.pct-track { position:relative; height:18px; background:rgba(255,255,255,.10); border-radius:10px; }
.pct-fill { height:100%; width:0%; border-radius:10px; transition:width .45s ease; }
.pct-bubble { position:absolute; top:50%; transform:translate(-50%,-50%); width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; font-family:'Barlow Condensed',sans-serif; color:#fff; transition:left .45s ease; }
.pct-raw { text-align:right; font-size:11px; color:var(--text-dim); }
.pct-section { margin-bottom:16px; }
.pct-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; }
.pct-header .title { font-family:'Bebas Neue',sans-serif; font-size:14px; letter-spacing:2px; color:var(--orange); }
.pct-header .scale { font-size:9px; color:var(--text-dim); letter-spacing:1px; }

/* Scouting grade colors */
.grade-elite { color:var(--red); }
.grade-avg   { color:var(--text-primary); }
.grade-poor  { color:var(--blue-bright); }
```

### 6c. JS renderers

```javascript
// Color engine — percentile → fill + bubble color
function pctColor(p) {
  if (p == null) return { fill:'rgba(255,255,255,.25)', bubble:'rgba(255,255,255,.20)' };
  if (p >= 80) return { fill:'#C0392B', bubble:'#C0392B' };
  if (p >= 60) return { fill:'#E8722A', bubble:'#E8722A' };
  if (p >= 40) return { fill:'#7F8C8D', bubble:'#7F8C8D' };
  if (p >= 20) return { fill:'#5AB4F5', bubble:'#5AB4F5' };
  return { fill:'#1A3A5C', bubble:'#1A3A5C' };
}

// Horizontal bar renderer
function renderPercentiles(targetEl, items) {
  if (!targetEl) return;
  targetEl.innerHTML = '';
  var tpl = document.getElementById('tpl-pct-row');
  items.forEach(function(it) {
    var node = tpl.content.cloneNode(true);
    var pct = parseInt(it.pct);
    var hasPct = isFinite(pct);
    var c = pctColor(hasPct ? pct : null);
    node.querySelector('.pct-label').textContent = it.label || '';
    var fill = node.querySelector('.pct-fill');
    fill.style.width = hasPct ? pct + '%' : '0%';
    fill.style.background = c.fill;
    var bubble = node.querySelector('.pct-bubble');
    bubble.textContent = hasPct ? pct : '—';
    bubble.style.left = hasPct ? pct + '%' : '2%';
    bubble.style.background = c.bubble;
    node.querySelector('.pct-raw').textContent = it.raw != null ? it.raw : '—';
    targetEl.appendChild(node);
  });
}

// Grouped renderer
function renderPercentilesGrouped(targetId, groups) {
  var host = document.getElementById(targetId);
  if (!host) return;
  host.innerHTML = '';
  groups.forEach(function(group) {
    var section = document.createElement('div');
    section.className = 'pct-section';
    var hdr = document.createElement('div');
    hdr.className = 'pct-header';
    hdr.innerHTML = '<div class="title">' + group.title + '</div><div class="scale">POOR ← AVG → GREAT</div>';
    section.appendChild(hdr);
    var inner = document.createElement('div');
    section.appendChild(inner);
    host.appendChild(section);
    renderPercentiles(inner, group.items);
  });
}

// Vertical bar renderer (sidebar density view)
function renderPercentilesVertical(targetId, items) {
  var host = document.getElementById(targetId);
  if (!host) return;
  host.innerHTML = '';
  items.forEach(function(it) {
    var pct = parseInt(it.pct);
    var c = pctColor(isFinite(pct) ? pct : null);
    var box = document.createElement('div');
    box.className = 'pct-v-box';
    box.innerHTML = '<div class="pct-v"><div class="pct-v-fill" style="height:' + (isFinite(pct) ? pct : 0) + '%;background:' + c.fill + '"></div></div>';
    host.appendChild(box);
  });
}

// Ring renderer (SVG circles)
function renderPercentilesRing(targetId, items) {
  var host = document.getElementById(targetId);
  if (!host) return;
  host.innerHTML = '';
  items.forEach(function(it) {
    var pct = parseInt(it.pct);
    var c = pctColor(isFinite(pct) ? pct : null);
    var r = 18, circumference = 2 * Math.PI * r;
    var offset = isFinite(pct) ? circumference * (1 - pct / 100) : circumference;
    var div = document.createElement('div');
    div.className = 'pct-ring';
    div.innerHTML = '<svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" stroke="rgba(255,255,255,.10)" stroke-width="6" fill="none"></circle><circle cx="22" cy="22" r="18" stroke="' + c.fill + '" stroke-width="6" fill="none" stroke-dasharray="' + circumference + '" stroke-dashoffset="' + offset + '" transform="rotate(-90 22 22)"></circle></svg><div class="ring-val">' + (isFinite(pct) ? pct : '—') + '</div>';
    host.appendChild(div);
  });
}
```

---

## PHASE 7 — ADVANCED SCOUTING PANELS

### What to do
Add these renderers for the right column "terminal panels."

```javascript
// Pitch Type Vulnerability Matrix
function renderVulnerability(targetId, data) {
  var host = document.getElementById(targetId);
  if (!host || !data) return;
  var pitches = ['FB','SL','CB','CH'];
  var html = '<table class="scout-table"><tr><th>Split</th>' + pitches.map(p => '<th>' + p + '</th>').join('') + '</tr>';
  ['vsLHP','vsRHP'].forEach(function(split) {
    html += '<tr><td>' + split + '</td>';
    pitches.forEach(function(p) {
      var val = (data[split] && data[split][p] != null) ? data[split][p] : null;
      var cls = val == null ? '' : (val > .500 ? 'bad' : 'good');
      html += '<td class="' + cls + '">' + (val != null ? val.toFixed(3) : '—') + '</td>';
    });
    html += '</tr>';
  });
  host.innerHTML = html + '</table>';
}

// Count Usage Matrix
function renderCountMatrix(targetId, matrix) {
  var host = document.getElementById(targetId);
  if (!host || !matrix) return;
  var pitches = ['FB','SL','CB','CH'];
  var counts = Object.keys(matrix);
  var html = '<table class="scout-table"><tr><th>Pitch</th>' + counts.map(c => '<th>' + c + '</th>').join('') + '</tr>';
  pitches.forEach(function(p) {
    html += '<tr><td>' + p + '</td>';
    counts.forEach(function(c) {
      var val = matrix[c][p] || 0;
      html += '<td class="' + (val > 35 ? 'high' : 'low') + '">' + val + '%</td>';
    });
    html += '</tr>';
  });
  host.innerHTML = html + '</table>';
}

// Zone Heat Map
function renderZoneHeatmap(targetId, grid) {
  var host = document.getElementById(targetId);
  if (!host || !grid) return;
  var html = '<div class="zone-grid">';
  grid.forEach(function(row) {
    row.forEach(function(val) {
      var color = val > .500 ? 'red' : val > .400 ? 'orange' : val > .300 ? 'gray' : 'blue';
      html += '<div class="zone ' + color + '">' + val.toFixed(3) + '</div>';
    });
  });
  host.innerHTML = html + '</div>';
}

// Arsenal Table
function renderArsenal(targetId, data) {
  var host = document.getElementById(targetId);
  if (!host || !data) return;
  var html = '<table class="scout-table"><tr><th>Pitch</th><th>Usage%</th><th>Velo</th><th>Spin</th><th>Whiff%</th></tr>';
  data.forEach(function(p) {
    html += '<tr><td>' + p.pitch + '</td><td>' + (p.usage ?? '—') + '%</td><td>' + (p.velo ?? '—') + '</td><td>' + (p.spin ?? '—') + '</td><td>' + (p.whiff ?? '—') + '%</td></tr>';
  });
  host.innerHTML = html + '</table>';
}
```

---

## PHASE 8 — CACHING LAYER

### What to do
Wrap all Savant/MLB fetches with this caching pattern. Add before any `fetch()` call in `loadPlayerProfile`.

```javascript
var _profileCache = {};

function cacheGet(key) {
  if (_profileCache[key]) return _profileCache[key];
  try { var s = sessionStorage.getItem(key); if (s) return JSON.parse(s); } catch(e) {}
  return null;
}

function cacheSet(key, data) {
  _profileCache[key] = data;
  try { sessionStorage.setItem(key, JSON.stringify(data)); } catch(e) {}
}
```

Usage pattern:
```javascript
var cacheKey = 'savant_' + playerId + '_' + SEASON;
var cached = cacheGet(cacheKey);
if (cached) { /* use cached */ } else { /* fetch, then cacheSet(cacheKey, data) */ }
```

---

## PHASE 9 — MASTER LOAD FUNCTION

### What to do
This is the wiring function that connects all phases together. Replace or update the existing `loadPlayerProfile` function with this pattern.

```javascript
async function loadPlayerProfile(playerId) {
  try {
    // 1. Check cache
    var cacheKey = 'profile_' + playerId + '_' + SEASON;
    var model = cacheGet(cacheKey);

    if (!model) {
      model = Object.assign({}, PlayerAnalyticsModel);

      // 2. Fetch data via proxy (NEVER direct API)
      var [mlbRes, lbRes, expRes] = await Promise.all([
        fetch('/api/mlb?path=people/' + playerId + '/stats?stats=season&season=' + SEASON),
        fetch('/api/savant?endpoint=statcast_leaderboard&season=' + SEASON),
        fetch('/api/savant?endpoint=expected_statistics&season=' + SEASON)
      ]);

      var mlbData = await mlbRes.json();
      var lbCSV   = await lbRes.text();
      var expCSV  = await expRes.text();

      // 3. Parse and assign raw data
      var lbRows  = parseCSV(lbCSV);
      var expRows = parseCSV(expCSV);
      var playerRow = lbRows.find(r => r.player_id == playerId) || {};
      var expRow    = expRows.find(r => r.player_id == playerId) || {};

      model.raw.savant   = playerRow;
      model.raw.expected = expRow;
      model.raw.mlb      = mlbData?.stats?.[0]?.splits?.[0]?.stat ?? {};

      // 4. Build league arrays from full datasets
      model.league.xwOBA  = lbRows.map(r => parseFloat(r.xwoba)).filter(isFinite);
      model.league.xBA    = expRows.map(r => parseFloat(r.xba)).filter(isFinite);
      model.league.xSLG   = expRows.map(r => parseFloat(r.xslg)).filter(isFinite);
      model.league.EV     = lbRows.map(r => parseFloat(r.avg_hit_speed)).filter(isFinite);
      model.league.HardHit = lbRows.map(r => parseFloat(r.hard_hit_percent)).filter(isFinite);
      model.league.Barrel = lbRows.map(r => parseFloat(r.barrel_batted_rate)).filter(isFinite);
      model.league.Chase  = lbRows.map(r => parseFloat(r.oz_swing_percent)).filter(isFinite);

      // 5. Compute derived stats
      var s = model.raw.mlb;
      model.derived.iso    = calcISO(parseFloat(s.avg), parseFloat(s.slg));
      model.derived.kRate  = calcKRate(s.strikeOuts, s.plateAppearances);
      model.derived.bbRate = calcBBRate(s.baseOnBalls, s.plateAppearances);
      model.derived.kbb    = calcKBB(model.derived.kRate, model.derived.bbRate);

      // 6. Compute percentiles and groups
      model.percentiles = buildPercentiles(model);
      model.grouped     = buildGroups(model.percentiles);

      cacheSet(cacheKey, model);
    }

    // 7. Render UI (surgical, modular)
    renderPercentilesGrouped('pp-bars', model.grouped);
    renderPercentilesVertical('pp-bars-vertical', model.grouped[0]?.items ?? []);
    renderPercentilesRing('pp-bars-circles', model.grouped[1]?.items ?? []);

    // 8. Scouting grades
    var grades = buildScoutingGradesFromModel(model);
    applyScoutingGrades(grades);

    // 9. Valuation
    applyValuationToProfile(model.derived.warProj);

  } catch(e) {
    console.error('[loadPlayerProfile]', e);
  }
}
```

---

## PHASE 10 — PERFORMANCE & ANIMATION

### What to do
Add these CSS rules to make bar fills animate smoothly on load. Add to the `<style>` block.

```css
/* Staggered bar reveal */
.pct-row:nth-child(1) .pct-fill  { transition-delay:.05s }
.pct-row:nth-child(2) .pct-fill  { transition-delay:.10s }
.pct-row:nth-child(3) .pct-fill  { transition-delay:.15s }
.pct-row:nth-child(4) .pct-fill  { transition-delay:.20s }
.pct-row:nth-child(5) .pct-fill  { transition-delay:.25s }
.pct-row:nth-child(6) .pct-fill  { transition-delay:.30s }

/* Panel fade-in */
@keyframes panelFadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
.pct-section { animation:panelFadeIn .35s ease both; }
.pct-section:nth-child(2) { animation-delay:.1s; }
.pct-section:nth-child(3) { animation-delay:.2s; }
```

### Performance rules (enforce these at all times)
- **Never** call `document.body.innerHTML = ...` or rebuild the entire page on data load.
- Use `DocumentFragment` for list renders when appending many nodes.
- Only re-render the changed panel section, not the full profile layout.
- All fetch calls must be wrapped in `try/catch` with graceful `—` fallback rendering.

---

## IMPLEMENTATION CHECKLIST

Use this to verify all phases are complete before considering the system production-ready.

- [ ] `PlayerAnalyticsModel` declared at top of script block
- [ ] All derived stat functions (`calcISO`, `calcBBRate`, etc.) added
- [ ] `computePercentile()` and `METRIC_DIRECTION` present and correct
- [ ] `buildPercentiles()` builds from live league arrays (not hardcoded values)
- [ ] `buildGroups()` returns structured grouped array
- [ ] Scouting grade engine (`grade20_80_fromZ`, `buildScoutingGradesFromModel`) implemented
- [ ] `applyScoutingGrades()` wires to correct DOM IDs
- [ ] Valuation engine (`applyValuationToProfile`) wired to DOM
- [ ] HTML `<template id="tpl-pct-row">` exists in body
- [ ] CSS for `.pct-row`, `.pct-fill`, `.pct-bubble`, `.pct-track` added
- [ ] `pctColor()` color engine present and using spec colors
- [ ] `renderPercentiles()`, `renderPercentilesGrouped()`, `renderPercentilesVertical()`, `renderPercentilesRing()` all present
- [ ] Advanced scouting renderers (`renderVulnerability`, `renderCountMatrix`, `renderZoneHeatmap`, `renderArsenal`) added
- [ ] Caching layer (`cacheGet`, `cacheSet`) implemented
- [ ] `loadPlayerProfile()` calls all fetch → model → compute → render steps in order
- [ ] All fetches go through `/api/mlb` or `/api/savant` — zero direct external API calls
- [ ] All missing data renders as `—` — zero fabricated values
- [ ] Stagger animation CSS added for bar fills
- [ ] No full-page rebuilds on data update

---

*This guide was generated from the Baseball Intelligence Terminal system preamble. All architecture decisions, data rules, and UI specifications are canonical and must be respected on every edit.*
