import App from '@/App';
import { mount } from '@vue/test-utils';
import i18n from '@/assets/locales';
import Api from '@/lib/api';

describe('App.vue', () => {
  const wrapper = mount(App, {
    global: {
      plugins: [i18n],
    },
  });
  describe('Errors', () => {
    test('displays error alert', async () => {
      wrapper.vm.onErrorMessage('Test error');
      //wait until the vue virtual dom updates
      await wrapper.vm.$nextTick();
      const error = wrapper.find('[data-test="error-alert"]');
      expect(error.text()).toEqual('Test error');
    });

    test('removes error alert', async () => {
      wrapper.vm.clearError();
      await wrapper.vm.$nextTick();

      //error message empty
      const errorMessage = wrapper.vm.errorMessage;
      expect(errorMessage).toBe('');

      //error component removed
      const errorExists = wrapper.find('[data-test="error-alert"]').exists();
      expect(errorExists).toBe(false);
    });
  });

  describe('onLocationChange and current weather', () => {
    const locationData = {
      name: 'Bäern',
      lat: 23,
      lon: 2,
    };

    Api.getCurrentForecast = jest.fn().mockReturnValue(
      Promise.resolve({
        location: 'Bäern',
        temperature: '25.3',
        iconCode: '1',
      })
    );

    beforeAll(() => {
      wrapper.vm.onLocationChange(locationData);
    });

    test('updates location', () => {
      const loc = wrapper.find('[data-test="location"]');
      expect(loc.text()).toEqual('Bäern');
    });

    test('updates coordinates', () => {
      const coord = wrapper.vm.coordinates;
      expect(coord.latitude).toBe(23);
      expect(coord.longitude).toBe(2);
    });

    test('calls getCurrentForecast with correct arguments', () => {
      expect(Api.getCurrentForecast).toHaveBeenCalledWith(23, 2, 'Bäern');
    });

    test('has current temperature', () => {
      const temp = wrapper.find('[data-test="current"]');
      expect(temp.text()).toContain('25 °');
    });

    test('has current description', () => {
      const description = wrapper.find('[data-test="current"]');
      expect(description.text()).toContain('klar');
    });
  });
});
