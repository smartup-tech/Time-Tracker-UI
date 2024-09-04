import { defineStore } from 'pinia';

import { createLock, fetchLocks, fetchLastLock, fetchUnfreezeLock, unLock } from '@/shared/api';

import type { FreezeRecord } from '@/types';
import type { TimeFreezeState } from './types';
import dayjs from 'dayjs';

export const useTimeFreezeStore = defineStore('time-freeze', {
  state: (): TimeFreezeState => ({
    isLoading: false,
    records: [],
    lastFreeze: null,
    unfreezeRecord: null,
  }),

  getters: {
    sortedRecords: (state): FreezeRecord[] =>
      state.records.sort(
        (a, b) =>
          new Date(a.freezeDate).getTime() - new Date(b.freezeDate).getTime()
      ),

    freezeDates(): string[] {
      return this.sortedRecords.filter(record => record.status !== "UN_FREEZE").map(record => dayjs(record.freezeDate).toISODate())
    }
  },

  actions: {
    async fetchFreezeRecords() {
      this.isLoading = true;

      try {
        const records = await fetchLocks();

        this.setRecords(records);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchLastFreezeRecord() {
      const record = await fetchLastLock();
      if (JSON.stringify(record) !== "{}") {
        this.setLastFreeze(record);
      }
    },

    async fetchUnfreezeRecord() {
      const record = await fetchUnfreezeLock();
      if (JSON.stringify(record) !== "{}") {
        this.setUnfreeze(record);
      }
    },

    async freezeTime(dates: string[]) {
      const records = await createLock(dates);

      this.setRecords(records);
    },

    async unfreezeTime() {
      const record = await unLock();
      this.setUnfreeze(record);
    },

    setRecords(records: FreezeRecord[]) {
      this.records = records;
    },

    setLastFreeze(record: FreezeRecord) {
      this.lastFreeze = record;
    },

    setUnfreeze(record: FreezeRecord) {
      this.unfreezeRecord = record;
    }
  },
});
