import { flushPromises, mount } from '@vue/test-utils';
import DeleteCalendarDay from './DeleteCalendarDay.vue';
import { createTestingPinia } from '@pinia/testing';
import { useProductionCalendarStore } from '@/store';
import { nextTick } from 'vue';
import { ProductionCalendarDayStatus } from '@/types/calendar';

describe('Reset Password', () => {
  test('delete day', async () => {
    const wrapper = mount(DeleteCalendarDay, {
      global: {
        plugins: [createTestingPinia],
      },
      props: {
        item: {
          day: '2024-07-12',
          id: 123,
          status: ProductionCalendarDayStatus.WORK_DAY,
          hours: 8,
        },
      },
    });
    const { deleteProductionCalendarDay } = useProductionCalendarStore();
    wrapper.find('i').trigger('click');
    await flushPromises();
    await nextTick();
    expect(!!document.querySelector('.ant-modal-root')).toBeTruthy();

    document
      .querySelector('.ant-modal-root .ant-btn-primary')
      ?.dispatchEvent(new Event('click'));
    expect(deleteProductionCalendarDay).toHaveBeenCalledWith({
      day: '2024-07-12',
      hours: 8,
      id: 123,
      status: 'WORK_DAY',
    });
  });
});
