import React from 'react';
import { 
  Home, 
  Plus, 
  FileText, 
  Users, 
  Phone,
  ChevronLeft,
  Calendar
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'add-case', label: 'Register New Case', icon: Plus },
  { id: 'case-details', label: 'All Accident Cases', icon: FileText },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'about', label: 'About Law Firm', icon: Users },
  { id: 'contact', label: 'Contact', icon: Phone },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-white shadow-lg border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out rounded-3xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:z-auto
        w-64
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <img src="/logo.png" alt="Firm Logo" className="h-10 w-auto" />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <nav className="mt-8 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                {item.id === 'support'
                  ? <img src="/support-logo.png" alt="Support Logo" className="w-6 h-6" />
                  : Icon && <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                }
                <span className={`font-medium ${isActive ? 'text-blue-700' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Support tab is now part of menuItems and rendered with other tabs */}
      </aside>
    </>
  );
};

export default Sidebar;