import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useApprovalDaysStore } from '@/store';

import { TimesheetColumn } from '@/widgets/timesheet';
import { getDateCell } from '@/shared/lib';

export const useApprovalDaysConfig = () => {
  const { days } = storeToRefs(useApprovalDaysStore());

  const columns = computed<TimesheetColumn[]>(() =>
    days.value
      ? [
          {
            key: 'user',
            title: 'Сотрудник',
            dataIndex: 'username',
          },
          days.value.map((metaDay) => getDateCell(metaDay.date)),
          {
            key: 'totalHours',
            title: 'Всего',
            dataIndex: 'totalHours',
          },
          {
            key: 'action',
            title: '',
            dataIndex: '',
          },
        ].flat()
      : []
  );

  const innerColumns = computed<TimesheetColumn[]>(() =>
    days.value
      ? [
          {
            key: 'projectTaskName',
            title: 'Задачи проекта',
            dataIndex: 'projectTaskName',
          },
          days.value.map((metaDay) => getDateCell(metaDay.date)),
          {
            key: 'totalHours',
            title: 'Всего',
            dataIndex: 'totalHours',
          },
          {
            key: 'action',
            title: '',
            dataIndex: '',
          },
        ].flat()
      : []
  );

  return {
    columns,
    innerColumns,
  };
};
