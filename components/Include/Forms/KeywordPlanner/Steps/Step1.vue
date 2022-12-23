<template>
  <form action="" enctype="multipart/form-data" @submit.prevent="doFormAction">
    <b-alert :show="showToast" dismissible fade v-if="toast.message">
      <div class="d-flex justify-content-between">
        <span>{{ toast.message }}</span>
      </div>
    </b-alert>

    <div class="mb-3">
      <div class="col-sm-12 row">
        <div class="col-sm-2">
          <input
            type="text"
            class="form-control mb-1"
            v-model="form.ckeyword"
            placeholder="Search keywords"
          />
        </div>
        <div class="col-sm-2">
          <b-input-group prepend="$" class="input-group-btn campaign-tag-input">
            <b-form-input
              v-model="form.clvalue"
              placeholder="Top of page bid (low range)"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-sm-2 mt-2">
          <button class="btn btn-primary" @click.prevent="fetchCampaignName">
            Search <b-spinner small label="Spinning" v-if="isBusy"></b-spinner>
          </button>
        </div>
      </div>
    </div>

    <div class="mb-3">
      <div class="col-sm-12">
        <label class="form-label mb-2">
          Campaign Name<b-badge pill variant="primary">{{
            form.cnt_name
          }}</b-badge>
        </label>
        <b-form-select
          class="form-control"
          v-model="form.cn_selected"
          :options="form.cn_options"
          multiple
          :select-size="15"
          :class="{ 'form-group--error': $v.form.cn_selected.$error }"
        ></b-form-select>
        <div v-if="$v.form.cn_selected.$dirty">
          <small class="text-error" v-if="!$v.form.cn_selected.required"
            >Campaign Name is required</small
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
import AdTemplates from '~/models/AdTemplates'
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
      form: {
        ckeyword: '',
        clvalue: 5,
        cn_options: [],
        cnt_name: null,
        kw_arr: [],
        intl_arr: [],
        cn_selected: []
      },
      isBusy: false,
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
      cn_selected: {
        required
      }
    }
  },
  mounted() {
    this.form = this.payload
  },
  methods: {
    async fetchCampaignName() {
      if (this.form.ckeyword == '') {
        return
      }

      if (this.form.clvalue == '') {
        return
      }

      this.isBusy = !this.isBusy
      await AdTemplates.setKeyword(this.form.ckeyword)
        .setLowValue(this.form.clvalue)
        .getCampaignName()
        .then((res) => {
          let data = res.response.data
          this.form.cnt_name = data.cname_arr.length
          this.form.cn_options = data.cname_arr
          this.form.kw_arr = data.kw_arr
          this.form.intl_arr = data.intl_arr
          this.isBusy = !this.isBusy
        })
    },

    doFormAction() {
      this.toggleBtnDisabled()
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.toggleBtnDisabled()
      } else {
        this.$emit('update', this.form, 2)
        this.toggleBtnDisabled()
      }
    }
  }
}
</script>
