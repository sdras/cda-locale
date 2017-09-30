<template>
  <div>
    <section class="container">
      <p>
        <nuxt-link to="/globe">Globe</nuxt-link>
      </p>
      <new-table></new-table>
    </section>
  </div>
</template>

<script>
import SpeakingTable from '~/components/SpeakingTable.vue'
import NewTable from '~/components/NewTable.vue'
import Globe from '~/components/Globe.vue'

export default {
  components: {
    SpeakingTable,
    NewTable,
    Globe
  }
}
</script>

<style>
body {
  background: black;
  color: white;
}

a {
  color: white;
  font-weight: bold;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
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
