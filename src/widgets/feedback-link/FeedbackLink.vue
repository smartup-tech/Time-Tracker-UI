<script setup lang="ts">
import { Button } from 'ant-design-vue';

import { FEEDBACK_LINK } from '@/constants';
import { LAIcon } from '@/shared/ui';

withDefaults(
  defineProps<{
    iconOnly?: boolean;
    size?: 'small' | 'middle' | 'large';
  }>(),
  {
    iconOnly: false,
    size: 'large',
  }
);
</script>

<template>
  <Button
    :class="['feedback-link', iconOnly && 'feedback-link_icon-only']"
    :href="FEEDBACK_LINK"
    target="_blank"
    :type="iconOnly ? 'text' : 'link'"
  >
    <template #icon>
      <LAIcon icon="question-circle" :size="size" />
    </template>
    <span v-if="!iconOnly">Обратная связь</span>
  </Button>
</template>

<style lang="scss" scoped>
.feedback-link {
  display: inline-flex;
  justify-content: flex-start;
  font-size: 14px;
  align-items: center;
  height: 44px;
  padding: 0;
  color: var(--color-text-default);

  &:hover {
    color: var(--color-primary);
  }

  &_icon-only {
    width: 44px;
  }
}
</style>
