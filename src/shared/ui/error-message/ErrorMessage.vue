<script setup lang="ts">
import { Button, Result, Typography } from 'ant-design-vue';

import { LAIcon } from '@/shared/ui';

withDefaults(
  defineProps<{
    text?: string;
    icon?: string;
    okText?: string;
  }>(),
  {
    icon: 'times',
    okText: 'Ok',
  }
);

const emit = defineEmits(['ok']);
</script>

<template>
  <Result class="error-message" status="error">
    <template #subTitle>
      <Typography.Paragraph>
        {{ text }}
      </Typography.Paragraph>
    </template>
    <template #icon>
      <LAIcon class="error-message__icon" :icon="icon" size="large" />
    </template>
    <template #extra>
      <Button type="primary" @click="emit('ok')">{{ okText }}</Button>
    </template>
  </Result>
</template>

<style lang="scss" scoped>
.error-message {
  padding: 32px 0;

  &__icon {
    font-size: 40px;
    padding: 16px;
    color: white;
    background: var(--color-error);
    border-radius: 50%;
  }
}
</style>
