// @ts-nocheck
import { useState, useEffect } from 'react'
import { 
  Car, 
  ParkingCircle, 
  CheckCircle,
  MapPin,
  Users
} from 'lucide-react'
import { 
  PieChart, 
  Pie, 
  Cell,
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'

const Dashboard = ({ darkMode }) => {
  // Real DB Stats
  const [realStats, setRealStats] = useState({
    totalSlots: 0,
    vacantSlots: 0,
    occupiedSlots: 0,
    totalLocations: 0,
    totalUsers: 0
  });

  useEffect(() => {
    fetch('http://localhost:3001/api/admin/analytics')
      .then(res => res.json())
      .then(data => setRealStats(data))
      .catch(err => console.error("Failed to load real analytics:", err));
  }, []);

  const { totalSlots, vacantSlots, occupiedSlots, totalLocations, totalUsers } = realStats;

  const statsCards = [
    {
      title: 'Total Parking Slots',
      value: totalSlots.toLocaleString(),
      icon: ParkingCircle,
      color: 'from-cyan-500 to-blue-600',
      glow: 'box-glow-cyan',
      change: 'Active network'
    },
    {
      title: 'Occupied Slots',
      value: occupiedSlots.toLocaleString(),
      icon: Car,
      color: 'from-orange-500 to-red-600',
      glow: 'box-glow-blue',
      change: 'In use'
    },
    {
      title: 'Available Slots',
      value: vacantSlots.toLocaleString(),
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-600',
      glow: 'box-glow-cyan',
      change: 'Vacant'
    },
    {
      title: 'Total Parking Locations',
      value: totalLocations.toLocaleString(),
      icon: MapPin,
      color: 'from-purple-500 to-pink-600',
      glow: 'box-glow-purple',
      change: 'Mapped areas'
    },
    {
      title: 'Registered Users',
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: 'from-yellow-500 to-orange-600',
      glow: 'box-glow-blue',
      change: 'Total accounts'
    }
  ]

  const pieData = [
    { name: 'Occupied', value: occupiedSlots, color: '#ef4444' },
    { name: 'Available', value: vacantSlots, color: '#10b981' }
  ]

  const COLORS = ['#ef4444', '#10b981']

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Smart City Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Real-time parking analytics for Goa</p>
        </div>
        <div className="glassmorphism dark:glassmorphism px-6 py-3 rounded-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
          <p className="text-lg font-bold text-green-500 dark:text-green-400">Live Data Sync</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
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
      <div className="grid grid-cols-1 gap-6 max-w-3xl">
        {/* Available vs Occupied */}
        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-cyan">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Network Capacity Distribution
          </h2>
          {totalSlots > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={130}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
          ) : (
             <div className="h-[400px] flex items-center justify-center text-gray-500 dark:text-gray-400">
               No parking data available in the network yet.
             </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
