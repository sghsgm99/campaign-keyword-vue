<template>
  <div class="data-content data-content-tabs ps-4 pe-4 pb-4">
    <div id="db-forms">
      <b-card no-body>
        <b-tabs card pills>
          <b-tab title="Campaign Select" active @click="currentStep = 1">
            <div class="d-flex justify-content-center mb-3" v-if="!isLoaded">
              <b-spinner></b-spinner>
            </div>
            <Step1
              v-if="currentStep === 1 && isLoaded"
              :payload="form"
              @update="updatePayload"
            />
          </b-tab>
          <b-tab
            title="Budget and Bidding"
            :active="currentStep === 2 && isLoaded"
            :disabled="step2Disabled"
            @click="currentStep = 2"
          >
            <Step2
              v-if="currentStep === 2 && isLoaded"
              :payload="form"
              @update="updatePayload"
            />
          </b-tab>
          <b-tab
            title="Campaign Settings"
            :active="currentStep === 3 && isLoaded"
            :disabled="step3Disabled"
            @click="currentStep = 3"
          >
            <Step3
              v-if="currentStep === 3 && isLoaded"
              :payload="form"
              @update="updatePayload"
            />
          </b-tab>
          <b-tab
            title="Keywords"
            :active="currentStep === 4 && isLoaded"
            :disabled="step4Disabled"
            @click="currentStep = 4"
          >
            <Step4
              v-if="currentStep === 4 && isLoaded"
              :payload="form"
              @update="updatePayload"
            />
          </b-tab>
          <b-tab
            title="Ads"
            :active="currentStep === 5 && isLoaded"
            :disabled="step5Disabled"
            @click="currentStep = 5"
          >
            <Step5
              v-if="currentStep === 5 && isLoaded"
              :payload="form"
              @update="updatePayload"
            />
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
import enums from '~/mixins/enums'
import error from '~/mixins/error'
import Step1 from './Steps/Step1.vue'
import Step2 from './Steps/Step2.vue'
import Step3 from './Steps/Step3.vue'
import Step4 from './Steps/Step4.vue'
import Step5 from './Steps/Step5.vue'

export default {
  layout: 'form',
  data() {
    return {
      isLoaded: false,
      currentStep: 1,
      step2Disabled: true,
      step3Disabled: true,
      step4Disabled: true,
      step5Disabled: true,
      readOnly: false,
      toast: {
        message: null
      },
      showToast: false,
      statusOptions: [],
      form: {
        ckeyword: '',
        clvalue: 5,
        cn_selected: [],
        budget: null,
        bid: 10,
        net_search: false,
        net_display: false,
        location: '2840',
        language: "English",
        grpname: [],
        ek_text: '',
        pk_text: '',
        bk_text: '',
        finalurl: null,
        headlines: null,
        descriptions: null
      }
    }
  },
  components: {
    Step1,
    Step2,
    Step3,
    Step4,
    Step5
  },
  mixins: [enums, error],
  async fetch() {
    this.isLoaded = true
  },
  methods: {
    previousStep() {
      this.currentStep--
    },

    nextStep() {
      this.currentStep++
    },

    updatePayload(data = {}, step = 1) {
      if (!this.readOnly) {
        this.form = data
      }
      this.currentStep = step

      if (step === 2) {
        this.step2Disabled = false
      }

      if (step === 3) {
        this.step3Disabled = false
      }

      if (step === 4) {
        this.step4Disabled = false
      }

      if (step === 5) {
        this.step5Disabled = false
      }
    }
  }
}
</script>
