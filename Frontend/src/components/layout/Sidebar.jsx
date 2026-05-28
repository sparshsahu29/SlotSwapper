import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, BellRing, HelpCircle, Activity } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useWebSocket from '../../hooks/useWebSocket';

export const Sidebar = ({ eventsCount = 0, swappableCount = 0, pendingCount = 0 }) => {
  const { user } = useAuth();
  const { notificationCount } = useWebSocket();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
    { name: 'Notifications', path: '/notifications', icon: BellRing, badge: notificationCount },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-bg-secondary border-r border-border h-[calc(110vh-64px)] fixed left-0 p-4 gap-6 select-none shrink-0">
      {/* Quick Profile Section */}
      <div className="bg-bg-card border border-border/80 rounded-card p-4 flex flex-col items-center text-center gap-1.5 shadow-sm">
        <div className="h-12 w-12 rounded-full bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan font-bold text-lg">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-text-primary truncate max-w-45">{user?.name}</h4>
          <span className="text-[11px] text-text-secondary font-mono">{user?.email}</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-1">
        {links.map((link) => {
          const IconComponent = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center justify-between text-sm px-3.5 py-3 rounded-md transition-colors duration-150 ${
                  isActive
                    ? 'bg-accent/15 text-accent font-semibold border-l-2 border-accent'
                    : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <IconComponent size={16} />
                <span>{link.name}</span>
              </div>
              {link.badge && link.badge > 0 ? (
                <span className="bg-danger text-white text-[10px] rounded-full px-1.5 py-0.5 font-bold animate-pulse">
                  {link.badge}
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </div>

      <div className="border-t border-border/60 my-2" />

      {/* Realtime Stats Widget */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary tracking-wider uppercase px-2 mb-1">
          <Activity size={12} className="text-cyan animate-pulse" />
          <span>My Slots Stats</span>
        </div>
        <div className="bg-[#121212] border border-border/40 rounded-lg p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">My Scheduled Events</span>
            <span className="text-text-primary font-mono font-bold bg-white/5 px-2 py-0.5 rounded">
              {eventsCount}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">Marketplace Shares</span>
            <span className="text-cyan font-mono font-bold bg-cyan/5 px-2 py-0.5 rounded">
              {swappableCount}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">Incoming Actions</span>
            <span className="text-warning font-mono font-bold bg-warning/5 px-2 py-0.5 rounded">
              {pendingCount}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
