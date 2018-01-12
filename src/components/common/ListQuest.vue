<template>
  <q-list v-if="isReady && results">
    <q-item
      v-for="quest,index in results"
      :key="index"
      class="cursor-pointer"
    >
      <q-item-side v-if="isSelectedByUser(quest)"  icon="done" bg-color="green"/>
      <q-item-side v-else  icon="help" />
      <q-item-main
        @click="singleQuest(index,quest)"
      >
        <q-item-tile label lines="1">{{ quest.name }}</q-item-tile>
        <q-item-tile sublabel lines="1">{{ quest.hashtag_0 | hashtag }} {{ quest.hashtag_1 | hashtag }} {{ quest.hashtag_2 | hashtag }}</q-item-tile>
      </q-item-main>
      <q-item-side right>
        <span>{{ quest.countVotes }} <q-item-tile icon="whatshot" color="red" /></span>

      </q-item-side>
    </q-item>
  </q-list>
</template>
<script>
  import {
    QInput,
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

  export default {
    props: ['results', 'isReady'],
    components: {
      QInput,
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
      }
    },
    filters: {
      hashtag: function (value) {
        if (!value) return ''
        return '#' + value
      }
    },
    methods:{
      isSelectedByUser(quest){
        let indexobj = this.user.uid // get the user uid

        if (quest.allvotes && quest.allvotes[indexobj]){
          return true
        }

        return false
      },
      singleQuest (uid,quest) {
        this.$store.dispatch('quest/setSingleQuest', uid)
        this.$store.dispatch('quest/setObjectQuest', quest)
        this.$router.push('/app/single-quest/' + uid)
      }
    }
  }
</script>
