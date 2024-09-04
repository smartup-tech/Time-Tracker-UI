<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { Button, Form, InputPassword } from 'ant-design-vue';
import { breakpointsAntDesign, useBreakpoints } from '@vueuse/core';

import {
  validateLowerCaseLetters,
  validateNumberAmount,
  validateUpperCaseLetters,
} from '@/shared/lib';
import { PasswordRequirements } from '@/shared/ui';

import type { FormInstance, Rule } from 'ant-design-vue/lib/form';
import type { PasswordUpdate } from '@/types';

const emit = defineEmits(['submit']);

const breakpoints = useBreakpoints(breakpointsAntDesign);
const sm = breakpoints.smaller('sm');

const form = ref<FormInstance>();

const model: PasswordUpdate = reactive({
  newPassword: '',
  oldPassword: '',
});

const rules: Record<string, Rule[]> = reactive({
  oldPassword: [
    { required: true, message: 'Старый пароль не может быть пустым' },
  ],
  newPassword: [
    {
      required: true,
      message: 'Новый пароль не может быть пустым',
    },
    {
      validator: validateNumberAmount(),
      trigger: 'blur',
    },
    {
      validator: validateUpperCaseLetters(),
      trigger: 'blur',
    },
    {
      validator: validateLowerCaseLetters(2),
      trigger: 'blur',
    },
  ],
});

const onSubmit = async () => {
  await validate();
  emit('submit', model);
};

const resetFields = () => form.value?.resetFields();
const validate = () => form.value?.validate();

defineExpose({ resetFields, validate });
</script>

<template>
  <Form
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 16 }"
    :model="model"
    :colon="false"
    :rules="rules"
    ref="form"
    hide-required-mark
    label-align="left"
    autocomplete="off"
    @finish="onSubmit"
  >
    <Form.Item name="oldPassword" label="Старый пароль">
      <InputPassword
        autocomplete="old-password"
        v-model:value.trim="model.oldPassword"
        size="large"
      />
    </Form.Item>
    <Form.Item name="newPassword" label="Новый пароль">
      <InputPassword
        autocomplete="new-password"
        size="large"
        v-model:value.trim="model.newPassword"
      />
    </Form.Item>
    <Form.Item :wrapper-col="!sm ? { span: 16, offset: 6 } : undefined">
      <PasswordRequirements :password="model.newPassword" />
    </Form.Item>
    <Form.Item :wrapper-col="!sm ? { span: 16, offset: 6 } : undefined">
      <Button type="primary" html-type="submit">Сохранить</Button>
    </Form.Item>
  </Form>
</template>
