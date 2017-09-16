<template>
  <div>
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
table {
  width: 40vw;
  margin: 50px;
}
</style>