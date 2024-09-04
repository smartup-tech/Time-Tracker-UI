<script lang="ts" setup>
import { computed } from 'vue';

import {
  hasLowerCaseLetters,
  hasNumbers,
  hasUpperCaseLetters,
} from '@/shared/lib';
import { LAIcon } from '@/shared/ui';

type Props = {
  password?: string;
};

type Rule = {
  isValid: boolean;
  text: string;
};

const MIN_LENGTH = 5;
const MAX_LENGTH = 30;

const props = defineProps<Props>();

const lengthOk = computed<boolean>(() => {
  const length = props.password ? String(props.password).length : 0;
  return length >= MIN_LENGTH && length <= MAX_LENGTH;
});

const spacesOk = computed<boolean>(() =>
  props.password ? !/\s/.test(props?.password) : true
);

const numbersOk = computed<boolean>(() =>
  props.password ? hasNumbers(props.password) : true
);

const upperCaseOk = computed<boolean>(() =>
  props.password ? hasUpperCaseLetters(props.password) : true
);

const lowerCaseOk = computed<boolean>(() =>
  props.password ? hasLowerCaseLetters(props.password, 2) : true
);

const withFeedback = computed<boolean>(() => Boolean(props.password));

const getIcon = (isOk: boolean): string =>
  props.password ? (isOk ? 'check-circle' : 'times-circle') : 'circle';

const rules = computed<Rule[]>(() => [
  {
    isValid: lengthOk.value,
    text: `Длина от ${MIN_LENGTH} до ${MAX_LENGTH} символов`,
  },
  {
    isValid: upperCaseOk.value,
    text: 'Минимум одна латинская заглавная буква',
  },
  {
    isValid: lowerCaseOk.value,
    text: 'Минимум две латинских строчных буквы',
  },
  {
    isValid: numbersOk.value,
    text: 'Минимум одна цифра',
  },
  {
    isValid: spacesOk.value,
    text: 'Без пробелов',
  },
]);
</script>

<template>
  <div
    :class="[
      'password-requirements',
      withFeedback && 'password-requirements_with-feedback',
    ]"
  >
    Требования к паролю:
    <ul class="password-requirements__list">
      <li
        v-for="(rule, index) in rules"
        :key="index"
        class="password-requirements__list-item"
      >
        <LAIcon
          v-if="withFeedback"
          :class="[
            'password-requirements__icon',
            rule.isValid
              ? 'password-requirements__icon_success'
              : 'password-requirements__icon_error',
          ]"
          :icon="getIcon(rule.isValid)"
          size="small"
        />
        {{ rule.text }}
      </li>
    </ul>
  </div>
</template>
<style lang="scss">
.password-requirements {
  &__list {
    margin: 8px 0 0;
    padding: 0;
  }

  &__list-item {
    position: relative;
    margin: 0 0 4px 20px;

    .password-requirements_with-feedback & {
      list-style: none;
    }
  }

  &__icon {
    position: absolute;
    left: -22px;
    top: 2px;

    &_success {
      color: var(--color-success);
    }

    &_error {
      color: var(--color-error);
    }
  }
}
</style>
