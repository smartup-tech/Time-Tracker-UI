import { TimesheetUnitStatus } from '@/constants';
import { ProductionCalendarDayStatus } from './calendar';

export interface TimesheetEntry {
  projectId?: number;
  projectName: string;
  taskId?: number;
  taskName: string;
  userId: number | null;
  observed: boolean;
  units: TimesheetUnit[];
}

export type TimesheetUnit = {
  billable: boolean;
  blocked: boolean;
  comment: string;
  hours: number;
  id: number;
  rejected: boolean;
  rejectReason: string | null;
  workDay: string;
};

export interface ITimesheetRow extends Omit<TimesheetEntry, 'units'> {
  units: Record<string, TimesheetUnit>;
}

export type TimesheetDay = {
  blocked: boolean;
  date: string;
  status: ProductionCalendarDayStatus;
  standardHours: number;
};

export type WeekHours = {
  hours: number;
  week: string;
};

export type ProjectWeekHours = {
  projectId: number;
  projectName: string;
  submittedHours: number;
  totalHours: number;
};

export type SubmittedHours = {
  billable: boolean;
  comment: string;
  firstName: string;
  hours: number;
  lastName: string;
  status?: `${TimesheetUnitStatus}`;
  taskId: number;
  taskName: string;
  trackUnitId: number;
  userId: number;
  workDay: string;
};

export type MetaDayInfo = {
  date: string;
  status: ProductionCalendarDayStatus;
  standardHours: number;
}

export type SubmittedWorkDays = {
  userId: number;
  firstName: string;
  lastName: string;
  summaryTrackUnits: SubmittedSummaryDay[];
  projectTrackUnits: SubmittedProjectTaskWorkDay[];
};

export type SubmittedSummaryDay = {
  date: string;
  hours: number;
}

export type SubmittedProjectTaskWorkDay = {
  projectId: number;
  projectName: string;
  taskId: number;
  taskName: string;
  trackUnits: SubmittedTrackUnit[];
}

export type SubmittedTrackUnit = {
  trackUnitId: number;
  date: string;
  hours: number;
}

export type SubmittedDataForAction = {
  trackUnitId: number;
  firstName: string;
  lastName: string;
  workDay: string | Date;
  taskName: string;
  hours: number;
};

export type UserGroupKey = {
  userId: number;
  firstName: string;
  lastName: string;
};

export type ProjectGroupKey = {
  projectId: number;
  projectName: string;
  taskName: string;
};

export type ApprovalDayRow = { [k: string]: string | number | number[] };

export type ApprovalDayNestedRow = {
  [k: string]: string | number | number[] | SubmittedDataForAction[];
};
