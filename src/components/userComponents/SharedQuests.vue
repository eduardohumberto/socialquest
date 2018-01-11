<template>
  <div class="layout-padding row justify-center">
    <list-quest v-if="hasResults()" :isReady="isReady" :results="results"></list-quest>
    <h5 class="justify-center" v-else>Ops... Nenhuma Quest foi compartilhada com vc :(</h5>
  </div>
</template>
<script>
  import { Events } from 'quasar'
  import { questsRef, sharedRef } from '../../config/references'
  import ListQuest from '../common/ListQuest.vue'

  export default {
    components: {
      ListQuest
    },
    firebase: {
      quests: questsRef,
      shared: sharedRef
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
      this.getDataQuest().then((result) => {
        self.isReady = true
        console.log(result)
        self.results = result
      })
    },
    methods: {
      changeTitle () {
        Events.$emit('changeTitle', {
          title: 'Compartilhdas de outros usuários',
          subtitle: 'As quests criadas por outro usuários que vocẽ pode votar',
          obj: true
        })
      },
      hasResults () {
        return Object.keys(this.results).length > 0
      },
      async getSharedQuests () {
        let self = this
        return new Promise((resolve,reject) => {
          self.$firebaseRefs.shared.orderByChild('user').equalTo(self.$store.getters['auth/getUser'].uid)
            .on('value', (snapshot) => {
              let val = snapshot.val()
              if (val) {
                resolve(val)
              }
              else {
                resolve(false)
              }
            })
        })
      },
      async getDataQuest () {
        let self = this
        let shared = await this.getSharedQuests()
        return new Promise((resolve, reject) => {
          if (shared) {
            let result = {}
            for (let index in shared) {
              let indexQuest = shared[index].quest
              self.$firebaseRefs.quests.child(indexQuest).on('value', function (snapshot) {
                let resultValue = snapshot.val()
                if (resultValue) {
                  result[indexQuest] = resultValue
                }
              })
            }
            resolve(result)
          }
        })
      }
    }
  }
</script>
