import { defineStore } from 'pinia';

import { notificationApi } from '@/shared/api';

import type { Notification } from '@/types';
import type { NotificationsState } from './types';

export const useNotificationsStore = defineStore('notifications', {
  state: (): NotificationsState => ({
    isLoading: false,
    notifications: [],
    unreadCount: 0,
  }),

  getters: {
    hasNewNotifications: (state: NotificationsState) => state.unreadCount > 0,
  },

  actions: {
    async fetchNotifications() {
      this.isLoading = true;

      try {
        const notifications = await notificationApi.fetchNotifications();

        this.notifications = notifications;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUnreadCount() {
      const unreadCount = await notificationApi.fetchUnreadCount();

      this.unreadCount = unreadCount;
    },

    async markNotificationRead(id: number) {
      const index: number = this.notifications.findIndex(
        (notification: Notification) => id === notification.id
      );

      if (index < 0) {
        return;
      }

      this.notifications[index] = {
        ...this.notifications[index],
        read: true,
      };

      try {
        await notificationApi.markNotificationsRead([id]);
        await this.fetchUnreadCount();
      } catch (error) {
        this.fetchNotifications();
      }
    },

    async markAllNotificationsRead() {
      this.notifications = this.notifications.map(
        (notification: Notification) => ({
          ...notification,
          read: true,
        })
      );

      try {
        await notificationApi.markAllNotificationsRead();
        await this.fetchUnreadCount();
      } catch (error) {
        this.fetchNotifications();
      }
    },

    async deleteNotification(id: number) {
      const index: number = this.notifications.findIndex(
        (notification: Notification) => id === notification.id
      );

      if (index < 0) {
        return;
      }

      this.notifications = [
        ...this.notifications.slice(0, index),
        ...this.notifications.slice(index + 1),
      ];

      try {
        await notificationApi.deleteNotifications([id]);
        await this.fetchUnreadCount();
      } catch (error) {
        this.fetchNotifications();
      }
    },
  },
});
