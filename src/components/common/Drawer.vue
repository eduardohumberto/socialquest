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
          Social Quest
        </div>
      </div>
      <!-- q-list-header>Essential Links</q-list-header -->
      <q-side-link item to="/app/home">
        <q-item-side icon="home" />
        <q-item-main label="Home" sublabel="Retornar a página inical" />
      </q-side-link>
      <q-side-link item to="/app/takt">
        <q-item-side icon="account_circle" />
        <q-item-main label="Meus dados" sublabel="Alterar suas informações" />
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
      <q-btn color="primary" @click="logout" icon="power_settings_new" class="full-width">
        Sair
      </q-btn>
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
    methods:{
      logout(){
        this.$store.dispatch('auth/logout')
      }
    }
  }
</script>

<style>
</style>
