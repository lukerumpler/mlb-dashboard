# JARVIS API INTEGRATION GUIDE & DATA ARCHITECTURE
## Backend Endpoints, Data Flows, Real-Time Updates, and Integration Patterns

---

## 🏗️ SYSTEM ARCHITECTURE OVERVIEW

### High-Level Data Flow
```
MLB StatsAPI / Internal Data Sources
    ↓
API Gateway (authentication, rate limiting)
    ↓
JARVIS Backend Services
├── Player Service (profiles, biographical)
├── Stats Service (performance metrics, Statcast)
├── Contract Service (contract data, salary cap)
├── Scouting Service (grades, evaluations)
└── Pitch Arsenal Service (pitch data, movement)
    ↓
JARVIS Frontend (Claude.ai, Web App)
├── Command Bar (search, player select)
├── Hero Section (load player data)
├── Tabs/Panes (load section-specific data)
└── Real-time WebSocket updates (live stats)
```

### Data Refresh Strategy
```
Component Load
├── Check localStorage cache (30min TTL)
├── If valid: use cached data
├── If stale/missing: fetch from API
├── Store in localStorage
├── Update UI
└── Subscribe to WebSocket for live updates
```

---

## 📡 REST API ENDPOINTS

### Base URL
```
https://api.jarvis-mlb.internal/v1
(or equivalent staging/production environment)
```

### Authentication
```
Header: Authorization: Bearer {JWT_TOKEN}
Token renewal: 24-hour expiration
Fallback: API key for public endpoints
```

### Rate Limiting
```
Rate: 300 requests/minute per user
Burst: 50 requests/10 seconds
Header: X-RateLimit-Remaining: {count}
Header: Retry-After: {seconds}
```

---

## 👤 PLAYER ENDPOINTS

### Get Player Profile
```
GET /players/{mlbId}

Query Parameters:
  ?season=2026 (optional, default current)
  ?include=stats,grades,contract (optional, comma-separated)

Response (200 OK):
{
  "id": 660271,
  "name": "Shohei Ohtani",
  "mlbId": 660271,
  "team": "LAD",
  "position": "DH/P",
  "number": 17,
  "status": "active",
  
  // Biographical
  "bats": "L",
  "throws": "R",
  "height": "6'3\"",
  "weight": 210,
  "dateOfBirth": "1994-07-05",
  "mlbDebut": "2018-03-29",
  "serviceTime": 6.2,
  "nationality": "Japan",
  "photoUrl": "https://cdn.mlb.com/...",
  
  // Contract
  "contract": {
    "id": "contract_001",
    "total": 700000000,
    "years": 10,
    "startYear": 2024,
    "endYear": 2033,
    "aav": 46000000,
    "deferredTotal": 680000000,
    "deferredPerYear": 68000000,
    "signBonus": 0,
    "noTrade": true,
    "noTradeClauses": true,
    "optYears": 0,
    "purchasePrice": null
  },
  
  // Awards
  "awards": [
    {
      "id": "award_mvp",
      "name": "AL MVP",
      "season": 2023
    },
    {
      "id": "award_cy",
      "name": "Cy Young",
      "season": 2020
    }
  ],
  
  // JARVIS Evaluation
  "jarvisEvaluation": {
    "score": 98,
    "grade": "A+",
    "verdict": "PRIORITY_ACQUISITION",
    "riskLevel": "LOW",
    "comparablePlayers": [
      {
        "name": "Juan Soto",
        "mlbId": 665742,
        "reason": "Elite offensive profile + high-value contract"
      }
    ],
    "lastUpdated": "2026-05-20T14:32:15Z",
    "evaluatedBy": "algorithm_v2.7"
  }
}
```

### Get Player Search Results
```
GET /players/search

Query Parameters:
  q={query} (name, partial name, or number)
  team={team_code} (optional filter)
  limit=25 (optional, default 10, max 100)
  offset=0 (optional, pagination)

Response (200 OK):
{
  "results": [
    {
      "id": 660271,
      "name": "Shohei Ohtani",
      "team": "LAD",
      "number": 17,
      "position": "DH/P",
      "photoUrl": "https://cdn.mlb.com/...",
      "status": "active"
    },
    // ... more results
  ],
  "total": 1847,
  "limit": 10,
  "offset": 0,
  "hasMore": true
}
```

