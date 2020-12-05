<template>
  <form>
    <label for="location-search">Search for a location</label>
    <input type="search" id="location-search" />
    <button type="submit">
      <img svg-inline src="../assets/svg/search.svg" alt="search icon" />
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
