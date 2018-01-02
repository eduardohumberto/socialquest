import { app } from '../../config/firebaseConfig'

let db = app.database()
let questsRef = db.ref('quests')

export const create = ({commit, dispatch}, quest) => {
  return new Promise((resolve, reject) => {
    if (!quest.user) {
      return false
    }
    let userkey = questsRef.push(quest)
    if (userkey.key) {
      commit('addUserQuest', quest)
      resolve(quest)
    }
  })
}

export const update = ({commit}, quest) => {
  return new Promise((resolve, reject) => {
    let objUpdate = {}
    let pathRoot = 'quests/' + quest.uid
    for (let index in quest.alternatives) {
      let path = pathRoot + '/alternatives/' + index + '/name'
      objUpdate[path] = quest.alternatives[index].name
    }

    let pathName = pathRoot + '/name'
    objUpdate[pathName] = quest.name
    let pathDescription = pathRoot + '/description'
    objUpdate[pathDescription] = quest.description
    let pathImage = pathRoot + '/image'
    objUpdate[pathImage] = quest.image
    let pathUpdate = pathRoot + '/updateAt'
    objUpdate[pathUpdate] = quest.updateAt

    let userkey = db.ref().update(objUpdate)
    if (userkey) {
      commit('updateUserQuest', quest)
      resolve(quest)
    }
  })
}

export const alterQuestStatus = ({commit, rootGetters},payload) => {
  return new Promise((resolve, reject) => {
    if (payload.user !== rootGetters['auth/getUser'].uid){
      reject(Error('not owner'))
    } else {
      let objUpdate = {}
      let pathRoot = 'quests/' + payload.uid
      let pathStatus = pathRoot + '/status'
      objUpdate[pathStatus] = payload.status
      resolve(db.ref().update(objUpdate))
    }
  });
}


export const setSingleQuest = ({commit}, quest) => {
  commit('setSingleQuest', quest)
}
