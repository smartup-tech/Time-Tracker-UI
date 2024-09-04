<script lang="ts" setup>
import {
  Button,
  Checkbox,
  Form,
  Input,
  List,
  message,
  Popconfirm,
  Space,
  Tooltip,
} from 'ant-design-vue';
import Modal from 'ant-design-vue/es/modal';
import { nextTick, reactive, ref, watch } from 'vue';
import { useFocus } from '@vueuse/core';

import { useProjectsDetailsStore } from '@/store';
import { HTTPException } from '@/shared/exceptions';
import { LAIcon } from '@/shared/ui';
import {
  ErrorCode,
  Errors,
  useBoolean,
  useRemoteValidation,
} from '@/shared/lib';

import type { Task, UpdateTask } from '@/types';
import type { Rule } from 'ant-design-vue/lib/form';

type Props = {
  task: Task;
  projectId: number;
};

const props = defineProps<Props>();

const { archiveTask, updateTask } = useProjectsDetailsStore();

const [isEditing, { set: setIsEditing }] = useBoolean(false);

const input = ref();
const { focused } = useFocus(input);

const taskModel = ref<UpdateTask>({
  billable: true,
  id: -1,
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
const { validate, validateInfos } = useForm(taskModel, rules);

const { error, submit, resetError } = useRemoteValidation(updateTask, {
  onSuccess() {
    setIsEditing(false);
    message.success('Задача обновлена');
  },
  onError() {
    validate();
  },
});

const onEdit = async () => {
  taskModel.value = Object.assign(taskModel.value, props.task);
  setIsEditing(true);
  await nextTick();
  focused.value = true;
};

const onEditCancel = () => setIsEditing(false);

const onSave = async () => {
  await validate();
  await submit(taskModel.value);
};

const onArchive = async () => {
  try {
    await archiveTask(props.task.id);
    message.success('Задача отправлена в архив');
  } catch (error) {
    if (error instanceof HTTPException) {
      Modal.error({
        title: 'Не удалось отправить задачу в архив',
        content: error.response?.errorCode
          ? Errors[error.response?.errorCode]
          : error.response?.errorMessage,
      });
    }
  }
};

watch(
  () => taskModel.value.name,
  () => {
    resetError();
    validate();
  }
);
</script>

<template>
  <List.Item class="list-item" :key="props.task.id">
    <Form v-if="isEditing" layout="inline" name="task" :model="taskModel">
      <Form.Item
        class="list-item__form-item"
        name="name"
        v-bind="validateInfos.name"
      >
        <Input
          ref="input"
          v-model:value="taskModel.name"
          @press-enter="onSave"
        />
      </Form.Item>
      <Form.Item>
        <Checkbox name="billable" v-model:checked="taskModel.billable">
          Billable
        </Checkbox>
      </Form.Item>
    </Form>
    <List.Item.Meta v-else>
      <template #description>
        {{ props.task.billable ? 'Billable' : 'Unbillable' }}
      </template>
      <template #title>
        {{ props.task.name }}
      </template>
    </List.Item.Meta>
    <template #actions>
      <Space>
        <template v-if="isEditing">
          <Tooltip title="Сохранить">
            <Button shape="circle" type="text" @click="onSave">
              <template #icon>
                <LAIcon icon="check" size="large" />
              </template>
            </Button>
          </Tooltip>
          <Tooltip title="Отмена">
            <Button shape="circle" type="text" @click="onEditCancel">
              <template #icon> <LAIcon icon="times" size="large" /> </template
            ></Button>
          </Tooltip>
        </template>
        <template v-else-if="!task.archived">
          <Tooltip title="Изменить">
            <Button shape="circle" type="text" @click="onEdit">
              <template #icon>
                <LAIcon icon="pen" size="large" />
              </template>
            </Button>
          </Tooltip>
          <Popconfirm placement="topRight" @confirm="onArchive">
            <template #title> Отправить задачу в архив? </template>
            <Tooltip title="В архив">
              <Button shape="circle" type="text">
                <template #icon>
                  <LAIcon icon="archive" size="large" />
                </template>
              </Button>
            </Tooltip>
          </Popconfirm>
        </template>
      </Space>
    </template>
  </List.Item>
</template>

<style lang="scss" scoped>
.list-item {
  flex-wrap: nowrap;
  align-items: flex-start;

  &__form-item {
    max-width: 100%;
    margin-bottom: 0;
  }
}
</style>
