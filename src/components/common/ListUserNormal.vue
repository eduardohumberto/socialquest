<template>
  <div>
    <q-list v-if="isReady && results">
      <q-item
        v-for="user,index in results"
        :key="index"
        class="cursor-pointer"
        @click="goToProfile(user.value)"
      >
        <q-item-side :avatar="user.avatar"/>
        <q-item-main
        >
          <q-item-tile label lines="1">{{ user.label }}</q-item-tile>
        </q-item-main>
      </q-item>
    </q-list>
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
        user: this.$store.getters['auth/getUser']
      }
    },
    filters: {
      user: function (value) {
        if (!value) return ''
        return '@' + value
      }
    },
    methods: {
      goToProfile (index) {
        this.$router.push('/app/profile/' + index)
      }
    }
  }
</script>
