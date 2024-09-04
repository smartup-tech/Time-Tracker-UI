<script setup lang="ts">
import { computed, onBeforeMount, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { Card, Space, Empty, RangePicker } from 'ant-design-vue';

import { useApprovalDaysStore } from '@/store';
import ApprovalDaysTable from './approval-days-table';

import { useApprovalDaysConfig } from './config';
import {
  SubmittedDataForAction,
  ApprovalDayNestedRow,
  ApprovalDayRow,
  DateRange,
} from '@/types';

const { fetchSubmittedWorkDays, setDateRange } = useApprovalDaysStore();
const { records, days, dateRange } = storeToRefs(useApprovalDaysStore());

const { columns, innerColumns } = useApprovalDaysConfig();

onBeforeMount(async () => {
  await fetchSubmittedWorkDays();
});

const standardHours = computed<number>(() =>
  days.value.reduce((acc, value) => acc + value.standardHours, 0)
);

const dates = computed<DateRange | undefined>({
  get: () => dateRange?.value,
  set: (value?: DateRange) => {
    setDateRange(value);
  },
});

const getUserSubmittedTableRow = computed(() => {
  return records.value.map((record) => {
    const row: ApprovalDayRow = {};

    row['key'] = record.userId;
    row['username'] = `${record.firstName} ${record.lastName}`.trim();
    let totalHours = 0;
    record.summaryTrackUnits.forEach((summary) => {
      row[summary.date] = summary.hours;
      totalHours += summary.hours;
    });

    days.value.forEach((metaDay) => {
      if (!row[metaDay.date]) {
        row[metaDay.date] = 0;
      }
    });
    row['totalHours'] = totalHours;

    return row;
  });
});

const getProjectTaskSubmittedTableRow = computed(() => {
  return records.value
    .map((record) => {
      const rows: ApprovalDayNestedRow[] = [];

      record.projectTrackUnits.forEach((projectTrackUnit) => {
        const row: ApprovalDayNestedRow = {};
        row['key'] = record.userId;
        row['projectTaskName'] =
          `${projectTrackUnit.projectName} ${projectTrackUnit.taskName}`.trim();

        const approvals: SubmittedDataForAction[] = [];
        let totalHours = 0;
        projectTrackUnit.trackUnits.forEach((trackUnit) => {
          row[trackUnit.date] = trackUnit.hours;
          totalHours += trackUnit.hours;
          approvals.push({
            trackUnitId: trackUnit.trackUnitId,
            firstName: record.firstName,
            lastName: record.lastName,
            workDay: trackUnit.date,
            taskName: row['projectTaskName'] as string,
            hours: trackUnit.hours,
          });
        });
        row['approval'] = approvals;
        row['totalHours'] = totalHours;

        days.value.forEach((metaDay) => {
          if (!row[metaDay.date]) {
            row[metaDay.date] = 0;
          }
        });

        rows.push(row);
      });
      return rows;
    })
    .flat();
});

watch(dates, async () => {
  await fetchSubmittedWorkDays();
});
</script>

<template>
  <Card
    v-if="records.length"
    :bordered="false"
    :bodyStyle="{ paddingLeft: 0, paddingRight: 0, paddingTop: 0 }"
    :headStyle="{ border: 'none' }"
  >
    <template #title>
      <Space
        >Период
        <RangePicker v-model:value.lazy="dates" format="DD.MMM.YYYY" />
      </Space>
    </template>
    <template #extra>
      <Space>{{ `Норма часов: ${standardHours ? standardHours : 0}` }}</Space>
    </template>
    <ApprovalDaysTable
      :columns="columns"
      :rows="getUserSubmittedTableRow"
      :inner-columns="innerColumns"
      :inner-rows="getProjectTaskSubmittedTableRow"
    />
  </Card>
  <Empty v-else />
</template>

<style lang="scss" scoped>
:deep(.ant-table-summary) {
  td {
    border-top: 1px solid #f0f0f0;
    background: #fafafa;
    border-bottom: none;
    font-weight: 500;
  }
}
</style>

<style lang="scss">
@import '/src/app/styles/index';
</style>
