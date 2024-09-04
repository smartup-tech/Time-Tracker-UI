<script lang="ts" setup>
import { computed, onBeforeMount, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputPassword,
  RadioGroup,
  RadioGroupProps,
  Select,
  SelectProps,
  Space,
  Tooltip,
} from 'ant-design-vue';
import { breakpointsAntDesign, useBreakpoints } from '@vueuse/core';

import { userRoles, UserRole, EMAIL_MAX_LENGTH } from '@/constants';
import { LAIcon, PasswordRequirements } from '@/shared/ui';
import {
  ErrorCode,
  Errors,
  useBoolean,
  useLocaleState,
  useRemoteValidation,
  validateLowerCaseLetters,
  validateNumberAmount,
  validateUpperCaseLetters,
} from '@/shared/lib';
import { usePositionStore } from '@/store';

import type { FormInstance, Rule } from 'ant-design-vue/lib/form';
import type { CreateUser, Position, UpdateUser } from '@/types';

type Props = {
  userId?: number;
  initialData?: CreateUser | UpdateUser;
  submit: (
    model: CreateUser | UpdateUser,
    keepEditing: boolean
  ) => Promise<void>;
};

const props = defineProps<Props>();
const emit = defineEmits(['cancel', 'submit', 'change']);

const breakpoints = useBreakpoints(breakpointsAntDesign);
const sm = breakpoints.smaller('sm');

const locale = useLocaleState();
const { fetchActive: fetchPositions } = usePositionStore();
const { activePositions: positions } = storeToRefs(usePositionStore());

const form = ref<FormInstance>();
const keepEditing = ref(false);
const withPassword = ref(false);
const [isLoading, { set: setIsLoading }] = useBoolean(false);

const positionOptions = computed<SelectProps['options']>(() =>
  positions.value
    .filter(({ archived }: Position) => !archived)
    .map(({ id, name }: Position) => ({
      key: id,
      label: name,
      value: id,
    }))
    .sort((a, b) =>
      a.label.localeCompare(b.label, locale.value, { numeric: true })
    )
);

const model = ref<CreateUser | UpdateUser>({
  firstName: '',
  lastName: '',
  middleName: '',
  email: '',
  roles: ['ROLE_USER'],
  positionId: undefined,
  ...props.initialData,
});

const rules = computed<Record<string, Rule[]>>(() => ({
  firstName: [{ required: true, message: 'Введите имя', whitespace: true }],
  lastName: [{ required: true, message: 'Введите фамилию', whitespace: true }],
  email: [
    {
      required: true,
      message: 'Введите адрес электронной почты',
      whitespace: true,
    },
    { type: 'email', message: 'Введите корректный адрес электронной почты' },
    {
      message: Errors[ErrorCode.NOT_UNIQUE_USER_NAME],
      validator: async (rule: Rule) => {
        if (error.value === ErrorCode.NOT_UNIQUE_USER_NAME) {
          return Promise.reject(rule.message);
        }

        return Promise.resolve();
      },
    },
  ],
  positionId: [
    {
      required: true,
      message: 'Выберите должность',
    },
  ],
  ...(withPassword.value
    ? {
        password: [
          {
            required: withPassword.value,
            message: 'Введите пароль',
            whitespace: true,
          },
          {
            validator: validateNumberAmount(),
          },
          {
            validator: validateUpperCaseLetters(),
          },
          {
            validator: validateLowerCaseLetters(2),
          },
        ],
      }
    : {}),
}));

const { error, resetError, submit } = useRemoteValidation(
  (model: CreateUser | UpdateUser) => props.submit(model, keepEditing.value),
  {
    onError: () => form.value?.validateFields(),
  }
);

const onSubmit = async (_keepEditing: boolean) => {
  keepEditing.value = _keepEditing;

  setIsLoading(true);

  try {
    await submit(model.value);
  } finally {
    setIsLoading(false);
  }
};

const onCancel = () => emit('cancel');

