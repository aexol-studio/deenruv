'use client';

import type React from 'react';
import { Bell, Check, Clock, Trash2 } from 'lucide-react';
import { useEffect, useState, useRef, useMemo } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  useServer,
  Button,
  CardFooter,
  useNotifications,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  cn,
} from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';

type Notification = {
  name: string;
  running: boolean;
  isJobQueue: boolean;

  id: string;
  read: boolean;
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
};

const NOTIFICATIONS_LOCAL_STORAGE_KEY = 'DEENRUV_NOTIFICATIONS';

export const Notifications = () => {
  const cyclingNotifications = useNotifications(({ notifications }) => notifications);
  const getMainNotification = useNotifications(({ getMainNotification }) => getMainNotification);
  const jobQueues = useServer(({ jobQueues }) => jobQueues);

  const { t } = useTranslation('common');
  const [notifications, setNotifications] = useState<Array<Notification>>([]);
  const prevJobQueuesRef = useRef(jobQueues);
  const hasUnread = notifications.some((notification) => !notification.read);

  useEffect(() => {
    const savedNotifications = localStorage.getItem(NOTIFICATIONS_LOCAL_STORAGE_KEY);
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications).map((notification: any) => ({
          ...notification,
          icon: notification.running ? (
            <Clock className="size-4 text-blue-500" />
          ) : (
            <Check className="size-4 text-green-500" />
          ),
        }));
        setNotifications(parsedNotifications);
      } catch (error) {
        console.error('Failed to parse notifications from localStorage', error);
      }
    }
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      const serializableNotifications = notifications.map(({ icon: _, ...rest }) => rest);
      localStorage.setItem(NOTIFICATIONS_LOCAL_STORAGE_KEY, JSON.stringify(serializableNotifications));
    }
  }, [notifications]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem(NOTIFICATIONS_LOCAL_STORAGE_KEY);
  };

  const components = useMemo(
    () => getMainNotification(notifications.map((notification) => notification.id)),
    [notifications],
  );

  useEffect(() => {
    if (jobQueues.length > 0) {
      jobQueues.forEach((queue) => {
        const prevQueue = prevJobQueuesRef.current.find((q) => q.name === queue.name);

        if (queue.running && (!prevQueue || !prevQueue.running)) {
          const newNotification: Notification = {
            ...queue,
            id: `${queue.name}-start-${Date.now()}`,
            read: false,
            title: t('notificationsBox.titleStart', { name: queue.name }),
            description: t('notificationsBox.descriptionStart', { name: queue.name }),
            time: new Date().toLocaleTimeString(),
            icon: <Clock className="size-4 text-blue-500" />,
            isJobQueue: true,
          };
          setNotifications((prev) => [newNotification, ...prev].slice(0, 10));
        }

        if (prevQueue && prevQueue.running && !queue.running) {
          const newNotification: Notification = {
            ...queue,
            id: `${queue.name}-complete-${Date.now()}`,
            read: false,
            title: t('notificationsBox.titleComplete', { name: queue.name }),
            description: t('notificationsBox.descriptionComplete', { name: queue.name }),
            time: new Date().toLocaleTimeString(),
            icon: <Check className="size-4 text-green-500" />,
            isJobQueue: true,
          };
          setNotifications((prev) => [newNotification, ...prev].slice(0, 10));
        }
      });

      prevJobQueuesRef.current = [...jobQueues];
    }
  }, [jobQueues]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative size-10">
          <Bell className="size-4" />
          {hasUnread && (
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500">
              <span className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-75"></span>
            </span>
          )}
          <span className="sr-only">{t('notificationsBox.toggleNotifications')}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-md z-[2138] p-0" align="end">
        <Tabs defaultValue="ALL" className="w-full">
          <Card className="w-full border-0 shadow-none">
            <CardHeader
              className={cn(
                'bg-muted/30 flex w-full flex-col items-start justify-start gap-2 p-0',
                components.length === 0 && 'pb-3',
              )}
            >
              <div className="flex h-full w-full flex-1 items-center justify-between px-4 pt-3">
                <div className="flex flex-col">
                  <CardTitle className="text-base">{t('notificationsBox.notifications')}</CardTitle>
                  <CardDescription className="mt-1 text-xs">
                    {t('notificationsBox.recentNotifications')}
                  </CardDescription>
                </div>
                {notifications.length > 0 && (
                  <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={clearAllNotifications}>
                    <Trash2 className="mr-1 size-3" />
                    {t('notificationsBox.clearAll')}
                  </Button>
                )}
              </div>

              {components.length !== 0 && (
                <TabsList className="m-0 w-full rounded-none">
                  <TabsTrigger value="ALL" className="w-full rounded-none text-left">
                    {t('notificationsBox.all')}
                  </TabsTrigger>
                  {cyclingNotifications.map((notification) => (
                    <TabsTrigger
                      key={notification.id}
                      value={notification.id}
                      className="w-full rounded-none text-left"
                    >
                      {notification.id}
                    </TabsTrigger>
                  ))}
                </TabsList>
              )}
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-auto p-0">
              <TabsContent value="ALL">
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
                            <Clock className="text-muted-foreground mr-1 size-3" />
                            <span className="text-muted-foreground text-xs">{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                    <div className="bg-muted mb-3 rounded-full p-3">
                      <Bell className="text-muted-foreground size-6" />
                    </div>
                    <h3 className="text-sm font-medium">{t('notificationsBox.emptyStateMessage')}</h3>
                    <p className="text-muted-foreground mt-1 text-xs">{t('notificationsBox.emptyStateDescription')}</p>
                  </div>
                )}
              </TabsContent>
              {components.map((notification) => (
                <TabsContent key={notification.id} value={notification.id}>
                  {notification.component}
                </TabsContent>
              ))}
            </CardContent>
            {hasUnread && (
              <CardFooter className="flex items-center justify-end p-4">
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={markAllAsRead}>
                  <Check className="mr-1 size-3" />
                  {t('notificationsBox.markAllAsRead')}
                </Button>
              </CardFooter>
            )}
          </Card>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};
