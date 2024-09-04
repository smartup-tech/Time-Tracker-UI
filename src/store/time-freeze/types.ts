import type { FreezeRecord } from '@/types';

export type TimeFreezeState = {
  records: FreezeRecord[];
  isLoading: boolean;
  lastFreeze: FreezeRecord | null;
  unfreezeRecord: FreezeRecord | null;
};
