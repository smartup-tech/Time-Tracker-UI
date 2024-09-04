import { mount } from '@vue/test-utils';
import PasswordRequirements from './PasswordRequirements.vue';

describe('Password Requirements', () => {
  test('match snapshot', async () => {
    const wrapper = mount(PasswordRequirements);
    expect(wrapper.element).toMatchSnapshot();
  });
});
