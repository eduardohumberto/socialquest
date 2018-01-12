import { sharedRef, questsRef } from '../config/references'

export const uniqueId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const isAllowedQuest = async (quest, user, index) => {
  return new Promise((resolve, reject) => {
    if (quest.isShared && quest.user !== user.uid) {
      // verify if user is allowed if the quest is private
      sharedRef.orderByChild('quest').equalTo(index).on('value', (snapshot) => {
        let val = snapshot.val()
        if (val) {
          for (let i in val) {
            if (val[i].user === user.uid) {
              resolve(true)
            }
          }
          resolve('error')
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

export const parseAutocomplete = (array) => {
  return array.map(user => {
    return {
      label: '@' + user.username,
      avatar: (user.avatar) ? user.avatar : '/statics/user-default.png',
      value: user.uid
    }
  })
}
