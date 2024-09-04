<script setup lang="ts">
import { computed } from 'vue';
import { Button } from 'ant-design-vue';
import { useRouter } from 'vue-router';

import { DateFormat } from '@/constants';
import { PageName } from '@/pages';
import { LAIcon } from '@/shared/ui';
import { formatDate } from '@/shared/lib';

import { NotificationBase } from '../notification-base';

import type { NotificationHoursRejected } from '@/types';

const props = defineProps<{
  notification: NotificationHoursRejected;
}>();

const emit = defineEmits(['markRead']);

const router = useRouter();

const unit = computed<NotificationHoursRejected['data']['unit']>(
  () => props.notification.data.unit
);
const project = computed<NotificationHoursRejected['data']['project']>(
  () => props.notification.data.project
);
const task = computed<NotificationHoursRejected['data']['task']>(
  () => props.notification.data.task
);

const goToUnit = (unit: NotificationHoursRejected['data']['unit']) => {
  router.push({
    name: PageName.TRACKER,
    query: {
      ts: unit.workDay,
      uid: unit.id,
    },
    force: true,
  });

  emit('markRead');
};
</script>

<template>
  <NotificationBase
    :notification="{ ...notification, text: 'Время не согласовано' }"
  >
    <template #icon>
      <LAIcon icon="times-circle" size="large" />
    </template>
    <template #description>
      <span class="unit-date">
        {{ formatDate(unit.workDay, DateFormat.DAY_MONTH_SHORT) }}
      </span>
      {{ project.name }}, {{ task.name }}
    </template>
    <template #extra>
      <Button type="primary" size="small" @click="goToUnit(unit)">
        Перейти
      </Button>
    </template>
  </NotificationBase>
</template>

<style lang="scss" scoped>
:deep(.unit-date) {
  font-size: 12px;
  margin-right: 4px;
  color: var(--color-text-muted);
}
</style>
