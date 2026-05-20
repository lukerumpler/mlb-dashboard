import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PlayerProfileProps {
  playerName: string;
  position: string;
  onClose: () => void;
}

export const PlayerProfile: React.FC<PlayerProfileProps> = ({ playerName, position, onClose }) => {
  const playerData = {
    name: playerName,
    position: position,
    number: 27,
    team: 'Los Angeles Dodgers',
    jarvisScore: 87,
    jarvisGrade: 'A',
    riskLevel: 'Low',
    stats: {
      avg: '.310',
      hr: 42,
      rbi: 118,
      ops: '.945',
      xwoba: '.385',
      barrelPct: '14.2%',
    },
    percentiles: {
      'Exit Velocity': 92,
      'Barrel %': 88,
      'xwOBA': 85,
      'Hard Hit %': 81,
      'Sweet Spot %': 78,
    },
    strengths: [
      'Elite contact skills with premium power profile',
      'Top 10% offensive producer',
      '95th percentile home run rate',
      'Consistent performance across all pitch types',
    ],
    weaknesses: [
      'Elevated strikeout rate in high-leverage situations',
      'Performance decline against elite fastballs',
    ],
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border-slate-700/50">
        <CardHeader className="sticky top-0 bg-slate-900/95 border-b border-slate-700/50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-4xl font-black tracking-wider text-white mb-2">
                {playerData.name}
              </CardTitle>
              <div className="text-sm text-slate-400 font-mono">
                {playerData.position} • #{playerData.number} • {playerData.team}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          {/* JARVIS Evaluation */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-slate-800/50 border-slate-700/30">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-5xl font-black text-orange-500">{playerData.jarvisScore}</div>
                  <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">JARVIS Score</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700/30">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-5xl font-black text-green-400">{playerData.jarvisGrade}</div>
                  <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">Grade</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700/30">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-blue-400">{playerData.riskLevel}</div>
                  <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">Risk Level</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="stats" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700/50">
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="percentiles">Percentiles</TabsTrigger>
              <TabsTrigger value="strengths">Strengths</TabsTrigger>
              <TabsTrigger value="weaknesses">Weaknesses</TabsTrigger>
            </TabsList>

            {/* Stats Tab */}
            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(playerData.stats).map(([key, value]) => (
                  <Card key={key} className="bg-slate-800/50 border-slate-700/30">
                    <CardContent className="pt-4">
                      <div className="space-y-1">
                        <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-3xl font-black text-orange-500">{value}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Percentiles Tab */}
            <TabsContent value="percentiles" className="space-y-4">
              {Object.entries(playerData.percentiles).map(([metric, percentile]) => (
                <div key={metric} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{metric}</span>
                    <span className="text-sm font-bold text-orange-500">{percentile}th</span>
                  </div>
                  <div className="w-full bg-slate-700/30 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-orange-400 h-full rounded-full"
                      style={{ width: `${percentile}%` }}
                    />
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Strengths Tab */}
            <TabsContent value="strengths" className="space-y-3">
              {playerData.strengths.map((strength, idx) => (
                <div key={idx} className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex gap-3">
                    <div className="text-green-400 font-bold text-lg">✓</div>
                    <p className="text-sm text-slate-200">{strength}</p>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Weaknesses Tab */}
            <TabsContent value="weaknesses" className="space-y-3">
              {playerData.weaknesses.map((weakness, idx) => (
                <div key={idx} className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex gap-3">
                    <div className="text-red-400 font-bold text-lg">!</div>
                    <p className="text-sm text-slate-200">{weakness}</p>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          {/* Recommendation */}
          <Card className="bg-orange-500/10 border border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-orange-400">RECOMMENDATION</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-200">
                <strong>PRIORITY ACQUISITION</strong> — Elite contact skills with premium power profile. Top 10%
                offensive producer with consistent performance. Low risk profile with strong upside potential.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
