
import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  HelpCircle, 
  MessageSquare, 
  ShoppingCart, 
  Settings, 
  LogOut,
  Play,
  Zap
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <Icon size={18} />
    <span className="font-semibold text-sm">{label}</span>
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Inventory', icon: Package },
    { id: 'faqs', label: 'Knowledge', icon: HelpCircle },
    { id: 'orders', label: 'Sales', icon: ShoppingCart },
    { id: 'conversations', label: 'Inbox', icon: MessageSquare },
    { id: 'simulator', label: 'AI Sandbox', icon: Play },
    { id: 'settings', label: 'Business Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center space-x-3 mb-10 px-2">
          <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-inner">
            <Zap size={22} fill="currentColor" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">ReplyRush</span>
        </div>

        <nav className="flex-1 space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-4">Menu</p>
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={currentPage === item.id}
              onClick={() => setCurrentPage(item.id)}
            />
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <SidebarItem
            icon={LogOut}
            label="Sign Out"
            active={false}
            onClick={onLogout}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-10">
          {children}
        </div>
      </main>
    </div>
  );
};
