import type { User } from '@/types';

export type FreezeStatus =
  | 'COMPLETED'
  | 'WAITING'
  | 'INTERRUPTED'
  | 'UN_FREEZE'
  | 'IN_PROGRESS';

export type FreezeRecord = {
  freezeDate: string;
  status: FreezeStatus;
  user: User;
};
