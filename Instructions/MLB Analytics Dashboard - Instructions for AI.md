# MLB Analytics Dashboard - V4 Upgrade Instructions for Claude

## Overview

This document provides comprehensive, step-by-step instructions for upgrading the `index.html` file of the MLB Analytics Dashboard to Version 4. The goal is to integrate new features and enhance existing ones, maintaining the dashboard's core identity as a "Bloomberg Terminal for baseball" – a professional-grade intelligence terminal for scouts, analysts, and player development staff. All modifications must adhere to the established design philosophy, technical architecture, and color-coded intelligence system outlined in the original `MLBDashboardInstructions.md` [1].

**Key updates include:**
1.  **Season Selector:** Dynamic dropdown for season toggling (2024, 2025, 2026).
2.  **"About Me" Tab Enhancements:** Bio Card, Quotes Panel with `localStorage` persistence, and a password-protected Developer Mode.
3.  **"Top Prospects" Tab:** New section with scouting cards, FV grades, and summaries.
4.  **"Headlines" Update:** Replacement of static news with a curated X (Twitter) Intelligence Grid.
5.  **Enhanced "Player Profile" Tab:** Integration of scouting grades, contract value conversion, and a detailed layout inspired by the provided `PlayerProfileExample.pdf` [2].

## General Instructions for Claude

*   **Design Philosophy:** Prioritize the "Bloomberg Terminal" aesthetic. Information should be dense but controlled, with color conveying meaning, not just decoration [1].
*   **Technical Architecture:** All MLB Stats API calls *must* be routed through the Vercel serverless proxy (`/api/mlb?path=...`) to bypass CORS blocks. Direct calls to `statsapi.mlb.com` will fail [1].
*   **Caching:** Implement in-browser `sessionStorage` caching for API responses to prevent redundant calls and improve performance. Cache keys should follow the pattern `mlb_cache_{teamId}_{endpoint}_{season}`. Invalidate cache when team or season changes [1].
*   **Backup:** Before making *any* edits, create a backup of `public/index.html` using the command: `cp public/index.html "public/backups/index_$(date +%s).backup"` [1].
*   **File Location:** All UI changes are to be made in `public/index.html` [1].

## Detailed Upgrade Tasks

### 1. Season Selector Implementation

**Objective:** Add a dynamic dropdown in the header to select seasons (2024, 2025, 2026). Upon selection, the dashboard must refresh data and clear relevant caches.

**Steps:**

1.  **Locate Header:** Identify the `<div class="hdr-inner">` section in `index.html` (around line 23 in the provided `index(16).html`).
2.  **Add Season Dropdown HTML:** Insert the following HTML structure for the season selector, preferably near the existing team selector (`select.tpick` with `id="tsel"`):

    ```html
    <div class="hdr-right">
      <!-- Existing elements like refresh button, support link -->
      <select class="tpick" id="season-selector" onchange="changeSeason(this.value)">
        <option value="2026">2026 Season</option>
        <option value="2025">2025 Season</option>
        <option value="2024">2024 Season</option>
      </select>
      <!-- Existing team selector -->
      <select class="tpick" id="tsel" onchange="loadTeam(this.value)"></select>
      <button class="refresh-btn" onclick="refreshCurrent()">↻ Refresh</button>
      <!-- ... other elements ... -->
    </div>
    ```

3.  **Update `season-label`:** The existing `season-label` (around line 24) should be dynamically updated based on the selected season. Ensure its content reflects the chosen year.
4.  **JavaScript `changeSeason` Function:** Create a new JavaScript function `changeSeason(newSeason)`:

    *   Update a global `SEASON` variable (if not already present, define `var SEASON = 2026;` at the top of your script).
    *   Clear relevant caches: `leadersCache = {};`, `rosterCache = {};`, `allTeamRankings = null;`.
    *   Call `loadTeam(curTeam)` to refresh data for the currently selected team with the new season.

    ```javascript
    var SEASON = 2026; // Initialize global season variable
    // ... other global variables ...

    function changeSeason(newSeason) {
      SEASON = parseInt(newSeason);
      document.getElementById("season-label").textContent = SEASON + " Season";
      // Clear caches when season changes
      leadersCache = {};
      rosterCache = {};
      allTeamRankings = null;
      // Assuming curTeam holds the currently selected team ID
      if (curTeam) loadTeam(curTeam);
      // Also refresh other season-dependent data if not covered by loadTeam
      // e.g., loadHRAnalytics(); if the HR tab is active
    }

    // Modify existing refreshCurrent to also clear season-specific caches
    function refreshCurrent(){
      allTeamRankings=null;
      leadersCache={};
      // Add other caches that need clearing on refresh
      // hrDataCache = {}; // Example for HR Analytics
      if(curTeam) loadTeam(curTeam);
    }
    ```

5.  **Initial Season Load:** Ensure the `season-selector` is initialized with the current `SEASON` value on page load.

### 2. "About Me" Tab Enhancements

**Objective:** Create a professional bio card, a quotes panel with `localStorage` persistence, and a password-protected developer edit mode within the `pg-about` tab.

**Steps:**

1.  **Locate `pg-about` Tab:** Find the `<div class="pg" id="pg-about">` section (around line 1380 in `index(16).html`).
2.  **Bio Card (Existing):** The bio card structure is largely in place. Ensure it contains the professional profile for Luke Rumpler (Arizona State University). No major structural changes are needed here, but verify content accuracy.
3.  **Quotes Panel HTML:** Add the following HTML structure for the "Sayings & Quotes" panel next to the bio card, within the `pg-about` grid:

    ```html
    <div class="panel">
      <div class="panel-title">SAYINGS & QUOTES
        <button id="dev-mode-toggle" class="refresh-btn" style="font-size:10px;padding:4px 8px;">DEV MODE</button>
      </div>
      <div id="quotes-list" style="min-height:150px;"></div>
      <div id="dev-mode-controls" style="display:none;margin-top:15px;border-top:1px solid rgba(255,255,255,.07);padding-top:15px;">
        <textarea id="new-quote-text" placeholder="Add a new quote..." style="width:100%;min-height:60px;background:var(--navy-mid);border:1px solid var(--navy-border);color:#fff;padding:8px;border-radius:6px;font-family:Barlow,sans-serif;font-size:12px;"></textarea>
        <button id="add-quote-btn" class="refresh-btn" style="margin-top:8px;">Add Quote</button>
        <button id="delete-all-quotes-btn" class="refresh-btn" style="margin-top:8px;background:var(--red);border-color:var(--red);">Delete All</button>
      </div>
    </div>
    ```

