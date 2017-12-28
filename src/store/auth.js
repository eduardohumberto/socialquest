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
    login ({commit,dispatch}, authData) {
      return new Promise((resolve, reject) => {
        firebase.auth()
          .signInWithEmailAndPassword(authData.email, authData.password)
          .then(
            user => {
              // this.$router.replace('dashboard');
              usersRef.orderByChild('email').equalTo(authData.email).on('value', function(snapshot) {
                let user = snapshot.val()
                for ( let index in user){
                  commit('storeUser', user[index])
                  resolve(user[index])
                }
              });
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
        return false;
      }
      let user = usersRef.push(userData)
      commit('storeUser', userData)
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
