<template>
  <div class="layout-padding docs-input row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <list-quest :results="results" :isReady="isReady"></list-quest>
    </div>
  </div>
</template>
<script>
  import { questsRef } from '../../config/references'
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
      this.$firebaseRefs.quests.orderByChild('countVotes').limitToLast(25).on('value', function(snapshot) {
        self.isReady = true
        let onlyPublished = {}
        let allUserQuests = snapshot.val()
        for (let index in allUserQuests) {
          if (allUserQuests[index].status === 'published') {
            onlyPublished[index] = allUserQuests[index]
          }
        }
        self.results = onlyPublished
      })
    },
    firebase: {
      quests: questsRef.orderByChild('countVotes').limitToLast(25)
    }
  }
</script>
