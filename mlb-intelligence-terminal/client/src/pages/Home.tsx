import React, { useState } from 'react';
import { Search, ChevronDown, Settings, HelpCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlayerProfile } from '@/components/PlayerProfile';

// Player data with Savant-style metrics
const playersData = [
  {
    name: 'Aaron Judge',
    team: 'NYY',
    position: 'RF',
    number: 99,
    photo: '👤',
    stats: {
      pa: 235,
      avg: '.342',
      woba: '.490',
      xwoba: '.481',
      ev: '93.7',
      hardHit: '58.2',
      barrel: '19.3',
      xba: '.316',
      xslg: '.645',
      bb: '18.3',
      k: '24.1',
      chase: '18.7',
      war: '3.7',
    },
    percentiles: {
      xwoba: 90,
      barrel: 89,
      hardHit: 87,
      avgEV: 85,
      laSweet: 92,
      batSpeed: 70,
      sprintSpeed: 45,
      chaseRate: 76,
      whiffRate: 48,
    },
  },
  {
    name: 'Juan Soto',
    team: 'NYY',
    position: 'LF',
    number: 22,
    photo: '👤',
    stats: {
      pa: 214,
      avg: '.308',
      woba: '.454',
      xwoba: '.448',
      ev: '91.1',
      hardHit: '53.1',
      barrel: '16.7',
      xba: '.300',
      xslg: '.573',
      bb: '20.6',
      k: '17.8',
      chase: '15.6',
      war: '2.8',
    },
    percentiles: {
      xwoba: 85,
      barrel: 82,
      hardHit: 78,
      avgEV: 80,
      laSweet: 88,
      batSpeed: 65,
      sprintSpeed: 40,
      chaseRate: 72,
      whiffRate: 42,
    },
  },
  {
    name: 'Shohei Ohtani',
    team: 'LAD',
    position: 'DH',
    number: 17,
    photo: '👤',
    stats: {
      pa: 233,
      avg: '.310',
      woba: '.465',
      xwoba: '.472',
      ev: '93.2',
      hardHit: '56.7',
      barrel: '18.0',
      xba: '.291',
      xslg: '.648',
      bb: '15.9',
      k: '21.5',
      chase: '17.0',
      war: '3.5',
    },
    percentiles: {
      xwoba: 88,
      barrel: 85,
      hardHit: 84,
      avgEV: 83,
      laSweet: 90,
      batSpeed: 68,
      sprintSpeed: 50,
      chaseRate: 74,
      whiffRate: 45,
    },
  },
];

