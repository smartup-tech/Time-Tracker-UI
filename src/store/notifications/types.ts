import type { Notification, NotificationSchedule } from '@/types';

export interface NotificationsState {
  isLoading: boolean;
  notifications: Notification[];
  unreadCount: number;
}

export interface NotificationSettingsState {
  isLoading: boolean;
  schedule: NotificationSchedule;
}
