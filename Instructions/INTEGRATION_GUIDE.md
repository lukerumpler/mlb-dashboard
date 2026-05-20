# MLB Intelligence Terminal - Integration & Customization Guide

## 🔌 Integration Opportunities

### Real-Time Data Sources

#### 1. **MLB Official API Integration**
```javascript
// Example: Live game score updates
fetch('https://statsapi.mlb.com/api/v1/game/638456/live')
  .then(r => r.json())
  .then(data => {
    // Update live stats
    updatePlayerStats(data.liveData.boxscore);
  });
```

**Available Endpoints**:
- `/api/v1/schedule` - Game schedule and results
- `/api/v1/teams/{teamId}/roster` - Team rosters
- `/api/v1/people/{playerId}` - Player biographical data
- `/api/v1/game/{gameId}/live` - Live game data
- `/api/v1/statTypes` - Available stat definitions

---

#### 2. **Statcast Data Integration**
```javascript
// Pull advanced hitting metrics
const statcastData = {
  exitVelo: 92.4,
  launchAngle: 24.5,
  hangTime: 3.2,
  distance: 385,
  barrelClassification: true
};

// Visualize in heatmap
plotStatcastData(statcastData);
```

**Data Available**:
- Exit velocity & exit direction
- Launch angle & spin rate
- Hang time & distance
- Barrel classification
- Home run probability
- Expected batting average (xBA)

---

#### 3. **Injury Report API**
```javascript
// Real-time injury updates
fetch('https://api.espn.com/site/assets/files/injury_report.json')
  .then(r => r.json())
  .then(injuries => {
    updateInjuryStatus(injuries.players);
    generateTimeline(injuries.history);
  });
```

---

### Fantasy Baseball Integration

#### Draft Helper
```javascript
class DraftHelper {
  constructor() {
    this.adpData = {}; // Average Draft Position
    this.preseason = {}; // Preseason rankings
    this.projection = {}; // Season projections
  }
  
  getSuggestedValue(player) {
    return this.projection[player.id] / this.adpData[player.id];
  }
  
  getTargetRounds() {
    // Recommend position-based targets
    return {
      c: 40-60,
      '1b': 20-40,
      '2b': 30-50,
      '3b': 25-45,
      ss: 25-45,
      of: 15-40,
      dh: 50-80,
      sp: 30-50,
      rp: 60-80
    };
  }
}
```

#### Lineup Optimizer
```javascript
function optimizeLineup(availablePlayers, constraints) {
  const lineup = {
    c: selectByCatcher(constraints),
    infield: selectInfield(constraints),
    outfield: selectOutfield(constraints),
    dh: selectDH(constraints),
    pitchers: selectPitchers(constraints)
  };
  
  return {
    expectedWins: calculateWinProbability(lineup),
    expectedPoints: calculateProjectedPoints(lineup),
    salaryUsed: calculateSalary(lineup),
    roster: lineup
  };
}
```

---

### Betting Integration

#### Vegas Odds Connection
```javascript
async function fetchVegasOdds(gameId) {
  const response = await fetch(`/api/odds/${gameId}`);
  const odds = await response.json();
  
  return {
    moneyline: odds.moneyline,
    spread: odds.spread,
    overUnder: odds.ou,
    impliedProb: calculateImpliedProbability(odds.moneyline)
  };
}

// Update player props
function updatePlayerProps() {
  const props = {
    homeRuns: { over: -110, under: -110, line: 1.5 },
    hits: { over: -110, under: -110, line: 1.5 },
    rbis: { over: -110, under: -110, line: 3.5 },
    strikeouts: { over: -110, under: -110, line: 7.5 }
  };
  
  renderPlayerProps(props);
}
```

---

### Content Management System

#### Player Database Schema
```javascript
const playerSchema = {
  id: String,
  name: String,
  number: Number,
  position: String,
  team: String,
  birthDate: Date,
  height: String,
  weight: Number,
  bats: String,
  throws: String,
  
  // Current Season Stats
  stats: {
    batting: {
      g: Number,
      ab: Number,
      h: Number,
      '2b': Number,
      '3b': Number,
      hr: Number,
      rbi: Number,
      bb: Number,
      so: Number,
      sb: Number,
      cs: Number,
      avg: Number,
      obp: Number,
      slg: Number,
      ops: Number
    },
    advanced: {
      xwoba: Number,
      xba: Number,
      barrelPct: Number,
      hardHitPct: Number,
      launchAngle: Number,
      exitVelo: Number,
      war: Number
    }
  },
  
  // Historical Data
  career: {
    hits: Number,
    homeRuns: Number,
    rbi: Number,
    allStarSelections: Number,
    awards: [String],
    milestones: [Object]
  },
  
  // Metadata
  imageUrl: String,
  biography: String,
  socialMedia: {
    twitter: String,
    instagram: String
  }
};
```

