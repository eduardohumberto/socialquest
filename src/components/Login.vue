<template>
  <q-layout class="bg-grey-3">
    <div class="row">
      <q-card class="col-md-4 offset-md-4 size-card bg-white">
        <q-card-title class="bg-blue-6 text-white">
          <h4 class="text-center" >Social Quest</h4>
        </q-card-title>
        <br>
        <q-card-main>
          <q-input type="text" v-model="email" float-label="E-mail" ></q-input>
          <q-input type="password" v-model="password" float-label="Password" ></q-input>
        </q-card-main>
        <br>
        <q-card-actions>
          <q-btn @click="login" color="primary" class="round full-width">Login</q-btn>
          <q-btn @click="toRegister" color="secondary" class="round full-width margin-min">Cadastre-se</q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-layout>
</template>
<script>
  import {
    QLayout,
    QCard,
    QCardTitle,
    QCardMain,
    QCardSeparator,
    QCardActions,
    QInput,
    QBtn,
    QItem,
    QItemSide,
    QItemMain,
    QSideLink,
    Toast,
    Loading
  } from 'quasar'

  export default {
    name: 'login',
    components: {
      QLayout,
      QCard,
      QCardTitle,
      QCardMain,
      QCardSeparator,
      QCardActions,
      QInput,
      QBtn,
      QItem,
      QItemSide,
      QItemMain,
      QSideLink
    },
    data () {
      return {
        email: '',
        password: ''
      }
    },
    methods: {
      login () {
        if (this.password === '' || this.email === '') {
          Toast.create('Email e senha são obrigatórios')
        }

        Loading.show()
        this.$store.dispatch('auth/login', {
          email: this.email,
          password: this.password
        }).then(() => {
          Loading.hide()
          this.$router.push('/app')
        }).catch((error) => {
          Loading.hide()
          Toast.create('Usuário ou senha inválidos')
          this.$router.push('/')
        })
      },
      toRegister () {
        this.$router.push('/register')
      }
    },
    computed: {
      isLoggedIn () {
        return this.$store.getters.isLoggedIn
      }
    }
  }
</script>
<style>
  .size-card {
    height: 80vh;
    margin-top: 10vh;
  }
  .img-size {
    height: 75px;
  }
  .center {
    display:block;
    margin-left:auto;
    margin-right:auto;
  }
  .margin-min {
    margin: 5px;
  }
</style>
