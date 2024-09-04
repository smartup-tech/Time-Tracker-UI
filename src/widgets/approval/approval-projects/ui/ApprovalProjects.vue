<script setup lang="ts">
import { createVNode, onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';
import { Card, Table } from 'ant-design-vue';

import { PageName } from '@/pages';
import { formatHours } from '@/shared/lib';
import { useApprovalProjectsStore } from '@/store';

import type { TableProps } from 'ant-design-vue';
import type { ProjectWeekHours } from '@/types';

const props = defineProps<{
  weekStart: string;
}>();

const { fetchProjectHours } = useApprovalProjectsStore();
const { records } = storeToRefs(useApprovalProjectsStore());

const columns: TableProps<ProjectWeekHours>['columns'] = [
  {
    key: 'project',
    title: 'Проект',
    dataIndex: 'projectName',
    customRender: ({ record }) =>
      createVNode(
        RouterLink,
        {
          to: {
            name: PageName.TIMESHEET_APPROVAL_PROJECT,
            params: {
              weekStart: props.weekStart,
              projectId: record.projectId,
            },
          },
        },
        () => record.projectName
      ),
  },
  {
    key: 'total',
    title: 'Всего',
    dataIndex: 'totalHours',
    align: 'right',
    customRender: ({ text }) => formatHours(text),
    width: 120,
  },
  {
    key: 'approve',
    title: 'Требуют согласования',
    dataIndex: 'submittedHours',
    align: 'right',
    customRender: ({ text }) => formatHours(text),
    width: 200,
  },
];

onBeforeMount(async () => {
  await fetchProjectHours(props.weekStart);
});
</script>

<template>
  <Card :bordered="false" :bodyStyle="{ paddingLeft: 0, paddingRight: 0 }">
    <Table :columns="columns" :data-source="records" :pagination="false" />
  </Card>
</template>
