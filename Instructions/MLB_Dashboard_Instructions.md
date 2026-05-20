# ⚾ MLB ANALYTICS DASHBOARD
## BASEBALL INTELLIGENCE TERMINAL — MASTER AI INSTRUCTIONS & PROJECT REFERENCE
### Owner: Luke Rumpler | 2026 Season | Arizona State University — Baseball Operations

**Live URL:** https://mlb-dashboard-smoky.vercel.app

---

## TABLE OF CONTENTS
1. File Access & Project Location
2. Project Identity & Design Philosophy
3. Technical Architecture & API Proxy
4. Tab Structure & Layout (V4 Target)
5. V4 Update Tasks — Complete Feature List
6. Dashboard Tab — Visual Specification
7. Leaders Table — Visual Specification
8. Win Projection Chart — Visual Specification
9. Player Profile Tab — Complete Specification
10. Pitcher Profile — Complete Specification
11. Personnel Tab — Complete Specification
12. Analysis Tab — Complete Specification
13. Visual Design References — All Images Described in Detail
14. MLB API Quick Reference
15. AI Agent Workflow & Critical Rules
16. Troubleshooting Guide
17. JARVIS Intelligence Engine — Full Architecture & Philosophy
18. JARVIS Implementation — Complete Technical Specification
19. JARVIS UX Rules, Scoring Engine & Backend Blueprint

---

## 1. FILE ACCESS & PROJECT LOCATION

The project moved from its original location. **Every AI agent MUST use the paths below.** Do not guess or use the old path.

### Hard Drive & Project Root

- **Hard Drive Name:** Luke's Hard Drive
- **Full Project Path:** `/Volumes/Luke's Hard Drive/Baseball/Baseball Dashboards/luke-mlb-dashboard`
- **Old (Wrong) Path:** `/Volumes/Luke's Hard Drive/luke-mlb-dashboard` ← **DO NOT USE**

### Step 1 — Navigate to Project

```bash
cd "/Volumes/Luke's Hard Drive/Baseball/Baseball Dashboards/luke-mlb-dashboard"
```

### Step 2 — Verify Correct Location

```bash
ls public/ api/
```

**Expected output:**
- `public/` → `backups/`, `index.html`
- `api/` → `mlb.js`, `savant.js`

### Step 3 — Backup Before EVERY Edit

```bash
cp public/index.html "public/backups/index_$(date +%s).backup"
```

### Step 4 — Deploy to Production

```bash
vercel --prod
```

**Live URL:** https://mlb-dashboard-smoky.vercel.app

### Key Files Reference

| FILE | PATH | PURPOSE |
|------|------|---------|
| index.html | public/index.html | Main app — all HTML, CSS, JavaScript. This is the only file you edit for UI changes. |
| mlb.js | api/mlb.js | Vercel serverless proxy — routes all MLB Stats API calls through the server to bypass CORS blocks. |
| savant.js | api/savant.js | Proxy for Baseball Savant data endpoints. |
| vercel.json | vercel.json | Vercel routing config — defines /api/mlb rewrite rule and cache headers. |
| backups/ | public/backups/ | All previous versions. NEVER edit these. Only read from them to restore. |
| validate_html_js.py | root | Python validation script — run to check for JS/HTML errors before deploying. |

### Production URLs

- **Live (Aliased):** https://mlb-dashboard-smoky.vercel.app
- **Vercel Project:** https://vercel.com/rumpler/mlb-dashboard

⚠️ **CRITICAL:** Always deploy from the project root, never from inside `public/` or `api/`. The `vercel --prod` command must run from `/Volumes/Luke's Hard Drive/Baseball/Baseball Dashboards/luke-mlb-dashboard`

---

## 2. PROJECT IDENTITY & DESIGN PHILOSOPHY

**This is not a stats website. It is a professional-grade baseball intelligence terminal.**

The design must feel like a **Bloomberg Terminal for baseball** — used by scouts, analysts, fantasy players, bettors, and player development staff. Not for casual browsing.

Every panel has a purpose. Nothing is decorative. Information is dense but controlled. Color means something. The page feels predictive, not descriptive.

### Core Identity Statement

> "An internal MLB baseball operations dashboard designed for scouts, analysts, and player development staff."

### Inspired By

- **MLB Savant** — percentile visualizations, Statcast data, color-coded intelligence
- **FanGraphs** — advanced metrics, WAR calculations, scouting grades
- **TJStuff+ / PitchingBot** — pitch modeling, movement profiles, arsenal grading
- **Internal MLB front-office dashboards** — operational density, tactical tables
- **Betting analytics terminals** — fast scanning, color-coded exploit/avoid systems
- **NPB scouting systems** — pitch-type split tables, zone heatmaps, bi-lingual intelligence

### Visual Identity

| ELEMENT | SPEC |
|---------|------|
| Theme Name | Fire & Ice |
| Background | #07102D (dark navy) — never change this base |
| Primary Accent | #E8722A (orange) — overridden dynamically per selected team |
| Secondary Accent | #5AB4F5 (steel blue) — overridden dynamically per selected team |
| Grid Overlay | Linear gradient at 2.5% opacity, 28px grid — gives terminal/monitor feel |
| Typography — Display | Bebas Neue (large numbers, panel titles, main headers) |
| Typography — Labels | Barlow Condensed (stat labels, tab names, table headers) |
| Typography — Body | Barlow (notes, paragraphs, descriptions) |
| Team Colors | Dynamic — CSS variables update when user selects a team |
| SF Giants Fix | MUST use primary #FD5A1E (orange) + secondary #27251F (black). This was a known bug. |
| Mobile | All layouts must be responsive. Use CSS grid with fallback to single column. |
| Font Sizes | Increase global sizes — current dashboard runs too small for quick scanning |

### Color-Coded Intelligence System

Colors carry meaning across every panel. Never use colors decoratively — they must always communicate data quality.

| COLOR | HEX | MEANING / USE |
|-------|-----|--------------|
| Red (Elite) | #C0392B / #E85A5A | Elite percentile ≥70 · Exploit zone · Danger · High priority · Target |
| Orange (Above Avg) | #E8722A | Primary accent · Above average 60-79th pct · Team color placeholder |
| Gold (Important) | #F5C842 | WAR value · Key callouts · Season highlights · All-Star markers |
| Green (Positive) | #4DCE8A | Strengths · Positive splits · Live badge · No IL entries |
| Gray (Neutral) | #A0B4CC | Average 40-69th pct · Body text · Neutral indicators · Dim labels |
| Blue (Poor) | #2471A3 / #5AB4F5 | Poor percentile ≤39 · Avoid zone · Below average · Weakness |
| Dark Blue (Very Poor) | #1A3A5C | 0-19th pct · Severe weakness · Deep avoid zone |
| White | #FFFFFF | Player names · Primary display values · Key numbers |

### Four Core Design Principles

#### 1. Modular Intelligence Panels
Every section is its own self-contained module. Examples: Pitch Profiler, Usage Matrix, Split Scouting Sheet, Pitch Outcomes, Video Breakdowns. Users can scan quickly, information is grouped logically, and the page feels expandable. Your current dashboard must move much more toward this.

#### 2. Dense but Controlled Information
The page contains enormous data density, but spacing, borders, alignment, typography, and color grouping prevent it from feeling chaotic. That balance is the hardest thing to achieve — and the most important.

#### 3. Color-Coded Intelligence (Not Just Decoration)
Red = danger/exploit. Blue = weak/avoid. Green = strengths. Gray = neutral. This gives interpretation, not just data. Your current site has data. The target design has interpretation. That is a massive difference.

#### 4. Front Office Style Tables
Tables feel tactical, operational, and internal — not public consumer stats. Especially: usage matrices, pitch-type outcomes, scouting sheets, matchup splits. These are what make the profile feel like a real front-office tool instead of a public baseball website.

---

## 3. TECHNICAL ARCHITECTURE & API PROXY

### Why the Proxy Exists

MLB's Stats API (statsapi.mlb.com) blocks all browser-originated fetch requests with a CORS error that silently kills every call. The fix: route all requests through a Vercel serverless function (api/mlb.js) that runs server-side, then forwards the response back to the browser with correct CORS headers.

### Request Flow

```
Browser → GET /api/mlb?path=/teams/109/stats&season=2026
        ↓
Vercel Edge Function (api/mlb.js)
        ↓
GET https://statsapi.mlb.com/api/v1/teams/109/stats?season=2026
        ↓
JSON returned to browser ✅ (with CORS + Cache headers added)
```

### Correct Way to Call the API in index.html

```javascript
// ❌ WRONG — CORS blocked, will silently fail:
fetch('https://statsapi.mlb.com/api/v1/teams/109/stats')

// ✅ CORRECT — routes through proxy:
fetchJSON('/api/mlb?path=/teams/109/stats&season=2026')
```

### Response Headers Added by Proxy

- `Access-Control-Allow-Origin: *`
- `Cache-Control: public, s-maxage=180, stale-while-revalidate=90`
- `X-Proxy-Source:` (full MLB URL — useful for debugging in DevTools Network tab)

### Cache TTLs (Tuned per Endpoint)

| ENDPOINT | BROWSER / EDGE CACHE | STALE-WHILE-REVALIDATE | NOTES |
|----------|----------------------|--------------------------|-------|
| /standings | 2 min | 1 min | Changes slowly — safe to cache |
| /schedule | 90 sec | 60 sec | Game results update frequently |
| /teams/… (stats, roster) | 5 min | 2 min | Roster moves happen daily |
| /stats/leaders | 5 min | 2 min | |
| /people/… | 10 min | 5 min | Player bio rarely changes mid-season |
| Everything else | 3 min | 90 sec | Default fallback |

### sessionStorage Caching (Performance Optimization)

In addition to Vercel edge caching, implement in-browser sessionStorage caching to prevent redundant calls within the same session.

- **Cache key pattern:** `mlb_cache_{teamId}_{endpoint}_{season}`
- **On tab click:** check sessionStorage first, only call API if cache is empty or stale
- **Invalidate cache:** when team or season changes
- **Data that never changes mid-session (standings, roster structure):** cache aggressively

### Troubleshooting the Proxy

- **All stats show — or Loading forever** → CORS block. Ensure all fetches go through `/api/mlb?path=` not `statsapi.mlb.com` directly
- **Yellow warning banner** → index.html opened directly in browser without proxy. Run `vercel dev` locally or deploy.
- **504 timeout** → MLB API slow. Proxy has 10-second timeout. Retry usually works. Add sessionStorage cache to reduce frequency.
- **404 for specific endpoint** → Check X-Proxy-Source header in browser DevTools Network tab to see exact URL being requested.
- **vercel --prod not found** → `npm install -g vercel`
- **Port already in use** → `vercel dev --listen 3001`

---

## 4. TAB STRUCTURE & LAYOUT — V4 TARGET

V4 consolidates 13+ tabs into 7 clean, comprehensive tabs. Each tab ID maps to a `<div class='pg' id='pg-[name]'>` in index.html. The tab bar uses class `'tabs'` with individual `'tab'` elements, each with `data-tab` attribute.

| TAB NAME | TAB ID | COMBINED FROM (V3 TABS) | LAYOUT DESCRIPTION |
|----------|--------|------------------------|-------------------|
| Dashboard | pg-dash | Team Stats + Headlines | Top: Division Standings + Win Projection Chart. Bottom: Offense stats + Pitching stats panels |
| Personnel | pg-personnel | Lineups + Roster/IL + Hot/Cold + Pitching (SP) | Top: Projected Lineup + Pitching Staff. Middle: Active Roster + Injured List. Bottom: Hot/Cold Hitters & Pitchers + Starting Pitching stats |
| Analysis | pg-analysis | League Leaders + Metric Leaders + Fantasy + Savant | Three-box layout: Left=Hitting Leaders, Center=WAR/Fantasy Shared Stats, Right=Pitching Leaders |
| Player Profile | pg-profile | Player Profile | Full Savant-style intelligence card — hero banner, percentile bars, splits, career stats, video links, advance scouting |
| Top Prospects | pg-prospects | Top Prospects | Baseball America-style prospect cards per selected team with FV grades and scouting summaries |
| Scout Notes | pg-notes | Scout Notes | Add/edit/delete personal scouting notes with priority tags (Watch, Target, Buy, Sell, Hold) |
| About Me | pg-about | About Me | Bio card for Luke Rumpler + Sayings & Quotes panel (password-protected developer edit mode) |

**⚠️ NOTE:** Tab `data-tab` values must exactly match the `pg-` IDs without the `'pg-'` prefix. Example: `data-tab='dash'` maps to `id='pg-dash'`.

---

## 5. V4 UPDATE TASKS — COMPLETE FEATURE LIST

### 5.1 Tab Consolidation & Layout Restructuring

- **Merge Team Stats + Headlines into Dashboard tab**
  - Dashboard top section: Division Standings panel (left) + Win Projection Chart panel (right)
  - Dashboard middle: compact win projection bar replaced by full chart (see Section 8)
  - Dashboard bottom: Offense stats panel (left) + Pitching stats panel (right)

