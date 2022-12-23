<template>
  <form action="" enctype="multipart/form-data" @submit.prevent="doFormAction">
    <b-alert :show="showToast" dismissible fade v-if="toast.message">
      <div class="d-flex justify-content-between">
        <span>{{ toast.message }}</span>
      </div>
    </b-alert>

    <div class="mb-3">
      <div class="col-sm-12">
        <label class="form-label mb-2">AD GROUP NAME</label>
        <b-form-select
          class="form-control"
          v-model="form.grpname"
          :options="form.gn_options"
          multiple
          :select-size="10"
          :disabled="true"
        ></b-form-select>
      </div>
    </div>

    <div class="mb-3">
      <div class="col-sm-12">
        <label class="form-label mb-2">Enter Keywords</label>
        <IncludeKeywordLow @onPutKeyword="putKeyword" />
      </div>
    </div>

    <div class="mb-3">
      <div class="row">
        <div class="col-sm-4">
          <b-form-group label="Exact Keywords">
            <b-form-textarea
              v-model="form.ek_text"
              placeholder="Enter or paste your exact keywords, one word or phrase per line"
              rows="10"
              no-resize
            ></b-form-textarea>
          </b-form-group>
        </div>
        <div class="col-sm-4">
          <b-form-group label="Phrase Keywords">
            <b-form-textarea
              v-model="form.pk_text"
              placeholder="Enter or paste your phrase keywords, one word or phrase per line"
              rows="10"
              no-resize
            ></b-form-textarea>
          </b-form-group>
        </div>
        <div class="col-sm-4">
          <b-form-group label="Broad Keywords">
            <b-form-textarea
              v-model="form.bk_text"
              placeholder="Enter or paste your broad keywords, one word or phrase per line"
              rows="10"
              no-resize
            ></b-form-textarea>
          </b-form-group>
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
        grpname: [],
        gn_options: [],
        ek_text: '',
        pk_text: '',
        bk_text: '',
        kws: [],
        intls: []
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
    form: {}
  },
  mounted() {
    this.form = this.payload

    this.form.gn_options = []
    this.form.kws = []
    this.form.intls = []
    for (var i = 0; i < this.payload.cn_selected.length; i++) {
      this.form.gn_options.push(
        this.payload.kw_arr[this.payload.cn_selected[i]]
      )
      this.form.kws.push(this.payload.kw_arr[this.payload.cn_selected[i]])
      this.form.intls.push(this.payload.intl_arr[this.payload.cn_selected[i]])
    }
  },
  methods: {
    doFormAction() {
      this.toggleBtnDisabled()
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.toggleBtnDisabled()
      } else {
        this.$emit('update', this.form, 5)
        this.toggleBtnDisabled()
      }
    },

    putKeyword(f, v) {
      if (f == 1) this.form.ek_text += v + '\n'
      if (f == 2) this.form.pk_text += v + '\n'
      if (f == 3) this.form.bk_text += v + '\n'
    }
  }
}
</script>
