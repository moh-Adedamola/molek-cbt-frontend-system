import { Menu, LogOut, Key } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">
            {import.meta.env.VITE_APP_NAME}
          </h1>
        </div>

        {/* Right section */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100"
          >
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">{user?.fullName}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
              <button
                onClick={() => {
                  navigate('/change-password');
                  setDropdownOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Key className="h-4 w-4" />
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 border-t px-4 py-3 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;