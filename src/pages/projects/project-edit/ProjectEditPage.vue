<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { PageHeader } from 'ant-design-vue';
import { useRouter } from 'vue-router';

import { EditProject } from '@/features/projects';
import { PageName } from '@/pages';
import { PageBreadcrumbs } from '@/shared/ui';
import { useProjectsStore } from '@/store';

import { projectsBreadcrumbs } from '../config';

import type { Project } from '@/types';
import type { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';

type Props = {
  projectId: number;
};

const props = defineProps<Props>();
const router = useRouter();

const { fetchProjectById } = useProjectsStore();

const project = ref<Project>({
  id: 0,
  name: '',
  archived: false,
});

const breadcrumbs = computed<Route[]>(() => [
  ...projectsBreadcrumbs,
  {
    path: router.resolve({
      name: PageName.PROJECT_DETAILS,
      params: {
        projectId: props.projectId,
      },
    }).fullPath,
    breadcrumbName: project.value?.name || '-',
  },
]);

const goToProjectDetails = () =>
  router.push({
    name: PageName.PROJECT_DETAILS,
    params: { projectId: props.projectId },
  });

onBeforeMount(async () => {
  if (props.projectId) {
    project.value = await fetchProjectById(props.projectId);
  }
});
</script>

<template>
  <PageHeader class="page-header" title="Редактировать проект">
    <template #breadcrumb>
      <PageBreadcrumbs :breadcrumbs="breadcrumbs" />
    </template>
  </PageHeader>

  <EditProject
    :project="project"
    @cancel="goToProjectDetails"
    @success="goToProjectDetails"
  />
</template>
