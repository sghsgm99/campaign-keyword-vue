<template>
  <form action="" enctype="multipart/form-data" @submit.prevent="doFormAction">
    <b-alert :show="showToast" dismissible fade v-if="toast.message">
      <div class="d-flex justify-content-between">
        <span>{{ toast.message }}</span>
      </div>
    </b-alert>

    <div class="mb-3">
      <div class="col-sm-6">
        <label class="form-label mb-2">Budget</label>
        <b-input-group prepend="$" class="input-group-btn campaign-tag-input">
          <b-form-input
            v-model="$v.form.budget.$model"
            placeholder="Enter your budget"
            :class="{ 'form-group--error': $v.form.budget.$error }"
          ></b-form-input>
        </b-input-group>
        <small class="form-text text-muted"
          >Set your average daily budget for this campaign</small
        >
        <div v-if="$v.form.budget.$dirty">
          <small class="text-error" v-if="!$v.form.budget.required"
            >Please enter budget</small
          >
          <small class="text-error" v-if="!$v.form.budget.decimal"
            >Invalid budget format</small
          >
        </div>
      </div>
    </div>

    <div class="mb-3">
      <div class="col-sm-6">
        <label class="form-label mb-2">Bidding</label>
        <b-form-checkbox v-model="form.bidding" value="true">
          Set a maximum cost per click bid limit
        </b-form-checkbox>
        <div v-if="form.bidding">
          <b-input-group prepend="$" class="input-group-btn campaign-tag-input">
            <b-form-input
              v-model="$v.form.bid.$model"
              placeholder="Maximum CPC bid limit"
              :class="{ 'form-group--error': $v.form.bid.$error }"
            ></b-form-input>
          </b-input-group>
          <small class="form-text text-muted">Maximize Clicks</small>
          <div v-if="$v.form.bid.$dirty">
            <small class="text-error" v-if="!$v.form.bid.required"
              >Please enter cpc</small
            >
            <small class="text-error" v-if="!$v.form.bid.numeric"
              >Invalid cpc format</small
            >
          </div>
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
import { required, numeric, decimal } from 'vuelidate/lib/validators'

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
        bidding: false,
        budget: null,
        bid: 10
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
      budget: {
        required,
        decimal
      },
      bid: {
        required,
        numeric
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
        this.$emit('update', this.form, 3)
        this.toggleBtnDisabled()
      }
    }
  }
}
</script>
