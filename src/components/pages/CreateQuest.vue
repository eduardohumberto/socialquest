<template>
  <div class="layout-padding docs-input row justify-center">
    <div style="width: 500px; max-width: 90vw;">
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

      <p class="caption">#hashtags</p>
      <q-list>
        <q-item multiline>
          <q-item-side icon="edit" />
          <q-item-main>
            <q-chips-input v-model="hashtags" class="no-margin" placeholder="Escreva algumas"/>
          </q-item-main>
        </q-item>
      </q-list>
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
  import { QField, QDatetime, QInput, QSelect, QChipsInput, QRating, QUploader,
    QBtn, QList, QItem, QItemMain, Toast, Loading, QIcon, QItemSide } from 'quasar'
  import { required, maxLength, minValue, minLength } from 'vuelidate/lib/validators'
  import { uniqueId } from '../../helpers/helpers'
  import { questsRef } from '../../config/references'
  import store from '../../store/store'

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
      QItemSide
    },
    data () {
      return {
        name: '',
        description: '',
        alternatives: [],
        hashtags:[],
        img: '',
        cover: '',
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
      }
    },
    methods: {
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
          name: this.name,
          description: this.description,
          alternatives: modelAlternatives(this.alternatives),
          image: image,
          status: 'published',
          createdAt: Date.now(),
          user: user.uid
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
