import Current from '@/components/Current';
import { shallowMount } from '@vue/test-utils';
import i18n from '@/assets/locales';

//Mock the whole Date class with a fixed date instance
let realDate;
const currentDate = new Date('2020-12-14T14:32:00');
realDate = Date;
global.Date = class extends Date {
  constructor(date) {
    if (date) {
      return super(date);
    }

    return currentDate;
  }
};

describe('Current.vue', () => {
  const wrapper = shallowMount(Current, {
    global: {
      plugins: [i18n],
    },
    props: {
      temperature: 0.6,
      description: 'clear',
    },
  });

  test('has rounded temperature', () => {
    const temp = wrapper.find('[data-test="temperature"]');
    expect(temp.text()).toBe('1');
  });

  test('has description', () => {
    const description = wrapper.find('[data-test="description"]');
    expect(description.text()).toBe('clear');
  });

  test('displays correct hour and minute', () => {
    const time = wrapper.find('[data-test="time"]');
    expect(time.text()).toBe('14:32');
  });
  test('displays correct day', () => {
    const day = wrapper.find('[data-test="day"]');
    expect(day.text()).toBe('Montag');
  });
});

//cleanup
global.Date = realDate;
