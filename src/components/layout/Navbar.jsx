import { useAuth } from '../../context/AuthContext';
import { LogOut, Menu, Search, Mic, Bell, User } from 'lucide-react';

export default function Navbar() {
  const { logout, currentUser } = useAuth();

  return (
    <div className="bg-white h-20 flex items-center justify-between px-8 border-b border-slate-100">
      {/* Left: Page Title Placeholder (Or Breadcrumbs) - For now just hidden on mobile/desktop as Sidebar handles nav */}
      <div className="flex items-center">
        <button className="text-slate-500 hover:text-slate-700 md:hidden mr-4">
          <Menu className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800 hidden md:block">Dashboard</h2>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-2xl px-8">
        <div className="relative">

        </div>
      </div>

      {/* Right: Profile & Actions */}
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
          <Bell className="h-6 w-6" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800">Admin User</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
          <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 border-2 border-white shadow-sm">
             <User className="h-6 w-6" />
          </div>
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
