import { app } from '../../config/firebaseConfig'

let db = app.database()
let questsRef = db.ref('quests')

export const create = ({commit, dispatch}, quest) => {
  return new Promise((resolve, reject) => {
    if (!quest.user) {
      return false
    }
    let userkey = questsRef.push(quest)
    if(userkey.key){
      commit('addUserQuest', quest )
      resolve(quest)
    }
  })
}

export const setSingleQuest = ({commit}, quest) => {
  commit('setSingleQuest', quest )
}
