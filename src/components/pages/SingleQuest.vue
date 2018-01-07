<template>
  <div class="layout-padding docs-progress row justify-center">
    <div style="width: 500px; max-width: 90vw;" v-if="quest">
      <h5>{{ quest.name }}</h5>

      <p class="caption" v-if="quest.description">
        <span>
          {{ quest.description }}
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
    <q-spinner style="height: 30px;" v-else/>
  </div>
</template>
<script>
  import { QProgress, QBtn, QSpinner, QChip, Events } from 'quasar'
  import { questsRef } from '../../config/references'
  import store from '../../store/store'

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
      self.changeTitle()
      this.$firebaseRefs.quests.child(self.$store.getters['quest/getSingleQuest']).on('value', function(snapshot) {
        self.quest = snapshot.val()
      })
    },
    firebase: {
      quests: questsRef
    },
    methods: {
      changeTitle () {
        Events.$emit('changeTitle', {
          title: 'Votar',
          subtitle: 'Escolha ou altere uma das alternativas',
          obj: true
        })
      },
      vote(alternative,index){
        this.$store.dispatch('quest/saveVote', { index, quest: this.quest })
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
