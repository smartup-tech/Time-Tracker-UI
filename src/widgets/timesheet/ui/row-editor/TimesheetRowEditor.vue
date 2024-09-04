<script lang="ts" setup>
import { computed, onMounted, reactive, ref, unref, watch } from 'vue';
import {
  Button,
  Checkbox,
  Form,
  Popconfirm,
  Space,
  Textarea,
  Tooltip,
} from 'ant-design-vue';
import cloneDeep from 'lodash/cloneDeep';

import { formatHours } from '@/shared/lib';
import { useTimesheetStore } from '@/store';

import { TimesheetCell } from '../cell';
import { TimesheetProjectPicker } from '../project-picker';
import { TimesheetTaskPicker } from '../task-picker';
import { HoursInput } from '../hours-input';
import { getTotalRowHours, isLockedUnit, isUnsavedRow } from '../../lib';

import type { Task, ITimesheetRow } from '@/types';
import type { TimesheetColumn } from '../../types';
import { LAIcon } from '@/shared/ui';

type Props = {
  activeDay: string;
  columns: TimesheetColumn[];
  value: ITimesheetRow;
};

const props = defineProps<Props>();

const model = ref<ITimesheetRow>(cloneDeep(props.value));

const emit = defineEmits([
  'click',
  'cancel',
  'delete',
  'save',
  'focusRow',
  'update:activeDay',
]);

const { fetchProjectTasks, getTimesheetRowIndex, isBlockedDate } =
  useTimesheetStore();

const useForm = Form.useForm;

const rules = reactive({
  projectId: [{ required: true, message: 'Выберите проект' }],
  taskId: [{ required: true, message: 'Выберите задачу' }],
});

const { validate, validateInfos } = useForm(model, rules);

const tasks = ref<Task[]>([]);
const inputRefs = ref<Record<string, unknown | null>>({});

const isUnsaved = computed<boolean>(() => isUnsavedRow(model.value));

const hasLockedUnits = computed<boolean>(() =>
  Object.values(model.value.units).some((unit) => unit.blocked)
);

const cancelEdit = () => {
  emit('cancel');
};

const save = async () => {
  await validate();
  emit('save', model.value);
};

const deleteRow = () => emit('delete');

const setActiveDay = (key: string) => emit('update:activeDay', key);

const onCancelClick = () => {
  if (unref(isUnsaved) && !model.value.observed) {
    deleteRow();
  } else {
    cancelEdit();
  }
};

const onCellClick = (column: TimesheetColumn) => {
  if ('days' === column.dataIndex) {
    setActiveDay(column.key);
    (inputRefs.value[column.key] as typeof HoursInput).select();
  }
};

const updateIsBillable = (taskId: number) => {
  const task = tasks.value.find(({ id }: Task) => taskId === id);

  if (!task) {
    return;
  }

  model.value = {
    ...model.value,
    units: Object.values(model.value.units).reduce((acc, unit) => {
      acc[unit.workDay] =
        unit.id > 0 ? unit : { ...unit, billable: task.billable };

      return acc;
    }, {} as ITimesheetRow['units']),
  };
};

const switchToExistingRow = (projectId: number, taskId: number) => {
  const rowIndex = getTimesheetRowIndex(projectId, taskId);

  if (rowIndex >= 0) {
    emit('focusRow', rowIndex);
  }
};

const getDayIndex = (day: string) =>
  Object.keys(model.value.units).findIndex((key) => key === day) + 1;

const isLockedCell = (column: TimesheetColumn) =>
  isBlockedDate(column.key) || isLockedUnit(model.value.units[column.key]);

watch(
  () => model.value.projectId,
  async (newValue, oldValue) => {
    if (newValue) {
      tasks.value = await fetchProjectTasks(newValue);

      if (oldValue && oldValue !== newValue) {
        model.value.taskId = undefined;
      }
    }
  },
  {
    immediate: true,
  }
);

watch(
  () => model.value.taskId,
  (newValue) => {
    if (newValue) {
      updateIsBillable(newValue);

      if (model.value.projectId) {
        switchToExistingRow(model.value.projectId, newValue);
      }
    }
  }
);

onMounted(() => {
  if (model.value.taskId) {
    (inputRefs.value[props.activeDay] as typeof HoursInput).select();
  }
});
</script>

