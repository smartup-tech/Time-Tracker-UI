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
    icon: 'check',
    okText: 'Ok',
  }
);

const emit = defineEmits(['ok']);
</script>

<template>
  <Result class="success-message" status="success">
    <template #subTitle>
      <Typography.Paragraph>
        {{ text }}
      </Typography.Paragraph>
    </template>
    <template #icon>
      <LAIcon class="success-message__icon" :icon="icon" />
    </template>
    <template #extra>
      <Button type="primary" @click="emit('ok')">{{ okText }}</Button>
    </template>
  </Result>
</template>

<style lang="scss" scoped>
.success-message {
  padding: 32px 0;

  &__icon {
    font-size: 40px;
    padding: 16px;
    color: white;
    background: var(--color-success);
    border-radius: 50%;
  }
}
</style>
