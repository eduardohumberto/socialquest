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
          @click="singleQuest(index,quest)"
        />
        <q-item-side right icon="more_vert">
          <q-popover ref="popover">
            <q-list v-if="!modeTrash()" link>
              <q-item @click="editQuest(index, quest)">
                <q-item-main label="Editar" />
              </q-item>
              <q-item @click="moveToTrash(index)">
                <q-item-main label="Remover" />
              </q-item>
            </q-list>
            <q-list v-else link>
              <q-item @click="deleteQuest(index)">
                <q-item-main label="Excluir permanente" />
              </q-item>
              <q-item @click="rewind(index)">
                <q-item-main label="Publicar novamente" />
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
    Dialog,
    Toast,
    Events
  } from 'quasar'

  export default {
    props: ['results', 'isReady', 'isTrash'],
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
      QPopover,
      Toast
    },
    data () {
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
    methods: {
      modeTrash () {
        return this.isTrash
      },
      isSelectedByUser (quest) {
        let indexobj = this.user.uid // get the user uid

        if (quest.allvotes && quest.allvotes[indexobj]){
          return true
        }

        return false
      },
      singleQuest (uid, quest) {
        this.$store.dispatch('quest/setSingleQuest', uid)
        this.$store.dispatch('quest/setObjectQuest', quest)
        this.$router.push('/app/single-quest/' + uid)
      },
      editQuest (uid, quest) {
        this.$store.dispatch('quest/setSingleQuest', uid)
        this.$store.dispatch('quest/setObjectQuest', quest)
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
      },
      rewind (uid) {
        let self = this
        for (let index in this.$refs.popover) {
          this.$refs.popover[index].close()
        }
        let uidUser = this.$store.getters['auth/getUser'].uid
        Dialog.create({
          title: 'Atenção!',
          message: 'Esta quest será republicada, tem certeza disso?',
          buttons: [
            {
              label: 'Confirmar ação',
              handler () {
                self.$store.dispatch('quest/alterQuestStatus', { uid: uid, user: uidUser, status: 'published'})
                  .then((success) => {
                    Toast.create.positive({
                      html: 'Publicado com sucesso!',
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
      },
      deleteQuest (uid) {
        let self = this
        for (let index in this.$refs.popover) {
          this.$refs.popover[index].close()
        }
        let uidUser = this.$store.getters['auth/getUser'].uid
        Dialog.create({
          title: 'Atenção!',
          message: 'Esta quest será apagada, essa operação é irreversível',
          buttons: [
            {
              label: 'Confirmar ação',
              handler () {
                self.$store.dispatch('quest/deleteQuest', {uid: uid, user: uidUser})
                  .then((success) => {
                    Toast.create.positive({
                      html: 'Excluída com sucesso!',
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
