import type { ApiErrorResponse } from '@/types';

export class HTTPException {
  readonly status: number;
  readonly response?: ApiErrorResponse;

  constructor(status: number, response?: ApiErrorResponse) {
    this.status = status;
    this.response = response;
  }
}

export class UnauthorizedException extends Error {}
