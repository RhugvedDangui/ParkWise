import { TrendingUp, Activity, BarChart3, AlertTriangle } from 'lucide-react'
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import { 
  trafficZones, 
  vehicleFlowData, 
  congestionHeatIndex,
  weeklyTrend,
  aiPredictions
} from '../data/goaData'

const TrafficAnalytics = ({ darkMode }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Traffic Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Comprehensive traffic flow analysis across Goa</p>
      </div>

      {/* Traffic Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-cyan">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Vehicles</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">8,120</p>
          <p className="text-xs text-green-500 mt-2">+12% from yesterday</p>
        </div>

        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float-slow box-glow-blue">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Congestion</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">64%</p>
          <p className="text-xs text-red-500 mt-2">High traffic zones: 4</p>
        </div>

        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-purple">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Speed</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">24 km/h</p>
          <p className="text-xs text-yellow-500 mt-2">Below optimal</p>
        </div>

        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float-slow box-glow-cyan">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Peak Hour</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">6 PM</p>
          <p className="text-xs text-cyan-500 mt-2">680 vehicles/hour</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Flow Analysis */}
        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-cyan">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Daily Vehicle Flow Analysis
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={vehicleFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="time" stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                  border: '1px solid #06b6d4',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="inflow" 
                stackId="1"
                stroke="#06b6d4" 
                fill="url(#colorInflow)"
              />
              <Area 
                type="monotone" 
                dataKey="outflow" 
                stackId="2"
                stroke="#8b5cf6" 
                fill="url(#colorOutflow)"
              />
              <defs>
                <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Trend */}
        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float-slow box-glow-blue">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Weekly Congestion Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="day" stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                  border: '1px solid #0080ff',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="congestion" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ fill: '#ef4444', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Congestion Heat Index */}
        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-purple">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Smart Congestion Heat Index
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={congestionHeatIndex} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
              <XAxis type="number" stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <YAxis dataKey="zone" type="category" stroke={darkMode ? '#94a3b8' : '#64748b'} width={120} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                  border: '1px solid #8b5cf6',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="index" fill="url(#colorHeat)" radius={[0, 8, 8, 0]} />
              <defs>
                <linearGradient id="colorHeat" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity={1} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={1} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Traffic Prediction */}
        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float-slow box-glow-cyan">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            AI Traffic Prediction Graph
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={aiPredictions}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="hour" stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                  border: '1px solid #06b6d4',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#06b6d4" 
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: '#06b6d4', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Traffic Zones Table */}
      <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-blue">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Zone-wise Traffic Status
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Zone</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Congestion</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Vehicles</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Avg Speed</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {trafficZones.map((zone, index) => (
                <tr 
                  key={index} 
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-4 px-4 font-medium text-gray-800 dark:text-white">{zone.zone}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mr-3">
                        <div 
                          className={`h-full ${
                            zone.congestion > 75 ? 'bg-red-500' :
                            zone.congestion > 50 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${zone.congestion}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{zone.congestion}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{zone.vehicles}</td>
                  <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{zone.avgSpeed} km/h</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      zone.congestion > 75 ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                      zone.congestion > 50 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                      'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    }`}>
                      {zone.congestion > 75 ? 'High' : zone.congestion > 50 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TrafficAnalytics
