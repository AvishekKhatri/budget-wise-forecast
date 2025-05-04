
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { useUser, UserProfile } from "@/contexts/UserContext";

const Profile: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userProfile, updateUserProfile } = useUser();
  
  const { register, handleSubmit, formState: { errors } } = useForm<UserProfile>({
    defaultValues: userProfile
  });

  const onSubmit = (data: UserProfile) => {
    setIsSubmitting(true);
    
    // Update global user state with form data
    setTimeout(() => {
      updateUserProfile(data);
      
      // Show success message
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="space-y-6 mb-10">
        <h1 className="text-2xl font-bold">User Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-finance-purple-light text-finance-purple text-2xl">
                    {userProfile.initials}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" type="button">Change Picture</Button>
              </div>
              
              <div className="flex-1 space-y-6 w-full max-w-md">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      {...register("phone")}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label>Notification Preferences</Label>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications" className="cursor-pointer">Email Notifications</Label>
                    <Switch 
                      id="email-notifications" 
                      {...register("emailNotifications")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-notifications" className="cursor-pointer">SMS Notifications</Label>
                    <Switch 
                      id="sms-notifications" 
                      {...register("smsNotifications")}
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
