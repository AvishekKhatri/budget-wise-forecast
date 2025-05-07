
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from '@/contexts/UserContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userProfile, logout, isLoggedIn } = useUser();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  
  // Check for unread notifications
  useEffect(() => {
    const checkUnreadNotifications = () => {
      try {
        const savedNotifications = localStorage.getItem('notifications');
        if (savedNotifications) {
          const notifications = JSON.parse(savedNotifications);
          const unread = notifications.some((notification: any) => !notification.read);
          setHasUnreadNotifications(unread);
        }
      } catch (error) {
        console.error('Error checking notifications:', error);
      }
    };
    
    // Check on mount
    checkUnreadNotifications();
    
    // Set up a listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'notifications') {
        checkUnreadNotifications();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Create a custom event listener for notification updates within the same window
    const handleCustomNotificationChange = () => {
      checkUnreadNotifications();
    };
    
    window.addEventListener('notificationsUpdated', handleCustomNotificationChange);
    
    // Check every 5 seconds (in case notifications are updated in another component)
    const interval = setInterval(checkUnreadNotifications, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('notificationsUpdated', handleCustomNotificationChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    // Perform logout
    setTimeout(() => {
      logout();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      
      // AuthPage will be shown after logout
      navigate('/');
    }, 500);
  };
  
  if (!isLoggedIn) {
    return null; // Don't render header when not logged in
  }
  
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-10 dark:bg-gray-800 dark:border-gray-700">
      <h1 className="text-xl md:text-2xl font-bold text-finance-purple dark:text-finance-purple-light">
        <span className="hidden md:inline">BudgetWise</span>
        <span className="md:hidden">BW</span>
      </h1>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link to="/notifications">
            <Bell className="h-5 w-5" />
            {hasUnreadNotifications && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </Link>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative p-0" size="icon">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-finance-purple-light text-finance-purple">
                  {userProfile.initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <div className="font-medium">{userProfile.name}</div>
                <div className="text-xs text-muted-foreground">{userProfile.email}</div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center w-full cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center w-full cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="flex items-center cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
