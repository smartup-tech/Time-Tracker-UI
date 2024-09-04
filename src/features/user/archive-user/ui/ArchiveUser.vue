<script lang="ts" setup>
import { createVNode } from 'vue';
import { Button, message, Popconfirm, Tooltip } from 'ant-design-vue';
import Modal from 'ant-design-vue/es/modal';

import { HTTPException } from '@/shared/exceptions';
import { Errors, ErrorCode, getFullName } from '@/shared/lib';
import { LAIcon } from '@/shared/ui';
import { useUsersStore } from '@/store';

import type { ApiErrorResponse, Project, User } from '@/types';

const props = defineProps<{
  user: User;
}>();

const { archiveUser } = useUsersStore();
const emit = defineEmits(['succes'])

const getErrorContent = (response?: ApiErrorResponse) => {
  const items = response?.relatedEntities
    ? (response.relatedEntities as Project[]).map(({ name }: Project) => ({
        text: name,
      }))
    : [];

  const list = createVNode(
    'ul',
    { style: { margin: '8px 0 0', padding: 0 } },
    items.map((item) =>
      createVNode(
        'li',
        {
          style: { margin: '0 0 4px 20px' },
        },
        item.text
      )
    )
  );

  return createVNode('div', {}, [message, list]);
};

const onUserArchive = async (params?: { force: boolean }) => {
  try {
    await archiveUser(props.user.id, params);
    message.success(`Сотрудник ${getFullName(props.user)} отправлен в архив`);
    emit('succes')
  } catch (error) {
    if (error instanceof HTTPException) {
      if (
        ErrorCode.RELATED_ENTITIES_FOUND_FOR_USER === error.response?.errorCode
      ) {
        Modal.confirm({
          title: `Сотрудник ${getFullName(props.user)} будет удален из проектов`,
          content: getErrorContent(error.response),
          onOk: () => onUserArchive({ force: true }),
        });

        return;
      }

      Modal.error({
        title: `Не удалось отправить сотрудника ${getFullName(props.user)} в архив`,
        content: error.response?.errorCode
          ? Errors[error.response?.errorCode]
          : error.response?.errorMessage,
      });
    }
  }
};
</script>

<template>
  <Popconfirm placement="topRight" @confirm="() => onUserArchive()">
    <template #title>Отправить сотрудника {{ getFullName(props.user) }} в архив?</template>
    <Tooltip title="В архив">
      <Button shape="circle" type="text">
        <template #icon>
          <LAIcon icon="box" size="large" />
        </template>
      </Button>
    </Tooltip>
  </Popconfirm>
</template>
