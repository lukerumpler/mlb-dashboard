# 📄 MLB BASEBALL INTELLIGENCE TERMINAL
## MASTER CANONICAL INSTRUCTION SYSTEM (AI-OPTIMIZED)

---

## 📑 TABLE OF CONTENTS
1. [PART 0 — SYSTEM IDENTITY & CORE RULES](#part-0--system-identity--core-rules)
2. [PART 1 — DATA ENGINE & ARCHITECTURE](#part-1--data-engine--architecture)
3. [PART 2 — CORE ANALYTICS ENGINE](#part-2--core-analytics-engine)
4. [PART 3 — KPI & DECISION ENGINE (JARVIS V2)](#part-3--kpi--decision-engine-jarvis-v2)
5. [PART 4 — BACKEND SYSTEMS (FASTAPI & NODE.JS)](#part-4--backend-systems-fastapi--node-js)
6. [PART 5 — DATABASE & REAL-TIME PIPELINE](#part-5--database--real-time-pipeline)
7. [PART 6 — FRONTEND & VISUAL INTELLIGENCE](#part-6--frontend--visual-intelligence)
8. [PART 7 — ADVANCED SCOUTING & PITCHING MODELS](#part-7--advanced-scouting--pitching-models)
9. [PART 8 — GM, TEAM & COMPARISON ENGINES](#part-8--gm-team--comparison-engines)
10. [PART 9 — INTELLIGENCE, PROJECTIONS & BETTING](#part-9--intelligence-projections--betting)
11. [PART 10 — STRATEGY, ML & SPECIALIZED SYSTEMS](#part-10--strategy-ml--specialized-systems)
12. [PART 11 — PERFORMANCE, DEPLOYMENT & PRODUCTIZATION](#part-11--performance-deployment--productization)

---

## 🔴 PART 0 — SYSTEM IDENTITY & CORE RULES

### SYSTEM DEFINITION
- **SYSTEM**: "BASEBALL INTELLIGENCE TERMINAL"
- **MODE**: "FRONT OFFICE / SCOUTING / ANALYTICS"
- **TYPE**: "DECISION ENGINE"
- **PRINCIPLE**: You are building a **Baseball Intelligence Operating System**, NOT a simple dashboard or stat viewer.

### ✅ PURPOSE
Transform raw baseball data into:
- Decision outputs
- Scouting intelligence
- Player valuations
- Strategy recommendations
- Comparative analysis

### ❌ NOT ALLOWED
- Raw stat dashboards
- Fan-style UI
- Decorative data
- Fabricated inputs/outputs

### 🚨 HARD RULES (ENFORCED SYSTEM-WIDE)
1. **NO FABRICATION**: `IF value == null: RETURN "—"`. Never estimate, interpolate, or simulate missing stats.
2. **PERCENTILES ARE PRIMARY**: All evaluation must be league-relative. `score = percentile(metric)`.
3. **CONTEXT REQUIRED**: Every metric must answer: "How good is this vs MLB?"
4. **AI LIMITATIONS**: AI can interpret, summarize, and recommend; it **CANNOT** generate data, fill missing values, or infer stats.
5. **PROXY ARCHITECTURE**: Never fetch directly from external sites in the client. Always use `/api/savant` or `/api/mlb`.

### 🎨 COLOR CANONICAL MEANING
| Percentile | Meaning | Color |
| :--- | :--- | :--- |
| 90–100 | Elite | Deep Red |
| 80–89 | Plus-Plus | Red |
| 70–79 | Plus | Orange-Red |
| 55–69 | Above Avg | Orange |
| 45–54 | Average | Yellow |
| 30–44 | Below Avg | Light Blue |
| <30 | Poor | Blue |

---

## 🟡 PART 1 — DATA ENGINE & ARCHITECTURE

### DATA FLOW (MANDATORY)
`CLIENT → /api/mlb OR /api/savant → Processing Layer → Analytics Engine → Decision Engine → UI`

### DATA SOURCES
- **MLB API**: Roster, stats, splits.
- **STATCAST (SAVANT)**: xwOBA, xSLG, EV, Barrel%, HardHit%, K%, BB%, Chase%, Whiff%, Sprint Speed.

### INTERNAL DATA MODEL
`RAW → DERIVED → LEAGUE → OUTPUT`

### REQUIRED DATA FUNCTIONS
```javascript
function fetchSavantCSV(endpoint, year)
function parseCSV(text)
function normalizeRow(row)
function buildLeagueArrays(rows)
function validate(val) { return val === null ? "—" : val }
```

---

## 🔵 PART 2 — CORE ANALYTICS ENGINE

### CORE MODEL
```json
PlayerAnalyticsModel = {
  "info": {},
  "raw": {},
  "derived": {},
  "league": {},
  "percentiles": {},
  "grouped": { "VALUE", "BATTING", "DISCIPLINE", "FIELDING", "RUNNING" }
}
```

### DERIVED METRICS
- **ISO**: `SLG - AVG`
- **OPS**: `OBP + SLG`
- **K%**: `K / PA`
- **BB%**: `BB / PA`
- **K-BB%**: `K% - BB%`

### PERCENTILE ENGINE (CANONICAL)
```javascript
function computePercentile(arr, val, higherBetter){
  if(val == null) return null;
  let clean = arr.filter(x=>x!=null).sort((a,b)=>a-b);
  let rank = clean.findIndex(v=>v>=val);
  let pct = Math.round((rank / clean.length)*100);
  if(!higherBetter) pct = 100 - pct;
  return Math.max(1, Math.min(99, pct));
}
```

### METRIC DIRECTION MAP
- **TRUE (Higher is Better)**: xwOBA, xSLG, HardHit, Barrel, BB, EV.
- **FALSE (Lower is Better)**: K, Chase, Whiff.

---

## 🟣 PART 3 — KPI & DECISION ENGINE (JARVIS V2)

### KPI DEFINITIONS (NORMALIZED)
- **CAS (Contact Ability)**: `0.5*xwOBA_pct + 0.3*HardHit_pct + 0.2*Barrel_pct`
- **DQS (Discipline Quality)**: `0.5*BB_pct + 0.3*(100-K_pct) + 0.2*(100-Chase_pct)`
- **DPI (Damage Production)**: `0.6*xSLG_pct + 0.25*Barrel_pct + 0.15*EV_pct`
- **TPVI (Total Player Value)**: `CAS + DQS + DPI + WAR_pct`

### JARVIS V2 DECISION CORE
- **DECISION SCORE**: `0.35 * TPVI + 0.25 * CAS + 0.2 * DPI + 0.2 * DQS`

### OUTPUT CONTRACT
```json
{
  "summary": "String",
  "archetype": "String",
  "strengths": [],
  "risks": [],
  "recommendation": "String",
  "confidence": "Number",
  "decision_score": "Number",
  "trade_grade": "A-F",
  "risk_level": "String"
}
```

### TRADE GRADING SCALE
- **A**: ≥ 90
- **B**: ≥ 80
- **C**: ≥ 70
- **D**: ≥ 60
- **F**: < 60

---

## ⚙️ PART 4 — BACKEND SYSTEMS (FASTAPI & NODE.JS)

### OPTION A: FASTAPI (CORE PYTHON ENGINE)
**Stack**: FastAPI, Postgres, Redis.

#### `api/index.py` (Implementation Details)
```python
from fastapi import FastAPI, HTTPException
import requests
import pandas as pd
from io import StringIO
import math

app = FastAPI()
CACHE = {}

def compute_percentile(arr, val, higher=True):
    arr = sorted([x for x in arr if x is not None])
    if len(arr) < 5 or val is None: return None
    idx = sum(x < val for x in arr)
    pct = int((idx / len(arr)) * 100)
    return max(1, min(99, pct if higher else 100 - pct))

def fetch_savant(year=2026):
    url = f"https://baseballsavant.mlb.com/leaderboard/expected_statistics?year={year}&csv=true"
    r = requests.get(url)
    return pd.read_csv(StringIO(r.text))

def build_league(df):
    return {k: df[v].dropna().tolist() for k, v in {
        "xwoba": "xwoba", "xslg": "xslg", "hardhit": "hard_hit_percent",
        "barrel": "brl_percent", "bb": "bb_percent", "k": "k_percent",
        "chase": "chase_percent", "ev": "avg_hit_speed"
    }.items()}

@app.get("/players/{name}")
def profile(name: str):
    df = fetch_savant()
    league = build_league(df)
    player_df = df[df["player_name"].str.contains(name, case=False)]
    if player_df.empty: raise HTTPException(404, "Player not found")
    row = player_df.iloc[0]
    # ... logic to build percentiles, kpis, jarvis ...
    return result
```

### OPTION B: NODE.JS (CUSTOM DATA PIPELINE)
**Stack**: Node.js (Express), PostgreSQL.

#### `server.js` (Pipeline Implementation)
```javascript
const express = require("express")
const axios = require("axios")
const { Pool } = require("pg")
const app = express()

const pool = new Pool({ /* DB Config */ })

async function fetchStatcast(playerId) {
    const res = await axios.get(`https://baseballsavant.mlb.com/statcast_search`, {
        params: { player_id: playerId }
    })
    return res.data
}

async function storePitches(rows) {
    for (const p of rows) {
        await pool.query(`INSERT INTO pitches (...) VALUES ($1...)`, [p.player_id, ...])
    }
}
```

---

## 🗄️ PART 5 — DATABASE & REAL-TIME PIPELINE

### DATABASE SCHEMA (POSTGRESQL)
- **Tables**: `players`, `player_stats`, `percentiles`, `pitch_events`, `prospects`, `fantasy_stats`.

#### `pitches` Table Definition
```sql
CREATE TABLE pitches (
  id SERIAL PRIMARY KEY,
  player_id INT,
  pitch_type TEXT,
  release_speed FLOAT,
  spin_rate FLOAT,
  plate_x FLOAT,
  plate_z FLOAT,
  pfx_x FLOAT,
  pfx_z FLOAT,
  description TEXT,
  game_date DATE
);
```

### REAL-TIME PIPELINE
`Statcast → Worker → Cache (Redis) → SSE → UI`

---

## 🖥️ PART 6 — FRONTEND & VISUAL INTELLIGENCE

### STACK & STRUCTURE
- **Framework**: Next.js
- **Styling**: Tailwind CSS + Glassmorphism
- **Structure**:
  - `app/player/[id]/page.tsx`
  - `components/KPIBar.tsx`, `PercentileBars.tsx`, `InsightBox.tsx`, `JarvisPanel.tsx`

### VISUAL INTELLIGENCE LOGIC
- **Principle**: Remove thinking from the user. Convert `xwoba: 91` → `xwOBA ████████████████░░ 91 (ELITE - RED)`.

#### Glassmorphism Styles
```css
.glass {
  background: rgba(10, 16, 40, 0.55);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
}
```

#### Color Engine (`lib/colors.ts`)
```typescript
export function getColor(p: number) {
  if (p >= 90) return "bg-red-700";
  if (p >= 80) return "bg-red-500";
  if (p >= 70) return "bg-orange-500";
  if (p >= 55) return "bg-orange-400";
  if (p >= 45) return "bg-yellow-400";
  if (p >= 30) return "bg-blue-400";
  return "bg-blue-700";
}
```

---

## 🟢 PART 7 — ADVANCED SCOUTING & PITCHING MODELS

### SCOUTING ENGINE
**Core Question**: "How do we attack this player?"
**Modules**:
1. **Vulnerability Matrix**: xSLG vs pitch type.
2. **Count Matrix**: Pitch usage by count.
3. **Zone Heatmap**: 3x3 grid of damage.
4. **Arsenal Table**: Velo, spin, whiff, usage.
5. **Pitch Locations**: Density + damage overlay.

### PITCHING MODEL (STUFF+)
```javascript
function calculateStuffPlus(pitch) {
  const veloScore = (pitch.velocity - 85) * 2.5
  const spinScore = (pitch.spin - 2000) / 45
  const whiffScore = pitch.whiff_rate * 120
  const usageScore = pitch.usage * 0.2
  return Math.round(100 + veloScore + spinScore + whiffScore + usageScore)
}
```

### HEATMAP & MATCHUP ENGINE
- **Logic**: Divide strike zone into bins. Overlay pitcher's location frequency with hitter's success rate.
- **Visuals**: Red (Hitter Crush), Blue (Pitcher Dominance), Yellow (Battle Zone).

---

## 🟡 PART 8 — GM, TEAM & COMPARISON ENGINES

### COMPARISON ENGINE
- **Method**: Compare Percentile Vectors, NOT raw stats.
- **Similarity**: `score = 100 - avg(abs(diff))`.
- **Vector**: `[xwOBA, xSLG, hardhit, barrel, bb, k, sprint]`.

### GM & TEAM ENGINE
- **Win Model**: `Wins = 81 + (offense_bonus) + (power_bonus) + (discipline_bonus)`.
- **Trade Simulation**: Replace worst player with incoming player and calculate `win_delta`.

### LINEUP OPTIMIZER
1. **Score Player**: Based on OPS, ISO, K%, and Matchup Heatmap.
2. **Assign Roles**:
   - 1: Leadoff (High OBP)
   - 2: Contact (Low K%)
   - 3: Best Overall
   - 4: Power (High ISO)
3. **Platoon Advantage**: Apply ± bonus based on L/R matchups.

---

## 🤖 PART 9 — INTELLIGENCE, PROJECTIONS & BETTING

### INSIGHT ENGINE (AUTO-GENERATED)
- **Strengths**: Triggered by percentiles ≥ 70 (e.g., "Elite power output").
- **Weaknesses**: Triggered by percentiles ≤ 40.
- **Risks**: Triggered by high K% or Chase%.

### AI PITCHER PROJECTION
```javascript
function projectPitcher(pitches) {
  return {
    "expectedERA": (5 - whiffRate * 5 + (avgVelo < 92 ? 1 : 0)).toFixed(2),
    "expectedKs": (whiffRate * 9 * 3).toFixed(1),
    "stuff": Math.round(100 + whiffRate * 100 + (avgVelo - 92) * 5)
  }
}
```

### BETTING EDGE MODEL
- **Edge Formula**: `(Team_OPS - Opp_OPS) * 8 + (Opp_ERA - Team_ERA) * 6 + (Team_K/9 - Opp_K/9) * 2`.
- **Signal**: `>10: STRONG BUY`, `>5: LEAN FAVOR`, `<-10: FADE`.

---

## ⚫ PART 10 — STRATEGY, ML & SPECIALIZED SYSTEMS

### STRATEGY ENGINE
- **Core**: `runValue = newRE - oldRE + runs`.
- **Use Cases**: Bunt decisions, swing decisions, substitution logic.

### ML SYSTEM
- **Models**: Regression, Classification, Embeddings, Clustering.

### FANTASY SYSTEM
- **Base Engine**: `points = H + HR*4 + RBI + BB + SB*2`.
- **Metrics**: `%RSOT`, `%START`, `+/- impact`.

### PROSPECT SYSTEM
- **Model**: 20–80 grading scale, MLB translation, projected KPIs.

---

## 🚀 PART 11 — PERFORMANCE, DEPLOYMENT & PRODUCTIZATION

### PERFORMANCE SYSTEM
- **Rule**: Precompute → Cache → Return.
- **3-Layer Cache**: Memory (Local), Session (Redis), CDN (Vercel).

### DEPLOYMENT STACK
- **Frontend**: Next.js → Vercel.
- **Backend**: FastAPI/Node → Railway.
- **Database**: PostgreSQL + Redis.

### PRODUCT TYPES
1. **Front Office Tool**: Team subscriptions.
2. **Fantasy Platform**: Premium insights.
3. **Betting Analytics**: Probability modeling.
4. **Prospect Tool**: Draft projections.

---

## 🏁 FINAL SYSTEM PRINCIPLE
**You are building a Baseball Intelligence Operating System.**
Every instruction, code block, and UI element must serve the goal of **accelerating decision intelligence** and **removing the human bottleneck** in data interpretation.

✅ **FULLY NORMALIZED | FULLY PRESERVED | AI-EXECUTABLE | MODULAR**
