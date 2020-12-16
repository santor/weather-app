import { shallowMount } from '@vue/test-utils';
import Location from '../../src/components/Location.vue';

describe('Location.vue', () => {
  //shallowMount() - component mounted without children
  const wrapper = shallowMount(Location, {
    props: {
      locationName: 'Gümligen',
    },
  });

  test('has a h1 title', () => {
    expect(wrapper.find('h1').exists()).toBe(true);
  });

  test('displays correct location name in the title', () => {
    expect(wrapper.find('h1').text()).toEqual('Gümligen');
  });
});