- **Merge Lineups + Roster/IL + Hot/Cold + Starting Pitching into Personnel tab**
  - Personnel top: Projected Lineup (left) + Pitching Staff (right)
  - Personnel middle: Active Roster (left) + Injured List (right)
  - Personnel bottom: Hot/Cold Hitters & Pitchers table + Starting Pitching stats table

- **Merge League Leaders + Metric Leaders + Fantasy + Savant into Analysis tab**
  - Three-box layout: Left box = Hitting Leaders, Center box = Shared Stats (WAR, Fantasy Pts), Right box = Pitching Leaders
  - Each leaders box: switchable stat buttons at bottom (like current Leaders panel in screenshot)

### 5.2 Dynamic Team Color Coding

- **Define TEAM_COLORS object** in JavaScript with primary and secondary hex codes for all 30 MLB teams
- **Create function updateThemeColors(teamId)** that modifies CSS variables: `--orange`, `--orange-dim`, `--blue-bright`, `--navy`
- **Call updateThemeColors(teamId)** at the very top of `loadTeam(teamId)` function
- **ALL 30 teams** must be included — current TEAMS array already has IDs, just needs colors confirmed
- **SF Giants:** primary = #FD5A1E, secondary = #27251F — this was a known bug, must be fixed

🚨 **CRITICAL:** The current site already has `updateThemeColors()` partially implemented. Do not rewrite it — just verify it's being called correctly in `loadTeam()` and that all 30 team color pairs are accurate.

### 5.3 Metric Leaders Bug Fix

- **Current bug:** pitchers appear in Batting Average leaderboard, hitters appear in Strikeouts leaderboard
- **Root cause:** `loadMetricLeaders()` renders all players without filtering by position
- **Fix:** before rendering, split roster into `pitcherIds` (position.code === '1') and `hitterIds` (position.code !== '1')
- **Apply hitterIds filter to:** AVG, OBP, SLG, OPS, HR, RBI, Runs, SB, BB, ISO, BABIP
- **Apply pitcherIds filter to:** ERA, WHIP, Strikeouts, Wins, Saves, FIP, K/9, BB/9

### 5.4 Savant Percentile Styling — Player Profile

- **Match Baseball Savant color scale exactly** (see Hitter_Profile_Dash_DBDE.jpg reference)
  - Red #C0392B = elite, ≥70th percentile
  - Semi-red rgba(192,57,43,0.5) = above average, 45-69th percentile
  - Blue #2471A3 = poor, ≤39th percentile
  - Gray #7F8C8D = average, 40-44th percentile

- **Bar structure:** full-width horizontal track, colored fill, percentile bubble sits ON the fill at the endpoint, raw stat value to the far right

- **Scale header at top of bar section:** 'Poor ▲' in blue on left, 'Average ▲' in gray center, 'Great ▲' in red on right

- **Hitter sections:** VALUE (wRC+, WAR, OPS+, Batting Run Value, Baserunning Run Value, Fielding Run Value), BATTING (xwOBA, xBA, xSLG, Avg EV, 90th% EV, Max EV, Barrel%, Hard-Hit%, LA Sweet-Spot%, Bat Speed, Squared-Up%), PLATE DISCIPLINE (Z-Swing%, O-Swing%, Whiff%, Z-Contact%, K%, BB%, Chase%)

- **Pitcher sections:** STUFF (Stuff+, FB Velo, Spin Rate, VAA), COMMAND (Command+, BB/9, Zone%, Chase%), RESULTS (ERA, FIP, WHIP, K/9, K-BB%, xERA)

### 5.5 Developer Mode — Sayings & Quotes

- **Add a subtle 'DEV LOGIN' button** in the About Me tab — small, low-contrast, bottom corner
- **On click:** prompt for password. Password is: `scout`
- **On correct password:** show form with Add Quote, Edit Quote, Delete Quote controls
- **Quote object structure:** `{ id, text, author, color }`
- **Store quotes in localStorage** key `'mlb_saved_quotes'` so they persist across browser sessions
- **On page load:** read from localStorage and populate `savedQuotes` array
- **Incorrect password:** show error message, do not reveal any form elements

### 5.6 New Advanced Metrics

- **Offensive leaderboard:** add OPS+ as switchable stat category
- **Pitching leaderboard:** add FIP as switchable stat category
- **Pitching leaderboard:** add STUFF+ as switchable stat category
- **Pitching leaderboard:** add COMMAND+ as switchable stat category

⚠️ **NOTE:** STUFF+ and COMMAND+ require TJStuff+ API (tjstats.com) or manual calculation. If endpoint unavailable, show 'N/A' with a tooltip explaining the data source. Do not fabricate values.

### 5.7 Performance Optimization

- **Implement sessionStorage caching** for all API calls that don't change frequently within a session
- **Lazy-load tab data** — only fetch when tab is clicked, not upfront in `loadTeam()`
  - Exception: Dashboard tab data loads immediately on team select since it's always visible
- **Cache key pattern:** `mlb_cache_{teamId}_{endpoint}_{season}`
- **Review and optimize:** `loadTeamStats()`, `loadLeaders()`, `loadSavant()`
- **Consider Promise.all() batching** for calls that can run in parallel

### 5.8 Historical Season Selector

- **Add 'Season' dropdown** in the header, next to the team selector
- **Supported seasons:** 2021, 2022, 2023, 2024, 2025, 2026 (default: 2026)
- **On change:** update SEASON variable, invalidate all sessionStorage caches, reload current tab
- **All API calls must append** `&season=${SEASON}` — audit every `fetchJSON` call to confirm
- **Season label in header** (currently showing '2026 SEASON') must update dynamically

### 5.9 Enhanced Headlines & News Feed

- **Replace static news placeholder** in Dashboard with a curated X (Twitter) account link grid

**Accounts to feature (organized by category):**
- MLB Official: @MLB
- Beat Reporters & Insiders: @Feinsand, @mlbtraderumors, @Buster_ESPN, @Ken_Rosenthal, @JeffPassan
- Analytics & Stats: @fangraphs, @StatsAsu
- SF Giants: @SFGiants, @SFGiantsFans, @NorthBayNews
- ASU Baseball: @ASU_Baseball, @baseballhall, @mbaribaultmedia
- Personal/Community: @kwokfanclub, @HeyGKwok, @PrunePackers, @Cut

- **Implementation:** render as clickable cards that open Twitter/X profile in new tab
- **If direct Twitter API unavailable** (requires auth): use embedded tweet widgets or RSS via nitter proxy

⚠️ **NOTE:** Direct Twitter API v2 requires Developer account and Bearer token. Simpler approach: render link cards with account name, bio text, and clickable link. No API needed.

---

## 6. DASHBOARD TAB — VISUAL SPECIFICATION

The Dashboard tab is the first thing seen on load. It combines Team Stats and Headlines. Reference image: **Website_Dashboard_Example.jpg** (current state) and **Win_Proj_Graph_DBDE.png**.

### Layout — Top Row (Two Panels Side by Side)

- **LEFT panel: Division Standings table** — 5 rows, columns: Rank #, Team Name, W-L record, Win PCT. Selected team row highlighted with orange background tint.
- **RIGHT panel: Win Projection Chart** — full chart as described in Section 8

### Layout — Bottom Row (Two Panels Side by Side)

- **LEFT panel: OFFENSE** — large display numbers with MLB rank below each
  - Stats: AVG, OPS, HR, RBI, OBP, Runs — 2x3 grid layout
  - Rank display: '4th in NL' style, colored orange
  - Panel title: 'OFFENSE' with 'LIVE' badge in orange

- **RIGHT panel: PITCHING** — same large display number format
  - Stats: ERA, WHIP, K's, Opp AVG, Wins, Saves — 2x3 grid layout
  - Rank display: '2nd in NL' style, colored blue
  - Panel title: 'PITCHING' with 'LIVE' badge in blue

### Reference Image: Website_Dashboard_Example.jpg

This image shows the Baltimore Orioles on the current V3 dashboard. The three-panel layout (Offense, Pitching, Leaders) is the correct structure for the bottom section of the Dashboard tab. The current site uses 2x3 stat grids with large Bebas Neue numbers and rank labels below each stat. This is correct — keep this exact display style but upgrade the surrounding layout.

**Example stats from image:**
- Offense panel shows: AVG .232 (25th in MLB), OPS .705 (17th in MLB), HOME RUNS 39 (11th in MLB), RBI 151 (13th in MLB), OBP .317 (21st in MLB), RUNS 154 (13th in MLB)
- Pitching panel shows: ERA 4.76 (27th in MLB), WHIP 1.48 (28th in MLB), STRIKEOUTS 285 (18th in MLB), OPP AVG .273 (29th in MLB), WINS 15 (23rd in MLB), SAVES 10 (13th in MLB)
- Leaders sidebar (right) shows player headshots with rank number, first name small above last name large, stat value in green on right — see Section 7 for full Leaders spec

---

## 7. LEADERS TABLE — VISUAL SPECIFICATION

Reference image: **Leaders_Table_DBDE.png**. This is the Leaders panel that appears on the Dashboard tab (right side or as part of the Analysis tab). This is one of the most polished panels in the existing design.

### Layout & Design

- **Panel title:** 'LEADERS' in large white Bebas Neue, top left
- **Current stat category shown:** top right (e.g. 'FANTASY PTS' in orange/gold bold)
- **Each row shows:** rank number (1-10), player headshot circle (small, ~32px), first name in small gray text above, LAST NAME in white bold larger text, stat value in green bold on far right
- **Rows are separated by:** a very subtle divider line
- **No background alternating rows** — clean dark navy throughout
- **Stat value uses:** large green bold Bebas Neue font — e.g. '146', '130', '111'

### Example Data (Arizona Diamondbacks — Fantasy Points)

| RANK | PLAYER | VALUE |
|------|--------|-------|
| 1 | Corbin Carroll | 146 |
| 2 | Ildemaro Vargas | 130 |
| 3 | Geraldo Perdomo | 111 |
| 4 | Nolan Arenado | 111 |
| 5 | Ketel Marte | 106 |
| 6 | Jose Fernandez | 85 |
| 7 | Adrian Del Castillo | 61 |
| 8 | Jorge Barrosa | 55 |
| 9 | Gabriel Moreno | 46 |
| 10 | Lourdes Gurriel Jr. | 28 |

### Switchable Stat Categories (Button Row at Bottom)

At the bottom of the Leaders panel, a row of pill buttons allows switching the displayed stat. Currently active button has filled orange background. Inactive buttons have dark border only.

