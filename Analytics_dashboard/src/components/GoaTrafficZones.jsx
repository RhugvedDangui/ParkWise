import { MapPin, AlertTriangle, TrendingUp, Activity } from 'lucide-react'
import { trafficZones, congestionHeatIndex } from '../data/goaData'

const GoaTrafficZones = ({ darkMode }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Goa Traffic Zones</h1>
        <p className="text-gray-600 dark:text-gray-400">Comprehensive traffic monitoring across all Goa regions</p>
      </div>

      {/* Zone Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-cyan">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Zones</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">10</p>
          <p className="text-xs text-cyan-500 mt-2">Monitored 24/7</p>
        </div>

        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float-slow box-glow-blue">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">High Congestion</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">4</p>
          <p className="text-xs text-red-500 mt-2">Zones affected</p>
        </div>

        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-purple">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Low Traffic</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">3</p>
          <p className="text-xs text-green-500 mt-2">Optimal flow</p>
        </div>

        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float-slow box-glow-cyan">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Vehicles</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">812</p>
          <p className="text-xs text-purple-500 mt-2">Per zone</p>
        </div>
      </div>

      {/* Traffic Zones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trafficZones.map((zone, index) => {
          const congestionLevel = zone.congestion > 75 ? 'high' : zone.congestion > 50 ? 'medium' : 'low'
          const congestionColor = congestionLevel === 'high' ? 'from-red-500 to-orange-600' :
                                  congestionLevel === 'medium' ? 'from-yellow-500 to-orange-500' :
                                  'from-green-500 to-emerald-600'
          const congestionBadge = congestionLevel === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                  congestionLevel === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                                  'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'

          return (
            <div
              key={index}
              className="glassmorphism dark:glassmorphism rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer animate-float box-glow-cyan"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Zone Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${congestionColor} rounded-xl flex items-center justify-center`}>
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${congestionBadge}`}>
                  {congestionLevel.toUpperCase()}
                </span>
              </div>

              {/* Zone Name */}
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{zone.zone}</h3>

              {/* Congestion Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Congestion Level</span>
                  <span className="text-xs font-bold text-gray-800 dark:text-white">{zone.congestion}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${congestionColor} transition-all duration-500`}
                    style={{ width: `${zone.congestion}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Vehicles</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white">{zone.vehicles}</p>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg Speed</p>
                  <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{zone.avgSpeed} km/h</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Congestion Heat Map */}
      <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float-slow box-glow-blue">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Congestion Heat Map
        </h2>
        <div className="space-y-4">
          {congestionHeatIndex.map((item, index) => (
            <div
              key={index}
              className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 hover:scale-102 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-cyan-500" />
                  <h3 className="font-bold text-gray-800 dark:text-white">{item.zone}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.status === 'Critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                  item.status === 'High' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                  item.status === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                  'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        item.index > 85 ? 'bg-gradient-to-r from-red-500 to-red-700' :
                        item.index > 70 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                        item.index > 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        'bg-gradient-to-r from-green-500 to-emerald-500'
                      }`}
                      style={{ width: `${item.index}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-800 dark:text-white w-16 text-right">
                  {item.index}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-cyan">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Most Congested Zones</h3>
          <div className="space-y-3">
            {trafficZones
              .sort((a, b) => b.congestion - a.congestion)
              .slice(0, 5)
              .map((zone, index) => (
                <div key={index} className="flex items-center justify-between bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-gray-400 dark:text-gray-600">#{index + 1}</span>
                    <span className="font-medium text-gray-800 dark:text-white">{zone.zone}</span>
                  </div>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">{zone.congestion}%</span>
                </div>
              ))}
          </div>
        </div>

        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float-slow box-glow-purple">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Least Congested Zones</h3>
          <div className="space-y-3">
            {trafficZones
              .sort((a, b) => a.congestion - b.congestion)
              .slice(0, 5)
              .map((zone, index) => (
                <div key={index} className="flex items-center justify-between bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-gray-400 dark:text-gray-600">#{index + 1}</span>
                    <span className="font-medium text-gray-800 dark:text-white">{zone.zone}</span>
                  </div>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">{zone.congestion}%</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoaTrafficZones
