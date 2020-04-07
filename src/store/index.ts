import Vue from 'vue';
import Vuex from 'vuex';
import board from './module/board';
import key from './module/key';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    board,
    key
  }
});
