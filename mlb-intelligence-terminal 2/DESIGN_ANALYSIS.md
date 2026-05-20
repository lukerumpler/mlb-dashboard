# MLB Intelligence Terminal - Design Analysis

## Visual Examples Insights

### Page 1-3: Win Projection Chart
- **Style**: Bloomberg Terminal-inspired, professional analytics
- **Layout**: Large chart with supporting metrics below
- **Colors**: Navy (#07102D), Orange (#E8722A), Blue (#5AB4F5), Green
- **Typography**: Bold headers, condensed fonts for density
- **Grid**: 28px grid overlay for technical feel

### Page 2: Team Stats Overview (Baltimore Orioles)
- **Header**: Team name, record, key stats in one line
- **Tab Navigation**: Horizontal tabs for different sections (Team Stats, Hot/Cold, Pitching, etc.)
- **Main Content**: 3-column layout with large stat cards
  - Offense panel (AVG, OPS, HR, RBI, OBP, RUNS)
  - Pitching panel (ERA, WHIP, Strikeouts, OPP AVG, WINS, SAVES)
  - Leaders panel (with player avatars and stats)
- **Color Coding**: Orange borders for panels, green for positive metrics
- **Carousel**: Navigation dots at bottom for scrolling through stat sets

### Page 4: Advanced Scouting Sheet (Corbin Carroll)
- **Dense Information**: Multiple panels with percentile rankings, pitch analysis, movement profiles
- **Color System**: Red (elite), Orange (above avg), Green (strength), Blue (weakness)
- **Visualization**: Heat maps, scatter plots, bar charts
- **Video Integration**: Embedded video highlights
- **Professional Layout**: Left sidebar with player bio, right side with detailed metrics

### Page 5: Pitcher Attack Plan (Juan Burgos)
- **Pitch Strategy**: Fastball/Curveball/Changeup breakdown
- **Zone Mapping**: Visual representation of pitch locations
- **Count Usage**: Percentages for different pitch types by count
- **Outcome Data**: SO%, GB%, LD%, FB%, PU% for each pitch type

## User Requirements
- **"Clean and roomy"**: More breathing room, less cramped
- **"All information available"**: Maintain data density but with better spacing
- **Multi-tab system**: Already present, needs refinement
- **Clickable player profiles**: Detailed player analysis views
- **Professional aesthetic**: Bloomberg Terminal + MLB Savant style

## Design Strategy
1. **Increase Vertical Spacing**: More padding between sections
2. **Optimize Grid Layouts**: Use 2-3 column layouts instead of 4+ for breathing room
3. **Hierarchical Information**: Primary stats larger, secondary stats smaller
4. **Card-Based Design**: Clear separation of information blocks
5. **Color-Coded Semantics**: Maintain red/orange/green/blue system
6. **Responsive Panels**: Collapsible sections for advanced metrics
7. **Typography Hierarchy**: Bold headers, condensed subheaders, regular body text
