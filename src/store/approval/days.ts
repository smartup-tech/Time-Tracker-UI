import { defineStore } from 'pinia';

import { fetchSubmittedWorkDays } from '@/shared/api';

import type { ApprovalWorkDaysState } from './types';
import { MetaDayInfo, SubmittedWorkDays } from '@/types/timesheet';
import { DateRange } from '@/types/reports';
import dayjs from 'dayjs';

export const useApprovalDaysStore = defineStore('approval-days', {
  state: (): ApprovalWorkDaysState => ({
    isLoading: false,
    records: [],
    days: [],
    dateRange: undefined,
  }),
  actions: {
    async fetchSubmittedWorkDays() {
      this.isLoading = true;

      try {
        const { data, days } = await fetchSubmittedWorkDays(this.dateRange);

        this.setRecords(data);
        this.setDays(days);

        const dates = [
          ...days.map((metaDay) => new Date(metaDay.date).getTime()),
        ];
        if (!this.dateRange) {
          this.dateRange = [
            dayjs(Math.min(...dates)),
            dayjs(Math.max(...dates)),
          ];
        }
      } finally {
        this.isLoading = false;
      }
    },

    setRecords(records: SubmittedWorkDays[]) {
      this.records = [...records];
    },

    setDays(days: MetaDayInfo[]) {
      this.days = [...days];
    },

    setDateRange(range?: DateRange) {
      this.dateRange = range;
    },
  },
  getters: {
    getByDate: (state) => (date: string) => {
      return state.days.find((metaDate) => metaDate.date === date);
    },
  },
});
