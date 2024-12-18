import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Compass, MessageSquare, Activity, Search, 
    LogOut, Settings, X, HelpCircle, User, Menu, LayoutDashboard
} from 'lucide-react';

const UserSection = ({ isAuthenticated, user, onLogout, onLogin, onRegister }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-section")) {
        closeDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const MobileNavLinks = () => (
    <div className="md:hidden fixed inset-0 bg-white z-50 overflow-y-auto pt-16">
      <div className="flex flex-col space-y-6 p-6">
        <MobileNavLink 
          icon={<Compass size={24} />} 
          label="Discover" 
          onClick={() => {
            navigate('/discover');
            toggleMobileMenu();
          }} 
        />
        <MobileNavLink 
          icon={<LayoutDashboard size={24} />} 
          label="Dashboard" 
          onClick={() => {
            navigate('/dashboard');
            toggleMobileMenu();
          }} 
        />
        <MobileNavLink 
          icon={<MessageSquare size={24} />} 
          label="Messages" 
          onClick={() => {
            navigate('/messages');
            toggleMobileMenu();
          }} 
        />
        <MobileNavLink 
          icon={<Activity size={24} />} 
          label="Activities" 
          onClick={() => {
            navigate('/activities');
            toggleMobileMenu();
          }} 
        />
        <MobileNavLink 
          icon={<Search size={24} />} 
          label="Search" 
          onClick={() => {
            navigate('/search');
            toggleMobileMenu();
          }} 
        />
      </div>
      <div className="absolute top-4 right-4">
        <button 
          onClick={toggleMobileMenu}
          className="text-neutral-800 hover:text-neutral-600"
        >
          <X size={32} />
        </button>
      </div>
    </div>
  );

  const MobileNavLink = ({ icon, label, onClick }) => (
    <button 
      className="flex items-center space-x-4 text-neutral-700 hover:text-neutral-900 w-full py-4 border-b border-neutral-200"
      onClick={onClick}
    >
      {icon}
      <span className="text-lg">{label}</span>
    </button>
  );

  return (
    <div className="relative flex items-center user-section">
      {isAuthenticated ? (
        <>
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="text-neutral-800 hover:text-neutral-600"
              >
                <Menu size={24} />
              </button>
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <div 
                className="flex items-center space-x-3 cursor-pointer"
                onClick={toggleDropdown}
              >
                <span className="hidden md:block text-lm text-neutral-700">
                  {"Hello, "+ user?.username || 'User'}
                </span>
                <img 
                  src={user?.avatar || '/default-avatar.png'} 
                  alt="User Avatar" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-neutral-200" 
                />
                
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-4 w-64 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-neutral-100 flex items-center space-x-3">
                    <img 
                      src={user?.avatar || '/default-avatar.png'} 
                      alt="User Avatar" 
                      className="w-10 h-10 rounded-full object-cover border-2 border-neutral-200" 
                    />
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{user?.username}</p>
                      <p className="text-xs text-neutral-500">{user?.email}</p>
                    </div>
                  </div>
                  <div className="py-1">
                    <DropdownItem 
                      icon={<User size={18} />} 
                      label="My Profile" 
                      onClick={() => navigate('/profile')} 
                    />
                    <DropdownItem 
                      icon={<Settings size={18} />} 
                      label="Account Settings" 
                      onClick={() => navigate('/account-settings')} 
                    />
                    <DropdownItem 
                      icon={<HelpCircle size={18} />} 
                      label="Help & Support" 
                      onClick={() => navigate('/help')} 
                    />
                    <DropdownItem 
                      icon={<LogOut size={18} />} 
                      label="Logout" 
                      onClick={onLogout}
                      className="text-red-500 hover:bg-red-50" 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && <MobileNavLinks />}
        </>
      ) : (
        <div className="flex space-x-4">
        <button
            className="text-neutral-700 hover:text-neutral-900"
            onClick={() => navigate('/login')}
        >
            Login
        </button>
        <button
            className="bg-neutral-800 text-white px-4 py-2 rounded-full hover:bg-neutral-700 transition-colors"
            onClick={() => navigate('/register')}
        >
            Register
        </button>
    </div>
      )}
    </div>
  );
};

// Dropdown Item Component
const DropdownItem = ({ icon, label, onClick, className = '' }) => (
  <button
    className={`w-full flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors ${className}`}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default UserSection;