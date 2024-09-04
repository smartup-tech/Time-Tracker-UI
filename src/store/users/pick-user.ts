import { defineStore } from 'pinia';

import { fetchUsersForProject } from '@/shared/api';

import type { User } from '@/types';
import type { PickUserState } from './types';

export const usePickUserStore = defineStore('pick-user', {
  state: (): PickUserState => ({
    users: [],
    isLoading: false,
  }),

  actions: {
    async fetchUsersForProject(projectId: number, query?: string) {
      if (!projectId) {
        return;
      }

      this.isLoading = true;

      try {
        const users = await fetchUsersForProject(projectId, query);

        this.setUsers(users);
      } finally {
        this.isLoading = false;
      }
    },

    setUsers(users: User[]) {
      this.users = users;
    },

    reset() {
      this.$reset();
    },
  },
});
