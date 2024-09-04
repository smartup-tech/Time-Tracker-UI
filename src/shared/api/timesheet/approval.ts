import { handleJSON, http, stringifyQueryParams } from '@/shared/lib';

import {
  DateRange,
  MetaDayInfo,
  ProjectWeekHours,
  SubmittedHours,
  SubmittedWorkDays,
  WeekHours,
} from '@/types';

const BASE_URL = '/api/approval';

export const fetchSubmittedHours = (): Promise<WeekHours[]> =>
  http.get(`${BASE_URL}/submitted`).then(handleJSON);

export const fetchSubmittedHoursPerProject = async (
  dateWeek: string
): Promise<ProjectWeekHours[]> => {
  const query = stringifyQueryParams({ dateWeek });
  const response = await http.get(`${BASE_URL}/submittedByProjects${query}`);

  return handleJSON(response);
};

export const fetchSubmittedHoursDetails = async (
  projectId: number,
  dateWeek: string
): Promise<SubmittedHours[]> => {
  const query = stringifyQueryParams({ dateWeek });
  const response = await http.get(`${BASE_URL}/submitted/${projectId}${query}`);

  return handleJSON(response);
};

export const fetchSubmittedWorkDays = async (
  dateRange?: DateRange
): Promise<{
  days: MetaDayInfo[];
  data: SubmittedWorkDays[];
}> => {
  const query = dateRange
    ? stringifyQueryParams({
        startDate: dateRange[0].toISODate(),
        endDate: dateRange[1].toISODate(),
      })
    : '';

  const response = await http.get(`${BASE_URL}/submittedDays${query}`);

  return handleJSON(response);
};

export const approveHours = (trackUnitIds: number[]): Promise<void> =>
  http.post(`${BASE_URL}/approve`, { trackUnitIds }).then(handleJSON);

export const rejectHours = (
  trackUnitIds: number[],
  rejectReason: string
): Promise<void> =>
  http
    .post(`${BASE_URL}/reject`, { trackUnitIds, rejectReason })
    .then(handleJSON);
