<script lang="ts" setup>
import { computed } from 'vue';
import { Select } from 'ant-design-vue';

import { useLocaleState } from '@/shared/lib';

import type { Task } from '@/types';

type Option = {
  key: number;
  label: string;
  value: number;
};

const props = withDefaults(
  defineProps<{
    active: boolean;
    tasks: Task[];
    value?: number;
  }>(),
  {
    active: true,
  }
);

const emit = defineEmits(['update:value']);

const locale = useLocaleState();

const activeTasks = computed<Task[]>(() =>
  props.tasks.filter(({ archived }: Task) => !archived)
);

const taskList = computed<Task[]>(() =>
  props.active ? activeTasks.value : props.tasks
);

const taskOptions = computed<Option[]>(() =>
  taskList.value
    .map(({ id, name }: Task) => ({
      key: id,
      label: name,
      value: id,
    }))
    .sort((a, b) =>
      a.label.localeCompare(b.label, locale.value, { numeric: true })
    )
);

const model = computed<number | undefined>({
  get: () => props.value,
  set: (value) => emit('update:value', value),
});

const filterOption = (input: string, option: Option) =>
  option.label.toLowerCase().includes(input.toLocaleLowerCase());
</script>

<template>
  <Select
    show-search
    :disabled="tasks.length === 0 || !active"
    :filter-option="filterOption"
    :options="taskOptions"
    :tabindex="1"
    v-model:value="model"
  />
</template>
