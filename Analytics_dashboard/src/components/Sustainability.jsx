import { Leaf, Fuel, TrendingDown, Zap, Wind, Droplet } from 'lucide-react'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts'
import { sustainabilityMetrics, weeklyTrend } from '../data/goaData'

const Sustainability = ({ darkMode }) => {
  const emissionsData = [
    { month: 'Jan', saved: 4200, target: 5000 },
    { month: 'Feb', saved: 4800, target: 5000 },
    { month: 'Mar', saved: 5200, target: 5000 },
    { month: 'Apr', saved: 5800, target: 5000 },
    { month: 'May', saved: 6125, target: 5000 },
  ]

  const greenRoutesData = [
    { day: 'Mon', routes: 125 },
    { day: 'Tue', routes: 138 },
    { day: 'Wed', routes: 142 },
    { day: 'Thu', routes: 135 },
    { day: 'Fri', routes: 145 },
    { day: 'Sat', routes: 98 },
    { day: 'Sun', routes: 85 },
  ]

  const mobilityScoreData = [
    { name: 'Score', value: 87, fill: '#10b981' }
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Sustainability Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Environmental impact and green mobility metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-cyan">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">CO₂ Saved Today</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{sustainabilityMetrics.co2Reduced}</p>
          <p className="text-xs text-green-500 mt-2">+15% vs average</p>
        </div>

        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float-slow box-glow-blue">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
            <Fuel className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fuel Saved</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{sustainabilityMetrics.fuelSavedToday}</p>
          <p className="text-xs text-green-500 mt-2">Optimized routes</p>
        </div>

        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-purple">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
            <TrendingDown className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Idle Time Reduced</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{sustainabilityMetrics.idleTimeReduced}</p>
          <p className="text-xs text-cyan-500 mt-2">Smart traffic flow</p>
        </div>

        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float-slow box-glow-cyan">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mobility Score</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{sustainabilityMetrics.mobilityScore}</p>
          <p className="text-xs text-purple-500 mt-2">Excellent rating</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CO₂ Emissions Saved */}
        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-cyan">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            CO₂ Emissions Saved (Monthly)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={emissionsData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="month" stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                  border: '1px solid #10b981',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="saved" 
                stroke="#10b981" 
                fill="url(#colorSaved)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="target" 
                stroke="#94a3b8" 
                fill="url(#colorTarget)"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <defs>
                <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.05} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Green Routes Optimization */}
        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float-slow box-glow-blue">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Green Route Optimization (Weekly)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={greenRoutesData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="day" stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                  border: '1px solid #06b6d4',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="routes" fill="url(#colorRoutes)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorRoutes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={1} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mobility Score Gauge */}
        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-purple">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Smart Mobility Efficiency Score
          </h2>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="60%" 
                outerRadius="90%" 
                data={mobilityScoreData}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  minAngle={15}
                  background
                  clockWise
                  dataKey="value"
                  cornerRadius={10}
                />
                <text 
                  x="50%" 
                  y="50%" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  className="text-5xl font-bold"
                  fill={darkMode ? '#ffffff' : '#1f2937'}
                >
                  {sustainabilityMetrics.mobilityScore}
                </text>
                <text 
                  x="50%" 
                  y="60%" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  className="text-sm"
                  fill={darkMode ? '#94a3b8' : '#64748b'}
                >
                  Excellent
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Reduction Impact */}
        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float-slow box-glow-cyan">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Traffic Reduction Impact
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Traffic Reduction</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">{sustainabilityMetrics.trafficReduction}</span>
              </div>
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 w-[23%]"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Green Routes Active</span>
                <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{sustainabilityMetrics.greenRoutes}</span>
              </div>
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 w-[72%]"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Efficient Trips</span>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{sustainabilityMetrics.efficientTrips}</span>
              </div>
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-600 w-[81%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-cyan">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Carbon Offset</h3>
            <Wind className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
            {sustainabilityMetrics.carbonOffset}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Equivalent to planting 164 trees</p>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">Monthly Target: 10 tons</p>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 w-[82%]"></div>
            </div>
          </div>
        </div>

        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float-slow box-glow-blue">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Air Quality Impact</h3>
            <Droplet className="w-6 h-6 text-cyan-500" />
          </div>
          <p className="text-4xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">+18%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Improvement in air quality index</p>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>PM2.5 Reduction</span>
              <span className="font-semibold text-cyan-600 dark:text-cyan-400">12 µg/m³</span>
            </div>
          </div>
        </div>

        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-purple">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Energy Savings</h3>
            <Zap className="w-6 h-6 text-yellow-500" />
          </div>
          <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">3,250 kWh</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Equivalent energy saved this month</p>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">Powers 108 homes for a day</p>
          </div>
        </div>
      </div>

      {/* Sustainability Goals */}
      <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float-slow box-glow-cyan">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Sustainability Goals Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Monthly Targets</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">CO₂ Reduction Goal</span>
                  <span className="text-sm font-bold text-gray-800 dark:text-white">6,125 / 7,000 kg</span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 w-[87%]"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fuel Savings Goal</span>
                  <span className="text-sm font-bold text-gray-800 dark:text-white">2,450 / 3,000 L</span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-red-600 w-[82%]"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Green Routes Goal</span>
                  <span className="text-sm font-bold text-gray-800 dark:text-white">145 / 150</span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 w-[97%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Achievements</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">Eco Champion</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Exceeded CO₂ reduction target</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">Efficiency Master</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">87% mobility score achieved</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">Traffic Reducer</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">23% congestion reduction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sustainability
