import { handleJSON, http } from '@/shared/lib';

import type { FreezeRecord } from '@/types';

const BASE_URL = '/api/freeze';

export const fetchLocks = (): Promise<FreezeRecord[]> =>
  http.get(BASE_URL).then(handleJSON);

export const fetchLastLock = (): Promise<FreezeRecord> => 
  http.get(`${BASE_URL}/last`).then(handleJSON);

export const fetchUnfreezeLock = (): Promise<FreezeRecord> =>
  http.get(`${BASE_URL}/unfreeze`).then(handleJSON);

export const createLock = async (dates: string[]): Promise<FreezeRecord[]> => {
  const response = await http.put(BASE_URL, { dates });

  return handleJSON(response);
};

export const unLock = async (): Promise<FreezeRecord> => {
  const response = await http.put(`${BASE_URL}/unfreeze`);

  return handleJSON(response);
};