### Get Multiple Players (Batch)
```
POST /players/batch

Request Body:
{
  "ids": [660271, 660272, 660273],
  "season": 2026
}

Response (200 OK):
{
  "players": [
    { /* player 660271 */ },
    { /* player 660272 */ },
    { /* player 660273 */ }
  ],
  "errors": []
}
```

---

## 📊 STATISTICS ENDPOINTS

### Get Player Batting Stats
```
GET /players/{mlbId}/stats/batting

Query Parameters:
  ?season=2026 (required)
  ?careerStats=false (optional, include career totals)

Response (200 OK):
{
  "season": 2026,
  "games": 142,
  "plateAppearances": 598,
  "hits": 162,
  "doubles": 34,
  "triples": 2,
  "homeRuns": 54,
  "rbis": 130,
  "walks": 89,
  "strikeouts": 112,
  "avg": 0.271,
  "obp": 0.382,
  "slg": 0.623,
  "ops": 1.005,
  "woba": 0.389,
  "xwoba": 0.436,
  "xba": 0.282,
  "xslg": 0.642,
  "warProj": 3.8,
  "wrc": 188,
  "wrcPlus": 178,
  
  "statcast": {
    "exitVelo": 94.2,
    "exitVeloPercentile": 95,
    "barrelRate": 0.148,
    "barrelPercentile": 100,
    "hardHitRate": 0.484,
    "hardHitPercentile": 98,
    "batSpeed": 79.2,
    "batSpeedPercentile": 99,
    "sprintSpeed": 28.5,
    "sprintSpeedPercentile": 78,
    "screamerRate": 0.089,
    "screamerPercentile": 92
  },
  
  "lastUpdated": "2026-05-20T08:00:00Z"
}
```

### Get Player Pitching Stats
```
GET /players/{mlbId}/stats/pitching

Query Parameters:
  ?season=2026 (required)

Response (200 OK):
{
  "season": 2026,
  "gameStarted": 12,
  "inningsPitched": 76.1,
  "wins": 6,
  "losses": 2,
  "era": 2.14,
  "fip": 2.08,
  "strikes": 1008,
  "strikeouts": 100,
  "strikeoutsPer9": 13.2,
  "walks": 18,
  "walksPer9": 2.1,
  "homeRuns": 7,
  "homeRunsPer9": 0.83,
  "whip": 1.033,
  "csw": 0.328,
  "cswPercentile": 87,
  "warrantsKpercentile": 98,
  
  "advancedMetrics": {
    "spinRate": 2587,
    "releaseHeight": 6.23,
    "releaseExtension": 2.48,
    "armSlot": 135.2,
    "vertexHi": 6.58,
    "vertexInduced": 17.4,
    "pitchingVelo": 98.2
  },
  
  "lastUpdated": "2026-05-20T08:00:00Z"
}
```

### Get Player Statcast Data
```
GET /players/{mlbId}/statcast

Query Parameters:
  ?season=2026 (required)
  ?eventType=hit (optional: hit, pitch, outcome)
  ?limit=500 (optional, default 100)

Response (200 OK):
{
  "events": [
    {
      "id": "statcast_event_001",
      "date": "2026-05-19",
      "eventType": "hit",
      "pitch": {
        "type": "FF",
        "velocity": 99.2,
        "spinRate": 2487,
        "movement": {
          "horizontalBreak": 18.4,
          "inducedVerticalBreak": 17.2,
          "drop": 14.1
        }
      },
      "result": {
        "exitVelo": 104.3,
        "launchAngle": 25.4,
        "distance": 428,
        "direction": 120.5,
        "barrel": true
      },
      "pitcher": {
        "id": 660272,
        "name": "Justin Verlander"
      },
      "game": {
        "date": "2026-05-19",
        "opponent": "HOU",
        "result": "W"
      }
    }
  ],
  "total": 1247,
  "percentiles": {
    "exitVelo": 95,
    "barrelRate": 100,
    "hardHitRate": 98
  }
}
```

---

## 🎯 SCOUTING GRADES ENDPOINTS

