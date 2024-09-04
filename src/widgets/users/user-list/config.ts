import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useUsersStore } from '@/store';

import type { User } from '@/types';
import type { TableProps } from 'ant-design-vue';

export const useUserListConfig = () => {
  const { pagination } = storeToRefs(useUsersStore());
  const paginationConfig = computed(() => ({
    current: pagination.value.number + 1,
    pageSize: pagination.value.size,
    total: pagination.value.totalElements,
  }));

  const query = ref<string>('');

  const archive = ref<boolean>(false);

  const columns = computed<TableProps<User[]>['columns']>(() => [
    {
      key: 'name',
      title: 'Имя',
      sorter: true,
      defaultSortOrder: 'ascend',
      minWidth: 180,
    },
    {
      key: 'email',
      title: 'Эл. почта',
      dataIndex: 'email',
      sorter: true,
      minWidth: 180,
    },
    {
      key: 'role',
      title: 'Роль',
      dataIndex: 'roles',
      width: 160,
    },
    {
      key: 'actions',
      align: 'right',
      width: 64,
      fixed: 'right',
    },
  ]);

  return { columns, pagination: paginationConfig, query, archive };
};
