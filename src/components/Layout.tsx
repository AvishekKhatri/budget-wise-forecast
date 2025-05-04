
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile by default */}
      <div className={`${isSidebarOpen ? 'flex' : 'hidden'} md:flex transition-all duration-300`}>
        <Sidebar />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        {/* Mobile sidebar toggle */}
        <div className="md:hidden p-4">
          <Button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            variant="outline"
            size="icon"
            aria-label={isSidebarOpen ? 'Close Menu' : 'Open Menu'}
          >
            {isSidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
