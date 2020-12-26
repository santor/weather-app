import App from '@/App';
import { mount } from '@vue/test-utils';
import i18n from '@/assets/locales';
import store from '@/store/index.js';
import Api from '@/lib/api';

describe('App.vue', () => {
  const wrapper = mount(App, {
    global: {
      plugins: [i18n, store],
    },
  });
  describe('Errors', () => {
    test('displays error alert', async () => {
      store.commit('error/addError', 'Test error');
      //wait until the vue virtual dom updates
      await wrapper.vm.$nextTick();
      const error = wrapper.find('[data-test="error-alert"]');
      expect(error.text()).toEqual('Test error');
    });

    test('removes error alert', async () => {
      store.commit('error/clearError');
      await wrapper.vm.$nextTick();

      //error component removed
      const errorExists = wrapper.find('[data-test="error-alert"]').exists();
      expect(errorExists).toBe(false);
    });
  });

  describe('on location change', () => {
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
      store.commit('location/updateLocationName', locationData.name);
      store.commit('location/updateCoordinates', {
        latitude: locationData.lat,
        longitude: locationData.lon,
      });
    });

    test('updates location', () => {
      const loc = wrapper.find('[data-test="location"]');
      expect(loc.text()).toEqual('Bäern');
    });

    test('updates coordinates', () => {
      const coord = store.state.location.coordinates;
      expect(coord.latitude).toBe(23);
      expect(coord.longitude).toBe(2);
    });

    test('calls getCurrentForecast with correct arguments', () => {
      expect(Api.getCurrentForecast).toHaveBeenCalledWith(23, 2);
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
