import { createApp } from 'vue';
import i18n from './assets/locales';
import App from './App.vue';
import store from './store/index.js';

import '@/assets/styles/style.css';

createApp(App)
  .use(store)
  .use(i18n)
  .mount('#app');
