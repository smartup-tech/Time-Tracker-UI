import { http, handleJSON } from '@/shared/lib';

import {
  AddableProductionCalendarDay,
  ProductionCalendarDay,
} from '@/types';

const BASE_URL = '/api/calendar';

export const addProductionCalendarDay = async (productionCalendarDay: AddableProductionCalendarDay): Promise<ProductionCalendarDay> =>
  await http.post(`${BASE_URL}`, productionCalendarDay).then(handleJSON);

export const fetchProductionCalendarDays = async (year: number): Promise<ProductionCalendarDay[]> => 
  await http.get(`${BASE_URL}?year=${year}`).then(handleJSON);

export const deleteProductionCalendarDay = async (calendarDayId: number) =>
  await http.delete(`${BASE_URL}/${calendarDayId}`);
