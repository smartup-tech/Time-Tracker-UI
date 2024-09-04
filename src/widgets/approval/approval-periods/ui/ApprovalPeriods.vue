<script setup lang="ts">
import { createVNode, onBeforeMount } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { Card, Table, Empty } from 'ant-design-vue';

import { PageName } from '@/pages';
import { useApprovalPeriodsStore } from '@/store';
import { formatHours, getDashSeparatedWeekRange } from '@/shared/lib';

import type { TableProps } from 'ant-design-vue';
import type { WeekHours } from '@/types';

const { fetchSubmittedHours } = useApprovalPeriodsStore();
const { records } = storeToRefs(useApprovalPeriodsStore());

const columns: TableProps<WeekHours>['columns'] = [ 
  {
    key: 'week',
    title: 'Период',
    dataIndex: 'week',
    customRender: ({ text }) =>
      createVNode(
        RouterLink,
        {
          to: {
            name: PageName.TIMESHEET_APPROVAL_PERIOD,
            params: {
              weekStart: text,
            },
          },
        },
        () => getDashSeparatedWeekRange(text)
      ),
  },
  {
    key: 'hours',
    title: 'Часы',
    dataIndex: 'hours',
    align: 'right',
    customRender: ({ text }) => formatHours(text),
  },
];

onBeforeMount(async () => {
  await fetchSubmittedHours();
});
</script>
<template>
  <Card v-if="records.length" :bordered="false" :bodyStyle="{ paddingLeft: 0, paddingRight: 0 }">
    <Table :columns="columns" :data-source="records" :pagination="false" />
  </Card>
  <Empty v-else />
</template>
