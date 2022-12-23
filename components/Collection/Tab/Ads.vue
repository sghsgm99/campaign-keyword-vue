<template>
  <form action="" enctype="multipart/form-data">
    <b-alert v-model="showToast" dismissible fade v-if="toast.message">
      <div class="d-flex justify-content-between">
        <span>{{ toast.message }}</span>
      </div>
    </b-alert>

    <div class="mb-3">
      <label class="form-label">Channel</label>
      <div class="position-relative">
        <div class="v-select-custom-spinner" v-show="showLoader">
          <b-spinner label="Loading..."></b-spinner>
        </div>
        <v-select
          class="status mb-1 form-input"
          label="title"
          :filterable="false"
          v-model="form.channelObj"
          :options="channelOptions"
          v-on:input="setAdAccountOptions"
          :class="{ 'form-group--error': $v.form.channelObj.$error }"
          :disabled="disableInput"
        >
        </v-select>
        <div v-if="$v.form.channelObj.$dirty">
          <small class="text-error" v-if="!$v.form.channelObj.required"
            >Channel is required</small
          >
        </div>
      </div>
    </div>

    <div class="mb-3">
      <div class="row">
        <div class="col-sm-6">
          <label class="form-label">Ad Accounts</label>
          <div class="position-relative">
            <div class="v-select-custom-spinner" v-show="showLoader1">
              <b-spinner label="Loading..."></b-spinner>
            </div>
            <v-select
              class="status mb-1 form-input"
              label="name"
              :clearable="true"
              :filterable="false"
              v-model="form.adAccountObj"
              :options="adAccountOptions"
              v-on:input="setCampaignOptions"
              :class="{ 'form-group--error': $v.form.adAccountObj.$error }"
              :disabled="disableInput"
            >
            </v-select>
          </div>
          <div v-if="$v.form.adAccountObj.$dirty">
            <small class="text-error" v-if="!$v.form.adAccountObj.required"
              >Ad Account is required</small
            >
          </div>
        </div>
        <div class="col-sm-6">
          <label class="form-label">Campaigns</label>
          <div class="position-relative">
            <div class="v-select-custom-spinner" v-show="showLoader2">
              <b-spinner label="Loading..."></b-spinner>
            </div>
            <v-select
              class="status mb-1 form-input"
              label="title"
              :clearable="true"
              :filterable="false"
              v-model="form.campaignObj"
              :options="campaignOptions"
              v-on:input="setAdSetOptions"
              :class="{ 'form-group--error': $v.form.campaignObj.$error }"
              :disabled="disableInput"
            >
            </v-select>
            <div v-if="$v.form.campaignObj.$dirty">
              <small class="text-error" v-if="!$v.form.campaignObj.required"
                >Campagin is required</small
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-3">
      <div class="row">
        <div class="col-sm-6">
          <label class="form-label">AdSet</label>
          <div class="position-relative">
            <div class="v-select-custom-spinner" v-show="showLoader3">
              <b-spinner label="Loading..."></b-spinner>
            </div>
            <v-select
              class="status mb-1 form-input"
              label="title"
              :clearable="true"
              :filterable="false"
              :options="adSetOptions"
              v-model="form.adSetObj"
              :class="{ 'form-group--error': $v.form.adSetObj.$error }"
              :disabled="disableInput"
            >
            </v-select>
            <div v-if="$v.form.adSetObj.$dirty">
              <small class="text-error" v-if="!$v.form.adSetObj.required"
                >Ad Set is required</small
              >
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <label class="form-label">Number of Ads to be created</label>
          <input
            type="number"
            min="0"
            :max="maxInputAds"
            class="title form-control mb-0"
            v-model="form.ads_number"
            :class="{ 'form-group--error': $v.form.ads_number.$error }"
            @blur="$v.form.ads_number.$touch"
            :disabled="disableInput"
          />
          <div v-if="$v.form.ads_number.$error">
            <small class="text-error" v-if="!$v.form.ads_number.maxValue"
              >Value must be less than or equal to {{ maxInputAds }}</small
            >
          </div>
        </div>
      </div>
    </div>

    <hr class="mt-30px" />

    <div class="mb-3">
      <label class="form-label">Collection Group</label>
      <v-select
        class="status mb-1 form-input"
        label="name"
        :filterable="false"
        v-model="form.group_name"
        :options="groupOptions"
        @input="changeGroup"
        :class="{ 'form-group--error': $v.form.group_name.$error }"
        :disabled="!!adId"
      >
      </v-select>
      <div v-if="$v.form.group_name.$dirty">
        <small class="text-error" v-if="!$v.form.group_name.required"
          >Collection Group is required</small
        >
      </div>
    </div>

    <div v-if="form.group_name">
      <div>
        <label class="form-label mb-2">Images</label>

        <div class="d-flex flex-wrap">
          <div
            v-for="(img, index) in form.add_images"
            :key="index"
            class="img-collection"
          >
            <button
              v-if="!disableInput"
              class="remove-img"
              @click.prevent="removeInputField('add_images', index)"
            >
              <i class="far fa-times-circle"></i>
            </button>
            <img :src="form.add_images[index]" />
          </div>
          <div v-if="!form.add_images.length" class="font-14px text-danger">
            No images available
          </div>
        </div>
      </div>
      <div v-if="$v.form.add_images.$dirty">
        <small class="text-error" v-if="!$v.form.add_images.required"
          >Image is required</small
        >
      </div>

      <div class="my-3">
        <label class="form-label">HeadLine</label>
        <div
          class="d-flex"
          v-for="(h, index) in form.add_headline"
          :key="index"
        >
          <input
            type="text"
            class="title form-control mb-0"
            v-model="form.add_headline[index]"
            :disabled="disableInput"
          />

          <button
            v-if="!disableInput"
            class="btn-remove-field"
            @click.prevent="removeInputField('add_headline', index)"
          >
            <i class="far fa-times-circle"></i>
          </button>
        </div>
      </div>

      <div v-if="!disableInput" class="my-3">
        <button
          class="pink-link p-0 text-uppercase"
          @click.prevent="addInputField('add_headline')"
        >
          <span class="add-circle"><i class="fas fa-plus"></i></span>
          Add HeadLine
        </button>
      </div>
      <div v-if="$v.form.add_headline.$dirty">
        <small class="text-error" v-if="!$v.form.add_headline.required"
          >Headline is required</small
        >
      </div>

      <div class="my-3">
        <label class="form-label">Description</label>
        <div class="d-flex" v-for="(d, index) in form.add_text" :key="index">
          <quillEditor
            v-model="form.add_text[index]"
            class="wysiwyg-container mt-10px flex-fill overflow-hidden"
            :options="{ placeholder: '' }"
            :disabled="disableInput"
          />

          <button
            v-if="!disableInput"
            class="btn-remove-field"
            @click.prevent="removeInputField('add_text', index)"
          >
            <i class="far fa-times-circle"></i>
          </button>
        </div>
      </div>

      <div v-if="!disableInput" class="my-3">
        <button
          class="pink-link p-0 text-uppercase"
          @click.prevent="addInputField('add_text')"
        >
          <span class="add-circle"><i class="fas fa-plus"></i></span>
          Add Description
        </button>
      </div>
      <div v-if="$v.form.add_text.$dirty">
        <small class="text-error" v-if="!$v.form.add_text.required"
          >Description is required</small
        >
      </div>

      <div class="my-3">
        <label class="form-label">Text</label>
        <div class="d-flex" v-for="(t, index) in form.add_title" :key="index">
          <input
            type="text"
            class="title form-control mb-0"
            v-model="form.add_title[index]"
            :disabled="disableInput"
          />

          <button
            v-if="!disableInput"
            class="btn-remove-field"
            @click.prevent="removeInputField('add_title', index)"
          >
            <i class="far fa-times-circle"></i>
          </button>
        </div>
      </div>

      <div v-if="!disableInput" class="my-3">
        <button
          class="pink-link p-0 text-uppercase"
          @click.prevent="addInputField('add_title')"
        >
          <span class="add-circle"><i class="fas fa-plus"></i></span>
          Add Text
        </button>
      </div>
      <div v-if="$v.form.add_title.$dirty">
        <small class="text-error" v-if="!$v.form.add_title.required"
          >Text is required</small
        >
      </div>

      <div class="my-3">
        <label class="form-label">Call To Action</label>
        <div
          class="d-flex"
          v-for="(act, index) in form.add_call_to_action"
          :key="index"
        >
          <b-form-select
            v-model="form.add_call_to_action[index]"
            :options="facebookCallToActionEnum"
            value-field="value"
            text-field="label"
            class="form-control mb-0"
            :disabled="disableInput"
          ></b-form-select>

          <button
            v-if="!disableInput"
            class="btn-remove-field"
            @click.prevent="removeInputField('add_call_to_action', index)"
          >
            <i class="far fa-times-circle"></i>
          </button>
        </div>
      </div>

      <div v-if="!disableInput" class="my-3">
        <button
          class="pink-link p-0 text-uppercase"
          @click.prevent="addInputField('add_call_to_action')"
        >
          <span class="add-circle"><i class="fas fa-plus"></i></span>
          Add Call to Action
        </button>
      </div>
      <div v-if="$v.form.add_call_to_action.$dirty">
        <small class="text-error" v-if="!$v.form.add_call_to_action.required"
          >Call to action is required</small
        >
      </div>

      <div class="my-3">
        <label class="form-label">URL</label>
        <div
          class="url d-flex"
          v-for="(url, index) in form.add_url"
          :key="index"
        >
          <input
            type="text"
            class="title form-control mb-0"
            v-model="form.add_url[index]"
            placeholder="https://www.example.com"
            :disabled="disableInput"
          />

          <button
            v-if="!disableInput"
            class="btn-remove-field"
            @click.prevent="removeInputField('add_url', index)"
          >
            <i class="far fa-times-circle"></i>
          </button>
        </div>
      </div>

      <div v-if="!disableInput" class="my-3">
        <button
          class="pink-link p-0 text-uppercase"
          @click.prevent="addInputField('add_url')"
        >
          <span class="add-circle"><i class="fas fa-plus"></i></span>
          Add URL
        </button>
      </div>
      <div v-if="$v.form.add_url.$dirty">
        <small class="text-error" v-if="!$v.form.add_url.required"
          >URL is required</small
        >
      </div>
    </div>

    <div class="mt-5 mb-3">
      <div
        class="form-bottom d-flex justify-content-between align-items-center flex-wrap"
      >
        <div>
          <b-button
            :disabled="showPreview && form.ads_number == 0"
            variant="green primary-btn"
            v-b-modal.ads-preview
            @click="adsPreview"
            >Ads Preview</b-button
          >
        </div>
        <div>
          <input
            type="button"
            class="btn btn-pink-border primary-btn"
            value="Save As Draft"
            v-if="!disableInput"
            :disabled="btnDisabled"
            @click="doFormAction(1)"
          />
          <input
            type="button"
            class="btn btn-pink-fill primary-btn"
            value="Save"
            @click="doFormAction(2)"
            :disabled="btnDisabled || disableInput"
          />
          <input
            type="button"
            class="btn primary-outline-btn"
            value="Cancel"
            @click="closePublishAnAD()"
          />
        </div>
      </div>
    </div>

    <b-modal
      id="ads-preview"
      title="Ads Preview"
      size="xl"
      hide-footer
      centered
      :dialog-class="{ darktheme: darkMode }"
      header-bg-variant="headerlight"
    >
      <div class="preview-list-container" v-if="!this.isPreviewLoading">
        <article
          v-for="(a, i) in adsPreviewList"
          :key="i + '-prev'"
          class="preview-item mb-3"
        >
          <div>
            <img v-if="a.image" :src="a.image" class="mb-12px" />

            <h3 v-if="a.headline.value">{{ a.headline.value }}</h3>

            <div
              v-if="a.description.value"
              class="description"
              v-html="a.description.value"
            ></div>

            <div v-if="a.title.value" class="text">{{ a.title.value }}</div>

            <div v-if="a.call_to_action.value" class="cta-text">
              {{ a.call_to_action.value }}
            </div>
          </div>
        </article>
      </div>
    </b-modal>
  </form>
