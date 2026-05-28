import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { CalendarRange, ArrowLeftRight, Bell, LogOut, Menu, X, User } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useWebSocket from '../../hooks/useWebSocket';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { notificationCount, resetNotificationCount } = useWebSocket();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Reset notification count when viewing the notifications page
  useEffect(() => {
    if (location.pathname === '/notifications') {
      resetNotificationCount();
    }
  }, [location.pathname, resetNotificationCount]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Notifications', path: '/notifications', showsBadge: true },
  ];

  return (
    <nav className="bg-bg-primary/60 backdrop-blur-md border-b border-border fixed top-0 left-0 right-0 h-16 z-40 px-4 md:px-6">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        {/* Logo and Branding */}
        <div 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="bg-cyan/10 p-1.5 rounded-lg group-hover:bg-cyan/25 transition-all duration-150">
            <ArrowLeftRight className="text-cyan h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
            Slot<span className="text-cyan">Swapper</span>
          </span>
        </div>

        {/* Desktop Navigation Link Center */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-150 relative py-2 ${
                  isActive ? 'text-accent font-semibold' : 'text-text-secondary hover:text-text-primary'
                }`
              }
            >
              {link.name}
              {link.showsBadge && notificationCount > 0 && (
                <span className="absolute -top-1.5 -right-3.5 bg-danger text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {notificationCount}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* User Info & Actions Right */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <div className="h-7 w-7 rounded-full bg-border border border-white/5 flex items-center justify-center">
              <User size={14} className="text-cyan" />
            </div>
            <span className="font-medium text-text-primary">{user?.name || 'User'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-danger hover:bg-danger/10 px-2.5 py-1.5 rounded-md transition-all duration-150 cursor-pointer"
            title="Log Out"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Mobile notifications alert badge shorthand */}
          {notificationCount > 0 && location.pathname !== '/notifications' && (
            <button 
              onClick={() => navigate('/notifications')} 
              className="relative p-2 text-text-secondary hover:text-text-primary cursor-pointer"
            >
              <Bell size={18} className="text-warning animate-pulse" />
              <span className="absolute top-1 right-1 bg-danger text-white text-[8px] rounded-full w-3 h-3 flex items-center justify-center font-bold">
                {notificationCount}
              </span>
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-text-secondary hover:text-text-primary focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-bg-secondary border-b border-border shadow-2xl p-4 animate-fade-in z-30">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between text-sm px-3 py-2.5 rounded-lg transition-colors duration-150 ${
                    isActive ? 'bg-accent/10 text-accent font-semibold' : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                  }`
                }
              >
                <span>{link.name}</span>
                {link.showsBadge && notificationCount > 0 && (
                  <span className="bg-danger text-white text-[10px] rounded-full px-1.5 py-0.5 font-bold">
                    {notificationCount}
                  </span>
                )}
              </NavLink>
            ))}

            <div className="border-t border-border mt-2 pt-3 flex flex-col gap-3">
              <div className="flex items-center gap-3 px-3">
                <div className="h-8 w-8 rounded-full bg-border flex items-center justify-center">
                  <User size={16} className="text-cyan" />
                </div>
                <div>
                  <div className="text-sm font-medium text-text-primary">{user?.name}</div>
                  <div className="text-xs text-text-secondary">{user?.email}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-sm text-danger bg-danger/10 hover:bg-danger/20 py-2.5 rounded-lg transition-all duration-150 font-medium cursor-pointer"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
