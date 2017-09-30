import Vuex from 'vuex';
import speakerData from './../assets/cda-data.json';

const createStore = () => {
  return new Vuex.Store({
    state: {
      speakingColumns: ['Name', 'Conference', 'From', 'To', 'Location'],
      speakerData
    }
  });
};

export default createStore;
