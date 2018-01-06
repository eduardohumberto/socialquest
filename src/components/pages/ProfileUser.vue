<template>
  <div class="layout-padding docs-input row justify-center">
    <div style="width: 600px; max-width: 100vw;">
      <div class="row">
        <div class="col-2">
          <img v-if="!getAvatar()" src="~assets/user-default.png" class="avatar">
          <img v-else :src="getAvatar()" class="avatar">
        </div>
        <div>
          <h6>
            @{{ getUserName() }}<br>
          </h6>
        </div>
      </div>
      <br>
      <list-quest v-if="results" :results="results" :isReady="isReady"></list-quest>
      <q-spinner class="justify-center" style="height: 50px"  v-else/>
    </div>
  </div>
</template>
<script>
  import { QSpinner,Events } from 'quasar'
  import ListQuest from '../common/ListQuest.vue'
  import { questsRef } from '../../config/references'
  import store from '../../store/store'

  export default {
    components: {
      ListQuest,
      QSpinner,
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
      getUserName(){
        return this.$store.getters['auth/getUser'].username
      },
      getAvatar(){
        return (this.$store.getters['auth/getUser'].avatar) ? this.$store.getters['auth/getUser'].username : false
      }
    }
  }
</script>
