<template>
  <div class="layout-padding docs-input row justify-center">
     <div style="width: 500px; max-width: 90vw;">
        <p class="caption">Criar Quest</p>

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
         <q-chips-input v-model="alternatives" :error="$v.alternatives.$error" @blur="$v.alternatives.$touch()"/>
         <p style="font-size: 10px" v-if="!$v.alternatives.minLen">
           Você deve especificar ao menos {{ $v.alternatives.$params.minLen.min }} alternativas.
         </p>
         <p style="font-size: 10px" v-if="!$v.alternatives.required && $v.alternatives.$dirty">
           Alternativas são obrigatórios
         </p>
         <p style="font-size: 10px" v-if="!$v.alternatives.maxLen">
           O nome deverá ter apenas 140 caracteres
         </p>
       </q-field>

       <q-field
         helper="Inserir imagem para sua Quest (Opcional)">
         <q-uploader :url="img"
                     :hide-upload-button="true"
                     :hide-upload-progress="true"
                     @add="addFiles"
                     :extensions="'.gif,.jpg,.jpeg,.png'"/>
       </q-field>

     </div>
  </div>
</template>
<script>
  import { QField, QDatetime, QInput, QSelect, QChipsInput, QRating, QUploader } from 'quasar'
  import { required, maxLength, minValue, minLength } from 'vuelidate/lib/validators'

  export default {
    components: {
      QField,
      QDatetime,
      QInput,
      QSelect,
      QChipsInput,
      QRating,
      QUploader
    },
    data () {
      return {
        name: '',
        description: '',
        alternatives: [],
        img: '',
        cover: ''
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
            minLen: minLength(1)
          }
        }
      }
    },
    methods: {
      addFiles(file) {
        this.cover = file
      }
    }
  }
</script>
