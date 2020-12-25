<template>
  <div class="content flex-5 p-8 md:p-16 xl:p-32">
    <transition name="fade">
      <ErrorAlert data-test="error-alert" v-if="hasError" />
    </transition>
    <header>
      <div class="flex flex-row justify-between h-10">
        <Location data-test="location" class="self-center" />
        <Search />
      </div>
    </header>

    <main class="flex flex-col justify-end min-h-full -mt-10">
      <Current data-test="current" />
      <!-- <Daily @fetchError="onErrorMessage" /> -->
      <Daily />
    </main>
  </div>
  <aside class="bg-white dark:bg-gray-800 flex-2 p-8 md:p-16 xl:p-32">
    <!-- <Hourly @fetchError="onErrorMessage" /> -->
    <!-- <Hourly /> -->
  </aside>
</template>

<script>
  import Location from '@/components/Location';
  import Current from '@/components/Current';
  // import Hourly from '@/components/Hourly';
  import Daily from '@/components/Daily';
  import ErrorAlert from '@/components/ErrorAlert';
  import Search from '@/components/Search';
  import { onMounted, computed } from 'vue';
  import { useStore } from 'vuex';
  import {
    LOCATION_CLEAR_NAME,
    LOCATION_UPDATE_COORDINATES,
  } from '@/store/modules/location.js';

  export default {
    name: 'App',

    components: {
      Location,
      // Hourly,
      Daily,
      Current,
      ErrorAlert,
      Search,
    },

    setup() {
      const store = useStore();
      const hasError = computed(() => store.getters['error/hasError']);

      onMounted(async () => {
        //try to get the users coordinate
        getPosition();
      });

      function getPosition() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(onUserPositionAvailable);
        }
      }

      function onUserPositionAvailable(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        store.commit(LOCATION_CLEAR_NAME);
        store.commit(LOCATION_UPDATE_COORDINATES, { latitude, longitude });
      }

      return {
        hasError,
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
