import { DateRange, MetaDayInfo, ProjectWeekHours, SubmittedHours, SubmittedWorkDays, WeekHours } from '@/types';

export type ApprovalDetailsState = {
  isLoading: boolean;
  records: SubmittedHours[];
  filteredRecords: SubmittedHours[];
};

export type ApprovalPeroidsState = {
  isLoading: boolean;
  records: WeekHours[];
};

export type ApprovalProjectsState = {
  isLoading: boolean;
  records: ProjectWeekHours[];
};

export type ApprovalWorkDaysState = {
  isLoading: boolean;
  days: MetaDayInfo[];
  records: SubmittedWorkDays[];
  dateRange?: DateRange;
}