const role = computed({
  get: () => model.value.roles?.[0] || 'ROLE_USER',
  set: (value) =>
    (model.value = {
      ...model.value,
      roles: value ? [value] : [],
    }),
});

const roleOptions: RadioGroupProps['options'] = Object.values(UserRole).map(
  (value) => ({
    label: userRoles[value],
    value,
  })
);

watch(
  () => props.initialData,
  (value) =>
    (model.value = {
      ...model.value,
      ...value,
    }),
  { deep: true }
);

watch(
  () => model.value.email,
  () => {
    if (error.value) {
      resetError();
      form.value?.clearValidate();
    }
  }
);

watch(
  () => model.value,
  () => emit('change', model.value),
  { deep: true }
);

onBeforeMount(async () => {
  await fetchPositions();
});
</script>

<template>
  <Form
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 18 }"
    :model="model"
    :colon="false"
    :rules="rules"
    ref="form"
    hide-required-mark
    label-align="left"
    autocomplete="off"
    @finish="() => onSubmit(false)"
  >
    <Form.Item
      name="firstName"
      :auto-link="true"
      label="Имя"
      :rules="rules.firstName"
    >
      <Input v-model:value="model.firstName" size="large" />
    </Form.Item>
    <Form.Item name="middleName" label="Отчество">
      <Input
        placeholder="не обязательно"
        size="large"
        v-model:value="model.middleName"
      />
    </Form.Item>
    <Form.Item name="lastName" label="Фамилия" :rules="rules.lastName">
      <Input v-model:value="model.lastName" size="large" />
    </Form.Item>
    <Form.Item name="email" label="Эл. почта" :rules="rules.email">
      <Input
        :maxlength="EMAIL_MAX_LENGTH"
        type="email"
        size="large"
        v-model:value.trim="model.email"
      >
        <template #suffix>
          <Tooltip
            v-if="props.userId"
            title="При изменении эл. почты все текущие сессии сотрудника будут закрыты."
          >
            <LAIcon class="email-warning" icon="exclamation-triangle" />
          </Tooltip>
        </template>
      </Input>
    </Form.Item>
    <Form.Item name="positionId" label="Должность" :rules="rules.positionId">
      <Select
        :options="positionOptions"
        size="large"
        v-model:value="model.positionId"
      />
    </Form.Item>
    <Form.Item name="role" label="Роль">
      <RadioGroup
        :options="roleOptions"
        v-model:value="role"
        :style="{ display: 'grid', gap: '8px' }"
      />
    </Form.Item>

    <Form.Item
      :wrapper-col="!sm ? { span: 18, offset: 6 } : undefined"
    >
      <Checkbox v-model:checked="withPassword">{{ !props.userId ? 'Установить пароль' : 'Обновить пароль' }}</Checkbox>
    </Form.Item>
    <template v-if="withPassword">
      <Form.Item name="password" label="Пароль" :rules="rules.password">
        <InputPassword
          autocomplete="new-password"
          size="large"
          v-model:value.trim="model.password"
        />
      </Form.Item>
      <Form.Item :wrapper-col="!sm ? { span: 16, offset: 6 } : undefined">
        <PasswordRequirements :password="model.password" />
      </Form.Item>
    </template>
    <Form.Item
      class="form__buttons"
      :wrapper-col="!sm ? { span: 18, offset: 6 } : undefined"
    >
      <Space :wrap="true">
        <Button
          :disabled="isLoading"
          :loading="isLoading && !keepEditing"
          type="primary"
          html-type="submit"
        >
          Сохранить
        </Button>
        <template v-if="!props.userId">
          <Button
            :disabled="isLoading"
            :loading="isLoading && keepEditing"
            @click="() => onSubmit(true)"
          >
            Сохранить и добавить в проекты
          </Button>
        </template>
        <Button @click="onCancel">Отмена</Button>
      </Space>
    </Form.Item>
  </Form>
</template>

<style lang="scss" scoped>
.form {
  &__buttons {
    margin: 0;
    padding-top: 8px;
  }
}

.email-warning {
  vertical-align: middle;
  color: var(--color-warning);
}
</style>
