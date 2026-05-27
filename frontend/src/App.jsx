import { useState } from 'react'
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import './App.css'

const isLoggedIn = () => !!localStorage.getItem('accessToken');

function App() {
  
   const [auth, setAuth] = useState(isLoggedIn());
    const [page, setPage] = useState('dashboard');
  
    const handleLogin = () => setAuth(true);
  
    const handleLogout = () => {
      localStorage.clear();
      setAuth(false);
      setPage('dashboard');
    };
  
    if (!auth) return <Login onLogin={handleLogin} />;
  
    const navLinks = [
      { key: 'dashboard', label: '🏠 Dashboard' },
      { key: 'employees', label: '👥 Employees' },
      { key: 'attendance', label: '📅 Attendance' },
    ];
  

  return (
    <>
      <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-56 bg-slate-800 text-white flex flex-col shrink-0">
              <div className="p-5 border-b border-slate-700">
                <h1 className="font-bold text-lg tracking-tight">EMS</h1>
                <p className="text-slate-400 text-xs mt-0.5">Employee Management</p>
              </div>
              <nav className="flex-1 p-3 space-y-1">
                {navLinks.map((l) => (
                  <button
                    key={l.key}
                    onClick={() => setPage(l.key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      page === l.key ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </nav>
              <div className="p-3 border-t border-slate-700">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-700 transition"
                >
                  🚪 Logout
                </button>
              </div>
            </aside>
      
            {/* Content */}
            <main className="flex-1 bg-slate-100 overflow-auto">
              {page === 'dashboard' && <Dashboard />}
              {page === 'employees' && <Employees />}
              {page === 'attendance' && <Attendance />}
            </main>
          </div>
    </>
  )
}

export default App
