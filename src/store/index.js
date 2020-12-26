import { createStore } from 'vuex';
import errorModule from './modules/error.js';
import locationModule from './modules/location.js';
import currentModule from './modules/current.js';
import dailyModule from './modules/daily.js';
import hourlyModule from './modules/hourly.js';
//root store
export default createStore({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    error: errorModule,
    location: locationModule,
    current: currentModule,
    daily: dailyModule,
    hourly: hourlyModule,
  },
});
