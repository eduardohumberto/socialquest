<template>
  <q-layout
    ref="layout"
    view="lHh Lpr fff"
    :left-class="{'bg-grey-2': true}"
  >
    <Drawer slot="left"></Drawer>
    <Toolbar slot="header"></Toolbar>
    <!--
      Replace following <div> with
      <router-view /> component
      if using subRoutes
    -->
    <transition
      name="transitions"
      enter-active-class="animated slideInLeft"
      leave-active-class="animated fadeOut"
      mode="out-in"
    >
      <router-view class="layout-view"></router-view>
    </transition>
    <!-- Navigation -->
    <q-tabs slot="footer" align="center" >
      <q-route-tab slot="title" icon="whatshot" to="/app/top-quests" replace  label="" />
      <q-route-tab slot="title" icon="search" to="/app/search-quests" replace  label="" />
      <q-route-tab slot="title" icon="add_box" to="/app/create-quest" replace  label="" />
      <q-route-tab slot="title" icon="person_pin" to="/app/user-quests" replace label="" />
      <q-route-tab slot="title" :count="getNotificationCounter()" icon="notifications" to="/app/notifications" replace label="" />
    </q-tabs>
  </q-layout>
</template>

<script>
  import {
    QTransition,
    QLayout,
    Events,
    QTabs,
    QRouteTab,
    QIcon,
    QFixedPosition,
    QBtn
  } from 'quasar'

  import Toolbar from './common/Toolbar.vue'
  import Drawer from './common/Drawer.vue'

  export default {
    name: 'index',
    components: {
      QTransition,
      QLayout,
      Toolbar,
      Drawer,
      QTabs,
      QRouteTab,
      Events,
      QIcon,
      QFixedPosition,
      QBtn
    },
    mounted () {
      Events.$on('openDrawer', () => {
        this.$refs.layout.toggleLeft()
      })
      this.$store.dispatch('notification/listenNotifications')
    },
    beforeDestroy () {
      Events.$off('openDrawer')
    },
    methods: {
      getNotificationCounter(){
        return this.$store.getters['notification/getNotReadNotifications'].length
      }
    }
  }
</script>

<style>
</style>
