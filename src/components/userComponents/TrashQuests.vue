<template>
  <div class="layout-padding row justify-center">
    <list-quest-edit v-if="hasResults()" :isReady="isReady" :results="results" :isTrash="true"></list-quest-edit>
    <h5 class="justify-center" v-else>A lixeira está vazia :)</h5>
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
        let onlyTrash = {}
        let allUserQuests = snapshot.val()
        for (let index in allUserQuests) {
          if (allUserQuests[index].status === 'trash') {
            onlyTrash[index] = allUserQuests[index]
          }
        }
        self.results = onlyTrash
      })
    },
    methods: {
      changeTitle () {
        Events.$emit('changeTitle', {
          title: 'Lixeira',
          subtitle: 'Voltar ou excluir permanentemente',
          obj: true
        })
      },
      hasResults () {
        return Object.keys(this.results).length > 0
      }
    }
  }
</script>
