import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useProjectsStore } from '@/store';

import type { TableProps } from 'ant-design-vue';
import type { Project } from '@/types';

export const useProjectListConfig = () => {
  const { pagination } = storeToRefs(useProjectsStore());

  const query = ref<string>('');

  const archive = ref<boolean>(false);

  const columns = computed<TableProps<Project[]>['columns']>(() => [
    {
      key: 'name',
      title: 'Название',
      dataIndex: 'name',
      sorter: true,
    },
    {
      key: 'actions',
      align: 'right',
      width: 64,
    },
  ]);

  const paginationConfig = computed<TableProps<Project[]>['pagination']>(
    () => ({
      current: pagination.value.number + 1,
      pageSize: pagination.value.size,
      total: pagination.value.totalElements,
    })
  );
  return {
    columns,
    pagination: paginationConfig,
    query,
    archive,
  };
};
