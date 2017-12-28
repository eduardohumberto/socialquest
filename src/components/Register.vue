<template>
  <q-layout class="bg-grey-3">
    <div class="row">
      <q-card class="col-md-4 offset-md-4 size-card bg-white">
        <q-card-title class="bg-blue-6 text-white">
          <h4 class="text-center" >Social Quest</h4>
        </q-card-title>
        <br>
        <q-card-main>
          <q-input
              type="text"
              v-model="email"
              @blur="$v.email.$touch()"
              :error="$v.email.$error"
              float-label="E-mail" ></q-input>
          <p v-if="!$v.email.email">Digite um email válido.</p>
          <p v-if="!$v.email.required  && $v.email.$dirty">Email é obrigatório.</p>
          <q-input
              float-label="CPF"
              type="text"
              id="cpf"
              @blur="$v.cpf.$touch()"
              :error="$v.cpf.$error"
              v-mask="'###.###.###-##'"
              v-model="cpf"></q-input>
            <p v-if="!$v.cpf.minLen">Digite um CPF Válido.</p>
          <q-input
             float-label="Senha"
             type="password"
             id="password"
             :error="$v.password.$error"
             @blur="$v.password.$touch()"
             v-model="password"></q-input>
          <p v-if="!$v.password.minLen">Sua senha deve ter no minimo 6 dígitos.</p>
          <q-input
              float-label="Confirmar senha"
              type="password"
              id="confirm-password"
              @blur="$v.confirmPassword.$touch()"
              v-model="confirmPassword"></q-input>
          <p v-if="!$v.confirmPassword.sameAs">As senhas não combinam.</p>

        </q-card-main>
        <br>
        <q-card-actions>
          <q-btn
            @click="submit"
            color="primary"
            icon-right="send"
            class="round margin-min">Registrar</q-btn>
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
  import { required, email, numeric, minValue, minLength, sameAs } from 'vuelidate/lib/validators'
  import { mask } from 'vue-the-mask'

  export default {
    name: 'register',
    directives: {mask},
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
        cpf: null,
        password: '',
        confirmPassword: ''
      }
    },
    validations: {
      email: {
        required,
        email,
        unique: val => {
          if (val === '') {
            return true
          }
          return true
        }
      },
      cpf: {
        required,
        minLen: minLength(14)
      },
      password: {
        required,
        minLen: minLength(6)
      },
      confirmPassword: {
        sameAs: sameAs(vm => {
          return vm.password
        })
      }
    },
    methods: {
      submit () {
        if (this.$v.$invalid) {
          Toast.create('Por favor preencha o formulário corretamente.')
          return false
        }

        Loading.show()
        this.$store.dispatch('auth/signup', {
          email: this.email,
          cpf: this.cpf,
          password: this.password
        }).then(() => {
          Loading.hide()
          this.$router.push('/app')
        }).catch((error) => {
          Loading.hide()
          console.log(error)
          this.$router.push('/')
        })
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
    width: 80%;
    margin: 5% 10% 5% 10%;
  }
</style>
