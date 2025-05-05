
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useUser } from '@/contexts/UserContext';

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, updateUserProfile } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      // If user is signing up, update their profile info with form data
      if (activeTab === 'signup' && name && email) {
        updateUserProfile({
          name,
          email,
        });
      }
      
      login();
      setIsLoading(false);
      toast({
        title: activeTab === 'login' ? "Logged in" : "Account created",
        description: activeTab === 'login' 
          ? "Welcome back to BudgetWise!" 
          : "Your account has been created successfully."
      });
      navigate('/profile'); // Navigate to profile page after login/signup
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Left side with image - adjusted to fill height */}
      <div className="hidden lg:flex lg:w-1/2 bg-finance-purple-light items-center justify-center p-0">
        <div className="w-full h-full relative">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" 
            alt="Finance management" 
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-finance-purple/20"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-finance-purple/80 to-transparent">
            <h2 className="text-3xl font-bold text-white mb-3">Take control of your finances</h2>
            <p className="text-white/90 text-lg">Track, manage, and optimize your spending with BudgetWise</p>
          </div>
        </div>
      </div>
      
      {/* Right side with auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {activeTab === 'login' ? 'Welcome back' : 'Create an account'}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === 'login' 
                ? 'Enter your credentials to access your account' 
                : 'Enter your details to create your account'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex mb-6">
              <Button 
                variant={activeTab === 'login' ? 'default' : 'outline'} 
                className="flex-1 rounded-r-none"
                onClick={() => setActiveTab('login')}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
              <Button 
                variant={activeTab === 'signup' ? 'default' : 'outline'} 
                className="flex-1 rounded-l-none"
                onClick={() => setActiveTab('signup')}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="hello@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </form>
          </CardContent>
          
          <CardFooter>
            <Button 
              className="w-full"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </span>
              ) : activeTab === 'login' ? 'Login' : 'Create Account'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
