<script setup lang="ts">
import { computed, onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { List, Skeleton, Switch, Typography } from 'ant-design-vue';

import { Days } from '@/constants';
import { useNotificationSettingsStore } from '@/store';

const { fetchSchedule, setSchedule } = useNotificationSettingsStore();
const { isLoading, schedule } = storeToRefs(useNotificationSettingsStore());

const options = Days.map((value: string, index: number) => ({
  text: value,
  value: index + 1,
}));

const days = computed<number[]>(() => schedule.value.days);

const toggleOption = async (value: number) => {
  const index = days.value.indexOf(value);

  if (index >= 0) {
    await setSchedule({
      ...schedule.value,
      days: [...days.value.slice(0, index), ...days.value.slice(index + 1)],
    });
  } else {
    await setSchedule({ ...schedule.value, days: [...days.value, value] });
  }
};

const isChecked = (value: number) => days.value.includes(value);

onBeforeMount(async () => await fetchSchedule());
</script>

<template>
  <div class="notification-settings">
    <Typography.Title class="notification-settings__title" :level="5">
      Периодические уведомления
    </Typography.Title>
    <Typography.Paragraph class="notification-settings__subtitle">
      Выберите дни, в которые вам удобно получать периодические уведомления
    </Typography.Paragraph>

    <List :split="false" size="small">
      <List.Item
        v-for="option in options"
        :key="option.value"
        class="notification-settings__item"
      >
        <Skeleton
          active
          :loading="isLoading"
          :paragraph="{ rows: 1, width: '100%' }"
          :title="false"
          size
        >
          {{ option.text }}
          <Switch
            size="small"
            :checked="isChecked(option.value)"
            @change="toggleOption(option.value)"
          />
        </Skeleton>
      </List.Item>
    </List>
  </div>
</template>

<style lang="scss" scoped>
.notification-settings {
  padding: 8px 0;

  @include respond-to($bp-sm) {
    padding: 8px;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
  }

  &__subtitle {
    font-size: 13px;
    font-style: italic;
    line-height: 1.3;
    color: var(--color-text-muted);
  }

  &__title {
    font-size: 14px;
    margin-bottom: 4px;
  }
}
</style>
