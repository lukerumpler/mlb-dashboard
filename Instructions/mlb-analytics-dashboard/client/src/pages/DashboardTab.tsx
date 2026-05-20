import React, { useState, useEffect, useRef } from 'react';

interface TeamData {
  id: number;
  name: string;
  abbr: string;
  p: string;
  s: string;
}

interface StandingsRow {
  team: string;
  w: number;
  l: number;
  pct: number;
  gb: number;
}

interface DashboardTabProps {
  currentTeam: number;
  currentSeason: number;
  teamData: TeamData;
  teams: TeamData[];
}

export default function DashboardTab({ currentTeam, currentSeason, teamData, teams }: DashboardTabProps) {
  const [standings, setStandings] = useState<StandingsRow[]>([]);
  const [offenseStats, setOffenseStats] = useState<any>(null);
  const [pitchingStats, setPitchingStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fetch standings data
  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        // Mock standings data — in production, call /api/mlb?path=/standings
        const mockStandings: StandingsRow[] = [
          { team: 'Houston Astros', w: 52, l: 28, pct: 0.650, gb: 0 },
          { team: 'Arizona Diamondbacks', w: 50, l: 30, pct: 0.625, gb: 2 },
          { team: 'Los Angeles Dodgers', w: 48, l: 32, pct: 0.600, gb: 4 },
          { team: 'San Diego Padres', w: 45, l: 35, pct: 0.563, gb: 7 },
          { team: 'Colorado Rockies', w: 40, l: 40, pct: 0.500, gb: 12 },
        ];
        setStandings(mockStandings);

        // Mock offense stats
        setOffenseStats({
          avg: '.285',
          obp: '.352',
          slg: '.478',
          ops: '.830',
          runs: 425,
          hits: 1089,
          hr: 142,
          rbi: 412,
        });

        // Mock pitching stats
        setPitchingStats({
          era: '3.68',
          whip: '1.12',
          k9: '9.2',
          bb9: '3.1',
          wins: 50,
          losses: 30,
          sv: 28,
          ip: '1247.1',
        });

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch standings:', error);
        setLoading(false);
      }
    };

    fetchStandings();
  }, [currentTeam, currentSeason]);

  // Draw win projection chart
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    // Clear canvas
    ctx.fillStyle = '#07102D';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(90,180,245,0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const y = (canvas.height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = 'rgba(90,180,245,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 20);
    ctx.lineTo(60, canvas.height - 40);
    ctx.lineTo(canvas.width - 20, canvas.height - 40);
    ctx.stroke();

    // Draw sample projection curve
    ctx.strokeStyle = '#E8722A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const startX = 80;
    const startY = canvas.height - 100;
    ctx.moveTo(startX, startY);

    for (let i = 1; i <= 162; i++) {
      const x = startX + (i / 162) * (canvas.width - 120);
      const winRate = 0.55 + Math.sin(i / 30) * 0.05;
      const projectedWins = Math.round(i * winRate);
      const y = canvas.height - 40 - (projectedWins / 90) * (canvas.height - 80);
      if (i === 1) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = '#A0B4CC';
    ctx.font = '12px "Barlow Condensed", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GAMES PLAYED', canvas.width / 2, canvas.height - 10);
    ctx.save();
    ctx.translate(20, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('PROJECTED WINS', 0, 0);
    ctx.restore();

    // Draw legend
    ctx.fillStyle = '#E8722A';
    ctx.fillRect(canvas.width - 150, 20, 12, 12);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '11px "Barlow", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Projection', canvas.width - 130, 28);
  }, []);

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

  if (loading) {
    return (
      <div style={{ padding: '20px', color: fireIceTheme.textDim }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: fireIceTheme.orange,
            animation: 'pulse 1.5s infinite',
          }} />
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: fireIceTheme.orange,
            animation: 'pulse 1.5s infinite 0.3s',
          }} />
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: fireIceTheme.orange,
            animation: 'pulse 1.5s infinite 0.6s',
          }} />
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
      {/* Top Row: Standings & Win Projection */}
      <div style={{
        background: fireIceTheme.bgCard,
        border: `1px solid ${fireIceTheme.border}`,
        borderRadius: '6px',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px 8px',
          borderBottom: `1px solid ${fireIceTheme.border}`,
        }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1.15rem',
            letterSpacing: '1.5px',
            color: fireIceTheme.white,
          }}>
            NL WEST STANDINGS
          </div>
        </div>

        <div style={{ padding: '12px 14px' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '0.82rem',
          }}>
            <thead>
              <tr>
                <th style={{
                  textAlign: 'left',
                  padding: '7px 10px',
                  color: fireIceTheme.textDim,
                  fontWeight: 600,
                  letterSpacing: '1.2px',
                  fontSize: '0.68rem',
                  textTransform: 'uppercase',
                  borderBottom: `1px solid ${fireIceTheme.border}`,
                }}>Team</th>
                <th style={{
                  textAlign: 'center',
                  padding: '7px 10px',
                  color: fireIceTheme.textDim,
                  fontWeight: 600,
                  letterSpacing: '1.2px',
                  fontSize: '0.68rem',
                  textTransform: 'uppercase',
                  borderBottom: `1px solid ${fireIceTheme.border}`,
                }}>W</th>
                <th style={{
                  textAlign: 'center',
                  padding: '7px 10px',
                  color: fireIceTheme.textDim,
                  fontWeight: 600,
                  letterSpacing: '1.2px',
                  fontSize: '0.68rem',
                  textTransform: 'uppercase',
                  borderBottom: `1px solid ${fireIceTheme.border}`,
                }}>L</th>
                <th style={{
                  textAlign: 'center',
                  padding: '7px 10px',
                  color: fireIceTheme.textDim,
                  fontWeight: 600,
                  letterSpacing: '1.2px',
                  fontSize: '0.68rem',
                  textTransform: 'uppercase',
                  borderBottom: `1px solid ${fireIceTheme.border}`,
                }}>PCT</th>
                <th style={{
                  textAlign: 'center',
                  padding: '7px 10px',
                  color: fireIceTheme.textDim,
                  fontWeight: 600,
                  letterSpacing: '1.2px',
                  fontSize: '0.68rem',
                  textTransform: 'uppercase',
                  borderBottom: `1px solid ${fireIceTheme.border}`,
                }}>GB</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    background: row.team === teamData.name ? 'rgba(232,114,42,0.15)' : 'transparent',
                  }}
                >
                  <td style={{
                    padding: '8px 10px',
                    borderBottom: `1px solid rgba(90,180,245,0.06)`,
                    color: row.team === teamData.name ? fireIceTheme.white : fireIceTheme.gray,
                    fontWeight: row.team === teamData.name ? 600 : 400,
                  }}>
                    {row.team}
                  </td>
                  <td style={{
                    padding: '8px 10px',
                    borderBottom: `1px solid rgba(90,180,245,0.06)`,
                    color: fireIceTheme.gray,
                    textAlign: 'center',
                  }}>
                    {row.w}
                  </td>
                  <td style={{
                    padding: '8px 10px',
                    borderBottom: `1px solid rgba(90,180,245,0.06)`,
                    color: fireIceTheme.gray,
                    textAlign: 'center',
                  }}>
                    {row.l}
                  </td>
                  <td style={{
                    padding: '8px 10px',
                    borderBottom: `1px solid rgba(90,180,245,0.06)`,
                    color: fireIceTheme.blue,
                    textAlign: 'center',
                  }}>
                    {row.pct.toFixed(3).substring(1)}
                  </td>
                  <td style={{
                    padding: '8px 10px',
                    borderBottom: `1px solid rgba(90,180,245,0.06)`,
                    color: fireIceTheme.textDim,
                    textAlign: 'center',
                  }}>
                    {row.gb === 0 ? '—' : row.gb}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Win Projection Chart */}
      <div style={{
        background: fireIceTheme.bgCard,
        border: `1px solid ${fireIceTheme.border}`,
        borderRadius: '6px',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px 8px',
          borderBottom: `1px solid ${fireIceTheme.border}`,
        }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1.15rem',
            letterSpacing: '1.5px',
            color: fireIceTheme.white,
          }}>
            WIN PROJECTION
          </div>
        </div>

        <div style={{ padding: '12px 14px' }}>
          <canvas
            ref={canvasRef}
            style={{
              width: '100%',
              height: '250px',
              display: 'block',
            }}
          />
        </div>
      </div>

      {/* Offense Stats */}
      <div style={{
        background: fireIceTheme.bgCard,
        border: `1px solid ${fireIceTheme.border}`,
        borderRadius: '6px',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px 8px',
          borderBottom: `1px solid ${fireIceTheme.border}`,
        }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1.15rem',
            letterSpacing: '1.5px',
            color: fireIceTheme.white,
          }}>
            OFFENSE STATS
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          background: fireIceTheme.border,
        }}>
          {offenseStats && [
            { label: 'AVG', value: offenseStats.avg },
            { label: 'OBP', value: offenseStats.obp },
            { label: 'SLG', value: offenseStats.slg },
            { label: 'OPS', value: offenseStats.ops },
            { label: 'RUNS', value: offenseStats.runs },
            { label: 'HR', value: offenseStats.hr },
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                background: fireIceTheme.bgCard,
                padding: '14px 12px 10px',
                textAlign: 'center',
              }}
            >
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '2rem',
                letterSpacing: '1px',
                lineHeight: 1,
                color: fireIceTheme.white,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '1.5px',
                color: fireIceTheme.textDim,
                textTransform: 'uppercase',
                marginTop: '4px',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pitching Stats */}
      <div style={{
        background: fireIceTheme.bgCard,
        border: `1px solid ${fireIceTheme.border}`,
        borderRadius: '6px',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px 8px',
          borderBottom: `1px solid ${fireIceTheme.border}`,
        }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1.15rem',
            letterSpacing: '1.5px',
            color: fireIceTheme.white,
          }}>
            PITCHING STATS
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          background: fireIceTheme.border,
        }}>
          {pitchingStats && [
            { label: 'ERA', value: pitchingStats.era },
            { label: 'WHIP', value: pitchingStats.whip },
            { label: 'K/9', value: pitchingStats.k9 },
            { label: 'WINS', value: pitchingStats.wins },
            { label: 'SAVES', value: pitchingStats.sv },
            { label: 'IP', value: pitchingStats.ip },
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                background: fireIceTheme.bgCard,
                padding: '14px 12px 10px',
                textAlign: 'center',
              }}
            >
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '2rem',
                letterSpacing: '1px',
                lineHeight: 1,
                color: fireIceTheme.white,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '1.5px',
                color: fireIceTheme.textDim,
                textTransform: 'uppercase',
                marginTop: '4px',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
