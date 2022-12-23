<template>
  <main id="main-home" class="landing-page">
    <header class="landing-header">
      <b-container class="d-flex align-items-center flex-wrap">
        <nuxt-link to="/" class="navbar-brand"
          ><img src="~/assets/images/logo.png" alt="Jubilee Logo"
        /></nuxt-link>

        <div class="ml-auto">
          <button
            class="btn-pink text-uppercase hvr-bounce-in"
            @click="scrollToElement('contact-form')"
          >
            Free Beta Trial
          </button>
        </div>
      </b-container>
    </header>

    <section class="bg-white section-padding">
      <b-container>
        <b-row class="align-items-center">
          <b-col lg="5" class="mb-4 mb-lg-0">
            <h1 class="section-title">Where Automation Meets Scale</h1>
            <p>
              Reach new audiences and conversions with Jubilee, an AI-backed
              omnichannel marketing platform. Developed especially for
              performance-marketers.
            </p>
            <button
              class="btn-pink text-uppercase hvr-bounce-in mt-2"
              @click="scrollToElement('contact-form')"
            >
              Free Beta Trial
            </button>

            <p class="mt-3">
              <small class="note">*Data is for illustration only</small>
            </p>
          </b-col>
          <b-col lg="7">
            <img src="~/assets/images/jubilee-app.png" alt="Jubilee App" />
          </b-col>
        </b-row>
      </b-container>
    </section>

    <section class="bg-lpink section-padding">
      <b-container>
        <h2 class="text-center section-title">
          All-in-One Advertising Platform
        </h2>

        <b-row class="feature-list mt-5">
          <b-col cols="6" lg="4" class="mb-5 d-flex">
            <div class="icon-wrap">
              <img
                src="~/assets/images/jubilee-dashboard.png"
                alt="Strategic Dashboard"
              />
            </div>
            <h3>Strategic Dashboard</h3>
          </b-col>
          <b-col cols="6" lg="4" class="mb-5 d-flex">
            <div class="icon-wrap">
              <img
                src="~/assets/images/jubilee-creative.png"
                alt="Creative Insights"
              />
            </div>
            <h3>Creative Insights</h3>
          </b-col>
          <b-col cols="6" lg="4" class="mb-5 d-flex">
            <div class="icon-wrap">
              <img
                src="~/assets/images/jubilee-bid.png"
                alt="Bid Optimization"
              />
            </div>
            <h3>Bid Optimization</h3>
          </b-col>
          <b-col cols="6" lg="4" class="mb-5 d-flex">
            <div class="icon-wrap">
              <img
                src="~/assets/images/jubilee-adcopy.png"
                alt="Ad Copy Insights"
              />
            </div>
            <h3>Ad Copy Insights</h3>
          </b-col>
          <b-col cols="6" lg="4" class="mb-5 d-flex">
            <div class="icon-wrap">
              <img
                src="~/assets/images/jubilee-automation.png"
                alt="Automation Tactics"
              />
            </div>
            <h3>Automation Tactics</h3>
          </b-col>
          <b-col cols="6" lg="4" class="mb-5 d-flex">
            <div class="icon-wrap">
              <img
                src="~/assets/images/jubilee-adlauncher.png"
                alt="Ad Launcher"
              />
            </div>
            <h3>Ad Launcher</h3>
          </b-col>
        </b-row>

        <div class="text-center">
          <button
            class="btn-pink text-uppercase hvr-bounce-in"
            @click="scrollToElement('contact-form')"
          >
            Free Trial
          </button>
        </div>
      </b-container>
    </section>

    <section class="bg-white section-padding">
      <b-container>
        <b-row class="align-items-center">
          <b-col lg="6" class="order-lg-1 mb-4 mb-lg-0">
            <h2 class="section-title">Powerful tools to drive results</h2>
            <p>
              Jubilee offers robust tools that scale to the needs of growing
              businesses.
            </p>
            <button
              class="btn-pink text-uppercase hvr-bounce-in mt-4"
              @click="scrollToElement('contact-form')"
            >
              Signup for Beta Trial
            </button>
          </b-col>
          <b-col lg="6">
            <img src="~/assets/images/jubilee-graph.png" alt="Jubilee Graphs" />
          </b-col>
        </b-row>
      </b-container>
    </section>

    <section class="bg-lpink section-padding contact-form">
      <b-container>
        <h2 class="text-center section-title mb-5">
          Not seeing great results on other ad platforms? Try Jubilee.
        </h2>

        <b-form
          class="form-small-wrap text-center mx-auto"
          action=""
          @submit.prevent="doFormPost"
        >
          <p v-if="isSent">Message sent</p>
          <p v-if="hasError">Something went wrong</p>
          <div class="mb-3">
            <b-form-input
              placeholder="Full Name"
              required
              v-model="payload.name"
            ></b-form-input>
          </div>

          <div class="mb-3">
            <b-form-input
              type="email"
              placeholder="Email"
              v-model="payload.email"
              required
            ></b-form-input>
          </div>

          <div class="mb-3">
            <b-form-input
              placeholder="Company"
              required
              v-model="payload.company"
            ></b-form-input>
          </div>

          <div class="mb-4">
            <b-form-textarea
              placeholder="Message"
              rows="6"
              max-rows="6"
              no-resize
              v-model="payload.message"
            ></b-form-textarea>
          </div>

          <button
            :disabled="btnDisabled"
            type="submit"
            class="btn-pink text-uppercase hvr-bounce-in"
          >
            Signup For Beta Trial
          </button>
        </b-form>
      </b-container>
    </section>

    <IncludeFooterLanding />
  </main>
</template>

<script>
import error from '~/mixins/error'
import enums from '~/mixins/enums'
import helpers from '~/mixins/helpers'
import ContactForm from '~/models/ContactForm'
import { required } from 'vuelidate/lib/validators'
export default {
  layout: 'landing',
  middleware: false,
  data() {
    return {
      isSent: false,
      hasError: false,
      payload: {
        name: '',
        email: '',
        company: '',
        message: ''
      }
    }
  },
  head: {},
  mixins: [enums, error, helpers],
  mounted() {},
  methods: {
    async doFormPost() {
      this.toggleBtnDisabled()
      // this.$v.$touch()
      // if (this.$v.$invalid) {
      //   this.toggleBtnDisabled()
      // } else {
      ContactForm.post(this.payload)
        .then((res) => {
          this.toggleBtnDisabled()
          this.clearForm()
          this.isSent = true
          this.hasError = false
        })
        .catch((e) => {
          // this.showError(e.response)
          this.hasError = true
          this.isSent = false
        })
      // }
    },

    clearForm() {
      this.payload.name = ''
      this.payload.email = ''
      this.payload.company = ''
      this.payload.message = ''
    }
  },
  validations: {
    payload: {
      name: {
        required
      },
      email: {
        required
      },
      company: {
        required
      },
      message: {
        required
      }
    }
  }
}
</script>
