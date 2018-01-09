<template>
  <div>
    <q-tabs>
      <!-- Tabs - notice slot="title" -->
      <q-tab :count="counter.pub" default slot="title" name="tab-1" icon="public" />
      <q-tab :count="counter.priv" slot="title" name="tab-2" icon="lock" />
      <q-tab :count="counter.shared" slot="title" name="tab-3" icon="people" />
      <q-tab :count="counter.trash" slot="title" name="tab-4" icon="delete" />
      <!--q-tab slot="title" name="tab-5" icon="person" /-->

      <q-tab-pane name="tab-1">
        <public-quests></public-quests>
      </q-tab-pane>
      <q-tab-pane name="tab-2">
        <private-quests></private-quests>
      </q-tab-pane>
      <q-tab-pane name="tab-3">
        <shared-quests></shared-quests>
      </q-tab-pane>
      <q-tab-pane name="tab-4">
        <trash-quests></trash-quests>
      </q-tab-pane>
    </q-tabs>

  </div>
</template>
<script>
  import { date, QTab, QTabPane, QTabs, Events } from 'quasar'
  import PrivateQuests from '../userComponents/PrivateQuests.vue'
  import PublicQuests from '../userComponents/PublicQuests.vue'
  import SharedQuests from '../userComponents/SharedQuests.vue'
  import TrashQuests from '../userComponents/TrashQuests.vue'

  export default {
    components: {
      QTabs,
      QTab,
      QTabPane,
      PrivateQuests,
      PublicQuests,
      SharedQuests,
      TrashQuests
    },
    data () {
      return {
        counter: {
          pub: 0,
          priv: 0,
          shared: 0,
          trash: 0
        }
      }
    },
    methods: {
      parseDate (timestamp) {
        return (timestamp) ? date.formatDate(timestamp, 'D/M/YY') : ''
      }
    }
  }
</script>
