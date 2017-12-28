import Vue from 'vue'


export const addUserQuest = (state, quest) => {
  state.userQuests.push(quest)
}

export const updateUserQuest = (state, quest) => {
  let index = state.userQuests.findIndex(element => element.uid == quest.uid)

  if (index >= 0) {
    Vue.set(state.userQuests, index, quest)
  }
}

export const removeUserQuest = (state, quest) => {
  let index = state.userQuests.findIndex(element => element.uid == quest.uid)

  if (index >= 0) {
    state.userQuests.splice(index, 1)
  }
}
