import { defineStore } from 'pinia';
import sumBy from 'lodash/sumBy';

import { TimesheetUnitStatus } from '@/constants';
import {
  approveHours,
  fetchSubmittedHoursDetails,
  rejectHours,
} from '@/shared/api';

import type { SubmittedHours } from '@/types';
import type { ApprovalDetailsState } from './types';

export const useApprovalDetailsStore = defineStore('approval-details', {
  state: (): ApprovalDetailsState => ({
    isLoading: false,
    records: [],
    filteredRecords: [],
  }),

  getters: {
    totalHours: (state): number =>
      state.filteredRecords.length
        ? sumBy(state.filteredRecords, 'hours')
        : sumBy(state.records, 'hours'),
  },

  actions: {
    async fetchProjectHours(projectId: number, weekStart: string) {
      this.isLoading = true;

      try {
        const records = await fetchSubmittedHoursDetails(projectId, weekStart);

        this.records = records;
      } finally {
        this.isLoading = false;
      }
    },

    async approveHours(unitIds: number[]) {
      await approveHours(unitIds);
      this.records = this.records.map((item: SubmittedHours) => {
        return unitIds.includes(item.trackUnitId)
          ? {
              ...item,
              status: TimesheetUnitStatus.APPROVED,
            }
          : item;
      });
    },

    async rejectHours(unitIds: number[], rejectReason: string) {
      await rejectHours(unitIds, rejectReason);

      this.records = this.records.map((item: SubmittedHours) => {
        return unitIds.includes(item.trackUnitId)
          ? {
              ...item,
              status: TimesheetUnitStatus.REJECTED,
            }
          : item;
      });
    },

    setFilteredRecords(records: SubmittedHours[]) {
      this.filteredRecords = records;
    },

    resetDetails() {
      this.records = [];
    },
  },
});
