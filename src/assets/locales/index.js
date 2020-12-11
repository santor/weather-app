import { createI18n } from 'vue-i18n';
import de from './de';
const messages = {
  en: {
    couldNotFetch: 'The service might be temporarily unavailable.',
    error: 'Error',
    searchLocation: 'Search location',
    day_1: 'Monday',
    day_2: 'Tuesday',
    day_3: 'Wednesday',
    day_4: 'Thursday',
    day_5: 'Friday',
    day_6: 'Saturday',
    day_7: 'Sunday',
    day_abbr_1: 'Mon',
    day_abbr_2: 'Tue',
    day_abbr_3: 'Wed',
    day_abbr_4: 'Thu',
    day_abbr_5: 'Fri',
    day_abbr_6: 'Sat',
    day_abbr_7: 'Sun',
    clear: 'Clear sky',
    haze: 'Haze',
    few_clouds: 'Few clouds',
    scattered_clouds: 'Scattered clouds',
    broken_clouds: 'Broken clouds',
    overcast_clouds: 'Overcast clouds',
    rain: 'Rain',
    heavy_rain: 'heavy rain',
    heavy_rain_shower: 'heavy rain showers',
    snow: 'snow',
    snow_rain: 'sleet',
    fog: 'fog',
    heavy_snow: 'heavy snow',
    rain_shower_thunderstorm: 'shower rain, thunderstorm',
    snow_shower: 'shower snow',
    snow_shower_thunderstorm: 'shower snow, thunderstorm',
    snow_rain_shower: 'shower sleet',
    snow_rain_shower_thunderstorm: 'shower sleet, thunderstorm',
    sun_rain_shower: 'scattered clouds, shower rain',
    clouds_rain_shower: 'cloudy, shower rain',
    sun_rain_shower_thunderstorm: 'scattered clouds, shower rain, thunderstorm',
    clouds_rain_shower_thunderstorm: 'cloudy, shower rain, thunderstorm',
    sun_snow_shower: 'scattered clouds, light snow',
    clouds_snow_shower: 'cloudy, shower snow',
    sun_snow_shower_thunderstorm: 'scattered clouds, shower snow, thunderstorm',
    clouds_snow_shower_thunderstorm: 'cloudy, shower snow, thunderstorm',
    sun_snow_rain_shower: 'scattered clouds, light shower sleet',
    clouds_snow_rain_shower: 'cloudy, shower sleet',
    sun_snow_rain_shower_thunderstorm:
      'scattered clouds, shower sleet, thunderstorm',
    clouds_snow_rain_shower_thunderstorm: 'cloudy, shower sleet, thunderstorm',
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