4.  **JavaScript for Quotes Panel:** Implement the following JavaScript logic:

    *   **`quotes` Array:** Initialize an array to store quotes, e.g., `var quotes = [];`.
    *   **`loadQuotes()`:** Function to load quotes from `localStorage` (key: `mlb_dashboard_quotes`). If no quotes are found, initialize with some default sayings.
    *   **`saveQuotes()`:** Function to save the current `quotes` array to `localStorage`.
    *   **`renderQuotes()`:** Function to display quotes in the `quotes-list` div. Each quote should have a delete button (visible only in dev mode).
    *   **`addQuote()`:** Function to add a new quote from `new-quote-text` textarea, then call `saveQuotes()` and `renderQuotes()`.
    *   **`deleteQuote(index)`:** Function to remove a quote by index, then call `saveQuotes()` and `renderQuotes()`.
    *   **`deleteAllQuotes()`:** Function to clear all quotes, then call `saveQuotes()` and `renderQuotes()`.
    *   **Developer Mode Toggle:**
        *   Attach an event listener to `dev-mode-toggle`.
        *   When clicked, prompt for a password (`scout`).
        *   If correct, toggle the visibility of `dev-mode-controls` and add/remove a class (e.g., `dev-mode-active`) to `quotes-list` to show/hide delete buttons on individual quotes.
        *   Store developer mode status in `sessionStorage` (e.g., `isDevModeActive`).

    ```javascript
    // Global variables for About Me tab
    var quotes = [];
    var isDevModeActive = sessionStorage.getItem("isDevModeActive") === "true";

    function loadQuotes() {
      var storedQuotes = localStorage.getItem("mlb_dashboard_quotes");
      if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
      } else {
        quotes = [
          "'The only way to prove you're a good sport is to lose.' - Ernie Banks",
          "'Baseball is 90% mental. The other half is physical.' - Yogi Berra",
          "'Every strike brings me closer to the next home run.' - Babe Ruth"
        ];
        saveQuotes();
      }
      renderQuotes();
    }

    function saveQuotes() {
      localStorage.setItem("mlb_dashboard_quotes", JSON.stringify(quotes));
    }

    function renderQuotes() {
      var quotesListDiv = document.getElementById("quotes-list");
      quotesListDiv.innerHTML = "";
      quotes.forEach(function(quote, index) {
        var quoteDiv = document.createElement("div");
        quoteDiv.className = "quote-item";
        quoteDiv.style = "padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05);font-style:italic;font-size:13px;color:var(--text-dim);display:flex;justify-content:space-between;align-items:center;";
        quoteDiv.innerHTML = `<span>"${quote}"</span>`;
        if (isDevModeActive) {
          var deleteBtn = document.createElement("button");
          deleteBtn.textContent = "x";
          deleteBtn.style = "background:none;border:none;color:var(--red);font-size:16px;cursor:pointer;margin-left:10px;";
          deleteBtn.onclick = function() { deleteQuote(index); };
          quoteDiv.appendChild(deleteBtn);
        }
        quotesListDiv.appendChild(quoteDiv);
      });
      if (quotes.length === 0) {
        quotesListDiv.innerHTML = "<div style=\"text-align:center;padding:20px;color:var(--text-dim);font-style:italic;\">No quotes yet.</div>";
      }
    }

    function addQuote() {
      var newQuoteTextarea = document.getElementById("new-quote-text");
      var newQuote = newQuoteTextarea.value.trim();
      if (newQuote) {
        quotes.push(newQuote);
        saveQuotes();
        renderQuotes();
        newQuoteTextarea.value = "";
      }
    }

    function deleteQuote(index) {
      quotes.splice(index, 1);
      saveQuotes();
      renderQuotes();
    }

    function deleteAllQuotes() {
      if (confirm("Are you sure you want to delete all quotes?")) {
        quotes = [];
        saveQuotes();
        renderQuotes();
      }
    }

    document.addEventListener("DOMContentLoaded", function() {
      loadQuotes();

      var devModeToggle = document.getElementById("dev-mode-toggle");
      var devModeControls = document.getElementById("dev-mode-controls");
      var addQuoteBtn = document.getElementById("add-quote-btn");
      var deleteAllQuotesBtn = document.getElementById("delete-all-quotes-btn");

      if (isDevModeActive) {
        devModeControls.style.display = "block";
      }

      devModeToggle.onclick = function() {
        var password = prompt("Enter password for Developer Mode:");
        if (password === "scout") {
          isDevModeActive = !isDevModeActive;
          sessionStorage.setItem("isDevModeActive", isDevModeActive);
          devModeControls.style.display = isDevModeActive ? "block" : "none";
          renderQuotes(); // Re-render to show/hide delete buttons
        } else if (password !== null) {
          alert("Incorrect password.");
        }
      };

      addQuoteBtn.onclick = addQuote;
      deleteAllQuotesBtn.onclick = deleteAllQuotes;
    });
    ```

### 3. "Top Prospects" Tab

**Objective:** Create a new tab (`pg-prospects`) to display scouting cards for elite talent, including FV grades and scouting summaries.

**Steps:**

