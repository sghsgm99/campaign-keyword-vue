const baseURL = process.env.API_BASE_URL
const baseVersionURL = process.env.API_VERSION_1_URL

export default {
  publicRuntimeConfig: {
    githubToken: process.env.SITE_JUBILEE_TOKEN,
    jubileeDeploymentUrl: process.env.SITE_JUBILEE_DEPLOYMENT_URL,
    facebookAppId: process.env.FACEBOOK_APP_ID
  },
  env: {
    baseVersionURL: process.env.API_VERSION_1_URL,
    rapidApiKey: process.env.RAPID_API_KEY,
    textGeneratorUrl: process.env.TEXT_GENERATOR_URL,
    textGeneratorHost: process.env.TEXT_GENERATOR_HOST,
    twinWordUrlWordAssoc: process.env.TWIN_WORD_URL_WORD_ASSOCIATION,
    twinWordUrlSentimentAnalyzer: process.env.TWIN_WORD_URL_SENTIMENT_ANALYZER,
    twinWordHost: process.env.TWIN_WORD_HOST,
    copyMaticUrl: process.env.COPY_MATIC_URL,
    copyMaticToken: process.env.COPY_MATIC_TOKEN,
    copyMaticModel: process.env.COPY_MATIC_MODEL,
    copyMaticTone: process.env.COPY_MATIC_TONE,
    copyMaticLanguage: process.env.COPY_MATIC_LANGUAGE,
    proxyHost: process.env.PROXY_HOST,
    proxyPort: process.env.PROXY_PORT,
    proxyUserName: process.env.PROXY_USERNAME,
    proxyUserPassword: process.env.PROXY_PASSOWRD,
    grammarlyToken: process.env.GRAMMARLY_TOKEN,
    generalAssistantUrl: process.env.GENERAL_ASSISTANT_URL,
    generalAssitantHost: process.env.GENERAL_ASSISTANT_HOST,
    writeSonicUrl: process.env.WRITE_SONIC_URL,
    writeSonicKey: process.env.WRITE_SONIC_KEY,
    writeSonicId: process.env.WRITE_SONIC_ID,
    writeSonicEngine: process.env.WRITE_SONIC_ENGINE,
    writeSonicLanguage: process.env.WRITE_SONIC_LANGUAGE,
    copyScapeUrl: process.env.COPY_SCAPE_URL,
    copyScapeUsername: process.env.COPY_SCAPE_USERNAME,
    copyScapeToken: process.env.COPY_SCAPE_TOKEN,
    readableUrl: process.env.READABLE_ANALYSE_TEXT_ENDPOINT,
    readableKey: process.env.READBALE_KEY,
    apiDeployer: process.env.JUBILEE_DEPLOYER,
    googleApiKey: process.env.GOOGLE_API_KEY
  },

  ssr: false,
  router: {
    middleware: ['auth', 'role']
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Jubilee',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'robots', content: 'noindex,nofollow' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' },
      {
        rel: 'stylesheet',
        href: 'https://use.fontawesome.com/releases/v5.15.4/css/all.css',
        crossorigin: 'anonymouse'
      }
    ],
    script: [
      {
        src:
          'https://maps.googleapis.com/maps/api/js?key=' +
          process.env.GOOGLE_API_KEY +
          '&libraries=places'
      }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/scss/main.scss', '~/assets/css/vulidate.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/VuexORMAxios' },
    { src: '~/plugins/Vuelidate', ssr: true },
    { src: '~/plugins/DragAndDropImg' },
    { src: '~/plugins/QuillEditor', ssr: true },
    { src: '~/plugins/VueSelect', ssr: true },
    { src: '~/plugins/DialogBox', mode: 'client' },
    { src: '~/plugins/VueDraggable' },
    { src: '~/plugins/VueCookies' },
    { src: '~/plugins/CopyMaticPlugin.js' },
    { src: '~/plugins/TwinWordPlugin.js' },
    { src: '~/plugins/GeneralAssistantPlugin.js' },
    { src: '~/plugins/WriteSonicPlugin.js' },
    { src: '~/plugins/CopyScapePlugin.js' },
    { src: '~/plugins/ReadableApiPlugin.js' },
    { src: '~/plugins/VueToggleButton.js' },
    { src: '~/plugins/GoogleCharts.js' },
    { src: '~/plugins/ObjectToFormData.js' }
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/pwa',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/proxy',
    'vue-swatches/nuxt'
  ],

  pwa: {
    manifest: {
      name: 'Jubilee App',
      short_name: 'JBL',
      lang: 'en',
      useWebmanifestExtension: false
    }
  },

  components: true,

  proxy: {
    '/api': { target: baseURL, pathRewrite: { '^/api/': '' } },
    '/copymatic-api/': {
      target: process.env.COPY_MATIC_URL,
      pathRewrite: { '^/copymatic-api/': '' },
      changeOrigin: true
    }
  },

  axios: {
    //baseUrl : 'http://localhost:8000/api/v1',
    baseUrl: baseVersionURL,
    // proxy: true,
    withCredentials: true
    // credentials : true
  },

  auth: {
    redirect: {
      login: '/',
      callback: '/login'
    },
    strategies: {
      laravelSanctum: {
        provider: 'laravel/sanctum',
        url: baseURL,
        endpoints: {
          login: { url: '/api/v1/login', method: 'post' },
          user: { url: '/api/v1/auth/user', method: 'get' },
          logout: { url: '/api/v1/logout', method: 'post' }
        },
        user: {
          property: 'data.user'
        },
        token: {
          property: 'data.token',
          global: true,
          required: true,
          type: 'Bearer'
        }
      },
      local: {
        token: {
          property: 'data.token',
          global: true,
          required: true,
          type: 'Bearer',
          maxAge: 86400
        },
        user: {
          property: 'data.user',
          autoFetch: true
        },
        endpoints: {
          login: { url: '/login', method: 'post' },
          logout: { url: '/logout', method: 'post' },
          user: { url: '/auth/user', method: 'get' }
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
}
