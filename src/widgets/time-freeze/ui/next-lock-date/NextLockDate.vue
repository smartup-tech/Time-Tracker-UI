<script lang="ts" setup>
import { Button, Result } from 'ant-design-vue';

import { LAIcon } from '@/shared/ui';

defineProps<{
  date: string;
}>();

const emit = defineEmits(['change']);

const onChangeClick = () => emit('change');
</script>

<template>
  <Result class="next-lock-date">
    <template #icon>
      <LAIcon class="next-lock-date__icon" icon="calendar-check" size="large" />
    </template>
    <template #title>
      Блокировка запланирована на
      {{ date }}
    </template>
    <template #subTitle>
      Все часы по
      {{ date }} включительно будут заблокированы.
    </template>
    <template #extra>
      <Button type="primary" @click="onChangeClick"> Изменить </Button>
    </template>
  </Result>
</template>

<style lang="scss" scoped>
.next-lock-date {
  &__icon {
    font-size: 40px;
    padding: 16px;
    background: var(--color-success);
    color: white;
    border-radius: 50%;
  }
}
</style>
