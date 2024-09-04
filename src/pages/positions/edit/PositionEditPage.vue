<script lang="ts" setup>
import { PageHeader } from 'ant-design-vue';
import { useRouter } from 'vue-router';

import { EditPosition } from '@/features/position';
import { PageName } from '@/pages';
import { PageBreadcrumbs } from '@/shared/ui';

import { positionsBreadcrumbs } from '../config';

defineProps<{
  positionId: number;
}>();

const router = useRouter();

const goToPositionList = () =>
  router.push({
    name: PageName.POSITION_LIST,
  });
</script>

<template>
  <PageHeader title="Редактировать должность">
    <template #breadcrumb>
      <PageBreadcrumbs :breadcrumbs="positionsBreadcrumbs" />
    </template>
  </PageHeader>

  <EditPosition
    :position-id="positionId"
    @cancel="goToPositionList"
    @success="goToPositionList"
  />
</template>
