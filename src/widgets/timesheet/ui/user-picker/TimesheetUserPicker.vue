<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { Select } from 'ant-design-vue';

import { getFullName } from '@/shared/lib';
import { useTimesheetStore, useTimesheetUsersStore } from '@/store';

import type { Profile, User } from '@/types';

type UserOption = {
  label: string;
  value: number;
};

const { userId } = storeToRefs(useTimesheetStore());
const { setUserId } = useTimesheetStore();

const { availableUsers: users, isLoading } = storeToRefs(
  useTimesheetUsersStore()
);
const { fetchUsers } = useTimesheetUsersStore();

const options = computed<UserOption[]>(() =>
  users.value.map(({ id, firstName, lastName }: User | Profile) => ({
    label: getFullName({ firstName, lastName }),
    value: id,
  }))
);

const currentUserId = computed<number | undefined>({
  get: () => userId.value ?? undefined,
  set: (value: number | undefined) => setUserId(value),
});

const filterOption = (input: string, option: UserOption) =>
  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;

fetchUsers();
</script>

<template>
  <Select
    class="timesheet-user-picker"
    show-search
    :dropdown-match-select-width="false"
    :filter-option="filterOption"
    :loading="isLoading"
    :options="options"
    v-model:value="currentUserId"
  />
</template>

<style lang="scss" scoped>
.timesheet-user-picker {
  min-width: 120px;
  max-width: 180px;

  @include respond-to($bp-xs) {
    min-width: 160px;
    max-width: 200px;
  }

  @include respond-to($bp-md) {
    min-width: 200px;
    max-width: none;
  }
}
</style>
