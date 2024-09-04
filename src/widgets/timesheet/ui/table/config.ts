import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useTimesheetStore } from '@/store';

import type { TimesheetColumn } from '../../types';

export const useTimesheetColumns = () => {
  const { weekdays } = storeToRefs(useTimesheetStore());

  const columns = computed<TimesheetColumn[]>(() => [
    {
      key: 'project',
      title: 'Проект',
      dataIndex: 'projectId',
      class: 'timesheet-table__cell_project',
    },
    {
      key: 'task',
      title: 'Задача',
      dataIndex: 'taskId',
      class: 'timesheet-table__cell_task',
    },
    ...weekdays.value.map((day) => ({
      key: day.dt,
      title: `${day.dow}<br />${day.date}`,
      dataIndex: 'days',
      class: 'timesheet-table__cell_day',
    })),
    {
      key: 'total',
      title: 'Всего',
      dataIndex: '',
      class: 'timesheet-table__cell_total',
    },
  ]);

  return columns;
};
