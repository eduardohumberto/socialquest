<template>
  <q-list v-if="isReady">
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
  import { notificationsRef } from '../../config/references'

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
      }
    },
    firebase: {
      notifications: notificationsRef
    },
  }
</script>
