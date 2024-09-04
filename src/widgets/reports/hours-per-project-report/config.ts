import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useLocaleState } from '@/shared/lib';
import { useProjectHoursReportsStore } from '@/store';

import type { TableColumnsType } from 'ant-design-vue';
import type { ColumnFilterItem } from 'ant-design-vue/lib/table/interface';
import type { UserHoursReportRecord } from '@/types';

export const useProjectHoursReportConfig = () => {
  const locale = useLocaleState();
  const { projects, filters } = storeToRefs(useProjectHoursReportsStore());

  const projectFilters = computed<ColumnFilterItem[]>(() =>
    projects.value.map(({ id, name }) => ({
      text: name,
      value: id,
    }))
  );

  const columns = computed<TableColumnsType<UserHoursReportRecord>>(() => [
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
