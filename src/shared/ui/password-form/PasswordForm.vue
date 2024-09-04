<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import { Button, Form, InputPassword } from 'ant-design-vue';

import {
  validateLowerCaseLetters,
  validateNumberAmount,
  validateUpperCaseLetters,
} from '@/shared/lib';
import { PasswordRequirements } from '@/shared/ui';

import type { Rule } from 'ant-design-vue/lib/form';

withDefaults(
  defineProps<{
    loading: boolean;
  }>(),
  {
    loading: false,
  }
);

const emit = defineEmits(['submit']);

const form = ref();

const model: {
  password: string;
} = reactive({
  password: '',
});

const rules: Record<string, Rule[]> = reactive({
  password: [
    {
      required: true,
      message: 'Введите новый пароль',
      whitespace: true,
    },
    {
      validator: validateNumberAmount(),
    },
    {
      validator: validateUpperCaseLetters(),
    },
    {
      validator: validateLowerCaseLetters(2),
    },
  ],
});

const onSubmit = () => emit('submit', model.password);

watch(
  () => model,
  () => form.value.clearValidate(),
  { deep: true }
);
</script>

<template>
  <Form
    :model="model"
    layout="vertical"
    hide-required-mark
    validate-trigger="blur"
    ref="form"
    @finish="onSubmit"
  >
    <Form.Item name="password" label="Новый пароль" :rules="rules.password">
      <InputPassword
        autocomplete="new-password"
        size="large"
        v-model:value.trim="model.password"
      />
    </Form.Item>

    <Form.Item>
      <PasswordRequirements :password="model.password" />
    </Form.Item>

    <Button :loading="loading" type="primary" html-type="submit">
      Сохранить
    </Button>
  </Form>
</template>
