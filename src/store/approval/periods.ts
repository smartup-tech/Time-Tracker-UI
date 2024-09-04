import { defineStore } from 'pinia';

import { fetchSubmittedHours } from '@/shared/api';

import type { ApprovalPeroidsState } from './types';

export const useApprovalPeriodsStore = defineStore('approval-periods', {
  state: (): ApprovalPeroidsState => ({
    isLoading: false,
    records: [],
  }),

  actions: {
    async fetchSubmittedHours() {
      this.isLoading = true;

      try {
        const records = await fetchSubmittedHours();

        this.records = records;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
