import firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyAgHP38sdHuJZv-SG-IzfEcBf96nCC1gpQ',
  authDomain: 'socialquest-b5d0d.firebaseapp.com',
  databaseURL: 'https://socialquest-b5d0d.firebaseio.com',
  projectId: 'socialquest-b5d0d',
  storageBucket: 'socialquest-b5d0d.appspot.com',
  messagingSenderId: '838693591015'
}

// initialize firebase
export const app = firebase.initializeApp(config)
