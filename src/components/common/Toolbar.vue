<template>
<q-toolbar>
  <q-btn
    flat
    @click="openDrawer()"
  >
    <q-icon name="menu" />
  </q-btn>
  <q-toolbar-title>
    Lean Web App Tools
    <div slot="subtitle">Tools to Improve your Lean Thinking</div>
  </q-toolbar-title>
  <q-btn flat @click="logout()">Logout</q-btn>
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
    methods: {
      openDrawer () {
        Events.$emit('openDrawer')
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
