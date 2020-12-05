<template>
  <h1>{{ locationName }}</h1>
  <Search />
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