- **Button row (from image):** FPTS, AVG, HR, RBI, HITS, SB, BB, OPS, OBP, ERA, SO, WAR
- **Active button style:** background orange (#E8722A), white text, rounded pill
- **Inactive button style:** dark navy background, gray border, gray text
- **On click:** reload leaders data for that stat category, update the category label top-right

⚠️ **NOTE:** The headshot images use: `https://img.mlbstatic.com/mlb-photos/image/upload/w_60,q_auto:best/v1/people/{playerId}/headshot/67/current` — always include onerror handler to hide broken images gracefully.

---

## 8. WIN PROJECTION CHART — VISUAL SPECIFICATION

Reference image: **Win_Proj_Graph_DBDE.png**. This chart appears in the Dashboard tab and is one of the most distinctive features of the terminal. It must be rebuilt from the simple progress bar into a full interactive chart.

### Chart Layout

- **Header row:** 'SEASON PACE' label small top-left, 'WIN PROJECTION' large white Bebas Neue below it
- **Top-right corner:** three colored target boxes
  - DIVISION (red/orange background, number in white)
  - WILD CARD (blue background, number in white)
  - PROJECTED (gold background, number in white)
  - Example values: DIVISION 100, WILD CARD 90, PROJECTED 81

- **Chart area:** dark navy background, subtle grid lines at 32, 65, 97, 130, 162 wins on Y axis
- **X axis:** GAMES — labeled at 0, 40, 81, 120, 162
- **Y axis:** WINS — labeled at 0, 32, 65, 97, 130, 162

### Chart Lines & Visual Elements

- **ACTUAL WINS line:** solid green line from game 0 to current game number — filled with dark green area below it (like an area chart)
  - Current position dot: larger green circle at the endpoint of the actual line
  - Label at current dot: e.g. '20-20' showing W-L record

- **PROJECTED line:** dashed orange line extending from current game to game 162
  - Line style: dashed, orange color (#E8722A or team primary color)
  - Label at end: e.g. '81 W proj' and '88W' on the right edge
  - Also shows '.500' pace reference label

- **Horizontal reference lines:** dashed gray lines at Division target (100W) and Wild Card target (90W)

### Footer Stats Bar (Below Chart)

Four stat blocks in a row at the bottom of the chart panel:
- WIN %: value in gold/yellow (e.g. '50.0%')
- RECORD: value in white (e.g. '20-20')
- GAME: current game number in green (e.g. '40')
- REMAINING: games left in white (e.g. '122')

### Implementation

- **Use a canvas element or SVG** — do not use a CSS progress bar for this
- **Preferred:** implement with a lightweight charting library (Chart.js or D3) or pure SVG
- **Data inputs:** current W-L record from standings API, game number calculated from W+L, projected wins = (currentWinPct * 162) rounded
- **Division target** = 100 wins (hardcoded default, can be overridden)
- **Wild Card target** = 90 wins (hardcoded default, can be overridden)
- **Chart must update automatically** when a new team is selected

---

## 9. PLAYER PROFILE TAB — COMPLETE SPECIFICATION

Reference image: **PlayerProfileMockups.png**. This is the most important and complex tab. It must feel like a real front-office scouting tool. The current implementation is a basic two-column card — it needs to become a full intelligence dashboard.

### Overall Layout — Multi-Column Intelligence Dashboard

The page is a dense multi-column layout, NOT a simple card:
- **LEFT COLUMN:** Player Identity + Core Evaluation (executive summary + scouting report)
- **CENTER COLUMN:** Core Analytics Engine (percentile bars, splits, advanced metrics)
- **RIGHT COLUMN:** Advanced Modeling / Scouting Layer (pitch data, movement, advance scouting)

### LEFT COLUMN — Identity & Evaluation

#### Hero Section
- Player headshot (large, ~80x80px, rounded corners, team color border)
- Full name in Bebas Neue large white
- Position · Team name
- Bio line: B/T handedness · Height · Weight · Age · Birthdate
- Draft info: Year, Round, Pick number, High school or college name

#### Awards & Accolades
- Colored pill badges for each award: e.g. '2023 NL ROY' (gold), '2025 All-Star' (blue), '2025 Silver Slugger' (orange), '2025 All-MLB Second Team' (green)

#### Contract & Value Box
- Grid: Status, 2026 Salary, Service Time, ARB Eligible year, Free Agent year
- Second row: Surplus Value, FV Grade (large), WAR 2026 projected, $/WAR

#### Scouting Grades (20-80 Scale)
- Table showing current/projected grade for each tool: Hit, Raw Power, Game Power, Speed, Field, Arm, Overall FV
- Each cell shows two numbers: current (normal) / projected (bold, slightly larger)
- Grade color: 80-70 = red (elite), 60-55 = blue (above avg), 50 = gray (average), 45-40 = dim (below avg), 30-20 = red dim (poor)
- Text label below grade: 'Solid Avg', 'Average', 'Fringe', 'Plus', 'Pro', etc.

#### Scout Note
- One paragraph narrative: e.g. "Elite athlete with above-average contact and plus speed/defense. Power ceiling limited by frame projects 18-22 HR/162 at peak. Elite BB% signals advanced approach. 2025 breakout (.884 OPS, 31 HR) showed expanded power profile. Grades reflect true talent."
- Font: Barlow regular, small, text-dim color, light gray

#### WAR Value Card
- Estimated market value in dollars: e.g. '$85M+'
- WAR 2026 projected: e.g. '-2.1'
- $/WAR rate: '$7.125M/WAR' (standard market rate)
- Value range: ±1σ shown as '$low – $high'

### CENTER COLUMN — Core Analytics Engine

#### Multi-Year Percentile Rankings Table (Top of Center)
- Years: 2022, 2023, 2024, 2025, 2026 — one row per season
- Column groups: RUN VALUE (Batting, Base Run, Fielding), BATTING (xwOBA, xBA, xSLG, EV, Barrel%, HardHit%, LA Sweet%, Bat Spd, SquaredUp%, Chase%, Whiff%, K%, BB%), FIELDING (Range OAA, Arm Val, Arm Spd), RUNNING (Sprint Speed)
- Each cell: colored number. Red = 80-100 elite, Orange = 60-79 above avg, Gray = 40-59 avg, Blue = 20-39 below avg, Dark blue = 0-19 poor
- Color key below table: printed legend explaining the scale

#### 2026 Season Percentile Rankings — Savant Bars
- Scale header: 'Poor ▲' blue left, 'Average ▲' gray center, 'Great ▲' red right
- Sections: VALUE, BATTING, PLATE DISCIPLINE (for hitters) | STUFF, COMMAND, RESULTS (for pitchers)
- Each bar row: Label (right-aligned, 100px wide) | Track (flex:1, colored fill, bubble at endpoint) | Raw stat value (right, 52px)
- Bubble: circular, 21px, sits ON the fill bar at its right edge, contains percentile number
- Bar height: 18px
- Bar track background: rgba(255,255,255,0.08)

#### 2026 Splits Table
- Rows: vs LHP, vs RHP, Home, Away, Day, Night, RISP, Bases Empty
- Columns: PA, AVG, OBP, SLG, OPS, wRC+, ISO, BABIP, K%, BB%, HR
- wRC+ column: green = above 110, gold = 90-110, red = below 90
- Data source: MLB API /people/{pid}/stats?stats=vsLeft,vsRight and schedule splits

#### Career MLB Batting Stats
- Year-by-year table from MLB API yearByYear hydration
- Columns: YEAR, G, PA, AB, R, H, 2B, 3B, HR, RBI, BB, SO, SB, AVG, OBP, SLG, OPS, ISO, BABIP, wRC+
- Current season row: orange background highlight
- All-Star seasons: asterisk * next to year
- Totals row at bottom in blue

### RIGHT COLUMN — Advanced Modeling & Scouting

#### Advance Scouting Panel (TRUMEDIA Style)
- Title: ADVANCE SCOUTING — PITCH TYPE VULNERABILITY
- Split rows: vs LHP and vs RHP
- Columns: xSLG vs FB, xSLG vs HS (SL/CS), xSLG vs BB (CB), xSLG vs CH/SP, BB IZWhiff%, 2K IZWhiff%, 0-0 Swing%, Chase%
- Color coding: red cells = exploit (high xSLG / poor discipline), blue = avoid

#### Pitcher Count Usage Matrix
- Rows: pitch types (4-Seam, Slider, Curveball, Changeup, Sinker)
- Columns: count situations (0-0, 0-1, 1-0, 1-1, 2-0, 2-1, 3-1, 2-2, FULL)
- Each cell: usage percentage. Red = high usage. Blue = low/avoid.

#### Zone Heat Map
- xSLG Allowed vs RHB — 3x3 grid of the strike zone
- Values in each zone cell (.412, .650, .671, etc.)
- Color gradient: red = high xSLG (exploit), blue = low xSLG (avoid)
- Label: 'Red = Exploit Blue = Avoid'

#### Video Highlights Grid
- 4 cards in a 2x2 or 4-across grid
- Each card: YouTube thumbnail image, title label, 'Watch on YouTube' link
- Suggested videos: 2026 Season Highlights, Swing Mechanics Breakdown, Rookie Year Recap, All-Star Game Highlights
- Links: search YouTube for player name + label, open in new tab

#### External Links
- Card grid: Baseball Savant, FanGraphs, MLB.com Player Page, NPB (if applicable), Baseball Reference
- Each card: site logo/icon + site name + opens in new tab

### Footer (Bottom of Profile)
- **Data Sources:** MLB Savant, TJStats, Pitch Profiler, MLB Statcast, Baseball Reference, NPB Stats
- **Key:** Red = Exploit | Blue = Avoid | Gray = Neutral
- **Notes:** All stats are 2026 season to date unless noted. Percentiles vs qualified players at position. Projections are Steamer/ZS blend. Report for internal analytical use.
- **Last Updated:** auto-generated timestamp

---

## 10. PITCHER PROFILE — COMPLETE SPECIFICATION

References: **Pitcher_Profile_Dash_DBDE.jpg** (Pitch Profiler — Camilo Doval) and **Pitcher_Profile_NPB_Dash2_DBDE.jpg** (NPB pitcher). When a pitcher is selected in the Player Profile tab, the center and right columns transform to show pitcher-specific data.

### 10.1 Pitch Profiler Card (Pitcher_Profile_Dash_DBDE.jpg — Camilo Doval)

#### Header
- Headshot, name, team, date range (e.g. 3/30-7/30), season, throws handedness
- Summary stat bar: IP, PA, ERA, FIP, WHIP, K%, BB%, K-BB%, Whiff%, Barrel%, proStuff+
- Stat cells: ERA and WHIP colored by value (red=bad, blue=good for ERA; reverse for K%)

#### Three Visualizations (Side by Side)

**LEFT — Release Point:**
- Silhouette of pitcher figure, orange dot showing release point location relative to body
- Axes: vertical (height) and horizontal (side angle)

**CENTER — Movement Profile Scatter Plot:**
- IVB (inches) vs HB (inches)
- Each pitch type a different color dot cluster
- Arm Angle line drawn through scatter
- Label: 'Average Arm Angle: 16°' for example
- Axes labeled IVB and HB

**RIGHT — Pitch Frequency Bar Chart:**
- Horizontal bars split LHH (left) and RHH (right)
- Each pitch type a separate bar row
- Shows: Freq % and proStuff+ for each side

#### Arsenal Table (Bottom)

| COLUMN | DESCRIPTION |
|--------|-------------|
| Pitch | Pitch type name, colored dot matching scatter plot |
| % Thrown | Usage percentage |
| Velocity | Average MPH |
| Spin Rate | RPM |
| IVB | Induced Vertical Break (inches) |
| HB | Horizontal Break (inches) |
| VAA | Vertical Approach Angle (degrees) |
| HAA | Horizontal Approach Angle |
| vRel | Vertical Release Point |
| hRel | Horizontal Release Point |
| Ext | Extension (feet) |
| Arm° | Arm Angle (degrees) |
| proStuff+ | Proprietary Stuff+ score (100 = avg, colored by value) |
| Whiff% | Whiff rate — blue if high (good), red if low (bad) |
| Barrel% | Barrel rate — red if high (bad), blue if low (good) |

### 10.2 NPB Pitcher Dashboard (Pitcher_Profile_NPB_Dash2_DBDE.jpg — Griffin)

This is the gold standard for pitch-type depth. Three sections — Overall, vs Right, vs Left — each with a complete independent table and heatmap row.

#### Section Structure (Repeat for Overall, vs Right, vs Left)

- **Section header:** '# Overall' / '# Right' / '# Left' in bold
- **Table columns:** Pitch Type, Pitches, Usage%, Velocity, xPV, xPV/100, CSW%, SwStr%, Whiff%, GB%, IFFB%, xwOBAcon, Putaway%, Stuff+, Location+
- **Row per pitch type:** 4-Seam Fastball, Slider, Cutter, Changeup, Knuckle Curve, Split Finger, Sinker
- **Color coding:** red cells = high/elite (high Whiff%, high Stuff+, high CSW%), blue cells = low/poor (low GB%, poor Putaway%)
- **Threshold for red:** generally >30% for rate stats, >100 for plus stats

#### Heatmap Row (Below Each Table Section)
- One small heatmap per pitch type, displayed in a horizontal row
- Heatmap shows pitch location density — pitcher's view perspective
- Red clusters = frequent location, blue = sparse/rare
- Labeled with pitch type name below each map
- Asterisk note: '* Pitcher's View'

#### Footer
- Data date: e.g. 'Data as of 2025/10/05'
- Exclusions note: 'Pitchers' At-Bats and Sacrifice Bunt are excluded. Data obtained individually.'
- Creator credit and version number

---

## 11. PERSONNEL TAB — COMPLETE SPECIFICATION

### Top Row — Lineup & Pitching Staff

- **LEFT panel: PROJECTED LINEUP** — numbered 1-9, each row shows batting order position (orange), player name (Barlow Condensed, large), position abbreviation (right, text-dim)
- **RIGHT panel: PITCHING STAFF** — list of active pitchers, name left, position abbreviation right (SP / RP / CL)

### Middle Row — Roster & IL

- **LEFT panel: ACTIVE ROSTER** — all 26 active players, name + position + jersey number
- **RIGHT panel: INJURED LIST** — each IL entry shows player name + IL badge (10-Day IL / 15-Day IL / 60-Day IL) in orange badge
- **If no IL entries:** show green '✅ No IL entries' message
- **IL badge colors:** 60-Day IL = red, 15-Day IL = orange, 10-Day IL = yellow

### Bottom Row — Hot/Cold & Starting Pitching

- **Hot/Cold section:** players ranked by last-10-day batting split. Hot players (AVG > .300 last 10) shown in green. Cold players (AVG < .200 last 10) shown in red/blue.
- **Starting Pitching stats table:** SP name, G, GS, W, L, ERA, WHIP, K/9, BB/9, IP — with ERA color coded (red=bad, blue=good)

---

## 12. ANALYSIS TAB — COMPLETE SPECIFICATION

### Three-Box Layout

- **LEFT BOX (ml-card):** HITTING LEADERS — top hitters in switchable offensive stats
- **CENTER BOX (ml-card):** SHARED STATS — Projected WAR (large gold number), Fantasy Points (large gold number), Team wRC+, Team OPS+
- **RIGHT BOX (ml-card):** PITCHING LEADERS — top pitchers in switchable pitching stats

### Leaders Box — Each Box Specification

- **Title bar:** 'HITTING LEADERS' or 'PITCHING LEADERS' in Bebas Neue
- **10 rows per box:** rank number (orange), player name (Barlow Condensed), stat value (blue-bright, right)
- **Player headshots:** small circle (~24px) between rank and name
- **Stat label shown:** at top right (e.g. 'HOME RUNS' or 'ERA')
- **Switchable stat buttons:** at bottom of each box — same pill button style as Leaders panel

### Bug Fix — Position Filtering

- **Hitting Leaders box:** must only show players with `position.code !== '1'` (not pitchers)
- **Pitching Leaders box:** must only show players with `position.code === '1'` (pitchers only)
- **This is the primary bug in V3** — currently pitchers appear in batting stats

---

## 13. VISUAL DESIGN REFERENCES — ALL IMAGES DESCRIBED IN DETAIL

Luke provided five reference images and two additional spec images. Every AI agent must read these descriptions before making any visual changes to the dashboard.

### 13.1 Website_Dashboard_Example.jpg — Current Site (The "Before")

Shows the existing V3 dashboard with **Baltimore Orioles selected**. This is the baseline to improve upon.

**Key Visual Elements:**
- **Three main panels:** Offense stats (left), Pitching stats (center), Leaders sidebar (right)
- **Tab bar across the top:** Team Stats, Hot/Cold, Starting Pitching, Matchups/Results, Metric Leaders, Longest HR, Roster & Injuries, Headlines & Standings, Prospects — ALL of these consolidate into 7 tabs in V4
- **Record bar shows:** RECORD: 15-19 · RUNS: 154 · RA: 184 · DIFF: -30 · L10: 4-6
- **Offense panel uses:** large Bebas Neue numbers with 'Nth in MLB' rank labels in orange below each stat
- **Pitching panel uses:** same format with rank labels in blue
- **Leaders sidebar:** player headshots in small circles, rank number, first name small/last name bold, green stat value on right, clickable stat category buttons at bottom (FPTS, AVG, HR, RBI, HITS, SB, BB, OPS, OBP, ERA, SO, WAR)

**What This Shows:**
The current design is clean but needs modernization. The three-panel structure is correct. The typography and stat display are foundational. The next version must keep this solid structure but add depth: percentile bars, advanced tables, pitch profiler cards, and tactical intelligence panels.

---

### 13.2 PlayerProfileMockups.png — The Flagship Intelligence Profile (MOST IMPORTANT)

Full **Corbin Carroll** profile. This single image defines everything the Player Profile tab must become. It is a dense multi-panel intelligence card that looks like an actual front-office scouting report.

**Top-Left — Identity & Evaluation:**
- Player headshot, full name, position (RF), team (Arizona Diamondbacks), team logo
- Bio: B/T: L/L · HT: 5'10" · WT: 165 · AGE: 25 (8/21/2000)
- Draft: 2019 Rd 1, Pick 16 (Arizona) - Lakeside HS (WA)
- **Awards pills:** 2023 NL ROY (gold), 2023, 2024, 2025 All-Star (blue), 2025 Silver Slugger (orange), 2025 All-MLB Second Team (green)
- **CONTRACT & VALUE box:**
  - Status = Pre-Arb, 2026 Salary = $760K, Service Time = 2.071, ARB Eligible = 2027, Free Agent = 2030
  - Surplus Value = $85M+, FV Grade = 65, WAR 2026 (proj) = -2.1, $/WAR = -$362K
- **SCOUTING GRADES (20-80 SCALE) table:** 
  - Hit=55/Solid Avg, Raw Power=45/Average, Game Power=50/Average, Speed=65/Plus, Field=50/Above Avg, Arm=50/Average, Overall FV=55/Pro
- **SCOUT NOTE:** "Elite athlete with above-average contact and plus speed/defense. Power ceiling limited by frame projects 18-22 HR/162 at peak. Elite BB% signals advanced approach. 2025 breakout (.884 OPS, 31 HR) showed expanded power profile. Grades reflect true talent."

**Top-Center — Multi-Year Percentile Table:**
- **Title:** PERCENTILE RANKINGS - MULTI-YEAR (MLB SAVANT)
- **Years 2022-2026** as rows
- **Column groups:** RUN VALUE (Batting, Base Run, Fielding), BATTING (xwOBA, xBA, xSLG, EV, Barrel%, HardHit%, LA Sweet%, Bat Spd, SquaredUp%, Chase%, Whiff%, K%, BB%), FIELDING (Range OAA, Arm Val, Arm Spd), RUNNING (Sprint Speed)
- **Example 2026 row:** 82, 99, 50 | 67, 46, 71, 61, 75, 60, 36, 84, 24, 30, 71 | 89, 30, 15 | 96
- **Color key:** 80-100=Elite(red), 60-80=Above Avg(orange), 40-60=Avg(gray), 20-40=Below Avg(blue), 0-20=Poor(dark blue)

**Top-Right — TJStats Pitcher Panel (Trevor McDonald RHP):**
- **Movement Profile** (IVB vs HB) scatter plot with colored dots per pitch type
- **Pitch Locations 2026:** two zone heatmaps side by side — vs LHB and vs RHB
- **Pitch type legend:** 4-Seam (red dot), Sinker (dark red), Slider (green), Curveball (light green), Changeup (teal)
- **Arsenal & Pitch Metrics table** with columns: Pitch Type, Usage%, Velo, Spin, VAA, HAA, vRel, hRel, NRel, vExt, EX5, TJ Stuff+, Zone%, Chase%, Whiff%, xwOBAcon
- **Example row:** 4-Seam 49.8%, 96.1 mph, 2480 rpm, -4.2, -0.7, 6.3, 150, 104 Stuff+, 52%, 34%, 16%

**Middle-Center — Advance Scouting & Count Usage:**
- **ADVANCE SCOUTING — PITCH TYPE VULNERABILITY (TRUMEDIA)**
  - vs LHP row: .548 vs FB, .423 vs HS, .684 vs BB, 4.5% BB IZWhiff%, 18.6% 2K IZWhiff%, 47.3% 0-0 Swing%, 40.0% Chase%
  - vs RHP row: .476 vs FB, .357 vs HS, .612 vs BB, .230 vs CH/SP, 0.000 BB IZWhiff%, 24.6% 2K IZWhiff%, 38.6% 0-0 Swing%, 37.4% Chase%
- **PITCHER COUNT USAGE MATRIX (RECOMMENDED):** rows=pitch types, columns=counts (0-0 through FULL), cells=usage%, high usage = red
- **ZONE HEAT MAP — xSLG ALLOWED (VS RHB):** 3x3 zone grid, values like .650/.412/.671 top, .421/.312/.389 mid, .258/.245/.301 bottom, red=high xSLG=exploit, blue=low=avoid

**Middle-Right — Pitch Profiler Card (Camilo Doval RHP):**
- Full Pitch Profiler spec — see Section 10 for complete details
- Also includes: NPB Hitter Card for Okamoto Kazuma (1B) with split tables and percentile rank grid
- MiLB Advanced Scouting Sheet (2026 AAA): vs LHP and vs RHP tables

**Bottom-Left — 2026 Splits:**
- **8 split rows:** vs LHP (PA=53), vs RHP (PA=97), Home (PA=68), Away (PA=82), Day (PA=74), Night (PA=76), RISP (PA=28), Bases Empty (PA=92)
- **Columns:** PA, AVG, OBP, SLG, OPS, wRC+, ISO, BABIP, K%, BB%, HR
- **Notable:** RISP wRC+ = 228 (highlighted green), vs LHP OPS = .453, vs RHP OPS = .709

**Bottom-Center — Video & Career Stats:**
- **VIDEO HIGHLIGHTS & BREAKDOWNS:** 4 YouTube cards in a row
  - 2026 Season Highlights — Watch on YouTube
  - Swing Mechanics Breakdown — Watch on YouTube
  - 2023 Rookie Year Recap — Watch on YouTube
  - 2025 All-Star Game Highlights — Watch on YouTube
- **CAREER MLB BATTING STATS table:** 5 seasons shown + CAREER totals row
  - 2022: 38 G, 131 PA, .260 AVG, .333 OBP, .500 SLG
  - 2023*: 155 G, 663 PA, .285 AVG, .362 OBP, .506 SLG, 25 HR
  - 2024: 158 G, 684 PA, .231 AVG, .312 OBP, .392 SLG
  - 2025*: 143 G, 604 PA, .264 AVG, .353 OBP, .484 SLG
  - 2026: 36 G, 158 PA, .261 AVG, .361 OBP, .500 SLG
  - CAREER: 524 G, 2,236 PA, .258 AVG, .342 OBP, .492 SLG

**Key Design Language:**
- Dark navy background throughout
- Every panel is self-contained and modular
- Color means something: red=elite/exploit, blue=below avg/avoid, gray=neutral
- Dense information but controlled with borders, spacing, typography
- Reads like an internal front-office tool, not a public stats site
- Three-column layout: left (identity), center (analytics), right (modeling)
- Percentile bars use the exact Savant color scale with bubbles sitting ON the fill
- Multiple views: multi-year percentile table, 2026 bars, splits, career stats, pitch profiles, videos

---

### 13.3 Pitcher_Profile_Dash_DBDE.jpg — Pitch Profiler (Camilo Doval)

Full Pitch Profiler card for **San Francisco Giants closer Camilo Doval**. This defines the right-column pitcher data panel.

**Header:**
- Headshot left, 'CAMILO DOVAL', San Francisco Giants (3/30-7/30), SEASON: 2025, THROWS: R

**Summary Bar:**
- SF | IP=46.2 | PA=191 | ERA=3.09 | FIP=3.17 | WHIP=1.20 | K%=26.2% | BB%=12.6% | K-BB%=13.6% | Whiff%=28.1% | Barrel%=3.0% | proStuff+=113
- Cell colors: ERA 3.09 (pink/red = bad), FIP 3.17 (pink/red), BB% 12.6% (blue = high = bad), K-BB% 13.6% (neutral)

**Release Point:**
- Silhouette figure, orange dot at release position (~5'6" height, ~1.5ft from center)

**Movement Profile:**
- Scatter plot, average arm angle 16°
- Slider (olive/green dots) clusters at -7 IVB / -7 HB
- Cutter (brown dots) at +10 IVB / +3 HB
- Sinker (orange dots) at +3.8 IVB / +6.7 HB
- Arm angle line drawn

**Pitch Frequency Chart:**
- LHH vs RHH split bars
- Slider: LHH=55.3% (116 proStuff+), RHH=51.1% (112)
- Cutter: LHH=41.8% (116), RHH=41.0% (115)
- Sinker: LHH=2.9% (97), RHH=8.0% (64)

**Arsenal Table:**
- Slider: 53.0% / 89.1 mph / 2612 rpm / IVB=-0.2 / HB=-7.0 / VAA=-7.42° / HAA=-2.32° / vRel=5.46 / hRel=1.31 / Ext=6.37 / Arm=18° / proStuff+=115 / Whiff%=39.2% / Barrel%=2.7%
- Cutter: 41.3% / 98.1 mph / 2530 rpm / IVB=10.6 / HB=3.0 / VAA=-4.65° / proStuff+=115 / Whiff%=13.6% / Barrel%=2.8%
- Sinker: 5.7% / 95.5 mph / 2406 rpm / IVB=3.8 / HB=6.7 / VAA=-5.46° / proStuff+=72 / Whiff%=14.3% / Barrel%=5.9%

**Footer:**
- Created By Pitch Profiler | @PitchProfiler | MLBPitchProfiler.com | Data Sources: MLB & Pitch Profiler

**Visual Impact:**
The three-visualization layout (Release Point, Movement Profile, Pitch Frequency) is the blueprint for pitcher right-column panels. The arsenal table below gives complete pitch-level specifications. The color coding (red=good Stuff+, blue=bad usage) makes data interpretation immediate.

---

### 13.4 Pitcher_Profile_NPB_Dash2_DBDE.jpg — NPB Pitcher Dashboard (Griffin)

Japanese NPB pitcher **Griffin** (グリフィン). Shows the depth format for pitch-type analysis split by batter handedness. Throws: L, Age: 30, 190cm / 102kg, 2025 NPB.

**Overall Table (7 pitch types):**

| PITCH TYPE | PITCHES | USAGE% | VELO | xPV | xPV/100 | CSW% | Whiff% | GB% | Stuff+ | Location+ |
|------------|---------|--------|------|-----|---------|------|--------|-----|--------|-----------|
| 4-Seam Fastball | 417 | 37.0 | 145.5 | 0.2 | 0.2 | 25.7 | 10.4 | 42.6 | 112 | 102 |
| Slider | 207 | 18.4 | 129.3 | 2.4 | 1.2 | 35.7 | 39.1 | 50.0 | 165 | 92 |
| Cutter | 192 | 17.0 | 139.8 | 2.5 | 1.3 | 28.1 | 19.1 | 45.5 | 154 | 119 |
| Changeup | 126 | 11.2 | 131.4 | 0.6 | 0.5 | 37.3 | 50.0 | 42.9 | 122 | 107 |
| Knuckle Curve | 67 | 5.9 | 124.6 | 0.5 | 0.7 | 40.3 | 22.2 | 80.0 (RED) | 131 | 108 |
| Split Finger | 66 | 5.9 | 131.5 | 1.0 | 1.5 | 25.8 | 41.0 | 60.0 | 161 | 116 |
| Sinker | 52 | 4.6 | 146.1 | -0.7 | -1.4 | 15.4 | 8.8 | 63.2 | 74 (BLUE) | 66 (BLUE) |

- **vs Right table:** same columns, different values — shows how pitch effectiveness shifts
- **vs Left table:** same columns, different values — shows platoon split analysis
- **Each section ends with:** a row of small pitch-location heatmaps, one per pitch type, pitcher's view
- **Color coding:** red cells = high/exploit, blue = low/avoid

**Visual Structure:**
The NPB dashboard is organized vertically — each handedness split gets its own complete table + heatmap row. This depth of pitch-type breakdown is the model for pitcher intelligence in your dashboard. When a pitcher is selected, the right column should display this multi-table layout with color-coded pitch-type specialization.

---

### 13.5 Hitter_Profile_Dash_DBDE.jpg — TJStats Hitter (Bryce Eldridge)

The clearest reference for the **percentile bar style**. **Bryce Eldridge, 1B, B/T: L/R, Age: 20, 6'7"/240, Season Batting Percentiles, 2025 AAA Season.**

**Header:**
- Headshot left, name large center, position/handedness/age/size below name, SF Giants logo top right
- Season label: 'Season Batting Percentiles' and '2025 AAA Season'

**Season Summary Table:**
- Columns: Pitches=538, PA=132, BIP=82, HR=10, AVG=0.248, OBP=0.305, SLG=0.538, OPS=0.844

**FanGraphs Scouting Grades Table:**
- Columns: FV=55, Hit=30/40, Game Power=45/70, Raw=60/80, Spd=45/30, Fld=30/40

**Percentile Bar Scale Header:**
- 'Poor ▲' in blue (#2471A3) — far left
- 'Average ▲' in light gray — center
- 'Great ▲' in red (#C0392B) — far right

**Percentile Bars — Exact Measurements and Values:**

| METRIC | PERCENTILE | RAW VALUE | COLOR |
|--------|-----------|-----------|-------|
| wOBA | 64 | 0.353 | gray (average) |
| xwOBA | 99 | 0.393 | red (elite) |
| Average EV | 100 | 95.4 | red (elite) |
| 90th% EV | 94 | 107.7 | red (elite) |
| Max EV | 95 | 114.6 | red (elite) |
| Barrel% | 100 | 18.8 | red (elite) |
| Hard-Hit% | 100 | 62.5 | red (elite) |
| LA Sweet-Spot% | 62 | 36.2 | gray (average) |
| Z-Swing% | 58 | 68.4 | gray (average) |
| O-Swing% | 30 | 29.9 | blue (below avg) |
| Whiff% | 15 | 33.1 | blue (poor) |
| Z-Contact% | 36 | 80.7 | blue (below avg) |
| K% | 13 | 28.8 | blue (poor) |
| BB% | 21 | 8.3 | blue (below avg) |
| Pull% | 33 | 34.1 | blue (below avg) |
| Pull Air% | 52 | 13.4 | gray (average) |

**Bar Construction:**
- Bar fills left to right — left = poor, right = great
- The percentile number bubble sits directly ON the fill bar at its rightmost edge
- Bubble is a circle, ~22px diameter, contrasting white text inside
- Track (unfilled portion) is light gray: rgba(255,255,255,0.12) or similar
- Raw stat value appears to the right of the track, right-aligned, light gray text
- Metric label appears to the LEFT of the track, right-aligned, gray text, fixed width
- Each bar row has a very subtle dashed bottom border separating rows

**Critical Detail:**
This is the exact visual treatment your Player Profile needs for the CENTER COLUMN percentile bars. The bar design is clean, the coloring is immediate (red elite, blue poor, gray average), and the bubble positioning is distinctive. Currently your pctColor() function tries to shade the background — that's wrong. The bars should use the fill pattern shown here.

---

### 13.6 Leaders_Table_DBDE.png — Leaders Panel

Full description in Section 7. Key visual points:
- Player headshot circles, two-line name format (first name small above, LAST NAME large)
- Green bold stat values on right
- Orange active stat pill button
- Dark navy background with subtle row separators
- Rank numbers in orange on left

---

### 13.7 Win_Proj_Graph_DBDE.png — Win Projection Chart

Full description in Section 8. Key visual points:
- Actual wins = solid green area chart
- Projected = dashed orange line
- Reference lines for division/wild card targets
- Footer stats bar with Win%, Record, Game #, Remaining
- Three colored target boxes top-right (Division, Wild Card, Projected)

---

## 14. MLB API QUICK REFERENCE

All calls go through `/api/mlb?path=...` — **NEVER directly to statsapi.mlb.com**. Always append `&season=${SEASON}`.

| ENDPOINT | PROXY CALL FORMAT | RETURNS |
|----------|-------------------|---------|
| Standings | `/api/mlb?path=/standings&leagueId=103,104&season=2026` | All division standings for AL and NL |
| Team Season Stats | `/api/mlb?path=/teams/{id}/stats&group=hitting,pitching&season=2026&stats=season` | Season hitting + pitching totals for team |
| Active Roster | `/api/mlb?path=/teams/{id}/roster?rosterType=active` | 26-man active roster |
| Injured List | `/api/mlb?path=/teams/{id}/roster?rosterType=injuredList` | All IL entries |
| Team Leaders | `/api/mlb?path=/teams/{id}/leaders?leaderCategories=homeRuns,battingAverage&season=2026&limit=10` | Stat leaders for a specific team |
| League Leaders | `/api/mlb?path=/stats/leaders?leaderCategories=homeRuns&season=2026&limit=10` | MLB-wide stat leaders |
| Player Bio | `/api/mlb?path=/people/{pid}?hydrate=stats(type=season,group=hitting,season=2026)` | Player info + current season stats |
| Career Stats | `/api/mlb?path=/people/{pid}?hydrate=stats(type=yearByYear,group=hitting)` | Year-by-year career stats |
| Pitcher Stats | `/api/mlb?path=/people/{pid}?hydrate=stats(type=season,group=pitching,season=2026)` | Pitcher season stats |
| Splits vs L/R | `/api/mlb?path=/people/{pid}/stats?stats=vsLeft,vsRight&season=2026` | Handedness split stats |
| Schedule | `/api/mlb?path=/schedule?teamId={id}&season=2026&gameType=R` | Team schedule + results |
| Game Recap | `/api/mlb?path=/game/{gameId}/content` | Game content, highlights, recap |
| Player Headshot | `https://img.mlbstatic.com/mlb-photos/image/upload/w_180,q_auto:best/v1/people/{pid}/headshot/67/current` | Player headshot image (external, not proxied) |
| Team Logo | `https://www.mlbstatic.com/team-logos/{teamId}.svg` | Team SVG logo (external, not proxied) |

### fetchJSON() Helper Function

The `fetchJSON()` helper in index.html handles all API calls. It must accept full proxy URLs and return parsed JSON. Always wrap in try/catch.

```javascript
function fetchJSON(url) {
  return fetch(url).then(function(r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }).catch(function(err) {
    console.error('Fetch error:', url, err);
    throw err;
  });
}
```

---

## 15. AI AGENT WORKFLOW & CRITICAL RULES

Every AI agent working on this project must follow these rules without exception. Skipping any step risks breaking the live dashboard.

### Session Start Checklist

| STEP | ACTION | COMMAND / NOTE |
|------|--------|----------------|
| 1 | Navigate to project | `cd "/Volumes/Luke's Hard Drive/Baseball/Baseball Dashboards/luke-mlb-dashboard"` |
| 2 | Verify correct directory | `ls public/ api/` → expect: index.html, mlb.js, savant.js |
| 3 | Backup before editing | `cp public/index.html "public/backups/index_$(date +%s).backup"` |
| 4 | Read current index.html | `cat public/index.html` — understand existing code before writing any changes |
| 5 | Make surgical edits | Edit ONLY the targeted section. Never rewrite unrelated code. |
| 6 | Validate changes | Check: unclosed HTML tags, missing JS brackets, undefined variables |
| 7 | Deploy | `vercel --prod` (from project root, not from inside public/ or api/) |
| 8 | Confirm live | Visit https://mlb-dashboard-smoky.vercel.app and verify the change |

### Critical Rules — Never Violate

🚨 **NEVER rewrite the entire index.html unless Luke explicitly says to.** Make surgical, targeted edits only. The file is large and a full rewrite risks breaking working code.

🚨 **NEVER hardcode fake placeholder stats.** All data must come from the MLB API proxy. If an endpoint is unavailable, show 'N/A' — never fabricate numbers.

🚨 **NEVER call statsapi.mlb.com directly from the browser.** ALL fetches go through `/api/mlb?path=...`

🚨 **NEVER edit files in public/backups/.** These are read-only archives.

### Important Best Practices

- **ALWAYS backup before editing**
- **ALWAYS call updateThemeColors(teamId)** inside `loadTeam()` after any color-related change
- **ALWAYS deploy with vercel --prod**, never just save and open index.html directly
- **ALWAYS test with multiple teams** after any change — colors, data loading, and layout all depend on team selection
- **When adding new CSS:** add to the existing `<style>` block, do not add a second `<style>` block
- **When adding new JavaScript:** add to the existing `<script>` block before the closing `</script>` tag
- **Keep the TEAMS array intact** — it contains all 30 MLB team IDs needed by the API
- **Keep the SEASON variable at the top** of the script — all API calls depend on it

### Code Style Guidelines

- **JavaScript:** use `var` (not const/let) for compatibility — existing code uses var throughout
- **CSS:** use CSS custom properties (var(--orange), var(--blue-bright), etc.) for all accent colors
- **HTML structure:** all tab pages use `<div class='pg' id='pg-[name]'>` pattern — follow this exactly
- **Loading state:** use `sh(id, '<div class="loading">Loading...</div>')` helper for async panels
- **Error state:** use `sh(id, '<div class="error-msg">Error loading data</div>')` for failed API calls
- **Font rendering:** always specify font-family explicitly in new CSS — do not rely on inheritance

---

## 16. TROUBLESHOOTING — COMPLETE REFERENCE

| SYMPTOM | LIKELY CAUSE | FIX |
|---------|--------------|-----|
| Stats show — or Loading forever | CORS block — fetch going directly to statsapi.mlb.com instead of proxy | Change all fetch calls to `/api/mlb?path=...` format |
| Yellow warning banner on page | index.html opened directly in browser without Vercel proxy running | Run `vercel dev` locally or deploy: `vercel --prod` |
| Pitchers in batting leaders | `loadMetricLeaders()` not filtering by position code | Split roster into pitcherIds (code==='1') and hitterIds (code!=='1') before rendering |
| Hitters in strikeouts/ERA | Same bug as above — wrong roster array used | Apply pitcherIds filter to all pitching leader calls |
| Team colors not updating | `updateThemeColors()` not being called in `loadTeam()` | Add `updateThemeColors(teamId)` at very top of loadTeam() function |
| SF Giants colors wrong | Team color array has wrong hex codes for team 137 | Set primary=#FD5A1E, secondary=#27251F for teamId 137 |
| `vercel --prod` command not found | Vercel CLI not installed globally | `npm install -g vercel` |
| Port already in use (local dev) | Previous `vercel dev` session still running in background | `vercel dev --listen 3001` |
| 504 Gateway Timeout | MLB API slow response — proxy has 10-second timeout | Retry request. Add sessionStorage caching to reduce frequency. |
| Player headshots not loading | Wrong player ID or MLB photo endpoint issue | Add onerror handler: `onerror="this.style.display='none'"` |
| Quotes not persisting after refresh | savedQuotes stored in memory only — resets on page load | Use `localStorage.setItem('mlb_saved_quotes', JSON.stringify(savedQuotes))` and load on init |
| Tab data not loading when clicked | Tab click handler not calling load function for that tab | Add `if(tab.dataset.tab==='tabname') loadTabFunction()` in tab click listener |
| SEASON variable wrong | Hard-coded 2026 not updated when dropdown changes | Add onchange handler: `SEASON=parseInt(this.value); loadTeam(curTeam);` |
| vercel.json missing | File was deleted or never created | Recreate with rewrite: `source=/api/mlb/:path*, destination=https://statsapi.mlb.com/api/:path*` |
| Deployment fails / build error | Syntax error in index.html or api files | Run `python validate_html_js.py` before deploying — check console for error line numbers |

---

## CONCLUSION

This document contains **every instruction, specification, visual reference, API detail, and troubleshooting guide** needed to develop and maintain the MLB Analytics Dashboard. It is the single source of truth for the project.

**The three pillars of success:**
1. **Project Identity:** This is a Bloomberg Terminal for baseball, not a casual stats site.
2. **Technical Discipline:** All API calls go through the proxy. Never break the established architecture.
3. **Design Excellence:** Color codes data. Bars show percentiles. Tables feel tactical. Panels are modular. This is not a typical web dashboard — it's a front-office scouting tool.

**For any AI agent starting work on this project:**
1. Read this document completely.
2. Study the reference images (all 5 + 2 specs).
3. Back up before editing.
4. Make surgical changes, not rewrites.
5. Deploy with confidence.
6. Test with real data.

---


---

## 17. JARVIS INTELLIGENCE ENGINE — FULL ARCHITECTURE & PHILOSOPHY

This section defines the **JARVIS Decision Intelligence Engine** — the hidden brain that elevates the MLB Analytics Dashboard from a data display tool into a front-office-grade decision system. Every AI agent working on this project must read and internalize this section before touching any code related to player evaluation, lineup optimization, or matchup analysis.

---

### 17.1 What This System Actually Is

This dashboard is **NOT a stats website**. It is a **Baseball Intelligence Operating System**.

The critical distinction:

| What a Stats Website Does | What This System Must Do |
|--------------------------|--------------------------|
| Show OPS = .812 | Return "Above-average power bat with K risk (Decision Score: 84)" |
| Display raw ERAs | Say "Attack this pitcher high fastball — exploit zone confirmed" |
| List lineup options | Output "Lineup A is +6.2 runs better vs this pitcher (confidence 78%)" |
| Show WAR values | Calculate "Trade value = B+ with medium risk" |

The system must **turn data into decisions**, not just display data. This is the foundational rule that every feature must be measured against.

---

### 17.2 The Gap Analysis — What Exists vs. What Is Required

#### ✅ What Is Already Built (Correct Direction)

These features match the system spec:

- **Data pipeline (Node + DB)** → matches backend spec
- **Pitch tracking + arsenal** → matches scouting engine
- **Heatmaps + matchup engine** → matches Part 7
- **Lineup optimizer** → explicitly required
- **Projection tools** → matches Part 9

**Verdict: The right product is being built.**

#### ❌ What Is Missing (Non-Negotiable Gaps)

**Gap 1 — No Percentile Engine (Biggest Gap)**

The system rule is: *"All evaluation must be league-relative (percentiles)."*

Currently the dashboard uses:
- OPS (raw)
- ISO (raw)
- Raw matchup scores

This violates the core architecture. **Every metric must become a percentile vs. the league population.** OPS must become "OPS percentile: 71." ISO must become "ISO percentile: 83." Only then can JARVIS make meaningful decisions.

**Gap 2 — No JARVIS Decision Output**

The system requires a structured decision object for every player evaluation:

```json
{
  "summary": "Above-average power hitter with swing-and-miss risk",
  "strengths": ["Top-tier barrel rate", "Above-average exit velocity"],
  "risks": ["High chase rate", "Elevated strikeouts"],
  "recommendation": "Bat 4th vs RHP",
  "decision_score": 84,
  "trade_grade": "B",
  "risk_level": "Medium",
  "confidence": 0.78
}
```

Currently the system outputs: lineup data, projections, raw scores. That is **not** a decision engine.

**Gap 3 — Still Partially a Dashboard**

System rule: *"NOT allowed: raw stat dashboards."*

Charts, data tables, and pitch lists are fine as the **analytics layer** — but they must be paired with JARVIS decision output. The raw display layer alone is insufficient. It needs the intelligence layer on top.

**Gap 4 — No KPI System (CAS / DPI / DQS)**

The system explicitly defines three core KPIs that form the brain of all player evaluation:

- **CAS** — Contact Ability Score
- **DQS** — Discipline Quotient Score  
- **DPI** — Damage Potential Index
- **TPVI** — Total Player Value Index (composite)

These are **not being calculated**. They are the core brain of the system and must be implemented.

---

### 17.3 The Two-System Architecture

The correct mental model for this entire project is **two systems running in parallel**:

#### System 1 — The Analytics Frontend (What You See)

This is the **exploratory, visual, interactive layer** that analysts interact with:

- Charts ✅ Keep exactly as-is
- Heatmaps ✅ Keep exactly as-is
- Pitch tracking ✅ Keep exactly as-is
- Lineups ✅ Keep exactly as-is
- Movement plots ✅ Keep exactly as-is
- Percentile bars ✅ Keep exactly as-is

**Rule: Do NOT convert these into pure decision outputs.** This is the analysis playground. It should stay visual, flexible, and interactive. This is what makes the tool fun, usable, and intuitive.

#### System 2 — JARVIS (What Decides)

This is the **structured, opinionated, scoring-based decision layer** that runs behind the scenes:

- Percentile computation (league-relative)
- KPI calculation (CAS / DQS / DPI / TPVI)
- Matchup evaluation
- Lineup scoring
- Decision recommendations

**Rule: JARVIS augments the analytics layer — it does not replace it.** Every time data is loaded, JARVIS runs in the background and surfaces its output as a non-intrusive overlay.

#### The Correct Data Flow

```
Player Data Loaded
        ↓
renderAnalytics(player)     ← System 1: Visual display
        +
buildJarvisOutput(player)   ← System 2: Decision intelligence
        ↓
JARVIS Dock shows 1-line insight
        ↓
User clicks → Full decision panel expands
```

This is exactly how real MLB front offices work: **analysts see dashboards, models output decisions behind the scenes.**

---

### 17.4 The Key Mindset Shift

| Before (Current) | After (Required) |
|-----------------|-----------------|
| "Show data and models" | "Return a decision with confidence" |
| "Here's data — interpret it yourself" | "Here's the data — and here's what it means" |
| OPS is .812 | "Above-average profile — target in power slot vs RHP" |

This single shift — from display to decision — is the most important architectural change in the entire project.

---

### 17.5 The Three Upgrades Required

Only three upgrades are needed to bring the system to 100% spec compliance:

**Upgrade 1 — Add Percentile Engine**

Every raw metric must be converted to a league-relative percentile:
- `OPS → OPS_percentile`
- `ISO → ISO_percentile`
- `K% → K_percentile` (inverted — lower K% = higher percentile)
- `xwOBA → xwOBA_percentile`
- And so on for all evaluation metrics

**Upgrade 2 — Build JARVIS Output Layer**

Every player evaluation must produce a structured decision object (see Section 18 for the complete contract).

**Upgrade 3 — Convert Lineup Optimizer to Decision Tool**

Instead of: "Here's the lineup"

It must become: "This lineup produces +4.2 expected runs vs this pitcher (confidence 78%)"

---

## 18. JARVIS IMPLEMENTATION — COMPLETE TECHNICAL SPECIFICATION

This section contains the complete, production-ready implementation spec for JARVIS — covering the data contract, frontend dock, backend endpoint, tab-awareness rules, and display logic.

---

### 18.1 The Universal JARVIS Data Contract

One contract is used everywhere — player profile, matchup analysis, lineup optimization, and trade evaluation. The UI renders this generically across all pages without custom logic each time.

```json
{
  "context": "player|matchup|lineup|trade",
  "summary": "string — 1 sentence max",
  "strengths": ["string", "string", "string"],
  "risks": ["string", "string", "string"],
  "recommendation": "string — direct action statement",
  "confidence": 0.78,
  "decision_score": 84,
  "trade_grade": "A|B|C|D|F",
  "risk_level": "Low|Medium|High",
  "why": [
    {
      "rule": "string describing the rule applied",
      "evidence": [
        { "metric": "xwOBA_pct", "value": 92 }
      ]
    }
  ],
  "cta": [
    { "label": "Compare comps", "action": "open_comps" }
  ]
}
```

**Field Definitions:**

| Field | Type | Description |
|-------|------|-------------|
| `context` | string | Which evaluation context produced this output |
| `summary` | string | Single-sentence human-readable verdict |
| `strengths` | array | Up to 4 deterministic strength statements |
| `risks` | array | Up to 4 deterministic risk statements |
| `recommendation` | string | Direct action statement — what to do |
| `confidence` | float 0.0–1.0 | Data completeness confidence score |
| `decision_score` | integer 0–100 | Composite score from KPI formula |
| `trade_grade` | string A–F | Letter grade derived from decision_score |
| `risk_level` | string | Low / Medium / High volatility profile |
| `why` | array | Explainability chain — rules + evidence |
| `cta` | array | Optional call-to-action buttons for UI |

**No fabrication rule:** If required inputs are missing, `decision_score` becomes `null`, `confidence` drops, and the summary reads "Insufficient data to evaluate." Never invent numbers.

---

### 18.2 Frontend — The JARVIS Dock (HTML)

Add this once, near the end of `<body>`, before the closing `</script>` tag. It reuses existing CSS variables and panel styles — no new stylesheet needed.

```html
<div id="jarvis-dock" style="position:fixed;bottom:16px;right:16px;z-index:9999;max-width:360px;display:none">

  <!-- Collapsed chip — always visible when JARVIS is active -->
  <div id="jarvis-chip" class="panel" style="padding:10px 12px;cursor:pointer;border-radius:14px;display:flex;gap:10px;align-items:center">
    <div style="font-family:Bebas Neue,sans-serif;font-size:18px;letter-spacing:2px;color:var(--orange)">JARVIS</div>
    <div id="jarvis-chip-text" style="font-size:11px;color:var(--text-dim);flex:1">—</div>
    <div id="jarvis-chip-score" style="font-family:Bebas Neue,sans-serif;font-size:18px;color:var(--gold)">—</div>
  </div>

  <!-- Expanded panel — opens on click -->
  <div id="jarvis-panel" class="panel" style="display:none;margin-top:10px;border-radius:16px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <div style="font-family:Bebas Neue,sans-serif;font-size:20px;letter-spacing:2px">JARVIS INSIGHT</div>
      <button class="refresh-btn" onclick="jarvisClose()">✕</button>
    </div>
    <div id="jarvis-body" style="font-size:12px;color:rgba(255,255,255,.85);line-height:1.55">—</div>
    <div style="display:flex;gap:8px;margin-top:12px;align-items:center;flex-wrap:wrap">
      <label style="font-size:10px;color:var(--text-dim);font-family:Barlow Condensed,sans-serif;letter-spacing:1px">AUTO-OPEN</label>
      <input type="checkbox" id="jarvis-auto">
      <label style="font-size:10px;color:var(--text-dim);font-family:Barlow Condensed,sans-serif;letter-spacing:1px;margin-left:8px">VERBOSITY</label>
      <select id="jarvis-verbosity" class="tpick" style="min-width:120px">
        <option value="minimal">Minimal</option>
        <option value="standard" selected>Standard</option>
        <option value="deep">Deep</option>
      </select>
    </div>
  </div>

</div>
```

---

### 18.3 Frontend — JARVIS JavaScript Engine

Add this entire block to the existing `<script>` section, before the closing `</script>` tag. Use `var` for consistency with the existing codebase.

```javascript
/* ════════════════════════════════════════════════════════════════════
   JARVIS INTELLIGENCE ENGINE
   Decision layer — runs on decision tabs only (profile, compare,
   matchups, lineup). Hidden on stats, leaders, standings.
════════════════════════════════════════════════════════════════════ */

// Tabs where JARVIS is active. All others hide the dock entirely.
var JARVIS_ENABLED_TABS = {
  'profile': true,
  'pc': true,
  'mr': true
  // Add 'lineup' when lineup optimizer tab is added
};

// Tab visibility gating — call inside the tab switch handler
function handleJarvisVisibility(tabId) {
  var dock = document.getElementById('jarvis-dock');
  if (!dock) return;
  if (JARVIS_ENABLED_TABS[tabId]) {
    dock.style.display = 'block';
  } else {
    dock.style.display = 'none';
    jarvisClose();
  }
}

// Wire into the existing tab click listener
// (Add this call inside the existing tab click handler in the codebase)
// handleJarvisVisibility(tab.dataset.tab);

function jarvisOpen() {
  document.getElementById('jarvis-panel').style.display = 'block';
}

function jarvisClose() {
  var p = document.getElementById('jarvis-panel');
  if (p) p.style.display = 'none';
}

// Toggle on chip click
document.getElementById('jarvis-chip').addEventListener('click', function() {
  var open = document.getElementById('jarvis-panel').style.display === 'block';
  open ? jarvisClose() : jarvisOpen();
});

function jarvisSetChip(summary, score) {
  var t = document.getElementById('jarvis-chip-text');
  var s = document.getElementById('jarvis-chip-score');
  if (t) t.textContent = summary || '—';
  if (s) s.textContent = (score !== null && score !== undefined) ? score : '—';
}

function jarvisRender(out) {
  var v = document.getElementById('jarvis-verbosity').value;
  var maxItems = (v === 'deep') ? 6 : 3;
  var strengths = (out.strengths || []).slice(0, maxItems);
  var risks = (out.risks || []).slice(0, maxItems);

  var html = '<div style="color:#fff;margin-bottom:6px"><strong>Summary:</strong> ' + (out.summary || '—') + '</div>';
  html += '<div style="color:var(--green)"><strong>Strengths:</strong> ' + (strengths.length ? strengths.join(' · ') : '—') + '</div>';
  html += '<div style="color:var(--gold);margin-top:4px"><strong>Risks:</strong> ' + (risks.length ? risks.join(' · ') : '—') + '</div>';
  html += '<div style="margin-top:8px"><strong>Recommendation:</strong> ' + (out.recommendation || '—') + '</div>';
  html += '<div style="margin-top:8px;color:var(--text-dim);font-size:11px;font-family:\'Barlow Condensed\',sans-serif;letter-spacing:1px">';
  html += 'SCORE: <strong style="color:var(--gold)">' + (out.decision_score !== null ? out.decision_score : '—') + '</strong>';
  html += ' · GRADE: <strong style="color:var(--orange)">' + (out.trade_grade || '—') + '</strong>';
  html += ' · RISK: <strong>' + (out.risk_level || '—') + '</strong>';
  html += ' · CONF: <strong>' + (out.confidence !== null ? Math.round(out.confidence * 100) + '%' : '—') + '</strong></div>';

  if (v === 'deep' && out.why && out.why.length) {
    html += '<div style="margin-top:10px;color:var(--text-dim);font-size:11px"><strong>WHY:</strong><br>';
    html += out.why.slice(0, 6).map(function(w) { return '• ' + w.rule; }).join('<br>');
    html += '</div>';
  }

  document.getElementById('jarvis-body').innerHTML = html;
  jarvisSetChip(out.summary, out.decision_score);
}

// Smart display filter — only show JARVIS when data quality is sufficient
function shouldDisplayJarvis(out) {
  if (!out) return false;
  if (out.decision_score === null || out.decision_score === undefined) return false;
  if ((out.confidence || 0) < 0.6) return false;
  if (!out.summary || out.summary.length < 5) return false;
  return true;
}

// Main entry point — call this after loading any decision-context data
async function jarvisCall(payload) {
  var res = await fetch('/api/jarvis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) return;
  var out = await res.json();
  if (!shouldDisplayJarvis(out)) {
    document.getElementById('jarvis-dock').style.display = 'none';
    return;
  }
  document.getElementById('jarvis-dock').style.display = 'block';
  jarvisRender(out);
  var auto = document.getElementById('jarvis-auto').checked;
  if (auto && (out.confidence || 0) >= 0.75) {
    jarvisOpen();
  }
}

// Restore JARVIS user preferences from localStorage
(function() {
  var auto = localStorage.getItem('jarvis_auto');
  var verb = localStorage.getItem('jarvis_verbosity');
  if (auto !== null) {
    var el = document.getElementById('jarvis-auto');
    if (el) el.checked = (auto === 'true');
  }
  if (verb) {
    var el = document.getElementById('jarvis-verbosity');
    if (el) el.value = verb;
  }
  document.getElementById('jarvis-auto').addEventListener('change', function() {
    localStorage.setItem('jarvis_auto', this.checked);
  });
  document.getElementById('jarvis-verbosity').addEventListener('change', function() {
    localStorage.setItem('jarvis_verbosity', this.value);
  });
})();
```

---

### 18.4 Where to Call `jarvisCall()` — Trigger Points by Context

**Player Profile** — after `loadPlayerProfile()` resolves:

```javascript
jarvisCall({ context: 'player', playerId: pid, season: SEASON });
```

**Player Comparison** — after `renderPlayerCompare()` completes:

```javascript
jarvisCall({ context: 'matchup', players: [pcSelected[1].id, pcSelected[2].id, pcSelected[3] ? pcSelected[3].id : null].filter(Boolean), season: SEASON, mode: type });
```

**Matchups Tab** — after game and probable pitcher data loads:

```javascript
jarvisCall({ context: 'matchup', teamId: curTeam, gamePk: gamePk, season: SEASON });
```

**Lineup Optimizer** — after optimal lineup is computed:

```javascript
jarvisCall({ context: 'lineup', lineup: lineupIds, opponentPitcher: oppPitcherId, season: SEASON });
```

**Rule:** If confidence is below 0.65, JARVIS chip shows "Insufficient data" and the dock stays hidden. Never force an output.

---

### 18.5 Backend — `/api/jarvis` Endpoint (Node/Express)

This is a new Vercel serverless function at `api/jarvis.js`. It follows the same proxy pattern as `api/mlb.js` and `api/savant.js`.

**The endpoint must:**
1. Accept a POST request with a JSON payload
2. Pull player metrics from the database or MLB API
3. Compute league-relative percentiles
4. Calculate KPIs (CAS / DQS / DPI / TPVI)
5. Build and return the JARVIS contract object

```javascript
// api/jarvis.js — Vercel serverless function
// Add to vercel.json routes: { "src": "/api/jarvis", "dest": "/api/jarvis.js" }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body;

  // No fabrication guard
  if (!payload || !payload.playerId) {
    return res.status(200).json({
      context: payload?.context || 'player',
      summary: 'Insufficient data to evaluate.',
      strengths: [],
      risks: [],
      recommendation: '—',
      confidence: 0.0,
      decision_score: null,
      trade_grade: '—',
      risk_level: '—',
      why: [{ rule: 'Missing required playerId input.', evidence: [] }]
    });
  }

  // TODO: Wire to your DB + percentile engine (see Section 19)
  // This stub returns a scaffold response that confirms the plumbing works
  return res.status(200).json({
    context: payload.context || 'player',
    summary: 'Decision layer scaffolded — wire KPIs + percentiles for full accuracy.',
    strengths: ['Proxy architecture enforced', 'JARVIS contract compliant'],
    risks: ['KPI/percentile computation not yet wired'],
    recommendation: 'Connect percentile engine to activate full scoring.',
    confidence: 0.5,
    decision_score: 70,
    trade_grade: 'C',
    risk_level: 'Medium',
    why: [{ rule: 'Scaffold response — percentile engine pending.', evidence: [] }]
  });
}
```

---

## 19. JARVIS UX RULES, SCORING ENGINE & BACKEND BLUEPRINT

This section contains the complete JARVIS scoring logic — the percentile engine, KPI formulas, decision scoring, and the "non-annoying" UX behavioral rules that must be followed at all times.

---

### 19.1 The "Non-Annoying" UX Rules — Core Behavioral Contract

JARVIS must behave like a **co-pilot overlay**, not a pop-up assistant. These rules are non-negotiable and apply everywhere in the UI.

#### Visibility Rules

- **Default state = collapsed.** The JARVIS chip shows a score + 1-line takeaway. The full panel is closed.
- **Expands only on click** (or when the user explicitly enables "Auto-open").
- **Never blocks interaction.** No modals. No forced prompts. No pop-ups.

#### Relevance Rules — Only Show When It Matters

JARVIS appears **only if:**
- `confidence >= 0.65` **AND**
- The user is in a decision context: Player Profile / Compare / Matchups / Lineup

Otherwise show nothing. If in a decision context but data is insufficient, show a subtle chip: "Jarvis — insufficient data." This is not an error — it is correct behavior and matches the no-fabrication rule.

#### Density Rules

- **Default view:** 1 sentence summary + up to 3 bullet points max
- **Expanded view:** Full strengths / risks / recommendation / why chain / evidence

#### User Control (Critical)

- A **toggle:** Auto-open ON/OFF
- A **verbosity selector:** Minimal / Standard / Deep
- Both settings **persist in localStorage** so the user is never repeatedly asked

---

### 19.2 Progressive Disclosure — The Full UX Flow

**What the user sees by default:**
```
[ JARVIS ]  Aggressive target vs RHP  [ 84 ]
```
That's it. One line. A score. No friction.

**What the user sees when they click:**
```
JARVIS INSIGHT                            ✕

Summary: High-impact profile with elite underlying indicators.

Strengths: Top-tier barrel rate · Above-average exit velocity · Disciplined approach
Risks: Swing-and-miss volatility (K%) · Chase tendency risk

Recommendation: Strong acquisition / priority bat

SCORE: 84  ·  GRADE: B  ·  RISK: Medium  ·  CONF: 91%

[WHY section — only in Deep mode]
• Percentiles primary signal (league-relative).
• KPIs computed: CAS/DQS/DPI/TPVI.
• Decision score uses canonical weights.
```

**Example interaction flow:**

1. User opens Player Profile → JARVIS chip appears tiny in corner
2. Chip reads: *"Above-average power bat with K risk (82)"*
3. User ignores → zero friction, full analytics accessible
4. User clicks chip → full insight opens → decision support available
5. User builds lineup → JARVIS chip: *"Lineup projects +4.1 runs vs RHP (78)"*
6. User clicks → sees reasoning + weaknesses → makes informed decision

---

### 19.3 Decision Tab Architecture — Where JARVIS Lives

#### JARVIS ENABLED Tabs

| Tab | Context | Trigger Point |
|-----|---------|--------------|
| Player Profile (`pg-profile`) | `player` | After `loadPlayerProfile()` |
| Player Compare (`pg-pc`) | `matchup` | After `renderPlayerCompare()` |
| Matchups (`pg-mr`) | `matchup` | After schedule/pitcher data loads |
| Lineup Optimizer (`pg-lineup`) | `lineup` | After optimal lineup computed |

#### JARVIS DISABLED Tabs (No Dock Shown)

- Team Stats (`pg-ts`)
- Hot/Cold (`pg-hc`)
- Starting Pitching (`pg-sp`)
- Metric Leaders (`pg-ml`)
- Roster & IL (`pg-ri`)
- Headlines (`pg-hs`)
- Savant (`pg-sv`)
- Fantasy (`pg-fant`)
- League Leaders (`pg-ll`)
- WAR Value (`pg-war`)
- Stuff Calculator (`pg-stuff`)
- FV Charts (`pg-fv`)
- Scout Notes (`pg-notes`)
- HR Analytics (`pg-hr`)
- Run Expectancy (`pg-re`)
- About Me (`pg-about`)
- Top Prospects (`pg-prospects`)

**Rule:** JARVIS disabled tabs ensure the app never feels like an AI tool. It feels like a smart analytics platform that has intelligence only where it matters — at the moment of decision.

---

### 19.4 The Percentile Engine — Core Computation

All JARVIS evaluation is **league-relative**. Raw stats are never used for scoring. The percentile engine converts every raw metric into a 1–99 percentile rank vs. the full MLB population for that season.

#### Canonical Metric Map — Hitters

```javascript
// jarvis/metrics.js
var METRICS_HITTER = {
  xwoba:   { higher: true  },  // Higher xwOBA = better
  xslg:    { higher: true  },  // Higher xSLG = better
  hardhit: { higher: true  },  // Higher Hard-Hit% = better
  barrel:  { higher: true  },  // Higher Barrel% = better
  bb:      { higher: true  },  // Higher BB% = better
  k:       { higher: false },  // Lower K% = better (inverted)
  chase:   { higher: false },  // Lower Chase% = better (inverted)
  whiff:   { higher: false },  // Lower Whiff% = better (inverted)
  ev:      { higher: true  },  // Higher Exit Velocity = better
  sprint:  { higher: true  }   // Higher Sprint Speed = better
};
```

#### Canonical Metric Map — Pitchers

```javascript
var METRICS_PITCHER = {
  stuff_plus:  { higher: true  },
  command_plus:{ higher: true  },
  era:         { higher: false },  // Lower ERA = better (inverted)
  fip:         { higher: false },
  whip:        { higher: false },
  k9:          { higher: true  },
  bb9:         { higher: false },
  xera:        { higher: false },
  hardhit_all: { higher: false },  // Lower hard-hit allowed = better
  barrel_all:  { higher: false }
};
```

#### Percentile Computation Function

```javascript
// jarvis/percentiles.js
function computePercentile(leagueArray, playerValue, higher) {
  if (playerValue === null || playerValue === undefined) return null;
  var clean = leagueArray.filter(function(x) {
    return x !== null && x !== undefined && !isNaN(x);
  }).sort(function(a, b) { return a - b; });

  if (clean.length < 25) return null; // Data quality guard — minimum sample required

  var idx = clean.findIndex(function(v) { return v >= playerValue; });
  if (idx < 0) idx = clean.length - 1;
  var pct = Math.round((idx / clean.length) * 100);

  if (!higher) pct = 100 - pct; // Invert for metrics where lower = better

  return Math.max(1, Math.min(99, pct)); // Clamp to 1–99
}
```

**Critical rule:** If `leagueArray.length < 25`, return `null` and do not estimate. This enforces the no-fabrication rule.

---

### 19.5 The KPI Engine — CAS / DQS / DPI / TPVI

These four KPIs are the core brain of JARVIS. They aggregate percentile scores into interpretable composite signals.

#### KPI Formulas

```javascript
// jarvis/kpis.js
function computeKPIs(p) {
  // p = object of computed percentiles keyed by metric name
  // Guard: all required inputs must be present
  var required = ['xwoba', 'hardhit', 'barrel', 'bb', 'k', 'chase', 'xslg', 'ev'];
  for (var i = 0; i < required.length; i++) {
    if (p[required[i]] === null || p[required[i]] === undefined) return null;
  }

  // CAS — Contact Ability Score
  // Measures quality of contact: how hard, how often barreled, and underlying expected output
  var CAS = (0.5 * p.xwoba) + (0.3 * p.hardhit) + (0.2 * p.barrel);

  // DQS — Discipline Quotient Score
  // Measures plate approach: walks, strikeout avoidance, chase discipline
  var DQS = (0.5 * p.bb) + (0.3 * (100 - p.k)) + (0.2 * (100 - p.chase));

  // DPI — Damage Potential Index
  // Measures power and damage ceiling: slugging output, barrel rate, raw exit velo
  var DPI = (0.6 * p.xslg) + (0.25 * p.barrel) + (0.15 * p.ev);

  // TPVI — Total Player Value Index
  // Composite of all three KPIs. WAR_pct is added when available.
  // If WAR_pct is unavailable, use equal-weight average and flag in "why"
  var TPVI = (CAS + DQS + DPI) / 3;

  return {
    CAS:  Math.round(CAS * 10) / 10,
    DQS:  Math.round(DQS * 10) / 10,
    DPI:  Math.round(DPI * 10) / 10,
    TPVI: Math.round(TPVI * 10) / 10
  };
}
```

#### KPI Interpretation Reference

| KPI | Score ≥ 80 | Score 60–79 | Score 40–59 | Score < 40 |
|-----|-----------|-------------|-------------|------------|
| CAS | Elite contact quality | Above average | Average | Below average |
| DQS | Exceptional discipline | Good approach | Average | Poor discipline |
| DPI | Power ceiling player | Above avg power | Average power | Limited damage |
| TPVI | Elite overall profile | Above avg profile | Average | Below replacement |

---

### 19.6 The Decision Scoring Engine

#### Decision Score Formula

The canonical formula from the system spec:

```
Decision Score = (0.35 × TPVI) + (0.25 × CAS) + (0.20 × DPI) + (0.20 × DQS)
```

This produces a 0–100 score that combines all four KPIs with the total value index weighted most heavily.

#### Trade Grade Scale

| Decision Score | Trade Grade | Label |
|---------------|-------------|-------|
| 90–100 | A | Elite acquisition target |
| 80–89 | B | Strong acquisition / priority bat |
| 70–79 | C | Solid — value depends on price/role |
| 60–69 | D | Role-dependent; proceed cautiously |
| Below 60 | F | Avoid or depth-only |

#### Risk Level Calculation

Risk is determined by two factors:

1. **Volatility spread:** `|DPI - DQS|` — large spread = high damage ceiling but poor discipline
2. **Discipline flags:** High K% percentile (≥75) or high Chase% percentile (≥75)

```javascript
function computeRiskLevel(percentiles, kpis) {
  var spread = Math.abs((kpis.DPI || 50) - (kpis.DQS || 50));
  var highK = (percentiles.k || 50) >= 75;      // Note: k is already inverted
  var highChase = (percentiles.chase || 50) >= 75; // chase is already inverted
  if (highK || highChase || spread >= 25) return 'High';
  if (spread >= 15) return 'Medium';
  return 'Low';
}
```

**Note:** Because K% and Chase% are stored as inverted percentiles (lower raw = higher percentile), a high stored percentile for these metrics actually means the player is _bad_ at them. The threshold check uses the raw stored percentile after inversion.

#### Confidence Score

Confidence reflects data completeness — how many of the required key percentiles were successfully computed vs. missing/null:

```javascript
function computeConfidence(percentiles) {
  var keys = ['xwoba', 'xslg', 'hardhit', 'barrel', 'bb', 'k', 'chase', 'ev'];
  var available = keys.filter(function(k) {
    return percentiles[k] !== null && percentiles[k] !== undefined;
  }).length;
  return Math.round((available / keys.length) * 100) / 100; // Returns 0.00–1.00
}
```

---

### 19.7 The Full JARVIS Builder Function

This function takes computed percentiles and KPIs and produces the complete JARVIS contract object:

```javascript
// jarvis/jarvis.js
function buildJarvis(percentiles, kpis, context) {
  context = context || 'player';
  var conf = computeConfidence(percentiles);

  // No fabrication: if KPIs couldn't be computed, return minimal safe output
  if (!kpis) {
    return {
      context: context,
      summary: 'Insufficient data to score (missing required percentiles).',
      strengths: [],
      risks: [],
      recommendation: '—',
      confidence: conf,
      decision_score: null,
      trade_grade: '—',
      risk_level: '—',
      why: [{ rule: 'No fabrication — missing inputs render —', evidence: [] }]
    };
  }

  // Canonical decision score
  var score = Math.round(
    (0.35 * kpis.TPVI) + (0.25 * kpis.CAS) + (0.20 * kpis.DPI) + (0.20 * kpis.DQS)
  );

  var grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';
  var risk = computeRiskLevel(percentiles, kpis);

  // Deterministic strengths — only fire when threshold is clearly met
  var strengths = [];
  if ((percentiles.xwoba || 0) >= 80) strengths.push('Elite run production profile (xwOBA)');
  if ((percentiles.barrel || 0) >= 80) strengths.push('High-end power — top-tier barrel rate');
  if ((percentiles.hardhit || 0) >= 75) strengths.push('Consistent hard contact quality');
  if ((percentiles.bb || 0) >= 70 && (percentiles.chase || 100) <= 40) strengths.push('Disciplined plate approach');
  if ((percentiles.ev || 0) >= 80) strengths.push('Elite exit velocity profile');
  if ((percentiles.sprint || 0) >= 80) strengths.push('Plus speed — baserunning asset');

  // Deterministic risks — only flag when threshold is clearly violated
  var risks = [];
  if ((percentiles.k || 100) <= 30) risks.push('Swing-and-miss volatility (K% concern)');
  if ((percentiles.chase || 100) <= 30) risks.push('Chase tendency — exploitable by breaking balls');
  if (risk === 'High') risks.push('Volatile profile — large DPI vs DQS spread');
  if ((percentiles.barrel || 0) <= 25) risks.push('Below-average power ceiling (barrel rate)');

  // Recommendation — direct and actionable
  var recommendation =
    score >= 85 ? 'Strong acquisition target — priority in lineup vs RHP' :
    score >= 75 ? 'Target depending on price and deployment role' :
    score >= 65 ? 'Role and fit dependent — proceed with moderate caution' :
    'Avoid as primary contributor; depth-only consideration';

  var summary =
    score >= 85 ? 'High-impact profile with elite underlying indicators.' :
    score >= 75 ? 'Above-average profile with clear strengths and manageable risk.' :
    score >= 65 ? 'Mid-tier profile; value depends heavily on cost and usage.' :
    'Limited impact profile — risks outweigh evident upside.';

  return {
    context: context,
    summary: summary,
    strengths: strengths.slice(0, 4),
    risks: risks.slice(0, 4),
    recommendation: recommendation,
    confidence: conf,
    decision_score: score,
    trade_grade: grade,
    risk_level: risk,
    why: [
      { rule: 'All evaluation is league-relative (percentiles vs MLB population).', evidence: [] },
      { rule: 'KPIs computed: CAS (contact ability), DQS (discipline), DPI (damage), TPVI (composite).', evidence: [] },
      { rule: 'Decision score formula: 0.35×TPVI + 0.25×CAS + 0.20×DPI + 0.20×DQS.', evidence: [] }
    ]
  };
}
```

---

### 19.8 Backend Database Schema — Player Metrics Table

For the percentile engine to function, player metrics must be stored in a queryable table. Recommended schema:

```sql
-- player_season_metrics table
CREATE TABLE player_season_metrics (
  player_id     INTEGER NOT NULL,
  season        INTEGER NOT NULL,
  player_name   TEXT,
  position_code TEXT,        -- '1' = pitcher, other = hitter
  xwoba         NUMERIC,     -- Expected wOBA
  xslg          NUMERIC,     -- Expected SLG
  hardhit       NUMERIC,     -- Hard-Hit% (0–1 decimal)
  barrel        NUMERIC,     -- Barrel% (0–1 decimal)
  bb            NUMERIC,     -- BB% (0–1 decimal)
  k             NUMERIC,     -- K% (0–1 decimal)
  chase         NUMERIC,     -- Chase% (0–1 decimal)
  whiff         NUMERIC,     -- Whiff% (0–1 decimal)
  ev            NUMERIC,     -- Average Exit Velocity (mph)
  sprint        NUMERIC,     -- Sprint Speed (ft/sec)
  -- Pitcher-specific
  stuff_plus    NUMERIC,
  command_plus  NUMERIC,
  era           NUMERIC,
  fip           NUMERIC,
  whip          NUMERIC,
  k9            NUMERIC,
  bb9           NUMERIC,
  PRIMARY KEY (player_id, season)
);

-- For fast percentile computation: index by season and position
CREATE INDEX idx_psm_season ON player_season_metrics(season);
CREATE INDEX idx_psm_position ON player_season_metrics(season, position_code);
```

#### Loading League Arrays for Percentile Computation

```javascript
// Load all hitter metrics for a season to build league arrays
async function loadLeagueArrays(season, pool) {
  var result = await pool.query(
    `SELECT xwoba, xslg, hardhit, barrel, bb, k, chase, whiff, ev, sprint
     FROM player_season_metrics
     WHERE season = $1 AND position_code != '1'`, // Exclude pitchers from hitter arrays
    [season]
  );
  var league = {};
  Object.keys(METRICS_HITTER).forEach(function(key) {
    league[key] = result.rows
      .map(function(r) { return r[key]; })
      .filter(function(v) { return v !== null && v !== undefined; });
  });
  return league;
}
```

---

### 19.9 Security, Privacy & API Key Rules

The existing proxy architecture enforces the correct security model. These rules must never be violated:

**Rule 1 — No API keys in the browser.** All secrets live server-side only. The existing `api/mlb.js` and `api/savant.js` proxies enforce this correctly. The new `api/jarvis.js` follows the same pattern.

**Rule 2 — All external calls go through `/api/*`.** The browser never calls `statsapi.mlb.com` or `baseballsavant.mlb.com` directly. JARVIS follows the same rule — frontend calls `/api/jarvis`, which handles all downstream computation.

**Rule 3 — No fabrication.** If data is missing, JARVIS returns `decision_score: null` and `confidence: 0.0`. It never invents numbers. A low-confidence JARVIS output is explicitly correct behavior, not a bug.

---

### 19.10 Integration Checklist for AI Agents

When implementing JARVIS, follow this checklist in order:

| Step | Action | File |
|------|--------|------|
| 1 | Add `jarvis-dock` HTML near end of `<body>` | `public/index.html` |
| 2 | Add all JARVIS JavaScript functions to `<script>` block | `public/index.html` |
| 3 | Wire `handleJarvisVisibility()` into existing tab click handler | `public/index.html` |
| 4 | Add `jarvisCall()` trigger inside `loadPlayerProfile()` | `public/index.html` |
| 5 | Add `jarvisCall()` trigger inside `renderPlayerCompare()` | `public/index.html` |
| 6 | Create `api/jarvis.js` serverless endpoint | `api/jarvis.js` |
| 7 | Add JARVIS route to `vercel.json` | `vercel.json` |
| 8 | Create `player_season_metrics` table in database | Database |
| 9 | Populate table with Savant data via pipeline | Backend pipeline |
| 10 | Wire percentile + KPI + decision engine in `api/jarvis.js` | `api/jarvis.js` |
| 11 | Test with multiple player profiles — verify chip appears, score is real | Live URL |
| 12 | Verify JARVIS dock is hidden on non-decision tabs | Live URL |

🚨 **Never activate JARVIS with fabricated numbers.** Use the scaffold stub response (Section 18.5) until the real percentile engine is wired. A low-confidence output with real data is infinitely better than a confident output with fake data.

---

**MLB Analytics Dashboard • Baseball Intelligence Terminal V4 • Luke Rumpler • 2026 Season**

Live: https://mlb-dashboard-smoky.vercel.app

Project Root: `/Volumes/Luke's Hard Drive/Baseball/Baseball Dashboards/luke-mlb-dashboard`
