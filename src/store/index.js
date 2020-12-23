import { createStore } from 'vuex';
import errorModule from './modules/error.js';

//root store
export default createStore({
  strict: process.env.NODE_ENV === 'production',
  modules: {
    error: errorModule,
  },

  // addError(errorMessage){

  // }
});
