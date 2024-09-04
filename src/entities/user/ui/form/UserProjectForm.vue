<script lang="ts" setup>
import { computed, onBeforeMount, onBeforeUnmount, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { Form, RadioGroup, Select, SelectProps } from 'ant-design-vue';

import { teamRoles, TeamRole } from '@/constants';
import { NumberInput } from '@/shared/ui';
import { usePickProjectStore, useUserProjectsStore } from '@/store';

import type { CreateUserProject, Project } from '@/types';
import type { Rule } from 'ant-design-vue/lib/form';
import { SelectValue } from 'ant-design-vue/lib/select';

type UserOption = {
  label: string;
  value: number;
};

const useForm = Form.useForm;

const { fetchActiveProjects, reset: resetStore } = usePickProjectStore();
const { isLoading, projects } = storeToRefs(usePickProjectStore());
const { projects: excludeProjects } = useUserProjectsStore();

const model: CreateUserProject = reactive({
  projectId: null,
  projectRoleId: 'EMPLOYEE',
  externalRate: undefined,
});

const rules: Record<string, Rule[]> = reactive({
  projectId: [{ required: true, message: 'Выберите проект' }],
  externalRate: [
    {
      type: 'number',
      message: 'Значение должно быть положительным числом',
      validator: async (rule: Rule, value: number) => {
        if (!value && value !== 0) {
          return Promise.resolve();
        }
        if (value <= 0) {
          return Promise.reject(rule.message);
        }

        return Promise.resolve();
      },
    },
  ],
});

const { resetFields, validate, validateInfos } = useForm(model, rules);

const projectOptions = computed<SelectProps['options']>(() => {
  const excludeProjectIds = excludeProjects.map((item) => item.id);
  return projects.value.map((project: Project) => ({
    key: project.id,
    label: `${project.name}`,
    value: project.id,
    disabled: excludeProjectIds.includes(project.id),
  }));
});

const roleOptions = Object.values(TeamRole).map((value) => ({
  label: teamRoles[value],
  value,
}));

defineExpose({ resetFields, validate, model });

onBeforeMount(async () => {
  await fetchActiveProjects();
});

onBeforeUnmount(() => {
  resetStore();
});

const filterOption = (input: string, option: UserOption) =>
  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
</script>

<template>
  <Form hide-required-mark label-align="left" v-model="model">
    <Form.Item
      label="Проект"
      v-bind="validateInfos.projectId"
      :colon="false"
      :label-col="{ span: 6 }"
    >
      <Select
        :loading="isLoading"
        :options="projectOptions"
        show-search
        :filter-option="filterOption"
        v-model:value="model.projectId as SelectValue"
      />
    </Form.Item>
    <Form.Item label="Роль" :colon="false" :label-col="{ span: 6 }">
      <RadioGroup
        :options="roleOptions"
        :style="{ display: 'grid', gap: '8px' }"
        v-model:value="model.projectRoleId"
      />
    </Form.Item>
    <Form.Item
      label="Ставка"
      v-bind="validateInfos.externalRate"
      :colon="false"
      :label-col="{ span: 6 }"
    >
      <NumberInput :min="0" v-model:value="model.externalRate" />
    </Form.Item>
  </Form>
</template>
