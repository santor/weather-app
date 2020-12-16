import { shallowMount } from '@vue/test-utils';
import ErrorAlert from '@/components/ErrorAlert';

describe('ErrorAlert.vue', () => {
  const wrapper = shallowMount(ErrorAlert, {
    props: { message: 'Error message' },
  });

  test('displays error message', () => {
    const message = wrapper.get('[data-test="error-message"]');
    expect(message.text()).toEqual('Error message');
  });

  test('emits dismiss', async () => {
    const dismissButton = wrapper.get('[data-test="error-dismiss"]');
    await dismissButton.trigger('click');
    //wait until the virtual dom updates
    await wrapper.vm.$nextTick();
    //assert event has been emitted
    expect(wrapper.emitted('dismiss')).toBeTruthy();
  });
});
