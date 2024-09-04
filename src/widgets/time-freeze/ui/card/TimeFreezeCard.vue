<script lang="ts" setup>
import { computed, onBeforeMount, shallowRef, watch } from 'vue';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';
import { Card, Button } from 'ant-design-vue';
import Modal from 'ant-design-vue/es/modal';

import { useBoolean } from '@/shared/lib';
import { useTimeFreezeStore } from '@/store';

import { TimeFreezeForm } from '..';
import { DateFormat } from '@/constants';
import { FreezeRecord } from '@/types';

const {
  fetchLastFreezeRecord,
  fetchUnfreezeRecord,
  fetchFreezeRecords,
  freezeTime,
  unfreezeTime,
} = useTimeFreezeStore();
const { lastFreeze, unfreezeRecord, isLoading, freezeDates, sortedRecords } =
  storeToRefs(useTimeFreezeStore());

const [, { set: setHasLockScheduled }] = useBoolean(false);

const today = dayjs().startOf('day');

const confirmLock = (datesToFreeze: string[]) => {
  Modal.confirm({
    title: () => `Запланировать блокирови на ${datesToFreeze}?`,
    content: () =>
      `В указанные даты все часы по ${datesToFreeze} включительно будут заблокированы.`,
    okText: 'Да, запланировать',
    async onOk() {
      if (datesToFreeze.length) {
        await freezeTime(datesToFreeze);

        setHasLockScheduled(true);
      }
    },
  });
};

const handleUnlock = async () => {
  const formatedDate = dayjs(lastFreeze.value?.freezeDate).format(
    DateFormat.DAY_MONTH_YEAR
  );
  Modal.confirm({
    title: () => `Снять блокировку с ${formatedDate}?`,
    okText: 'Да, разблокировать',
    async onOk() {
      await unfreezeTime();
      await fetchFreezeRecords();
      await fetchUnfreezeRecord();
      await fetchLastFreezeRecord();
    },
  });
};

onBeforeMount(async () => {
  await fetchFreezeRecords();
  await fetchUnfreezeRecord();
  await fetchLastFreezeRecord();
});

const freezeRecords = shallowRef<string[]>([]);

watch(freezeDates, () => {
  freezeRecords.value = [...freezeDates.value];
});

const canUnfreeze = computed(() => {
  return unfreezeRecord.value === null && lastFreeze.value;
});

const getScheduledRecordText = (record: FreezeRecord) => {
  let statusText = '';
  if (record.status === 'WAITING') {
    statusText = '- ожидает';
  } else if (record.status === 'UN_FREEZE') {
    statusText = '- разблокирован';
  } else if (record.status === 'INTERRUPTED') {
    statusText = '- ошибка';
  }

  return `${dayjs(record.freezeDate).format(
    DateFormat.DAY_MONTH_YEAR
  )} ${statusText}`;
};
</script>

<template>
  <Card :bordered="false" :loading="isLoading" class="time-freeze">
    <div class="freeze-card-container">
      <TimeFreezeForm
        class="freeze-card-container__form"
        :disable-before="today"
        inclusive
        scheduled
        v-model:freeze-records="freezeRecords"
        @submit="confirmLock"
      />
      <div class="freeze-card-container__list">
        <h3>Запланированные блокировки</h3>
        <span
          v-if="sortedRecords.length === 0"
          class="freeze-card-container__list-info"
        >
          На данный момент нет ни одной запланированной блокировки.
        </span>
        <div v-else class="freeze-card-container__dates">
          <span v-for="(record, index) in sortedRecords" :key="index">
            {{ getScheduledRecordText(record) }}
          </span>
        </div>
      </div>
    </div>
    <Button @click="handleUnlock" type="primary" :disabled="!canUnfreeze"
      >Разблокировать последнюю блокировку</Button
    >
  </Card>
</template>

<style lang="scss">
.freeze-card-container {
  display: flex;

  &__form {
    width: 50%;
  }

  &__list {
    margin-left: auto;
    margin-right: auto;
    text-align: center;

    width: 50%;
  }

  &__dates {
    display: flex;
    flex-direction: column;
  }
}
</style>
