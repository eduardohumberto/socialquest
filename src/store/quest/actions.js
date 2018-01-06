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
      // TODO: insert specific node for each shareQuest shareQuest { quest:uid user:uid}
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
      // TODO: remove all previous shared nodes and insert specific node for each  shareQuest { quest:uid user:uid}
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

export const saveVote = ({rootGetters}, payload) => {
  let singleRef = questsRef.child(rootGetters['quest/getSingleQuest'])
  let obj = {} // new object
  let indexobj = rootGetters['auth/getUser'].uid // get the user uid
  obj[indexobj] = payload.index // add the user uid as a property and the alternative as value

  if (payload.quest.allvotes && payload.quest.allvotes[indexobj]){
    let remove = payload.quest.allvotes[indexobj]
    if (remove === payload.index) {
      singleRef.child('/alternatives/' + remove + '/votes/' + indexobj).remove()
      singleRef.child('/allvotes/' + indexobj).remove()
      singleRef.child('/countVotes/').set(--payload.quest.countVotes)
    } else {
      singleRef.child('/alternatives/' + remove + '/votes/' + indexobj).remove()
      singleRef.child('/alternatives/' + payload.index + '/votes/' + indexobj).set(payload.index)
      singleRef.child('/allvotes/' + indexobj).set(payload.index)
    }
  } else {
    singleRef.child('/alternatives/' +  payload.index + '/votes/' + indexobj).set(payload.index)
    singleRef.child('/allvotes/' + indexobj).set(payload.index)
    singleRef.child('/countVotes/').set((payload.quest.countVotes) ? ++payload.quest.countVotes : 1)
  }
}

export const setSingleQuest = ({commit}, quest) => {
  commit('setSingleQuest', quest)
}
