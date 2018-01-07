<template>
  <div style="width: 500px; max-width: 90vw;">
    <q-list highlight inset-separator v-if="isReady">
      <q-item
        class="cursor-pointer"
        multiline
        v-for="quest,index in results"
        :key="index">
        <q-item-side v-if="quest.image"  :avatar="quest.image" />
        <q-item-side v-else  icon="help" />
        <q-item-main
          :label="quest.name"
          label-lines="2"
          :sublabel="quest.description"
          sublabel-lines="2"
          @click="singleQuest(index)"
        />
        <q-item-side right icon="more_vert">
          <q-popover ref="popover">
            <q-list link>
              <q-item @click="editQuest(index)">
                <q-item-main label="Editar" />
              </q-item>
              <q-item @click="moveToTrash(index)">
                <q-item-main label="Remover" />
              </q-item>
            </q-list>
          </q-popover>
        </q-item-side>
      </q-item>
    </q-list>
    <q-spinner class="justify-center" style="height: 30px"  v-else/>
  </div>
</template>
<script>
  import {
    QInput,
    QList,
    QListHeader,
    QItem,
    QItemSeparator,
    QItemSide,
    QItemMain,
    QItemTile,
    QChip,
    QPopover,
    QSpinner,
    Dialog
  } from 'quasar'

  export default {
    props: ['results', 'isReady'],
    components: {
      QInput,
      QList,
      QItem,
      QItemMain,
      QItemSide,
      QItemTile,
      QPopover,
      QSpinner,
      Dialog,
      QChip,
      QPopover
    },
    data(){
      return {
        user: this.$store.getters['auth/getUser'],
      }
    },
    filters: {
      hashtag: function (value) {
        if (!value) return ''
        return '#' + value
      }
    },
    methods:{
      isSelectedByUser(quest){
        let indexobj = this.user.uid // get the user uid

        if (quest.allvotes && quest.allvotes[indexobj]){
          return true
        }

        return false
      },
      singleQuest (uid) {
        this.$store.dispatch('quest/setSingleQuest', uid)
        this.$router.push('/app/single-quest/' + uid)
      },
      editQuest (uid) {
        this.$store.dispatch('quest/setSingleQuest', uid)
        this.$router.push('/app/edit-quest/' + uid)
      },
      moveToTrash (uid) {
        let self = this
        for (let index in this.$refs.popover) {
          this.$refs.popover[index].close()
        }
        let uidUser = this.$store.getters['auth/getUser'].uid
        Dialog.create({
          title: 'Atenção!',
          message: 'Enviar para a lixeira?',
          buttons: [
            {
              label: 'Confirmar ação',
              handler () {
                self.$store.dispatch('quest/alterQuestStatus', { uid: uid, user: uidUser, status: 'trash'})
                  .then((success) => {
                    Toast.create.positive({
                      html: 'Enviado para lixeira',
                      icon: 'success'})
                  })
              }
            },
            {
              label: 'Cancelar',
              handler () {
                return false
              }
            }
          ]
        })
      }
    }
  }
</script>
