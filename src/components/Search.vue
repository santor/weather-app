<template>
  <form class="h-8">
    <label class="hidden" for="location-search">Search for a location</label>
    <input class="h-8" type="search" id="location-search" />
    <button type="submit" class="h-8 w-8">
      <img
        svg-inline
        src="../assets/svg/search.svg"
        alt="search icon"
        class="w-8 h-8"
      />
    </button>
  </form>
</template>

<script>
  // import SearchLogo from '../../public/svg/search.svg';
  export default {
    name: 'Search',

    components: {
      // SearchLogo,
    },
  };
</script>

<style></style>
