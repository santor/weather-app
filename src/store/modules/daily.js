import Api from '@/lib/api';
import { State } from '@/utils/utils';

export default {
  namespaced: true,

  state: {
    loadingState: State.LOADING,
    days: [],
  },

  mutations: {
    updateDays(state, days) {
      state.days = days;
    },
    updateState(state, loadState) {
      state.loadingState = loadState;
    },
  },

  actions: {
    fetchSevenDaysForecast({ commit }, coordinates) {
      commit('updateState', State.LOADING);
      Api.get7daysForecast(coordinates.latitude, coordinates.longitude)
        .then((weather) => {
          commit('updateState', State.SUCCESS);
          commit('updateDays', weather);
        })
        .catch((error) => {
          commit('updateState', State.FAILURE);
          throw Error(error);
        });
    },
  },
};
