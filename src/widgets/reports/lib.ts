import { computed, Ref } from 'vue';
import flatMapDepth from 'lodash/flatMapDepth';
import { getFullName } from '@/shared/lib';

import type {
  TableColumnsType,
  TableColumnGroupType,
  TableColumnType,
} from 'ant-design-vue';
import type { HoursReportRecord, UserHoursReportRecord } from '@/types';

export const useExportedReportData = (
  columns: Ref<TableColumnsType<HoursReportRecord>>,
  records: Ref<HoursReportRecord[]>
) => {
  const flatColumns = flatMapDepth(
    columns.value,
    (v: TableColumnGroupType<HoursReportRecord>) => v?.children ?? v
  ) as unknown as TableColumnType[];

  const titles: string[] = flatColumns.map((column) => String(column.title));

  const series = computed<(string | number)[][]>(() =>
    records.value.map((record) =>
      flatColumns.map((column) => {
        if (column.dataIndex === 'user') {
          const userRecord = record as UserHoursReportRecord;
          return getFullName({
            firstName: userRecord.userFirstName,
            lastName: userRecord.userLastName,
          });
        }

        return record[column.dataIndex as keyof HoursReportRecord] ?? 0;
      })
    )
  );

  return {
    titles,
    series,
  };
};

export const totalKeys = [
  'billableHours',
  'billableHoursFrozen',
  'billableHoursNotFrozen',
  'unbillableHours',
  'unbillableHoursFrozen',
  'unbillableHoursNotFrozen',
  'totalHours',
  'totalHoursFrozen',
  'totalHoursNotFrozen',
] as const;
