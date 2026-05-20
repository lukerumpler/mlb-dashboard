# MLB Analytics Dashboard — Project TODO

## Phase 1: Core Setup & Theme System
- [ ] Configure Fire & Ice theme colors and CSS variables
- [ ] Set up Bebas Neue and Barlow Condensed fonts
- [ ] Implement terminal grid overlay background
- [ ] Create TEAMS array with all 30 MLB teams and correct colors
- [ ] Fix SF Giants colors (#FD5A1E primary, #27251F secondary)
- [ ] Implement updateThemeColors() function for dynamic team color switching
- [ ] Create 7-tab navigation structure (Dashboard, Personnel, Analysis, Player Profile, Top Prospects, Scout Notes, About Me)
- [ ] Set up tab routing and lazy-loading logic

## Phase 2: Dashboard Tab
- [ ] Division Standings table with team records and GB
- [ ] Win Projection Chart (Canvas-based) with division/WC/projection targets
- [ ] Offense stats panel (AVG, OBP, SLG, OPS, etc.)
- [ ] Pitching stats panel (ERA, WHIP, K/9, BB/9, etc.)
- [ ] Implement /api/mlb proxy calls for all data
- [ ] Add sessionStorage caching for performance

## Phase 3: Personnel Tab
- [ ] Projected Lineup display with batting order
- [ ] Pitching Staff roster list
- [ ] Active Roster with jersey numbers and positions
- [ ] Injured List (IL) with status badges (10-day, 15-day, 60-day)
- [ ] Hot/Cold Hitters section with performance splits
- [ ] Starting Pitching stats table (G, GS, W, L, ERA, WHIP, K/9, BB/9, IP)
- [ ] Lazy-load Personnel data on tab click

## Phase 4: Analysis Tab
- [ ] Three-column layout (Hitting Leaders | Center Stats | Pitching Leaders)
- [ ] Hitting Leaders with pill stat selectors (Home Runs, RBIs, AVG, OBP, SLG, OPS, etc.)
- [ ] Center stats box (OPS, wRC+, WAR, ERA)
- [ ] Pitching Leaders with pill stat selectors (ERA, WHIP, K/9, Wins, Strikeouts, etc.)
- [ ] Dynamic stat loading based on selected pill
- [ ] Leader cards with rank, headshot, name, and stat value

## Phase 5: Player Profile Tab
- [ ] Player search input with autocomplete from team roster
- [ ] Savant-style hero banner with player name, position, team, age, height, weight
- [ ] Percentile bars for key metrics (xwOBA, xBA, xSLG, EV, Hard-Hit%, Barrel%, etc.)
- [ ] Splits table (vs LHP, vs RHP, Home, Away, RISP, Bases Empty)
- [ ] Career stats table (Year, G, PA, AB, R, H, 2B, 3B, HR, RBI, BB, SO, SB, AVG, OBP, SLG, OPS)
- [ ] Scouting grades display (Hit, Power, Speed, Field, Arm, Overall FV)
- [ ] JARVIS chip display (placeholder for scoring engine)

## Phase 6: JARVIS Scoring Engine
- [ ] Implement percentile computation function (league-relative, handles metric direction)
- [ ] Create KPI formulas: CAS (Contact Ability Score), DQS (Discipline Quotient Score), DPI (Damage Potential Index), TPVI (Total Player Value Index)
- [ ] Implement Decision Score formula: (0.35 × TPVI) + (0.25 × CAS) + (0.20 × DPI) + (0.20 × DQS)
- [ ] Implement Trade Grade scale (A, B, C, D, F based on Decision Score)
- [ ] Implement Risk Level calculation (High, Medium, Low)
- [ ] Implement Confidence Score (0.0–1.0 based on data completeness)
- [ ] Build JARVIS contract object with summary, strengths, risks, recommendation
- [ ] Create collapsible JARVIS chip UI with progressive disclosure
- [ ] Enforce no-fabrication rule (return null for missing data, never estimate)

## Phase 7: Top Prospects & Scout Notes & About Me
- [ ] Top Prospects tab: Baseball America-style prospect cards with rank, FV grade, position, level, stats
- [ ] Scout Notes tab: Add note form with player name, tag selector, and text input
- [ ] Scout Notes: Display saved notes in reverse chronological order with tags
- [ ] Scout Notes: Implement delete functionality
- [ ] Scout Notes: Persist to localStorage with key 'mlb_scout_notes'
- [ ] Scout Notes: Tag colors for Watch (blue), Target (orange), Buy (green), Sell (red), Hold (gray)
- [ ] About Me tab: Display Luke Rumpler bio card
- [ ] About Me tab: Password-protected developer mode for editing quotes
- [ ] About Me tab: Quotes display with attribution
- [ ] About Me tab: Persist quotes to localStorage with key 'mlb_saved_quotes'

## Phase 8: Testing & Refinement
- [ ] Test all tab navigation and lazy-loading
- [ ] Test team selector and dynamic color switching
- [ ] Test all API calls and proxy routing
- [ ] Test sessionStorage caching
- [ ] Test JARVIS scoring with sample players
- [ ] Test localStorage persistence for notes and quotes
- [ ] Test responsive design on mobile/tablet
- [ ] Fix any UI/UX issues and polish animations
- [ ] Verify no fabricated data in JARVIS engine
- [ ] Final QA and delivery

## Completed Features
(None yet)
