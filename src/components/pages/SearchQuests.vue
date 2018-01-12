<template>
  <div class="layout-padding docs-input row justify-center">
    <div style="width: 500px; max-width: 90vw;">
    <q-input
      v-model="search"
      @keyup="getEnter($event)"
      float-label="Use # para buscar por tags ou @ para usuários"
      :after="[{icon: 'search', content: true, handler () { onSearch() }}]" />
      <transition  enter-active-class="animated slideInUp"
                   leave-active-class="animated fadeOut"
                   mode="out-in">
        <list-quest v-if="results" :results="results" :isReady="isReady"></list-quest>
        <list-user v-else-if="users" :isReady="isReady" :results="users"  />
        <h5 v-else>Nenhuma busca ou nada encontrado :(</h5>
      </transition>
    </div>
  </div>
</template>
<script>
  import { QInput,Events } from 'quasar'
  import { questsRef, usersRef } from '../../config/references'
  import ListQuest from '../common/ListQuest.vue'
  import ListUser from '../common/ListUser.vue'
  import { isAllowedQuest, parseAutocomplete } from '../../helpers/helpers'

  export default {
    components: {
      QInput,
      ListQuest,
      ListUser
    },
    data () {
      return {
        search: '',
        results: false,
        isReady: false,
        user: this.$store.getters['auth/getUser'],
        users: false
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
          this.users = false
          this.results = (Object.keys(result).length > 0) ? result : false
        }
        else if (this.search.indexOf('@') === 0) {
          this.users = await this.searchUser(this.search)
          this.results = false
        }
        else {
          this.users = false
          questsRef.orderByChild('name').startAt(this.search).endAt(this.search + '\uf8ff').on('value', async (snapshot) => {
            let resultsRaw = (snapshot.val()) ? snapshot.val() : false
            this.results = {}
            if (resultsRaw) {
              for (let index in resultsRaw) {
                let allowed = await isAllowedQuest(resultsRaw[index], this.user, index)
                if (allowed === true) this.results[index] = resultsRaw[index]
              }
            }
            if (Object.keys(this.results).length === 0) this.results = false
          })
        }
      },
      getEnter (event) {
        if (event.keyCode === 13){
          this.onSearch()
        }
      },
      searchFieldTag (tag) {
        return new Promise((resolve, reject) => {
          questsRef.orderByChild(tag).startAt(this.search.replace('#', '')).endAt(this.search.replace('#', '') + '\uf8ff').on('value',async (snapshot) => {
            let resultsRaw = (snapshot.val()) ? snapshot.val() : false
            let results = {}
            if (resultsRaw) {
              for (let index in resultsRaw) {
                let allowed = await isAllowedQuest(resultsRaw[index], this.user, index)
                if (allowed === true) results[index] = resultsRaw[index]
              }
            }
            resolve(results)
          })
        })
      },
      searchUser (terms) {
        return new Promise((resolve, reject) => {
          usersRef.orderByChild('username').startAt(terms.replace('@', '')).endAt(terms.replace('@', '') + '\uf8ff').on('value', function(snapshot) {
            let user = snapshot.val()
            let array = []
            for (let index in user){
              array.push(user[index])
            }
            resolve(parseAutocomplete(array))
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
