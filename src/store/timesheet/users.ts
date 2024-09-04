import { defineStore } from 'pinia';

import { fetchAvailableUsers } from '@/shared/api';
import { useAuthStore } from '@/store';

import type { TimesheetUsersState } from './types';

export const useTimesheetUsersStore = defineStore('timesheet-users', {
  state: (): TimesheetUsersState => ({
    isLoading: false,
    users: [],
    query: null,
  }),

  getters: {
    availableUsers: (state) => {
      const { profile } = useAuthStore();

      return profile && state.users.length === 0 && !state.query
        ? [profile]
        : state.users;
    },
  },

  actions: {
    async fetchUsers(query?: string) {
      this.setQuery(query);

      this.isLoading = true;

      try {
        const users = await fetchAvailableUsers({ query });

        this.users = users;
      } finally {
        this.isLoading = false;
      }
    },

    setQuery(query?: string) {
      this.query = query || null;
    },
  },
});
