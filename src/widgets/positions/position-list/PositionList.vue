<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { Card, Checkbox, Input, Table } from 'ant-design-vue';
import { useDebounceFn } from '@vueuse/shared';

import { REQUEST_DEBOUNCE_TIMEOUT } from '@/constants';
import { ArchivePosition } from '@/features/position';
import { PageName } from '@/pages';
import { useAuthStore, usePositionStore, PositionOrderBy } from '@/store';

import { usePositionListConfig } from './config';

import { BodyCell, type Position } from '@/types';
import { SortDirection } from '@/types/api';

import type { TableProps } from 'ant-design-vue';
import type { SorterResult } from 'ant-design-vue/lib/table/interface';

const getSortingKey = (field?: SorterResult['columnKey']): string =>
  field
    ? PositionOrderBy[field as keyof typeof PositionOrderBy]
    : PositionOrderBy.name;

const { fetchAll } = usePositionStore();
const { positions, isLoading } = storeToRefs(usePositionStore());
const { canArchivePositions } = storeToRefs(useAuthStore());

const { columns, pagination, query, archive } = usePositionListConfig();

const isArchived = ({ archived }: Position) => archived;

const onChange: TableProps['onChange'] = (
  { current, pageSize: size },
  _filters,
  sorter
) => {
  fetchAll({
    page: current ? current - 1 : 0,
    size,
    sortBy: getSortingKey((sorter as SorterResult).column?.key),
    sortDirection: (sorter as SorterResult).order === 'descend' ? SortDirection.ASC : SortDirection.DESC,
  });
};

const debouncedFetch = useDebounceFn(
  async (query?: string, archive?: boolean) =>
    await fetchAll({
      query,
      page: 0,
      archive,
    }),
  REQUEST_DEBOUNCE_TIMEOUT
);

const onFilterChange = async () => {
  await debouncedFetch(query.value, archive.value);
};

onBeforeMount(async () => {
  await fetchAll();
});
</script>

<template>
  <Card
    :bordered="false"
    :bodyStyle="{ paddingLeft: 0, paddingRight: 0, paddingTop: 0 }"
    :head-style="{ border: 0 }"
  >
    <template #title>
      <Input
        class="searchbar"
        allow-clear
        placeholder="Найти по названию"
        @change="onFilterChange"
        v-model:value="query"
      />
      <Checkbox class="archive__filter" @change="onFilterChange" v-model:checked="archive">Архив</Checkbox>
    </template>
    <Table
      class="table"
      :data-source="positions"
      :columns="columns"
      :loading="isLoading"
      :pagination="pagination"
      :scroll="{ x: 400 }"
      @change="onChange"
    >
      <template #bodyCell="{ column, record, text }: BodyCell">
        <template v-if="column.key === 'name'">
          <template v-if="isArchived(record)">
            {{ text }}
          </template>
          <RouterLink
            v-else
            :to="{
              name: PageName.POSITION_EDIT,
              params: { positionId: record.id },
            }"
          >
            {{ text }}
          </RouterLink>
        </template>
        <template v-if="column.key === 'actions'">
          <ArchivePosition
            v-if="canArchivePositions && !isArchived(record)"
            :position-id="record.id"
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
