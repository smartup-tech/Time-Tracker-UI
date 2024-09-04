<script lang="ts" setup>
import { computed, onBeforeMount, onBeforeUnmount, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useDebounceFn } from '@vueuse/shared';
import { Form, RadioGroup, Select, SelectProps } from 'ant-design-vue';

import { teamRoles, TeamRole, REQUEST_DEBOUNCE_TIMEOUT } from '@/constants';
import { NumberInput } from '@/shared/ui';
import { usePickUserStore } from '@/store';

import type { CreateTeamMember, User } from '@/types';
import type { Rule } from 'ant-design-vue/lib/form';
import { SelectValue } from 'ant-design-vue/lib/select';

type Props = {
  projectId: number;
};

const props = defineProps<Props>();

const useForm = Form.useForm;

const { fetchUsersForProject, reset: resetStore } = usePickUserStore();
const { isLoading, users } = storeToRefs(usePickUserStore());

const model: CreateTeamMember = reactive({
  userId: null,
  projectRoleId: 'EMPLOYEE',
  externalRate: undefined,
});

const rules: Record<string, Rule[]> = reactive({
  userId: [{ required: true, message: 'Выберите сотрудника' }],
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

const userOptions = computed<SelectProps['options']>(() =>
  users.value.map((user: User) => ({
    key: user.id,
    label: `${user.firstName} ${user.lastName}`,
    value: user.id,
  }))
);

const roleOptions = Object.values(TeamRole).map((value) => ({
  label: teamRoles[value],
  value,
}));

const debouncedFetch = useDebounceFn(
  async (projectId: number, query: string) =>
    await fetchUsersForProject(projectId, query),
  REQUEST_DEBOUNCE_TIMEOUT
);

const onSearch = async (query: string) => {
  await debouncedFetch(props.projectId, query);
};

defineExpose({ resetFields, validate, model });

onBeforeMount(async () => {
  await fetchUsersForProject(props.projectId);
});

onBeforeUnmount(() => {
  resetStore();
});
</script>

<template>
  <Form hide-required-mark label-align="left" v-model="model">
    <Form.Item
      label="Сотрудник"
      v-bind="validateInfos.userId"
      :colon="false"
      :label-col="{ span: 6 }"
    >
      <Select
        :loading="isLoading"
        :options="userOptions"
        show-search
        :filter-option="false"
        v-model:value="model.userId as SelectValue"
        @search="onSearch"
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
