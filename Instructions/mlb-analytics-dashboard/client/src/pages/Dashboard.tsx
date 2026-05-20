import React, { useState, useEffect } from 'react';
import DashboardTab from './DashboardTab';

/**
 * MLB Analytics Dashboard — Fire & Ice Terminal
 * A professional-grade baseball intelligence platform for scouts and analysts
 */

export default function Dashboard() {
  const [currentTeam, setCurrentTeam] = useState(109); // Arizona Diamondbacks
  const [currentSeason, setCurrentSeason] = useState(2026);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Fire & Ice theme colors
  const fireIceTheme = {
    bg: '#07102D',
    bgCard: '#0C1A40',
    border: 'rgba(90,180,245,0.12)',
    orange: '#E8722A',
    blue: '#5AB4F5',
    red: '#E85A5A',
    green: '#4DCE8A',
    gold: '#F5C842',
    gray: '#A0B4CC',
    white: '#FFFFFF',
    textDim: '#6B85A0',
    navy: '#1A3A5C',
  };

  // All 30 MLB teams with primary and secondary colors
  const teams = [
    { id: 108, name: 'Los Angeles Angels', abbr: 'LAA', p: '#BA0021', s: '#003263' },
    { id: 109, name: 'Arizona Diamondbacks', abbr: 'ARI', p: '#A71930', s: '#E3D4AD' },
    { id: 110, name: 'Baltimore Orioles', abbr: 'BAL', p: '#DF4601', s: '#27251F' },
    { id: 111, name: 'Boston Red Sox', abbr: 'BOS', p: '#BD3039', s: '#0D2B56' },
    { id: 112, name: 'Chicago Cubs', abbr: 'CHC', p: '#0E3386', s: '#CC3433' },
    { id: 113, name: 'Cincinnati Reds', abbr: 'CIN', p: '#C6011F', s: '#000000' },
    { id: 114, name: 'Cleveland Guardians', abbr: 'CLE', p: '#E31937', s: '#002B5C' },
    { id: 115, name: 'Colorado Rockies', abbr: 'COL', p: '#33006F', s: '#C4CED4' },
    { id: 116, name: 'Detroit Tigers', abbr: 'DET', p: '#0C2340', s: '#FA4616' },
    { id: 117, name: 'Houston Astros', abbr: 'HOU', p: '#002D62', s: '#EB6E1F' },
    { id: 118, name: 'Kansas City Royals', abbr: 'KC', p: '#004687', s: '#C09A5B' },
    { id: 119, name: 'Los Angeles Dodgers', abbr: 'LAD', p: '#005A9C', s: '#EF3E42' },
    { id: 120, name: 'Washington Nationals', abbr: 'WSH', p: '#AB0003', s: '#14225A' },
    { id: 121, name: 'New York Mets', abbr: 'NYM', p: '#002D72', s: '#FF5910' },
    { id: 133, name: 'Oakland Athletics', abbr: 'OAK', p: '#003831', s: '#EFB21E' },
    { id: 134, name: 'Pittsburgh Pirates', abbr: 'PIT', p: '#FDB827', s: '#27251F' },
    { id: 135, name: 'San Diego Padres', abbr: 'SD', p: '#2F241D', s: '#FFC425' },
    { id: 136, name: 'Seattle Mariners', abbr: 'SEA', p: '#0C2C56', s: '#005C5C' },
    { id: 137, name: 'San Francisco Giants', abbr: 'SF', p: '#FD5A1E', s: '#27251F' }, // Fixed colors
    { id: 138, name: 'St. Louis Cardinals', abbr: 'STL', p: '#C41E3A', s: '#0C2340' },
    { id: 139, name: 'Tampa Bay Rays', abbr: 'TB', p: '#092C5C', s: '#8FBCE6' },
    { id: 140, name: 'Texas Rangers', abbr: 'TEX', p: '#003278', s: '#C0111F' },
    { id: 141, name: 'Toronto Blue Jays', abbr: 'TOR', p: '#134A8E', s: '#1D2D5C' },
    { id: 142, name: 'Minnesota Twins', abbr: 'MIN', p: '#002B5C', s: '#D31145' },
    { id: 143, name: 'Philadelphia Phillies', abbr: 'PHI', p: '#E81828', s: '#002D72' },
    { id: 144, name: 'Atlanta Braves', abbr: 'ATL', p: '#CE1141', s: '#13274F' },
    { id: 145, name: 'Chicago White Sox', abbr: 'CWS', p: '#27251F', s: '#C4CED4' },
    { id: 146, name: 'Miami Marlins', abbr: 'MIA', p: '#00A3E0', s: '#EF3340' },
    { id: 147, name: 'New York Yankees', abbr: 'NYY', p: '#003087', s: '#C4CED4' },
    { id: 158, name: 'Milwaukee Brewers', abbr: 'MIL', p: '#12284B', s: '#FFC52F' },
  ];

  const getTeam = (id: number) => teams.find(t => t.id === id) || teams[0];
  const currentTeamData = getTeam(currentTeam);

  return (
    <div style={{
      background: fireIceTheme.bg,
      color: fireIceTheme.white,
      fontFamily: "'Barlow', sans-serif",
      minHeight: '100vh',
      backgroundImage: `
        linear-gradient(rgba(90,180,245,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(90,180,245,0.025) 1px, transparent 1px)
      `,
      backgroundSize: '28px 28px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '10px 20px',
        background: 'rgba(7,16,45,0.96)',
        borderBottom: `1px solid ${fireIceTheme.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1.5rem',
          letterSpacing: '2px',
          color: currentTeamData.p,
          whiteSpace: 'nowrap',
        }}>
          ⚾ MLB <span style={{ color: currentTeamData.s }}>INTELLIGENCE</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginLeft: 'auto',
          flexShrink: 0,
        }}>
          <select
            value={currentTeam}
            onChange={(e) => setCurrentTeam(parseInt(e.target.value))}
            style={{
              background: fireIceTheme.bgCard,
              border: `1px solid ${fireIceTheme.border}`,
              color: fireIceTheme.white,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '0.85rem',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>

          <select
            value={currentSeason}
            onChange={(e) => setCurrentSeason(parseInt(e.target.value))}
            style={{
              background: fireIceTheme.bgCard,
              border: `1px solid ${fireIceTheme.border}`,
              color: fireIceTheme.white,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '0.85rem',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>

          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '0.75rem',
            color: fireIceTheme.gold,
            letterSpacing: '1px',
            border: `1px solid ${fireIceTheme.gold}`,
            padding: '3px 8px',
            borderRadius: '3px',
            whiteSpace: 'nowrap',
          }}>
            {currentSeason} SEASON
          </div>
        </div>
      </header>

      {/* Team color strip */}
      <div style={{
        height: '3px',
        width: '100%',
        background: `linear-gradient(90deg, ${currentTeamData.p}, ${currentTeamData.s})`,
      }} />

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: 0,
        padding: '0 20px',
        background: 'rgba(7,16,45,0.9)',
        borderBottom: `1px solid ${fireIceTheme.border}`,
        overflowX: 'auto',
      }}>
        {['dashboard', 'personnel', 'analysis', 'profile', 'prospects', 'notes', 'about'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: activeTab === tab ? currentTeamData.p : fireIceTheme.textDim,
              padding: '12px 18px',
              cursor: 'pointer',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === tab ? `2px solid ${currentTeamData.p}` : '2px solid transparent',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {tab === 'dashboard' && 'Dashboard'}
            {tab === 'personnel' && 'Personnel'}
            {tab === 'analysis' && 'Analysis'}
            {tab === 'profile' && 'Player Profile'}
            {tab === 'prospects' && 'Top Prospects'}
            {tab === 'notes' && 'Scout Notes'}
            {tab === 'about' && 'About Me'}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main style={{ padding: '16px 20px', animation: 'fadeIn 0.2s ease' }}>
        {activeTab === 'dashboard' && (
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', marginBottom: '16px' }}>
              {currentTeamData.name} — {currentSeason} Season
            </h2>
            <p style={{ color: fireIceTheme.textDim }}>Dashboard content coming soon...</p>
          </div>
        )}

        {activeTab === 'personnel' && (
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', marginBottom: '16px' }}>
              Personnel — {currentTeamData.abbr}
            </h2>
            <p style={{ color: fireIceTheme.textDim }}>Personnel content coming soon...</p>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', marginBottom: '16px' }}>
              League Analysis
            </h2>
            <p style={{ color: fireIceTheme.textDim }}>Analysis content coming soon...</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', marginBottom: '16px' }}>
              Player Profile
            </h2>
            <p style={{ color: fireIceTheme.textDim }}>Player Profile content coming soon...</p>
          </div>
        )}

        {activeTab === 'prospects' && (
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', marginBottom: '16px' }}>
              Top Prospects — {currentTeamData.name}
            </h2>
            <p style={{ color: fireIceTheme.textDim }}>Prospects content coming soon...</p>
          </div>
        )}

        {activeTab === 'notes' && (
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', marginBottom: '16px' }}>
              Scout Notes
            </h2>
            <p style={{ color: fireIceTheme.textDim }}>Scout Notes content coming soon...</p>
          </div>
        )}

        {activeTab === 'about' && (
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', marginBottom: '16px' }}>
              About Luke Rumpler
            </h2>
            <p style={{ color: fireIceTheme.textDim }}>About content coming soon...</p>
          </div>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;500;600;700&family=Barlow:wght@300;400;500;600&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
