<script lang="ts" setup>
import { Button, message, Popconfirm, Tooltip } from 'ant-design-vue';
import Modal from 'ant-design-vue/es/modal';

import { HTTPException } from '@/shared/exceptions';
import { Errors } from '@/shared/lib';
import { LAIcon } from '@/shared/ui';
import { useProjectsStore } from '@/store';
import { Project } from '@/types';

const props = defineProps<{
  project: Project;
}>();

const emit = defineEmits(['succes']);

const { archiveProject } = useProjectsStore();

const onProjectArchive = async () => {
  try {
    await archiveProject(props.project.id);
    message.success(`Проект ${props.project.name} отправлен в архив`);
    emit('succes');
  } catch (error) {
    if (error instanceof HTTPException) {
      Modal.error({
        title: `Не удалось отправить проект ${props.project.name} в архив`,
        content: error.response?.errorCode
          ? Errors[error.response?.errorCode]
          : error.response?.errorMessage,
      });
    }
  }
};
</script>

<template>
  <Popconfirm placement="topRight" @confirm="onProjectArchive">
    <template #title
      >Отправить проект {{ props.project.name }} в архив?</template
    >
    <Tooltip title="В архив">
      <slot>
        <Button shape="circle" type="text">
          <template #icon>
            <LAIcon icon="box" size="large" />
          </template>
        </Button>
      </slot>
    </Tooltip>
  </Popconfirm>
</template>
