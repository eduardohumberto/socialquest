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
         class="row justify-center cursor-pointer generic-margin"
         v-for="alternative, index in quest.alternatives"
        @click="vote(alternative, index)"
       >

         <p v-if="isSelectedByUser(index)" class="col-12">
           <q-chip
             icon-right="done"
             color="secondary">
             {{ alternative.name }}
           </q-chip>
         </p>
         <p v-else class="col-12">{{ alternative.name }}</p>

         <div class="col-12">
           <q-progress
             :percentage="percentagem(alternative.votes)"
             stripe animate style="height: 20px"
             color="positive" /></div>
         <div class="col-12">
           <span class="margin-progress">
             {{ (alternative.votes) ? Object.keys(alternative.votes).length : 0  }} votos / {{ percentagem (alternative.votes) }}%
           </span>
         </div>
         <hr>
       </div>
    </div>
    <q-spinner  v-else/>
  </div>
</template>
<script>
  import { QProgress, QBtn, QSpinner,QChip } from 'quasar'
  import { questsRef, db } from '../../config/references'


  export default {
    components: {
      QProgress,
      QBtn,
      QSpinner,
      QChip
    },
    data () {
      return {
        id: this.$route.params.uid,
        quest: null,
        user: this.$store.getters['auth/getUser']
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
        let obj = {} // new object
        let indexobj = this.user.uid // get the user uid
        obj[indexobj] = index // add the user uid as a property and the alternative as value

        if (this.quest.allvotes && this.quest.allvotes[indexobj]){
          let remove = this.quest.allvotes[indexobj]
          if (remove === index) {
            this.$firebaseRefs.quests.child(this.id + '/alternatives/' + remove + '/votes/' + indexobj).remove()
            this.$firebaseRefs.quests.child(this.id + '/allvotes/' + indexobj).remove()
          } else {
            this.$firebaseRefs.quests.child(this.id + '/alternatives/' + remove + '/votes/' + indexobj).remove()
            this.$firebaseRefs.quests.child(this.id + '/alternatives/' + index + '/votes' ).set(obj)
            this.$firebaseRefs.quests.child(this.id + '/allvotes/' ).set(obj)
          }
        } else {
          this.$firebaseRefs.quests.child(this.id + '/alternatives/' + index + '/votes' ).set(obj)
          this.$firebaseRefs.quests.child(this.id + '/allvotes/' ).set(obj)
        }
      },
      percentagem (votesArray) {
        if (!votesArray) {
          return 0
        }

        return (Object.keys(votesArray).length / Object.keys(this.quest.allvotes).length ) * 100
      },
      isSelectedByUser(alternative){
        let indexobj = this.user.uid // get the user uid

        if (this.quest.allvotes && this.quest.allvotes[indexobj]){
          let voteUser = this.quest.allvotes[indexobj]
          return (alternative === voteUser) ? true : false
        }

        return false
      }
    }
  }
</script>

<style >
  .margin-progress {
    margin-left:10px;
  }
</style>
