import { shallowMount } from '@vue/test-utils';
import store from '@/store/index.js';
import ErrorAlert from '@/components/ErrorAlert';

describe('ErrorAlert.vue', () => {
  const wrapper = shallowMount(ErrorAlert, {
    global: {
      plugins: [store],
    },
  });

  test('displays error message', async () => {
    store.commit('error/addError', 'Error message');
    await wrapper.vm.$nextTick();
    const message = wrapper.get('[data-test="error-message"]');
    expect(message.text()).toEqual('Error message');
  });

  test('dismiss clears error', async () => {
    const dismissButton = wrapper.get('[data-test="error-dismiss"]');
    await dismissButton.trigger('click');
    //wait until the virtual dom updates
    await wrapper.vm.$nextTick();
    //assert event has been emitted
    const hasError = store.getters['error/hasError'];
    expect(hasError).toBe(false);
  });
});