1.  **Locate `pg-prospects` Tab:** The HTML structure for `pg-prospects` is already present (around line 1369 in `index(16).html`).
2.  **Prospect Card HTML Structure:** Define a reusable HTML structure for a prospect card. This should include:

    *   Prospect Name, Team, Position
    *   FV (Future Value) Grade (e.g., `grade-60` class for styling)
    *   Scouting Summary (a paragraph of text)
    *   Example:

    ```html
    <div class="prospect-card panel">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
        <div class="grade-badge grade-70">70</div>
        <div>
          <div style="font-family:Bebas Neue,sans-serif;font-size:22px;letter-spacing:2px;">JACKSON HOLLIDAY</div>
          <div style="font-size:11px;color:var(--text-dim);font-family:Barlow Condensed,sans-serif;letter-spacing:1px;">BAL - SS</div>
        </div>
      </div>
      <p style="font-size:13px;line-height:1.5;color:#fff;">Holliday possesses an advanced hit tool with elite plate discipline and burgeoning power. He projects as a future perennial All-Star shortstop with a high OBP and 20+ home run potential. Excellent baseball IQ and leadership qualities.</p>
      <!-- Add more details like ETA, tools grades if desired -->
    </div>
    ```

3.  **JavaScript for `loadProspects()`:**

    *   Create a `loadProspects()` function that fetches prospect data (initially, this can be hardcoded JSON or fetched from a local JSON file if available).
    *   Iterate through the prospect data and dynamically generate the HTML for each prospect card.
    *   Append these cards to the `prospects-list` div.
    *   Ensure the `loading` message is replaced with actual content.

    ```javascript
    function loadProspects() {
      var prospectsListDiv = document.getElementById("prospects-list");
      prospectsListDiv.innerHTML = "<div class=\"loading\">Loading prospect data...</div>"; // Show loading

      // Example hardcoded data. In a real scenario, this would be an API call.
      var prospectData = [
        { name: "Jackson Holliday", team: "BAL", pos: "SS", fv: 70, summary: "Holliday possesses an advanced hit tool with elite plate discipline and burgeoning power. He projects as a future perennial All-Star shortstop with a high OBP and 20+ home run potential. Excellent baseball IQ and leadership qualities." },
        { name: "Paul Skenes", team: "PIT", pos: "RHP", fv: 65, summary: "Skenes features a dominant fastball that sits in the upper-90s, touching 100 mph, complemented by a wipeout slider and developing changeup. He has front-line starter potential with excellent command and a competitive mound presence." },
        { name: "Ethan Salas", team: "SDP", pos: "C", fv: 60, summary: "Salas is an exceptionally advanced catching prospect for his age, showcasing plus defensive skills, a strong arm, and a smooth left-handed swing with developing power. He has the potential to be an impact two-way catcher." }
      ];

      setTimeout(function() { // Simulate API delay
        prospectsListDiv.innerHTML = ""; // Clear loading
        prospectData.forEach(function(prospect) {
          var cardHtml = `
            <div class="prospect-card panel">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
                <div class="grade-badge grade-${prospect.fv}">${prospect.fv}</div>
                <div>
                  <div style="font-family:Bebas Neue,sans-serif;font-size:22px;letter-spacing:2px;">${prospect.name}</div>
                  <div style="font-size:11px;color:var(--text-dim);font-family:Barlow Condensed,sans-serif;letter-spacing:1px;">${prospect.team} - ${prospect.pos}</div>
                </div>
              </div>
              <p style="font-size:13px;line-height:1.5;color:#fff;">${prospect.summary}</p>
            </div>
          `;
          prospectsListDiv.insertAdjacentHTML("beforeend", cardHtml);
        });
      }, 500);
    }

    // Call loadProspects when the prospects tab is activated
    // This will require modifying the tab switching logic to call loadProspects() when 'pg-prospects' is selected.
    ```

4.  **CSS for Prospect Cards:** Add basic styling for `.prospect-card` and ensure `grade-badge` classes are correctly applied (these are already defined in `index(16).html` around line 133).

### 4. "Headlines" Update (X (Twitter) Intelligence Grid)

**Objective:** Replace the static news content in the `pg-hs` tab with a curated X (Twitter) Intelligence Grid, linking to major scouts and insiders.

**Steps:**

1.  **Locate `pg-hs` Tab:** Find the `<div class="pg" id="pg-hs">` section (around line 463 in `index(16).html`).
2.  **Replace Content:** Remove the existing static news content within `pg-hs`. The `Division Standings` panel can remain if desired, but the news section should be replaced.
3.  **Twitter Grid HTML Structure:** Implement a grid layout for Twitter links. Since direct embedding of live Twitter feeds can be complex and require API keys, a simpler approach of providing direct links to profiles or curated searches is recommended.

    ```html
    <div class="pg" id="pg-hs">
      <div style="display:grid;grid-template-columns:1fr 1.5fr;gap:20px">
        <div>
          <div class="sec-title">Division Standings</div>
          <div class="panel" id="hs-stand" style="padding:14px"><div class="loading">Loading standings...</div></div>
        </div>
        <div>
          <div class="sec-title">X INTELLIGENCE GRID</div>
          <div class="panel" style="padding:14px;">
            <div class="twitter-grid" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:10px;">
              <a href="https://twitter.com/MLBPipeline" target="_blank" class="twitter-link">
                <img src="https://pbs.twimg.com/profile_images/1496670860/mlbp_400x400.png" alt="MLB Pipeline" style="width:30px;height:30px;border-radius:50%;vertical-align:middle;margin-right:8px;">
                MLB Pipeline
              </a>
              <a href="https://twitter.com/PitchingNinja" target="_blank" class="twitter-link">
                <img src="https://pbs.twimg.com/profile_images/1516709240/PN_logo_400x400.jpg" alt="PitchingNinja" style="width:30px;height:30px;border-radius:50%;vertical-align:middle;margin-right:8px;">
                PitchingNinja
              </a>
              <a href="https://twitter.com/JeffPassan" target="_blank" class="twitter-link">
                <img src="https://pbs.twimg.com/profile_images/1484049864/jeffpassan_400x400.jpg" alt="Jeff Passan" style="width:30px;height:30px;border-radius:50%;vertical-align:middle;margin-right:8px;">
                Jeff Passan
              </a>
              <a href="https://twitter.com/Ken_Rosenthal" target="_blank" class="twitter-link">
                <img src="https://pbs.twimg.com/profile_images/1484049864/kenrosenthal_400x400.jpg" alt="Ken Rosenthal" style="width:30px;height:30px;border-radius:50%;vertical-align:middle;margin-right:8px;">
                Ken Rosenthal
              </a>
              <!-- Add more relevant scouts/insiders -->
            </div>
          </div>
        </div>
      </div>
    </div>
    ```

