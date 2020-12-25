import Api from '@/lib/api';

//something like an enum
const State = { LOADING: 0, FAILURE: -1, SUCCESS: 1 };
Object.freeze(State);

export default {
  namespaced: true,
  state: {
    loadingState: State.LOADING,
    weather: {
      location: '',
      temperature: 0,
      iconCode: '',
    },
  },

  getters: {
    hasData: (state) => state.loadingState === State.SUCCESS,
  },

  mutations: {
    updateWeather(state, current) {
      state.weather = current;
    },

    updateState(state, loadingState) {
      state.loadingState = loadingState;
    },
  },

  actions: {
    async fetchCurrentWeather({ commit }, coords) {
      commit('updateState', State.LOADING);
      // TODO fix this it is really ugly
      const weather = await Api.getCurrentForecast(
        coords.latitude,
        coords.longitude
      ).catch((error) => {
        commit('updateState', State.FAILURE);
        throw Error(error);
      });

      if (weather) {
        commit('updateState', State.SUCCESS);
        commit('updateWeather', weather);
      }
    },
  },
};
