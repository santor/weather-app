import { createI18n } from 'vue-i18n';
import de from './de';
const messages = {
  en: {
    couldNotFetch:
      'Could not fetch weather data. The service might be temporarily unavailable.',
    error: 'Error',
  },
  de: {
    ...de,
  },
};

export default createI18n({
  legacy: false, // use composition API
  locale: 'de',
  fallBackLocale: 'en',
  messages,
});
