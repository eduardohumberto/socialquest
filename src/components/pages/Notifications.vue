<template>
  <div>
    <q-list v-if="isReady && hasResults()">
      <q-item
        v-for="not,index in notifications"
        :key="index"
        class="cursor-pointer"
      >
          <q-item-side :avatar="get_avatar(not.sender)"/>
          <q-item-main
            @click="singleQuest(not.questUID, not.quest)"
          >
            <q-item-tile
              v-if="not.type === 'share_quest'" label lines="2">
              @{{ not.sender.username }}
              compartilhou a quest
              {{ not.quest.name }} com você
            </q-item-tile>
            <q-item-tile
              v-else-if="not.type === 'update_quest'" label lines="2">
              @{{ not.sender.username }}
              atualizou a quest
              {{ not.quest.name }}
            </q-item-tile>
          </q-item-main>
      </q-item>
    </q-list>
    <div v-else class="layout-padding docs-input row justify-center">
      <h5 >Nenhuma notificação :(</h5>
    </div>
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
  import { questsRef, usersRef } from '../../config/references'

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
        notifications: [],
        user: this.$store.getters['auth/getUser'],
        results: this.$store.getters['notification/userNotifications']
      }
    },
    created () {
      this.isReady = true
      this.$store.dispatch('notification/clearNotRead')
      this.listNotifications()
    },
    methods: {
      hasResults () {
        return Object.keys(this.results).length > 0
      },
      get_avatar (user) {
        return (user.avatar) ? user.avatar : '/statics/user-default.png'
      },
      singleQuest (uid, quest) {
        this.$store.dispatch('quest/setSingleQuest', uid)
        this.$store.dispatch('quest/setObjectQuest', quest)
        this.$router.push('/app/single-quest/' + uid)
        console.log('run')
      },
      async listNotifications () {
        for (let index in this.results) {
          let user = await this.getUser(this.results[index].user)
          let sender = await this.getUser(this.results[index].sender)
          let quest = await this.getQuest(this.results[index].quest)
          this.notifications.push({ user, sender, quest, questUID: this.results[index].quest, type: this.results[index].type })
        }
        return true
      },
      async getQuest (id) {
        return new Promise((resolve, reject) => {
          questsRef.child(id).on('value', (snapshot) => {
            let val = snapshot.val()
            if (val) {
              resolve(val)
            }
            else {
              resolve('')
            }
          })
        })
      },
      async getUser (id) {
        return new Promise((resolve, reject) => {
          usersRef.orderByChild('uid').equalTo(id).on('value', (snapshot) => {
            let val = snapshot.val()
            if (val) {
              let key = Object.keys(val)[0]
              resolve(val[key])
            }
            else {
              resolve('')
            }
          })
        })
      }
    }
  }
</script>
