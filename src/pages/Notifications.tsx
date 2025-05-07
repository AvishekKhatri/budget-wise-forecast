
import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';

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
      className={`p-4 border-b ${read ? 'bg-white dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900/30'} cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700`}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {time}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{description}</p>
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
  read: boolean;
  content: React.ReactNode;
  actions?: {
    primary?: {
      label: string;
      action: string;
    };
    secondary?: {
      label: string;
      action: string;
    };
  };
}

// Define serializable notification type without React.ReactNode
interface SerializableNotification {
  id: number;
  title: string;
  description: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'payment';
  read: boolean;
  actions?: {
    primary?: {
      label: string;
      action: string;
    };
    secondary?: {
      label: string;
      action: string;
    };
  };
}

// Create a custom event for notification updates
const notificationEvent = new Event('notificationsUpdated');

const Notifications: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Define action handling function before useState to avoid the initialization error
  const handleNotificationAction = (actionType: string) => {
    switch (actionType) {
      case 'viewBudget':
        navigate('/budgets');
        toast({
          title: "Navigation",
          description: "Navigating to budget page"
        });
        break;
      case 'adjustBudget':
        navigate('/budgets');
        toast({
          title: "Adjust Budget",
          description: "Opening budget adjustment interface"
        });
        break;
      case 'viewTransaction':
        navigate('/transactions');
        toast({
          title: "Navigation",
          description: "Viewing transaction history"
        });
        break;
      case 'setNewGoal':
        toast({
          title: "New Goal",
          description: "Opening goal setting interface"
        });
        break;
      case 'transferFunds':
        toast({
          title: "Transfer Funds",
          description: "Opening fund transfer interface"
        });
        break;
      case 'tryNewFeature':
        navigate('/forecast');
        toast({
          title: "New Feature",
          description: "Trying out spending predictions"
        });
        break;
    }
    setSelectedNotification(null); // Close dialog after action
  };
  
  const [selectedNotification, setSelectedNotification] = useState<NotificationDetail | null>(null);
  
  // Create notification content based on type - this shouldn't be stored in localStorage
  const createNotificationContent = (notification: SerializableNotification): React.ReactNode => {
    switch (notification.type) {
      case 'warning':
        return (
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
          </div>
        );
      case 'payment':
        return (
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
          </div>
        );
      case 'success':
        return (
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
          </div>
        );
      case 'info':
        return (
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
          </div>
        );
      default:
        return <div>No details available</div>;
    }
  };
  
  // Load notifications from local storage on mount
  const [notifications, setNotifications] = useState<NotificationDetail[]>(() => {
    try {
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        // Parse the basic notification data
        const parsedNotifications: SerializableNotification[] = JSON.parse(savedNotifications);
        
        // Add the React content to each notification
        return parsedNotifications.map(notification => ({
          ...notification,
          content: createNotificationContent(notification)
        }));
      }
    } catch (error) {
      console.error('Error parsing notifications:', error);
    }
    
    // Return default notifications if none in storage or there was an error
    return getDefaultNotifications();
  });
  
  // Generate default notifications
  function getDefaultNotifications(): NotificationDetail[] {
    const defaultSerializableNotifications: SerializableNotification[] = [
      {
        id: 1,
        title: 'Budget Alert',
        description: "You've reached 80% of your monthly grocery budget.",
        time: '10 mins ago',
        type: 'warning',
        read: false,
        actions: {
          primary: {
            label: "Adjust Budget",
            action: "adjustBudget"
          },
          secondary: {
            label: "View Budget",
            action: "viewBudget"
          }
        }
      },
      {
        id: 2,
        title: 'Payment Processed',
        description: 'Your payment of $45.00 to Netflix has been processed.',
        time: '2 hours ago',
        type: 'payment',
        read: false,
        actions: {
          primary: {
            label: "View Transaction History",
            action: "viewTransaction"
          }
        }
      },
      {
        id: 3,
        title: 'Savings Goal Reached',
        description: "Congratulations! You've reached your vacation savings goal.",
        time: '1 day ago',
        type: 'success',
        read: true,
        actions: {
          primary: {
            label: "Transfer Funds",
            action: "transferFunds"
          },
          secondary: {
            label: "Set New Goal",
            action: "setNewGoal"
          }
        }
      },
      {
        id: 4,
        title: 'New Feature Available',
        description: 'Check out our new spending predictions feature!',
        time: '3 days ago',
        type: 'info',
        read: true,
        actions: {
          primary: {
            label: "Try It Now",
            action: "tryNewFeature"
          }
        }
      }
    ];
    
    // Add the content to each notification
    return defaultSerializableNotifications.map(notification => ({
      ...notification,
      content: createNotificationContent(notification)
    }));
  }
  
  // Save notifications to local storage whenever they change
  useEffect(() => {
    try {
      // Strip out the non-serializable content property before storing
      const serializableNotifications = notifications.map(({ content, ...rest }) => rest);
      localStorage.setItem('notifications', JSON.stringify(serializableNotifications));
      
      // Dispatch custom event to notify other components about the notification change
      window.dispatchEvent(notificationEvent);
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error);
    }
  }, [notifications]);
  
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    setNotifications(updatedNotifications);
    
    toast({
      title: "Notifications updated",
      description: "All notifications have been marked as read."
    });
  };

  const markAsRead = (id: number) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: true } 
        : notification
    );
    
    setNotifications(updatedNotifications);
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
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
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
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>No notifications yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Notification Detail Dialog */}
      <Dialog 
        open={selectedNotification !== null} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedNotification(null);
          }
        }}
      >
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
            
            {/* Action buttons rendered separately from content */}
            {selectedNotification?.actions && (
              <div className="flex justify-center gap-2 mt-4">
                {selectedNotification.actions.secondary && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleNotificationAction(selectedNotification.actions?.secondary?.action || '')}
                  >
                    {selectedNotification.actions.secondary.label}
                  </Button>
                )}
                {selectedNotification.actions.primary && (
                  <Button 
                    size="sm"
                    onClick={() => handleNotificationAction(selectedNotification.actions?.primary?.action || '')}
                  >
                    {selectedNotification.actions.primary.label}
                  </Button>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Notifications;
