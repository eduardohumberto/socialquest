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
      enter-active-class="animated slideInUp"
      leave-active-class="animated fadeOut"
      mode="out-in"
    >
      <router-view class="layout-view"></router-view>
    </transition>
    <!-- Navigation -->
    <q-tabs slot="footer" align="center" >
      <q-route-tab slot="title" icon="whatshot" to="/app/hottest" replace  label="" />
      <q-route-tab slot="title" icon="search" to="/app/newly" replace  label="" />
      <q-route-tab slot="title" icon="add_box" to="/app/create-quest" replace  label="" />
      <q-route-tab slot="title" icon="person_pin" to="/app/user-quests" replace label="" />
      <q-route-tab slot="title" icon="room" to="/test-layout/drawer" replace label="" />
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
    },
    beforeDestroy () {
      Events.$off('openDrawer')
    }
  }
</script>

<style>
</style>
