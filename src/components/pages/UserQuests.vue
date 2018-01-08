<template>
  <div>
    <q-tabs align="justify">
      <!-- Tabs - notice slot="title" -->
      <q-tab default slot="title" name="tab-1" icon="public" />
      <q-tab slot="title" name="tab-2" icon="lock" />
      <q-tab slot="title" name="tab-3" icon="people" />
      <q-tab slot="title" name="tab-4" icon="delete" />
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
  import { date, QTab, QTabPane, QTabs } from 'quasar'
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
        isReady: false,
        results: []
      }
    },
    methods: {
      parseDate (timestamp) {
        return (timestamp) ? date.formatDate(timestamp, 'D/M/YY') : ''
      }
    }
  }
</script>
