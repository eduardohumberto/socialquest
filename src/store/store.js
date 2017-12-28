import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import upload from './upload'
import quest from './quest/index'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    upload,
    quest
  }
})
