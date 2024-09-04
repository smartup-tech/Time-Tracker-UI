<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { PageHeader } from 'ant-design-vue';

import { TimeFreeze } from '@/widgets';
import { useTimeFreezeStore } from '@/store';

const { fetchFreezeRecords } = useTimeFreezeStore();

onBeforeMount(async () => {
  await fetchFreezeRecords();
});
</script>

<template>
  <PageHeader title="Блокировка часов">
    <template #extra>
      <TimeFreeze.LastLockDate class="last-lock-date" />
    </template>
  </PageHeader>

  <TimeFreeze.Card />
</template>

<style lang="scss" scoped>
:deep(.ant-page-header-heading-extra) {
  align-self: center;
}
</style>
