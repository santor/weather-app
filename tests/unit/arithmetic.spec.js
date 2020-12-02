import { mount } from '@vue/test-utils';
import Arithmetic from '../../src/components/Arithmetic.vue';

/**
 * it's under unit directory, but actually these are not just unit tests
 */
describe('Arithmetic.vue', () => {
  //Inspect the raw component options
  it('has data', () => {
    expect(typeof Arithmetic.data).toBe('function');
  });

  //mount the component
  const wrapper = mount(Arithmetic);

  test('renders the correct markup', () => {
    expect(wrapper.html()).toContain('What is the sum of the two numbers?');
  });

  test('has a button', () => {
    expect(wrapper.find('button').exists()).toBe(true);
  });

  //it is exactly the same like test
  test('renders correctly with different data', async () => {
    wrapper.setData({ x1: 5, x2: 10 });
    await wrapper.vm.$nextTick(); // we have to await when setting reactive datas
    expect(wrapper.text()).toContain('10');
    // console.log(wrapper.text());
  });

  test('button click without correct sum', () => {
    expect(wrapper.vm.message).toBe('');
    const button = wrapper.find('button');
    button.trigger('click');
    expect(wrapper.vm.message).toBe('TRY AGAIN');
  });

  test('button click with correct sum', () => {
    wrapper.setData({ guess: '15' });
    const button = wrapper.find('button');
    button.trigger('click');
    expect(wrapper.vm.message).toBe('SUCCESS!');
  });

  // wrapper.unmount();
});
