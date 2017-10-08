<template>
  <table class="scroll">
    <thead>
      <tr>
        <th v-for="key in columns">
          {{ key }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(post, i) in filteredData">
        <td v-for="entry in columns">
          <a :href="post.Link" target="_blank">
            {{ post[entry] }}
          </a>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    filteredData: {
      type: Array,
      required: true,
      default: () => []
    },
  },
  computed: {
    speakerData() {
      return this.$store.state.speakerData;
    },
    columns() {
      return this.$store.state.speakingColumns;
    },
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

p {
  color: #80B822;
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
  position: relative;
  z-index: 300;
  margin-top: 15px;
}

@media (max-width: 800px) {
  table {
    width: 200vw;
    overflow-y: scroll;
  }
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

@supports (-ms-ime-align: auto) {
  /* Microsoft EdgeV13&14 CSS styles go here */
  .scroll td {
    padding: 3px 35px !important;
    flex: none !important;
    width: 130px;
  }
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