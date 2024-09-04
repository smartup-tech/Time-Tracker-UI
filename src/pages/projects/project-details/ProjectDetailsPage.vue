<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Card, PageHeader } from 'ant-design-vue';

import { AddToTeam, CreateTask } from '@/features/projects';
import { TaskList } from '@/entities/task';
import { PageBreadcrumbs } from '@/shared/ui';
import { useProjectsDetailsStore } from '@/store';

import { projectsBreadcrumbs } from '../config';
import {
  ProjectDetailsActions as Actions,
  ProjectDetailsDescription as Description,
  ProjectDetailsSkeleton as Skeleton,
  ProjectTeam as Team,
} from './ui';

type Props = {
  projectId: number;
};

const props = defineProps<Props>();

const { isLoading, isFetching, project, team, tasks } = storeToRefs(
  useProjectsDetailsStore()
);
const store = useProjectsDetailsStore();
const { fetchDetails } = store;

const activeTab = ref<string>('tasks');

const tabList = [
  {
    key: 'tasks',
    tab: 'Задачи',
  },
  {
    key: 'team',
    tab: 'Команда',
  },
];

onBeforeMount(async () => {
  await fetchDetails(props.projectId);
});

onBeforeUnmount(() => {
  store.$reset();
});

const onTabChange = (key: string) => {
  activeTab.value = key;
}
</script>

<template>
  <Skeleton active v-if="isLoading" />
  <template v-else>
    <PageHeader class="page-header" :title="project?.name">
      <Description v-if="project" :project="project" />
      <template #breadcrumb>
        <PageBreadcrumbs :breadcrumbs="projectsBreadcrumbs" />
      </template>
      <template #extra>
        <Actions :project-id="projectId" />
      </template>
    </PageHeader>

    <Card
      :bordered="false"
      :active-tab-key="activeTab"
      :tab-list="tabList"
      @tab-change="onTabChange"
    >
      <template v-if="activeTab === 'team'">
        <Team
          class="project-details__team"
          :loading="isFetching"
          :project-id="projectId"
          :team="team"
        />
      </template>
      <template v-if="activeTab === 'tasks'">
        <TaskList
          :loading="isFetching"
          :project-id="projectId"
          :tasks="tasks"
        />
      </template>

      <template #tabBarExtraContent>
        <template v-if="activeTab === 'team'">
          <AddToTeam :project-id="projectId" />
        </template>
        <template v-if="activeTab === 'tasks'">
          <CreateTask :project-id="projectId" />
        </template>
      </template>
    </Card>
  </template>
</template>

<style lang="scss" scoped>
.project-details__team {
  margin-right: -24px;
  margin-left: -24px;
}
</style>
