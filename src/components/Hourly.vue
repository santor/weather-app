<template>
  <section>
    <ul>
      <li v-for="hourly in allDay" :key="hourly.hours">
        <p>{{ hourly.hours }}</p>
      </li>
    </ul>
  </section>
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
            });
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
