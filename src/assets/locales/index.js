import { createI18n } from 'vue-i18n';
import de from './de';
const messages = {
  en: {
    couldNotFetch: 'The service might be temporarily unavailable.',
    error: 'Error',
    searchLocation: 'Search for a location',
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
