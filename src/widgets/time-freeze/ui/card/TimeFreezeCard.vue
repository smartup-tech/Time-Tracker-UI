<script lang="ts" setup>
import { computed, onBeforeMount, shallowRef, watch } from 'vue';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';
import { Card, Button } from 'ant-design-vue';
import Modal from 'ant-design-vue/es/modal';
import { h } from 'vue';

import { useBoolean } from '@/shared/lib';
import { useTimeFreezeStore } from '@/store';

import { TimeFreezeForm } from '..';
import { DateFormat } from '@/constants';
import { FreezeRecord } from '@/types';

import union from 'lodash/union';
import without from 'lodash/without';

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

const confirmPlanLock = (
  datesToFreeze: string[],
  moreDatesToFreeze: string[]
) => {
  Modal.confirm({
    title: () => `Запланировать блокировки?`,
    content: () => {
      return h('div', [
        h('span', 'В указанные даты все часы по'),
        h(
          'ul',
          { class: 'no-space-after' },
          moreDatesToFreeze.map((text) => {
            return h('li', text);
          })
        ),
        h('span', 'включительно будут заблокированы.'),
      ]);
    },
    okText: 'Да, запланировать',
    async onOk() {
      const totalDates = union(datesToFreeze, moreDatesToFreeze);
      if (totalDates.length) {
        await freezeTime(totalDates).then(() => {
          // Update the state if a past date is selected
          const today = dayjs().startOf('day');
          if (totalDates.some((date) => dayjs(date).isBefore(today))) {
            fetchFreezeRecords();
            fetchLastFreezeRecord();
            fetchUnfreezeRecord();
          }
        });
        setHasLockScheduled(true);
        selectedDates.value = [];
      }
    },
  });
};

const confirmPlanUnlock = (
  datesToFreeze: string[],
  lessDatesToFreeze: string[]
) => {
  Modal.confirm({
    title: () => `Отменить запланированные блокировки?`,
    content: () => {
      return h('div', [
        h('span', 'Запланированные на следующие даты блокировки'),
        h(
          'ul',
          { class: 'no-space-after' },
          lessDatesToFreeze.map((text) => {
            return h('li', text);
          })
        ),
        h('span', 'будут отменены.'),
      ]);
    },
    okText: 'Да, отменить',
    async onOk() {
      const totalDates = without(datesToFreeze, ...lessDatesToFreeze);
      await freezeTime(totalDates);
      setHasLockScheduled(totalDates.length > 0);
      selectedDates.value = [];
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
const selectedDates = shallowRef<string[]>([]);

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
        scheduled
        v-model:freeze-records="freezeRecords"
        v-model:selected-dates="selectedDates"
        @submit-plan-freeze="confirmPlanLock"
        @submit-plan-unfreeze="confirmPlanUnlock"
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

.ant-modal-confirm-content {
  .no-space-after {
    margin-bottom: 0;
  }
}
</style>
