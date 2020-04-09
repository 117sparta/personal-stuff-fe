import Vue from 'vue';
import Vuex from 'vuex';
import board from './module/board';
import key from './module/key';
import user from './module/user';

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
    key,
    user
  }
});
