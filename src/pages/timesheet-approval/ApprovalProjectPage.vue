<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { PageHeader } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

import { PageName } from '@/pages';
import { getDashSeparatedWeekRange } from '@/shared/lib';
import { PageBreadcrumbs } from '@/shared/ui';
import { useProjectsDetailsStore } from '@/store';
import { Approval } from '@/widgets';

import type { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';
import { approvalBreadcrumbs } from './config';

const props = defineProps<{
  weekStart: string;
  projectId: number;
}>();

const router = useRouter();

const { fetchDetails: fetchProjectDetails } = useProjectsDetailsStore();
const { project } = storeToRefs(useProjectsDetailsStore());

const breadcrumbs = ref<Route[]>([
  ...approvalBreadcrumbs,
  {
    path: router.resolve({
      name: PageName.TIMESHEET_APPROVAL_PERIOD,
      params: {
        weekStart: props.weekStart,
      },
    }).fullPath,
    breadcrumbName: getDashSeparatedWeekRange(props.weekStart),
  },
]);

const title = computed<string>(() => project.value?.name || '');

onBeforeMount(async () => {
  await fetchProjectDetails(props.projectId);
});
</script>

<template>
  <PageHeader :title="title">
    <template #breadcrumb>
      <PageBreadcrumbs :breadcrumbs="breadcrumbs" />
    </template>
  </PageHeader>

  <Approval.ApprovalDetails :week-start="weekStart" :project-id="projectId" />
</template>
