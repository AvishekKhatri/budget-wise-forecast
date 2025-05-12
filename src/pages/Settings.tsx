
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const { userProfile, updateUserProfile } = useUser();
  const { theme, setTheme } = useTheme();
  
  // State for settings, initialized with userProfile values and theme
  const [settings, setSettings] = useState({
    emailNotifications: userProfile.emailNotifications,
    smsNotifications: userProfile.smsNotifications,
    weeklyReports: userProfile.weeklyReports || false,
    darkMode: theme === 'dark'
  });
  
  // Update settings when userProfile changes
  useEffect(() => {
    setSettings(prevSettings => ({
      ...prevSettings,
      emailNotifications: userProfile.emailNotifications,
      smsNotifications: userProfile.smsNotifications,
      weeklyReports: userProfile.weeklyReports || false,
      darkMode: theme === 'dark'
    }));
  }, [userProfile, theme]);
  
  const handleToggle = (setting: keyof typeof settings) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [setting]: !prev[setting]
      };
      
      // Immediately update theme when darkMode is toggled
      if (setting === 'darkMode') {
        setTheme(newSettings.darkMode ? 'dark' : 'light');
      }
      
      return newSettings;
    });
  };
  
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Update user profile with notification settings
    updateUserProfile({
      emailNotifications: settings.emailNotifications,
      smsNotifications: settings.smsNotifications,
      weeklyReports: settings.weeklyReports
    });
    
    // Simulate API call with timeout
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully."
      });
      
      setIsSaving(false);
    }, 800);
  };
  
  return (
    <Layout>
      <div className="space-y-6 mb-10">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="cursor-pointer">Email Notifications</Label>
                <Switch 
                  id="email-notifications" 
                  checked={settings.emailNotifications}
                  onCheckedChange={() => handleToggle('emailNotifications')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications" className="cursor-pointer">SMS Notifications</Label>
                <Switch 
                  id="sms-notifications" 
                  checked={settings.smsNotifications}
                  onCheckedChange={() => handleToggle('smsNotifications')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="weekly-reports" className="cursor-pointer">Weekly Budget Reports</Label>
                <Switch 
                  id="weekly-reports" 
                  checked={settings.weeklyReports}
                  onCheckedChange={() => handleToggle('weeklyReports')}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how BudgetWise looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="cursor-pointer">Dark Mode</Label>
                <Switch 
                  id="dark-mode" 
                  checked={settings.darkMode}
                  onCheckedChange={() => handleToggle('darkMode')}
                />
              </div>
            </CardContent>
          </Card>
          
          <Button 
            onClick={handleSaveSettings} 
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
