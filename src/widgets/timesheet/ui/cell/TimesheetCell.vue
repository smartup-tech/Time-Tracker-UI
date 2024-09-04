<script lang="ts" setup>
import { computed, HTMLAttributes } from 'vue';

type Props = {
  active?: boolean;
  hover?: boolean;
  type?: string;
};

const props = withDefaults(defineProps<Props>(), {
  active: false,
  hover: false,
});

const classNames = computed<HTMLAttributes['class']>(() => [
  'timesheet-table__cell',
  props.hover && 'timesheet-table__cell_hover',
  props.active && 'timesheet-table__cell_active',
  props.type && `timesheet-table__cell_${props.type}`,
]);
</script>

<template>
  <td :class="classNames">
    <slot />
  </td>
</template>

<style lang="scss">
.timesheet-table__cell-first {
  &::after {
    box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 0;
    right: 0;
    bottom: -1px;
    width: 30px;
    transform: translateX(100%);
    content: '';
  }
}

.timesheet-table__cell-last {
  &::before {
    box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 0;
    left: 0;
    bottom: -1px;
    width: 30px;
    transform: translateX(-100%);
    content: '';
  }
}
.timesheet-table__cell {
  height: 48px;
  padding: 10px 12px;
  border: 1px solid #f0f0f0;
  position: relative;

  &:first-child {
    position: sticky;
    z-index: 2;
    background: #fafafa;
    left: 0%;
    padding-left: 16px;
    border-left: none;
    min-width: 200px;
    max-width: 200px;
  }

  &:last-child {
    position: sticky;
    z-index: 2;
    background: #fafafa;
    right: 0%;
    padding-right: 16px;
    border-right: none;
  }

  &_hover {
    cursor: pointer;

    &:hover {
      background: #fafafa;
    }
  }

  &_active {
    border-bottom-color: transparent;
    box-shadow: 0 2px 0 #1890ff inset;
  }

  &_day {
    width: 68px;
    min-width: 60px;
    text-align: center;
    padding-right: 4px;
    padding-left: 4px;
  }

  &_project,
  &_task {
    min-width: 160px;
  }

  &_header {
    background: #fafafa;
  }

  &_total {
    text-align: right;
    width: 80px;
    background: #fafafa;
  }
}
</style>
