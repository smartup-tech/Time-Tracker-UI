<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { PageHeader } from 'ant-design-vue';

import { CreatePosition } from '@/features/position';
import { PageName } from '@/pages';
import { PageBreadcrumbs } from '@/shared/ui';

import { positionsBreadcrumbs } from '../config';

const router = useRouter();

const goToPositionList = () =>
  router.push({
    name: PageName.POSITION_LIST,
  });
</script>

<template>
  <PageHeader title="Новая должность">
    <template #breadcrumb>
      <PageBreadcrumbs :breadcrumbs="positionsBreadcrumbs" />
    </template>
  </PageHeader>
  <CreatePosition @cancel="goToPositionList" @success="goToPositionList" />
</template>
