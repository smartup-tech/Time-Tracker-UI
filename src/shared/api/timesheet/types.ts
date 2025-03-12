import type { TimesheetDay, TimesheetEntry } from '@/types';

export type TimesheetWeeklyResponse = {
  days: TimesheetDay[];
  data: TimesheetEntry[];
};

export type SubmitTimesheetRequest = {
  employeeId: number | null;
  weeks: string[];
};
