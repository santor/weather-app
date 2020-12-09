<template>
  <div class="content flex-5 p-8 md:p-16 xl:p-32">
    <transition name="fade">
      <ErrorAlert
        v-if="errorMessage != ''"
        @dismiss="clearError"
        :message="errorMessage"
      />
    </transition>
    <header>
      <div class="flex flex-row justify-between">
        <Location class="self-center" :locationName="locationName" />
        <Search @latLonChange="onLocationChange" />
      </div>
    </header>

    <main>
      <Current />
      <Daily />
    </main>
  </div>
  <aside class="bg-white dark:bg-gray-800 flex-2 p-8 md:p-16 xl:p-32">
    <Hourly />
  </aside>
</template>

<script>
  import Location from '@/components/Location';
  import Hourly from '@/components/Hourly';
  import Current from '@/components/Current';
  import Daily from '@/components/Daily';
  import ErrorAlert from '@/components/ErrorAlert';
  import Search from '@/components/Search';
  import Api from '@/lib/api';
  import Store from '@/lib/store';
  import { onMounted, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  export default {
    name: 'App',

    components: {
      Location,
      Hourly,
      Current,
      Daily,
      ErrorAlert,
      Search,
    },

    setup() {
      const { t } = useI18n(); // call `useI18n`, and spread `t` from  `useI18n` returning
      const errorMessage = ref('');
      const locationName = ref('');
      const currentWeather = reactive({
        // location: '',
        iconCode: '',
        temperature: '',
        windSpeed: '',
        windDirection: '',
        precMm: '',
        precProbability: '',
      });

      const onLocationChange = (locationData) => {
        const sanitizedLocation = locationData.name.replace(/\([^()]*\)/g, '');
        locationName.value = sanitizedLocation;
        getCurrentForecast(
          locationData.lat,
          locationData.lon,
          sanitizedLocation
        );
      };

      //clear error when dismiss is emitted, so the error will not show anymore
      const clearError = function() {
        errorMessage.value = '';
      };
      onMounted(() => {
        const coords = getLocation();
        if (coords) {
          getCurrentForecast(coords.latitude, coords.longitude);
        } else {
          getCurrentForecast();
        }
        locationName.value = Store.getLastLocation();
      });

      function getCurrentForecast(lat, lon, location) {
        Api.getCurrentForecast(lat, lon, location)
          .then((weather) => {
            console.log(weather);
            if (weather.location) {
              locationName.value = weather.location;
            }
            // currentWeather.location = weather.location;
            currentWeather.iconCode = weather.iconCode;
            currentWeather.temperature = weather.temperature;
            currentWeather.windSpeed = weather.windSpeed;
            currentWeather.windDirection = weather.windDirection;
            currentWeather.precMm = weather.precMm;
            currentWeather.precProbability = weather.precProbability;
            // currentWeather.location = weather.info.name.de;
            // const currentHour = weather.current_hour[0];
            // currentWeather.iconCode = currentHour.values[0].smb3;
            // currentWeather.temperature = currentHour.values[1].ttt;
            // currentWeather.windSpeed = currentHour.values[2].fff;
            // currentWeather.windDirection = currentHour.values[4].ddd;
            // currentWeather.precipitationMm = currentHour.values[5].rr3;
            // currentWeather.precipitationProbablility =
            //   currentHour.values[6].pr3;
            // console.log(currentWeather);
            // console.log(weather);
          })
          .catch((error) => {
            errorMessage.value = t('couldNotFetch');
            console.log('[App.vue] ' + error);
          });
      }

      function getLocation() {
        if (navigator.geolocation) {
          return navigator.geolocation.getCurrentPosition(
            searchWeatherForPosition
          );
        } else {
          console.log('Geolocation blocked');
          return false;
        }
      }

      function searchWeatherForPosition(position) {
        return position.coords;
      }
      return {
        t,
        currentWeather,
        errorMessage,
        clearError,
        onLocationChange,
        locationName,
      };
    },
  };
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.25s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
