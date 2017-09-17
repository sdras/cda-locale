<template>
  <section>
    <p>
      <nuxt-link to="/">Home</nuxt-link>
    </p>
    <globe></globe>
  </section>
</template>

<script>
import Globe from '~/components/Globe.vue'

export default {
  components: {
    Globe
  },
}
</script>

<style>
body {
  background: #2B294D;
  color: white;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: white;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
