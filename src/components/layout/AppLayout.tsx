import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Moon, Sun, LogOut, Bell } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth';
import toast from 'react-hot-toast';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const { user, tenant, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    clearAuth();
    navigate('/login');
    toast.success('Déconnecté');
  };

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={dark ? 'dark' : ''}>
      {/* Topbar */}
      <header className="fixed top-0 inset-x-0 h-14 bg-blue-900 flex items-center px-4 gap-3 z-30 shadow">
        <a href="/" className="flex items-center gap-2 text-white font-bold text-sm">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-xs">ERP</div>
          {!collapsed && <span>{tenant?.name ?? 'ERP SaaS'}</span>}
        </a>
        <div className="flex-1" />
        <button onClick={toggleDark} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
          <Bell size={16} />
        </button>
        <button onClick={handleLogout} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20" title="Déconnexion">
          <LogOut size={16} />
        </button>
        <div className="flex items-center gap-2 ml-1">
          <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0) ?? 'U'}
          </div>
          <span className="text-white text-xs font-medium hidden lg:block">{user?.name}</span>
        </div>
      </header>

      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className={`pt-14 transition-all duration-300 min-h-screen bg-slate-50 dark:bg-slate-900 ${collapsed ? 'pl-16' : 'pl-60'}`}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
