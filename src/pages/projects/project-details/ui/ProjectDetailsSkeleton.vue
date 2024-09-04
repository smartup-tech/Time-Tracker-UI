<script lang="ts" setup>
import { Skeleton } from 'ant-design-vue';
</script>

<template>
  <div class="skeleton">
    <Skeleton active :title="false" :paragraph="{ rows: 1, width: 200 }" />
    <Skeleton :paragraph="{ rows: 1 }" />
  </div>
</template>

<style lang="scss" scoped>
.skeleton {
  padding: 24px 0;
}
</style>