### Get Player Scouting Grades
```
GET /players/{mlbId}/scouting-grades

Query Parameters:
  ?season=2026 (required)

Response (200 OK):
{
  "mlbId": 660271,
  "season": 2026,
  
  "hitting": {
    "hitTool": {
      "grade": 60,
      "projection": 65,
      "description": "Above-average contact ability with advanced approach",
      "trend": "stable"
    },
    "powerTool": {
      "grade": 80,
      "projection": 78,
      "description": "Elite raw power; consistent game power",
      "trend": "stable"
    },
    "speedTool": {
      "grade": 55,
      "projection": 54,
      "description": "Average runner, limited steal threat",
      "trend": "decline"
    },
    "fieldingTool": {
      "grade": 45,
      "projection": 45,
      "description": "Limited defensive value at DH",
      "trend": "stable"
    },
    "armTool": {
      "grade": 50,
      "projection": 50,
      "description": "Standard arm strength",
      "trend": "stable"
    }
  },
  
  "pitching": {
    "fastball": {
      "grade": 80,
      "velocity": 98.2,
      "description": "Elite fastball with excellent life",
      "trend": "improvement"
    },
    "fastballBreak": {
      "grade": 70,
      "description": "Above-average induced vertical break",
      "trend": "stable"
    },
    "sweeper": {
      "grade": 75,
      "whiff": 48.1,
      "description": "Above-average sweeper, high whiff rate",
      "trend": "stable"
    },
    "splitter": {
      "grade": 75,
      "gbRate": 62.4,
      "description": "Plus splitter with strong ground-ball rate",
      "trend": "improvement"
    },
    "command": {
      "grade": 70,
      "csw": 33.8,
      "description": "Above-average control, zone awareness",
      "trend": "stable"
    },
    "athleticism": {
      "grade": 70,
      "description": "Athletic delivery, good body mechanics",
      "trend": "stable"
    }
  },
  
  "evaluated": "2026-05-15",
  "evaluator": "organization_scouts"
}
```

---

## ⚾ PITCH ARSENAL ENDPOINTS

### Get Player Pitch Arsenal
```
GET /players/{mlbId}/pitch-arsenal

Query Parameters:
  ?season=2026 (required)

Response (200 OK):
{
  "mlbId": 660271,
  "season": 2026,
  "pitches": [
    {
      "id": "pitch_ff",
      "type": "Four-Seam Fastball",
      "abbreviation": "FF",
      "color": "#E85A5A",
      "usage": 0.38,
      "usagePercentile": 45,
      
      "velocity": {
        "mean": 99.2,
        "min": 97.1,
        "max": 101.3,
        "percentile": 98
      },
      
      "spinRate": {
        "mean": 2487,
        "min": 2210,
        "max": 2804,
        "percentile": 92
      },
      
      "movement": {
        "horizontalBreak": 18.4,
        "horizontalBreakPercentile": 87,
        "inducedVerticalBreak": 17.2,
        "inducedVerticalBreakPercentile": 94,
        "drop": 14.1,
        "dropPercentile": 56
      },
      
      "effectiveness": {
        "stuffPlus": 147,
        "movementPlus": 134,
        "locationPlus": 98,
        "whiffRate": 0.312,
        "whiffPercentile": 89,
        "gbRate": 0.28,
        "csw": 0.338,
        "cswPercentile": 91
      },
      
      "comparables": [
        {
          "pitcher": "Gerrit Cole",
          "ffVelo": 97.8,
          "stuffPlus": 168
        }
      ]
    },
    {
      "id": "pitch_sw",
      "type": "Sweeper",
      "abbreviation": "SW",
      "color": "#F5C842",
      "usage": 0.31,
      "usagePercentile": 67,
      
      "velocity": {
        "mean": 83.8,
        "percentile": 78
      },
      
      "spinRate": {
        "mean": 2645,
        "percentile": 89
      },
      
      "movement": {
        "horizontalBreak": -20.3,
        "inducedVerticalBreak": 12.4,
        "drop": 48.1
      },
      
      "effectiveness": {
        "stuffPlus": 168,
        "whiffRate": 0.481,
        "whiffPercentile": 98,
        "csw": 0.347,
        "cswPercentile": 95
      }
    },
    {
      "id": "pitch_sp",
      "type": "Splitter",
      "abbreviation": "SP",
      "color": "#5AB4F5",
      "usage": 0.31,
      "usagePercentile": 54,
      
      "velocity": {
        "mean": 88.4,
        "percentile": 82
      },
      
      "movement": {
        "horizontalBreak": 12.1,
        "inducedVerticalBreak": 21.3,
        "drop": 12.1
      },
      
      "effectiveness": {
        "stuffPlus": 142,
        "gbRate": 0.624,
        "gbRatePercentile": 97,
        "csw": 0.328
      }
    }
  ],
  
  "trendAnalysis": {
    "stuffTrend": "stable",
    "usageTrend": "minor_shift_to_sweeper",
    "velocityTrend": "stable",
    "effectiveness": "elite"
  },
  
  "lastUpdated": "2026-05-20T08:00:00Z"
}
```

