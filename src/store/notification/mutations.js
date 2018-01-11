export const setUserNotifications = (state, notifications) => {
  state.userNotifications = notifications
}

export const addCounterNotRead = (state, qtd) => {
  state.notificationsNotRead.push(qtd)
}

export const clearCounterNotRead = (state) => {
  state.notificationsNotRead = []
}

