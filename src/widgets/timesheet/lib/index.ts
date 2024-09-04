import type { ITimesheetRow, TimesheetUnit } from '@/types';

export const getTotalRowHours = (row: ITimesheetRow) =>
  Object.values(row.units).reduce(
    (acc: number, unit) => (acc += unit.hours),
    0
  );

export const isUnsavedRow = (row: ITimesheetRow): boolean =>
  Object.values(row.units).every((unit) => !unit.id);

export const isLockedUnit = (unit: TimesheetUnit): boolean => unit.blocked;
