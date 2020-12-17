<template>
  <ul
    class="flex flex-row flex-wrap sm:flex-nowrap sm:flex-col justify-center xl:justify-between min-h-full"
  >
    <li
      data-test="hourly"
      v-for="hourly in allDay"
      :key="hourly.hours"
      :title="hourly.hours"
      class="m-2 md:mt-4 md:mb-4 xl:m-0 flex flex-col sm:flex-row sm:justify-center"
    >
      <div class="self-center mb-1 sm:mb-0 sm:mr-4">
        <!-- Hmm better without the clock icons on small screen-->
        <!-- <i
          :class="'wi-time-' + hourly.time"
          class="wi text-lg sm:text-3xl mr-1 sm:hidden inline-block"
        ></i> -->
        <p
          :data-test="`hour-${hourly.hours}`"
          class="inline-block text-sm sm:text-base md:text-lg xl:text-2xl text-right"
        >
          {{ hourly.hours }}
        </p>
      </div>
      <div class="ml-2 mr-2 sm:ml-0 sm:mr-0">
        <i
          :class="hourly.icon"
          class="wi inline-block text-xl sm:text-2xl  md:text-3xl xl:text-4xl mr-2"
        ></i>
        <p
          :data-test="`temperature-${hourly.hours}`"
          class="inline-block text-lg sm:text-xl sm:font-bold xl:font-normal md:text-2xl xl:text-3xl text-left "
        >
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

      async function getHoursForecast(lat, lon) {
        return Api.get24HoursForecast(lat, lon)
          .then((forecast) => {
            forecast.forEach((item) => {
              const convertedIcon = getWeatherIconName(item.icon);
              item.icon = convertedIcon ? convertedIcon : item.icon;
              item.hours = `${zeroPad(item.hours)}:00`;
              item.time = parseInt(item.hours) % 12;
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
        //expose for testing
        getHoursForecast,
      };
    },
  };
</script>
