# MLB Analytics Dashboard — Bug Report & Improvements

## Critical Bugs Found

### 1. **API Proxy Function Undefined** ⚠️ CRITICAL
**Location:** Line 2558, 2462, and multiple places throughout
**Issue:** Code calls `fetchJSON()` and `apiURL()` functions but they are not defined anywhere in the file.
**Impact:** All API calls will fail silently, breaking data loading entirely.
**Fix:** Add helper functions before they're called.

```javascript
// Missing function definitions:
function apiURL(path) {
  return '/api/mlb?path=' + encodeURIComponent(path);
}

async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return await response.json();
  } catch (err) {
    console.error('Fetch error:', err);
    return null;
  }
}
```

### 2. **Missing Global Variables** ⚠️ CRITICAL
**Location:** Top of script section
**Issue:** Variables `curTeam`, `curTeamName`, `savedNotes`, `savedQuotes`, `devMode`, `SEASON` are used but never initialized.
**Impact:** Runtime errors when functions try to access undefined variables.
**Fix:** Initialize all globals at top of script.

```javascript
let curTeam = 109;
let curTeamName = 'Arizona Diamondbacks';
let savedNotes = [];
let savedQuotes = [];
let devMode = false;
const SEASON = 2026;
```

### 3. **Missing `initTeamSelect()` Function**
**Location:** Line 2704 - called in init but not defined
**Issue:** Function referenced but missing from code.
**Impact:** Team selection dropdown won't initialize.
**Fix:** Add team selection initialization function.

### 4. **Missing `loadTeam()` Function**
**Location:** Line 2707 - called in init but not defined
**Issue:** Function referenced but missing from code.
**Impact:** Default team data won't load.
**Fix:** Add team data loading function.

### 5. **Missing `updateTimestamp()` Function**
**Location:** Line 2708 - called in init but not defined
**Issue:** Function referenced but missing from code.
**Impact:** UI will fail to update on initialization.
**Fix:** Add timestamp update function.

### 6. **Hardcoded Test Data in `renderSplitsTable()`**
**Location:** Lines 2496-2503
**Issue:** Function ignores the `stat` parameter and always renders hardcoded data.
**Fix:** Make function use actual data parameter.

### 7. **Array Index Bug in `deleteNote()`**
**Location:** Lines 2621, 2639
**Issue:** When notes are reversed for display (line 2615), the delete index calculation is complex and error-prone.
**Impact:** Deleting a note might delete the wrong one.
**Fix:** Store original index with note or simplify deletion logic.

### 8. **localStorage Error Handling Too Silent**
**Location:** Lines 2632, 2640, 2675, etc.
**Issue:** `try/catch` blocks silently swallow errors without warning user.
**Impact:** User data might be lost without notification if localStorage is full/unavailable.
**Fix:** Add explicit error logging.

### 9. **Missing Team Data Object**
**Location:** Missing throughout
**Issue:** No object mapping team IDs to team names and colors.
**Impact:** Team selection and color updates won't work properly.
**Fix:** Add comprehensive team data object.

### 10. **Race Condition in `loadProspects()`**
**Location:** Lines 2577-2579
**Issue:** Promise.all with async map could fail if API returns null/undefined.
**Impact:** Prospects page might crash on error.
**Fix:** Add proper null checks and error handling.

---

## Performance Issues

### 11. **No Request Debouncing on Team Changes**
**Issue:** Changing team selection could trigger multiple simultaneous API calls.
**Fix:** Add debounce wrapper for team selection handler.

### 12. **sessionStorage Not Used Despite Documentation**
**Issue:** Code mentions caching in sessionStorage (line 190) but never implements it.
**Fix:** Implement session caching for faster data access.

### 13. **No Loading State Management**
**Issue:** Multiple async operations don't properly manage loading states.
**Fix:** Add loading queue or state machine.

---

## Code Quality Issues

### 14. **Inconsistent Error Handling**
**Issue:** Some functions use `try/catch`, others don't.
**Fix:** Standardize error handling across all functions.

### 15. **Missing Input Validation**
**Location:** Lines 2627-2630 (addNote), 2671-2673 (addQuote)
**Issue:** Trim checks exist but no XSS prevention or length validation.
**Fix:** Add proper input sanitization.

### 16. **Unused Function Parameter**
**Location:** Line 2495 - `renderSplitsTable(stat)` parameter never used
**Fix:** Either use it or remove it.

---

## Recommended Fixes Priority

| Priority | Issue | Impact |
|----------|-------|--------|
| **P0 - Critical** | Missing `fetchJSON()` & `apiURL()` | App completely broken |
| **P0 - Critical** | Undefined globals | Runtime errors everywhere |
| **P0 - Critical** | Missing init functions | App won't load |
| **P1 - High** | Missing team data | UI/selection broken |
| **P1 - High** | Promise error handling | Crash on API failure |
| **P2 - Medium** | Note deletion bug | Data loss risk |
| **P2 - Medium** | Input validation | Security risk |
| **P3 - Low** | Performance optimization | Slow UI |

---

## Summary

**Current Status:** Code is non-functional due to missing critical helper functions and global state initialization.

**Estimated Fix Time:** 2-3 hours to add missing functions and proper error handling.

**Next Steps:** Implement fixes in priority order, test team selection, test API calls with network tab open.
