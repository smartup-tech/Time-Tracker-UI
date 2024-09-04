<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { Card, Checkbox, Input, Table, TableProps } from 'ant-design-vue';
import { useDebounceFn } from '@vueuse/shared';

import { REQUEST_DEBOUNCE_TIMEOUT } from '@/constants';
import { ArchiveProject } from '@/features/projects';
import { PageName } from '@/pages';
import { useAuthStore, useProjectsStore } from '@/store';
import { ProjectOrderBy } from '@/store/projects/config';

import { useProjectListConfig } from './config';

import { BodyCell, type Project } from '@/types';
import { SortDirection } from '@/types/api';
import type { SorterResult } from 'ant-design-vue/lib/table/interface';

const getSortingKey = (field?: SorterResult['columnKey']): string =>
  field
    ? ProjectOrderBy[field as keyof typeof ProjectOrderBy]
    : ProjectOrderBy.name;

const { fetchProjects } = useProjectsStore();
const { projects, isLoading } = storeToRefs(useProjectsStore());
const { canArchiveProjects } = storeToRefs(useAuthStore());

const { columns, pagination, query, archive } = useProjectListConfig();

const isArchived = (project: Project) => project.archived;

const onChange: TableProps['onChange'] = (
  { current, pageSize: size },
  _filters,
  sorter
) => {
  fetchProjects({
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
    await fetchProjects({
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
  await fetchProjects();
});

const onSucces = async () => {
  await fetchProjects({ archive: archive.value });
};
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
      <Checkbox
        class="archive__filter"
        @change="onFilterChange"
        v-model:checked="archive"
        >Архив</Checkbox
      >
    </template>
    <Table
      :data-source="projects"
      :loading="isLoading"
      :columns="columns"
      :pagination="pagination"
      @change="onChange"
    >
      <template #bodyCell="{ column, record }: BodyCell">
        <template v-if="column.key === 'name'">
          <template v-if="isArchived(record)">
            {{ record.name }}
          </template>
          <RouterLink
            v-else
            :to="{
              name: PageName.PROJECT_DETAILS,
              params: { projectId: record.id },
            }"
          >
            {{ record.name }}
          </RouterLink>
        </template>
        <template v-if="column.key === 'actions'">
          <ArchiveProject
            v-if="canArchiveProjects && !isArchived(record)"
            :project="record"
            @succes="onSucces"
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
