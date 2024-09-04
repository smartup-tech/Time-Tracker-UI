import { handleJSON, http } from '@/shared/lib';

import type { PasswordRecoveryRequest, PasswordReset } from '@/types';

const BASE_URL = '/api/passwordRecovery';

export const requestPasswordRecoveryLink = async (
  payload: PasswordRecoveryRequest
) => http.post(`${BASE_URL}/sendLink`, payload).then(handleJSON);

export const resetPassword = async (payload: PasswordReset) =>
  http.post(`${BASE_URL}/resetPassword`, payload).then(handleJSON);
