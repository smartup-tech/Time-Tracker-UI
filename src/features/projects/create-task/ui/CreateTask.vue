<script lang="ts" setup>
import { nextTick, reactive, ref, watch } from 'vue';
import { Button, Checkbox, Form, Input, message, Modal } from 'ant-design-vue';
import { breakpointsAntDesign, useBreakpoints, useFocus } from '@vueuse/core';

import {
  ErrorCode,
  Errors,
  useBoolean,
  useRemoteValidation,
} from '@/shared/lib';
import { LAIcon } from '@/shared/ui';
import { useProjectsDetailsStore } from '@/store';

import type { CreateTask } from '@/types';
import type { Rule } from 'ant-design-vue/lib/form';

type Props = {
  projectId: number;
};

const props = defineProps<Props>();

const { createTask } = useProjectsDetailsStore();

const [modalVisible, { setTrue: showModal, setFalse: closeModal }] =
  useBoolean();

const breakpoints = useBreakpoints(breakpointsAntDesign);
const sm = breakpoints.smallerOrEqual('sm');

const model: CreateTask = reactive({
  billable: true,
  name: '',
  projectId: props.projectId,
});

const rules = reactive({
  name: [
    {
      required: true,
      message: 'Название не может быть пустым',
      whitespace: true,
    },
    {
      message: Errors[ErrorCode.NOT_UNIQUE_TASK_NAME],
      validator: (rule: Rule) => {
        if (error.value === ErrorCode.NOT_UNIQUE_TASK_NAME) {
          return Promise.reject(rule.message);
        }

        return Promise.resolve();
      },
    },
  ],
});

const useForm = Form.useForm;
const { resetFields, validate, validateInfos } = useForm(model, rules);

const { error, submit, resetError } = useRemoteValidation(createTask, {
  onSuccess() {
    resetFields();
    closeModal();
    message.success('Задача добавлена');
  },
  onError() {
    validate();
  },
});

const input = ref();
const { focused } = useFocus(input);

const onButtonClick = async () => {
  showModal();
  await nextTick();
  focused.value = true;
};

const onSave = async () => {
  await validate();
  await submit(model);
};

const onCancel = () => {
  resetFields();
  closeModal();
};

watch(
  () => model.name,
  () => {
    resetError();
    validate();
  }
);
</script>

<template>
  <Button type="primary" @click="onButtonClick">
    <template v-if="!sm">Создать задачу</template>
    <template v-if="sm" #icon>
      <LAIcon icon="plus" size="large" />
    </template>
  </Button>
  <Modal
    title="Новая задача"
    destroy-on-close
    ok-text="Сохранить"
    v-model:visible="modalVisible"
    @ok="onSave"
    @cancel="onCancel"
  >
    <Form hide-required-mark v-model="model" @submit="onSave">
      <Form.Item
        label="Название"
        :colon="false"
        :label-col="{ span: 6 }"
        :rules="rules.name"
        v-bind="validateInfos.name"
      >
        <Input ref="input" :maxlength="255" v-model:value="model.name" />
      </Form.Item>
      <Form.Item
        name="billable"
        :wrapper-col="!sm ? { offset: 6 } : undefined"
        :style="{ marginBottom: 0 }"
      >
        <Checkbox v-model:checked="model.billable">Billable</Checkbox>
      </Form.Item>
    </Form>
    <template #closeIcon>
      <LAIcon icon="times" size="large" />
    </template>
  </Modal>
</template>
