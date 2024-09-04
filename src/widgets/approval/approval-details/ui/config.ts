import { computed, ref } from 'vue';
import { useDateFormat } from '@vueuse/core';
import { storeToRefs } from 'pinia';

import { DateFormat, TimesheetUnitStatus } from '@/constants';
import { formatHours, getFullName, useLocaleState } from '@/shared/lib';
import { useApprovalDetailsStore } from '@/store';

import type { TableProps } from 'ant-design-vue';
import type { SubmittedHours } from '@/types';
import type { ColumnFilterItem } from 'ant-design-vue/lib/table/interface';

export const useApprovalDetailsConfig = () => {
  const locale = useLocaleState();
  const { records } = storeToRefs(useApprovalDetailsStore());

  const userFilterOptions = computed<ColumnFilterItem[]>(() =>
    [
      ...new Map(
        records.value.map(
          ({ userId: id, firstName, lastName }: SubmittedHours) => [
            id,
            { id, firstName, lastName },
          ]
        )
      ).values(),
    ]
      .sort(
        (a, b) =>
          a.lastName.localeCompare(b.lastName, locale.value, {
            numeric: true,
          }) ||
          a.firstName.localeCompare(b.firstName, locale.value, {
            numeric: true,
          })
      )
      .map(({ id, firstName, lastName }) => ({
        text: getFullName({ firstName, lastName }),
        value: id,
      }))
  );

  const taskFilterOptions = computed<ColumnFilterItem[]>(() =>
    [
      ...new Map(
        records.value.map(({ taskId: id, taskName }: SubmittedHours) => [
          id,
          { id, taskName },
        ])
      ).values(),
    ]
      .sort((a, b) =>
        a.taskName.localeCompare(b.taskName, locale.value, { numeric: true })
      )
      .map(({ id, taskName }) => ({
        text: taskName,
        value: id,
      }))
  );

  const columns = computed<TableProps<SubmittedHours>['columns']>(() => [
    {
      key: 'user',
      title: 'Сотрудник',
      dataIndex: 'username',
      customRender: ({ record: { firstName, lastName } }) =>
        getFullName({ firstName, lastName }),
      width: 200,
      fixed: 'left',
      sorter: {
        compare: (a: SubmittedHours, b: SubmittedHours) =>
          getFullName({
            firstName: a.firstName,
            lastName: a.lastName,
          }).localeCompare(
            getFullName({
              firstName: b.firstName,
              lastName: b.lastName,
            }),
            locale.value,
            {
              numeric: true,
            }
          ),
        multiple: 3,
      },
      filters: userFilterOptions.value,
      onFilter: (value, record: SubmittedHours) => value === record.userId,
    },
    {
      key: 'task',
      title: 'Задача',
      dataIndex: 'taskName',
      width: 180,
      sorter: {
        compare: (a: SubmittedHours, b: SubmittedHours) =>
          a.taskName.localeCompare(b.taskName, locale.value, {
            numeric: true,
          }),
        multiple: 2,
      },
      filters: taskFilterOptions.value,
      onFilter: (value, record: SubmittedHours) => value === record.taskId,
    },
    {
      key: 'hours',
      title: 'Всего',
      dataIndex: 'hours',
      align: 'right',
      customRender: ({ text }) => (text ? formatHours(text) : 0),
      width: 120,
    },
    {
      key: 'billable',
      title: 'Оплачиваемые',
      dataIndex: 'billable',
      align: 'center',
      customRender: ({ text }) => (text ? 'Да' : 'Нет'),
      width: 140,
    },
    {
      key: 'date',
      title: 'Дата',
      dataIndex: 'workDay',
      customRender: ({ text }) => useDateFormat(text, DateFormat.DOT).value,
      width: 120,
      sorter: {
        compare: (a: SubmittedHours, b: SubmittedHours) =>
          new Date(a.workDay).getTime() - new Date(b.workDay).getTime(),
        multiple: 1,
      },
    },
    {
      key: 'comment',
      title: 'Комментарий',
      dataIndex: 'comment',
      width: 140,
    },
    {
      key: 'action',
      title: '',
      width: 210,
      fixed: 'right',
    },
  ]);

  return {
    columns,
  };
};

export const useApprovalDetailsSelection = () => {
  const selectedRows = ref<SubmittedHours[]>([]);
  const selectedKeys = ref<(string | number)[]>([]);
  const bulkSelectionEnabled = ref<boolean>(false);

  const selection = computed<TableProps['rowSelection']>(() => ({
    onChange: (selectedRowKeys, selected) => {
      selectedRows.value = selected;
      selectedKeys.value = selectedRowKeys;
    },
    selectedRowKeys: selectedKeys.value,
    getCheckboxProps: (record: SubmittedHours) => ({
      disabled: TimesheetUnitStatus.SUBMITTED !== record.status,
    }),
  }));

  const resetSelection = () => {
    selectedKeys.value = [];
    selectedRows.value = [];
  };

  return {
    bulkSelectionEnabled,
    resetSelection,
    selection,
    selectedRows,
  };
};
