import { ProductionCalendarDayStatus } from '@/types';
import { Dayjs } from 'dayjs';

export type AddProductionCalendarDay = {
  status?: ProductionCalendarDayStatus;
  hours?: number;
  day?: Dayjs;
};
