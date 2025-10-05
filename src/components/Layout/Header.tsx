import React, { useState } from 'react';
import { Scale, Menu, Bell, User } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { notifications, markAllAsRead } = useNotification();
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">AccidentLaw Pro</h1>
              <p className="text-xs text-gray-500">Road Accident Case Management</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => { setOpen(!open); if (!open) markAllAsRead(); }}>
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b font-semibold text-gray-800 flex justify-between items-center">
                  Notifications
                  <button className="text-xs text-blue-600 hover:underline" onClick={() => setOpen(false)}>Close</button>
                </div>
                <ul className="divide-y divide-gray-100">
                  {notifications.length === 0 && <li className="p-4 text-gray-500 text-sm">No notifications</li>}
                  {notifications.map(n => (
                    <li key={n.id} className={`p-4 ${n.read ? 'bg-white' : 'bg-blue-50'}`}>
                      <div className="text-sm text-gray-900">{n.message}</div>
                      <div className="text-xs text-gray-400 mt-1">{n.timestamp ? new Date(n.timestamp).toLocaleString() : ''}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 pl-2 border-l border-gray-200">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">Adv. S. Kumara Swami</p>
              <p className="text-xs text-gray-500">Senior Advocate</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;