import { useState } from 'react'
import Sidebar from './components/Sidebar'
import TopNav from './components/TopNav'
import Dashboard from './components/Dashboard'
import SmartParking from './components/SmartParking'
import TrafficAnalytics from './components/TrafficAnalytics'
import AIRouting from './components/AIRouting'
import GoaTrafficZones from './components/GoaTrafficZones'
import Sustainability from './components/Sustainability'

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [currentPage, setCurrentPage] = useState('dashboard')

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard darkMode={darkMode} />
      case 'smart-parking':
        return <SmartParking darkMode={darkMode} />
      case 'traffic-analytics':
        return <TrafficAnalytics darkMode={darkMode} />
      case 'ai-routing':
        return <AIRouting darkMode={darkMode} />
      case 'goa-zones':
        return <GoaTrafficZones darkMode={darkMode} />
      case 'sustainability':
        return <Sustainability darkMode={darkMode} />
      default:
        return <Dashboard darkMode={darkMode} />
    }
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-black transition-colors duration-500">
        {/* Cyber Grid Background */}
        <div className="fixed inset-0 cyber-grid opacity-20 dark:opacity-10 pointer-events-none"></div>
        
        {/* Sidebar */}
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} darkMode={darkMode} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          
          <main className="flex-1 overflow-y-auto p-6 relative">
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
