import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CalendarCheck, 
  Receipt, 
  ClipboardList, 
  Bell 
} from 'lucide-react';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Teachers', href: '/teachers', icon: GraduationCap },
  { name: 'Attendance', href: '/attendance', icon: CalendarCheck },
  { name: 'Finance', href: '/finance', icon: Receipt },
  { name: 'Results', href: '/results', icon: ClipboardList },
  { name: 'Notices', href: '/notices', icon: Bell },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex flex-col w-64 bg-slate-900 min-h-screen text-white">
      <div className="flex items-center justify-center h-16 bg-slate-950 shadow-md">
        <h1 className="text-xl font-bold tracking-wider">SMSP ADMIN</h1>
      </div>
      <div className="flex-1 flex flex-col py-4 overflow-y-auto">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                )}
              >
                <item.icon
                  className={clsx(
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white',
                    'mr-3 flex-shrink-0 h-6 w-6 transition-colors'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 bg-slate-950">
        <p className="text-xs text-slate-500 text-center">
          © 2026 Iqbal High School
        </p>
      </div>
    </div>
  );
}
