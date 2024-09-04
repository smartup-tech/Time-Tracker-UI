import type { TimesheetDay, TimesheetEntry } from '@/types';

export type TimesheetWeeklyResponse = {
  days: TimesheetDay[];
  data: TimesheetEntry[];
};

export type SubmitTimesheetRequest = {
  userId: number | null;
  weeks: string[];
};
