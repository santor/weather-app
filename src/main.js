import { createApp } from 'vue';
import i18n from './assets/locales';
import App from './App.vue';

import '@/assets/styles/style.css';

createApp(App)
  .use(i18n)
  .mount('#app');
