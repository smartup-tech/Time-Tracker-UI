<script lang="ts" setup>
import { shallowRef } from 'vue';
import { Dropdown, Button, Menu } from 'ant-design-vue';
import XLSX, { BookType } from 'xlsx';

import { LAIcon } from '@/shared/ui';

type Props = {
  columns: string[];
  dataSource: (string | number)[][];
  title: string;
};

type Option = {
  type: BookType;
  icon: string;
  text: string;
};

const props = defineProps<Props>();

const options = shallowRef<Option[]>([
  {
    type: 'csv',
    icon: 'file-csv',
    text: 'CSV',
  },
  {
    type: 'xlsx',
    icon: 'file-excel',
    text: 'XLSX',
  },
]);

const saveAs = async (type?: BookType) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([props.columns, ...props.dataSource]);

  XLSX.utils.book_append_sheet(wb, ws);

  await XLSX.writeFile(wb, `${props.title}.${type}`, { bookType: type });
};
</script>

<template>
  <Dropdown class="export" trigger="click">
    <Button class="export__button">
      Скачать
      <LAIcon class="export__button-icon" icon="angle-down" size="small" />
    </Button>
    <template #overlay>
      <Menu>
        <Menu.Item
          v-for="option in options"
          :key="option.type"
          @click="saveAs(option.type)"
        >
          <LAIcon :icon="option.icon" />
          {{ option.text }}
        </Menu.Item>
      </Menu>
    </template>
  </Dropdown>
</template>

<style lang="scss" scoped>
.export {
  &__button-icon {
    margin-left: 8px;
    font-size: 16px;
  }
}
</style>