---

## 🎨 Customization Options

### Theme Customization

#### CSS Variables Override
```css
:root {
  /* Change primary colors */
  --orange: #FF6B35;
  --green: #3ECF8E;
  --blue-bright: #00D4FF;
  --red: #FF4444;
  
  /* Adjust opacity */
  --orange-dim: rgba(255, 107, 53, 0.15);
  
  /* Modify borders */
  --navy-border: #2A4A6A;
  
  /* Update text colors */
  --text-dim: #A8C5D1;
}
```

#### Dark/Light Mode Toggle
```javascript
class ThemeManager {
  toggleTheme() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', this.currentTheme);
  }
  
  applySystemTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
      document.body.classList.add('dark-mode');
    }
  }
}
```

---

### Layout Customization

#### Responsive Grid Adjustment
```javascript
function setResponsiveLayout(screenWidth) {
  const layouts = {
    mobile: {
      dashboard: 'grid-template-columns: 1fr;',
      comparison: 'grid-template-columns: 1fr;',
      stats: 'grid-template-columns: 1fr;'
    },
    tablet: {
      dashboard: 'grid-template-columns: repeat(2, 1fr);',
      comparison: 'grid-template-columns: repeat(2, 1fr);',
      stats: 'grid-template-columns: repeat(2, 1fr);'
    },
    desktop: {
      dashboard: 'grid-template-columns: repeat(4, 1fr);',
      comparison: 'grid-template-columns: repeat(3, 1fr);',
      stats: 'grid-template-columns: repeat(4, 1fr);'
    }
  };
  
  const breakpoint = screenWidth < 768 ? 'mobile' : 
                    screenWidth < 1024 ? 'tablet' : 'desktop';
  
  applyLayout(layouts[breakpoint]);
}
```

---

#### Sidebar Toggle
```javascript
function toggleSidebar() {
  document.body.classList.toggle('sidebar-collapsed');
  
  // Adjust main content width
  const main = document.querySelector('.body');
  main.style.marginLeft = document.body.classList.contains('sidebar-collapsed') 
    ? '0' 
    : '280px';
}
```

---

### User Preferences System

#### Local Storage Management
```javascript
class UserPreferences {
  constructor() {
    this.defaults = {
      theme: 'dark',
      layout: 'default',
      statsDisplay: 'standard', // or 'advanced'
      sortBy: 'name',
      favoriteTeams: [],
      favoriteePlayers: [],
      notificationsEnabled: true,
      compactMode: false
    };
  }
  
  save(preferences) {
    localStorage.setItem('userPrefs', JSON.stringify(preferences));
  }
  
  load() {
    const saved = localStorage.getItem('userPrefs');
    return saved ? JSON.parse(saved) : this.defaults;
  }
  
  updateSinglePreference(key, value) {
    const current = this.load();
    current[key] = value;
    this.save(current);
  }
}
```

#### Settings Panel
```html
<div class="settings-panel">
  <h2>User Preferences</h2>
  
  <div class="setting">
    <label>Theme</label>
    <select id="theme-select" onchange="updateTheme()">
      <option value="dark">Dark</option>
      <option value="light">Light</option>
      <option value="auto">Auto (System)</option>
    </select>
  </div>
  
  <div class="setting">
    <label>Stats Display</label>
    <select id="stats-display" onchange="updateStatsDisplay()">
      <option value="standard">Standard</option>
      <option value="advanced">Advanced</option>
      <option value="compact">Compact</option>
    </select>
  </div>
  
  <div class="setting">
    <label>Default Sort</label>
    <select id="sort-by" onchange="updateDefaultSort()">
      <option value="name">By Name</option>
      <option value="war">By WAR</option>
      <option value="avg">By AVG</option>
      <option value="hr">By Home Runs</option>
    </select>
  </div>
  
  <div class="setting">
    <label>Compact Mode</label>
    <input type="checkbox" id="compact-mode" onchange="toggleCompactMode()" />
  </div>
  
  <button onclick="resetPreferences()">Reset to Defaults</button>
</div>
```

---

## 📊 Advanced Analytics Modules

