<template>
  <head>
    navbar here or search
  </head>
  <main>
    <Arithmetic title="this is a static title" />
  </main>
  <aside></aside>
</template>

<script>
  import Arithmetic from './components/Arithmetic.vue';
  import Api from '@/lib/api';

  console.log(Api);
  const myApi = Api;
  myApi.getForecast();
  export default {
    name: 'App',

    components: {
      Arithmetic,
    },
  };
  // const app = {}

  // export { app };
</script>
