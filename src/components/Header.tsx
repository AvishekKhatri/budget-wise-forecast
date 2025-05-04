
import React from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userProfile, logout, isLoggedIn, login } = useUser();

  const handleLogout = () => {
    // Perform logout
    setTimeout(() => {
      logout();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      
      // Redirect to home page after logout
      navigate('/', { replace: true });
    }, 500);
  };
  
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
      <h1 className="text-xl md:text-2xl font-bold text-finance-purple">
        <span className="hidden md:inline">BudgetWise</span>
        <span className="md:hidden">BW</span>
      </h1>
      
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
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
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Log in</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Log in to BudgetWise</DialogTitle>
                  <DialogDescription>
                    Enter your credentials to access your account
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col gap-4">
                    <input 
                      type="email" 
                      placeholder="Email" 
                      className="border p-2 rounded-md" 
                    />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      className="border p-2 rounded-md" 
                    />
                    <Button onClick={login}>Log in</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>Sign up</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create an account</DialogTitle>
                  <DialogDescription>
                    Join BudgetWise to track and manage your finances
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col gap-4">
                    <input 
                      type="text" 
                      placeholder="Full name" 
                      className="border p-2 rounded-md" 
                    />
                    <input 
                      type="email" 
                      placeholder="Email" 
                      className="border p-2 rounded-md" 
                    />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      className="border p-2 rounded-md" 
                    />
                    <Button onClick={login}>Create account</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