4.  **CSS for Twitter Links:** Add styling for `.twitter-link` to match the dashboard's aesthetic.

    ```css
    .twitter-link {
      display: flex;
      align-items: center;
      padding: 8px 10px;
      background: var(--navy-mid);
      border: 1px solid var(--navy-border);
      border-radius: 8px;
      color: #fff;
      text-decoration: none;
      font-family: Barlow Condensed, sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
      transition: background 0.2s, border-color 0.2s;
    }
    .twitter-link:hover {
      background: var(--orange-dim);
      border-color: var(--orange);
    }
    ```

### 5. Enhanced "Player Profile" Tab

**Objective:** Redesign the `pg-profile` tab to incorporate scouting grades, contract value conversion, and a comprehensive layout inspired by `PlayerProfileExample.png` [2].

**Steps:**

1.  **Locate `pg-profile` Tab:** Find the `<div class="pg" id="pg-profile">` section (around line 293 in the tab definition, and the actual content block would be further down).
2.  **Clear Existing Content:** Remove any existing content within the `pg-profile` div to prepare for the new layout.
3.  **Implement Layout Grid:** Create a main grid structure for the `pg-profile` tab to organize the various sections as seen in the example. This will likely involve a multi-column layout with nested grids for individual panels.

    ```html
    <div class="pg" id="pg-profile">
      <div class="profile-header" style="display:flex;align-items:center;gap:20px;margin-bottom:20px;">
        <!-- Player Image -->
        <img id="profile-player-img" src="" alt="Player Image" style="width:120px;height:120px;border-radius:50%;object-fit:cover;border:3px solid var(--orange);">
        <!-- Player Name & Info -->
        <div>
          <div id="profile-player-name" style="font-family:Bebas Neue,sans-serif;font-size:40px;letter-spacing:3px;line-height:1;">PLAYER NAME</div>
          <div id="profile-player-info" style="font-size:14px;color:var(--text-dim);margin-top:5px;">TEAM - POS | B/T: L/L | HT: 6'1" | WT: 200 | AGE: 25 (8/21/1998)</div>
          <div id="profile-player-achievements" style="font-size:12px;color:var(--gold);margin-top:5px;">2023 NL ROY - 2023, 2025 All-Star - 2025 Silver Slugger</div>
        </div>
      </div>

      <div class="profile-main-grid" style="display:grid;grid-template-columns:1fr 1.5fr;gap:20px;">
        <!-- Left Column -->
        <div>
          <!-- Contract & Value -->
          <div class="panel" style="margin-bottom:20px;">
            <div class="panel-title">CONTRACT & VALUE</div>
            <div class="contract-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:13px;">
              <div>STATUS: <span id="contract-status" style="color:#fff;">Pre-Arb</span></div>
              <div>2026 SALARY: <span id="contract-salary" style="color:#fff;">$760K</span></div>
              <div>SERVICE TIME: <span id="contract-service-time" style="color:#fff;">2.071</span></div>
              <div>ARB ELIGIBLE: <span id="contract-arb-eligible" style="color:#fff;">2027</span></div>
              <div>SURPLUS VALUE: <span id="contract-surplus-value" style="color:var(--green);">$85M+</span></div>
              <div>FREE AGENT: <span id="contract-free-agent" style="color:#fff;">2030</span></div>
              <div>FV GRADE: <span id="contract-fv-grade" style="color:var(--gold);">65</span></div>
              <div>WAR (2026 proj.): <span id="contract-war-proj" style="color:var(--green);">~2.1</span></div>
              <div>$/WAR: <span id="contract-dollar-per-war" style="color:var(--red);">~$362K</span></div>
            </div>
          </div>

          <!-- Scouting Grades -->
          <div class="panel" style="margin-bottom:20px;">
            <div class="panel-title">SCOUTING GRADES <span class="pt-badge">(20-80 SCALE)</span></div>
            <div class="scouting-grades-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center;">
              <div class="grade-item">
                <div style="font-size:10px;color:var(--text-dim);font-family:Barlow Condensed,sans-serif;letter-spacing:1px;">HIT</div>
                <div class="grade-badge grade-55">55</div>
              </div>
              <div class="grade-item">
                <div style="font-size:10px;color:var(--text-dim);font-family:Barlow Condensed,sans-serif;letter-spacing:1px;">RAW POWER</div>
                <div class="grade-badge grade-50">50</div>
              </div>
              <div class="grade-item">
                <div style="font-size:10px;color:var(--text-dim);font-family:Barlow Condensed,sans-serif;letter-spacing:1px;">GAME POWER</div>
                <div class="grade-badge grade-45">45</div>
              </div>
              <div class="grade-item">
                <div style="font-size:10px;color:var(--text-dim);font-family:Barlow Condensed,sans-serif;letter-spacing:1px;">SPEED</div>
                <div class="grade-badge grade-65">65</div>
              </div>
              <div class="grade-item">
                <div style="font-size:10px;color:var(--text-dim);font-family:Barlow Condensed,sans-serif;letter-spacing:1px;">FIELD</div>
                <div class="grade-badge grade-60">60</div>
              </div>
              <div class="grade-item">
                <div style="font-size:10px;color:var(--text-dim);font-family:Barlow Condensed,sans-serif;letter-spacing:1px;">ARM</div>
                <div class="grade-badge grade-50">50</div>
              </div>
              <div class="grade-item" style="grid-column:span 3;">
                <div style="font-size:10px;color:var(--text-dim);font-family:Barlow Condensed,sans-serif;letter-spacing:1px;">OVERALL FV</div>
                <div class="grade-badge grade-55">55</div>
              </div>
            </div>
            <p style="font-size:11px;color:var(--text-dim);line-height:1.4;margin-top:15px;">SCOUT NOTE: Elite athlete with above-average contact and plus speed/defense. Power ceiling limited by frame, projects 18-22 HR/162 at peak. Elite BB% signals advanced approach. 2025 breakout (.884 OPS, 31 HR) showed expanded power profile. Grades reflect true talent.</p>
          </div>

          <!-- 2026 Season Percentile Rankings (MLB Savant) -->
          <div class="panel" style="margin-bottom:20px;">
            <div class="panel-title">2026 SEASON PERCENTILE RANKINGS <span class="pt-badge">(MLB SAVANT)</span></div>
            <div id="savant-percentiles-2026"></div>
          </div>

          <!-- 2026 Splits (MLB Savant) -->
          <div class="panel" style="margin-bottom:20px;">
            <div class="panel-title">2026 SPLITS <span class="pt-badge">(MLB SAVANT)</span></div>
            <div id="player-splits-2026"></div>
          </div>

          <!-- Data Sources & External Links -->
          <div class="panel" style="margin-bottom:20px;">
            <div class="panel-title">DATA SOURCES</div>
            <ul style="list-style:none;padding:0;margin-bottom:15px;font-size:12px;color:var(--text-dim);">
              <li>- MLB Savant</li>
              <li>- TJStats</li>
              <li>- Pitch Profiler</li>
              <li>- MiLB Statcast</li>
              <li>- Baseball Reference</li>
              <li>- NPB Stats</li>
            </ul>
            <div class="panel-title">EXTERNAL LINKS</div>
            <div style="display:flex;gap:15px;margin-top:10px;">
              <a href="https://baseballsavant.mlb.com/" target="_blank"><img src="https://baseballsavant.mlb.com/favicon.ico" alt="Baseball Savant" style="width:30px;height:30px;"></a>
              <a href="https://www.fangraphs.com/" target="_blank"><img src="https://www.fangraphs.com/favicon.ico" alt="FanGraphs" style="width:30px;height:30px;"></a>
              <a href="https://www.mlb.com/player/" target="_blank"><img src="https://www.mlb.com/favicon.ico" alt="MLB Player Page" style="width:30px;height:30px;"></a>
              <a href="https://www.baseball-reference.com/" target="_blank"><img src="https://www.baseball-reference.com/favicon.ico" alt="Baseball Reference" style="width:30px;height:30px;"></a>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div>
          <!-- Percentile Rankings - Multi-Year (MLB Savant) -->
          <div class="panel" style="margin-bottom:20px;">
            <div class="panel-title">PERCENTILE RANKINGS - MULTI-YEAR <span class="pt-badge">(MLB SAVANT)</span></div>
            <div id="savant-percentiles-multi-year"></div>
          </div>

          <!-- Advanced Scouting - Pitch Type Vulnerability (TRUMEDIA) -->
          <div class="panel" style="margin-bottom:20px;">
            <div class="panel-title">ADVANCE SCOUTING - PITCH TYPE VULNERABILITY <span class="pt-badge">(TRUMEDIA)</span></div>
            <div id="pitch-vulnerability"></div>
          </div>

          <!-- Pitcher Count Usage Matrix (RECOMMENDED) -->
          <div class="panel" style="margin-bottom:20px;">
            <div class="panel-title">PITCHER COUNT USAGE MATRIX <span class="pt-badge">(RECOMMENDED)</span></div>
            <div id="pitch-count-matrix"></div>
          </div>

          <!-- Zone Heat Map - xSLG Allowed (vs RHB) -->
          <div class="panel" style="margin-bottom:20px;">
            <div class="panel-title">ZONE HEAT MAP - xSLG ALLOWED <span class="pt-badge">(vs RHB)</span></div>
            <div id="zone-heat-map"></div>
          </div>

          <!-- TJSTATS - TREVOR MCDONALD (RHP) -->
          <div class="panel" style="margin-bottom:20px;">
            <div class="panel-title">TJSTATS - TREVOR MCDONALD <span class="pt-badge">(RHP)</span></div>
            <div id="tjstats-pitcher"></div>
          </div>

          <!-- ARSENAL & PITCH METRICS (2026) -->
          <div class="panel" style="margin-bottom:20px;">
            <div class="panel-title">ARSENAL & PITCH METRICS <span class="pt-badge">(2026)</span></div>
            <div id="arsenal-metrics"></div>
          </div>

          <!-- PITCH PROFILER - CAMILO DOVAL (RHP) -->
          <div class="panel" style="margin-bottom:20px;">
            <div class="panel-title">PITCH PROFILER - CAMILO DOVAL <span class="pt-badge">(RHP)</span></div>
            <div id="pitch-profiler"></div>
          </div>

          <!-- NPB HITTER CARD - OKAMOTO KAZUMA (1B) -->
          <div class="panel" style="margin-bottom:20px;">
            <div class="panel-title">NPB HITTER CARD - OKAMOTO KAZUMA <span class="pt-badge">(1B)</span></div>
            <div id="npb-hitter-card"></div>
          </div>

          <!-- MILB ADVANCED SCOUTING SHEET (2026 AAA) -->
          <div class="panel" style="margin-bottom:20px;">
            <div class="panel-title">MILB ADVANCED SCOUTING SHEET <span class="pt-badge">(2026 AAA)</span></div>
            <div id="milb-scouting-sheet"></div>
          </div>

          <!-- PADRES ADVANCE REPORT - JUAN BURGOS (RHP) -->
          <div class="panel" style="margin-bottom:20px;">
            <div class="panel-title">PADRES ADVANCE REPORT - JUAN BURGOS <span class="pt-badge">(RHP)</span></div>
            <div id="padres-report"></div>
          </div>

          <!-- VIDEO HIGHLIGHTS & BREAKDOWNS -->
          <div class="panel" style="margin-bottom:20px;">
            <div class="panel-title">VIDEO HIGHLIGHTS & BREAKDOWNS</div>
            <div id="video-highlights" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(150px, 1fr));gap:10px;">
              <!-- Example video link -->
              <a href="https://www.youtube.com/watch?v=example1" target="_blank" style="text-decoration:none;color:#fff;">
                <img src="https://img.youtube.com/vi/example1/hqdefault.jpg" alt="Video Thumbnail" style="width:100%;border-radius:8px;">
                <div style="font-size:11px;margin-top:5px;text-align:center;">2026 SEASON HIGHLIGHTS</div>
              </a>
            </div>
          </div>

          <!-- CAREER MLB BATTING STATS (MLB SAVANT) -->
          <div class="panel" style="margin-bottom:20px;">
            <div class="panel-title">CAREER MLB BATTING STATS <span class="pt-badge">(MLB SAVANT)</span></div>
            <div id="career-stats-table"></div>
          </div>
        </div>
      </div>
    </div>
    ```

