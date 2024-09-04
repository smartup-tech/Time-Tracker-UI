import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { getDateCell, getFullName, useLocaleState } from '@/shared/lib';
import { useUserHoursReportsStore } from '@/store';

import type { TableColumnsType } from 'ant-design-vue';
import type { ColumnFilterItem } from 'ant-design-vue/lib/table/interface';
import type { UserHoursReportRecord } from '@/types';

export const useUserHoursReportConfig = () => {
  const locale = useLocaleState();
  const { projects, tasks, users, filters } = storeToRefs(
    useUserHoursReportsStore()
  );

  const userFilters = computed<ColumnFilterItem[]>(() =>
    users.value.map(({ id, firstName, lastName }) => ({
      text: getFullName({ firstName, lastName }),
      value: id,
    }))
  );

  const projectFilters = computed<ColumnFilterItem[]>(() =>
    projects.value.map(({ id, name }) => ({
      text: name,
      value: id,
    }))
  );

  const taskFilters = computed<ColumnFilterItem[]>(() =>
    tasks.value.map(({ id, name }) => ({
      text: name,
      value: id,
    }))
  );

  const columns = computed<TableColumnsType<UserHoursReportRecord>>(() => [
    {
      key: 'user',
      title: 'Сотрудник',
      dataIndex: 'user',
      fixed: 'left',
      width: 200,
      sorter: {
        compare: (a: UserHoursReportRecord, b: UserHoursReportRecord) =>
          getFullName({
            firstName: a.userFirstName,
            lastName: a.userLastName,
          }).localeCompare(
            getFullName({
              firstName: b.userFirstName,
              lastName: b.userLastName,
            }),
            locale.value,
            {
              numeric: true,
            }
          ),
        multiple: 3,
      },
      customRender: ({
        record: { userFirstName: firstName, userLastName: lastName },
      }) => getFullName({ firstName, lastName }),
      filters: userFilters.value,
      filteredValue: filters.value.user,
      onFilter: (value, record: UserHoursReportRecord) =>
        value === record.userId,
    },
    {
      key: 'project',
      title: 'Проект',
      dataIndex: 'projectName',
      fixed: 'left',
      width: 200,
      sorter: {
        compare: (a: UserHoursReportRecord, b: UserHoursReportRecord) =>
          a.projectName.localeCompare(b.projectName, locale.value, {
            numeric: true,
          }),
        multiple: 2,
      },
      filters: projectFilters.value,
      filteredValue: filters.value.project,
      onFilter: (value, record: UserHoursReportRecord) =>
        value === record.projectId,
    },
    {
      key: 'task',
      title: 'Задача',
      dataIndex: 'taskName',
      width: 200,
      sorter: {
        compare: (a: UserHoursReportRecord, b: UserHoursReportRecord) =>
          a.taskName.localeCompare(b.taskName, locale.value, { numeric: true }),
        multiple: 1,
      },
      filters: taskFilters.value,
      filteredValue: filters.value.task,
      onFilter: (value, record: UserHoursReportRecord) =>
        value === record.taskId,
    },

    {
      title: 'Оплачиваемых часов',
      children: [
        {
          key: 'billableHoursFrozen',
          title: 'Оплачиваемые часы (Блокированные)',
          dataIndex: 'billableHoursFrozen',
          align: 'right',
          width: 110,
          isHours: true,
          frozenHours: true,
        },
        {
          key: 'billableHoursNotFrozen',
          title: 'Оплачиваемые часы (Не блокированные)',
          dataIndex: 'billableHoursNotFrozen',
          align: 'right',
          width: 110,
          isHours: true,
          frozenHours: false,
        },
      ],
    },
    {
      title: 'Неоплачиваемых часов',
      children: [
        {
          key: 'unbillableHoursFrozen',
          title: 'Неоплачиваемые часы (Блокированные)',
          dataIndex: 'unbillableHoursFrozen',
          align: 'right',
          width: 110,
          isHours: true,
          frozenHours: true,
        },
        {
          key: 'unbillableHoursNotFrozen',
          title: 'Неоплачиваемые часы (Не блокированные)',
          dataIndex: 'unbillableHoursNotFrozen',
          align: 'right',
          width: 110,
          isHours: true,
          frozenHours: false,
        },
      ],
    },
    {
      title: 'Всего часов',
      children: [
        {
          key: 'totalHoursFrozen',
          title: 'Всего часов (Блокированных)',
          dataIndex: 'totalHoursFrozen',
          align: 'right',
          width: 110,
          isHours: true,
          frozenHours: true,
        },
        {
          key: 'totalHoursNotFrozen',
          title: 'Всего часов (Не блокированных)',
          dataIndex: 'totalHoursNotFrozen',
          align: 'right',
          width: 110,
          isHours: true,
          frozenHours: false,
        },
      ],
    },
  ]);

  return {
    columns,
  };
};

export const getUserHoursPerDayColumns = (hours: {
  [date: string]: number;
}) => {
  return Object.keys(hours)
    .sort((a: string, b: string) => Number(new Date(a)) - Number(new Date(b)))
    .map((date: string) => {
      const className = new Date(date).getDay() % 6 === 0 ? 'weekend-cell' : '';

      return {
        ...getDateCell(date),
        customHeaderCell: () => ({
          class: className,
        }),
        customCell: () => ({
          class: className,
        }),
        width: 50,
      };
    });
};
