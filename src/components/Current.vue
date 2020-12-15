<template>
  <div
    class="flex-grow flex flex-col lg:flex-row justify-center mt-10 w-full items-center"
  >
    <section class="relative text-right ml-4 mr-4 mt-8 lg:mt-0">
      <span
        class="absolute bg-gray-200 dark:bg-gray-800 w-40 h-40 -right-2 -top-2
     rounded-full"
      ></span>
      <span class="text-11xl tracking-tight font-fjalla relative">{{
        roundedTemperature
      }}</span>
      <span class="text-11xl font-fjalla relative right-8">
        &deg;
      </span>
    </section>
    <section class="ml-4 mr-4 mb-4">
      <p class="pt-2 pb-1">{{ date.time }}</p>
      <h1 class="text-6xl font-bold">{{ date.day }}</h1>
      <p class="pt-3 pb-2">{{ description }}</p>
    </section>
  </div>
</template>

<script>
  import { toRefs, computed, reactive, onMounted, onUnmounted } from 'vue';
  import { useI18n } from 'vue-i18n';

  //add leading zeros to the hours:minutes
  const zeroPad = (num) => String(num).padStart(2, '0');

  export default {
    name: 'Current',
    props: {
      temperature: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { temperature } = toRefs(props);
      const roundedTemperature = computed(() => Math.round(temperature.value));
      const date = reactive({
        time: '',
        day: '',
      });

      let intervalId, timeoutId;
      onMounted(() => {
        //set initial time
        const currentTime = updateTime();
        const initialTimeout = (60 - currentTime.getSeconds()) * 1000;

        timeoutId = setTimeout(() => {
          //update after initialTimeout
          updateTime();
          intervalId = setInterval(() => {
            //then update every minute
            updateTime();
          }, 60 * 1000);
        }, initialTimeout);
      });

      onUnmounted(() => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (intervalId) {
          clearInterval(intervalId);
        }
      });

      function updateTime() {
        const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        //ex. 14:02 instead of 14:2
        date.time = `${zeroPad(hours)}:${zeroPad(minutes)}`;

        //day not set or midnight
        if (!date.day || hours + minutes == 0) {
          const currentDayNumber = currentTime.getDay();
          date.day = t(`day_${currentDayNumber}`);
        }
        return currentTime;
      }

      return {
        roundedTemperature,
        date,
      };
    },
  };
</script>
