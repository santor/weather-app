import LocalStorage from '@/lib/local_storage.js';

export default {
  namespaced: true,

  state: {
    locationName: LocalStorage.getLastLocation(),
    coordinates: {
      latitude: LocalStorage.getLatitude(),
      longitude: LocalStorage.getLongitude(),
    },
  },

  mutations: {
    setLocationName(state, name) {
      LocalStorage.saveCurrentLocation(name);
      state.locationName = name;
    },

    setCoordinates(state, coords) {
      state.coordinates = coords;
    },
  },
};
