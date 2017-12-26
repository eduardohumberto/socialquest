<template>
  <q-layout
    ref="layout"
    view="lHh Lpr fff"
    :left-class="{'bg-grey-2': true}"
  >
    <Toolbar slot="header"></Toolbar>
    <!--
      Replace following <div> with
      <router-view /> component
      if using subRoutes
    -->
    <router-view class="layout-view"></router-view>
    <q-fixed-position corner="bottom-right" :offset="[18, 18]">
      <q-btn round color="primary">
        <q-icon name="add" />
      </q-btn>
    </q-fixed-position>
    <!-- Navigation -->
    <q-tabs slot="footer" align="center" >
      <q-route-tab slot="title" icon="whatshot" to="/app/hottest" replace  label="" />
      <q-route-tab slot="title" icon="search" to="/app/newly" replace  label="" />
      <q-route-tab slot="title" icon="person_pin" to="/test-layout/drawer" replace label="" />
    </q-tabs>
  </q-layout>
</template>

<script>
  import {
    QLayout,
    Events,
    QTabs,
    QRouteTab,
    QIcon,
    QFixedPosition,
    QBtn
  } from 'quasar'

  import Toolbar from './common/Toolbar.vue'
  export default {
    name: 'index',
    components: {
      QLayout,
      Toolbar,
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
