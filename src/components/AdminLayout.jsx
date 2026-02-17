import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { authAPI } from '../services/api';

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || !storedUser.isAdmin) {
      navigate('/admin/login');
      return;
    }

    setUser(storedUser);
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 flex flex-col">
        <AdminSidebar user={user} onLogout={handleLogout} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
       
        <section className="flex-1 p-8 bg-slate-950 overflow-y-auto">
          {children}
        </section>
      </main>
    </div>
  );
}
