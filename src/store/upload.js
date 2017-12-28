import firebase from 'firebase'
// import { app } from '../config/firebaseConfig'

const storageRef = firebase.storage().ref();;

export default {
  namespaced: true,
  state: {
    status: null
  },
  mutations: {
    changeStatus (state, status) {
      state.status = status
    }
  },
  actions: {
    upload ({commit, dispatch}, file) {
      return new Promise((resolve, reject) => {
        // Upload file and metadata to the object 'images/mountains.jpg'
        let uploadTask = storageRef.child('quests/' + file.name).put(file);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }, function (error) {
            reject( error.code )
          }, function () {
            // Upload completed successfully, now we can get the download URL
            resolve( uploadTask.snapshot.downloadURL)
          });
      })
    }
  },
  getters: {
    status (state) {
      return state.status
    }
  }
}
