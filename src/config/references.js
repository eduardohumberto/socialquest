import { app } from './firebaseConfig'

export const db = app.database()
export const questsRef = db.ref('quests')
export const usersRef = db.ref('users')
export const sharedRef = db.ref('sharedQuest')
