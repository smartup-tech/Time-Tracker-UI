<script setup lang="ts">
import { computed } from 'vue';
import { PageHeader } from 'ant-design-vue';

import { getDashSeparatedWeekRange } from '@/shared/lib';
import { PageBreadcrumbs } from '@/shared/ui';
import { Approval } from '@/widgets';

import { approvalBreadcrumbs } from './config';

const props = defineProps<{
  weekStart: string;
}>();

const title = computed<string>(() =>
  getDashSeparatedWeekRange(props.weekStart)
);
</script>

<template>
  <PageHeader :title="title">
    <template #breadcrumb>
      <PageBreadcrumbs :breadcrumbs="approvalBreadcrumbs" />
    </template>
  </PageHeader>

  <Approval.ApprovalProjects :week-start="weekStart" />
</template>
