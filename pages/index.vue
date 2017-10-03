<template>
  <section>
    <h1>Cloud Developer Advocate Speaking</h1>
    <h3>Microsoft Azure</h3>
    <speaking-table></speaking-table>
    <speaking-globe></speaking-globe>
  </section>
</template>

<script>
import SpeakingGlobe from '~/components/SpeakingGlobe.vue'
import SpeakingTable from '~/components/SpeakingTable.vue'

export default {
  components: {
    SpeakingGlobe,
    SpeakingTable,
  },
}
</script>

<style>
body {
  background: black;
  color: white;
  font-family: "Open Sans", "Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
  font-weight: 300;
}

h1,
h3 {
  font-weight: 300;
}

h3 {
  color: #5AB4FC;
}

section {
  padding: 40px;
}

a,
a:visited {
  color: #5AB4FC;
}
</style>
