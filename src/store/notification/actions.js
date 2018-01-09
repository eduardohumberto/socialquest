import { notificationsRef } from '../../config/references'

export const create = ({commit}, payload) => {
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
