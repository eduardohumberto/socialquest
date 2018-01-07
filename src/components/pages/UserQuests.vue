<template>
  <div>
    <q-tabs>
      <!-- Tabs - notice slot="title" -->
      <q-tab default slot="title" name="public" icon="public" />
      <q-tab slot="title" name="private" icon="lock" />
      <q-tab slot="title" name="shared" icon="shared" />
      <q-tab slot="title" name="trash" icon="delete" />
      <q-tab slot="title" name="tab-1" icon="person" />
      <q-tab slot="title" name="tab-2" icon="people" />

      <q-tab-pane name="public">
        <div class="layout-padding row justify-center">
          <list-quest-edit :isReady="isReady" :results="results"></list-quest-edit>
        </div>
      </q-tab-pane>

    </q-tabs>

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
    QSpinner,
    Dialog,
    Toast,
    QTabs,
    QTab,
    QTabPane,
    Events
  } from 'quasar'
  import { questsRef } from '../../config/references'
  import store from '../../store/store'
  import ListQuestEdit from '../common/ListQuestEdit.vue'

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
      QSpinner,
      Dialog,
      QTabs,
      QTab,
      QTabPane,
      ListQuestEdit
    },
    firebase: {
      quests: questsRef
    },
    data () {
      return {
        isReady: false,
        results: []
      }
    },
    created () {
      let self = this
      self.changeTitle()
      this.$firebaseRefs.quests.orderByChild('user').equalTo(store.state['auth'].user.uid).on('value', function (snapshot) {
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
    methods: {
      changeTitle () {
        Events.$emit('changeTitle', {
          title: 'Suas Quests',
          subtitle: 'As quests criadas por você',
          obj: true
        })
      },
      parseDate (timestamp) {
        return (timestamp) ? date.formatDate(timestamp, 'D/M/YY') : ''
      }
    }
  }
</script>
