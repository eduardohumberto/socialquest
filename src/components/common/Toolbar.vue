<template>
<q-toolbar>
  <q-btn
    flat
    @click="openDrawer()"
  >
    <q-icon name="menu" />
  </q-btn>
  <q-toolbar-title>
    {{ title }}
    <div slot="subtitle">{{ subtitle }}</div>
  </q-toolbar-title>
  <!-- q-btn flat @click="logout()">Logout</q-btn-->
</q-toolbar>
</template>

<script>
  import {
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    Events
  } from 'quasar'
  export default {
    name: 'toolbar',
    components: {
      QToolbar,
      QToolbarTitle,
      QBtn,
      QIcon,
      Events
    },
    data (){
      return {
        title: '',
        subtitle: ''
      }
    },
    created () {
      this.$q.events.$on('changeTitle', this.changeTitle)
    },
    methods: {
      openDrawer () {
        Events.$emit('openDrawer')
      },
      changeTitle (event){
        this.title = event.title
        this.subtitle = event.subtitle
      },
      logout () {
        this.$router.push('/')
        // this.$store.dispatch('logout')
      }
    }
  }
</script>

<style>
</style>
