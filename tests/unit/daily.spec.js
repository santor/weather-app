import Daily from '@/components/Daily';
import { shallowMount } from '@vue/test-utils';
import i18n from '@/assets/locales';
import Api from '@/lib/api';

describe('Daily.vue', () => {
  const wrapper = shallowMount(Daily, {
    global: {
      plugins: [i18n],
    },
    props: {
      coordinates: {
        latitude: 46.933433532714844,
        longitude: 7.499686241149902,
      },
    },
  });

  beforeAll(() => {
    Api.get7daysForecast = jest
      .fn()
      .mockReturnValueOnce(Promise.reject(Error('Test error')))
      .mockReturnValue(
        Promise.resolve([
          { dayOfWeek: 4, tempAvg: 4, iconCode: '3' },
          { dayOfWeek: 5, tempAvg: 4, iconCode: '3' },
          { dayOfWeek: 6, tempAvg: 3, iconCode: '3' },
          { dayOfWeek: 0, tempAvg: 3, iconCode: '4' },
          { dayOfWeek: 1, tempAvg: 4, iconCode: '3' },
          { dayOfWeek: 2, tempAvg: 6, iconCode: '3' },
          { dayOfWeek: 3, tempAvg: 7, iconCode: '4' },
        ])
      );
  });

  beforeEach(async () => {
    await wrapper.vm.getSevenDayForecast();
  });

  test('emits fetchError', () => {
    expect(wrapper.emitted('fetchError')).toBeTruthy();
    expect(wrapper.emitted('fetchError')[0][0]).toEqual(
      'Der Dienst ist möglicherweise vorübergehend nicht verfügbar.'
    );
  });

  test('loads days correctly', () => {
    const daysArr = wrapper.vm.days;
    daysArr.forEach((item) => {
      const hasField =
        item.dayOfWeek != undefined &&
        item.tempAvg != undefined &&
        item.iconCode != undefined;
      expect(hasField).toBeTruthy();
    });
  });

  test('displays all days', () => {
    const days = wrapper.findAll('[data-test="day"]');
    expect(days).toHaveLength(7);
  });

  test('is Wednesday', () => {
    const lastElement = wrapper.findAll('[data-test="day"]')[6];
    expect(lastElement.text()).toContain('Mi');
  });

  test('displays temperature', () => {
    const dayTemperature = wrapper.find('[data-test="temp-0"]');
    expect(dayTemperature.text()).toEqual('3°');
  });

  test('displays day abbreviation', () => {
    const dayAbbr = wrapper.find('[data-test="day-5"]');
    expect(dayAbbr.text()).toEqual('Fr');
  });
});
