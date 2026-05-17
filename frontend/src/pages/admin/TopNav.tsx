// @ts-nocheck
import { Search, Bell, User } from 'lucide-react'

const TopNav = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-cyan-500/20 px-6 py-4 transition-all duration-500">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-cyan-500 transition-colors" />
            <input
              type="text"
              placeholder="Search parking zones, traffic data, insights..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-cyan-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 text-gray-700 dark:text-gray-200 placeholder-gray-400 transition-all duration-300"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 ml-6">

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors group">
            <Bell className="w-6 h-6 group-hover:animate-pulse" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-cyan-500/20">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Traffic Control</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center box-glow-cyan cursor-pointer hover:scale-110 transition-transform">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopNav
