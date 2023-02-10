const state = {
  sendToEditor: {},
  isCollect: false,
}

const actions = {

}

const mutations = {
  sendToEditor(state, content) {
    state.sendToEditor = content;
  },

  changeColectStatus(state, flag) {
    state.isCollect = flag;
  }
}

export default {
  state, actions, mutations
}