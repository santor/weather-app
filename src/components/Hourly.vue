<template>
  <ul
    class="flex flex-row flex-wrap sm:flex-nowrap sm:flex-col sm:justify-center xl:justify-around min-h-full"
  >
    <li
      v-for="hourly in allDay"
      :key="hourly.hours"
      :title="hourly.hours"
      class="mt-4 mb-4 flex flex-col sm:flex-row sm:justify-center"
    >
      <p class="hidden sm:inline-block text-lg text-right mr-4">
        {{ hourly.hours }}
      </p>
      <i
        :class="'wi-time-' + hourly.time"
        class="wi text-3xl mb-1 self-center sm:hidden"
      ></i>
      <div class="ml-2 mr-2 sm:ml-0 sm:mr-0">
        <i
          :class="hourly.icon"
          class="wi inline-block text-2xl md:text-3xl mr-2"
        ></i>
        <p class="inline-block text-xl md:text-2xl text-left font-bold">
          {{ hourly.temperature }}&deg;
        </p>
      </div>
    </li>
  </ul>
</template>

<script>
  import { useI18n } from 'vue-i18n';
  import { toRefs, watchEffect, ref } from 'vue';
  import { getWeatherIconName, zeroPad } from '../utils/utils.js';
  import Api from '@/lib/api';

  export default {
    name: 'Hourly',
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
      const allDay = ref([]);

      watchEffect(() => {
        const lat = coord.latitude.value;
        const lon = coord.longitude.value;
        if (lat != 0 && lon != 0) {
          getHoursForecast(lat, lon);
        }
      });

      function getHoursForecast(lat, lon) {
        Api.get24HoursForecast(lat, lon)
          .then((forecast) => {
            forecast.forEach((item) => {
              item.icon = getWeatherIconName(item.icon);
              item.hours = `${zeroPad(item.hours)}:00`;
              item.time = parseInt(item.hours) % 12;
            });
            console.log(forecast);
            allDay.value = forecast;
          })
          .catch((error) => {
            context.emit('fetchError', t('couldNotFetchDaily'));
            console.log('[Hourly.vue] ' + error);
          });
      }

      return {
        allDay,
      };
    },
  };
</script>
