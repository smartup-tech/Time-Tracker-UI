<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, watch } from 'vue';
import { storeToRefs } from 'pinia';
import {
  Card,
  FormItem,
  Space,
  Switch,
  Table,
  TableProps,
  TableSummary,
  TableSummaryCell,
  TableSummaryRow,
} from 'ant-design-vue';

import { TimesheetUnitStatus } from '@/constants';
import { ApproveHours, RejectHours } from '@/features/timesheet';
import { formatHours } from '@/shared/lib';
import { useApprovalDetailsStore } from '@/store';

import {
  useApprovalDetailsConfig,
  useApprovalDetailsSelection,
} from './config';
import { SubmittedDataForAction } from '@/types';

const props = defineProps<{
  weekStart: string;
  projectId: number;
}>();

const {
  fetchProjectHours: fetchProjectHoursDetailed,
  resetDetails,
  setFilteredRecords,
} = useApprovalDetailsStore();
const { records, isLoading, totalHours } = storeToRefs(
  useApprovalDetailsStore()
);

const { columns } = useApprovalDetailsConfig();

const { bulkSelectionEnabled, resetSelection, selection, selectedRows } =
  useApprovalDetailsSelection();

const emptySelection = computed<boolean>(() => selectedRows.value.length === 0);

const onChange: TableProps['onChange'] = (
  _pagination,
  _filters,
  _sorter,
  { currentDataSource }
) => {
  setFilteredRecords(currentDataSource);
};

onBeforeMount(async () => {
  await fetchProjectHoursDetailed(props.projectId, props.weekStart);
});

onBeforeUnmount(() => {
  resetDetails();
});

watch(
  () => records.value,
  () => resetSelection(),
  {
    deep: true,
  }
);
</script>

<template>
  <Card
    :bordered="false"
    :bodyStyle="{ paddingLeft: 0, paddingRight: 0, paddingTop: 0 }"
    :headStyle="{ border: 'none' }"
  >
    <template #title>
      <template v-if="bulkSelectionEnabled">
        <Space>
          <ApproveHours
            :button-props="{
              disabled: emptySelection,
            }"
            :hours="selectedRows"
          />
          <RejectHours
            :button-props="{
              disabled: emptySelection,
            }"
            :hours="selectedRows"
          />
        </Space>
      </template>
    </template>
    <template #extra>
      <FormItem no-style label="Выбрать несколько" :colon="false">
        <label>
          <Space>
            <Switch size="small" v-model:checked="bulkSelectionEnabled" />
            Выбрать несколько
          </Space>
        </label>
      </FormItem>
    </template>
    <Table
      :columns="columns"
      :data-source="records"
      :loading="isLoading"
      :pagination="false"
      :row-selection="bulkSelectionEnabled ? selection : undefined"
      :scroll="{ x: 720 }"
      row-key="trackUnitId"
      @change="onChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <template v-if="TimesheetUnitStatus.APPROVED === record.status">
            Согласовано
          </template>
          <template v-else-if="TimesheetUnitStatus.REJECTED === record.status">
            Отказано
          </template>
          <Space v-else>
            <ApproveHours
              :button-props="{
                size: 'small',
              }"
              :hours="[record as SubmittedDataForAction]"
            />
            <RejectHours
              :button-props="{
                size: 'small',
              }"
              :hours="[record as SubmittedDataForAction]"
            />
          </Space>
        </template>
      </template>
      <template #summary>
        <TableSummary fixed>
          <TableSummaryRow>
            <TableSummaryCell
              v-if="bulkSelectionEnabled"
              fixed="left"
              :index="0"
            ></TableSummaryCell>
            <TableSummaryCell
              fixed="left"
              :index="bulkSelectionEnabled ? 1 : 0"
            >
              Всего
            </TableSummaryCell>
            <TableSummaryCell></TableSummaryCell>
            <TableSummaryCell align="right">
              {{ formatHours(totalHours) }}
            </TableSummaryCell>
            <TableSummaryCell :col-span="4"></TableSummaryCell>
          </TableSummaryRow>
        </TableSummary>
      </template>
    </Table>
  </Card>
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
