import { handleJSON, http, stringifyQueryParams } from '@/shared/lib';

import type { CreatePosition, PagedResponse, Position } from '@/types';
import type { PositionsRequestParams } from './types';

export * from './types';

const BASE_URL = '/api/positions';

export const fetchAllPositions = async (
  params?: PositionsRequestParams
): Promise<PagedResponse<Position>> => {
  const query = stringifyQueryParams(params);
  const response = await http.get(`${BASE_URL}${query}`);

  return handleJSON(response);
};

export const fetchActivePositions = (): Promise<Position[]> =>
  http.get(`${BASE_URL}/active`).then(handleJSON);

export const fetchPositionById = (id: number): Promise<Position> =>
  http.get(`${BASE_URL}/${id}`).then(handleJSON);

export const createPosition = (position: CreatePosition): Promise<Position> =>
  http.post(`${BASE_URL}`, position).then(handleJSON);

export const updatePosition = (
  id: number,
  position: CreatePosition
): Promise<Position> =>
  http.patch(`${BASE_URL}/${id}`, position).then(handleJSON);

export const archivePosition = (id: number): Promise<void> =>
  http.post(`${BASE_URL}/${id}/archive`).then(handleJSON);