export default function Home() {
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('leaderboard');

  const playerData = selectedPlayer ? playersData.find(p => p.name === selectedPlayer) : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <div className="text-2xl font-bold text-blue-900">⚾ STATCAST</div>
              <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700">
                <a href="#" className="hover:text-blue-900">PLAYER SEARCH</a>
                <a href="#" className="hover:text-blue-900">LEADERBOARDS</a>
                <a href="#" className="hover:text-blue-900">STATCAST 101</a>
                <a href="#" className="hover:text-blue-900">ABOUT</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Search players..."
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              <div className="text-xl font-bold text-blue-900">MLB ⚾</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-full">
        {activeTab === 'leaderboard' && (
          <div className="p-6 max-w-7xl mx-auto">
            {/* Leaderboard View */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">BATTING LEADERBOARD</h1>
                <div className="text-sm text-gray-500">Data through May 27, 2024</div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4 flex-wrap">
                <Select defaultValue="2024">
                  <SelectTrigger className="w-40 border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all-positions">
                  <SelectTrigger className="w-40 border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-positions">All Positions</SelectItem>
                    <SelectItem value="c">Catcher</SelectItem>
                    <SelectItem value="ss">Shortstop</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger className="w-40 border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teams</SelectItem>
                    <SelectItem value="NYY">New York Yankees</SelectItem>
                    <SelectItem value="LAD">Los Angeles Dodgers</SelectItem>
                  </SelectContent>
                </Select>

                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  🔍 Filters
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  ⬇️ Export
                </button>

                <button className="ml-auto px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  ⚙️ Customize Columns
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex gap-8">
                  <button className="px-4 py-3 border-b-2 border-blue-900 text-sm font-semibold text-blue-900">
                    HITTING
                  </button>
                  <button className="px-4 py-3 border-b-2 border-transparent text-sm font-semibold text-gray-600 hover:text-gray-900">
                    PITCHING
                  </button>
                  <button className="px-4 py-3 border-b-2 border-transparent text-sm font-semibold text-gray-600 hover:text-gray-900">
                    FIELDING
                  </button>
                </div>
              </div>

              {/* Leaderboard Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-blue-900 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">RANK</th>
                      <th className="px-4 py-3 text-left font-semibold">PLAYER</th>
                      <th className="px-4 py-3 text-left font-semibold">TEAM</th>
                      <th className="px-4 py-3 text-center font-semibold">PA</th>
                      <th className="px-4 py-3 text-center font-semibold">AVG</th>
                      <th className="px-4 py-3 text-center font-semibold">wOBA</th>
                      <th className="px-4 py-3 text-center font-semibold">xwOBA</th>
                      <th className="px-4 py-3 text-center font-semibold">EV (MPH)</th>
                      <th className="px-4 py-3 text-center font-semibold">HARD HIT %</th>
                      <th className="px-4 py-3 text-center font-semibold">BARREL %</th>
                      <th className="px-4 py-3 text-center font-semibold">xBA</th>
                      <th className="px-4 py-3 text-center font-semibold">xSLG</th>
                      <th className="px-4 py-3 text-center font-semibold">BB %</th>
                      <th className="px-4 py-3 text-center font-semibold">K %</th>
                      <th className="px-4 py-3 text-center font-semibold">CHASE %</th>
                      <th className="px-4 py-3 text-center font-semibold">WAR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {playersData.map((player, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedPlayer(player.name)}
                      >
                        <td className="px-4 py-3 font-semibold text-gray-900">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-lg">
                              {player.photo}
                            </div>
                            <span className="font-semibold text-gray-900">{player.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-gray-700">{player.team}</td>
                        <td className="px-4 py-3 text-center text-gray-700">{player.stats.pa}</td>
                        <td className="px-4 py-3 text-center text-gray-700">{player.stats.avg}</td>
                        <td className="px-4 py-3 text-center text-gray-700">{player.stats.woba}</td>
                        <td className="px-4 py-3 text-center text-gray-700">{player.stats.xwoba}</td>
                        <td className="px-4 py-3 text-center text-gray-700">{player.stats.ev}</td>
                        <td className="px-4 py-3 text-center text-gray-700">{player.stats.hardHit}</td>
                        <td className="px-4 py-3 text-center text-gray-700">{player.stats.barrel}</td>
                        <td className="px-4 py-3 text-center text-gray-700">{player.stats.xba}</td>
                        <td className="px-4 py-3 text-center text-gray-700">{player.stats.xslg}</td>
                        <td className="px-4 py-3 text-center text-gray-700">{player.stats.bb}</td>
                        <td className="px-4 py-3 text-center text-gray-700">{player.stats.k}</td>
                        <td className="px-4 py-3 text-center text-gray-700">{player.stats.chase}</td>
                        <td className="px-4 py-3 text-center text-gray-700">{player.stats.war}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Showing 1 to 10 of 250 results</div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">←</button>
                  <button className="px-3 py-2 bg-blue-900 text-white rounded-lg text-sm font-semibold">1</button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">2</button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">3</button>
                  <span className="px-3 py-2 text-gray-600">...</span>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">25</button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">→</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Player Detail View */}
        {selectedPlayer && playerData && (
          <div className="p-6 max-w-7xl mx-auto">
            <button
              onClick={() => setSelectedPlayer(null)}
              className="mb-6 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              ← Back to Leaderboard
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              {/* Player Info */}
              <div className="lg:col-span-1">
                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <div className="w-32 h-32 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center text-6xl">
                    {playerData.photo}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{playerData.name}</h2>
                  <div className="text-sm text-gray-600 mb-4">
                    #{playerData.number} {playerData.position} | {playerData.team}
                  </div>
                </div>
              </div>

              {/* Key Stats */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-xs font-semibold text-gray-600 uppercase mb-2">HR</div>
                    <div className="text-3xl font-bold text-gray-900">21</div>
                    <div className="text-xs text-gray-500 mt-1">93rd percentile</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-xs font-semibold text-gray-600 uppercase mb-2">AVG</div>
                    <div className="text-3xl font-bold text-gray-900">{playerData.stats.avg}</div>
                    <div className="text-xs text-gray-500 mt-1">91st percentile</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-xs font-semibold text-gray-600 uppercase mb-2">OPS</div>
                    <div className="text-3xl font-bold text-gray-900">1.068</div>
                    <div className="text-xs text-gray-500 mt-1">90th percentile</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Percentile Rankings */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">STATCAST PERCENTILE RANKINGS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(playerData.percentiles).map(([metric, percentile]) => (
                  <div key={metric} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-gray-900 capitalize">
                        {metric.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-bold text-gray-900">{percentile}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          percentile >= 80
                            ? 'bg-red-600'
                            : percentile >= 50
                            ? 'bg-blue-600'
                            : 'bg-gray-400'
                        }`}
                        style={{ width: `${percentile}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
