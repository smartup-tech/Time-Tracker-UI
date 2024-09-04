import type { ProductionCalendarDay } from '@/types';

export type ProductionCalendarDayState = {
  calendarDays: ProductionCalendarDay[];
  year: number;
  isFetching: boolean;
  count: number;
};
