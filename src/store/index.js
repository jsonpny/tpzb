import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    projectTypes: ''
  },
  mutations: {
    setProjectTypes (state, projectTypes) {
      state.projectTypes = projectTypes
    }
  },
  actions: {
  },
  modules: {
  }
})
