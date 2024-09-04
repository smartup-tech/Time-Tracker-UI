<script lang="ts" setup>
import { useProductionCalendarStore } from '@/store';
import { LAIcon } from '@/shared/ui';
import { ProductionCalendarDay } from '@/types';

import Modal from 'ant-design-vue/es/modal';

const props = defineProps<{ item: ProductionCalendarDay }>();

const { deleteProductionCalendarDay } = useProductionCalendarStore();

const deleteDay = () => {
  Modal.confirm({
    title: `${props.item.day} будет удален из календаря`,
    onOk: () => deleteProductionCalendarDay(props.item),
  });
};
</script>

<template>
  <LAIcon
    icon="minus-square"
    @click="deleteDay"
    :style="{ cursor: 'pointer' }"
  />
</template>
