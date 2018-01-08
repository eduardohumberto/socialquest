<template>
  <div class="layout-padding row justify-center">
    <list-quest-edit :isReady="isReady" :results="results" :isTrash="false"></list-quest-edit>
  </div>
</template>
<script>
  import { Events } from 'quasar'
  import { questsRef } from '../../config/references'
  import ListQuestEdit from '../common/ListQuestEdit.vue'
  import store from '../../store/store'

  export default {
    components: {
      ListQuestEdit
    },
    firebase: {
      quests: questsRef
    },
    data () {
      return {
        isReady: false,
        results: []
      }
    },
    created () {
      let self = this
      self.changeTitle()
      this.$firebaseRefs.quests.orderByChild('user').equalTo(store.state['auth'].user.uid).on('value', function (snapshot) {
        self.isReady = true
        let onlyPublished = {}
        let allUserQuests = snapshot.val()
        for (let index in allUserQuests) {
          if (allUserQuests[index].status === 'published' && (!allUserQuests[index].isShared)) {
            onlyPublished[index] = allUserQuests[index]
          }
        }
        self.results = onlyPublished
      })
    },
    methods: {
      changeTitle () {
        Events.$emit('changeTitle', {
          title: 'Quests públicas',
          subtitle: 'As quests criadas por você que todos podem votar',
          obj: true
        })
      }
    }
  }
</script>
