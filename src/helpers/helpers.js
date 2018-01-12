import { sharedRef } from '../config/references'

export const uniqueId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const isAllowedQuest = async (quest, user) => {
  return new Promise((resolve, reject) => {
    if (quest.isShared && quest.user !== user.uid) {
      // verify if user is allowed if the quest is private
      sharedRef.orderByChild('user').equalTo(user.uid).on('value', (snapshot) => {
        let val = snapshot.val()
        if (val) {
          resolve(true)
        }
        else {
          resolve('error')
        }
      })
    }
    else {
      resolve(true)
    }
  })
}
