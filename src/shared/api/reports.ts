import { handleJSON, http, stringifyQueryParams } from '@/shared/lib';

import type {
  ProjectHoursReport,
  ReportRequestParams,
  UserHoursReport,
} from '@/types';

const BASE_URL = '/api/reports';

export const fetchUserHoursReport = async (
  params: ReportRequestParams
): Promise<UserHoursReport> => {
  const query = stringifyQueryParams(params);
  const response = await http.get(`${BASE_URL}/hoursForUsers${query}`);

  return handleJSON(response);
};

export const fetchProjectHoursReport = async (
  params: ReportRequestParams
): Promise<ProjectHoursReport> => {
  const query = stringifyQueryParams(params);
  const response = await http.get(`${BASE_URL}/hoursForProjects${query}`);

  return handleJSON(response);
};

export const fetchPersonalHoursReport = async (
  params: ReportRequestParams
): Promise<UserHoursReport> => {
  const query = stringifyQueryParams(params);
  const response = await http.get(`${BASE_URL}/hoursForCurrentUser${query}`);

  return handleJSON(response);
};
