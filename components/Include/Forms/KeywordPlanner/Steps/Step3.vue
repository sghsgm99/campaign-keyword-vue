<template>
  <form action="" enctype="multipart/form-data" @submit.prevent="doFormAction">
    <b-alert :show="showToast" dismissible fade v-if="toast.message">
      <div class="d-flex justify-content-between">
        <span>{{ toast.message }}</span>
      </div>
    </b-alert>

    <div class="mb-3">
      <div class="col-sm-6">
        <label class="form-label mb-2">Networks</label>
        <b-form-checkbox v-model="form.net_search">
          Search Network
        </b-form-checkbox>
        <b-form-checkbox v-model="form.net_display">
          Display Network
        </b-form-checkbox>
      </div>
    </div>

    <div class="mb-3">
      <div class="col-sm-6">
        <label class="form-label mb-3">Locations</label>
        <small class="form-text text-muted">Select locations to target</small>
        <b-form-group class="pt-2">
          <b-form-radio v-model="form.location" value="0"
            >All countries and territories</b-form-radio
          >
          <b-form-radio v-model="form.location" value="1"
            >United States and Canada</b-form-radio
          >
          <b-form-radio v-model="form.location" value="2840"
            >United States</b-form-radio
          >
          <b-form-radio v-model="form.location" value="2"
            >Enter another location</b-form-radio
          >
        </b-form-group>
      </div>
    </div>

    <div class="mb-3">
      <div class="col-sm-6">
        <label class="form-label mb-3">Languages</label>
        <small class="form-text text-muted"
          >Select the languages your customers speak</small
        >
        <v-select
          v-model="form.language"
          :options="lang_options"
          :class="{ 'form-group--error': $v.form.language.$error }"
        >
        </v-select>
        <div v-if="$v.form.language.$dirty">
          <small class="text-error" v-if="!$v.form.language.required"
            >Languages is required</small
          >
        </div>
      </div>
    </div>

    <div class="mb-3">
      <div class="col-sm-12">
        <div class="form-bottom d-flex justify-content-end align-items-center">
          <nuxt-link to="/campaigns" class="btn primary-outline-btn"
            >Cancel</nuxt-link
          >
          <input
            type="submit"
            value="NEXT"
            class="btn btn-primary primary-btn"
          />
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import error from '~/mixins/error'
import { required } from 'vuelidate/lib/validators'

export default {
  layout: 'form',
  props: {
    payload: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      bidding: false,
      lang_options: [{ label: 'English', value: 1000 }],
      form: {
        net_search: false,
        net_display: false,
        location: '2840',
        language: 'English'
      },
      toast: {
        message: null
      },
      showToast: false
    }
  },
  head: {
    bodyAttrs: {
      id: 'form'
    }
  },
  mixins: [error],
  validations: {
    form: {
      language: {
        required
      }
    }
  },
  mounted() {
    this.form = this.payload
  },
  methods: {
    doFormAction() {
      this.toggleBtnDisabled()
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.toggleBtnDisabled()
      } else {
        this.$emit('update', this.form, 4)
        this.toggleBtnDisabled()
      }
    }
  }
}
</script>
