<template>
  <div class="layout-padding docs-input row justify-center">
    <div style="width: 500px; max-width: 90vw;">
    <q-input
      v-model="search"
      @keyup="getEnter($event)"
      float-label="Use # para buscar por tags"
      :after="[{icon: 'search', content: true, handler () { onSearch() }}]" />
      <transition  enter-active-class="animated slideInUp"
                   leave-active-class="animated fadeOut"
                   mode="out-in">
        <list-quest v-if="results" :results="results" :isReady="isReady"></list-quest>
        <h5 v-else>Nenhuma busca ou nada encontrado :(</h5>
      </transition>
    </div>
  </div>
</template>
<script>
  import { QInput,Events } from 'quasar'
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
      this.changeTitle()
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
          this.results = (Object.keys(result).length > 0) ? result : false
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
      changeTitle () {
        Events.$emit('changeTitle', {
          title: 'Procurar quests',
          subtitle: '',
          obj: true
        })
      },
    }
  }
</script>
