const state = {
  createDay: null,
  fontCount: null,
}

const actions = {

}

const mutations = {
  changeCreateDay(state, date) {
    state.createDay = date.countDay;
    state.fontCount = date.fontCount;
  }
}

export default {
  state, actions, mutations
}