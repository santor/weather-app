<template>
  <h1>{{ locationName }}</h1>
</template>

<script>
  export default {
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