</template>

<script>
import Collections from '~/models/Collections'
import CollectionAds from '~/models/CollectionAds'
import Channels from '~/models/Channels'
import FacebookAds from '~/models/FacebookAds'
import _debounce from 'lodash/debounce'
import error from '~/mixins/error'
import enums from '~/mixins/enums'
import { required, maxValue } from 'vuelidate/lib/validators'
import { quillEditor } from 'vue-quill-editor'

export default {
  layout: 'form',
  props: {
    value: {
      type: String,
      default: ''
    },
    adId: {
      type: Number,
      default: null
    },
    adType: {
      type: Number,
      default: null
    }
  },
  components: {
    quillEditor
  },
  data() {
    const inputGroups = [
      'add_headline',
      'add_text',
      'add_title',
      'add_call_to_action',
      'add_url',
      'add_images'
    ]

    return {
      channelOptions: [],
      adAccountOptions: [],
      campaignOptions: [],
      adSetOptions: [],
      groupOptions: [],
      creativeList: [],
      inputGroups,
      status: 1,
      form: {
        channel_id: null,
        channelObj: null,
        ad_account_id: null,
        adAccountObj: null,
        campaign_id: null,
        campaignObj: null,
        adset_id: null,
        adSetObj: null,
        group_id: null,
        group_name: null,
        ads_number: 0,
        add_url: [],
        add_title: [],
        add_headline: [],
        add_call_to_action: [],
        add_text: [],
        add_images: [],
        fb_ad_ids: []
      },
      toast: {
        message: null
      },
      showToast: false,
      showLoader: false,
      showLoader1: false,
      showLoader2: false,
      showLoader3: false,
      isPreviewLoading: false,
      adsPreviewList: {}
    }
  },
  head: {
    bodyAttrs: {
      id: 'form'
    }
  },
  mixins: [enums, error],
  async fetch() {
    if (this.$route.params.id && this.$route.name.indexOf('edit') != -1) {
      const id = this.$route.params.id

      if (this.adId != null) {
        await CollectionAds.fetch(this.adId).then((res) => {
          const result = res.response.data.data

          this.$emit('input', result.group_name)

          this.form = { ...result }
        })
      }

      await this.fetchChannels()

      await Collections.getGroups(id).then((res) => {
        this.groupOptions = res.response.data.data
      })
    }
  },
  computed: {
    maxInputAds() {
      return this.form?.add_images?.length
    },

    showPreview() {
      return (
        this.form?.add_images?.length &&
        this.form?.add_headline?.length &&
        this.form?.add_text?.length &&
        this.form?.add_title?.length &&
        this.form?.add_call_to_action?.length
      )
    },

    darkMode() {
      return this.$store.state.isDarkActive
    },

    // async adsPreviewList() {
    //   const headlines = this.form.add_headline
    //   const descriptions = this.form.add_text
    //   const titles = this.form.add_title
    //   const actions = this.form.add_call_to_action
    //   const images = this.form.add_images

    //   let list = []
    //   for (let i = 0; i < this.form.ads_number; i++) {
    //     list.push({
    //       image: !!images.length
    //         ? images[this.randomIndex(images.length)]
    //         : null,
    //       headline: !!headlines.length
    //         ? headlines[this.randomIndex(headlines.length)]
    //         : null,
    //       description: !!descriptions.length
    //         ? descriptions[this.randomIndex(descriptions.length)]
    //         : null,
    //       title: !!titles.length
    //         ? titles[this.randomIndex(titles.length)]
    //         : null,
    //       action: !!actions.length
    //         ? actions[this.randomIndex(actions.length)]
    //         : null
    //     })
    //   }
    //   console.log('preview payload', this.form)
    //   // await CollectionAds.preview(this.adId).then((res) => {
    //   //   console.log('list', res.response.data.data)
    //   //   // const list = res.response.data.data
    //   //   this.form = { ...result }
    //   // })
    //   return list
    // },

    disableInput() {
      return this.adType ? this.adType === 2 : this.form.status === 2
    }
  },
  methods: {
    cleanPayload() {
      let newForm = this.form
      newForm.collection_id = this.$route.params.id
      newForm.channel_id = this.form.channelObj.id
      newForm.ad_account_id = this.form.adAccountObj.account_id
      newForm.campaign_id = this.form.campaignObj.id
      newForm.adset_id = this.form.adSetObj.id
      newForm.status = this.status

      const {
        adAccountObj,
        adSetObj,
        campaignObj,
        channelObj,
        group_name,
        ...data
      } = newForm

      return data
    },

    fetchAdPayload() {
      let arr = []
      let data
      for (let i = 0; i < this.form.ads_number; i++) {
        data = {
          adset_id: this.form.adset_id,
          status: this.status,
          primary_text: this.form.add_title[i] ?? null,
          headline: this.form.add_headline[i] ?? null,
          description: null,
          display_link: this.form.add_url[i] ?? null,
          call_to_action: this.form.add_call_to_action[i] ?? null,
          ad_description: null
        }
        arr.push(data)
      }

      return arr
    },

    async doFormAction(status) {
      this.status = status

      if (this.adId != null) {
        return this.doFormPut()
      } else {
        return this.doFormPost()
      }
    },

    async doFormPost() {
      this.toggleBtnDisabled()
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.toggleBtnDisabled()
      } else {
        let payload = await this.cleanPayload()

        //let adPayload = this.fetchAdPayload()
        //await FacebookAds.post(adPayload)
        //  .then((res) => {
        //    let ads = []
        //    res.response.data.map((e) => {
        //      ads.push(e.original.data.id)
        //    })
        //
        //    payload.ads = ads
        //  })
        //  .catch((e) => {
        //    this.showError(e.response)
        //  })

        await CollectionAds.create({
          data: payload
        }).then((_) => {
          CollectionAds.post(payload, this.status)
            .then((res) => {
              const result = res.response.data.data
              this.$emit('input', result.group_name)
              $nuxt.$emit('emit-show-tab', {
                message: 'success',
                adId: result.id,
                adType: result.status
              })
              this.showToast = true
              this.toast.message = 'Campaign Collection Ad has been created!'
              this.scrollToTop()
              this.toggleBtnDisabled()
            })
            .catch((e) => {
              this.showError(e.response)
            })
        })
      }
    },

    async doFormPut() {
      this.toggleBtnDisabled()
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.toggleBtnDisabled()
      } else {
        let payload = await this.cleanPayload()

        await CollectionAds.update({
          where: this.adId,
          data: payload
        }).then((_) => {
          CollectionAds.put(this.adId, payload)
            .then((res) => {
              const result = res.response.data.data
              $nuxt.$emit('emit-show-tab', {
                message: 'success',
                adId: result.id,
                adType: result.status
              })
              this.showToast = true
              this.toast.message = 'Campaign Collection Ad has been updated!'
              this.scrollToTop()
              this.toggleBtnDisabled()
            })
            .catch((e) => {
              this.showError(e.response)
            })
        })
      }
    },

    resetAdInputs() {
      this.form.fb_ad_ids = []
      this.form.add_url = []
      this.form.add_title = []
      this.form.add_headline = []
      this.form.add_call_to_action = []
      this.form.add_text = []
      this.form.add_images = []
    },

    populateAdInputs(arr) {
      const ids = this.form.fb_ad_ids
      const headlines = this.form.add_headline
      const descriptions = this.form.add_text
      const titles = this.form.add_title
      const actions = this.form.add_call_to_action
      const urls = this.form.add_url
      const images = this.form.add_images

      arr.forEach((el) => {
        el.id ? ids.push(el.id) : ''
        el.headline ? headlines.push(el.headline) : ''
        el.text ? descriptions.push(el.text) : ''
        el.title ? titles.push(el.title) : ''
        el.action ? actions.push(el.action) : ''
        el.url ? urls.push(el.url) : ''
        el.image ? images.push(el.image) : ''
      })

      this.inputGroups.forEach((g) => {
        this.sliceToMaxInput(g)
      })
    },

    sliceToMaxInput(element) {
      this.form[element].length > this.maxInputAds
        ? (this.form[element] = this.form[element].slice(0, this.maxInputAds))
        : ''
    },

    changeGroup(e) {
      if (e != null) {
        this.form.group_id = e.id
      }
      this.getCreativesFromGroup(this.form.group_id)
    },

    async getCreativesFromGroup(gid) {
      const maxCreatives = 1000
      await Collections.setPerPage(maxCreatives)
        .getCreatives(gid)
        .then((res) => {
          this.resetAdInputs()
          this.creativeList = res.response.data.data

          this.populateAdInputs(this.creativeList)

          const length = this.form.add_images.length
          const adsNum = this.form.ads_number
          this.form.ads_number = adsNum > length ? length : adsNum
        })
    },

    addInputField(input) {
      this.form[input].push('')
    },

    removeInputField(input, index) {
      this.form[input].splice(index, 1)
    },

    closePublishAnAD() {
      $nuxt.$emit('emit-close-tab', { message: 'success' })
    },

    async fetchChannels() {
      this.showLoader = true

      await Channels.setSearch('')
        .collection()
        .then((res) => {
          this.channelOptions = res.response.data.data

          if (this.adId != null) {
            let currentChannel = this.channelOptions.filter((item) => {
              return item.id == this.form.channel_id
            })

            if (currentChannel != null) {
              this.setAdAccountOptions(currentChannel[0])
            }

            this.form.channelObj = currentChannel[0]
          }

          this.showLoader = false
        })
    },

    async setAdAccountOptions(channelObj) {
      if (channelObj == null) {
        this.form.adAccountObj = ''
      } else {
        this.showLoader1 = true
        let channelDefaultAdAccount = channelObj.facebook_channel.ad_account
        this.adAccountOptions = []
        this.form.adAccountObj = ''

        await Channels.setAdAccountStatus(1)
          .fetchAdAccountsChild(channelObj.id)
          .then((res) => {
            this.adAccountOptions = res.response.data.data

            if (this.adId != null) {
              let currentAdAccount = this.adAccountOptions.filter((item) => {
                return item.account_id == channelDefaultAdAccount
              })

              if (currentAdAccount != null) {
                this.setCampaignOptions(currentAdAccount[0])
              }

              this.form.adAccountObj = currentAdAccount[0]
            }
            this.showLoader1 = false
          })
          .catch((e) => {
            this.showError(e.response)
          })
      }
    },

    async setCampaignOptions(adAccountObj) {
      if (adAccountObj == null) {
        this.form.campaignObj = ''
      } else {
        this.showLoader2 = true
        this.campaignOptions = []
        this.form.campaignObj = ''

        await CollectionAds.getCampaigns(adAccountObj.account_id)
          .then((res) => {
            this.campaignOptions = res.response.data.data

            if (this.adId != null) {
              let currentCampaign = this.campaignOptions.filter((item) => {
                return item.id == this.form.campaign_id
              })

              if (currentCampaign != null) {
                this.setAdSetOptions(currentCampaign[0])
              }

              this.form.campaignObj = currentCampaign[0]
            }

            this.showLoader2 = false
          })
          .catch((e) => {
            this.showError(e.response)
          })
      }
    },

    async setAdSetOptions(campaignObj) {
      if (campaignObj == null) {
        this.form.adSetObj = ''
      } else {
        this.showLoader3 = true
        this.adSetOptions = []
        this.form.adSetObj = ''

        await CollectionAds.getAdSets(campaignObj.id)
          .then((res) => {
            this.adSetOptions = res.response.data.data

            if (this.adId != null) {
              let currentAdSet = this.adSetOptions.filter((item) => {
                return item.id == this.form.adset_id
              })

              this.form.adSetObj = currentAdSet[0]
            }

            this.showLoader3 = false
          })
          .catch((e) => {
            this.showError(e.response)
          })
      }
    },

    async adsPreview() {
      this.isPreviewLoading = true
      let payload = {
        add_headline: this.form.add_headline,
        add_text: this.form.add_text,
        add_title: this.form.add_title,
        add_call_to_action: this.form.add_call_to_action,
        add_images: this.form.add_images,
        add_url: this.form.add_url,
        ads_number: this.form.ads_number
      }

      await CollectionAds.preview(payload).then((res) => {
        console.log('list', res.response.data)
        this.adsPreviewList = res.response.data
      })
      this.isPreviewLoading = false
    },

    randomIndex(max) {
      return Math.floor(Math.random() * max)
    },

    scrollToTop() {
      window.scrollTo(0, 0)
    }
  },
  validations() {
    return {
      form: {
        channelObj: { required },
        adAccountObj: { required },
        campaignObj: { required },
        group_name: { required },
        adSetObj: { required },
        ads_number: { maxValue: maxValue(this.maxInputAds) },
        add_images: { required },
        add_headline: { required },
        add_text: { required },
        add_title: { required },
        add_call_to_action: { required },
        add_url: { required }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#db-forms .form-bottom {
  > div * {
    width: auto;
  }

  .btn-pink-border,
  .btn-pink-fill,
  .btn-green {
    width: 150px;
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .btn-pink-border,
  .btn-pink-fill {
    margin-left: 20px;
  }

  .btn-pink-border {
    color: #f24272;
    border-color: #f24272;

    &:hover {
      color: #fff;
    }
  }

  .btn-pink-fill {
    color: #fff;
  }
}

#db-forms .article-dropbox {
  &::v-deep .grid-block-wrapper .grid-block {
    width: 100px !important;
    min-width: auto !important;
  }
  &::v-deep .vue-file-agent.file-input-wrapper {
    text-align: left;
  }

  .grid-box-item {
    color: transparent;
  }
}

.btn-remove-field {
  border: 0;
  background: transparent;
  font-size: 20px;
  color: #7b7b7b;
  top: 10px;
  position: relative;
  padding: 10px;
  height: 100%;

  &:hover {
    color: #201430;
  }

  .darktheme & {
    color: #aab8c6;

    &:hover {
      color: #fff;
    }
  }
}

.preview-item {
  border: 1px solid #bfbfbf;
  border-radius: 5px;
  padding: 10px;
  display: grid;
  grid-template-rows: 1fr auto;
  break-inside: avoid;

  > div {
    grid-row: 1 / -1;
    grid-column: 1;
  }

  img {
    height: auto;
    max-height: 200px;
    object-fit: contain;
  }

  h3 {
    font-size: 16px;
  }

  .description,
  .text,
  .cta-text {
    font-size: 13px;
    padding-bottom: 5px;
  }

  .text,
  .cta-text {
    border-top: 1px solid #d9d9d9;
    padding-top: 12px;
    margin-top: 8px;
  }
}

.img-collection {
  position: relative;
  margin-right: 22px;
  margin-bottom: 20px;

  img {
    width: 110px;
    max-width: 100%;
    max-height: auto;
  }

  .remove-img {
    border: 0;
    background: transparent;
    padding: 0;
    color: #7b7b7b;
    position: absolute;
    right: -6px;
    top: -6px;

    &:hover {
      color: #1e293b;
    }

    i {
      background: white;
      border-radius: 50%;
    }
  }
}

.preview-list-container {
  column-gap: 20px;
  column-count: 1;

  @media (min-width: 660px) {
    column-count: 2;
  }

  @media (min-width: 992px) {
    column-count: 3;
  }
}
</style>
