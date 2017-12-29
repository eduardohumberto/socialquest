<template>
  <div class="layout-padding docs-progress row justify-center">
    <div style="width: 500px; max-width: 90vw;" v-if="quest">
      <h5>{{ quest.name }}</h5>

      <p class="caption" v-if="quest.description">
        <span>
          On a real mobile device the Progress bars
          are much thinner by default.
        </span>
      </p>
       <div
         class="row justify-center"
         v-for="alternative, index in quest.alternatives"
        @click="vote(alternative, index)"
       >
         <p  class="col-12">{{ alternative.name }}</p>
         <div class="col-8"><q-progress :percentage="percentagem(alternative.votes)" color="positive" /></div>
         <div class="col">
           <span class="margin-progress">
             {{ (alternative.votes) ? alternative.votes.length : 0  }} votos / {{ percentagem (alternative.votes) }}%
           </span>
         </div>
       </div>
    </div>
    <q-spinner  v-else/>
  </div>
</template>
<script>
  import { QProgress, QBtn, QSpinner } from 'quasar'
  import { questsRef, db } from '../../config/references'


  export default {
    components: {
      QProgress,
      QBtn,
      QSpinner
    },
    data () {
      return {
        id: this.$route.params.uid,
        quest: null
      }
    },
    created () {
      let self = this
      this.$firebaseRefs.quests.child(this.id).on('value', function(snapshot) {
        self.quest = snapshot.val()
      })
    },
    firebase: {
      quests: questsRef
    },
    methods: {
      vote(alternative,index){
        let user = this.$store.getters['auth/getUser']
        let obj = {}
        let indexobj = user.uid
        obj[indexobj] = index
        this.$firebaseRefs.quests.child(this.id + '/alternatives/' + index + '/votes' ).set(obj)
        this.$firebaseRefs.quests.child(this.id + '/allvotes/' ).set(obj)
      },
      percentagem (votesArray) {
        if (!votesArray) {
          return 0
        }

        return (Object.keys(votesArray).length / Object.keys(this.quest.allvotes).length ) * 100
      }
    }
  }
</script>

<style >
  .margin-progress {
    margin-left:10px;
  }
</style>