---

## 💰 CONTRACT ENDPOINTS

### Get Player Contract Details
```
GET /players/{mlbId}/contract

Response (200 OK):
{
  "mlbId": 660271,
  "contractId": "contract_001",
  "team": "LAD",
  "status": "active",
  
  "terms": {
    "total": 700000000,
    "years": 10,
    "startYear": 2024,
    "endYear": 2033,
    "aav": 70000000,
    "aavActual": 46000000 // with deferrals
  },
  
  "deferrals": {
    "total": 680000000,
    "perYear": 68000000,
    "startDeferralYear": 2024,
    "endDeferralYear": 2033,
    "interestRate": 2.0,
    "balanceRemaining": 680000000
  },
  
  "clauses": {
    "noTrade": true,
    "noTradeClauses": {
      "full": true,
      "limitedList": [],
      "limitedTeams": []
    },
    "ntPerformance": null,
    "playerOption": false,
    "teamOption": false,
    "clubOption": false,
    "optionYears": 0
  },
  
  "paymentSchedule": [
    {
      "year": 2024,
      "salary": 2000000,
      "bonus": 0,
      "deferredPayment": 68000000
    },
    // ... more years
  ],
  
  "analysis": {
    "capHit": 46000000,
    "capPercentage": 6.8, // of team payroll
    "surplusValue": 31400000, // estimated
    "marketValue": 7650000, // $/WAR
    "freeAgentComparison": "8.6M/WAR vs market 10.2M/WAR"
  },
  
  "lastUpdated": "2026-05-20T00:00:00Z"
}
```

---

## 🎯 PROJECTION ENDPOINTS

### Get Player Projections
```
GET /players/{mlbId}/projections

Query Parameters:
  ?season=2026 (required)
  ?system=all (optional: steamer, zips, pecota, all)

Response (200 OK):
{
  "mlbId": 660271,
  "season": 2026,
  
  "steamer": {
    "name": "Steamer",
    "system": "fangraphs",
    "updated": "2026-04-01",
    
    "batting": {
      "games": 145,
      "pa": 610,
      "hits": 161,
      "hr": 48,
      "rbi": 118,
      "sb": 5,
      "avg": 0.264,
      "obp": 0.373,
      "slg": 0.598,
      "ops": 0.971,
      "wob": 0.372,
      "wrc": 170,
      "wrcPlus": 158,
      "war": 3.2
    },
    
    "pitching": {
      "gs": 12,
      "ip": 78,
      "w": 7,
      "l": 3,
      "era": 2.98,
      "fip": 2.84,
      "k9": 12.8,
      "bb9": 2.3,
      "war": 1.8
    }
  },
  
  "zips": {
    // similar structure
  },
  
  "pecota": {
    // similar structure
  },
  
  "consensus": {
    "batting": { "war": 3.4 },
    "pitching": { "war": 1.9 },
    "totalWar": 5.3
  }
}
```

---

## 🔄 WEBSOCKET REAL-TIME UPDATES

### WebSocket Connection
```
wss://ws.jarvis-mlb.internal/v1/live

Connection Setup:
const ws = new WebSocket('wss://ws.jarvis-mlb.internal/v1/live');
ws.onopen = () => {
  ws.send(JSON.stringify({
    action: 'SUBSCRIBE',
    playerId: 660271,
    events: ['stats', 'game', 'alert']
  }));
};
```

