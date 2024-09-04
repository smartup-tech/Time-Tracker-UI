import { defineStore } from 'pinia';
import dayjs from 'dayjs';

import { fetchPersonalHoursReport } from '@/shared/api';
import { useLocaleState } from '@/shared/lib';

import type {
  DateRange,
  UserHoursReport,
  UserHoursReportRecord,
  Project,
  Task,
} from '@/types';
import type { ReportState } from './types';

export const usePersonalHoursReportsStore = defineStore(
  'personal-hours-report',
  {
    state: (): ReportState<UserHoursReport> => ({
      isLoading: false,
      report: [],
      filters: {
        project: null,
        task: null,
      },
      filteredRecords: [],
      startDate: dayjs().startOf('month').toISODate(),
      endDate: dayjs().endOf('month').toISODate(),
    }),

    actions: {
      async fetchReport() {
        const { startDate, endDate } = this;

        this.isLoading = true;

        try {
          const report = await fetchPersonalHoursReport({
            startDate,
            endDate,
          });

          this.clearAllFilters();
          this.setReport(report);
        } finally {
          this.isLoading = false;
        }
      },

      setDateRange(dateRange: DateRange) {
        const [startDate, endDate] = dateRange;

        this.startDate = startDate.toISODate();
        this.endDate = endDate.toISODate();
      },

      setReport(report: UserHoursReport) {
        this.report = report;
      },

      setFilters(filters: ReportState<UserHoursReport>['filters']) {
        this.filters = filters;
      },

      setFilteredRecords(records: UserHoursReportRecord[]) {
        this.filteredRecords = records;
      },

      clearAllFilters() {
        this.setFilters({
          project: null,
          task: null,
        });
        this.setFilteredRecords([]);
      },
    },

    getters: {
      isFiltered: (state): boolean =>
        !!(state.filters && (state.filters.project || state.filters.task)),

      dateRange: (state): DateRange => [
        dayjs(state.startDate),
        dayjs(state.endDate),
      ],

      records(state): UserHoursReportRecord[] {
        const report = state.report;
        const filteredRecords = state.filteredRecords;
        return this.isFiltered ? filteredRecords : report;
      },

      projects(): Pick<Project, 'id' | 'name'>[] {
        const locale = useLocaleState();

        return [
          ...new Map(
            this.report.map(
              ({ projectId: id, projectName: name }: UserHoursReportRecord) => [
                id,
                { id, name },
              ]
            )
          ).values(),
        ].sort((a, b) =>
          a.name.localeCompare(b.name, locale.value, { numeric: true })
        );
      },

      tasks(): Pick<Task, 'id' | 'name'>[] {
        const locale = useLocaleState();

        return [
          ...new Map(
            this.report.map(
              ({ taskId: id, taskName: name }: UserHoursReportRecord) => [
                id,
                { id, name },
              ]
            )
          ).values(),
        ].sort((a, b) =>
          a.name.localeCompare(b.name, locale.value, { numeric: true })
        );
      },
    },

    persist: {
      paths: ['startDate', 'endDate'],
    },
  }
);