<template>
  <tr class="timesheet-table__row'">
    <TimesheetCell
      v-for="column in columns"
      :key="column.key"
      :class="column.class"
      :active="activeDay === column.key"
      @click="onCellClick(column)"
    >
      <template v-if="column.key === 'project'">
        <Form.Item
          name="project-id"
          :style="{ margin: 0 }"
          :validate-status="validateInfos.projectId.validateStatus"
        >
          <Tooltip :title="validateInfos.projectId.help">
            <TimesheetProjectPicker
              :tabindex="1"
              :active="isUnsaved"
              v-model:value="model.projectId"
            />
          </Tooltip>
        </Form.Item>
      </template>
      <template v-else-if="column.key === 'task'">
        <Form.Item
          name="task-id"
          :style="{ margin: 0 }"
          :validate-status="validateInfos.taskId.validateStatus"
        >
          <Tooltip :title="validateInfos.taskId.help">
            <TimesheetTaskPicker
              :tabindex="1"
              :active="isUnsaved"
              :tasks="tasks"
              v-model:value="model.taskId"
            />
          </Tooltip>
        </Form.Item>
      </template>
      <template v-else-if="column.dataIndex === 'days'">
        <HoursInput
          :ref="(el) => (inputRefs[column.key] = el)"
          :active="activeDay === column.key"
          :disabled="isLockedCell(column)"
          :tabindex="getDayIndex(column.key)"
          @focus="setActiveDay(column.key)"
          v-model:value="model.units[column.key].hours"
        />
      </template>
      <template v-else-if="column.key === 'total'">
        {{ formatHours(getTotalRowHours(model)) }}
      </template>
    </TimesheetCell>
  </tr>
  <tr class="timesheet-table__row">
    <TimesheetCell type="actions" :colspan="2">
      <Space class="timesheet-table__actions">
        <Popconfirm
          :disabled="hasLockedUnits"
          placement="topRight"
          title="Удалить строку?"
          @confirm="deleteRow"
        >
          <Button tabindex="-2" :disabled="hasLockedUnits"> Удалить </Button>
        </Popconfirm>

        <Button tabindex="-1" @click="onCancelClick">Отмена</Button>
        <Button type="primary" tabindex="0" @click="save">Сохранить</Button>
      </Space>
      <Space class="timesheet-table__saved">
        <Checkbox
          v-model:checked="model.observed"
        >
          Запомнить
        </Checkbox>
      </Space>
    </TimesheetCell>
    <TimesheetCell :colspan="7">
      <div class="timesheet-table__comment">
        <Textarea
          class="comment-input"
          show-count
          placeholder="Комментарий"
          :maxlength="1000"
          :rows="4"
          :tabindex="getDayIndex(activeDay)"
          :disabled="
            isBlockedDate(activeDay) || isLockedUnit(model.units[activeDay])
          "
          v-model:value="model.units[activeDay].comment"
        />
      </div>
      <Checkbox
        :disabled="
          isBlockedDate(activeDay) || isLockedUnit(model.units[activeDay])
        "
        :tabindex="getDayIndex(activeDay)"
        v-model:checked="model.units[activeDay].billable"
      >
        Billable
      </Checkbox>
      <div
        v-if="model.units[activeDay].rejected"
        class="timesheet-table__reject-reason"
      >
        <LAIcon
          class="timesheet-table__rejected-icon"
          icon="exclamation-triangle"
        />
        Не согласовано:
        <template v-if="model.units[activeDay].rejectReason">
          {{ model.units[activeDay].rejectReason }}
        </template>
        <span v-else class="timesheet-table__empty-rejection">
          Причина не указана
        </span>
      </div>
    </TimesheetCell>
  </tr>
</template>

<style lang="scss" scoped>
.timesheet-table__row {
  height: 40px;
}

.timesheet-table__cell_actions {
  padding: 10px 12px;
  vertical-align: top;
}

.timesheet-table__comment {
  margin-bottom: 8px;
}

.timesheet-table__actions {
  display: flex;
  justify-content: flex-end;
}

.timesheet-table__saved {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.timesheet-table__reject-reason {
  margin-top: 16px;
}

.timesheet-table__rejected-icon {
  vertical-align: middle;
  color: var(--color-warning);
}

.timesheet-table__empty-rejection {
  font-style: italic;
  color: var(--color-text-muted);
}
</style>
