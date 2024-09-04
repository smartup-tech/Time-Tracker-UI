import { defineStore } from 'pinia';
import dayjs from 'dayjs';

import { fetchUserHoursReport } from '@/shared/api';
import { useLocaleState } from '@/shared/lib';

import type {
  DateRange,
  Project,
  Task,
  User,
  UserHoursReport,
  UserHoursReportRecord,
} from '@/types';
import type { ReportState } from './types';

export const useUserHoursReportsStore = defineStore('user-hours-reports', {
  state: (): ReportState<UserHoursReport> => ({
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
        const report = await fetchUserHoursReport({
          startDate,
          endDate,
        });

        this.clearAllFilters();
        this.setReport(report.map((item, index) => ({ ...item, key: index })));
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

    records(state): UserHoursReportRecord[] {
      const report = state.report;
      const filteredRecords = state.filteredRecords;
      return this.isFiltered ? filteredRecords : report;
    },

    users(): Pick<User, 'id' | 'firstName' | 'lastName'>[] {
      const locale = useLocaleState();

      return [
        ...new Map(
          this.report.map(
            ({
              userId: id,
              userFirstName: firstName,
              userLastName: lastName,
            }: UserHoursReportRecord) => [
              id,
              {
                id,
                firstName,
                lastName,
              },
            ]
          )
        ).values(),
      ].sort(
        (a, b) =>
          a.lastName.localeCompare(b.lastName, locale.value, {
            numeric: true,
          }) ||
          a.firstName.localeCompare(b.firstName, locale.value, {
            numeric: true,
          })
      );
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
});
