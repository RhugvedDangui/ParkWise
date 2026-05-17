import { MapPin, Clock, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react'
import { parkingZones } from '../data/goaData'

const SmartParking = ({ darkMode }) => {
  const getCongestionColor = (level) => {
    switch (level) {
      case 'high':
        return 'from-red-500 to-orange-600'
      case 'medium':
        return 'from-yellow-500 to-orange-500'
      case 'low':
        return 'from-green-500 to-emerald-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getCongestionBadge = (level) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Smart Parking Zones</h1>
        <p className="text-gray-600 dark:text-gray-400">Real-time parking availability across Goa</p>
      </div>

      {/* Parking Zones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {parkingZones.map((zone, index) => {
          const occupancyPercent = Math.round((zone.occupied / zone.totalSlots) * 100)
          
          return (
            <div
              key={zone.id}
              className="glassmorphism dark:glassmorphism rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer animate-float box-glow-cyan"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Zone Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${getCongestionColor(zone.congestionLevel)} rounded-xl flex items-center justify-center`}>
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getCongestionBadge(zone.congestionLevel)}`}>
                  {zone.congestionLevel.toUpperCase()}
                </span>
              </div>

              {/* Zone Name */}
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                {zone.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {zone.location}
              </p>

              {/* Occupancy Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Occupancy</span>
                  <span className="text-xs font-bold text-gray-800 dark:text-white">{occupancyPercent}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getCongestionColor(zone.congestionLevel)} transition-all duration-500`}
                    style={{ width: `${occupancyPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Slots</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">{zone.totalSlots}</p>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Occupied</p>
                  <p className="text-xl font-bold text-red-600 dark:text-red-400">{zone.occupied}</p>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Available</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">{zone.available}</p>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Wait Time</p>
                  <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{zone.estimatedWaitTime}</p>
                </div>
              </div>

              {/* Peak Hours */}
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                Peak: {zone.peakHours}
              </div>

              {/* Action Button */}
              <button className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                View Details
              </button>
            </div>
          )
        })}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-cyan">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">High Congestion Zones</h3>
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <div className="space-y-2">
            {parkingZones.filter(z => z.congestionLevel === 'high').map(zone => (
              <div key={zone.id} className="flex items-center justify-between bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                <span className="text-sm font-medium text-gray-800 dark:text-white">{zone.name}</span>
                <span className="text-sm font-bold text-red-600 dark:text-red-400">{Math.round((zone.occupied / zone.totalSlots) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float-slow box-glow-blue">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Available Now</h3>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <div className="space-y-2">
            {parkingZones.filter(z => z.congestionLevel === 'low').map(zone => (
              <div key={zone.id} className="flex items-center justify-between bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                <span className="text-sm font-medium text-gray-800 dark:text-white">{zone.name}</span>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">{zone.available} slots</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-purple">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Quick Stats</h3>
            <TrendingUp className="w-6 h-6 text-cyan-500" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Occupancy</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">72%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Busiest Zone</p>
              <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">Panaji Market</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Wait Time</p>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">9.5 min</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SmartParking
