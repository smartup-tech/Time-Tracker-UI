<script lang="ts" setup>
import { Result } from 'ant-design-vue';

import { LAIcon } from '@/shared/ui';
</script>

<template>
  <Result class="lock-success">
    <template #icon>
      <LAIcon class="lock-success__icon" icon="check-circle" size="large" />
    </template>
    <template #title> Блокировка успешно запущена </template>
    <template #subTitle>
      Процесс блокировки может занять некоторое время.
    </template>
  </Result>
</template>

<style lang="scss" scoped>
.lock-success {
  &__icon {
    font-size: 72px;
    color: var(--color-success);
    border-radius: 50%;
  }
}
</style>
