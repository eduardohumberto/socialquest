<template>
  <div class="layout-padding docs-input row justify-center">
    <div style="width: 600px; max-width: 100vw;">
      <q-field
        :count="140"
        helper="Nome de sua Quest">
        <q-input
          v-model="name"
          @blur="$v.name.$touch()"
          :error="$v.name.$error"
        />
        <p style="font-size: 10px" v-if="!$v.name.required && $v.name.$dirty">O nome é obrigatório</p>
        <p style="font-size: 10px" v-if="!$v.name.maxLen">O nome deverá ter apenas 140 caracteres</p>
      </q-field>

      <q-field
        helper="Fale sobre sua Quest">
        <q-input v-model="description" type="textarea" />
      </q-field>

      <q-field
        helper="Insira suas alternativas (Max. 10)">
        <div
          style="margin-top: 5px;"
          class="row"
          v-for="(alternative, index) in alternatives"
          :key="alternative.key">
          <q-input
            class="col-10"
            type="text"
            :id="alternative.key"
            :error="$v.alternatives.$each[index].$error"
            @input="$v.alternatives.$each[index].value.$touch()"
            v-model="alternative.value" />
          <span class="col justify-center">
             <q-btn
               round color="red"
               icon="remove"
               @click="removeAlternative(alternative.key)" small/>
           </span>

          <p style="font-size: 10px" v-if="!$v.alternatives.$each[index].value.required && $v.alternatives.$each[index].value.$dirty">
            Preencha esta alternativa!
          </p>
        </div>

        <q-btn icon="plus_one" color="primary" small
               :disabled="$v.alternatives.$invalid && $v.alternatives.$dirty && alternatives.length > 1"
               @click="onAddAlternative"
               style="margin-top: 5px;"
        >
          alternativa
        </q-btn>

        <!-- q-chips-input v-model="alternatives" :error="$v.alternatives.$error" @blur="$v.alternatives.$touch()"/ -->
        <p style="font-size: 10px" v-if="!$v.alternatives.minLen">
          Você deve especificar ao menos {{ $v.alternatives.$params.minLen.min }} alternativas.
        </p>
        <p style="font-size: 10px" v-if="!$v.alternatives.required && $v.alternatives.$dirty">
          Alternativas são obrigatórias
        </p>
        <p style="font-size: 10px" v-if="!$v.alternatives.maxLen">
          O máximo de alternativas são 10
        </p>
      </q-field>

      <q-field
        helper="Escreva até 3 tags para sua quest!">
        <q-list>
          <q-item multiline>
            <q-item-side icon="label" />
            <q-item-main>
              <q-chips-input
                :error="$v.hashtags.$error"
                @input="$v.hashtags.$touch()"
                v-model="hashtags"  class="no-margin" placeholder="Ex: Goiania, Eleicoes, barzinhos (Tecle enter ou clique ao lado)"/>
            </q-item-main>
          </q-item>
        </q-list>
        <p style="font-size: 13px;" v-if="!$v.hashtags.maxLen">
          O máximo de Tags são 3!
        </p>
      </q-field>
      <br>
      <q-field
        helper="Limitar sua quest para apenas usuários selecionados (Deixar em branco para ser pública)">
        <q-search v-model="terms" placeholder="Digite o nome do usuário">
          <q-autocomplete @search="search" @selected="selectUser"  :min-characters="2" />
        </q-search>
      </q-field>
      <list-user :isReady="(shareUsers.length > 0) ? true : false" :results="shareUsers" @removeUser="removeUser($event)" />
      <!--q-field
        helper="Inserir imagem para sua Quest (Opcional)">
        <q-uploader :url="img"
                    :hide-upload-button="true"
                    :hide-upload-progress="true"
                    @add="addFiles"
                    @remove:cancel="remove"
                    :extensions="'.gif,.jpg,.jpeg,.png'"/>
      </q-field-->
      <q-btn
        @click="submit"
        icon-right="send"
        color="primary"
        class="round full-width margin-min">Salvar</q-btn>
    </div>
  </div>
