<template>
  <q-list v-if="isReady">
    <q-item
      v-for="quest,index in results"
      :key="index"
    >
      <q-item-side v-if="isSelectedByUser(quest)"  icon="done" bg-color="green"/>
      <q-item-side v-else  icon="help" />
      <q-item-main
        @click="singleQuest(index)"
        >
        <q-item-tile label lines="1">{{ quest.name }}</q-item-tile>
        <q-item-tile sublabel lines="1"> --hashtags--</q-item-tile>
      </q-item-main>
      <q-item-side right>
        <span>{{ quest.countVotes }} <q-item-tile icon="whatshot" color="red" /></span>

      </q-item-side>
    </q-item>
  </q-list>
</template>
<script>
  import {
    QList,
    QListHeader,
    QItem,
    QItemSeparator,
    QItemSide,
    QItemMain,
    QItemTile,
    QChip,
    QPopover
  } from 'quasar'
  import { questsRef } from '../../config/references'

  export default {
    components: {
      QList,
      QListHeader,
      QItem,
      QItemSeparator,
      QItemSide,
      QItemMain,
      QItemTile,
      QChip,
      QPopover
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
    },
    methods:{
      singleQuest (uid) {
        this.$store.dispatch('quest/setSingleQuest', uid)
        this.$router.push('/app/single-quest/' + uid)
      },
      isSelectedByUser(quest){
        let indexobj = this.user.uid // get the user uid

        if (quest.allvotes && quest.allvotes[indexobj]){
          return true
        }

        return false
      }
    }
  }
</script>
