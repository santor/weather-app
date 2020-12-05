<template>
  <div class="flex flex-row justify-between">
    <h1 class="self-center">{{ locationName }}</h1>
    <Search />
  </div>
</template>

<script>
  import Search from './Search.vue';
  export default {
    components: { Search },
    name: 'Location',

    props: {
      locationName: {
        type: String,
        required: true,
      },
    },
  };
</script>

<style></style>
