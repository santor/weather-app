<template>
  <div class="content flex-5 p-8 md:p-16 xl:p-32">
    <transition name="fade">
      <ErrorAlert data-test="error-alert" v-if="hasError" />
    </transition>
    <header>
      <div class="flex flex-row justify-between h-10">
        <Location
          data-test="location"
          class="self-center"
          :locationName="locationName"
        />
        <Search @latLonChange="onLocationChange" />
      </div>
    </header>

    <main class="flex flex-col justify-end min-h-full -mt-10">
      <Current
        data-test="current"
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
  import { onMounted, reactive, ref, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useStore } from 'vuex';
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
      const store = useStore();
      const hasError = computed(() => store.getters['error/hasError']);
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
        const lat = locationData.lat;
        const lon = locationData.lon;
        updateCoordinates(lat, lon);
        getCurrentForecast(lat, lon, locationData.name);
      };

      function updateCoordinates(lat, lon) {
        coordinates.latitude = lat;
        coordinates.longitude = lon;
      }

      const onErrorMessage = function(error) {
        store.commit('error/addError', error);
      };

      onMounted(async () => {
        //try to get the users location
        getLocation();

        //if not allowed, get the weather for the last known location
        const permissionStatus = await navigator.permissions.query({
          name: 'geolocation',
        });
        const noPermission = permissionStatus.state != 'granted';
        if (noPermission) {
          const lat = LocalStore.getLatitude();
          const lon = LocalStore.getLongitude();
          updateCoordinates(lat, lon);
          getCurrentForecast(lat, lon);
        }
      });

      function getCurrentForecast(lat, lon, location) {
        Api.getCurrentForecast(lat, lon, location)
          .then((weather) => {
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
        const lat = coords.latitude;
        const lon = coords.longitude;
        updateCoordinates(lat, lon);
        getCurrentForecast(lat, lon);
      }

      return {
        t,
        currentWeather,
        hasError,
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
