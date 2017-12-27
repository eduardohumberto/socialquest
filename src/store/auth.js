import firebase from 'firebase'
import router from '../router'
import { app } from '../config/firebaseConfig'

let db = app.database()
let usersRef = db.ref('users')

export default {
  namespaced: true,
  state: {
    user: null
  },
  mutations: {
    storeUser (state, user) {
      state.user = user
    },
    clearAuthData (state) {
      state.user = null
    }
  },
  actions: {
    signup ({commit, dispatch}, authData) {
      return new Promise((resolve, reject) => {
        firebase.auth()
          .createUserWithEmailAndPassword(authData.email, authData.password)
          .then(
            user => {
              console.log('success', user)
              dispatch('storeUser', { uid: user.uid, cpf: authData.cpf, email: authData.email})
              resolve(authData)
            },
            error => {
              reject(error.message)
            }
          )
      })
    },
    login ({commit}, authData) {
      return new Promise((resolve, reject) => {
        firebase.auth()
          .signInWithEmailAndPassword(authData.email, authData.password)
          .then(
            user => {
              // this.$router.replace('dashboard');
              let dbRef = "users/email/"+ authData.email;
              db.ref(dbRef).once('value', snap => {
                console.log(snap.val(), dbRef);
                commit('storeUser', snap);
                resolve(user)
              })
            },
            error => {
              reject(error.message)
            }
          )
      })
    },
    logout ({commit}) {
      commit('clearAuthData')
      firebase.auth().signOut()
      router.replace('/')
    },
    storeUser ({state,commit}, userData) {
      if (state.user) {
        return
      }
      let user = usersRef.push(userData)
      commit('storeUser', user)
      console.log( user )
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    isAuthenticated (state) {
      return state.user !== null
    }
  }
}
