import { createStore } from 'vuex';
import errorModule from './modules/error.js';
import locationModule from './modules/location.js';
//root store
export default createStore({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    error: errorModule,
    location: locationModule,
  },
});
