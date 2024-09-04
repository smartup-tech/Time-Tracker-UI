<script lang="ts" setup>
import { ref } from 'vue';
import { Button, message, Modal } from 'ant-design-vue';

import { useUserProjectsStore } from '@/store';
import { useBoolean } from '@/shared/lib';
import { LAIcon } from '@/shared/ui';
import { UserProjectForm } from '@/entities/user';

type Props = {
  userId: number;
};

const props = defineProps<Props>();
const { addUserToProject } = useUserProjectsStore();
const [modalVisible, { setTrue: showModal, setFalse: closeModal }] =
  useBoolean();

const form = ref<InstanceType<typeof UserProjectForm> | null>(null);

const onSave = async () => {
  if (!form.value) {
    return;
  }

  await form.value?.validate();
  await addUserToProject(props.userId, form.value.model);

  form.value?.resetFields();
  closeModal();
  message.success('Сотрудник добавлен в проект');
};

const onCancel = () => {
  form.value?.resetFields();
  closeModal();
};
</script>

<template>
  <Button type="primary" @click="showModal">Добавить в проект</Button>
  <Modal
    title="Добавить сотрудника в проект"
    v-model:visible="modalVisible"
    destroy-on-close
    ok-text="Сохранить"
    @ok="onSave"
    @cancel="onCancel"
  >
    <UserProjectForm ref="form" />
    <template #closeIcon>
      <LAIcon icon="times" size="large" />
    </template>
  </Modal>
</template>
