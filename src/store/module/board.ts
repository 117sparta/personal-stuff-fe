export default {
  namespaced: true,
  state: {
    boardList: []
  },
  getters: {
    boardList: (state) => state.boardList
  },
  actions: {
    setBoardList: ({ commit }, boardList) => {
      commit('SET_BOARD_LIST', boardList);
    }
  },
  mutations: {
    SET_BOARD_LIST: (state, boardList) => {
      state.boardList = boardList;
    }
  }
};