### Custom Stat Calculation Engine
```javascript
class StatCalculator {
  // Weighted On-Base Average
  calculateWOBA(player) {
    const weights = {
      bb: 0.690,
      hbp: 0.722,
      '1b': 0.885,
      '2b': 1.262,
      '3b': 1.594,
      hr: 2.058
    };
    
    const pa = player.ab + player.bb + player.hbp;
    const woba_denom = player.ab - player.hr + player.sf;
    
    return (weights.bb * player.bb + 
            weights.hbp * player.hbp +
            weights['1b'] * player.singles +
            weights['2b'] * player.doubles +
            weights['3b'] * player.triples +
            weights.hr * player.hr) / woba_denom;
  }
  
  // Wins Above Replacement
  calculateWAR(player) {
    const battingWAR = this.calculateBattingWAR(player);
    const baserunningWAR = this.calculateBaserunningWAR(player);
    const fieldingWAR = this.calculateFieldingWAR(player);
    
    return battingWAR + baserunningWAR + fieldingWAR;
  }
  
  // Expected Batting Average
  calculatexBA(launchAngle, exitVelo) {
    // Machine learning model
    const model = loadMLModel('xba-model');
    return model.predict({
      launchAngle,
      exitVelo
    });
  }
}
```

### Projection System
```javascript
class ProjectionEngine {
  projectSeasonStats(playerHistoricalData, currentYear) {
    const trends = this.analyzeTrends(playerHistoricalData);
    const ageAdjustment = this.getAgeAdjustment(playerHistoricalData.age);
    const leagueInflation = this.getLeagueInflation(currentYear);
    
    return {
      projectedAVG: playerHistoricalData.recentAVG * ageAdjustment * leagueInflation,
      projectedHR: playerHistoricalData.recentHR * ageAdjustment * leagueInflation,
      projectedRBI: playerHistoricalData.recentRBI * ageAdjustment * leagueInflation,
      projectedWAR: this.estimateWAR(playerHistoricalData, ageAdjustment),
      confidence: this.calculateConfidenceLevel(trends)
    };
  }
  
  generateMultipleProjections() {
    return {
      zips: this.zipProjection,
    steamer: this.steamerProjection,
      pecota: this.pecotaProjection,
      average: this.averageProjection()
    };
  }
}
```

---

## 🔐 Security & Performance

### Data Validation
```javascript
class DataValidator {
  validatePlayerData(player) {
    const schema = {
      name: { type: 'string', required: true, maxLength: 100 },
      number: { type: 'number', required: true, min: 0, max: 99 },
      avg: { type: 'number', required: true, min: 0, max: 1 },
      hr: { type: 'number', required: true, min: 0 },
      war: { type: 'number', required: false }
    };
    
    return this.validateAgainstSchema(player, schema);
  }
}
```

### Performance Optimization
```javascript
// Lazy load images
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      imageObserver.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});

// Debounce search function
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

const debouncedSearch = debounce(searchPlayers, 300);
```

---

## 📱 API Response Examples

### Player Data
```json
{
  "player": {
    "id": "543037",
    "name": "Aaron Judge",
    "team": "NYY",
    "position": "RF",
    "stats": {
      "g": 148,
      "ab": 596,
      "h": 187,
      "avg": 0.314,
      "hr": 58,
      "rbi": 144,
      "ops": 1.064
    },
    "advanced": {
      "xwoba": 0.421,
      "barrelPct": 14.2,
      "hardHitPct": 52.1,
      "war": 9.8
    }
  }
}
```

### Game Log Entry
```json
{
  "game": {
    "id": "638456",
    "date": "2025-09-28",
    "opponent": "LAD",
    "result": "W",
    "score": "4-2",
    "playerStats": {
      "ab": 4,
      "h": 2,
      "hr": 0,
      "rbi": 1,
      "sb": 0
    }
  }
}
```

---

## 🚀 Deployment Checklist

- [ ] Validate all data sources
- [ ] Test responsive design on all devices
- [ ] Optimize image sizes
- [ ] Minify CSS/JS
- [ ] Test performance (Lighthouse score)
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure CORS headers
- [ ] Set up SSL certificate
- [ ] Enable caching strategies
- [ ] Create API rate limiting
- [ ] Set up database backups
- [ ] Create monitoring dashboards
- [ ] Document API endpoints
- [ ] Create user onboarding flow
- [ ] Set up analytics tracking

---

**Integration Guide Version**: 1.0  
**Last Updated**: May 2026  
**Maintained By**: Development Team  
**Support**: api-support@mlb-intelligence.com
