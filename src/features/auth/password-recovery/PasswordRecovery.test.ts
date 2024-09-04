import { mount } from '@vue/test-utils';
import PasswordRecovery from './PasswordRecovery.vue';
import { createTestingPinia } from '@pinia/testing';
import { useAuthStore } from '@/store';
import PasswordRecoveryForm from './ui/form/PasswordRecoveryForm.vue';

describe('Password Recovery', () => {
  test('onLoginSubmit was called with credentials', async () => {
    const wrapper = mount(PasswordRecovery, {
      global: {
        plugins: [createTestingPinia()],
      },
    });
    const testEmail = 'test@example.com';
    const email = wrapper.find('#form_item_email');
    await email.setValue(testEmail);

    expect(wrapper.html()).toContain('Я вспомнил пароль');

    const authStore = useAuthStore();
    wrapper.findComponent(PasswordRecoveryForm).vm.onSubmit?.();
    expect(authStore.requestPasswordRecovery).toHaveBeenCalledWith(testEmail);
  });
});
