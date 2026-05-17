import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './admin/Sidebar';
import TopNav from './admin/TopNav';
import Dashboard from './admin/Dashboard';
import AddLocation from './admin/AddLocation';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard darkMode={darkMode} />;
      case 'add-location':
        return <AddLocation darkMode={darkMode} />;
      default:
        return <Dashboard darkMode={darkMode} />;
    }
  };

  return (
    <div className={`w-screen h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      {/* Small top header just for navigating back to map since we integrated this into the main app */}
      <div className="flex items-center justify-between px-6 py-2 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50 shrink-0">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all text-sm font-medium border border-gray-200 dark:border-gray-700"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Map View
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
            <span className="text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">Admin</span>
            <span className="text-amber-700 dark:text-amber-300 text-xs">{user?.username}</span>
          </div>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-black transition-colors duration-500">
        {/* Cyber Grid Background */}
        <div className="fixed inset-0 cyber-grid opacity-20 dark:opacity-10 pointer-events-none z-0"></div>
        
        {/* Sidebar */}
        <div className="relative z-10 flex">
          <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} darkMode={darkMode} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          <TopNav darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          
          <main className="flex-1 overflow-y-auto p-6 relative">
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  );
}
