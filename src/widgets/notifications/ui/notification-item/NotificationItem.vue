<script setup lang="ts">
import { useNotificationComponent } from './lib';

import type { Notification } from '@/types';

const props = defineProps<{
  notification: Notification;
}>();

const emit = defineEmits(['delete', 'markRead']);

const notificationComponent = useNotificationComponent(props.notification.type);

const onMarkReadClick = () => emit('markRead', props.notification.id);
const onDeleteClick = () => emit('delete', props.notification.id);
</script>

<template>
  <component
    :is="notificationComponent"
    :notification="notification"
    @delete="onDeleteClick"
    @mark-read="onMarkReadClick"
  />
</template>
