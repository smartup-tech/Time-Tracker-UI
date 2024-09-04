<script lang="ts" setup>
import { PageHeader } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';

import { useAuthStore } from '@/store';
import { TimeSheet } from '@/widgets';
import { TimesheetUserPicker } from '@/widgets/timesheet';

defineProps<{
  startDate?: string;
  uid?: number;
}>();

const route = useRoute();
const router = useRouter();

const { canManageTimesheets } = storeToRefs(useAuthStore());
</script>

<template>
  <PageHeader title="Трекер">
    <template #extra>
      <TimesheetUserPicker v-if="canManageTimesheets" />
    </template>
  </PageHeader>
  <TimeSheet
    :start-date="startDate"
    :uid="uid"
    @reset="router.push({ ...route, query: {} })"
  />
</template>
