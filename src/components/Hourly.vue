<template>
  <div>Hourly</div>
</template>

<script>
  import { useI18n } from 'vue-i18n';
  import { toRefs, watchEffect, ref } from 'vue';
  import { getWeatherIconName } from '../utils/utils.js';
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

    etup(props, context) {
      const { t } = useI18n();
      const coord = toRefs(props.coordinates);
      const hours = ref([]);

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
            forecast.icon = getWeatherIconName(forecast.icon);
            hours.value = forecast;
          })
          .catch((error) => {
            context.emit('fetchError', t('couldNotFetchDaily'));
            console.log('[Daily.vue] ' + error);
          });
        // console.log(response);
      }

      return {
        hours,
      };
    },
  };
</script>

<style></style>
