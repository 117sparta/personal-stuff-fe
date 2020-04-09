export default {
  namespaced: true,
  state: {
    isAuth: false,
    userInfo: {}
  },
  getters: {
    userInfo: state => state.userInfo,
    isAuth: state => state.isAuth
  },
  actions: {
    setUserInfo ({ commit }, userInfo) {
      commit('SET_USER_INFO', userInfo);
    },
    setIsAuth ({ commit }, isAuth) {
      commit('SET_IS_AUTH', isAuth);
    }
  },
  mutations: {
    SET_USER_INFO (state, userInfo) {
      state.userInfo = userInfo;
    },
    SET_IS_AUTH (state, isAuth) {
      state.isAuth = isAuth;
    }
  }
};
