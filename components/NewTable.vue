<template>
  <div class="container">
    <table>
      <thead>
        <tr>
          <th v-for="key in columns">
            {{ key }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(post, i) in speakerData">
          <td v-for="entry in columns">
            {{ post[entry] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  computed: {
    speakerData() {
      return this.$store.state.speakerData;
    },
    columns() {
      return this.$store.state.speakingColumns;
    }
  }
}
</script>

<style scoped>
th {
  background: #333333;
  padding: 5px;
}

td {
  padding: 4px 8px;
}

tr:nth-child(2n) {
  background: #191919;
}

table {
  width: 55vw;
  height: 100vh;
  margin: 50px 0 0 0;
  position: relative;
  z-index: 300;
  /*background: #121212;*/
}
</style>