4.  **JavaScript for `loadPlayerProfile(playerId)`:**

    *   Create a new function `loadPlayerProfile(playerId)` that will be called when the `pg-profile` tab is activated or a player is selected.
    *   This function will be responsible for fetching player-specific data (bio, contract, scouting grades, stats, percentiles, etc.) from various MLB APIs (via the proxy) and populating the corresponding HTML elements.
    *   **Player Bio:** Fetch player details (name, team, position, B/T, height, weight, age, achievements) and update `profile-player-name`, `profile-player-info`, `profile-player-achievements`, and `profile-player-img`.
    *   **Contract & Value:** Populate the `contract-grid` with relevant data. This will likely require custom logic to calculate surplus value, WAR projection, and $/WAR based on fetched data and predefined formulas.
    *   **Scouting Grades:** Populate the `scouting-grades-grid` with the 20-80 scale grades. These might be hardcoded initially or fetched from a separate data source.
    *   **Percentile Rankings:** Implement the `savant-percentiles-2026` and `savant-percentiles-multi-year` sections. This will involve fetching Savant percentile data and rendering interactive bar charts with the specified color coding (Red for elite, Semi-red for above average, Blue for poor, Gray for average) [1]. The `pct-bar-wrap`, `pct-track`, `pct-fill`, `pct-val`, `pct-raw` classes are already present in the CSS (around line 126) and should be utilized.
    *   **Advanced Scouting & Pitcher Data:** Populate `pitch-vulnerability`, `pitch-count-matrix`, `zone-heat-map`, `tjstats-pitcher`, `arsenal-metrics`, `pitch-profiler`, `npb-hitter-card`, `milb-scouting-sheet`, and `padres-report` with relevant data. These sections may require complex data fetching and visualization logic. Initially, placeholders or simplified representations can be used.
    *   **Video Highlights:** Populate `video-highlights` with embedded YouTube links or thumbnails linking to YouTube videos.
    *   **Career Stats:** Populate `career-stats-table` with a detailed table of career statistics.

    ```javascript
    // Example loadPlayerProfile function structure
    function loadPlayerProfile(playerId) {
      // Clear previous player data
      document.getElementById("profile-player-name").textContent = "Loading...";
      // ... clear other elements ...

      // Fetch player data (example API calls)
      Promise.all([
        fetchJSON(`/api/mlb?path=/people/${playerId}`), // Player bio
        fetchJSON(`/api/mlb?path=/people/${playerId}/stats?group=career&type=hitting`), // Career stats
        // ... other API calls for Savant percentiles, scouting grades, etc.
      ]).then(function(results) {
        var playerBio = results[0].people[0];
        var careerStats = results[1].stats[0].splits;

        // Populate Player Header
        document.getElementById("profile-player-img").src = `https://content.mlb.com/images/MLB_512x512.png`; // Placeholder, replace with actual player image URL
        document.getElementById("profile-player-name").textContent = `${playerBio.firstName} ${playerBio.lastName}`.toUpperCase();
        document.getElementById("profile-player-info").textContent = `${playerBio.primaryPosition.abbreviation} | B/T: ${playerBio.batSide.code}/${playerBio.pitchHand.code} | HT: ${playerBio.height} | WT: ${playerBio.weight} | AGE: ${playerBio.age} (${new Date(playerBio.birthDate).toLocaleDateString()})`;
        document.getElementById("profile-player-achievements").textContent = "2023 NL ROY - 2023, 2025 All-Star - 2025 Silver Slugger"; // Example achievements

        // Populate Contract & Value (dummy data for now)
        document.getElementById("contract-status").textContent = "Pre-Arb";
        document.getElementById("contract-salary").textContent = "$760K";
        document.getElementById("contract-service-time").textContent = "2.071";
        document.getElementById("contract-arb-eligible").textContent = "2027";
        document.getElementById("contract-free-agent").textContent = "2030";
        document.getElementById("contract-surplus-value").textContent = "$85M+";
        document.getElementById("contract-fv-grade").textContent = "65";
        document.getElementById("contract-war-proj").textContent = "~2.1";
        document.getElementById("contract-dollar-per-war").textContent = "~$362K";

        // Populate Scouting Grades (dummy data for now)
        // This would involve dynamically updating the grade-badge elements

        // Render Percentile Rankings (example structure)
        renderPercentileBars("savant-percentiles-2026", [
          { label: "Batting Run Value", value: 82, raw: 0.5 },
          { label: "Baserunning Run Value", value: 99, raw: 0.8 },
          { label: "Fielding Run Value", value: 50, raw: 0.1 },
          { label: "xwOBA", value: 67, raw: 0.350 },
          { label: "xBA", value: 48, raw: 0.280 },
          { label: "xSLG", value: 71, raw: 0.450 },
          { label: "Avg Exit Velocity", value: 61, raw: 90.5 },
          { label: "Barrel%", value: 75, raw: 12.0 },
          { label: "Hard-Hit%", value: 80, raw: 50.0 },
          { label: "LA Sweet-Spot%", value: 34, raw: 25.0 },
          { label: "Bat Speed", value: 84, raw: 75.0 },
          { label: "Squared-Up%", value: 24, raw: 15.0 },
          { label: "Z-Swing%", value: 30, raw: 65.0 },
          { label: "O-Swing%", value: 15, raw: 25.0 },
          { label: "Whiff%", value: 30, raw: 20.0 },
          { label: "K%", value: 15, raw: 18.0 },
          { label: "BB%", value: 71, raw: 10.0 },
          { label: "Range (OAA)", value: 89, raw: 5 },
          { label: "Arm Strength", value: 15, raw: 80 },
          { label: "Arm Value", value: 15, raw: 0.5 },
          { label: "Sprint Speed", value: 96, raw: 29.5 }
        ]);
        renderMultiYearPercentiles("savant-percentiles-multi-year", [
          { year: 2022, data: { 'xwOBA': 94, 'xBA': 100, 'xSLG': 74, 'Barrel%': 74, 'Hard-Hit%': 74, 'Max EV': 74, 'K%': 74, 'BB%': 74, 'Sprint Speed': 74 } },
          { year: 2023, data: { 'xwOBA': 100, 'xBA': 80, 'xSLG': 61, 'Barrel%': 36, 'Hard-Hit%': 43, 'Max EV': 55, 'K%': 43, 'BB%': 43, 'Sprint Speed': 43 } },
          { year: 2024, data: { 'xwOBA': 76, 'xBA': 100, 'xSLG': 80, 'Barrel%': 61, 'Hard-Hit%': 43, 'Max EV': 55, 'K%': 43, 'BB%': 43, 'Sprint Speed': 43 } },
          { year: 2025, data: { 'xwOBA': 90, 'xBA': 100, 'xSLG': 67, 'Barrel%': 93, 'Hard-Hit%': 70, 'Max EV': 94, 'K%': 94, 'BB%': 89, 'Sprint Speed': 94 } },
          { year: 2026, data: { 'xwOBA': 82, 'xBA': 99, 'xSLG': 50, 'Barrel%': 67, 'Hard-Hit%': 46, 'Max EV': 71, 'K%': 71, 'BB%': 61, 'Sprint Speed': 71 } }
        ]);

        // Render Career Stats Table
        renderCareerStatsTable("career-stats-table", careerStats);

        // ... populate other sections with data and visualizations ...

      }).catch(function(error) {
        console.error("Error loading player profile:", error);
        document.getElementById("profile-player-name").textContent = "Error loading player data.";
      });
    }

    // Helper function to render percentile bars (using existing CSS classes)
    function renderPercentileBars(containerId, data) {
      var container = document.getElementById(containerId);
      container.innerHTML = "";
      data.forEach(function(item) {
        var colorClass = "";
        if (item.value >= 70) colorClass = "red"; // Elite
        else if (item.value >= 45) colorClass = "semi-red"; // Above Average
        else if (item.value <= 39) colorClass = "blue"; // Poor
        else colorClass = "gray"; // Average

        var barHtml = `
          <div class="pct-bar-wrap">
            <div class="pct-label">${item.label}</div>
            <div class="pct-track">
              <div class="pct-fill ${colorClass}" style="width:${item.value}%;"></div>
            </div>
            <div class="pct-val">${item.value}</div>
            <div class="pct-raw">${item.raw}</div>
          </div>
        `;
        container.insertAdjacentHTML("beforeend", barHtml);
      });
    }

    // Helper function to render multi-year percentiles (example table structure)
    function renderMultiYearPercentiles(containerId, data) {
      var container = document.getElementById(containerId);
      let tableHtml = `<table class="tbl"><thead><tr><th>YEAR</th><th>VALUE</th><th>xwOBA</th><th>xBA</th><th>xSLG</th><th>Barrel%</th><th>Hard-Hit%</th><th>Max EV</th><th>K%</th><th>BB%</th><th>Sprint Speed</th></tr></thead><tbody>`;
      data.forEach(row => {
        tableHtml += `<tr>
          <td>${row.year}</td>
          <td>${row.data['VALUE'] || '-'}</td>
          <td class="${getPercentileColorClass(row.data['xwOBA'])}">${row.data['xwOBA'] || '-'}</td>
          <td class="${getPercentileColorClass(row.data['xBA'])}">${row.data['xBA'] || '-'}</td>
          <td class="${getPercentileColorClass(row.data['xSLG'])}">${row.data['xSLG'] || '-'}</td>
          <td class="${getPercentileColorClass(row.data['Barrel%'])}">${row.data['Barrel%'] || '-'}</td>
          <td class="${getPercentileColorClass(row.data['Hard-Hit%'])}">${row.data['Hard-Hit%'] || '-'}</td>
          <td class="${getPercentileColorClass(row.data['Max EV'])}">${row.data['Max EV'] || '-'}</td>
          <td class="${getPercentileColorClass(row.data['K%'])}">${row.data['K%'] || '-'}</td>
          <td class="${getPercentileColorClass(row.data['BB%'])}">${row.data['BB%'] || '-'}</td>
          <td class="${getPercentileColorClass(row.data['Sprint Speed'])}">${row.data['Sprint Speed'] || '-'}</td>
        </tr>`;
      });
      tableHtml += `</tbody></table>`;
      container.innerHTML = tableHtml;
    }

    function getPercentileColorClass(value) {
      if (value === undefined || value === null || value === '-') return '';
      if (value >= 70) return 'red-text';
      if (value >= 60) return 'orange-text';
      if (value >= 40) return 'gray-text';
      return 'blue-text';
    }

    // Helper function to render career stats table
    function renderCareerStatsTable(containerId, stats) {
      var container = document.getElementById(containerId);
      let tableHtml = `<table class="tbl"><thead><tr><th>YEAR</th><th>G</th><th>PA</th><th>AB</th><th>R</th><th>H</th><th>2B</th><th>3B</th><th>HR</th><th>RBI</th><th>BB</th><th>SO</th><th>SB</th><th>AVG</th><th>OBP</th><th>SLG</th><th>OPS</th><th>ISO</th><th>BABIP</th><th>wRC+</th></tr></thead><tbody>`;
      stats.forEach(s => {
        if (s.stat.games) {
          tableHtml += `<tr>
            <td>${s.season}</td>
            <td>${s.stat.games}</td>
            <td>${s.stat.plateAppearances || '-'}</td>
            <td>${s.stat.atBats || '-'}</td>
            <td>${s.stat.runs || '-'}</td>
            <td>${s.stat.hits || '-'}</td>
            <td>${s.stat.doubles || '-'}</td>
            <td>${s.stat.triples || '-'}</td>
            <td>${s.stat.homeRuns || '-'}</td>
            <td>${s.stat.rbi || '-'}</td>
            <td>${s.stat.baseOnBalls || '-'}</td>
            <td>${s.stat.strikeOuts || '-'}</td>
            <td>${s.stat.stolenBases || '-'}</td>
            <td>${s.stat.avg || '-'}</td>
            <td>${s.stat.obp || '-'}</td>
            <td>${s.stat.slg || '-'}</td>
            <td>${s.stat.ops || '-'}</td>
            <td>${s.stat.iso || '-'}</td>
            <td>${s.stat.babip || '-'}</td>
            <td>${s.stat.wrcPlus || '-'}</td>
          </tr>`;
        }
      });
      tableHtml += `</tbody></table>`;
      container.innerHTML = tableHtml;
    }

    // Call loadPlayerProfile when the profile tab is activated
    // This will require modifying the tab switching logic to call loadPlayerProfile() when 'pg-profile' is selected.
    ```

5.  **CSS for Player Profile:** Add or modify CSS to ensure the new elements are styled consistently with the dashboard's theme. Pay close attention to font sizes, colors, spacing, and responsive design.

    *   Define `.red-text`, `.orange-text`, `.gray-text`, `.blue-text` classes for percentile table coloring.
    *   Ensure the `pct-fill` classes (e.g., `.pct-fill.red`, `.pct-fill.semi-red`, `.pct-fill.blue`, `.pct-fill.gray`) are correctly defined to match the Savant color scale [1].

## Tab Consolidation & Layout Restructuring (V4 Target)

**Objective:** Consolidate existing tabs into the new V4 structure as defined in `MLBDashboardInstructions.md` Section 4 [1].

**Steps:**

1.  **Update Tab Bar HTML:** Modify the `<div class="tabs">` section (around line 39 in `index(16).html`) to reflect the new tab structure. Remove old tabs and add new ones as per the V4 target table [1].

    *   **Dashboard (`pg-dash`):** Merge Team Stats + Headlines.
    *   **Personnel (`pg-personnel`):** Merge Lineups + Roster/IL + Hot/Cold + Pitching (SP).
    *   **Analysis (`pg-analysis`):** Merge League Leaders + Metric Leaders + Fantasy + Savant.
    *   **Player Profile (`pg-profile`):** Existing, but now enhanced.
    *   **Top Prospects (`pg-prospects`):** New tab.
    *   **Scout Notes (`pg-notes`):** Existing tab.
    *   **About Me (`pg-about`):** Existing, but now enhanced.

    ```html
    <div class="tabs">
      <div class="tab on" data-tab="dash">Dashboard</div>
      <div class="tab" data-tab="personnel">Personnel</div>
      <div class="tab" data-tab="analysis">Analysis</div>
      <div class="tab" data-tab="profile">Player Profile</div>
      <div class="tab" data-tab="prospects">Top Prospects</div>
      <div class="tab" data-tab="notes">Scout Notes</div>
      <div class="tab" data-tab="about">About Me</div>
      <!-- Remove other old tabs -->
    </div>
    ```

2.  **Restructure `pg` Divs:** Rearrange the content within the main `<div class="body">` to match the new tab structure. Ensure that the content for each new consolidated tab is correctly placed within its respective `pg` div.

    *   **`pg-dash`:** Top: Division Standings + Win Projection Chart. Bottom: Offense stats + Pitching stats panels.
    *   **`pg-personnel`:** Top: Projected Lineup + Pitching Staff. Middle: Active Roster + Injured List. Bottom: Hot/Cold Hitters & Pitchers + Starting Pitching stats.
    *   **`pg-analysis`:** Three-box layout: Left=Hitting Leaders, Center=WAR/Fantasy Shared Stats, Right=Pitching Leaders.

3.  **Update Tab Switching Logic:** Ensure the JavaScript logic that handles tab switching correctly displays the content for the new consolidated tabs and calls the appropriate `load` functions (e.g., `loadProspects()`, `loadPlayerProfile(selectedPlayerId)`).

## Dynamic Team Color Coding

**Objective:** Ensure team colors are dynamically updated based on team selection, with a specific fix for the SF Giants [1].

**Steps:**

1.  **Locate `TEAM_COLORS` Object:** Verify or create the `TEAM_COLORS` object in JavaScript. This object should contain primary and secondary hex codes for all 30 MLB teams [1].

    ```javascript
    var TEAM_COLORS = {
      109: { primary: '#000000', secondary: '#A71930' }, // Arizona Diamondbacks (example, replace with actual)
      144: { primary: '#CE1126', secondary: '#13274F' }, // Atlanta Braves (example)
      // ... all 30 teams ...
      137: { primary: '#FD5A1E', secondary: '#27251F' }, // SF Giants (CRITICAL FIX)
      // ... rest of the teams ...
    };
    ```

2.  **Verify `updateThemeColors(teamId)`:** Ensure the `updateThemeColors(teamId)` function correctly modifies CSS variables (`--orange`, `--orange-dim`, `--blue-bright`, `--navy`) based on the `TEAM_COLORS` object [1].
3.  **Call in `loadTeam()`:** Confirm that `updateThemeColors(teamId)` is called at the very top of the `loadTeam(teamId)` function [1].

## Metric Leaders Bug Fix

**Objective:** Fix the bug where pitchers appear in batting leaderboards and hitters in pitching leaderboards [1].

**Steps:**

1.  **Locate `loadMetricLeaders()`:** Find the `loadMetricLeaders()` function in the JavaScript.
2.  **Filter by Position:** Before rendering, split the roster into `pitcherIds` (position.code === '1') and `hitterIds` (position.code !== '1') [1].
3.  **Apply Filters:** Apply `hitterIds` filter to batting stats (AVG, OBP, SLG, OPS, HR, RBI, Runs, SB, BB, ISO, BABIP) and `pitcherIds` filter to pitching stats (ERA, WHIP, Strikeouts, Wins, Saves, FIP, K/9, BB/9) [1].

## References

[1] Rumpler, L. (2026). *MLB Analytics Dashboard Instructions*. Internal Document.
[2] Rumpler, L. (2026). *Player Profile Example*. PDF Document. (Visual reference for Player Profile tab layout and content).
