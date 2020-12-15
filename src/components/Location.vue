<template>
  <h1 class="text-lg">{{ locationName }}</h1>
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
