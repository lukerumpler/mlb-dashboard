# MLB Intelligence Platform: ULTIMATE Master System Instructions & Technical Architecture

## PART I: PLATFORM IDENTITY & STRATEGIC MISSION

### 1.1 The "Bloomberg Terminal for Baseball"
The MLB Intelligence Platform is an elite-level, enterprise-grade decision-support system. It is designed to be the **"Baseball Cognition Engine"** for professional front offices. It must transcend the look and feel of consumer sports apps, instead mimicking the high-density, high-stakes environment of a quantitative trading floor or a military intelligence command center.

### 1.2 Core Objectives
1.  **Augment Decision-Making:** Every feature must help a GM, Scout, or Analyst make a better, faster decision.
2.  **Quantitative Rigor:** All data must be grounded in advanced statistical theory (Statcast, Stuff+, xwOBA).
3.  **Holistic Evaluation:** Seamlessly blend qualitative "Scout Notes" with quantitative "Analytics."
4.  **Predictive Insight:** Prioritize forward-looking projections over historical reporting.

---

## PART II: VISUAL & AESTHETIC ARCHITECTURE

### 2.1 The "Command Center" Aesthetic
*   **Theme:** Deep Dark Mode. Use a radial gradient background to create depth.
*   **Grid System:** Use a 28px grid overlay (subtle) to reinforce the "tactical" feel.
*   **Density:** High information density is a feature, not a bug. Use condensed fonts to pack data without clutter.

### 2.2 Semantic Color System (Strict Adherence)
Colors must carry immediate meaning. Do not use them for decoration.

| Color | Hex Code | Semantic Meaning |
| :--- | :--- | :--- |
| **Elite/Critical** | `#e85a5a` (Red) | 90th+ Percentile, High Injury Risk, Urgent Alert. |
| **Above Average** | `#e8722a` (Orange) | 70th-89th Percentile, Active Selection, Focus Area. |
| **Average/Neutral**| `#a0b4cc` (Gray) | 40th-69th Percentile, Secondary Info, Baseline. |
| **Below Average** | `#5ab4f5` (Blue) | 10th-39th Percentile, Cold Streak, Weakness. |
| **Value/Positive** | `#4dce8a` (Green) | Surplus Value, Positive Trend, Acquisition Target. |

### 2.3 Typography Standards
*   **Headers:** `Bebas Neue` (Uppercase, tracked out 2-3px).
*   **Data Labels:** `Barlow Condensed` (Bold, 10-12px).
*   **Numerical Data:** `Bebas Neue` or `Barlow Condensed` (Right-aligned).
*   **Body Text:** `Barlow` (Regular, 13-14px).

---

## PART III: FUNCTIONAL MODULES (THE 12 TABS)

### 3.1 Dashboard (`#pg-dash`)
The "At-a-Glance" organizational health check.
*   **Key Components:** Playoff Odds (with confidence intervals), Organizational Health Index (OHI), Roster Value (WAR vs. Dollars), and the "Daily Intelligence Briefing."

### 3.2 Personnel (`#pg-personnel`)
The roster management hub.
*   **Key Components:** Interactive Depth Charts (MLB to Low-A), Service Time Tracker, Option Year Management, and the "Platoon Optimization Tool."

### 3.3 Analysis (`#pg-analysis`)
The quantitative research lab.
*   **Key Components:** Player Valuation Models, Trade Simulator (Surplus Value calculation), and the "Hidden Value Finder" (identifying players with high xwOBA but low results).

### 3.4 Player Profile (`#pg-profile`)
The 360-degree dossier.
*   **Key Components:** Statcast Percentile "Slinky" Charts, 20-80 Scouting Grades, Pitch Movement/Tunneling Visuals, and Biomechanical Force Plate data.

### 3.5 Top Prospects (`#pg-prospects`)
The future value tracker.
*   **Key Components:** ETA Projections (Probabilistic), Risk Assessment Scores, and "Player Comparables" (finding historical matches for current prospects).

### 3.6 Scout Notes (`#pg-scout`)
The qualitative intelligence center.
*   **Key Components:** Narrative scouting reports, "Makeup" indicators, and video-linked observations.

### 3.7 Reports (`#pg-reports`)
The executive briefing tool.
*   **Key Components:** Automated PDF generation, "GM Summary" templates, and custom data exports.

### 3.8 Strategy (`#pg-strategy`)
The tactical planning room.
*   **Key Components:** Advance Scouting (Opponent vulnerabilities), Bullpen Usage Optimization, and Defensive Shift Heatmaps.

### 3.9 Analytics (`#pg-analytics`)
The R&D deep-dive.
*   **Key Components:** Raw Statcast Query Engine, Custom Model Builder, and League-wide Trend Analysis.

