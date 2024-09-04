<script lang="ts" setup>
import { reactive, ref, unref, watch } from 'vue';
import { Button, Card, Form, Input, Space } from 'ant-design-vue';
import { breakpointsAntDesign, useBreakpoints } from '@vueuse/core';

import { ErrorCode, Errors, useRemoteValidation } from '@/shared/lib';
import { NumberInput } from '@/shared/ui';

import type { CreatePosition } from '@/types';
import type { Rule } from 'ant-design-vue/lib/form';

type Props = {
  initialData?: CreatePosition;
  submit: (model: CreatePosition) => Promise<void>;
};

const props = defineProps<Props>();
const emit = defineEmits(['cancel', 'success']);

const breakpoints = useBreakpoints(breakpointsAntDesign);
const sm = breakpoints.smaller('sm');

const useForm = Form.useForm;

const model = ref<CreatePosition>({
  name: '',
  externalRate: 0,
  ...props.initialData,
});

const rules: Record<string, Rule[]> = reactive({
  name: [
    {
      required: true,
      message: 'Название не может быть пустым',
      whitespace: true,
    },
    {
      message: Errors[ErrorCode.NOT_UNIQUE_POSITION_NAME],
      validator: (rule: Rule) => {
        if (error.value === ErrorCode.NOT_UNIQUE_POSITION_NAME) {
          return Promise.reject(rule.message);
        }

        return Promise.resolve();
      },
    },
  ],
  externalRate: [
    {
      type: 'number',
      required: true,
      message: 'Значение должно быть положительным числом',
      validator: async (rule: Rule, value: number) => {
        if (value ?? value > 0) {
          return Promise.resolve();
        }

        return Promise.reject('Значение должно быть положительным числом');
      },
    },
  ],
});

const { validate, validateInfos } = useForm(model, rules);

const { error, resetError, submit } = useRemoteValidation(props.submit, {
  onError: () => validate(),
});

const onSubmit = async () => {
  await validate();
  await submit(unref(model));
};

const onCancel = () => emit('cancel');

watch(
  () => props.initialData,
  () =>
    (model.value = {
      ...model.value,
      ...props.initialData,
    }),
  { deep: true }
);

watch(
  () => model.value.name,
  () => {
    if (error.value) {
      resetError();
      validate();
    }
  }
);
</script>

<template>
  <Card :bordered="false">
    <Form
      class="form"
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
      <Form.Item
        name="name"
        label="Название"
        :rules="rules.name"
        v-bind="validateInfos.name"
      >
        <Input v-model:value="model.name" size="large" :maxlength="255" />
      </Form.Item>
      <Form.Item
        name="externalRate"
        label="Ставка"
        :rules="rules.externalRate"
        v-bind="validateInfos.externalRate"
      >
        <NumberInput v-model:value="model.externalRate" size="large" :min="0" />
      </Form.Item>
      <Form.Item
        class="form__buttons"
        :wrapper-col="!sm ? { span: 16, offset: 6 } : undefined"
      >
        <Space>
          <Button type="primary" html-type="submit">Сохранить</Button>
          <Button @click="onCancel">Отмена</Button>
        </Space>
      </Form.Item>
    </Form>
  </Card>
</template>

<style lang="scss" scoped>
.form {
  &__buttons {
    margin: 0;
    padding-top: 8px;
  }
}
</style>
