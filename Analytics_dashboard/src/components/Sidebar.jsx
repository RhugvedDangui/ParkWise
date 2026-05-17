import { 
  LayoutDashboard, 
  ParkingCircle, 
  TrendingUp, 
  Route, 
  MapPin, 
  Leaf, 
  Settings 
} from 'lucide-react'

const Sidebar = ({ currentPage, setCurrentPage, darkMode }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'smart-parking', label: 'Smart Parking', icon: ParkingCircle },
    { id: 'traffic-analytics', label: 'Traffic Analytics', icon: TrendingUp },
    { id: 'ai-routing', label: 'AI Routing', icon: Route },
    { id: 'goa-zones', label: 'Goa Traffic Zones', icon: MapPin },
    { id: 'sustainability', label: 'Sustainability', icon: Leaf },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <aside className="w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-cyan-500/20 flex flex-col transition-all duration-500">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-cyan-500/20">
        <div className="flex items-center space-x-3 animate-fade-in">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center box-glow-cyan">
            <ParkingCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">ParkWise</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Goa Smart City</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group animate-slide-up ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg box-glow-cyan'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-cyan-500/20">
        <div className="glassmorphism dark:glassmorphism rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">System Status</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">All systems operational</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
