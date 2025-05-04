
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Bell, CreditCard, AlertCircle, CheckCircle2, Clock, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";

interface NotificationItemProps {
  title: string;
  description: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'payment';
  read: boolean;
  onMarkAsRead: () => void;
  onClick: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  title, 
  description, 
  time, 
  type, 
  read,
  onMarkAsRead,
  onClick
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

  const handleClick = () => {
    if (!read) {
      onMarkAsRead();
    }
    onClick();
  };

  return (
    <div 
      className={`p-4 border-b ${read ? 'bg-white' : 'bg-blue-50'} cursor-pointer hover:bg-gray-50`}
      onClick={handleClick}
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

interface NotificationDetail {
  id: number;
  title: string;
  description: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'payment';
  content: React.ReactNode;
}

const Notifications: React.FC = () => {
  const { toast } = useToast();
  const [selectedNotification, setSelectedNotification] = useState<NotificationDetail | null>(null);
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Budget Alert',
      description: "You've reached 80% of your monthly grocery budget.",
      time: '10 mins ago',
      type: 'warning' as const,
      read: false,
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-500" />
              <div>
                <h3 className="font-semibold">Budget Alert: Groceries</h3>
                <p className="text-sm text-gray-500">Category: Food & Groceries</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p>You've spent <span className="font-semibold">$240</span> out of your <span className="font-semibold">$300</span> monthly grocery budget.</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <p className="text-sm text-gray-500">$60 remaining for the next 8 days</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">View Budget</Button>
            <Button size="sm">Adjust Budget</Button>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Payment Processed',
      description: 'Your payment of $45.00 to Netflix has been processed.',
      time: '2 hours ago',
      type: 'payment' as const,
      read: false,
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-purple-500" />
              <div>
                <h3 className="font-semibold">Payment Details</h3>
                <p className="text-sm text-gray-500">Transaction ID: #NF289475</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Merchant</span>
              <span className="font-medium">Netflix, Inc.</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Amount</span>
              <span className="font-medium">$45.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Date</span>
              <span className="font-medium">May 4, 2025</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Payment Method</span>
              <span className="font-medium">Visa ending in 4242</span>
            </div>
          </div>
          <Button className="w-full">View Transaction History</Button>
        </div>
      )
    },
    {
      id: 3,
      title: 'Savings Goal Reached',
      description: "Congratulations! You've reached your vacation savings goal.",
      time: '1 day ago',
      type: 'success' as const,
      read: true,
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <div>
                <h3 className="font-semibold">Goal Achieved!</h3>
                <p className="text-sm text-gray-500">Vacation Fund</p>
              </div>
            </div>
          </div>
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold">Congratulations!</h3>
            <p className="text-gray-600 mt-1">You've successfully saved $3,000 for your vacation!</p>
          </div>
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm">Set New Goal</Button>
            <Button size="sm">Transfer Funds</Button>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'New Feature Available',
      description: 'Check out our new spending predictions feature!',
      time: '3 days ago',
      type: 'info' as const,
      read: true,
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-blue-500" />
              <div>
                <h3 className="font-semibold">New Feature</h3>
                <p className="text-sm text-gray-500">Spending Predictions</p>
              </div>
            </div>
          </div>
          <div>
            <p>We're excited to introduce our new <strong>Spending Predictions</strong> feature that uses AI to help you forecast your expenses.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>View projected expenses for the coming months</li>
              <li>Get alerts for potential budget overruns</li>
              <li>Make smarter financial decisions with AI insights</li>
            </ul>
          </div>
          <div className="mt-4">
            <Button>Try It Now</Button>
          </div>
        </div>
      )
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

  const openNotificationDetail = (notification: NotificationDetail) => {
    setSelectedNotification(notification);
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
                onClick={() => openNotificationDetail(notification)}
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

      {/* Notification Detail Dialog */}
      <Dialog open={selectedNotification !== null} onOpenChange={(open) => !open && setSelectedNotification(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedNotification?.title}</DialogTitle>
            <DialogDescription className="flex justify-between items-center">
              <span>{selectedNotification?.time}</span>
              <DialogClose className="absolute right-4 top-4">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            {selectedNotification?.content}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Notifications;
