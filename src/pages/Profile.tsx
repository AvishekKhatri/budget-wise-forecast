
import React from 'react';
import Layout from '@/components/Layout';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Profile: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6 mb-10">
        <h1 className="text-2xl font-bold">User Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-finance-purple-light text-finance-purple text-2xl">
                  JD
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">Change Picture</Button>
            </div>
            
            <div className="flex-1 space-y-6 w-full max-w-md">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="(555) 123-4567" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferences">Notification Preferences</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="email-notifications" defaultChecked />
                    <label htmlFor="email-notifications">Email Notifications</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sms-notifications" defaultChecked />
                    <label htmlFor="sms-notifications">SMS Notifications</label>
                  </div>
                </div>
              </div>
              
              <Button className="mt-6">Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
