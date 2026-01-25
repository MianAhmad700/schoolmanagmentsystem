import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CalendarCheck, 
  Receipt, 
  ClipboardList, 
  Bell,
  Briefcase
} from 'lucide-react';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Teachers', href: '/teachers', icon: GraduationCap },
  { name: 'Staff', href: '/staff', icon: Briefcase },
  { name: 'Attendance', href: '/attendance', icon: CalendarCheck },
  { name: 'Finance', href: '/finance', icon: Receipt },
  { name: 'Results', href: '/results', icon: ClipboardList },
  { name: 'Notice', href: '/notices', icon: Bell }, // Renamed from Notices
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex flex-col w-64 bg-white min-h-screen border-r border-slate-200">
      <div className="flex items-center px-8 h-20">
        <div className="flex items-center gap-2">
           <GraduationCap className="h-8 w-8 text-blue-600" />
           <span className="text-xl font-bold text-slate-800 tracking-tight">School Management</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col py-6 overflow-y-auto px-4">
        <nav className="flex-1 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600',
                  'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200'
                )}
              >
                <item.icon
                  className={clsx(
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600',
                    'mr-3 flex-shrink-0 h-5 w-5 transition-colors'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-6">
        <div className="bg-slate-50 rounded-xl p-4">
           <p className="text-xs text-slate-500 font-medium">Admin Panel</p>
           <p className="text-[10px] text-slate-400 mt-1">© 2026 All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
}
