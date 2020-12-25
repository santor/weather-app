<template>
  <h1 class="text-lg">{{ locationName }}</h1>
</template>

<script>
  import { computed } from 'vue';
  import { useStore } from 'vuex';

  export default {
    name: 'Location',

    setup() {
      const store = useStore();
      const locationName = computed(() => store.state.location.name);

      return {
        locationName,
      };
    },
  };
</script>
