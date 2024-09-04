import type {
  Project,
  TimesheetDay,
  TimesheetEntry,
  WeekHours,
  User,
} from '@/types';

export type TimesheetState = {
  activeDay: string | null;
  currentUserId: number | null;
  days: TimesheetDay[];
  editableRow: number | null;
  isFetching: boolean;
  isLoading: boolean;
  projects: Project[];
  timesheet: TimesheetEntry[];
  updatedAt: string | null;
  unsubmitted: WeekHours[];
  weekStart: string;
};

export type Weekday = {
  blocked: boolean;
  dt: string;
  dow: string;
  date: string;
  weekday: boolean;
};

export type TimesheetUsersState = {
  isLoading: boolean;
  users: User[];
  query: string | null;
};
