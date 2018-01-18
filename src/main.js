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
  created () {
    firebase.auth().getRedirectResult().then(function (result) {
      if (result.user) {
        usersRef.orderByChild('uid').equalTo(result.user.uid).on('value', (snap) => {
          let val = snap.val()
          if (val) {
            let objUpdte = {}
            let key = Object.keys(val)
            let path = 'users/' + key + '/avatar'
            objUpdte[path] = result.user.photoURL
            db.ref().update(objUpdte)
            store.dispatch('auth/externalLogin', {user: val[key], refreshToken: result.user.refreshToken})
          }
          else {
            let username = result.user.email.split('@')[0]
            let newUser = {uid: result.user.uid, username: username, email: result.user.email, avatar: result.user.photoURL}
            store.dispatch('auth/storeUser', newUser)
            saveLocal(result.user.refreshToken, newUser)
          }
          router.push('/app')
        })
      }
    }).catch((error) => {
      console.log(error)
    })

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$router.push('/app')
      }
      else {
        this.$router.push('/')
      }
    })
  },
  render: h => h(require('./App').default)
})
