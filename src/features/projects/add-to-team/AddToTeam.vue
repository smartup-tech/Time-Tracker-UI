<script lang="ts" setup>
import { ref } from 'vue';
import { Button, message, Modal } from 'ant-design-vue';
import { breakpointsAntDesign, useBreakpoints } from '@vueuse/core';

import { useProjectsDetailsStore } from '@/store';
import { useBoolean } from '@/shared/lib';
import { LAIcon } from '@/shared/ui';

import TeamMemberForm from './ui/TeamMemberForm.vue';

type Props = {
  projectId: number;
};

const props = defineProps<Props>();
const { addToTeam } = useProjectsDetailsStore();
const [modalVisible, { setTrue: showModal, setFalse: closeModal }] =
  useBoolean();

const breakpoints = useBreakpoints(breakpointsAntDesign);
const sm = breakpoints.smallerOrEqual('sm');

const form = ref<InstanceType<typeof TeamMemberForm> | null>(null);

const onSave = async () => {
  if (!form.value) {
    return;
  }

  await form.value?.validate();
  await addToTeam(props.projectId, form.value.model);
  form.value?.resetFields();
  closeModal();
  message.success('Сотрудник добавлен в команду');
};

const onCancel = () => {
  form.value?.resetFields();
  closeModal();
};
</script>

<template>
  <Button type="primary" @click="showModal">
    <template v-if="!sm">Добавить в команду</template>
    <template v-if="sm" #icon>
      <LAIcon icon="plus" size="large" />
    </template>
  </Button>
  <Modal
    title="Добавить в команду"
    v-model:visible="modalVisible"
    destroy-on-close
    ok-text="Сохранить"
    @ok="onSave"
    @cancel="onCancel"
  >
    <TeamMemberForm ref="form" :project-id="props.projectId" />
    <template #closeIcon>
      <LAIcon icon="times" size="large" />
    </template>
  </Modal>
</template>
