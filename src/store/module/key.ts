export default {
  namespaced: true,
  state: {
    publicKey: '',
    rsaKey: ''
  },
  getters: {
    publicKey: (state) => state.publicKey,
    rsaKey: (state) => state.rsaKey
  },
  actions: {
    setPublicKey: ({ commit }, publicKey) => {
      commit('SET_PUBLIC_KEY', publicKey);
    },
    setRSAKey: ({ commit }, rsaKey) => {
      commit('SET_RSA_KEY', rsaKey);
    }
  },
  mutations: {
    SET_PUBLIC_KEY: (state, publicKey) => {
      state.publicKey = publicKey;
    },
    SET_RSA_KEY: (state, rsaKey) => {
      state.rsaKey = rsaKey;
    }
  }
};
