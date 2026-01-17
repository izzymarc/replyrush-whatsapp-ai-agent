
import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  HelpCircle, 
  MessageSquare, 
  ShoppingCart, 
  Settings, 
  LogOut,
  Play
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
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-emerald-600 text-white' 
        : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'conversations', label: 'Conversations', icon: MessageSquare },
    { id: 'simulator', label: 'Test Chat (Sim)', icon: Play },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-4">
        <div className="flex items-center space-x-2 px-2 py-6 mb-4">
          <div className="bg-emerald-600 text-white p-2 rounded-lg">
            <ShoppingCart size={24} />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">ReplyRush</span>
        </div>

        <nav className="flex-1 space-y-1">
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

        <div className="pt-4 border-t border-slate-200">
          <SidebarItem
            icon={LogOut}
            label="Logout"
            active={false}
            onClick={onLogout}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
