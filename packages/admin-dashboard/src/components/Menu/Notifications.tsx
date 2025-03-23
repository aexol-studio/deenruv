'use client';

import type React from 'react';
import { Bell, Check, Clock, Info, MailOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useServer,
} from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';

export const Notifications = () => {
  const { jobQueues } = useServer(({ jobQueues }) => ({ jobQueues }));
  const { t } = useTranslation('common');
  useEffect(() => {
    if (jobQueues.length > 0) {
      const anyNewJobs = jobQueues.some((queue) => queue.running);
      if (anyNewJobs) {
        setNotifications((notifications) => [
          ...notifications,
          {
            id: 3,
            title: 'New job',
            description: 'A new job has been added to the queue',
            time: 'just now',
            read: false,
            icon: <Clock className="h-4 w-4 text-blue-500" />,
          },
        ]);
      }
    }
  }, [jobQueues]);

  const [notifications, setNotifications] = useState<
    Array<{
      id: number;
      title: string;
      description: string;
      time: string;
      read: boolean;
      icon: React.ReactNode;
    }>
  >([]);

  const hasUnread = notifications.some((notification) => !notification.read);

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-10 w-10">
          <Bell className="h-4 w-4" />
          {hasUnread && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500">
              <span className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-75"></span>
            </span>
          )}
          <span className="sr-only">{t('toggleNotifications')}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[2138] w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="bg-muted/30 flex flex-row items-center justify-between space-y-0 px-4 pb-3 pt-4">
            <div>
              <CardTitle className="text-base">{t('notifications')}</CardTitle>
              <CardDescription className="mt-1 text-xs">{t('recentNotifications')}</CardDescription>
            </div>
            {hasUnread && (
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={markAllAsRead}>
                <Check className="mr-1 h-3 w-3" />
                {t('markAllAsRead')}
              </Button>
            )}
          </CardHeader>
          <CardContent className="max-h-[300px] overflow-auto p-0">
            {notifications.length > 0 ? (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 p-4 transition-colors ${notification.read ? 'bg-background' : 'bg-muted/20'}`}
                  >
                    <div className="mt-0.5">{notification.icon}</div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{notification.title}</p>
                      <p className="text-muted-foreground text-xs">{notification.description}</p>
                      <div className="flex items-center pt-1">
                        <Clock className="text-muted-foreground mr-1 h-3 w-3" />
                        <span className="text-muted-foreground text-xs">{notification.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                <div className="bg-muted mb-3 rounded-full p-3">
                  <Bell className="text-muted-foreground h-6 w-6" />
                </div>
                <h3 className="text-sm font-medium">{t('emptyStateMessage')}</h3>
                <p className="text-muted-foreground mt-1 text-xs">{t('emptyStateDescription')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};
