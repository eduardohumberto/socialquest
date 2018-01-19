// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

// Uncomment the following lines if you need IE11/Edge support
// require(`quasar/dist/quasar.ie`)
// require(`quasar/dist/quasar.ie.${__THEME}.css`)

import Vue from 'vue'
import Quasar from 'quasar'
import router from './router'
import Vuelidate from 'vuelidate'
import firebase from 'firebase'
import VueFire from 'vuefire'
import { usersRef,db } from './config/references'
import { saveLocal } from './helpers/helpers'

Vue.use(Vuelidate)
Vue.use(VueFire)

Vue.config.productionTip = false
Vue.use(Quasar) // Install Quasar Framework

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
import 'quasar-extras/ionicons'
import 'quasar-extras/fontawesome'
import 'quasar-extras/animate'
import store from './store/store'
import { AddressbarColor, Loading } from 'quasar'
AddressbarColor.set('blue')

/* eslint-disable no-new */
new Vue({
  el: '#q-app',
  router,
  store,
  created () {},
  render: h => h(require('./App').default)
})

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    router.push('/app')
  }
  else {
    router.push('/')
  }
})
