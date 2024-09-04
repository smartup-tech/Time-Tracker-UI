import dayjs, { Dayjs } from 'dayjs';
import pluralRu from 'plural-ru';

import { DateFormat } from '@/constants';
import { useNumberFormat } from '../composables';
import { useDateFormat } from '@vueuse/core';

export const getFullDate = (date: string, format = DateFormat.ISO_DATE_TIME) =>
  dayjs.utc(date, format).format('LL');

export const getWeekRange = (weekStart: string): [Dayjs, Dayjs] => {
  const startDate = dayjs(weekStart);
  const endDate = startDate.add(6, 'day');

  return [startDate, endDate];
};

export const getFormattedWeekRange = (weekStart: string): string => {
  const [startDate, endDate] = getWeekRange(weekStart);
  const format = 'D MMMM YYYY';

  return `c ${startDate.format(format)} по ${endDate.format(format)}`;
};

export const getDashSeparatedWeekRange = (weekStart: string): string => {
  const [startDate, endDate] = getWeekRange(weekStart);

  return `${startDate.format(DateFormat.DOT)} – ${endDate.format(
    DateFormat.DOT
  )}`;
};

export const formatHours = (hours: number): string => {
  if (!hours) {
    return '0.00';
  }

  const [int, fraction] = hours.toFixed(2).split('.');

  return `${useNumberFormat(Number.parseInt(int, 10))}.${fraction}`;
};

export const formatAdaptiveDate = (value: string): string => {
  const date = dayjs.tz(value, DateFormat.ISO_DATE_TIME, 'UTC').local();

  if (date.isSame(dayjs(), 'day')) {
    return `сегодня, ${date.format(DateFormat.TIME)}`;
  }

  if (date.isSame(dayjs(), 'year')) {
    return date.format(DateFormat.DAY_MONTH_TIME);
  }

  return date.format(DateFormat.DAY_MONTH_YEAR_TIME);
};

export const formatDate = (
  value: string,
  format = DateFormat.DAY_MONTH_YEAR,
  parseFormat = DateFormat.ISO_DATE
) => dayjs(value, parseFormat).format(format);

export const getPluralHours = (value: number) =>
  pluralRu(value, '%d час', '%d часа', '%d часов');

export const getDateFromRagePerDay = (
  firstDate: string,
  secondDate: string
): Date[] => {
  const dates: Date[] = [];
  const fDate = dayjs(firstDate, DateFormat.DOT);
  const sDate = dayjs(secondDate, DateFormat.DOT).add(1, 'days');

  for (
    let tempDate = fDate;
    tempDate.isBefore(sDate);
    tempDate = tempDate.add(1, 'days')
  ) {
    dates.push(tempDate.toDate());
  }
  return dates;
};

export const getDayFromDate = (value: string | Date): number => {
  return dayjs(value).date();
};

export const getDateCell = (date: string) => {
  const day = useDateFormat(date, 'DD.MM').value;

  return {
    key: date,
    title: day,
    dataIndex: date,
  };
};
