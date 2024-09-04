import { flushPromises, mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { usePositionStore } from '@/store';
import { nextTick } from 'vue';
import ArchivePosition from './ArchivePosition.vue';
import { ErrorCode } from '@/shared/lib';
import { UserRole } from '@/constants';
import { HTTPException } from '@/shared/exceptions';

describe('Archive Position', () => {
  afterEach(() => {
    document.getElementsByTagName('body')[0].innerHTML = '';
  });
  test('should show error modal', async () => {
    const pinia = createTestingPinia();
    const positionStore = usePositionStore(pinia);

    vi.mocked(positionStore.archivePosition).mockRejectedValue(
      new HTTPException(123, {
        errorCode: ErrorCode.NOT_PROCESSED_TRACK_UNITS_FOR_PROJECT,
        relatedEntities: [
          { archived: false, id: 123, roles: [UserRole.ROLE_USER] },
        ],
        errorMessage: '',
      })
    );

    const wrapper = mount(ArchivePosition, {
      global: {
        plugins: [pinia],
      },
      props: {
        positionId: 123,
      },
    });

    await flushPromises();
    await nextTick();

    await wrapper.find('.la-box').trigger('click');

    await flushPromises();
    await nextTick();

    document
      .querySelector('.ant-btn-primary')
      ?.dispatchEvent(new MouseEvent('click'));

    await flushPromises();
    await nextTick();

    expect(document.querySelector('.ant-modal-body')?.innerHTML).toContain(
      'Не удалось отправить должность в архив'
    );

    wrapper.unmount();
    await flushPromises();
    await nextTick();
  });

  test('should call archivePosition on click', async () => {
    const wrapper = mount(ArchivePosition, {
      global: {
        plugins: [createTestingPinia()],
      },
      props: {
        positionId: 123,
      },
    });

    const { archivePosition } = usePositionStore();

    await wrapper.find('.la-box').trigger('click');

    await flushPromises();
    await nextTick();

    document
      .querySelector('.ant-btn-primary')
      ?.dispatchEvent(new MouseEvent('click'));

    expect(archivePosition).toHaveBeenCalledWith(123);
  });
});
