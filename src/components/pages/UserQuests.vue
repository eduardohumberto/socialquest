<template>

  <div class="layout-padding row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <q-list highlight inset-separator v-if="quests">
        <q-item multiline v-for="quest in quests" :key="quest.uid">
          <q-item-side v-if="quest.image"  :avatar="quest.image" />
          <q-item-side v-else  icon="help" />
          <q-item-main
            :label="quest.name"
            label-lines="2"
            :sublabel="quest.description"
            sublabel-lines="2"
          />
          <q-item-side right stamp="1 week<br>ago" />
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
    QItemTile
  } from 'quasar'
  import { questsRef } from '../../config/references'
  import store from '../../store/store'

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
    }
  }
</script>
