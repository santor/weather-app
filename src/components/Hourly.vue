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
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  import onCoordinatesChange from '@/composables/coords_change';

  export default {
    name: 'Hourly',

    setup() {
      const { t } = useI18n();
      const store = useStore();
      const allDay = computed(() => store.state.oneDay.hourly);

      onCoordinatesChange(getHoursForecast);

      function getHoursForecast(lat, lon) {
        try {
          store.dispatch('oneDay/fetchHourlyForecast', {
            latitude: lat,
            longitude: lon,
          });
        } catch (error) {
          store.commit('error/addError', t('couldNotFetchHourly'));
          console.log('[Hourly.vue] ' + error);
        }
      }

      return {
        allDay,
        //expose for testing
        getHoursForecast,
      };
    },
  };
</script>
