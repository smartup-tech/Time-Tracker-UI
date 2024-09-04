import { VueWrapper, flushPromises, mount } from '@vue/test-utils';
import ResetPassword from './ResetPassword.vue';
import { createTestingPinia } from '@pinia/testing';
import { useAuthStore } from '@/store';

describe('Reset Password', () => {
  const submitForm = async (wrapper: VueWrapper, password = 'Test123') => {
    const passwordInput = wrapper.find('#form_item_password');
    await passwordInput.setValue(password);
    await wrapper.find('form').trigger('submit.prevent');
  };

  test('success', async () => {
    const wrapper = mount(ResetPassword, {
      global: {
        plugins: [createTestingPinia()],
      },
      props: {
        token: '123',
      },
    });
    const authStore = useAuthStore();
    expect(wrapper.html()).toContain('Сброс пароля');

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

  test('fail', async () => {
    const pinia = createTestingPinia();
    const authStore = useAuthStore(pinia);
    vi.mocked(authStore.resetPassword).mockRejectedValue(undefined);

    const wrapper = mount(ResetPassword, {
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
