export default {
  namespaced: true,
  state: {
    publicKey: ''
  },
  getters: {
    publicKey: (state) => state.publicKey
  },
  actions: {
    setPublicKey: ({ commit }, publicKey) => {
      commit('SET_PUBLIC_KEY', publicKey);
    }
  },
  mutations: {
    SET_PUBLIC_KEY: (state, publicKey) => {
      state.publicKey = publicKey;
    }
  }
};
