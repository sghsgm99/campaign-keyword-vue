<template>
  <div>
    <form @submit.prevent="doFormAction">
      <b-alert :show="showToast" dismissible fade v-if="toast.message">
        <div class="d-flex justify-content-between">
          <span>{{ toast.message }}</span>
        </div>
      </b-alert>
      <b-row class="pb-2">
        <b-col cols="12">
          <label class="form-label pb-2">Collection Name</label>
          <input
            type="text"
            class="form-control mb-1"
            v-model.trim="$v.form.name.$model"
            :class="{ 'form-group--error': $v.form.name.$error }"
            autocomplete="false"
          />
          <div v-if="$v.form.name.$dirty">
            <small class="text-error" v-if="!$v.form.name.required"
              >Collection Name is required</small
            >
          </div>
        </b-col>
      </b-row>
      <b-row class="justify-content-end">
        <b-col>
          <div
            class="form-bottom d-flex align-items-center justify-content-end"
          >
            <input
              type="submit"
              class="btn btn-primary primary-btn"
              value="Create"
              :disabled="btnDisabled"
            />
            <b-button
              class="btn px-4"
              variant="plain"
              @click="$bvModal.hide('formCreateCollection')"
              >Cancel</b-button
            >
          </div>
        </b-col>
      </b-row>
    </form>
  </div>
</template>

<script>
import Collections from '~/models/Collections'
import enums from '~/mixins/enums'
import error from '~/mixins/error'
import { required } from 'vuelidate/lib/validators'

export default {
  layout: 'form',
  data() {
    return {
      form: {
        name: ''
      },
      toast: {
        message: null
      },
      showToast: false
    }
  },
  mixins: [enums, error],
  validations: {
    form: {
      name: {
        required
      },
    }
  },
  methods: {
    cleanPayload() {
      let data = this.form
      data.user_id = this.$auth.user.id

      return data
    },

    doFormAction() {
      return this.doFormPost()
    },
    
    async doFormPost() {
      this.toggleBtnDisabled()
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.toggleBtnDisabled()
      } else {
        let payload = await this.cleanPayload()
        Collections.create({
          data: payload
        }).then((_) => {
          Collections.post(payload)
            .then((res) => {
              this.$router.push(
                `/collections/edit/${res.response.data.data.id}?new=true`
              )
            })
            .catch((e) => {
              this.showError(e.response)
            })
        })
      }
    },
  }
}
</script>
