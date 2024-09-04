<script lang="ts" setup>
import { createVNode } from 'vue';
import { Button, message, Popconfirm, Tooltip } from 'ant-design-vue';
import Modal from 'ant-design-vue/es/modal';

import { HTTPException } from '@/shared/exceptions';
import { Errors, getFullName } from '@/shared/lib';
import { LAIcon } from '@/shared/ui';
import { usePositionStore } from '@/store';

import type { ApiErrorResponse, User } from '@/types';

const props = defineProps<{
  positionId: number;
}>();

const { archivePosition } = usePositionStore();

const getErrorContent = (response?: ApiErrorResponse) => {
  const message = response?.errorCode
    ? Errors[response.errorCode] || response.errorMessage
    : response?.errorMessage;

  const items = response?.relatedEntities
    ? (response.relatedEntities as User[]).map((entity) => ({
        text: getFullName(entity),
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

const onPositionArchive = async () => {
  try {
    await archivePosition(props.positionId);
    message.success('Должность отправлена в архив');
  } catch (error) {
    if (error instanceof HTTPException) {
      Modal.error({
        title: 'Не удалось отправить должность в архив',
        content: getErrorContent(error.response),
        width: 460,
      });
    }
  }
};
</script>

<template>
  <Popconfirm placement="topRight" @confirm="onPositionArchive">
    <template #title>Отправить должность в архив?</template>
    <Tooltip title="В архив">
      <Button shape="circle" type="text">
        <template #icon>
          <LAIcon icon="box" size="large" />
        </template>
      </Button>
    </Tooltip>
  </Popconfirm>
</template>
