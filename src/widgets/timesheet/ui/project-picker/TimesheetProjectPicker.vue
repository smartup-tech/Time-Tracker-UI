<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { Select } from 'ant-design-vue';

import { useTimesheetStore } from '@/store';
import { useLocaleState } from '@/shared/lib';

import type { Project } from '@/types';

type Option = {
  key: number;
  label: string;
  value: number;
};

const props = withDefaults(
  defineProps<{
    active: boolean;
    value?: number;
  }>(),
  {
    active: true,
  }
);

const emit = defineEmits(['update:value']);

const locale = useLocaleState();

const { projects } = storeToRefs(useTimesheetStore());

const model = computed<number | undefined>({
  get: () => props.value,
  set: (value: number | undefined) => emit('update:value', value),
});

const activeProjects = computed<Project[]>(() =>
  projects.value.filter(({ archived }: Project) => !archived)
);

const projectList = computed<Project[]>(() =>
  props.active ? activeProjects.value : projects.value
);

const projectOptions = computed<Option[]>(() =>
  projectList.value
    .map(({ id, name }: Project) => ({
      key: id,
      label: name,
      value: id,
    }))
    .sort((a, b) =>
      a.label.localeCompare(b.label, locale.value, { numeric: true })
    )
);

const filterOption = (input: string, option: Option) =>
  option.label.toLowerCase().includes(input.toLocaleLowerCase());
</script>

<template>
  <Select
    show-search
    :disabled="!active"
    :filter-option="filterOption"
    :options="projectOptions"
    :tabindex="1"
    v-model:value="model"
  />
</template>
