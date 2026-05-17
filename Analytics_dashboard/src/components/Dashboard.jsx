import { 
  Car, 
  ParkingCircle, 
  CheckCircle, 
  Activity, 
  TrendingUp, 
  Zap,
  Leaf,
  Fuel
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { 
  parkingZones, 
  hourlyOccupancy, 
  zoneWiseUsage, 
  peakHoursData,
  aiInsights,
  sustainabilityMetrics
} from '../data/goaData'

const Dashboard = ({ darkMode }) => {
  const totalSlots = parkingZones.reduce((sum, zone) => sum + zone.totalSlots, 0)
  const totalOccupied = parkingZones.reduce((sum, zone) => sum + zone.occupied, 0)
  const totalAvailable = parkingZones.reduce((sum, zone) => sum + zone.available, 0)
  const activeVehicles = 3250
  const congestionIndex = 72
  const mobilityScore = 87

  const statsCards = [
    {
      title: 'Total Parking Slots',
      value: totalSlots.toLocaleString(),
      icon: ParkingCircle,
      color: 'from-cyan-500 to-blue-600',
      glow: 'box-glow-cyan',
      change: '+12 today'
    },
    {
      title: 'Occupied Slots',
      value: totalOccupied.toLocaleString(),
      icon: Car,
      color: 'from-orange-500 to-red-600',
      glow: 'box-glow-blue',
      change: '72% capacity'
    },
    {
      title: 'Available Slots',
      value: totalAvailable.toLocaleString(),
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-600',
      glow: 'box-glow-cyan',
      change: '28% free'
    },
    {
      title: 'Active Vehicles',
      value: activeVehicles.toLocaleString(),
      icon: Activity,
      color: 'from-purple-500 to-pink-600',
      glow: 'box-glow-purple',
      change: '+8% vs yesterday'
    },
    {
      title: 'Congestion Index',
      value: `${congestionIndex}%`,
      icon: TrendingUp,
      color: 'from-yellow-500 to-orange-600',
      glow: 'box-glow-blue',
      change: 'High traffic'
    },
    {
      title: 'Smart Mobility Score',
      value: mobilityScore,
      icon: Zap,
      color: 'from-blue-500 to-cyan-600',
      glow: 'box-glow-cyan',
      change: 'Excellent'
    },
    {
      title: 'CO₂ Saved Today',
      value: sustainabilityMetrics.co2Reduced,
      icon: Leaf,
      color: 'from-green-500 to-teal-600',
      glow: 'box-glow-cyan',
      change: '+15% vs avg'
    },
    {
      title: 'Fuel Saved',
      value: sustainabilityMetrics.fuelSavedToday,
      icon: Fuel,
      color: 'from-indigo-500 to-purple-600',
      glow: 'box-glow-purple',
      change: 'Optimized'
    }
  ]

  const pieData = [
    { name: 'Occupied', value: totalOccupied, color: '#ef4444' },
    { name: 'Available', value: totalAvailable, color: '#10b981' }
  ]

  const COLORS = ['#ef4444', '#10b981']

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Smart City Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Real-time parking and traffic analytics for Goa</p>
        </div>
        <div className="glassmorphism dark:glassmorphism px-6 py-3 rounded-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
          <p className="text-lg font-bold text-gray-800 dark:text-white">Just now</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className={`glassmorphism dark:glassmorphism rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer animate-float ${stat.glow}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-green-500 dark:text-green-400">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parking Occupancy Trend */}
        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float-slow box-glow-cyan">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Parking Occupancy Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyOccupancy}>
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
                dataKey="occupied" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ fill: '#ef4444', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="available" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Zone-wise Parking Usage */}
        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float-slow box-glow-blue">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Zone-wise Parking Usage
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={zoneWiseUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="zone" stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                  border: '1px solid #06b6d4',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="usage" fill="url(#colorUsage)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Peak Traffic Hours */}
        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-purple">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Peak Traffic Hours
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={peakHoursData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="hour" stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                  border: '1px solid #8b5cf6',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="traffic" 
                stroke="#8b5cf6" 
                fill="url(#colorTraffic)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Available vs Occupied */}
        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-cyan">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Available vs Occupied Slots
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                  border: '1px solid #06b6d4',
                  borderRadius: '8px'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float-slow box-glow-blue">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-2 text-cyan-500" />
          AI-Powered Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiInsights.map((insight, index) => (
            <div
              key={insight.id}
              className={`bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border-l-4 hover:scale-105 transition-all duration-300 cursor-pointer ${
                insight.type === 'success' ? 'border-green-500' :
                insight.type === 'warning' ? 'border-yellow-500' :
                insight.type === 'alert' ? 'border-red-500' :
                'border-blue-500'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-sm text-gray-800 dark:text-white">{insight.title}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">{insight.timestamp}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{insight.message}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                  📍 {insight.location}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  insight.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                  insight.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                  'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                }`}>
                  {insight.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
