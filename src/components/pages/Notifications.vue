<template>
  <div class="layout-padding docs-input row justify-center">
    <q-list v-if="isReady && hasResults()">
      <q-item
        v-for="user,index in results"
        :key="index"
        class="cursor-pointer"
      >
        <q-item-side :avatar="user.avatar"/>
        <q-item-main
        >
          <q-item-tile label lines="1">{{ user.label }}</q-item-tile>
        </q-item-main>
        <q-item-side
          right
          @click="removeSingle(user.value)">
          <q-item-tile  icon="delete" color="red" />
        </q-item-side>
      </q-item>
    </q-list>
    <h5 v-else>Nenhuma notificação :(</h5>
  </div>
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

  export default  {
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
        isReady: false,
        user: this.$store.getters['auth/getUser'],
        results: this.$store.getters['notification/userNotifications']
      }
    },
    created () {
      this.isReady = true
      this.$store.dispatch('notification/clearNotRead')
    },
    methods: {
      hasResults () {
        return Object.keys(this.results).length > 0
      }
    }
  }
</script>
