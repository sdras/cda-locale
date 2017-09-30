<template>
  <section>
    <h1>Cloud Developer Advocate Speaking</h1>
    <h3>Node, JavaScript, Python</h3>
    <new-table></new-table>
    <globe></globe>
  </section>
</template>

<script>
import Globe from '~/components/Globe.vue'
import NewTable from '~/components/NewTable.vue'

export default {
  components: {
    Globe,
    NewTable,
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
