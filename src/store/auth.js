import firebase from 'firebase'
import router from '../router'
import { usersRef } from '../config/references'

const saveLocal = (token, user) => {
  const now = new Date()
  const expirationDate = new Date(now.getTime() + 3600 * 1000)
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('expirationDate', expirationDate)
  return expirationDate
}

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
    setLogoutTimer ({commit}, expirationTime) {
      setTimeout(() => {
        commit('clearAuthData')
      }, expirationTime * 1000)
    },
    signup ({commit, dispatch}, authData) {
      return new Promise((resolve, reject) => {
        firebase.auth()
          .createUserWithEmailAndPassword(authData.email, authData.password)
          .then(
            user => {
              let newUser = { uid: user.uid, cpf: authData.cpf, email: authData.email }
              dispatch('storeUser', newUser)
              saveLocal(user.refreshToken, newUser)
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
              let responseUser = user
              // this.$router.replace('dashboard');
              usersRef.orderByChild('email').equalTo(authData.email).on('value', function(snapshot) {
                let user = snapshot.val()
                for ( let index in user){
                  commit('storeUser', user[index])
                  saveLocal(responseUser.refreshToken, user[index])
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
    tryAutoLogin ({commit}) {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }
      const expirationDate = new Date(localStorage.getItem('expirationDate'))
      const now = new Date()
      if (now >= expirationDate) {
        return
      }
      const user = JSON.parse(localStorage.getItem('user'))
      commit('storeUser', user)
    },
    logout ({commit}) {
      commit('clearAuthData')
      localStorage.removeItem('expirationDate')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
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
    getUser (state) {
      return state.user
    },
    isAuthenticated (state) {
      return state.user !== null
    }
  }
}
