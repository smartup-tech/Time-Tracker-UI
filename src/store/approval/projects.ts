import { defineStore } from 'pinia';

import { fetchSubmittedHoursPerProject } from '@/shared/api';

import type { ApprovalProjectsState } from './types';

export const useApprovalProjectsStore = defineStore('approval-projects', {
  state: (): ApprovalProjectsState => ({
    isLoading: false,
    records: [],
  }),

  actions: {
    async fetchProjectHours(weekStart: string) {
      this.isLoading = true;

      try {
        const records = await fetchSubmittedHoursPerProject(weekStart);

        this.records = records;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
