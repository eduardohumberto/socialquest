<template>
  <div class="layout-padding docs-input row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <list-quest :results="results" :isReady="isReady"></list-quest>
    </div>
  </div>
</template>
<script>
  import { Events } from 'quasar'
  import { questsRef,usersRef } from '../../config/references'
  import ListQuest from '../common/ListQuest.vue'

  export default {
    components: {
      ListQuest
    },
    data () {
      return {
        user: this.$store.getters['auth/getUser'],
        isReady: false,
        results: []
      }
    },
    created () {
      let self = this
      this.changeTitle()
      this.$firebaseRefs.quests.orderByChild('countVotes').limitToLast(25).on('value', async function(snapshot) {
        self.isReady = true
        let onlyPublished = {}
        let allUserQuests = snapshot.val()
        for (let index in allUserQuests) {
          if (allUserQuests[index].status === 'published' && (!allUserQuests[index].isShared)) {
            onlyPublished[index] = allUserQuests[index]
            onlyPublished[index].avatar = await self.fetchAvatar(allUserQuests[index].user)
          }
        }
        self.results = onlyPublished
      })
    },
    firebase: {
      quests: questsRef.orderByChild('countVotes').limitToLast(25)
    },
    methods: {
      changeTitle () {
        Events.$emit('changeTitle', {
          title: 'Top Quest',
          subtitle: 'As Quests mais votadas pelos usuários',
          obj: true
        })
      },
      async fetchAvatar (uid) {
        return new Promise( (resolve,reject) =>{
          usersRef.orderByChild('uid').equalTo(uid).on('value', (snap) => {
            let val = snap.val()
            if (val) {
              let key = Object.keys(val)[0]
              resolve((val[key].avatar) ? val[key].avatar : '/statics/user-default.png')
            }
            resolve('/statics/user-default.png')
          })
        })
      },
    }
  }
</script>
