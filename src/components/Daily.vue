<template>
  <section
    class="ml-4 mr-4 sm:ml-8 sm:mr-8 lg:-ml-16 lg:-mr-16 xl:-ml-32 xl:-mr-32 2xl:mx-auto 2xl:w-11/12"
  >
    <ul class="flex flex-row justify-between">
      <li class="align-center hidden lg:block">
        <div
          class="bg-gray-300 dark:bg-gray-700 h-px w-16 2xl:w-12 relative top-1/2 ml-8 mr-8"
        ></div>
      </li>
      <li v-for="day in days" :key="day.dayOfWeek" data-test="day">
        <h2 class="text-lg" :data-test="`day-${day.dayOfWeek}`">
          {{ t(`day_abbr_${day.dayOfWeek}`) }}
        </h2>
        <i class="wi text-lg" :class="getWeatherIconName(day.iconCode)"></i>
        <p class="font-bold" :data-test="`temp-${day.dayOfWeek}`">
          {{ day.tempAvg }}&deg;
        </p>
      </li>
      <li class="align-center hidden lg:block">
        <div
          class="bg-gray-300 dark:bg-gray-700 h-px w-16 2xl:w-12 relative top-1/2 ml-8 mr-8"
        ></div>
      </li>
    </ul>
  </section>
</template>

<script>
  import { useI18n } from 'vue-i18n';
  import { toRefs, watchEffect, ref } from 'vue';
  import { getWeatherIconName } from '../utils/utils.js';
  import Api from '@/lib/api';

  export default {
    name: 'Daily',
    props: {
      coordinates: {
        latitude: {
          type: Number,
          default: 0,
        },
        longitude: {
          type: Number,
          default: 0,
        },
      },
    },

    emits: ['fetchError'],

    setup(props, context) {
      const { t } = useI18n();
      const coord = toRefs(props.coordinates);
      const days = ref([]);

      watchEffect(() => {
        const lat = coord.latitude.value;
        const lon = coord.longitude.value;
        if (lat != 0 && lon != 0) {
          getSevenDayForecast(lat, lon);
        }
      });

      async function getSevenDayForecast(lat, lon) {
        return Api.get7daysForecast(lat, lon)
          .then((weather) => {
            days.value = weather;
          })
          .catch((error) => {
            context.emit('fetchError', t('couldNotFetchDaily'));
            console.log('[Daily.vue] ' + error);
          });
      }

      return {
        t,
        days,
        getWeatherIconName,
        getSevenDayForecast,
      };
    },
  };
</script>
