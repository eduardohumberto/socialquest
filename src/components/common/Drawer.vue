<template>
  <div>
    <!--
      Use <q-side-link> component
      instead of <q-item> for
      internal vue-router navigation
    -->
    <q-list no-border link inset-delimiter>
      <div class="row flex-center bg-white" style="width: 100%; height: 110px;">
        <div style="margin-left: 15px;">
          @{{ getEmail }}
        </div>
      </div>
      <!-- q-list-header>Essential Links</q-list-header -->
      <q-side-link item to="/app/home">
        <q-item-side icon="home" />
        <q-item-main label="Home" sublabel="Retornar a página inical" />
      </q-side-link>
      <q-side-link item to="/app/my-profile">
        <q-item-side icon="account_circle" />
        <q-item-main label="Meu perfil" sublabel="Veja como os usuarios veem seu perfil" />
      </q-side-link>
      <!--q-side-link item to="/app/oee">
        <q-item-side icon="show_chart" />
        <q-item-main label="OEE" sublabel="Overall Equipment Effectiveness" />
      </q-side-link>
      <q-side-link item to="/app/pareto">
        <q-item-side icon="insert_chart" />
        <q-item-main label="Pareto" sublabel="80 / 20 Chart" />
      </q-side-link-->
      <q-side-link item to="/app/obc">
        <q-item-side icon="info" />
        <q-item-main label="Info" sublabel="Informações da aplicação" />
      </q-side-link>
      <div class="q-item q-item-division relative-position q-item-link" @click="logout">
        <div class="q-item-side q-item-side-left q-item-section">
          <i aria-hidden="true" class="q-item-icon q-icon material-icons">power_settings_new</i>
        </div>
        <div class="q-item-main q-item-section">
          <div class="q-item-label" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">
            Sair
          </div>
        </div>
      </div>
    </q-list>
  </div>
</template>

<script>
  import {
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QSideLink,
    QBtn
  } from 'quasar'

  export default {
    name: 'drawer',
    components: {
      QIcon,
      QList,
      QListHeader,
      QItem,
      QItemSide,
      QItemMain,
      QSideLink,
      QBtn
    },
    computed:{
      getEmail(){
        return this.$store.getters['auth/getUser'].username
      }
    },
    methods:{
      logout(){
        this.$store.dispatch('auth/logout')
      }
    }
  }
</script>

<style>
</style>
