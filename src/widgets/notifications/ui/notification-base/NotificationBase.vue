<script setup lang="ts">
import { Badge, Button, List, Tooltip } from 'ant-design-vue';

import { LAIcon } from '@/shared/ui';

import type { Notification } from '@/types';
import { formatAdaptiveDate } from '@/shared/lib';

defineProps<{
  notification: Notification;
}>();

const emit = defineEmits(['delete', 'markRead']);

const onMarkReadClick = () => emit('markRead');
const onDeleteClick = () => emit('delete');
</script>

<template>
  <List.Item class="notifications-item">
    <Badge
      v-if="!notification.read"
      class="notifications-item__unread-badge"
      dot
      color="var(--color-primary)"
    />
    <List.Item.Meta>
      <template #avatar>
        <slot name="icon"><LAIcon icon="info-circle" /></slot>
      </template>
      <template #title>{{ notification.text }}</template>
      <template #description>
        <slot name="description" />
        <div v-if="$slots['extra']" class="notifications-item__extra">
          <slot name="extra" />
        </div>
        <div class="notifications-item__date">
          {{ formatAdaptiveDate(notification.createdDate) }}
        </div>
      </template>
    </List.Item.Meta>
    <div class="notifications-item__actions">
      <Button
        :disabled="notification.read"
        shape="circle"
        type="text"
        size="small"
        @click="onMarkReadClick"
      >
        <template #icon>
          <Tooltip title="Отметить прочитанным">
            <LAIcon icon="check" size="small" />
          </Tooltip>
        </template>
      </Button>

      <Button shape="circle" type="text" size="small" @click="onDeleteClick">
        <template #icon>
          <Tooltip title="Удалить">
            <LAIcon icon="times" size="small" />
          </Tooltip>
        </template>
      </Button>
    </div>
  </List.Item>
</template>

<style lang="scss" scoped>
.notifications-item {
  position: relative;
  padding: 12px 0 12px 8px;

  :deep(.ant-list-item-meta-title) {
    padding-right: 16px;
    line-height: 1.5;
  }

  :deep(.ant-list-item-meta-description) {
    color: var(--color-text-default);
  }

  :deep(.ant-badge-status-text:empty) {
    display: none;
  }

  &__actions {
    position: absolute;
    bottom: 10px;
    right: -1px;
    opacity: 0;
    transition: opacity 0.3s;

    .notifications-item:hover & {
      opacity: 1;
    }

    @media (hover: none) {
      opacity: 1;
    }
  }

  &__date {
    font-size: 12px;
    margin-top: 4px;
    color: var(--color-text-muted);
  }

  &__unread-badge {
    position: absolute;
    top: 4px;
    right: 8px;
  }

  &__extra {
    margin: 8px 0;
  }
}
</style>
