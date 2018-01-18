<template>
  <div class="layout-padding docs-input row justify-center">
    <div
      v-if="isReady"
      style="width: 600px; max-width: 100vw;">
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
      <list-quest v-if="hasResults()" :results="results" :isReady="isReady"></list-quest>
      <h5 class="justify-center" v-else>Ops... Nenhuma Quest encontrada :(</h5>
    </div>
    <q-spinner color="teal-4" size="90px"  v-else/>
  </div>
</template>
<script>
  import { QSpinner,Events } from 'quasar'
  import ListQuest from '../common/ListQuest.vue'
  import { questsRef, usersRef } from '../../config/references'

  export default {
    components: {
      ListQuest,
      QSpinner
    },
    firebase: {
      quests: questsRef
    },
    data () {
      return {
        isReady: false,
        results: [],
        user: null
      }
    },
    created () {
      let self = this
      self.changeTitle()
      if (this.$route.params) {
        usersRef.orderByChild('uid').equalTo(this.$route.params.uid).on('value', (snapshot) => {
          let user = snapshot.val()
          if (user) {
            let key = Object.keys(user)[0]
            self.user = user[key]
            self.$firebaseRefs.quests.orderByChild('user').equalTo(this.$route.params.uid).on('value', function(snapshot) {
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
          }
        })
      }
    },
    methods: {
      changeTitle () {
        Events.$emit('changeTitle', {
          title: 'Perfil',
          subtitle: '',
          obj: true
        })
      },
      getUserName () {
        return this.user.username
      },
      getAvatar () {
        return (this.user.avatar) ? this.user.avatar : false
      },
      hasResults () {
        return Object.keys(this.results).length > 0
      }
    }
  }
</script>
