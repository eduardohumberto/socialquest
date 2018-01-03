<template>
  <div class="layout-padding docs-input row justify-center">
    <div style="width: 500px; max-width: 90vw;">
    <q-input
      v-model="search"
      @keyup="getEnter($event)"
      float-label="Use # para buscar por tags"
      :after="[{icon: 'search', content: true, handler () { onSearch() }}]" />
      <list-quest :results="results" :isReady="isReady"></list-quest>

    </div>
  </div>
</template>
<script>
  import { QInput } from 'quasar'
  import { questsRef } from '../../config/references'
  import ListQuest from '../common/ListQuest.vue'

  export default {
    components: {
      QInput,
      ListQuest
    },
    data () {
      return {
        search: '',
        results: false,
        isReady: false,
        user: this.$store.getters['auth/getUser']
      }
    },
    mounted () {
      this.isReady = true
    },
    firebase:{
      quests: questsRef
    },
    methods: {
      async onSearch () {
        console.log('exec')
        if (this.search.indexOf('#') === 0) {
          let tag1 = await this.searchFieldTag('hashtag_0')
          let tag2 = await this.searchFieldTag('hashtag_1')
          let tag3 = await this.searchFieldTag('hashtag_2')
          let result = Object.assign({}, tag1, tag2, tag3)
          this.results = (result) ? result : false
        } else {
          questsRef.orderByChild('name').startAt(this.search).endAt(this.search + '\uf8ff').on('value', (snapshot) => {
            this.results = (snapshot.val()) ? snapshot.val() : false
          })
        }
      },
      getEnter (event) {
        if (event.keyCode === 13){
          this.onSearch()
        }
      },
      searchFieldTag(tag){
        return new Promise((resolve, reject) => {
          questsRef.orderByChild(tag).startAt(this.search.replace('#', '')).endAt(this.search.replace('#', '') + '\uf8ff').on('value', (snapshot) => {
            resolve(snapshot.val())
          })
        })
      },
    }
  }
</script>
