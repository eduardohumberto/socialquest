<template>

  <div class="layout-padding row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <q-list highlight inset-separator v-if="isReady">
        <q-item
          class="cursor-pointer"
          multiline
          v-for="quest in quests"
          :key="quest['.key']">
          <q-item-side v-if="quest.image"  :avatar="quest.image" />
          <q-item-side v-else  icon="help" />
          <q-item-main
            :label="quest.name"
            label-lines="2"
            :sublabel="quest.description"
            sublabel-lines="2"
            @click="singleQuest(quest['.key'])"
          />
          <q-item-side right icon="more_vert">
            <q-popover ref="popover">
              <q-list link>
                <q-item @click="editQuest(quest['.key'])">
                  <q-item-main label="Editar" />
                </q-item>
                <q-item @click="$refs.popover.close()">
                  <q-item-main label="Remover" />
                </q-item>
              </q-list>
            </q-popover>
          </q-item-side>
        </q-item>
      </q-list>
      <q-spinner class="justify-center" style="height: 30px"  v-else/>
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
    QPopover,
    date,
    QSpinner
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
      QItemTile,
      QPopover,
      QSpinner
    },
    firebase: {
      quests: questsRef.orderByChild('user').equalTo(store.state['auth'].user.uid).limitToLast(25)
    },
    data(){
      return {
        isReady: false
      }
    },
    created(){
      let self = this
      this.$firebaseRefs.quests.on('value', function(snapshot) {
        self.isReady = true
      })
    },
    methods: {
      parseDate (timestamp) {
        return (timestamp) ? date.formatDate(timestamp, 'D/M/YY') : ''
      },
      singleQuest (uid) {
        this.$store.dispatch('quest/setSingleQuest', uid)
        this.$router.push('/app/single-quest/'+uid)
      },
      editQuest (uid) {
        this.$store.dispatch('quest/setSingleQuest', uid)
        this.$router.push('/app/edit-quest/'+uid)
      }
    }
  }
</script>