### Event: Live Game Update
```
{
  "type": "GAME_UPDATE",
  "playerId": 660271,
  "timestamp": "2026-05-20T20:45:32Z",
  "event": {
    "gameId": "gid_2026_05_20_laad_houa_1",
    "inning": 5,
    "outs": 1,
    "baseRunners": [true, false, true],
    "lastAtBat": {
      "pitchCount": 1,
      "outcome": "ball",
      "velocity": 97.2,
      "type": "fastball"
    }
  }
}
```

### Event: Stats Update
```
{
  "type": "STATS_UPDATE",
  "playerId": 660271,
  "timestamp": "2026-05-20T20:30:15Z",
  "statType": "batting",
  "updates": {
    "hits": 162,
    "homeRuns": 54,
    "rbi": 130,
    "avg": 0.271,
    "ops": 1.005
  }
}
```

### Event: Alert
```
{
  "type": "ALERT",
  "playerId": 660271,
  "timestamp": "2026-05-20T14:22:00Z",
  "severity": "high",
  "message": "Player placed on 60-day IL",
  "category": "injury",
  "details": {
    "injuryType": "left shoulder strain",
    "returnDate": "2026-07-19"
  }
}
```

---

## 🔐 ERROR HANDLING & RESPONSES

### Standard Error Response
```json
{
  "error": {
    "code": "PLAYER_NOT_FOUND",
    "message": "Player with ID 999999 does not exist",
    "statusCode": 404,
    "timestamp": "2026-05-20T14:32:15Z",
    "requestId": "req_abc123def456"
  }
}
```

### Error Codes
```
200 OK              - Request successful
400 BAD_REQUEST     - Invalid parameters
401 UNAUTHORIZED    - Missing/invalid auth token
403 FORBIDDEN       - Insufficient permissions
404 NOT_FOUND       - Resource doesn't exist
429 RATE_LIMITED    - Too many requests
500 SERVER_ERROR    - Server error
502 BAD_GATEWAY     - Service unavailable
503 SERVICE_DOWN    - Maintenance/outage
```

### Retry Logic
```javascript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.ok) return response;
      
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After')) * 1000;
        await new Promise(resolve => setTimeout(resolve, retryAfter));
        continue;
      }
      
      if (response.status >= 500 && i < maxRetries - 1) {
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}
```

---

## 💾 CLIENT-SIDE CACHING STRATEGY

### LocalStorage Keys
```javascript
// Single player profile (TTL: 30 min)
localStorage['jarvis:player:{mlbId}'] = JSON.stringify({
  data: { /* player object */ },
  timestamp: Date.now(),
  ttl: 30 * 60 * 1000
});

// Player search results (TTL: 1 hour)
localStorage['jarvis:search:{query}'] = JSON.stringify({
  data: [ /* results */ ],
  timestamp: Date.now(),
  ttl: 60 * 60 * 1000
});

// Stats cache (TTL: 2 hours)
localStorage['jarvis:stats:{mlbId}:{season}'] = JSON.stringify({
  data: { /* stats */ },
  timestamp: Date.now(),
  ttl: 2 * 60 * 60 * 1000
});

// Grade cache (TTL: 24 hours)
localStorage['jarvis:grades:{mlbId}:{season}'] = JSON.stringify({
  data: { /* grades */ },
  timestamp: Date.now(),
  ttl: 24 * 60 * 60 * 1000
});
```

### Cache Helper Function
```javascript
function getCachedData(key) {
  const stored = localStorage.getItem(key);
  if (!stored) return null;
  
  const { data, timestamp, ttl } = JSON.parse(stored);
  if (Date.now() - timestamp > ttl) {
    localStorage.removeItem(key);
    return null;
  }
  
  return data;
}

function setCachedData(key, data, ttl) {
  localStorage.setItem(key, JSON.stringify({
    data,
    timestamp: Date.now(),
    ttl
  }));
}
```

---

## 🔄 DATA SYNCHRONIZATION FLOW

