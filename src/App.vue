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
      const { t } = useI18n(); // for translations
      const errorMessage = ref('');
      const locationName = ref('');
      const currentWeather = reactive({
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

      //clear error when dismiss is emitted, so the error alert will be hidden
      const clearError = function() {
        errorMessage.value = '';
      };

      onMounted(async () => {
        //try to get the users location
        getLocation();

        //if not allowed, get the weather for the last known or default location
        const permissionStatus = await navigator.permissions.query({
          name: 'geolocation',
        });
        const noPermission = permissionStatus.state != 'granted';
        if (noPermission) {
          getCurrentForecast();
        }
      });

      function getCurrentForecast(lat, lon, location) {
        Api.getCurrentForecast(lat, lon, location)
          .then((weather) => {
            if (weather.location) {
              locationName.value = weather.location;
            }
            currentWeather.iconCode = weather.iconCode;
            currentWeather.temperature = weather.temperature;
            currentWeather.windSpeed = weather.windSpeed;
            currentWeather.windDirection = weather.windDirection;
            currentWeather.precMm = weather.precMm;
            currentWeather.precProbability = weather.precProbability;
          })
          .catch((error) => {
            errorMessage.value = t('couldNotFetch');
            console.log('[App.vue] ' + error);
          });
      }

      function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(searchWeatherForPosition);
        }
      }

      function searchWeatherForPosition(position) {
        const coords = position.coords;
        getCurrentForecast(coords.latitude, coords.longitude);
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
