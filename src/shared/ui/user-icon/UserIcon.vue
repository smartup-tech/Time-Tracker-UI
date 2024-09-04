<script lang="ts" setup>
import { computed } from 'vue';

import {
  getGravatarUrl,
  getInitials,
  getEmailMd5,
  getProfileColors,
} from '@/shared/lib';

import type { PersonalData } from '@/types';

const props = withDefaults(
  defineProps<{
    profile: PersonalData | null;
    size?: number;
  }>(),
  {
    size: 32,
  }
);

const pxSize = computed<string>(() => `${props.size}px`);
const fontSize = computed<string>(
  () => `${props.size / (1.3 * Math.max(initials.length, 2))}px`
);

const url = computed<string>(() =>
  props.profile ? getGravatarUrl(props.profile?.email) : ''
);

const initials = getInitials(props.profile);

const { color, background } = getProfileColors(
  getEmailMd5(props.profile?.email)
);
</script>

<template>
  <div class="user-icon">
    <span class="user-icon__initials">{{ initials }}</span>
    <img class="user-icon__image" :src="url" alt="" />
  </div>
</template>

<style lang="scss" scoped>
.user-icon {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: v-bind(pxSize);
  height: v-bind(pxSize);
  overflow: hidden;
  border-radius: 50%;
  background: v-bind(background);

  &__initials {
    font-size: v-bind(fontSize);
    font-weight: 700;
    text-transform: uppercase;
    color: v-bind(color);
  }

  &__image {
    position: absolute;
    width: calc(100% + 2px);
    top: 0;
    left: 0;
  }
}
</style>
