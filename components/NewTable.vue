<template>
  <div class="tablecontain">
    <label for="filterLabel">Filter By</label>
    <select id="filterLabel" name="select" v-model="selectedFilter">
      <option v-for="column in columns" key="column" :value="column">
        {{ column }}
      </option>
    </select>
    <span v-if="selectedFilter">
      <label for="filterText" class="hidden">{{ selectedFilter }}</label>
      <input id="filteredText" type="text" name="textfield" v-model="filteredText"></input>
    </span>
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
            {{ post[entry] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filteredText: '',
      selectedFilter: ''
    }
  },
  methods: {
    sortHighest() {
      this.ratingsInfo.sort((a, b) => a.rating < b.rating ? 1 : -1);
    }
  },
  computed: {
    speakerData() {
      return this.$store.state.speakerData;
    },
    columns() {
      return this.$store.state.speakingColumns;
    },
    filteredData() {
      const x = this.selectedFilter,
        filter = new RegExp(this.filteredText, 'i')
      return this.speakerData.filter(el => {
        if (el[x] !== undefined) { return el[x].match(filter) }
        else return true;
      })
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

p {
  color: #80B822;
}

input,
select,
option {
  font-family: "Open Sans", 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

select,
input[type="text"] {
  margin: 0 0 0 8px;
  background: transparent;
  color: #b1afb8;
  font-size: 16px;
  border: 1px solid #4f4d53;
  line-height: 20px;
  position: relative;
  z-index: 3000;
  border-radius: 4px;
  padding: 2px 0;
}


input[type="text"] {
  background: #121212;
  transition: 0.3s all ease;
}

.hidden {
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

tr:nth-child(2n) {
  background: rgba(255, 255, 255, 0.08);
}

.scroll td:nth-of-type(2) {
  width: 100px;
}

.tablecontain {
  margin: 50px 0 0 0;
}

table {
  width: 55vw;
  height: 100vh;
  position: relative;
  z-index: 300;
  margin-top: 15px;
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