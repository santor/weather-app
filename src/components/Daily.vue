<template>
  <div>Daily</div>
</template>

<script>
  import { toRefs, reactive, onMounted } from 'vue';
  import Api from '@/lib/api';
  export default {
    name: 'Daily',
    props: {
      coordinates: {
        latitude: Number,
        Longitude: Number,
      },
    },

    setup(props) {
      const { coordinates } = toRefs(props);
      const daily = reactive({
        dayShort,
        temperature,
        symbol,
      });

      onMounted(() => {
        getSevenDayForecast(coordinates.latitude, coordinates.Longitude);
      });

      function getSevenDayForecast(lat, lon) {
        Api.getSevenDayForecast(lat, lon).then;
      }
      return {
        daily,
      };
    },
  };
</script>

<style></style>
