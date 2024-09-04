<script lang="ts" setup>
import { computed, HTMLAttributes, onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';

import { DateFormat } from '@/constants';
import { useTimeFreezeStore } from '@/store';
import { getFullDate } from '@/shared/lib';
import { LAIcon } from '@/shared/ui';

const { fetchLastFreezeRecord } = useTimeFreezeStore();
const { lastFreeze } = storeToRefs(useTimeFreezeStore());

const lastLockDate = computed<string | undefined>(() =>
  lastFreeze.value
    ? getFullDate(lastFreeze.value.freezeDate, DateFormat.ISO_DATE)
    : ''
);

const lastLockIcon = computed<string>(() => {
  return lastFreeze.value?.status === 'COMPLETED'
    ? 'check-circle'
    : 'times-circle';
});

const classNames = computed<HTMLAttributes['class']>(() => [
  'last-lock-date',
  lastFreeze.value?.status === 'COMPLETED' && 'last-lock-date_success',
  lastFreeze.value?.status === 'INTERRUPTED' && 'last-lock-date_error',
]);

onBeforeMount(async () => {
  await fetchLastFreezeRecord();
});
</script>

<template>
  <div v-if="lastFreeze" :class="classNames">
    <LAIcon class="last-lock-date__icon" :icon="lastLockIcon" size="small" />
    Последняя блокировка
    {{ lastLockDate }}
  </div>
</template>

<style lang="scss" scoped>
.last-lock-date {
  display: inline-flex;
  align-items: center;

  &__icon {
    margin-right: 8px;

    .last-lock-date_success & {
      color: var(--color-success);
    }

    .last-lock-date_error & {
      color: var(--color-error);
    }
  }
}
</style>
