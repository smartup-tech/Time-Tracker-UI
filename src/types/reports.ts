import { Dayjs } from 'dayjs';

export type HoursRecord = {
  billableHours: number;
  billableHoursFrozen: number;
  billableHoursNotFrozen: number;
  unbillableHours: number;
  unbillableHoursFrozen: number;
  unbillableHoursNotFrozen: number;
  totalHours: number;
  totalHoursFrozen: number;
  totalHoursNotFrozen: number;
};

export type UserHoursReportRecord = HoursRecord & {
  projectId: number;
  projectName: string;
  taskId: number;
  taskName: string;
  userId: number;
  userFirstName: string;
  userLastName: string;
};

export type ProjectHoursReportRecord = HoursRecord & {
  projectId: number;
  projectName: string;
};

export type HoursReportRecord =
  | UserHoursReportRecord
  | ProjectHoursReportRecord;

export type UserHoursReport = UserHoursReportRecord[];
export type ProjectHoursReport = ProjectHoursReportRecord[];

export interface ReportRequestParams {
  startDate: string;
  endDate: string;
}

export type DateRange = [Dayjs, Dayjs];
