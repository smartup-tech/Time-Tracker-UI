<script lang="ts" setup>
import { PageHeader } from 'ant-design-vue';

import { PageBreadcrumbs } from '@/shared/ui';
import { Reports } from '@/widgets';

import { reportsBreadcrumbs } from '../config';
</script>

<template>
  <PageHeader class="header" title="Отчет о затраченном времени">
    <template #breadcrumb>
      <PageBreadcrumbs :breadcrumbs="reportsBreadcrumbs" />
    </template>
  </PageHeader>

  <Reports.PersonalHoursReport />
</template>
