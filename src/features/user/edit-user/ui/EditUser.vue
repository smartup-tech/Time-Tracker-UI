<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { message } from 'ant-design-vue';

import { UserForm } from '@/entities/user';
import { useUsersStore } from '@/store';

import type { UpdateUser, UserDetails } from '@/types';

type Props = {
  model: UserDetails;
};

const props = defineProps<Props>();
const emit = defineEmits(['success', 'cancel', 'change']);

const { updateUser } = useUsersStore();

const userModel = ref<UpdateUser | undefined>();

const onSubmit = async (model: UpdateUser) => {
  await updateUser(props.model.id, model);
  message.success('Профиль сотрудника обновлен');

  emit('success');
};

const onChange = async (model: UpdateUser) => {
  emit('change', {
    ...model,
    id: props.model.id,
    position: { id: model.positionId },
  } as UserDetails);
};

onBeforeMount(() => {
  userModel.value = {
    ...props.model,
    positionId: props.model.position.id,
  } as UpdateUser;
});
</script>

<template>
  <UserForm
    :initial-data="userModel"
    :user-id="props.model.id"
    :submit="onSubmit"
    @change="onChange"
    @cancel="() => emit('cancel')"
  />
</template>
