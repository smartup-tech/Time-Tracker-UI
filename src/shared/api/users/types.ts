import { PageableRequestParams, SearchableRequestParams } from '@/types';

export interface UsersRequestParams
  extends PageableRequestParams,
    SearchableRequestParams {}

export interface UserArchiveRequestParams {
  force?: boolean;
}
