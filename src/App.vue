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
      <div class="flex flex-row justify-between">
        <Location
          class="self-center"
          :locationName="
            currentWeather.location ? currentWeather.location : 'Bern'
          "
        />
        <Search @latLonChange="onLocationChange" />
      </div>
    </header>

    <main>
      <Current />
      <Daily />
    </main>
  </div>
  <aside class="bg-white dark:bg-gray-800 flex-2 p-8 md:p-16 xl:p-32">
    <Hourly />
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
  import { onMounted, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

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
      const { t } = useI18n(); // call `useI18n`, and spread `t` from  `useI18n` returning
      const errorMessage = ref('');
      const currentWeather = reactive({
        location: '',
        iconCode: '',
        temperature: '',
        windSpeed: '',
        windDirection: '',
        precipitationMm: '',
        precipitationProbablility: '',
      });

      const onLocationChange = (geo) => {
        getCurrentForecast(geo.lat, geo.lon);
        // console.log(geo.lat + ' ' + geo.lon);
      };

      //clear error when dismiss is emitted, so the error will not show anymore
      const clearError = function() {
        errorMessage.value = '';
      };
      onMounted(() => {
        getCurrentForecast();
      });

      function getCurrentForecast(lat, lon) {
        Api.getCurrentForecast(lat, lon)
          .then((weather) => {
            currentWeather.location = weather.info.name.de;
            const currentHour = weather.current_hour[0];
            currentWeather.iconCode = currentHour.values[0].smb3;
            currentWeather.temperature = currentHour.values[1].ttt;
            currentWeather.windSpeed = currentHour.values[2].fff;
            currentWeather.windDirection = currentHour.values[4].ddd;
            currentWeather.precipitationMm = currentHour.values[5].rr3;
            currentWeather.precipitationProbablility =
              currentHour.values[6].pr3;
            // console.log(currentWeather);
          })
          .catch((error) => {
            errorMessage.value = t('couldNotFetch');
            console.log('[App.vue] ' + error);
          });
      }
      return {
        t,
        currentWeather,
        errorMessage,
        clearError,
        onLocationChange,
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
