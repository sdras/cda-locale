<template>
  <div class="container">
    <table class="scroll">
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
  padding: 5px 8px;
}

tr:nth-child(2n) {
  background: rgba(255, 255, 255, 0.08);
}

.scroll td:nth-of-type(2) {
  width: 100px;
}

table {
  width: 55vw;
  height: 100vh;
  margin: 50px 0 0 0;
  position: relative;
  z-index: 300;
}

.scroll {
  border: 0;
  border-collapse: collapse;
}

.scroll tr {
  display: flex;
}

.scroll td {
  padding: 3px;
  flex: 1 auto;
  width: 1px;
  word-wrap: break;
}

.scroll thead tr:after {
  content: '';
  overflow-y: scroll;
  visibility: hidden;
  height: 0;
}

.scroll thead th {
  flex: 1 auto;
  display: block;
}

.scroll tbody {
  display: block;
  width: 100%;
  overflow-y: auto;
  height: 90vh;
}
</style>