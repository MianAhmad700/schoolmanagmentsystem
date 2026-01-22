import { useAuth } from '../../context/AuthContext';
import { LogOut, Menu } from 'lucide-react';

export default function Navbar() {
  const { logout, currentUser } = useAuth();

  return (
    <div className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <button className="text-gray-500 hover:text-gray-700 md:hidden">
          <Menu className="h-6 w-6" />
        </button>
        <h2 className="ml-4 text-xl font-semibold text-gray-800">
          Iqbal High School Kot Abdullah
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {currentUser?.email}
        </span>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