### Load Player Data (Complete Flow)
```javascript
async function loadPlayerData(mlbId) {
  // 1. Check cache
  const cached = getCachedData(`jarvis:player:${mlbId}`);
  if (cached) {
    updateUI(cached);
    // Still fetch fresh data in background
    fetchFreshData(mlbId);
    return;
  }
  
  // 2. Show loading state
  showLoadingState();
  
  try {
    // 3. Fetch player profile
    const response = await fetch(`/api/v1/players/${mlbId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const player = await response.json();
    
    // 4. Cache result
    setCachedData(`jarvis:player:${mlbId}`, player, 30 * 60 * 1000);
    
    // 5. Fetch additional data in parallel
    const [stats, grades, arsenal] = await Promise.all([
      fetch(`/api/v1/players/${mlbId}/stats/batting?season=2026`),
      fetch(`/api/v1/players/${mlbId}/scouting-grades?season=2026`),
      fetch(`/api/v1/players/${mlbId}/pitch-arsenal?season=2026`)
    ]);
    
    // 6. Update UI with hero data
    updateHeroSection(player);
    
    // 7. Parse stats/grades/arsenal when ready
    const statsData = await stats.json();
    const gradesData = await grades.json();
    const arsenalData = await arsenal.json();
    
    // 8. Update dimension bars, pitch cards, etc.
    updateDimensionBars(player);
    updateInsights(player, statsData);
    updatePitchArsenal(arsenalData);
    
    // 9. Subscribe to WebSocket updates
    subscribeToLiveUpdates(mlbId);
    
  } catch (error) {
    showErrorState(error.message);
    // Optionally show stale cache data
    const staleData = JSON.parse(localStorage.getItem(`jarvis:player:${mlbId}`));
    if (staleData) updateUI(staleData.data);
  }
}
```

---

## 🎯 BATCH OPERATIONS

### Load Multiple Players (for comparison)
```javascript
async function loadPlayersForComparison(playerIds) {
  try {
    const response = await fetch('/api/v1/players/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ids: playerIds,
        season: 2026
      })
    });
    
    const { players, errors } = await response.json();
    
    if (errors.length > 0) {
      console.warn('Some players failed to load:', errors);
    }
    
    return players;
  } catch (error) {
    console.error('Batch load failed:', error);
    return [];
  }
}
```

---

## 📈 PAGINATION PATTERNS

### Search Results Pagination
```javascript
let currentPage = 0;
const pageSize = 25;

async function searchPlayers(query) {
  currentPage = 0;
  const results = [];
  
  while (true) {
    const response = await fetch(
      `/api/v1/players/search?q=${query}&limit=${pageSize}&offset=${currentPage * pageSize}`
    );
    const data = await response.json();
    
    results.push(...data.results);
    
    if (!data.hasMore) break;
    currentPage++;
  }
  
  return results;
}

// Load next page (infinite scroll)
async function loadNextPage(query) {
  currentPage++;
  const response = await fetch(
    `/api/v1/players/search?q=${query}&limit=${pageSize}&offset=${currentPage * pageSize}`
  );
  const data = await response.json();
  return data.results;
}
```

---

## 🔔 NOTIFICATION SYSTEM

### Subscribe to Alerts
```javascript
function subscribeToPlayerAlerts(mlbId) {
  ws.send(JSON.stringify({
    action: 'SUBSCRIBE_ALERTS',
    playerId: mlbId
  }));
  
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    
    if (message.type === 'ALERT') {
      showNotification({
        title: message.message,
        severity: message.severity,
        details: message.details,
        action: () => {
          // Handle alert (e.g., navigate to injury page)
        }
      });
    }
  };
}
```

---

## 📋 API INTEGRATION CHECKLIST

- [ ] Authentication tokens stored securely (HttpOnly cookies preferred)
- [ ] CORS headers configured correctly
- [ ] Rate limiting handled with exponential backoff
- [ ] Caching strategy implemented and tested
- [ ] WebSocket reconnection logic in place
- [ ] Error messages user-friendly
- [ ] Loading states visible during fetches
- [ ] Stale data fallback implemented
- [ ] Request deduplication (don't fetch same data twice)
- [ ] Analytics logged (API calls, errors, latency)
- [ ] All endpoints documented in Postman/Swagger

---

**API Integration Guide Version**: 2.7  
**Last Updated**: May 2026  
**Status**: PRODUCTION READY
