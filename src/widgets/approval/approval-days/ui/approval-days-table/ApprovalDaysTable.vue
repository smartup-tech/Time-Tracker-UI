<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import { Space } from 'ant-design-vue';
import { ApproveHours, RejectHours } from '@/features/timesheet';
import ApprovalDaysRow from '../approval-days-row/ApprovalDaysRow.vue';
import TimesheetCell from '@/widgets/timesheet/ui/cell/TimesheetCell.vue';
import { TimesheetColumn } from '@/widgets/timesheet';
import LAIcon from '@/shared/ui/la-icon/LAIcon.vue';

import {
  ApprovalDayRow,
  ApprovalDayNestedRow,
  SubmittedDataForAction,
} from '@/types';
import { calendarDayOptions } from '@/types/calendar';
import { useApprovalDaysStore } from '@/store/approval/days';

const { fetchSubmittedWorkDays, getByDate } = useApprovalDaysStore();

type Props = {
  columns: TimesheetColumn[];
  rows: ApprovalDayRow[];
  innerColumns: TimesheetColumn[];
  innerRows: ApprovalDayNestedRow[];
};

const props = defineProps<Props>();

const approvalTableRef = shallowRef<HTMLElement>();
const isEnd = shallowRef(true);
const isStart = shallowRef(true);

const expandedIds = ref<Map<number, boolean>>(new Map());

onMounted(() => {
  if (approvalTableRef.value) {
    calcPosition(approvalTableRef.value);
  }
  props.rows.forEach((row) => {
    expandedIds.value.set(row.key as number, false);
  });
});

const calcPosition = (target: HTMLElement) => {
  isStart.value = target.scrollLeft === 0;
  isEnd.value = target.scrollLeft + target.clientWidth === target.scrollWidth;
};

const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  calcPosition(target);
};

const getBackgroundCell = (column: TimesheetColumn) => {
  const calendarDay = getByDate(column.dataIndex);

  if (!calendarDay) {
    return '';
  }
  return (
    calendarDayOptions.find((option) => option.value === calendarDay?.status)
      ?.style ?? ''
  );
};

const getCellStyle = (
  column: TimesheetColumn,
  index: number,
  columns: TimesheetColumn[]
): string[] => {
  const styles: string[] = [];
  if (index === 0 && !isStart.value) {
    styles.push('timesheet-table__cell-first');
  }
  if (index === columns.length - 1 && !isEnd.value) {
    styles.push('timesheet-table__cell-last');
  }
  styles.push(getBackgroundCell(column));
  return styles;
};

const getApproval = (userId: number) => {
  return (
    props.innerRows
      ?.filter((data) => data.key === userId)
      .flatMap((data) => data.approval as SubmittedDataForAction[]) ?? []
  );
};

const handleExpandRow = (key: number) => {
  expandedIds.value.set(key, !expandedIds.value.get(key));
};

const getCollspan = computed(() => props.columns.length);

watch(props.columns, () => {
  if (approvalTableRef.value) {
    calcPosition(approvalTableRef.value);
  }
});
</script>

<template>
  <div
    ref="approvalTableRef"
    class="approval-table__container"
    @scroll="handleScroll"
  >
    <table class="approval-table">
      <thead>
        <TimesheetCell
          v-for="(column, index) in columns"
          :key="column.key"
          class="timesheet-table__cell_header"
          :class="getCellStyle(column, index, columns)"
          >{{ column.title }}</TimesheetCell
        >
      </thead>
      <tbody>
        <template v-for="(row, index) in rows" :key="index">
          <ApprovalDaysRow
            :columns="columns"
            :data="row"
            :is-start="isStart"
            :is-end="isEnd"
          >
            <template #bodyCell="{ column }">
              <Space v-if="column.key === 'action'">
                <ApproveHours
                  :button-props="{
                    size: 'small',
                  }"
                  :hours="getApproval(row.key as number)"
                  @submit="fetchSubmittedWorkDays"
                />
                <RejectHours
                  :button-props="{
                    size: 'small',
                  }"
                  :hours="getApproval(row.key as number)"
                  @reject="fetchSubmittedWorkDays"
                />
              </Space>
              <Space v-else-if="column.key === 'user'">
                <div class="approval-table__drop">
                  <LAIcon
                    icon="angle-down"
                    class="approval-table__drop-icon"
                    :class="{'approval-table__drop-icon-active': expandedIds.get(row.key as number)}"
                    @click="handleExpandRow(row.key as number)"
                  />
                  {{ row.username }}
                </div>
              </Space>
            </template>
          </ApprovalDaysRow>
          <tr v-if="expandedIds.get(row.key as number)">
            <td class="approval-table__nested-container" :colspan="getCollspan">
              <table class="approval-table__nested">
                <thead>
                  <TimesheetCell
                    class="timesheet-table__cell_header"
                    v-for="(innerColumn, index) in innerColumns"
                    :key="innerColumn.key"
                    :class="getCellStyle(innerColumn, index, innerColumns)"
                    >{{ innerColumn.title }}</TimesheetCell
                  >
                </thead>
                <tbody>
                  <ApprovalDaysRow
                    v-for="(innerRow, index) in innerRows?.filter(
                      (data) => row.key === data.key
                    )"
                    :key="index"
                    :columns="innerColumns"
                    :data="innerRow"
                    :is-start="isStart"
                    :is-end="isEnd"
                  >
                    <template #bodyCell="{ column }">
                      <Space v-if="column.key === 'action'">
                        <ApproveHours
                          :button-props="{
                            size: 'small',
                          }"
                          :hours="innerRow.approval as SubmittedDataForAction[]"
                          @submit="fetchSubmittedWorkDays"
                        />
                        <RejectHours
                          :button-props="{
                            size: 'small',
                          }"
                          :hours="innerRow.approval as SubmittedDataForAction[]"
                          @reject="fetchSubmittedWorkDays"
                        />
                      </Space>
                    </template>
                  </ApprovalDaysRow>
                </tbody>
              </table>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss">
.approval-table {
  max-width: 100%;
  width: 100%;

  &__container {
    overflow: scroll hidden;
  }

  &__drop {
    display: flex;
    align-items: center;
    &-icon {
      cursor: pointer;
      margin-right: 5px;
      transition: transform 0.3s;
      &-active {
        transform: rotate(-90deg);
      }
    }
  }

  &__droped {
    transform: scale(0);
    &-shown {
      transform: scale(1);
    }
  }

  &__nested {
    max-width: 100%;
    width: 100%;

    &-container {
      max-width: 100%;
      width: 100%;
      padding: 0;
    }
  }
}
</style>
