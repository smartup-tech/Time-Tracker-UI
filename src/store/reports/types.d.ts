export interface ReportState<T> {
  filters: Record<string, (string | number | boolean)[] | null>;
  filteredRecords: T;
  report: T;
  isLoading: boolean;
  startDate: string;
  endDate: string;
}
