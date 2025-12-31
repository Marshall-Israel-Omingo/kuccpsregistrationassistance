import { format } from 'date-fns';
import { Bell, CheckCircle, Info, AlertCircle, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

const getTypeConfig = (type: string) => {
  switch (type) {
    case 'success':
      return { icon: CheckCircle, color: 'text-success bg-success/10' };
    case 'warning':
      return { icon: AlertCircle, color: 'text-warning bg-warning/10' };
    case 'error':
      return { icon: AlertCircle, color: 'text-destructive bg-destructive/10' };
    default:
      return { icon: Info, color: 'text-secondary bg-secondary/10' };
  }
};

const NotificationsPage = () => {
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6 pb-20 lg:pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground">{unreadCount} unread</p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark All Read
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {notifications && notifications.length > 0 ? (
            notifications.map((notification) => {
              const typeConfig = getTypeConfig(notification.type);
              const TypeIcon = typeConfig.icon;

              return (
                <Card
                  key={notification.id}
                  className={cn(
                    'cursor-pointer transition-all hover:shadow-md',
                    !notification.read && 'border-l-4 border-l-primary bg-primary/5'
                  )}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead.mutate(notification.id);
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', typeConfig.color)}>
                        <TypeIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={cn(
                            'font-semibold text-foreground',
                            !notification.read && 'font-bold'
                          )}>
                            {notification.title}
                          </h3>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">You're all caught up!</h3>
                <p className="text-muted-foreground">No notifications at the moment</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
