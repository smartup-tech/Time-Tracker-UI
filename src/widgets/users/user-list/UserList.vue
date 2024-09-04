<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { Card, Checkbox, Input, Table } from 'ant-design-vue';
import { useDebounceFn } from '@vueuse/shared';

import { REQUEST_DEBOUNCE_TIMEOUT } from '@/constants';
import { ArchiveUser } from '@/features/user';
import { PageName } from '@/pages';
import { useAuthStore, useUsersStore, UserOrderBy } from '@/store';
import { getFullName, getUserRoles } from '@/shared/lib';

import { useUserListConfig } from './config';

import { BodyCell, type User } from '@/types';
import { SortDirection } from '@/types/api';

import type { TableProps } from 'ant-design-vue';
import type { SorterResult } from 'ant-design-vue/lib/table/interface';
import UnArchiveUser from '@/features/user/un-archive-user/ui/UnArchiveUser.vue';

const getSortingKey = (field?: SorterResult['columnKey']): string =>
  field ? UserOrderBy[field as keyof typeof UserOrderBy] : UserOrderBy.name;

const { fetchUsers } = useUsersStore();
const { users, isLoading } = storeToRefs(useUsersStore());
const { canArchiveUsers } = storeToRefs(useAuthStore());

const { columns, pagination, query, archive } = useUserListConfig();

const isArchived = (user: User) => user.archived;

const onChange: TableProps['onChange'] = (
  { current, pageSize: size },
  _filters,
  sorter
) => {
  fetchUsers({
    page: current ? current - 1 : 0,
    size,
    sortBy: getSortingKey((sorter as SorterResult).column?.key),
    sortDirection:
      (sorter as SorterResult).order === 'descend'
        ? SortDirection.DESC
        : SortDirection.ASC,
    query: query.value,
    archive: archive.value,
  });
};

const debouncedFetch = useDebounceFn(
  async (query?: string, archive?: boolean) =>
    await fetchUsers({
      page: 0,
      query,
      archive,
    }),
  REQUEST_DEBOUNCE_TIMEOUT
);

const onFilterChange = async () => {
  await debouncedFetch(query.value, archive.value);
};

onBeforeMount(async () => {
  await fetchUsers();
});

const onSucces = async () => {
  await fetchUsers({ archive: archive.value });
};
</script>

<template>
  <Card
    :bordered="false"
    :bodyStyle="{ paddingLeft: 0, paddingRight: 0, paddingTop: 0 }"
    :headStyle="{ border: 'none' }"
  >
    <template #title>
      <Input
        class="searchbar"
        allow-clear
        placeholder="Найти по имени"
        @change="onFilterChange"
        v-model:value="query"
      />
      <Checkbox
        class="archive__filter"
        @change="onFilterChange"
        v-model:checked="archive"
        >Архив
      </Checkbox>
    </template>
    <Table
      class="table"
      :data-source="users"
      :columns="columns"
      :loading="isLoading"
      :pagination="pagination"
      :scroll="{ x: 720 }"
      @change="onChange"
    >
      <template #bodyCell="{ column, record }: BodyCell">
        <template v-if="column.key === 'name'">
          <template v-if="isArchived(record)">
            {{ getFullName(record) }}
          </template>
          <RouterLink
            v-else
            :to="{ name: PageName.USER_EDIT, params: { userId: record.id } }"
          >
            {{ getFullName(record) }}
          </RouterLink>
        </template>
        <template v-if="column.key === 'role'">
          {{ getUserRoles(record) }}
        </template>
        <template v-if="column.key === 'actions'">
          <ArchiveUser
            v-if="canArchiveUsers && !isArchived(record)"
            @succes="onSucces"
            :user="record"
          />
          <UnArchiveUser
            v-else-if="canArchiveUsers && isArchived(record)"
            :user="record"
          />
        </template>
      </template>
    </Table>
  </Card>
</template>

<style lang="scss" scoped>
.searchbar {
  max-width: 320px;
}
.archive__filter {
  margin-left: 15px;
  font-weight: 400;
}
</style>
