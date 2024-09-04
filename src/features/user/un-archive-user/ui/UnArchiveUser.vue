<script lang="ts" setup>
import { Button, message, Popconfirm, Tooltip } from 'ant-design-vue';
import Modal from 'ant-design-vue/es/modal';

import { HTTPException } from '@/shared/exceptions';
import { Errors, getFullName } from '@/shared/lib';
import { LAIcon } from '@/shared/ui';
import { useUsersStore } from '@/store';

import type { User } from '@/types';

const props = defineProps<{
  user: User;
}>();

const { unArchiveUser } = useUsersStore();

const onUserUnArchive = async () => {
  try {
    await unArchiveUser(props.user.id);
    message.success(`Сотрудник ${getFullName(props.user)} возвращен из архива`);
  } catch (error) {
    if (error instanceof HTTPException) {
      Modal.error({
        title: `Не удалось вернуть сотрудника ${getFullName(props.user)} из архива`,
        content: error.response?.errorCode
          ? Errors[error.response?.errorCode]
          : error.response?.errorMessage,
      });
    }
  }
};
</script>

<template>
  <Popconfirm placement="topRight" @confirm="() => onUserUnArchive()">
    <template #title>Вернуть сотрудника {{ getFullName(props.user) }} из архива?</template>
    <Tooltip title="Вернуть из архива">
      <Button shape="circle" type="text">
        <template #icon>
          <LAIcon icon="box-open" size="large" />
        </template>
      </Button>
    </Tooltip>
  </Popconfirm>
</template>
