<script lang="ts" setup>
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    icon: string;
    size?: 'small' | 'large' | 'middle';
  }>(),
  {
    size: 'middle',
  }
);

const className = computed(() => [
  'la',
  `la-${props.icon}`,
  `la_size_${props.size}`,
]);
</script>

<template>
  <i :class="className" />
</template>

<style lang="scss" scoped>
.la {
  &_size {
    &_small {
      font-size: 18px;
    }

    &_middle {
      font-size: 21px;
    }

    &_large {
      font-size: 24px;
    }
  }
}
</style>
