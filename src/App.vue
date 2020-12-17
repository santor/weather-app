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
      <div class="flex flex-row justify-between h-10">
        <Location class="self-center" :locationName="locationName" />
        <Search @latLonChange="onLocationChange" />
      </div>
    </header>

    <main class="flex flex-col justify-end min-h-full -mt-10">
      <Current
        v-if="currentWeather.temperature != null"
        :temperature="currentWeather.temperature"
        :description="currentWeather.description"
      />
      <Daily :coordinates="coordinates" @fetchError="onErrorMessage" />
    </main>
  </div>
  <aside class="bg-white dark:bg-gray-800 flex-2 p-8 md:p-16 xl:p-32">
    <Hourly :coordinates="coordinates" @fetchError="onErrorMessage" />
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
  import LocalStore from '@/lib/local_store';
  import { onMounted, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { getWeatherDescription } from './utils/utils.js';

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
        temperature: null,
        description: '',
      });
      const coordinates = reactive({
        latitude: '',
        longitude: '',
      });

      const onLocationChange = (locationData) => {
        locationName.value = locationData.name;
        coordinates.latitude = locationData.lat;
        coordinates.longitude = locationData.lon;
        // console.log('onlocationchange ' + coordinates);
        getCurrentForecast(
          locationData.lat,
          locationData.lon,
          locationData.name
        );
      };

      //clear error when dismiss is emitted, so the error alert will be hidden
      const clearError = function() {
        errorMessage.value = '';
      };

      const onErrorMessage = function(error) {
        errorMessage.value = error;
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
          const lat = LocalStore.getLatitude();
          const lon = LocalStore.getLongitude();
          coordinates.latitude = lat;
          coordinates.longitude = lon;
          // console.log('nopermission ' + coordinates);
          getCurrentForecast(lat, lon);
        }
      });

      function getCurrentForecast(lat, lon, location) {
        Api.getCurrentForecast(lat, lon, location)
          .then((weather) => {
            // console.log(weather);
            if (weather.location) {
              locationName.value = weather.location;
            }
            currentWeather.temperature = parseInt(weather.temperature);
            const description = getWeatherDescription(weather.iconCode);
            currentWeather.description = t(description);
          })
          .catch((error) => {
            onErrorMessage(t('couldNotFetchCurrent'));
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
        coordinates.latitude = coords.latitude;
        coordinates.longitude = coords.longitude;
        // console.log('searchWeatherForPosition' + coordinates);
        getCurrentForecast(coords.latitude, coords.longitude);
      }

      return {
        t,
        currentWeather,
        errorMessage,
        clearError,
        onErrorMessage,
        onLocationChange,
        locationName,
        coordinates,
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
