
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import AuthPage from './AuthPage';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  // No need to redirect to profile after login anymore
  // Users will be redirected directly to dashboard from AuthPage
  
  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Call once on mount
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  if (!isLoggedIn) {
    return <AuthPage />;
  }
  
  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'dark' : ''} bg-gray-50 dark:bg-gray-900`}>
      {/* Sidebar - hidden on mobile by default */}
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block fixed md:relative z-20 h-full transition-all duration-300`}>
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
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
