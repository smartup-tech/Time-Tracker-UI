<script lang="ts" setup>
import { storeToRefs } from 'pinia';

import { ScrollShadow } from '@/shared/ui';
import { useTimesheetStore } from '@/store';

import { useTimesheetColumns } from './config';
import { TimesheetCell, TimesheetRow, TimesheetTotals } from '..';

import { type ITimesheetRow } from '@/types';
import { calendarDayOptions } from '@/types/calendar';
import { TimesheetColumn } from '../..';

const { isLoading, isFetching, timesheetRows, editableRow } = storeToRefs(
  useTimesheetStore()
);
const { setEditable, saveTimesheetRow, deleteTimesheetEntry, getByDate } =
  useTimesheetStore();

const emit = defineEmits(['save', 'cancel', 'delete', 'focusRow']);

const columns = useTimesheetColumns();

const editRow = (index: number) => setEditable(index);

const cancelEdit = () => {
  emit('cancel', editableRow.value);
  setEditable(null);
};

const saveRow = async (row: ITimesheetRow) => {
  await saveTimesheetRow(row);
  emit('save', editableRow.value);
  setEditable(null);
};

const deleteRow = async (row: ITimesheetRow) => {
  await deleteTimesheetEntry(row);
  emit('delete', editableRow.value);
  setEditable(null);
};

const focusRow = (existRowIndex: number, row: ITimesheetRow) => {
  deleteTimesheetEntry(row);
  setEditable(existRowIndex - 1);
  emit('focusRow', existRowIndex - 1);
};

const getDateBackgroundColor = (column: TimesheetColumn): string => {
  const date = getByDate(column.key);
  if (!date) {
    return '';
  }
  return (
    calendarDayOptions.find((option) => option.value === date.status)?.style ??
    ''
  );
};
</script>

<template>
  <ScrollShadow v-if="!isLoading">
    <table
      :class="['timesheet-table', isFetching && 'timesheet-table_loading']"
    >
      <thead>
        <TimesheetCell
          v-for="column in columns"
          :key="column.key"
          :class="[
            'timesheet-table__column-cell',
            column.class,
            column?.dataIndex === 'days' ? getDateBackgroundColor(column) : ''
          ]"
        >
          <template v-if="column?.dataIndex === 'days'">
            <span v-html="column?.title"></span>
          </template>
          <template v-else>
            {{ column?.title }}
          </template>
        </TimesheetCell>
      </thead>
      <tbody class="timesheet-table__body">
        <TimesheetRow
          v-for="(row, rowIndex) in timesheetRows"
          :key="`${row.projectId}_${row.taskId}_${rowIndex}`"
          :columns="columns"
          :model="row"
          :editable="editableRow === rowIndex"
          @click="editRow(rowIndex)"
          @delete="deleteRow(row)"
          @save="saveRow($event)"
          @cancel="cancelEdit"
          @focusRow="(existRowIndex) => focusRow(existRowIndex, row)"
        />
      </tbody>
      <TimesheetTotals :columns="columns" :rows="timesheetRows" />
    </table>
  </ScrollShadow>
</template>

<style lang="scss" scoped>
.timesheet-table {
  font-size: 13px;
  position: relative;
  width: 100%;
  border: none;

  @include respond-to($bp-lg) {
    font-size: 14px;
  }

  &_loading {
    opacity: 0.5;

    &::after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  &__column-cell {
    font-weight: 500;
    padding: 6px 12px;
    background: #fafafa;
    border: 1px solid #f0f0f0;
  }
}
</style>
