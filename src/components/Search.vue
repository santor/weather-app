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
          // this.selectedOption = null;
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
<style>
  .autosearch__loadingIndicator {
    -webkit-animation-name: pulse;
    animation-name: pulse;
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
    border: 2px solid #111827;
    border-radius: 50%;
    box-sizing: border-box;
    display: inline-block;
    height: 0.4em;
    position: absolute;
    left: 0.2em;
    top: 0.2em;
    width: 0.4em;
  }
  .autosearch__clearSearch {
    background-image: url("data:image/svg+xml;utf8,<svg width='1.8em' height='1.8em' viewBox='0 0 16 16' class='bi bi-x' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' d='M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z'/><path fill-rule='evenodd' d='M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z'/></svg>");
    background-position: 50%;
    background-size: contain;
    background-repeat: no-repeat;
    top: calc(50% - 0.5em);
    right: 0.4em;
    height: 1em;
    position: absolute;
    width: 1em;
  }
  .autosearch__clearSearch:hover {
    cursor: pointer;
  }
  .autosearch__result {
    background-color: #fff;
    border: 1px solid #d3d3d3;
    box-sizing: border-box;
    position: absolute;
    overflow-y: auto;
    width: 100%;
    z-index: 1;
  }
  .autosearch__result--down {
    border-radius: 0 0 0.2em 0.2em;
    border-top: unset;
    margin-top: 0;
  }
  .autosearch__result--up {
    border-radius: 0.2em 0.2em 0 0;
    border-bottom: unset;
  }
  .autosearch__result__statusMessage {
    padding: 1em;
  }
  .autosearch__result__option {
    box-sizing: border-box;
    cursor: pointer;
    display: block;
    padding: 0.4em;
  }
  /* .autosearch__result__option:hover {
    background-color: #d3d3d3;
  } */
  @-webkit-keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.5);
    }
    to {
      transform: scale(1);
    }
  }
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.5);
    }
    to {
      transform: scale(1);
    }
  }
</style>
