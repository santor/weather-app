import { shallowMount } from '@vue/test-utils';
import Location from '@/components/Location.vue';
import store from '@/store/index.js';

describe('Location.vue', () => {
  //shallowMount() - component mounted without children
  const wrapper = shallowMount(Location, {
    global: {
      plugins: [store],
    },
  });

  test('has a h1 title', () => {
    expect(wrapper.find('h1').exists()).toBeTruthy();
  });

  test('displays correct location name in the title', async () => {
    store.commit('location/setLocationName', 'Gümligen');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('h1').text()).toEqual('Gümligen');
  });
});
