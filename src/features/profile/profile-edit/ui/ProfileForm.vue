<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import { Button, Form, Input, Space } from 'ant-design-vue';
import { breakpointsAntDesign, useBreakpoints } from '@vueuse/core';

import { EMAIL_MAX_LENGTH } from '@/constants';

import type { Rule } from 'ant-design-vue/lib/form';
import type { PersonalData } from '@/types';

type Props = {
  initialValue?: PersonalData;
};

const props = withDefaults(defineProps<Props>(), {
  initialValue: () => ({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
  }),
});

const emit = defineEmits(['submit']);

const breakpoints = useBreakpoints(breakpointsAntDesign);
const sm = breakpoints.smaller('sm');

const model = ref<PersonalData>({
  ...props.initialValue,
});

const rules: Record<string, Rule[]> = reactive({
  firstName: [
    {
      required: true,
      message: 'Введите имя',
      whitespace: true,
    },
  ],
  lastName: [
    {
      required: true,
      message: 'Введите фамилию',
      whitespace: true,
    },
  ],
});

const onSubmit = () => emit('submit', model.value);

watch(
  () => props.initialValue,
  (value) =>
    (model.value = {
      ...model.value,
      ...value,
    }),
  { deep: true }
);
</script>

<template>
  <Form
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 16 }"
    :model="model"
    :colon="false"
    :rules="rules"
    hide-required-mark
    label-align="left"
    autocomplete="off"
    @finish="onSubmit"
  >
    <Form.Item name="firstName" label="Имя">
      <Input v-model:value="model.firstName" size="large" />
    </Form.Item>
    <Form.Item name="middleName" label="Отчество">
      <Input
        placeholder="не обязательно"
        size="large"
        v-model:value="model.middleName"
      />
    </Form.Item>
    <Form.Item name="lastName" label="Фамилия" :rules="rules.lastName">
      <Input v-model:value="model.lastName" size="large" />
    </Form.Item>
    <Form.Item name="email" label="Эл. почта">
      <Input
        disabled
        type="email"
        size="large"
        :maxlength="EMAIL_MAX_LENGTH"
        v-model:value="model.email"
      />
    </Form.Item>
    <Form.Item :wrapper-col="!sm ? { span: 16, offset: 6 } : undefined">
      <Space>
        <Button type="primary" html-type="submit">Сохранить</Button>
      </Space>
    </Form.Item>
  </Form>
</template>
