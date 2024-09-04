export enum ProductionCalendarDayStatus {
  WORK_DAY = 'WORK_DAY',
  WEEKEND = 'WEEKEND',
  SHORTENED_DAY = 'SHORTENED_DAY',
}

export type CalendarDayOption = {
  value: ProductionCalendarDayStatus;
  hours: number;
  label: string;
  style: string;
};

export const calendarDayOptions: CalendarDayOption[] = [
  {
    value: ProductionCalendarDayStatus.WORK_DAY,
    label: 'Рабочий день',
    hours: 8,
    style: '',
  },
  {
    value: ProductionCalendarDayStatus.WEEKEND,
    label: 'Выходной день',
    hours: 0,
    style: 'bg-cell__weekend',
  },
  {
    value: ProductionCalendarDayStatus.SHORTENED_DAY,
    label: 'Сокращенный день',
    hours: 7,
    style: 'bg-cell__shortened',
  },
];

export type AddableProductionCalendarDay = {
  day: string;
  status: ProductionCalendarDayStatus;
  hours: string;
};

export type ProductionCalendarDay = {
  id: number;
  day: string;
  status: ProductionCalendarDayStatus;
  hours: number;
};
