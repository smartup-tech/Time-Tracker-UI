<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import { Button, Form, Input } from 'ant-design-vue';

import { EMAIL_MAX_LENGTH } from '@/constants';

import type { Rule } from 'ant-design-vue/lib/form';

withDefaults(
  defineProps<{
    loading: boolean;
  }>(),
  { loading: false }
);

const emit = defineEmits(['submit']);

const form = ref();

const model: {
  email: string;
} = reactive({
  email: '',
});

const rules: Record<string, Rule[]> = reactive({
  email: [
    {
      required: true,
      message: 'Введите адрес электронной почты',
    },
    {
      type: 'email',
      message: 'Введите корректный адрес электронной почты',
    },
  ],
});

const onSubmit = () => emit('submit', model.email);

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
    <Form.Item
      name="email"
      label="Введите адрес электронной почты вашей учетной записи"
      :rules="rules.email"
    >
      <Input
        :maxlength="EMAIL_MAX_LENGTH"
        size="large"
        v-model:value.trim="model.email"
      />
    </Form.Item>

    <Button :loading="loading" type="primary" html-type="submit">
      Отправить ссылку
    </Button>
  </Form>
</template>
