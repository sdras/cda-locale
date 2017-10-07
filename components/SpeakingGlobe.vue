<template>
  <div>
    <div id="container"></div>

    <div class="yeartoggle hidden">
      <span v-for="year in yearsFlat" key="year" class="year" :id="year">{{year}}</span>
    </div>

  </div>
</template>

<script>
import * as THREE from 'three';
import { createGlobe } from './../mixins/createGlobe';

export default {
  mixins: [createGlobe],
  props: {
    filteredData: {
      type: Array,
      required: true,
      default: () => []
    },
  },
  computed: {
    speakerData() {
      // we're getting this data from the vuex store, so it's best as a computed value
      return this.$store.state.speakerData;
    },
    yearsArr() {
      //create it as an object first because that's more efficient than an array
      let endUnit = {};
      this.filteredData.forEach(function(index) {
        //we'll need to get the year from the end of the string
        let year = index.From.substr(index.From.length - 4),
          lat = index.Latitude,
          long = index.Longitude,
          key = lat + ', ' + long,
          magBase = 0.1;

        if (lat === undefined || long === undefined) return;
        //because the pins are grouped together by magnitude, as we build out the data, we need to check if one exists or increment the value
        if (year in endUnit) {

          //if we already have this location (stored together as key) let's increment it
          if (key in endUnit[year]) {
            endUnit[year][key][2] += magBase
          } else {
            endUnit[year][key] = [lat, long, magBase]
          }
        } else {
          let y = {};
          y[key] = [lat, long, magBase];
          endUnit[year] = y
        }

      })

      let x = Object.entries(endUnit);
      let area = [],
        year,
        places;
      for (let i = 0; i < x.length; i++) {
        [year, places] = x[i];
        area.push([year, [].concat(...Object.values(places))])
      }
      console.log(area)
      return area;
    },
    yearsFlat() {
      //we really just need the two years so for easy retrieval, let's flatten and condense it
      let x = [].concat.apply([], this.yearsArr);
      x = x.filter((_, i) => (i + 1) % 2);
      return x;
    }
  },
}
</script>

<style scoped>
html {
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
  color: #ffffff;
  font-family: sans-serif;
  font-size: 13px;
  line-height: 20px;
  height: 100%;
}

#container {
  width: 60%;
  height: 70%;
  position: fixed;
  right: -100px;
  top: 20%;
}

@media (max-width: 800px) {
  #container {
    width: 100%;
    height: 40%;
    position: absolute;
    left: 40px;
    top: 150px;
  }
}

#info {
  font-size: 11px;
  position: absolute;
  bottom: 5px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 3px;
  right: 10px;
  padding: 10px;
}

#currentInfo {
  width: 270px;
  position: absolute;
  left: 500px;
  top: 50px;
  background-color: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.4);
  padding: 10px;
}

a {
  color: #aaa;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.bull {
  padding: 0 5px;
  color: #555;
}

#title {
  position: absolute;
  top: 20px;
  width: 270px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  font-size: 20px;
  padding: 10px;
}

.year {
  font-size: 16px;
  line-height: 26px;
  height: 30px;
  text-align: center;
  float: left;
  width: 90px;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  -webkit-transition: all 0.1s ease-out;
}

.year:hover,
.year.active {
  font-size: 23px;
  color: #fff;
}

.yeartoggle {
  position: fixed;
  top: 50px;
  right: 60px;
}
</style>