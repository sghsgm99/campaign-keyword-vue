<template>
  <form action="" enctype="multipart/form-data" @submit.prevent="doFormAction">
    <b-alert :show="showToast" dismissible fade v-if="toast.message">
      <div class="d-flex justify-content-between">
        <span>{{ toast.message }}</span>
      </div>
    </b-alert>

    <div class="mb-3">
      <div class="col-sm-6">
        <label class="form-label mb-2">Final URL</label>
        <input
          type="text"
          class="title form-control mb-0"
          v-model="$v.form.finalurl.$model"
          placeholder="https://www.example.com"
          :class="{ 'form-group--error': $v.form.finalurl.$error }"
        />
        <div v-if="$v.form.finalurl.$dirty">
          <small class="text-error" v-if="!$v.form.finalurl.required"
            >Please enter the Final URL.</small
          >
          <small class="text-error" v-if="!$v.form.finalurl.url"
            >Invalid URL Format.</small
          >
        </div>
      </div>
    </div>

    <div class="mb-3">
      <div class="col-sm-12">
        <label class="form-label mb-2">Display Path</label>
        <div class="row">
          <div class="col-sm-3">
            <input
              type="text"
              class="title form-control mb-0"
              v-model="form.path1"
            />
          </div>
          <div class="col-sm-3">
            <input
              type="text"
              class="title form-control mb-0"
              v-model="form.path2"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="mb-3">
      <div class="col-sm-12">
        <label class="form-label mb-2"
          >Headlines (Enter 3 to 15 headlines)</label
        >
        <textarea
          class="form-control"
          rows="3"
          v-model="$v.form.headlines.$model"
          :class="{ 'form-group--error': $v.form.headlines.$error }"
          placeholder="Enter the headlines, one headline per line"
        ></textarea>
        <div v-if="$v.form.headlines.$dirty">
          <small class="text-error" v-if="!$v.form.headlines.required"
            >Please provide Headlines.</small
          >
          <small class="text-error" v-if="!$v.form.headlines.requiredIf"
            >At least 3 headlines required.</small
          >
        </div>
      </div>
    </div>

    <div class="mb-3">
      <div class="col-sm-12">
        <label class="form-label mb-2"
          >Descriptions (Enter 2 to 4 descriptions)</label
        >
        <textarea
          class="form-control"
          rows="3"
          v-model="$v.form.descriptions.$model"
          :class="{ 'form-group--error': $v.form.descriptions.$error }"
          placeholder="Enter the descriptions, one description per line"
        ></textarea>
        <div v-if="$v.form.descriptions.$dirty">
          <small class="text-error" v-if="!$v.form.descriptions.required"
            >Please provide Descriptions.</small
          >
          <small class="text-error" v-if="!$v.form.descriptions.requiredIf"
            >At least 2 descriptions required.</small
          >
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <div class="form-bottom d-flex justify-content-end align-items-center">
          <button class="btn primary-outline-btn">BACK</button>
          <b-button
            type="submit"
            value="SUBMIT"
            class="btn btn-next primary-btn"
            :disabled="btnDisabled"
          >
            <b-spinner small v-if="btnDisabled && !readOnly"></b-spinner>
            Submit
          </b-button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import AdTemplates from '~/models/AdTemplates'
import error from '~/mixins/error'
import { required, requiredIf, url } from 'vuelidate/lib/validators'

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
      form: {
        path1: '',
        path2: '',
        finalurl: null,
        headlines: null,
        descriptions: null
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
      finalurl: { required, url },
      headlines: {
        required,
        requiredIf: function (headlines) {
          if (headlines == null) return true

          let hs = headlines.split('\n')

          if (hs.length > 2) return true

          return false
        }
      },
      descriptions: {
        required,
        requiredIf: function (descriptions) {
          if (descriptions == null) return true

          let ds = descriptions.split('\n')

          if (ds.length > 1) return true

          return false
        }
      }
    }
  },
  mounted() {
    this.form = this.payload
  },
  methods: {
    async doFormAction() {
      this.toggleBtnDisabled()
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.toggleBtnDisabled()
      } else {
        let params = {
          kws: this.form.kws,
          intls: this.form.intls,
          budget: this.form.budget,
          keyword: this.form.ckeyword,
          gn_options: this.form.gn_options,
          net_search: this.form.net_search,
          net_display: this.form.net_display,
          bid: this.form.bid,
          finalurl: this.form.finalurl,
          path1: this.form.path1,
          path2: this.form.path2,
          headlines: this.form.headlines,
          descriptions: this.form.descriptions,
          ek_text: this.form.ek_text,
          pk_text: this.form.pk_text,
          bk_text: this.form.bk_text
        }

        AdTemplates.submitCampaigns(params)
          .then((res) => {
            this.showToast = true
            this.toast.message = 'Ad has been created!'
            this.toggleBtnDisabled()
          })
          .catch((e) => {
            this.showError(e.response)
          })
      }
    }
  }
}
</script>
