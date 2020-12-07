<template>
  <!-- Toast Notification Danger -->
  <div
    class="fixed z-50 top-4 left-4 right-4 sm:right-16 sm:left-16 sm:top-8 md:left-1/4 md:right-1/4 2xl:left-1/3 2xl:right-1/3 flex items-center bg-red-500 border-1 border-l-4 border-red-700 py-2 px-3 shadow-md mb-2 rounded-lg"
  >
    <!-- icons -->
    <div
      @click="$emit('dismiss')"
      class="cursor-pointer text-red-500 rounded-full bg-white mr-3"
    >
      <svg
        width="1.8em"
        height="1.8em"
        viewBox="0 0 16 16"
        class="bi bi-x"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"
        />
        <path
          fill-rule="evenodd"
          d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"
        />
      </svg>
    </div>
    <!-- message -->
    <div class="text-white max-w-lg ">
      {{ message }}
    </div>
  </div>
</template>

<script>
  import { useI18n } from 'vue-i18n';
  export default {
    name: 'ErrorAlert',
    props: {
      message: String,
    },
    emits: ['dismiss'],

    setup() {
      const { t } = useI18n();

      return {
        t,
      };
    },
  };
</script>
