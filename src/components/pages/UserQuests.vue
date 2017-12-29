<template>

  <div class="layout-padding row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <q-list highlight inset-separator v-if="quests">
        <q-item
          class="cursor-pointer"
          multiline
          v-for="quest in quests"
          @click="singleQuest(quest['.key'])"
          :key="quest['.key']">
          <q-item-side v-if="quest.image"  :avatar="quest.image" />
          <q-item-side v-else  icon="help" />
          <q-item-main
            :label="quest.name"
            label-lines="2"
            :sublabel="quest.description"
            sublabel-lines="2"
          />
          <q-item-side right :stamp="parseDate(quest.createdAt)" />
        </q-item>
      </q-list>
    </div>
  </div>
</template>
<script>
  import {
    QCard,
    QCardTitle,
    QCardMedia,
    QCardActions,
    QCardSeparator,
    QCardMain,
    QList,
    QItem,
    QItemMain,
    QItemSide,
    QItemTile,
    date
  } from 'quasar'
  import { questsRef } from '../../config/references'
  import store from '../../store/store'
  import router from '../../router'

  export default {
    components: {
      QCard,
      QCardTitle,
      QCardMedia,
      QCardActions,
      QCardSeparator,
      QCardMain,
      QList,
      QItem,
      QItemMain,
      QItemSide,
      QItemTile
    },
    firebase: {
      quests: questsRef.orderByChild('user').equalTo(store.state['auth'].user.uid).limitToLast(25)
    },
    methods: {
      parseDate (timestamp) {
        return (timestamp) ? date.formatDate(timestamp, 'D/M/YY') : ''
      },
      singleQuest (uid) {
        this.$router.push('/app/single-quest/'+uid)
      }
    }
  }
</script>