### 3.10 Schedule, 3.11 Settings, 3.12 About Me
Operational overhead and user-specific configuration.

---

## PART IV: TECHNICAL CODE RECOMMENDATIONS

### 4.1 CSS Architecture (The "Tactical" Framework)
Use CSS Variables for the semantic color system to allow for dynamic team-theming.

```css
:root {
  /* Semantic Colors */
  --color-elite: #e85a5a;
  --color-above: #e8722a;
  --color-neutral: #a0b4cc;
  --color-below: #5ab4f5;
  --color-value: #4dce8a;
  
  /* Backgrounds */
  --bg-navy: #07102d;
  --bg-panel: rgba(7, 16, 45, 0.88);
  --border-subtle: rgba(255, 255, 255, 0.08);
}

/* The "Bloomberg" Panel Style */
.panel {
  background: var(--bg-panel);
  border: 1px solid var(--border-subtle);
  border-radius: 18px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  padding: 20px;
}

/* Percentile Bar Implementation */
.pct-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.pct-fill {
  height: 100%;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Semantic Classes for Data */
.val-elite { color: var(--color-elite); }
.val-above { color: var(--color-above); }
.val-below { color: var(--color-below); }
```

### 4.2 JavaScript Module Pattern
Avoid global scope. Use a modular approach to handle the 12 different tabs.

```javascript
const MLBDashboard = {
  state: {
    activeTab: 'dash',
    selectedTeam: 'NYY',
    selectedPlayer: null
  },

  init() {
    this.bindEvents();
    this.loadTab('dash');
  },

  bindEvents() {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => this.handleTabClick(e));
    });
  },

  async loadPlayerProfile(playerId) {
    // 1. Show Loading State
    // 2. Fetch Data from API
    // 3. Render Statcast Percentiles
    // 4. Render Scouting Grades
    // 5. Render Pitch Arsenal (if pitcher)
  },

  renderPercentileBar(value) {
    let color = '--color-neutral';
    if (value >= 90) color = '--color-elite';
    else if (value >= 70) color = '--color-above';
    else if (value <= 30) color = '--color-below';
    
    return `
      <div class="pct-bar">
        <div class="pct-fill" style="width: ${value}%; background: var(${color})"></div>
      </div>
    `;
  }
};
```

### 4.3 HTML Structure (Semantic & Accessible)
Use data attributes for state management and semantic tags for data tables.

```html
<!-- Main Navigation -->
<nav class="tabs-wrap">
  <div class="tabs">
    <button class="tab on" data-tab="dash">Dashboard</button>
    <button class="tab" data-tab="personnel">Personnel</button>
    <button class="tab" data-tab="profile">Player Profile</button>
    <!-- ... other tabs ... -->
  </div>
</nav>

<!-- Data Table Standard -->
<table class="intel-table">
  <thead>
    <tr>
      <th>Player</th>
      <th class="num">wRC+</th>
      <th class="num">xwOBA</th>
      <th class="num">WAR</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Aaron Judge</td>
      <td class="num val-elite">210</td>
      <td class="num val-elite">.450</td>
      <td class="num val-value">8.2</td>
    </tr>
  </tbody>
</table>
```

---

## PART V: DATA INTELLIGENCE DICTIONARY

### 5.1 Hitting Intelligence
*   **xwOBA (Expected Weighted On-Base Average):** The gold standard for contact quality.
*   **Bat Speed:** Measured in MPH. Elite is 75+.
*   **Squared-Up%:** How much of the maximum possible exit velocity was achieved.
*   **Swing Decision Score:** Quantifying the "Take" vs "Swing" value.

### 5.2 Pitching Intelligence
*   **Stuff+:** Physical characteristics of the pitch (Velocity, Break, Release).
*   **Location+:** Command and precision.
*   **VAA (Vertical Approach Angle):** How "flat" the pitch enters the zone. Flat fastballs at the top of the zone are elite.
*   **IVB (Induced Vertical Break):** The "rise" on a four-seam fastball.

---

## PART VI: RESPONSE ARCHITECTURE FOR AI

When an AI (like Claude) is asked to generate content or code for this platform, it must:
1.  **Never use Emojis.** It is unprofessional for this context.
2.  **Use Markdown Tables.** For all data comparisons.
3.  **Explain the "Why".** Don't just give a stat; explain its strategic significance (e.g., "A high IVB suggests this pitcher should attack the top of the strike zone").
4.  **Think in Distributions.** Use terms like "Probabilistic Outcome," "Variance," and "Confidence Interval."
5.  **Prioritize Action.** Every response should end with a "Recommended Action" or "Strategic Insight."

---
**FINAL MANDATE:** This platform is the bridge between raw data and championship-winning decisions. Every line of code and every pixel must serve that bridge.
