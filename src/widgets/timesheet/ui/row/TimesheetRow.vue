<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useTimesheetStore } from '@/store';

import { TimesheetRowViewer } from '../row-viewer';
import { TimesheetRowEditor } from '../row-editor';

import type { ITimesheetRow } from '@/types';
import type { TimesheetColumn } from '../../types';

type Props = {
  columns: TimesheetColumn[];
  model: ITimesheetRow;
  editable?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  editable: false,
});

const { activeDay, weekStart } = storeToRefs(useTimesheetStore());
const { setActiveDay } = useTimesheetStore();

const activeColumn = computed<string>({
  get: () => activeDay.value || weekStart.value,
  set: (value) => setActiveDay(value),
});

const emit = defineEmits(['click', 'cancel', 'delete', 'save', 'focusRow', 'switchToExistRow']);

const onRowClick = () => {
  if (!props.editable) {
    emit('click');
  }
};

const cancelEdit = () => emit('cancel');

const save = async (value: ITimesheetRow) => emit('save', value);

const deleteRow = () => emit('delete', props.model);

const onCellClick = (column: TimesheetColumn) => {
  if ('days' === column.dataIndex) {
    setActiveDay(column.key);
  }
};
</script>

<template>
  <TimesheetRowEditor
    v-if="props.editable"
    :columns="columns"
    :value="model"
    v-model:active-day="activeColumn"
    @cancel="cancelEdit"
    @delete="deleteRow"
    @save="save"
    @focus-row="(rowIndex) => emit('focusRow', rowIndex)"
  />
  <TimesheetRowViewer
    v-else
    :columns="columns"
    :model="model"
    @click="onRowClick"
    @cell-click="onCellClick"
  />
</template>
