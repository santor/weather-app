<template>
  <div class="flex-Wrapper">
    <!-- TODO check out with a screen reader if the label is necessary for accessability-->
    <label class="hidden" for="location-search">{{
      t('searchLocation')
    }}</label>
    <VueAutosearch
      id="location-search"
      class="bg-transparent"
      v-model="selectedOption"
      :searchFunction="searchFunction"
      :placeholder="t('searchLocation')"
    >
    </VueAutosearch>
  </div>
</template>

<script>
  import VueAutosearch from 'vue-autosearch';
  import { useI18n } from 'vue-i18n';
  import {
    LOCATION_SET_BY_ID,
    LOCATION_SEARCH,
  } from '@/store/modules/location.js';

  export default {
    name: 'Search',
    components: {
      VueAutosearch,
    },

    data() {
      return {
        selectedOption: null,
        searchTimeoutId: null,
      };
    },

    methods: {
      async searchFunction(searchTerm) {
        return new Promise((resolve) => {
          if (this.searchTimeoutId) {
            clearTimeout(this.searchTimeoutId);
          }
          if (searchTerm.length < 2) {
            return resolve({
              message: '',
            });
          }

          this.searchTimeoutId = setTimeout(async () => {
            // wait until executes
            //so the state locationSuggestions will not be empty
            // if there are some results
            await this.$store.dispatch(LOCATION_SEARCH, searchTerm);
            return resolve({
              result: this.$store.state.location.suggestions,
            });
          }, 300);
        });
      },
    },

    watch: {
      selectedOption: function(value) {
        if (value) {
          this.$store.dispatch(LOCATION_SET_BY_ID, value.id);
        }
      },
    },

    setup() {
      const { t } = useI18n();

      return {
        t,
      };
    },
  };
</script>
