<template>
  <div class="layout-padding docs-input row justify-center">
    <div style="width: 600px; max-width: 100vw;">
      <div class="row">
        <div class="col-2">
          <img src="~assets/main-logo.png" class="avatar">
        </div>
        <div>
          <h6>
            Nome completo do usuarios<br>
            <small>@blur</small>
          </h6>
        </div>
      </div>
      <br>
      <list-quest v-if="results" :results="results" :isReady="isReady"></list-quest>
    </div>
  </div>
</template>
<script>
  import { Events } from 'quasar'
  import ListQuest from '../common/ListQuest.vue'
  import { questsRef } from '../../config/references'
  import store from '../../store/store'

  export default {
    components: {
      ListQuest
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
      this.$firebaseRefs.quests.orderByChild('user').equalTo(store.state['auth'].user.uid).on('value', function(snapshot) {
        self.isReady = true
        let onlyPublished = {}
        let allUserQuests = snapshot.val()
        for (let index in allUserQuests) {
          if (allUserQuests[index].status === 'published' && (!allUserQuests[index].isShared) ) {
            onlyPublished[index] = allUserQuests[index]
          }
        }
        self.results = onlyPublished
      })
    },
    methods: {
      changeTitle () {
        Events.$emit('changeTitle', {
          title: 'Perfil',
          subtitle: '',
          obj: true
        })
      },
    }
  }
</script>
