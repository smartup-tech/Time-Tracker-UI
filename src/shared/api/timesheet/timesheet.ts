import { handleJSON, http, stringifyQueryParams } from '@/shared/lib';

import type {
  Project,
  SearchableRequestParams,
  TimesheetEntry,
  WeekHours,
  User,
} from '@/types';
import type { SubmitTimesheetRequest, TimesheetWeeklyResponse } from './types';

const BASE_URL = '/api/trackUnits';

export const fetchWeeklyTimesheet = async (
  startDate: string,
  userId?: number | null
): Promise<TimesheetWeeklyResponse> => {
  const query = stringifyQueryParams({
    dateWeek: startDate,
    userId,
  });
  const response = await http.get(`${BASE_URL}/week${query}`);

  return handleJSON(response);
};

export const fetchUnsubmittedHours = async (
  userId?: number | null
): Promise<WeekHours[]> => {
  const query = stringifyQueryParams({ userId });
  const response = await http.get(`${BASE_URL}/unsubmitted${query}`);

  return handleJSON(response);
};

export const updateTimesheetEntry = (
  row: TimesheetEntry
): Promise<TimesheetEntry> =>
  http.patch(`${BASE_URL}/week`, row).then(handleJSON);

export const deleteTimesheetEntry = (row: TimesheetEntry): Promise<void> =>
  http.delete(`${BASE_URL}/week`, row).then(handleJSON);

export const fetchAvailableUsers = async (
  params?: SearchableRequestParams
): Promise<User[]> => {
  const query = stringifyQueryParams(params);
  const response = await http.get(`${BASE_URL}/users${query}`);

  return handleJSON(response);
};

export const fetchAvailableProjects = async (
  userId?: number | null
): Promise<Project[]> => {
  const query = stringifyQueryParams({ userId });
  const response = await http.get(`${BASE_URL}/projects${query}`);

  return handleJSON(response);
};

export const submitTimesheet = async (
  body: SubmitTimesheetRequest
): Promise<void> => http.post(`${BASE_URL}/submit`, body).then(handleJSON);
