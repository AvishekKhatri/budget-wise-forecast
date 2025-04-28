
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  LineChart, 
  PieChart,
  CreditCard,
  Settings,
  Bell,
  HelpCircle,
  ArrowLeftRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, active }) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        active 
          ? "bg-sidebar-accent text-white" 
          : "text-gray-300 hover:bg-sidebar-accent/50 hover:text-white"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  // Use the location from react-router-dom to determine the active route
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <div className="w-64 bg-sidebar flex flex-col h-full">
      <div className="p-4">
        <h2 className="text-white text-lg font-bold mb-6 mt-2 flex gap-2 items-center">
          <PieChart className="h-6 w-6" />
          <span>BudgetWise</span>
        </h2>
        
        <nav className="space-y-1">
          <NavItem 
            to="/" 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={currentPath === '/'} 
          />
          <NavItem 
            to="/transactions" 
            icon={ArrowLeftRight} 
            label="Transactions" 
            active={currentPath === '/transactions'} 
          />
          <NavItem 
            to="/budgets" 
            icon={PieChart} 
            label="Budgets" 
            active={currentPath === '/budgets'} 
          />
          <NavItem 
            to="/forecast" 
            icon={LineChart} 
            label="Forecasts" 
            active={currentPath === '/forecast'} 
          />
          <NavItem 
            to="/accounts" 
            icon={CreditCard} 
            label="Accounts" 
            active={currentPath === '/accounts'} 
          />
        </nav>
      </div>
      
      <div className="mt-auto p-4">
        <nav className="space-y-1">
          <NavItem 
            to="/notifications" 
            icon={Bell} 
            label="Notifications"
            active={currentPath === '/notifications'} 
          />
          <NavItem 
            to="/settings" 
            icon={Settings} 
            label="Settings"
            active={currentPath === '/settings'} 
          />
          <NavItem 
            to="/help" 
            icon={HelpCircle} 
            label="Help & Support"
            active={currentPath === '/help'} 
          />
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
