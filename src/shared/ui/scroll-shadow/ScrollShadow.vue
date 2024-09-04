<script lang="ts" setup>
import { onBeforeUnmount, reactive, ref } from 'vue';
import { useResizeObserver } from '@vueuse/core';

type Shadow = {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
};

const container = ref<HTMLElement>();

const shadow: Shadow = reactive({
  top: false,
  right: false,
  bottom: false,
  left: false,
});

const toggleShadow = () => {
  if (!container.value) {
    return;
  }

  const hasHorizontalScrollbar: boolean =
    container.value.clientWidth < container.value.scrollWidth;

  const hasVerticalScrollbar: boolean =
    container.value.clientHeight < container.value.scrollHeight;

  const scrolledFromLeft: number =
    container.value.offsetWidth + container.value.scrollLeft;

  const scrolledFromTop: number =
    container.value.offsetHeight + container.value.scrollTop;

  const scrolledToRight: boolean =
    scrolledFromLeft >= container.value.scrollWidth;
  const scrolledToLeft: boolean = container.value.scrollLeft === 0;

  const scrolledToTop: boolean = container.value.scrollTop === 0;
  const scrolledToBottom: boolean =
    scrolledFromTop >= container.value.scrollHeight;

  shadow.top = hasVerticalScrollbar && !scrolledToTop;
  shadow.right = hasHorizontalScrollbar && !scrolledToRight;
  shadow.bottom = hasVerticalScrollbar && !scrolledToBottom;
  shadow.left = hasHorizontalScrollbar && !scrolledToLeft;
};

const { stop: stopObserver } = useResizeObserver(container, toggleShadow);

onBeforeUnmount(() => {
  stopObserver();
});
</script>

<template>
  <div class="scroll-shadow">
    <div
      class="scroll-shadow__inner"
      ref="container"
      @scroll.passive="toggleShadow"
    >
      <slot />
      <span
        :class="[
          'scroll-shadow__shadow',
          'scroll-shadow__shadow_top',
          shadow.top && 'scroll-shadow__shadow_active',
        ]"
      />
      <span
        :class="[
          'scroll-shadow__shadow',
          'scroll-shadow__shadow_right',
          shadow.right && 'scroll-shadow__shadow_active',
        ]"
      />
      <span
        :class="[
          'scroll-shadow__shadow',
          'scroll-shadow__shadow_bottom',
          shadow.bottom && 'scroll-shadow__shadow_active',
        ]"
      />
      <span
        :class="[
          'scroll-shadow__shadow',
          'scroll-shadow__shadow_left',
          shadow.left && 'scroll-shadow__shadow_active',
        ]"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scroll-shadow {
  position: relative;
  overflow: hidden;

  &__inner {
    overflow: auto;
  }

  &__shadow {
    opacity: 0;
    position: absolute;
    transition: box-shadow 0.3s;
    content: '';
    pointer-events: none;

    &_top {
      top: 0;
      right: 0;
      left: -1px;
      height: 30px;
      box-shadow: inset 0 10px 8px -8px rgb(0 0 0 / 15%);
    }

    &_right {
      box-shadow: inset -10px 0 8px -8px rgb(0 0 0 / 15%);
      top: 0;
      right: 0;
      bottom: -1px;
      width: 30px;
    }

    &_bottom {
      bottom: 0;
      right: 0;
      left: -1px;
      height: 30px;
      box-shadow: inset 0 -10px 8px -8px rgb(0 0 0 / 15%);
    }

    &_left {
      top: 0;
      left: 0;
      bottom: -1px;
      width: 30px;
      box-shadow: inset 10px 0 8px -8px rgb(0 0 0 / 15%);
    }

    &_active {
      opacity: 1;
    }
  }
}
</style>
