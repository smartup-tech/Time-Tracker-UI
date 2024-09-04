import { VueWrapper, flushPromises, mount } from '@vue/test-utils';
import SetPassword from './SetPassword.vue';
import { createTestingPinia } from '@pinia/testing';
import { useAuthStore } from '@/store';

describe('Set Password', () => {
  const submitForm = async (wrapper: VueWrapper, password = 'Test123') => {
    const passwordInput = wrapper.find('#form_item_password');
    await passwordInput.setValue(password);
    await wrapper.find('form').trigger('submit.prevent');
  };

  test('successfully set password', async () => {
    const wrapper = mount(SetPassword, {
      global: {
        plugins: [createTestingPinia],
      },
      props: {
        token: '123',
      },
    });
    const authStore = useAuthStore();
    expect(wrapper.html()).toContain('Установка пароля');

    await submitForm(wrapper);

    await flushPromises();
    expect(authStore.resetPassword).toHaveBeenCalledWith({
      newPassword: 'Test123',
      token: '123',
    });
    expect(wrapper.html()).toContain(
      'Новый пароль сохранен. Нажмите «Продолжить» для входа.'
    );
  });

  test('unsuccessfully set password', async () => {
    const pinia = createTestingPinia();
    const authStore = useAuthStore(pinia);
    vi.mocked(authStore.resetPassword).mockRejectedValue(undefined);

    const wrapper = mount(SetPassword, {
      global: {
        plugins: [pinia],
      },
      props: {
        token: '123',
      },
    });

    await submitForm(wrapper);
    await flushPromises();

    expect(wrapper.html()).toContain('Не удалось установить новый пароль.');
  });
});
