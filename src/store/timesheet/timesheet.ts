import dayjs from 'dayjs';
import { defineStore } from 'pinia';

import { DateFormat } from '@/constants';
import {
  fetchAvailableProjects,
  fetchTasks,
  fetchWeeklyTimesheet,
  deleteTimesheetEntry,
  updateTimesheetEntry,
  fetchUnsubmittedHours,
  submitTimesheet,
} from '@/shared/api';
import { useAuthStore } from '@/store';

import type {
  Project,
  TimesheetDay,
  TimesheetEntry,
  ITimesheetRow,
  TimesheetUnit,
  WeekHours,
} from '@/types';
import type { TimesheetState, Weekday } from './types';

export const useTimesheetStore = defineStore('timesheet', {
  state: (): TimesheetState => ({
    activeDay: null,
    currentUserId: null,
    days: [],
    editableRow: null,
    isLoading: false,
    isFetching: false,
    projects: [],
    timesheet: [],
    unsubmitted: [],
    updatedAt: null,
    weekStart: dayjs().startOf('week').toISODate(),
  }),

  persist: {
    paths: ['weekStart'],
  },

  actions: {
    async fetchTimesheet() {
      if (!this.updatedAt) {
        this.isLoading = true;
      }

      this.isFetching = true;

      try {
        const { data: timesheet, days } = await fetchWeeklyTimesheet(
          this.weekStart,
          this.userId
        );
        this.setTimesheet(timesheet);
        this.setDays(days);
      } finally {
        this.isLoading = false;
        this.isFetching = false;
      }
    },

    async fetchProjectTasks(projectId: number) {
      return await fetchTasks(projectId);
    },

    async fetchUnsubmittedHours() {
      const unsubmitted = await fetchUnsubmittedHours(this.userId);

      this.setUnsubmittedHours(unsubmitted);
    },

    async saveTimesheetRow(row: ITimesheetRow) {
      const entry: TimesheetEntry = {
        ...row,
        units: Object.values(row.units),
      };
      await this.updateTimesheetRow(entry);
    },

    async fetchProjects() {
      const projects = await fetchAvailableProjects(this.userId);

      this.setProjects(projects);
    },

    insertTimesheetEntry() {
      this.timesheet.unshift({
        projectId: undefined,
        taskId: undefined,
        projectName: '',
        taskName: '',
        userId: this.userId,
        observed: true,
        units: this.weekdays.map((day: Weekday) => ({
          billable: true,
          blocked: false,
          hours: 0,
          workDay: day.dt,
          id: 0,
          comment: '',
          rejected: false,
          rejectReason: null,
        })),
      });
    },

    async deleteTimesheetEntry(row: ITimesheetRow) {
      const entryIndex = this.getEntryIndex(row);

      if (row.taskId === 0) {
        this.timesheet = [
          ...this.timesheet.slice(0, entryIndex),
          ...this.timesheet.slice(entryIndex + 1),
        ];

        return;
      }

      const entry: TimesheetEntry = {
        ...row,
        units: Object.values(row.units),
      };

      await deleteTimesheetEntry(entry);
      await this.fetchUnsubmittedHours();
      this.timesheet = [
        ...this.timesheet.slice(0, entryIndex),
        ...this.timesheet.slice(entryIndex + 1),
      ];
    },

    setActiveDay(value: string) {
      this.activeDay = value;
    },

    setDays(days: TimesheetDay[]) {
      this.days = days;
    },

    setEditable(index: number | null) {
      this.editableRow = index;
    },

    setTimesheet(timesheet: TimesheetEntry[]) {
      this.timesheet = timesheet;
      this.updatedAt = new Date().toISOString();
    },

    setWeekStart(date: string) {
      const day = dayjs(date, DateFormat.ISO_DATE, true);

      if (day.isValid()) {
        this.weekStart = dayjs(date, DateFormat.ISO_DATE)
          .startOf('week')
          .toISODate();
      }
    },

    setUserId(userId?: number) {
      this.currentUserId = userId || null;
      this.fetchProjects();
      this.fetchTimesheet();
      this.fetchUnsubmittedHours();
    },

    setProjects(projects: Project[]) {
      this.projects = projects;
    },

    setUnsubmittedHours(unsubmitted: WeekHours[]) {
      this.unsubmitted = unsubmitted;
    },

    async updateTimesheetRow(entry: TimesheetEntry) {
      const resultRow = await updateTimesheetEntry(entry);
      if (Array.isArray(resultRow.units)) {
        const resultRowIndex = this.getEntryIndex(resultRow);

        if (resultRowIndex < 0) {
          if (Object.values(resultRow.units).every((unit) => !unit.id)) {
            this.timesheet.splice(0, 1);
          } else {
            this.timesheet[0] = resultRow;
          }
        } else {
          if (
            resultRow.units.findIndex((unit: TimesheetUnit) => unit.id > 0) < 0
          ) {
            this.timesheet.splice(resultRowIndex, 1);
          } else {
            this.timesheet[resultRowIndex] = resultRow;
          }
        }
      }

      await this.fetchUnsubmittedHours();
    },

    async submitTimesheet(weeks: string[]) {
      await submitTimesheet({
        userId: this.userId,
        weeks,
      });
    },

    async refreshTimesheet() {
      await Promise.all([this.fetchTimesheet(), this.fetchUnsubmittedHours()]);
    },
  },

  getters: {
    weekEnd: (state) => dayjs(state.weekStart).endOf('week').toISODate(),

    weekdays: (state): Weekday[] =>
      state.days.map(({ blocked, date }: TimesheetDay, index) => {
        const dateObject = dayjs(date);

        return {
          date: dateObject.format('D/MM'),
          dt: dateObject.toISODate(),
          dow: dateObject.format('dd'),
          weekday: index <= 4,
          blocked,
        };
      }),

    timesheetRows: (state): ITimesheetRow[] =>
      state.timesheet
        .map((row: TimesheetEntry) => ({
          ...row,
          units: row.units.reduce((acc, unit) => {
            acc[unit.workDay] = unit;

            return acc;
          }, {} as ITimesheetRow['units']),
        }))
        .sort(
          (a: ITimesheetRow, b: ITimesheetRow) =>
            (a.projectId ?? 0) - (b.projectId ?? 0) ||
            (a.taskId ?? 0) - (b.taskId ?? 0)
        ),

    userId(state): number | null {
      const { profile } = useAuthStore();

      return state.currentUserId || profile?.id || null;
    },

    // Get index of entry in the origin timesheet
    getEntryIndex(state) {
      return ({
        projectId,
        taskId,
      }: Pick<TimesheetEntry, 'projectId' | 'taskId'>) =>
        state.timesheet.findIndex(
          (entry) => projectId === entry.projectId && taskId === entry.taskId
        );
    },

    // Get index of row in the sorted timesheet
    getTimesheetRowIndex() {
      return (projectId: number, taskId: number) =>
        this.timesheetRows.findIndex(
          (row) => projectId === row.projectId && taskId === row.taskId
        );
    },

    isBlockedDate: (state) => (date: string) =>
      Boolean(
        state.days.find((day: TimesheetDay) => date === day.date)?.blocked
      ),

    getByDate: (state) => (date: string) =>
      state.days.find((day: TimesheetDay) => date === day.date),
      
    hasUnsubmittedHours: (state): boolean => state.unsubmitted.length > 0,
  },
});
