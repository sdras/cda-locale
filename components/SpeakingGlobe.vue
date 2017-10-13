<template>
  <div id="container">
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
    teamsArr() {
      //create it as an object first because that's more efficient than an array
      var endUnit = {};

      this.filteredData.forEach(function(index) {
        //we'll need to get the year from the end of the string
        let lat = index.Latitude,
          long = index.Longitude,
          key = lat + ", " + long,
          magBase = 0.1,
          val = 'Microsoft CDAs';

        if (lat === undefined || long === undefined) return;

        if (val in endUnit) {
          //if we already have this location (stored together as key) let's increment it
          if (key in endUnit[val]) {
            endUnit[val][key][2] += magBase;
          } else {
            endUnit[val][key] = [lat, long, magBase];
          }
        } else {
          let y = {};
          y[key] = [lat, long, magBase];
          endUnit[val] = y;
        }
      });

      let x = Object.entries(endUnit);
      let area = [],
        places,
        all;

      for (let i = 0; i < x.length; i++) {
        [all, places] = x[i];
        area.push([all, [].concat(...Object.values(places))]);
      }
      return area;
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