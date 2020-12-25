import LocalStorage from '@/lib/local_storage.js';
import Api from '@/lib/api.js';

const NAMESPACE = 'location';
const SET_BY_ID = 'setLocationById';
const SET_SEARCH_RESULT = 'setSearchResult';
const SEARCH_FOR_LOCATION = 'searchForLocation';
const CLEAR_LOCATION_NAME = 'clearLocationName';
const UPDATE_LOCATION_NAME = 'updateLocationName';
const UPDATE_COORDINATES = 'updateCoordinates';
function prependNamespaceTo(funcName) {
  return `${NAMESPACE}/${funcName}`;
}
export const LOCATION_SET_BY_ID = prependNamespaceTo(SET_BY_ID);
export const LOCATION_SEARCH = prependNamespaceTo(SEARCH_FOR_LOCATION);
export const LOCATION_CLEAR_NAME = prependNamespaceTo(CLEAR_LOCATION_NAME);
export const LOCATION_UPDATE_NAME = prependNamespaceTo(UPDATE_LOCATION_NAME);
export const LOCATION_UPDATE_COORDINATES = prependNamespaceTo(
  UPDATE_COORDINATES
);

export default {
  namespaced: true,

  state: {
    name: LocalStorage.getLastLocation(),
    coordinates: {
      latitude: LocalStorage.getLatitude(),
      longitude: LocalStorage.getLongitude(),
    },
    suggestions: [],
  },

  getters: {
    known: (state) => state.name != '',
  },

  mutations: {
    [CLEAR_LOCATION_NAME](state) {
      state.name = '';
    },
    [UPDATE_LOCATION_NAME](state, name) {
      state.name = name;
    },
    [UPDATE_COORDINATES](state, coordinates) {
      state.coordinates = coordinates;
    },

    [SET_SEARCH_RESULT](state, results) {
      state.suggestions = results;
    },
  },

  actions: {
    async [SEARCH_FOR_LOCATION]({ commit }, searchTerm) {
      console.assert(searchTerm.length >= 2);
      const result = await Api.searchLocation(searchTerm);
      if (result) {
        commit(SET_SEARCH_RESULT, result);
      } else {
        commit(SET_SEARCH_RESULT, []);
      }
    },

    [SET_BY_ID]({ state, commit }, locationId) {
      const location = state.suggestions.find(
        (location) => location.id === locationId
      );

      if (location) {
        commit(UPDATE_COORDINATES, {
          latitude: location.lat,
          longitude: location.lon,
        });
        commit(UPDATE_LOCATION_NAME, location.name);
      }
    },
  },
};
