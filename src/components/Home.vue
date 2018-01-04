<template>
  <div class="container">
    <img id="logo" src="~assets/main-logo.png" alt="Lean App Tools" class="responsive">
  </div>
</template>

<script>
  import { Events } from 'quasar'

  export default {
    created (){
      this.changeTitle()
    },
    methods: {
      changeTitle () {
        Events.$emit('changeTitle', {
          title: 'Social Quest',
          subtitle: 'Responda questões de tudo de todos',
          obj: true
        })
      }
    }
  }
</script>

<style>
  .container {
    padding: 2%;
  }
  #logo {
    padding-top: 25vh;
    display: table;
    margin: auto;
  }
</style>
