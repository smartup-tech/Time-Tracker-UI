<script lang="ts" setup>
import { computed, onBeforeMount, Ref } from 'vue';
import { storeToRefs } from 'pinia';
import {
  Button,
  Card,
  RangePicker,
  Space,
  Table,
  Tooltip,
  TableProps,
  TableSummary,
  TableSummaryCell,
  TableSummaryRow,
} from 'ant-design-vue';

import { ExportReport } from '@/features/reports';
import { usePersonalHoursReportsStore } from '@/store';
import { formatHours, totalsByKeys } from '@/shared/lib';
import { LAIcon } from '@/shared/ui';

import { usePersonalHoursReportConfig } from './config';
import { useExportedReportData, totalKeys } from './../lib';

import type { TableColumnsType } from 'ant-design-vue';
import type { BodyCell, DateRange, HoursReportRecord } from '@/types';

const {
  clearAllFilters,
  fetchReport,
  setDateRange,
  setFilters,
  setFilteredRecords,
} = usePersonalHoursReportsStore();
const { isFiltered, isLoading, report, dateRange, records } = storeToRefs(
  usePersonalHoursReportsStore()
);

const { columns } = usePersonalHoursReportConfig();

const { titles, series } = useExportedReportData(
  columns as Ref<TableColumnsType<HoursReportRecord>>,
  records as Ref<HoursReportRecord[]>
);

const dates = computed<DateRange>({
  get: () => dateRange.value,
  set: (value: DateRange) => setDateRange(value),
});

const totalHours = computed(() =>
  totalsByKeys<HoursReportRecord, typeof totalKeys[number]>(
    records.value,
    totalKeys
  )
);

const onChange: TableProps['onChange'] = (
  _pagination,
  filters,
  _sorter,
  { action, currentDataSource }
) => {
  if (action === 'filter') {
    setFilters(filters);
  }
  setFilteredRecords(currentDataSource);
};

const getHoursTooltip = (frozen: boolean) => {
  return frozen ? 'Блокированные' : 'Не блокированные';
};

const getIconName = (frozen: boolean) => {
  return frozen ? 'lock' : 'unlock';
};

const getIconClass = (frozen: boolean) => {
  return frozen ? 'cell-frozen' : 'cell-not-frozen';
};

const getHoursClass = (frozen: boolean, value: number) => {
  if (value === 0) {
    return 'cell-zero';
  }
  return frozen ? 'cell-frozen' : 'cell-not-frozen';
};

onBeforeMount(async () => {
  await fetchReport();
});
</script>

<template>
  <Card
    :bordered="false"
    :body-style="{ padding: '0 0 24px' }"
    :headStyle="{ border: 'none' }"
  >
    <template #title>
      <Space>
        <RangePicker v-model:value.lazy="dates" format="D MMM YYYY" />
        <Button type="primary" @click="fetchReport">Обновить</Button>

        <Button v-if="isFiltered" type="text" @click="clearAllFilters">
          Сброcить фильтры
        </Button>
      </Space>
    </template>
    <template #extra>
      <ExportReport :columns="titles" :data-source="series" title="timesheet" />
    </template>
    <Table
      :columns="columns"
      :data-source="report"
      :loading="isLoading"
      :scroll="{ x: 720 }"
      :pagination="{
        hideOnSinglePage: true,
      }"
      bordered
      @change="onChange"
    >
      <template #headerCell="{ column }: any">
        <template v-if="column.isHours">
          <Tooltip
            :title="getHoursTooltip(column.frozenHours)"
            placement="topRight"
          >
            <LAIcon
              :class="getIconClass(column.frozenHours)"
              :icon="getIconName(column.frozenHours)"
              size="small"
            />
          </Tooltip>
        </template>
      </template>

      <template #bodyCell="{ column, record }: BodyCell<any>">
        <template v-if="column.isHours">
          <span
            :class="getHoursClass(column.frozenHours, record[column.key])"
            >{{ formatHours(record[column.key]) }}</span
          >
        </template>
      </template>

      <template #summary>
        <TableSummary fixed>
          <TableSummaryRow>
            <TableSummaryCell :row-span="2" :index="0">Всего</TableSummaryCell>
            <TableSummaryCell :row-span="2"></TableSummaryCell>
            <TableSummaryCell :index="4" align="right">
              <span
                :class="getHoursClass(true, totalHours.billableHoursFrozen)"
              >
                {{ formatHours(totalHours.billableHoursFrozen) }}
              </span>
            </TableSummaryCell>
            <TableSummaryCell align="right">
              <span
                :class="getHoursClass(false, totalHours.billableHoursNotFrozen)"
              >
                {{ formatHours(totalHours.billableHoursNotFrozen) }}
              </span>
            </TableSummaryCell>
            <TableSummaryCell align="right">
              <span
                :class="getHoursClass(true, totalHours.unbillableHoursFrozen)"
              >
                {{ formatHours(totalHours.unbillableHoursFrozen) }}
              </span>
            </TableSummaryCell>
            <TableSummaryCell align="right">
              <span
                :class="
                  getHoursClass(false, totalHours.unbillableHoursNotFrozen)
                "
              >
                {{ formatHours(totalHours.unbillableHoursNotFrozen) }}
              </span>
            </TableSummaryCell>
            <TableSummaryCell align="right">
              <span :class="getHoursClass(true, totalHours.totalHoursFrozen)">
                {{ formatHours(totalHours.totalHoursFrozen) }}
              </span>
            </TableSummaryCell>
            <TableSummaryCell :index="5" align="right">
              <span
                :class="getHoursClass(false, totalHours.totalHoursNotFrozen)"
              >
                {{ formatHours(totalHours.totalHoursNotFrozen) }}
              </span>
            </TableSummaryCell>
          </TableSummaryRow>
          <TableSummaryRow>
            <TableSummaryCell :col-span="2" align="center">
              {{ formatHours(totalHours.billableHours) }}
            </TableSummaryCell>
            <TableSummaryCell :col-span="2" align="center">
              {{ formatHours(totalHours.unbillableHours) }}
            </TableSummaryCell>
            <TableSummaryCell :col-span="2" align="center">
              {{ formatHours(totalHours.totalHours) }}
            </TableSummaryCell>
          </TableSummaryRow>
        </TableSummary>
      </template>
    </Table>
  </Card>
</template>

<style lang="scss" scoped>
:deep(.ant-table-tbody) {
  td {
    height: 50px;
    padding: 12px 16px;
  }
}

:deep(.ant-table-summary) {
  td {
    border-top: 1px solid #f0f0f0;
    background: #fafafa;
    border-bottom: none;
    font-weight: 600;
  }
}

.cell-not-frozen {
  color: #f12b2b;
}

.cell-zero {
  color: #c9c9c9;
}
</style>
