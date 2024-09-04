<script setup lang="ts">
import { LAIcon } from '@/shared/ui';

import { NotificationBase } from '../notification-base';

import type { NotificationFreeze } from '@/types';

defineProps<{
  notification: NotificationFreeze;
}>();
</script>

<template>
  <NotificationBase
    :notification="{
      ...notification,
      text: 'Блокировка завершилась с ошибкой',
    }"
  >
    <template #icon>
      <LAIcon icon="times-circle" size="large" />
    </template>
  </NotificationBase>
</template>
