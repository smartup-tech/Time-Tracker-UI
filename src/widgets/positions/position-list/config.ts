import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { TableProps } from 'ant-design-vue';

import { useNumberFormat } from '@/shared/lib';
import { usePositionStore } from '@/store';

import type { Position } from '@/types';

export const usePositionListConfig = () => {
  const { setQuery } = usePositionStore();
  const { setArchive } = usePositionStore();
  const { pagination, query, archive } = storeToRefs(usePositionStore());

  const columns = computed<TableProps<Position[]>['columns']>(() => [
    {
      key: 'name',
      title: 'Название',
      dataIndex: 'name',
      sorter: true,
      ellipsis: true,
      minWidth: 200,
    },
    {
      key: 'rate',
      title: 'Ставка',
      width: 100,
      dataIndex: 'externalRate',
      align: 'right',
      customRender: ({ text }) => useNumberFormat(text),
    },
    {
      key: 'actions',
      align: 'right',
      width: 64,
      fixed: 'right',
    },
  ]);

  const paginationConfig = computed<TableProps<Position[]>['pagination']>(
    () => ({
      current: pagination.value.number + 1,
      pageSize: pagination.value.size,
      total: pagination.value.totalElements,
    })
  );

  const searchQuery = computed<string>({
    get: () => query.value,
    set: (value) => setQuery(value),
  });

  const archiveFlag = computed<boolean>({
    get: () => archive.value,
    set: (value) => setArchive(value),
  });

  return {
    columns,
    pagination: paginationConfig,
    query: searchQuery,
    archive: archiveFlag,
  };
};
