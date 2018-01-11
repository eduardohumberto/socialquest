<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <header></header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
/*
 * Root component
 */
export default {
  name: 'App',
  created () {
    this.$store.dispatch('auth/tryAutoLogin')
  }
}
</script>

<style>
</style>
