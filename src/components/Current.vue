<template>
  <div
    class="flex-grow flex flex-col lg:flex-row justify-center mt-10 w-full items-center"
  >
    <section class="relative text-right ml-4 mr-4 mt-8 lg:mt-0">
      <span
        class="absolute bg-gray-200 dark:bg-gray-800 w-40 h-40 -right-2 -top-2
     rounded-full"
      ></span>
      <span
        class="text-11xl tracking-tight font-fjalla relative"
        data-test="temperature"
        >{{ roundedTemperature }}</span
      >
      <span class="text-11xl font-fjalla relative right-8">
        &deg;
      </span>
    </section>
    <section class="ml-4 mr-4 mb-4">
      <p class="pt-2 pb-1" data-test="time">{{ date.time }}</p>
      <h1 class="text-6xl font-bold" data-test="day">{{ date.day }}</h1>
      <p class="pt-3 pb-2" data-test="description">{{ description }}</p>
    </section>
  </div>
</template>

<script>
  import { computed, reactive, onMounted, onUnmounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useStore } from 'vuex';
  import { zeroPad, getWeatherDescriptionCode } from '../utils/utils.js';

  export default {
    name: 'Current',
    setup() {
      const { t } = useI18n();
      const store = useStore();
      const coords = computed(() => store.state.location.coordinates);
      const roundedTemperature = computed(() =>
        Math.round(store.state.current.weather.temperature)
      );
      const description = computed(() => {
        const icon = store.state.current.weather.iconCode;
        if (icon) {
          const description = getWeatherDescriptionCode(icon);
          return t(description);
        }
        return '';
      });
      const date = reactive({
        time: '',
        day: '',
      });

      store.watch(
        () => store.state.location.coordinates,
        (coordinates) => {
          getCurrentForecast(coordinates.latitude, coordinates.longitude);
        }
      );

      function getCurrentForecast(lat, lon) {
        store
          .dispatch('current/fetchCurrentWeather', {
            latitude: lat,
            longitude: lon,
          })
          .catch((error) => {
            store.commit('error/addError', t('couldNotFetchCurrent'));
            console.log('[Current.vue] ' + error);
          });
      }

      let intervalId, timeoutId;

      onMounted(() => {
        getCurrentForecast(coords.value.latitude, coords.value.longitude);

        setupTime();
      });

      function setupTime() {
        //set initial time
        const currentTime = updateTime();
        const initialTimeout = (60 - currentTime.getSeconds()) * 1000;

        timeoutId = setTimeout(() => {
          //update after initialTimeout
          updateTime();
          intervalId = setInterval(() => {
            //then update every minute
            updateTime();
          }, 60 * 1000);
        }, initialTimeout);
      }

      onUnmounted(() => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (intervalId) {
          clearInterval(intervalId);
        }
      });

      function updateTime() {
        const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();

        //ex. 14:02 instead of 14:2
        date.time = `${zeroPad(hours)}:${zeroPad(minutes)}`;

        //day not set or midnight
        if (!date.day || hours + minutes == 0) {
          const currentDayNumber = currentTime.getDay();
          date.day = t(`day_${currentDayNumber}`);
        }
        return currentTime;
      }

      return {
        roundedTemperature,
        description,
        date,
      };
    },
  };
</script>
