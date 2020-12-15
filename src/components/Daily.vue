<template>
  <section class="">
    <ul class="flex flex-row">
      <li v-for="day in days" :key="day.dayOfWeek">
        <h2 class="text-lg">{{ t(`day_abbr_${day.dayOfWeek}`) }}</h2>
        <i class="wi" :class="getWeatherIcon(day.iconCode)"></i>
        <p class="font-bold">{{ day.tempAvg }}&deg;</p>
      </li>
    </ul>
  </section>
</template>

<script>
  import { useI18n } from 'vue-i18n';
  import { toRefs, watchEffect, ref } from 'vue';
  import Api from '@/lib/api';
  import weatherCodeMap from '../assets/weather_code_map.json';

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

      function getSevenDayForecast(lat, lon) {
        Api.get7daysForecast(lat, lon)
          .then((weather) => {
            days.value = weather;
          })
          .catch((error) => {
            context.emit('fetchError', t('couldNotFetchDaily'));
            console.log('[Daily.vue] ' + error);
          });
        // console.log(response);
      }

      function getWeatherIcon(srfIcon) {
        const item = weatherCodeMap.find((element) => element.code == srfIcon);

        return item.code_icon;
      }
      return {
        t,
        days,
        getWeatherIcon,
      };
    },
  };
</script>

<style></style>
