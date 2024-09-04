import { defineStore } from 'pinia';
import dayjs from 'dayjs';

import { fetchProjectHoursReport } from '@/shared/api';
import { useLocaleState } from '@/shared/lib';

import type {
  DateRange,
  Project,
  ProjectHoursReport,
  ProjectHoursReportRecord,
} from '@/types';
import type { ReportState } from './types';

export const useProjectHoursReportsStore = defineStore(
  'project-hours-reports',
  {
    state: (): ReportState<ProjectHoursReport> => ({
      isLoading: false,
      report: [],
      filters: {
        project: null,
        task: null,
        user: null,
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
          const report = await fetchProjectHoursReport({
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

      setReport(report: ProjectHoursReport) {
        this.report = report;
      },

      setFilters(filters: ReportState<ProjectHoursReport>['filters']) {
        this.filters = filters;
      },

      setFilteredRecords(records: ProjectHoursReportRecord[]) {
        this.filteredRecords = records;
      },

      clearAllFilters() {
        this.setFilters({
          project: null,
          task: null,
          user: null,
        });
        this.setFilteredRecords([]);
      },
    },

    getters: {
      isFiltered: (state): boolean =>
        !!(
          state.filters &&
          (state.filters.project || state.filters.task || state.filters.user)
        ),

      dateRange: (state): DateRange => [
        dayjs(state.startDate),
        dayjs(state.endDate),
      ],

      records(state): ProjectHoursReportRecord[] {
        const report = state.report;
        const filteredRecords = state.filteredRecords;
        return this.isFiltered ? filteredRecords : report;
      },

      projects(): Pick<Project, 'id' | 'name'>[] {
        const locale = useLocaleState();

        return [
          ...new Map(
            this.report.map(
              ({
                projectId: id,
                projectName: name,
              }: ProjectHoursReportRecord) => [id, { id, name }]
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
