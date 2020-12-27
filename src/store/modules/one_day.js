import Api from '@/lib/api';
import { getWeatherIconName, State, zeroPad } from '@/utils/utils';

export default {
  namespaced: true,

  state: {
    loadingState: State.LOADING,
    hourly: [],
  },
  mutations: {
    updateHours(state, hours) {
      state.hourly = hours;
    },
    updateState(state, loadState) {
      state.loadingState = loadState;
    },
  },

  actions: {
    async fetchHourlyForecast({ commit }, coordinates) {
      commit('updateState', State.LOADING);
      await Api.get24HoursForecast(coordinates.latitude, coordinates.longitude)
        .then((hourly) => {
          hourly.forEach((item) => {
            const icon = getWeatherIconName(item.icon);
            item.icon = icon ? icon : item.icon;
            item.hours = `${zeroPad(item.hours)}:00`;
            item.time = parseInt(item.time) % 12;
          });
          commit('updateState', State.SUCCESS);
          commit('updateHours', hourly);
        })
        .catch((error) => {
          commit('updateSate', State.FAILURE);
          throw Error(error);
        });
    },
  },
};
