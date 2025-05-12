import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: number;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  setUnreadCount: (count: number) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: true,
      setNotifications: (notifications) => set(() => ({ notifications })),
      addNotification: (notification) => 
        set((state) => ({ 
          notifications: [notification, ...state.notifications],
          unreadCount: notification.read ? state.unreadCount : state.unreadCount + 1
        })),
      markAsRead: (notificationId) => 
        set((state) => {
          const updatedNotifications = state.notifications.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: true } 
              : notification
          );
          
          const wasUnread = state.notifications.some(n => n.id === notificationId && !n.read);
          
          return { 
            notifications: updatedNotifications,
            unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount
          };
        }),
      markAllAsRead: () => 
        set((state) => ({ 
          notifications: state.notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0
        })),
      setUnreadCount: (count) => set(() => ({ unreadCount: count })),
      setLoading: (isLoading) => set(() => ({ isLoading })),
    }),
    {
      name: 'notification-store',
    }
  )
); 