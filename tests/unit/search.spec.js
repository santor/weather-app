import Search from '@/components/Search';
import { mount } from '@vue/test-utils';
import i18n from '@/assets/locales';
import store from '@/store';
import Api from '@/lib/api';

describe('Search.vue', () => {
  const wrapper = mount(Search, {
    global: {
      plugins: [i18n, store], //need this so that the component can be mounted
    },
  });

  beforeAll(() => {
    //mock searchLocation
    Api.searchLocation = jest.fn().mockReturnValue([
      {
        id: 205,
        name: 'Muri bei Bern (BE)',
        lat: 46.933433532714844,
        lon: 7.499686241149902,
      },
      {
        id: 1452,
        name: 'Muri (AG)',
        lat: 47.271732330322266,
        lon: 8.338957786560059,
      },
      {
        id: 2260,
        name: 'Muriaux (JU)',
        lat: 47.23452377319336,
        lon: 6.996285915374756,
      },
      {
        id: 1908,
        name: 'Muri',
        lat: 47.24173355102539,
        lon: 8.360167503356934,
      },
    ]);
  });

  test('has empty message when searchTerm shorter than 2 letters', async () => {
    const search = await wrapper.vm.searchFunction('m');
    expect(search.message).toEqual('');
  });

  describe('returns correct array', () => {
    let search;
    beforeAll(async () => {
      search = await wrapper.vm.searchFunction('muri');
    });

    test('searchFunction has correct array length', () => {
      expect(search.result).toHaveLength(4);
    });

    test('commits location object on selection change', () => {
      const value = {
        id: 1452,
        name: 'Muri (AG)',
        lat: 47.271732330322266,
        lon: 8.338957786560059,
      };
      wrapper.vm.$options.watch.selectedOption.call(wrapper.vm, value);
      const locationName = store.state.location.name;
      const coords = store.state.location.coordinates;
      const latitude = coords.latitude;
      const longitude = coords.longitude;

      expect(locationName).toEqual(value.name);
      expect(latitude).toEqual(value.lat);
      expect(longitude).toEqual(value.lon);
    });
  });
});
