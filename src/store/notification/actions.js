import { notificationsRef, db } from '../../config/references'
import { Toast } from 'quasar'

export const createNotification = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    let result = notificationsRef.push(payload)
    if (result.key) {
      resolve(result.key)
    }
    else {
      reject(Error('Not has key'))
    }
  })
}

export const listenNotifications = ({commit, rootGetters}, payload) => {
  let notRead = rootGetters['notification/getNotReadNotifications']
  let currentUser = rootGetters['auth/getUser']
  if (!currentUser) return
  notificationsRef.orderByChild('user').equalTo(currentUser.uid).on('value', (snap) => {
    let result = snap.val()
    console.log(result, 'result', notRead)
    if (result) {
      commit('setUserNotifications', result)
      for (let index in result) {
        if (!result[index].status && notRead.indexOf(index) < 0) {
          Toast.create('Você recebeu uma notificação!')
          commit('addCounterNotRead', index)
        }
      }
    }
  })
}

export const clearNotRead = ({rootGetters, commit}, payload) => {
  let objUpdate = {}
  let notReadNotifications = rootGetters['notification/getNotReadNotifications']
  if (notReadNotifications && notReadNotifications.length > 0) {
    for (let index of notReadNotifications) {
      let path = 'notifications/' + index + '/status'
      objUpdate[path] = true
    }
    db.ref().update(objUpdate)
    commit('clearCounterNotRead')
  }
}
