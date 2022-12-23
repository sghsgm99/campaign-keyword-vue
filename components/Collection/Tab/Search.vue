<template>
  <div class="my-2">
    <b-alert :show="showToast" dismissible fade v-if="toast.message">
      <div class="d-flex justify-content-between">
        <span>{{ toast.message }}</span>
      </div>
    </b-alert>

    <div class="form-container p-md-4 p-3">
      <form @submit.prevent="doFormAction">
        <div>
          <div class="row d-flex align-items-center justify-content-between">
            <div class="col-md-6">
              <label class="form-label">Through Text</label>
              <b-input-group class="mt-0">
                <input
                  type="text"
                  class="col-md-8 form-control"
                  placeholder="Words or phrase to search through creative text"
                  v-model.trim="$v.form.through_txt.$model"
                  :class="{ 'form-group--error': $v.form.through_txt.$error }"
                  autocomplete="false"
                />
                <b-form-select
                  class="col-md-4 form-control"
                  v-model="form.sel_through"
                  :options="throguhOptionEnum"
                  text-field="label"
                  value-field="value"
                />
              </b-input-group>
              <div v-if="$v.form.through_txt.$dirty">
                <small class="text-error" v-if="!$v.form.through_txt.required"
                  >Collection Name is required</small
                >
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">In Link</label>
              <input
                type="text"
                class="form-control"
                v-model="form.in_link"
                placeholder="Word/domain in creative's link"
              />
            </div>
          </div>
        </div>

        <div>
          <div class="row d-flex align-items-center justify-content-between">
            <div class="col-md-3">
              <label class="form-label">GEO</label>
              <VueCountryCode
                :style="{ margin: '10px 0' }"
                class="status form-input"
                :dropdownOptions="dropdownOptions"
                :defaultCountry="'US'"
                @onSelect="onSelect"
              />
            </div>
            <div class="col-md-3">
              <label class="form-label">GEOS TO</label>
              <input
                type="text"
                class="form-control"
                v-model="form.geo_to"
                autocomplete="false"
              />
              <div v-if="$v.form.geo_to.$dirty">
                <small class="text-error" v-if="!$v.form.geo_to.numeric"
                  >Invalid Numeric format</small
                >
              </div>
            </div>
            <div class="col-md-3">
              <label class="form-label">On Ip</label>
              <input
                type="text"
                class="form-control"
                v-model="form.on_ip"
                autocomplete="false"
              />
              <div v-if="$v.form.on_ip.$dirty">
                <small class="text-error" v-if="!$v.form.on_ip.ipAddress"
                  >Invalid Ip Address format</small
                >
              </div>
            </div>
            <div class="col-md-3">
              <label class="form-label">Page ID</label>
              <input
                type="text"
                class="form-control"
                placeholder="FB page id or link"
                v-model="form.page_id"
                autocomplete="false"
              />
            </div>
          </div>
        </div>

        <b-row class="justify-content-end mt-3">
          <b-col cols="6" sm="8" md="9">
            <input
              type="submit"
              class="btn btn-primary primary-btn"
              value="Search"
              :disabled="btnDisabled"
            />
          </b-col>
          <b-col cols="6" sm="4" md="3">
            <b-button class="btn btn-green primary-btn w-100" @click="clearForm"
              >Clear Search</b-button
            >
          </b-col>
        </b-row>
      </form>
    </div>
    <IncludePaginationEx
      :params="params"
      ref="operations"
      :pagination="pagination"
      @doUpdatePagination="doUpdatePagination"
    />
    <hr />
    <div class="collection-container pt-3">
      <IncludeFormsCollectionsItem
        v-for="(citem, index) in citems"
        :key="index"
        :citem="citem"
        @doSelected="doSelected"
      />
    </div>
  </div>
</template>

<script>
import VueCountryCode from 'vue-country-code-select'
import Collections from '~/models/Collections'
import enums from '~/mixins/enums'
import error from '~/mixins/error'
import { required, numeric, ipAddress } from 'vuelidate/lib/validators'

export default {
  layout: 'form',
  data() {
    return {
      dropdownOptions: {
        disabledDialCode: true
      },
      form: {
        through_txt: '',
        sel_through: 'Exact',
        in_link: '',
        sel_geo: null,
        geo_to: '',
        on_ip: '',
        page_id: ''
      },
      params: '',
      citems: [],
      pagination: {
        currentPage: 1,
        totalRows: 0,
        perPage: 40,
        items: 1,
        selected: 0
      },
      toast: {
        message: null
      },
      showToast: false
    }
  },
  components: {
    VueCountryCode
  },
  head: {
    bodyAttrs: {
      id: 'form'
    }
  },
  mixins: [enums, error],
  validations: {
    form: {
      through_txt: {
        required
      },
      on_ip: {
        ipAddress
      },
      geo_to: {
        numeric
      }
    }
  },
  methods: {
    cleanPayload() {
      let data = this.form

      return data
    },

    clearForm() {
      this.form.through_txt = ''
      this.form.sel_through = 'Exact'
      this.form.in_link = ''
      this.form.sel_geo = null
      this.form.geo_to = ''
      this.form.on_ip = ''
      this.form.page_id = ''
    },

    setPagination(data) {
      this.pagination.currentPage = data.meta.current_page
      this.pagination.totalRows = data.meta.total
      this.pagination.perPage = data.meta.per_page
      this.pagination.items = data.data.length
    },

    async doSelected(isAdd) {
      if (!isAdd) this.pagination.selected++
      else this.pagination.selected--
    },

    async doUpdatePagination(data) {
      this.pagination = data
      this.doFormPost()
    },

    doFormAction() {
      this.pagination.selected = 0
      return this.doFormPost()
    },

    async doFormPost() {
      this.toggleBtnDisabled()
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.toggleBtnDisabled()
      } else {
        this.citems = []
        let payload = await this.cleanPayload()

        Collections.create({
          data: payload
        }).then((_) => {
          Collections.setPerPage(this.pagination.perPage)
            .setPage(this.pagination.currentPage)
            .searchCreative(payload)
            .then((res) => {
              this.citems = res.response.data.data
              this.citems = this.citems
                .filter((item) => {
                  return item.images.length > 0
                })
                .map((item) => {
                  if (item.images.length > 0) {
                    item.images = item.images.map((image) => {
                      let data = {
                        id: null,
                        src: image
                      }

                      return data
                    })
                  }

                  return item
                })
              this.setPagination(res.response.data)
              this.scrollToTop()
              this.toggleBtnDisabled()
            })
            .catch((e) => {
              this.showError(e.response)
            })
        })
      }
    },

    onSelect({ name, iso2, dialCode }) {
      this.form.sel_geo = iso2
    }
  }
}
</script>

<style lang="scss" scoped>
#db-forms form .input-group {
  max-width: 100%;
  border: none;
}

#db-forms form .input-group input {
  border: 1px solid #cdd2dc;
  margin: 10px 0;
}

#db-forms form input[type='submit'] {
  max-width: 100%;
  margin: 0;
  color: #fff;
}

.collection-container {
  column-gap: 20px;
  column-count: 1;

  @media (min-width: 660px) {
    column-count: 2;
  }

  @media (min-width: 992px) {
    column-count: 3;
  }

  @media (min-width: 1200px) {
    column-count: 4;
  }
}
</style>
