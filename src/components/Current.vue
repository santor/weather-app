<template>
  <section class="relative w-96 text-right">
    <span
      class="absolute bg-gray-200 w-40 h-40 -right-2 -top-1
     rounded-full"
    ></span>
    <span class="text-11xl tracking-tight font-fjalla relative">{{
      roundedTemperature
    }}</span>
    <span class="text-11xl font-fjalla relative right-8">
      &deg;
    </span>
  </section>
  <p>{{ description }}</p>
</template>

<script>
  import { toRefs, computed } from 'vue';
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
      console.log(props);
      const { temperature } = toRefs(props);
      const roundedTemperature = computed(() => Math.round(temperature.value));

      return {
        roundedTemperature,
      };
    },
  };
</script>

<style></style>
