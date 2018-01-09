import { app } from '../../config/firebaseConfig'

let db = app.database()
let questsRef = db.ref('quests')
let sharedRef = db.ref('sharedQuest')

export const create = ({commit, dispatch}, payload) => {
  return new Promise((resolve, reject) => {
    if (!payload.quest.user) {
      return false
    }
    let questKey = questsRef.push()
    if (questKey.key) {
      if (payload.quest.isShared) {
        let sharedKey = []
        for (let user of payload.sharedUser) {
          sharedKey.push(sharedRef.push({user: user.value, quest: questKey.key}).key)
        }
        payload.quest['sharedKeys'] = sharedKey
      }
      questKey.set(payload.quest)
      commit('addUserQuest', payload.quest)
      resolve(payload.quest)
    }
  })
}

export const update = ({commit}, payload) => {
  let quest = payload.quest
  return new Promise((resolve, reject) => {
    let objUpdate = {}
    let pathRoot = 'quests/' + quest.uid
    for (let index in quest.alternatives) {
      let path = pathRoot + '/alternatives/' + index + '/name'
      objUpdate[path] = quest.alternatives[index].name
    }

    let fields = ['name', 'description',
      'image', 'updateAt', 'hashtag_0', 'hashtag_1', 'hashtag_2', 'isShared']
    let newPath = ''
    for (let field of fields) {
      newPath = pathRoot + '/' + field
      objUpdate[newPath] = quest[field]
    }

    if (objUpdate) {
      // if there is references
      if (payload.sharedKeys && payload.sharedKeys.length > 0) {
        let sharedKeys = payload.sharedKeys
        for (let i in sharedKeys) {
          sharedRef.child(sharedKeys[i]).remove()
        }
      }
      // add new shared if exists
      if (payload.quest.isShared) {
        let sharedKey = []
        for (let user of payload.sharedUser) {
          sharedKey.push(sharedRef.push({user: user.value, quest: quest.uid}).key)
        }
        newPath = pathRoot + '/sharedKeys'
        objUpdate[newPath] = sharedKey
      }
      else {
        newPath = pathRoot + '/sharedKeys'
        objUpdate[newPath] = null
      }
      db.ref().update(objUpdate)
      commit('updateUserQuest', quest)
      resolve(quest)
    }
  })
}

export const alterQuestStatus = ({commit, rootGetters}, payload) => {
  return new Promise((resolve, reject) => {
    if (payload.user !== rootGetters['auth/getUser'].uid) {
      reject(Error('not owner'))
    }
    else {
      let objUpdate = {}
      let pathRoot = 'quests/' + payload.uid
      let pathStatus = pathRoot + '/status'
      objUpdate[pathStatus] = payload.status
      resolve(db.ref().update(objUpdate))
    }
  })
}

export const saveVote = ({rootGetters}, payload) => {
  let singleRef = questsRef.child(rootGetters['quest/getSingleQuest'])
  let obj = {} // new object
  let indexobj = rootGetters['auth/getUser'].uid // get the user uid
  obj[indexobj] = payload.index // add the user uid as a property and the alternative as value

  if (payload.quest.allvotes && payload.quest.allvotes[indexobj]) {
    let remove = payload.quest.allvotes[indexobj]
    if (remove === payload.index) {
      singleRef.child('/alternatives/' + remove + '/votes/' + indexobj).remove()
      singleRef.child('/allvotes/' + indexobj).remove()
      singleRef.child('/countVotes/').set(--payload.quest.countVotes)
    }
    else {
      singleRef.child('/alternatives/' + remove + '/votes/' + indexobj).remove()
      singleRef.child('/alternatives/' + payload.index + '/votes/' + indexobj).set(payload.index)
      singleRef.child('/allvotes/' + indexobj).set(payload.index)
    }
  }
  else {
    singleRef.child('/alternatives/' + payload.index + '/votes/' + indexobj).set(payload.index)
    singleRef.child('/allvotes/' + indexobj).set(payload.index)
    singleRef.child('/countVotes/').set((payload.quest.countVotes) ? ++payload.quest.countVotes : 1)
  }
}

export const deleteQuest = ({rootGetters}, payload) => {
  return new Promise((resolve, reject) => {
    if (payload.user !== rootGetters['auth/getUser'].uid) {
      reject(Error('not owner'))
    }
    else {
      questsRef.child(payload.uid).remove()
      resolve(true)
    }
  })
}

export const setSingleQuest = ({commit}, quest) => {
  commit('setSingleQuest', quest)
}

export const setObjectQuest = ({commit}, quest) => {
  commit('setObjectQuest', quest)
}
