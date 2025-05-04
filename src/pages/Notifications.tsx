
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Bell, CreditCard, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface NotificationItemProps {
  title: string;
  description: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'payment';
  read: boolean;
  onMarkAsRead: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  title, 
  description, 
  time, 
  type, 
  read,
  onMarkAsRead 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'info':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'payment':
        return <CreditCard className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div 
      className={`p-4 border-b ${read ? 'bg-white' : 'bg-blue-50'}`}
      onClick={!read ? onMarkAsRead : undefined}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900">{title}</h3>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {time}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

const Notifications: React.FC = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Budget Alert',
      description: "You've reached 80% of your monthly grocery budget.",
      time: '10 mins ago',
      type: 'warning' as const,
      read: false
    },
    {
      id: 2,
      title: 'Payment Processed',
      description: 'Your payment of $45.00 to Netflix has been processed.',
      time: '2 hours ago',
      type: 'payment' as const,
      read: false
    },
    {
      id: 3,
      title: 'Savings Goal Reached',
      description: "Congratulations! You've reached your vacation savings goal.",
      time: '1 day ago',
      type: 'success' as const,
      read: true
    },
    {
      id: 4,
      title: 'New Feature Available',
      description: 'Check out our new spending predictions feature!',
      time: '3 days ago',
      type: 'info' as const,
      read: true
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
    
    toast({
      title: "Notifications updated",
      description: "All notifications have been marked as read."
    });
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: true } 
        : notification
    ));
  };

  const hasUnreadNotifications = notifications.some(notification => !notification.read);

  return (
    <Layout>
      <div className="space-y-6 mb-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAsRead}
            disabled={!hasUnreadNotifications}
          >
            Mark all as read
          </Button>
        </div>
        
        <p className="text-muted-foreground">Stay updated with alerts about your finances</p>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                title={notification.title}
                description={notification.description}
                time={notification.time}
                type={notification.type}
                read={notification.read}
                onMarkAsRead={() => markAsRead(notification.id)}
              />
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;