</template>
<script>
  import { QField, QDatetime, QInput, QSelect, QChipsInput, QRating, QUploader, QAutocomplete, QSearch,
    QBtn, QList, QItem, QItemMain, Toast, Loading, QIcon, QItemSide, Events } from 'quasar'
  import { required, maxLength, minValue, minLength } from 'vuelidate/lib/validators'
  import { uniqueId } from '../../helpers/helpers'
  import { usersRef } from '../../config/references'
  import ListUser from '../common/ListUser.vue'

  const parseAutocomplete = (array) => {
    return array.map(user => {
      return {
        label: '@' + user.username,
        avatar: (user.avatar) ? user.avatar : '/statics/user-default.png',
        value: user.uid
      }
    })
  }

  const modelAlternatives = ( arrayAlternativesDefault ) => {
    let arrayAlternatives = {}

    for (let alternative of arrayAlternativesDefault) {
      let property = alternative.key
      arrayAlternatives[property] = {
        name: alternative.value,
        votes: []
      }
    }
    return arrayAlternatives
  }

  export default {
    components: {
      QField,
      QDatetime,
      QInput,
      QSelect,
      QChipsInput,
      QRating,
      QUploader,
      QBtn,
      QList,
      QItem,
      QItemMain,
      QItemSide,
      QAutocomplete,
      QSearch,
      ListUser
    },
    data () {
      return {
        name: '',
        description: '',
        alternatives: [],
        hashtags: [],
        img: '',
        cover: '',
        terms: '',
        shareUsers: [],
        user: this.$store.getters['auth/getUser']
      }
    },
    validations: {
      name:{
        required,
        maxLen: maxLength(140)
      },
      alternatives: {
        required,
        minLen: minLength(2),
        maxLen: maxLength(10),
        $each: {
          value: {
            required,
            minLen: minLength(1)
          }
        }
      },
      hashtags: {
        maxLen: maxLength(3)
      }
    },
    created () {
      this.changeTitle()
    },
    methods: {
      changeTitle () {
        Events.$emit('changeTitle', {
          title: 'Crie uma quest',
          subtitle: 'Adicione um quest pública ou apenas para alguns usuários',
          obj: true
        })
      },
      onAddAlternative(){
        const newAlternative = {
          key: uniqueId(),
          value: ''
        }
        this.alternatives.push(newAlternative)
        this.$v.alternatives.$touch()
      },
      removeAlternative (id) {
        this.alternatives = this.alternatives.filter(alt => alt.key !== id)
      },
      addFiles(file) {
        this.cover = file[0]
      },
      remove(file){
        this.cover = ''
      },
      search (terms, done) {
        let userLoggedIn = this.$store.getters['auth/getUser']
        usersRef.orderByChild('username').startAt(terms).endAt(terms + '\uf8ff').on('value', function(snapshot) {
          let user = snapshot.val()
          let array = []
          for (let index in user){
            if(user[index].uid !== userLoggedIn.uid){
              array.push(user[index])
            }
          }
          done(parseAutocomplete(array))
        })
      },
      selectUser (item) {
        this.terms = ''
        let index = this.shareUsers.findIndex(element => element.value == item.value)
        if (index < 0) {
          this.shareUsers.push(item)
        }
      },
      removeUser ($event) {
        let uid = $event
        this.shareUsers = this.shareUsers.filter(alt => alt.value !== uid)
        console.log(uid)
      },
      submit () {
        if (this.$v.$invalid) {
          this.$v.$touch()
          Toast.create('Por favor preencha o formulário corretamente.')
          return false
        }

        Loading.show()
        if (this.cover !== '') {
          this.$store.dispatch('upload/upload', this.cover)
            .then((url) => {
              this.insert(url)
            })
            .catch((error) => {
              Loading.hide()
              console.log(error)
            })
        } else {
          this.insert(this.cover)
        }
      },
      insert (image) {
        let user = this.$store.getters['auth/getUser']
        this.$store.dispatch('quest/create', {
          quest: {
            name: this.name,
            description: this.description,
            alternatives: modelAlternatives(this.alternatives),
            image: image,
            status: 'published',
            hashtag_0: (this.hashtags[0]) ? this.hashtags[0] : '',
            hashtag_1: (this.hashtags[1]) ? this.hashtags[1] : '',
            hashtag_2: (this.hashtags[2]) ? this.hashtags[2] : '',
            createdAt: Date.now(),
            user: user.uid,
            isShared: (this.shareUsers.length > 0)
          },
          sharedUser: this.shareUsers
        }).then(() => {
          Loading.hide()
          this.$router.push('/app/user-quests')
        }).catch((error) => {
          Loading.hide()
          console.log(error)
          this.$router.push('/app')
        })
      }
    }
  }
</script>
