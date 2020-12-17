import Hourly from '@/components/Hourly';
import { shallowMount } from '@vue/test-utils';
import i18n from '@/assets/locales';
import Api from '@/lib/api';

describe('Hourly.vue', () => {
  const wrapper = shallowMount(Hourly, {
    global: {
      plugins: [i18n], //need this so that the component can be mounted
    },
    props: {
      coordinates: {
        // Muri bei Bern
        latitude: 46.933433532714844,
        longitude: 7.499686241149902,
      },
    },
  });

  beforeAll(() => {
    Api.get24HoursForecast = jest
      .fn()
      .mockReturnValueOnce(
        Promise.resolve([
          { hours: 1, temperature: 0, icon: '-19' },
          { hours: 4, temperature: 0, icon: '-19' },
          { hours: 7, temperature: 0, icon: '-19' },
          { hours: 10, temperature: 0, icon: '3' },
          { hours: 13, temperature: 1, icon: '3' },
          { hours: 16, temperature: 1, icon: '3' },
          { hours: 19, temperature: 0, icon: '3' },
          { hours: 22, temperature: 0, icon: '-3' },
        ])
      )
      .mockReturnValueOnce(Promise.reject(Error('Network error')));
  });

  test('loads correctly', async () => {
    await wrapper.vm.getHoursForecast();
    const hourly = wrapper.findAll('[data-test="hourly"]');
    expect(hourly).toHaveLength(8);

    const thirdElement = hourly[2];
    expect(thirdElement.text()).toEqual('07:000°');

    const hour = wrapper.find('[data-test="hour-13:00"]');
    expect(hour.text()).toEqual('13:00');

    const temp = wrapper.find('[data-test="temperature-16:00"]');
    expect(temp.text()).toEqual('1°');
  });

  test('emits fetchError', async () => {
    await wrapper.vm.getHoursForecast();

    expect(wrapper.emitted('fetchError')).toBeTruthy();
  });
});
