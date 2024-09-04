import { defineStore } from 'pinia';

import {
  fetchProductionCalendarDays,
  addProductionCalendarDay,
  deleteProductionCalendarDay,
} from '@/shared/api';

import type {
  ProductionCalendarDay,
  AddableProductionCalendarDay,
} from '@/types';
import type { ProductionCalendarDayState } from './types';
import dayjs from 'dayjs';

export const useProductionCalendarStore = defineStore('production-calendar', {
  state: (): ProductionCalendarDayState => ({
    calendarDays: [],
    isFetching: false,
    year: new Date().getFullYear(),
    count: 0,
  }),

  actions: {
    async fetchProductionCalendarDays() {
      this.isFetching = true;

      try {
        const data = (await fetchProductionCalendarDays(this.year)).sort(
          (day1, day2) =>
            new Date(day1.day).getTime() - new Date(day2.day).getTime()
        );
        this.setDays(data);
      } finally {
        this.isFetching = false;
      }
    },

    async saveCalendarDay(
      calendarDay: AddableProductionCalendarDay
    ): Promise<ProductionCalendarDay> {
      const res = await addProductionCalendarDay(calendarDay);
      await this.fetchProductionCalendarDays();
      return res;
    },

    async deleteProductionCalendarDay(day: ProductionCalendarDay) {
      await deleteProductionCalendarDay(day.id);
      await this.fetchProductionCalendarDays();
    },

    setDays(days: ProductionCalendarDay[]) {
      this.calendarDays = days;
    },

    setYear(year: number) {
      this.year = year;
    },

    setCount(count: number) {
      this.count = count;
    },

    getByDate(date: string) {
      return this.calendarDays.find(
        (day) => dayjs(day.day).toISODate() === dayjs(date).toISODate()
      );
    },
  },
  getters: {},
});
