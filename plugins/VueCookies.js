import Vue from 'vue'
import VueCookies from 'vue-cookies'
VueCookies.config('14d', process.env.API_BASE_URL || 'http://localhost:3000')
Vue.use(VueCookies)