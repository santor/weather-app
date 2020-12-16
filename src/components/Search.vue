<template>
  <div class="flex-Wrapper">
    <!--todo check out with a screen reader if the label is necessary for accessability-->
    <label class="hidden" for="location-search">{{
      t('searchLocation')
    }}</label>
    <VueAutosearch
      id="location-search"
      class="bg-transparent"
      v-model="selectedOption"
      :searchFunction="searchFunction"
      :placeholder="t('searchLocation')"
    />
  </div>
</template>

<script>
  import VueAutosearch from 'vue-autosearch';
  import Api from '@/lib/api';
  import { useI18n } from 'vue-i18n';

  export default {
    name: 'Search',
    components: {
      VueAutosearch,
    },
    emits: ['latLonChange'],

    //let as options API
    data() {
      return {
        selectedOption: null,
        searchTimeout: null,
        searchResults: null,
      };
    },

    methods: {
      searchFunction(searchTerm) {
        return new Promise((resolve) => {
          if (this.searchTimeout) clearTimeout(this.searchTimeout);

          if (searchTerm.length < 2) {
            return resolve({
              message: '',
            });
          }

          this.searchTimeout = setTimeout(async () => {
            this.searchResults = await Api.searchLocation(searchTerm);
            return resolve({
              result: this.searchResults,
            });
          }, 300);
        });
      },
    },

    watch: {
      selectedOption: function(value) {
        if (value && this.searchResults) {
          const geo = this.searchResults.find(
            (element) => element.id == value.id
          );
          this.$emit('latLonChange', geo);
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
