import { defineStore } from 'pinia';

import { notificationApi } from '@/shared/api';

import type { NotificationSchedule } from '@/types';
import type { NotificationSettingsState } from './types';

export const useNotificationSettingsStore = defineStore(
  'notification-settings',
  {
    state: (): NotificationSettingsState => ({
      isLoading: false,
      schedule: {
        days: [],
      },
    }),

    actions: {
      async fetchSchedule() {
        this.isLoading = true;
        try {
          const schedule = await notificationApi.fetchSchedule();

          this.schedule = schedule;
        } finally {
          this.isLoading = false;
        }
      },

      async setSchedule(schedule: NotificationSchedule) {
        this.schedule = schedule;

        try {
          await notificationApi.updateSchedule(schedule);
        } catch (error) {
          this.fetchSchedule();

          throw error;
        }
      },
    },
  }
);
