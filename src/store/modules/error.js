export default {
  namespaced: true,
  state: {
    errorMessage: '',
  },

  getters: {
    hasError: (state) => state.errorMessage != '',
  },

  mutations: {
    addError(state, message) {
      state.errorMessage = message;
    },
    clearError(state) {
      state.errorMessage = '';
    },
  },
};
