import { Navigation, Zap, Clock, TrendingDown, Route, MapPin } from 'lucide-react'
import { aiInsights } from '../data/goaData'

const AIRouting = ({ darkMode }) => {
  const routes = [
    {
      id: 1,
      from: "Panaji",
      to: "Margao",
      distance: "34 km",
      normalTime: "52 min",
      optimizedTime: "38 min",
      timeSaved: "14 min",
      fuelSaved: "1.2 L",
      co2Reduced: "2.8 kg",
      congestionAvoided: "3 zones",
      route: "Via Ponda - Taleigao Bypass"
    },
    {
      id: 2,
      from: "Mapusa",
      to: "Calangute",
      distance: "12 km",
      normalTime: "28 min",
      optimizedTime: "18 min",
      timeSaved: "10 min",
      fuelSaved: "0.8 L",
      co2Reduced: "1.9 kg",
      congestionAvoided: "2 zones",
      route: "Via Porvorim Bypass"
    },
    {
      id: 3,
      from: "Vasco",
      to: "Panaji",
      distance: "29 km",
      normalTime: "45 min",
      optimizedTime: "32 min",
      timeSaved: "13 min",
      fuelSaved: "1.1 L",
      co2Reduced: "2.5 kg",
      congestionAvoided: "2 zones",
      route: "Via Cortalim - Agassaim"
    },
    {
      id: 4,
      from: "Ponda",
      to: "Margao",
      distance: "22 km",
      normalTime: "35 min",
      optimizedTime: "26 min",
      timeSaved: "9 min",
      fuelSaved: "0.7 L",
      co2Reduced: "1.6 kg",
      congestionAvoided: "1 zone",
      route: "Via Borim - Shiroda"
    }
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">AI-Powered Smart Routing</h1>
        <p className="text-gray-600 dark:text-gray-400">Intelligent route optimization for Goa traffic</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-cyan">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Route className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Routes</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">145</p>
          <p className="text-xs text-green-500 mt-2">+23 optimized today</p>
        </div>

        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float-slow box-glow-blue">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Time Saved</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">12 min</p>
          <p className="text-xs text-green-500 mt-2">Per route</p>
        </div>

        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-purple">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
            <TrendingDown className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Congestion Avoided</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">23%</p>
          <p className="text-xs text-green-500 mt-2">Traffic reduction</p>
        </div>

        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float-slow box-glow-cyan">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">AI Accuracy</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">94%</p>
          <p className="text-xs text-cyan-500 mt-2">Prediction rate</p>
        </div>
      </div>

      {/* Optimized Routes */}
      <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-blue">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <Navigation className="w-6 h-6 mr-2 text-cyan-500" />
          Smart Optimized Routes
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {routes.map((route, index) => (
            <div
              key={route.id}
              className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-cyan-500/20 hover:scale-105 transition-all duration-300 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Route Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">{route.from} → {route.to}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{route.distance}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-semibold">
                  OPTIMIZED
                </span>
              </div>

              {/* Time Comparison */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Normal Route</p>
                  <p className="text-xl font-bold text-red-600 dark:text-red-400">{route.normalTime}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">AI Optimized</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">{route.optimizedTime}</p>
                </div>
              </div>

              {/* Savings */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Time Saved</p>
                  <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{route.timeSaved}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Fuel Saved</p>
                  <p className="text-sm font-bold text-purple-600 dark:text-purple-400">{route.fuelSaved}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">CO₂ Reduced</p>
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">{route.co2Reduced}</p>
                </div>
              </div>

              {/* Route Details */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Suggested Route:</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white mb-2">{route.route}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Congestion avoided: <span className="font-semibold text-cyan-600 dark:text-cyan-400">{route.congestionAvoided}</span>
                  </span>
                  <button className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
                    View Map →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float-slow box-glow-cyan">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-2 text-cyan-500" />
          Real-time AI Recommendations
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

      {/* Route Optimization Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-cyan">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Today's Impact</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Routes Optimized</p>
              <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">145</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Time Saved</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">1,740 min</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Vehicles Rerouted</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">3,250</p>
            </div>
          </div>
        </div>

        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float-slow box-glow-blue">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Environmental Savings</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fuel Saved</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">142 L</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">CO₂ Reduced</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">335 kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Carbon Offset</p>
              <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">0.45 tons</p>
            </div>
          </div>
        </div>

        <div className="glassmorphism dark:glassmorphism rounded-2xl p-6 animate-float box-glow-purple">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">AI Performance</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Prediction Accuracy</p>
              <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">94%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">97%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Response Time</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">0.8s</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIRouting
