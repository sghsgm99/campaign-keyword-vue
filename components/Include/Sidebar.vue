<template>
  <div class="db-sidebar py-4 openSide" v-bind:class="thisToggle">
    <div class="mob-logo">
      <div
        class="logo-side-wrap px-4"
        v-on:click=";(closeSide = !closeSide), (openSide = openSide)"
      >
        <div class="side-toggler"></div>
        <nuxt-link to="/settings" class="account-name px-0 py-3">
          {{ $auth.$state.user.account_name }}
        </nuxt-link>
      </div>
      <b-navbar-toggle target="nav-collapse">
        <template #default="{ expanded }">
          <svg
            v-if="expanded"
            style="width: 24px; height: 24px"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
            />
          </svg>
          <svg v-else style="width: 24px; height: 24px" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M3 11H15V13H3M3 18V16H21V18M3 6H9V8H3Z"
            />
          </svg>
        </template>
      </b-navbar-toggle>
    </div>
    <b-navbar toggleable="lg" :key="$route.path" v-if="this.$auth.user">
      <b-collapse id="nav-collapse" is-nav>
        <nav class="main-menu w-100">
          <ul>
            <li v-if="checkPermission(1)">
              <nuxt-link to="/articles" class="px-4 py-3">
                <IncludeIconArticle /><span class="link">Articles</span>
              </nuxt-link>
            </li>

            <li v-if="checkPermission(2)">
              <!-- <nuxt-link to="/sites" class="px-4 py-3">
                <IncludeIconSites /><span class="link">Sites</span></nuxt-link
              > -->
              <b-button
                @click="dropdownToggle('sites')"
                :aria-expanded="toggle.sites ? 'true' : 'false'"
                aria-controls="collapse-4"
                class="rounded-0 border-0 dropdown-sidebar w-100 px-4 py-3 d-flex align-items-center justify-content-between"
              >
                <span class="d-flex align-items-center">
                  <IncludeIconSites /><span class="link">Sites</span>
                </span>
                <span class="fa fa-chevron-down sm" v-if="!toggle.sites"></span>
                <span class="fa fa-chevron-up" v-else></span>
              </b-button>
              <b-collapse
                id="collapse-2"
                v-model="toggle.sites"
                class="transparent rounded-0 main-dd-collapse"
              >
                <div class="dropdown-head" @click="dropdownToggle('sites')">
                  <span>Sites</span>
                  <span class="fa fa-chevron-down"></span>
                </div>
                <nuxt-link
                  to="/sites"
                  class="dropdown-item pl-5 pr-2 py-2"
                  v-if="checkPermission(2)"
                >
                  Site Manager
                </nuxt-link>
                <nuxt-link
                  to="/dns manager"
                  class="dropdown-item pl-5 pr-2 py-2"
                  v-if="checkPermission(18)"
                >
                  DNS Manager
                </nuxt-link>
                <nuxt-link
                  to="/serp configuration manager"
                  class="dropdown-item pl-5 pr-2 py-2"
                  v-if="checkPermission(14)"
                  :class="isSerpLinks()"
                >
                  <!-- <IncludeIconSerp /> -->
                  SERP Manager</nuxt-link
                >
                <li v-if="checkPermission(14)"></li>
              </b-collapse>
            </li>

            <li v-if="checkPermission(3)">
              <nuxt-link to="/channels" class="px-4 py-3">
                <IncludeIconChannels /><span class="link"
                  >Channels</span
                ></nuxt-link
              >
            </li>

            <li v-if="checkPermission(4)">
              <b-button
                @click="dropdownToggle('campaigns')"
                :aria-expanded="toggle.campaigns ? 'true' : 'false'"
                aria-controls="collapse-4"
                class="rounded-0 border-0 dropdown-sidebar w-100 px-4 py-3 d-flex align-items-center justify-content-between"
              >
                <span class="d-flex align-items-center">
                  <IncludeIconCampaigns /><span class="link">Campaigns</span>
                </span>
                <span
                  class="fa fa-chevron-down sm"
                  v-if="!toggle.campaigns"
                ></span>
                <span class="fa fa-chevron-up" v-else></span>
              </b-button>
              <b-collapse
                id="collapse-2"
                v-model="toggle.campaigns"
                class="transparent rounded-0 main-dd-collapse"
              >
                <div class="dropdown-head" @click="dropdownToggle('campaigns')">
                  <span>Campaigns</span>
                  <span class="fa fa-chevron-down"></span>
                </div>
                <!-- <button
                  v-b-toggle.campaign-creator
                  class="btn dropdown-item pl-5 pr-4 py-2 d-flex justify-content-between inner-dropdown"
                  style="outline: none; box-shadow: none"
                >
                  Campaign Creator
                  <span class="fa fa-chevron-down"></span>
                </button>
                <b-collapse id="campaign-creator" class="pl-3" visible>
                  <nuxt-link
                    to="/adtemplates/create"
                    class="dropdown-item pl-5 pr-2 py-2"
                  >
                    Google
                  </nuxt-link>
                  <nuxt-link
                    to="/facebook-campaigns/create"
                    class="dropdown-item pl-5 pr-2 py-2"
                  >
                    Facebook
                  </nuxt-link>
                </b-collapse>
                <nuxt-link
                  to="/campaigns"
                  class="dropdown-item pl-5 pr-2 py-2"
                  exact
                  v-if="$nuxt.$route.path === '/campaigns/create'"
                >
                  Campaign Dashboard
                </nuxt-link>
                <nuxt-link
                  to="/campaigns"
                  class="dropdown-item pl-5 pr-2 py-2"
                  v-else
                >
                  Campaign Dashboard
                </nuxt-link> -->
                <nuxt-link
                  to="/collections"
                  class="dropdown-item pl-5 pr-2 py-2"
                >
                  Campaign Collections
                </nuxt-link>
                <nuxt-link
                  to="/facebook-campaigns"
                  class="dropdown-item pl-5 pr-2 py-2"
                >
                  Facebook Campaigns
                </nuxt-link>
                <nuxt-link
                  to="/automation"
                  class="dropdown-item pl-5 pr-2 py-2"
                >
                  Facebook Automation
                </nuxt-link>
                <!--<nuxt-link
                  to="/adlibrary"
                  class="dropdown-item pl-5 pr-2 py-2"
                >
                  Ad Library
                </nuxt-link>-->
              </b-collapse>
            </li>

            <li>
              <nuxt-link
                to="/jubilee-sites-analytics"
                class="px-4 py-3"
                v-if="checkPermission(5)"
              >
                <IncludeIconAnalytics /><span class="link">Analytics</span>
              </nuxt-link>
              <!-- <b-button
                @click="dropdownToggle('analytics')"
                :aria-expanded="isAnalyticsToggle ? 'true' : 'false'"
                aria-controls="collapse-4"
                class="rounded-0 border-0 dropdown-sidebar w-100 px-4 py-3 d-flex align-items-center justify-content-between"
              >
                <span class="d-flex align-items-center">
                  <IncludeIconAnalytics /><span class="link">Analytics</span>
                </span>
                <span
                  class="fa fa-chevron-down sm"
                  v-if="!isAnalyticsToggle"
                ></span>
                <span class="fa fa-chevron-up" v-else></span>
              </b-button>
              <b-collapse
                id="collapse-2"
                v-model="isAnalyticsToggle"
                class="transparent rounded-0 main-dd-collapse"
              >
                <div class="dropdown-head" @click="dropdownToggle('analytics')">
                  <span>Analytics</span>
                  <span class="fa fa-chevron-down"></span>
                </div>
                <nuxt-link
                  to="/jubilee-sites-analytics"
                  class="dropdown-item pl-5 pr-2 py-2"
                  v-if="checkPermission(5)"
                >
                  Jubilee Sites Analytics
                </nuxt-link>
              </b-collapse> -->
            </li>

            <li>
              <b-button
                v-if="$auth.$state.user.role_label !== 'ROOT'"
                @click="dropdownToggle('reports')"
                :aria-expanded="toggle.reports ? 'true' : 'false'"
                aria-controls="collapse-4"
                class="rounded-0 border-0 dropdown-sidebar w-100 px-4 py-3 d-flex align-items-center justify-content-between"
              >
                <span class="d-flex align-items-center">
                  <IncludeIconReportRevenue /><span class="link">Reports</span>
                </span>
                <span
                  class="fa fa-chevron-down sm"
                  v-if="!toggle.reports"
                ></span>
                <span class="fa fa-chevron-up" v-else></span>
              </b-button>
              <b-collapse
                v-model="toggle.reports"
                class="transparent rounded-0 main-dd-collapse"
              >
                <div class="dropdown-head" @click="dropdownToggle('reports')">
                  <span>Reports</span>
                  <span class="fa fa-chevron-down"></span>
                </div>
                <nuxt-link
                  to="/reports"
                  class="dropdown-item pl-5 pr-2 py-2"
                  v-if="checkPermission(9)"
                >
                  Revenue Report
                </nuxt-link>
              </b-collapse>
            </li>

            <li>
              <b-button
                v-if="$auth.$state.user.role_label !== 'ROOT'"
                @click="dropdownToggle('tools')"
                :aria-expanded="toggle.tools ? 'true' : 'false'"
                aria-controls="collapse-4"
                class="rounded-0 border-0 dropdown-sidebar w-100 px-4 py-3 d-flex align-items-center justify-content-between"
              >
                <span class="d-flex align-items-center">
                  <IncludeIconTools /><span class="link">Tools</span>
                </span>
                <span class="fa fa-chevron-down sm" v-if="!toggle.tools"></span>
                <span class="fa fa-chevron-up" v-else></span>
              </b-button>
              <b-collapse
                id="collapse-2"
                v-model="toggle.tools"
                class="transparent rounded-0 main-dd-collapse"
              >
                <div class="dropdown-head" @click="dropdownToggle('tools')">
                  <span>Tools</span>
                  <span class="fa fa-chevron-down"></span>
                </div>
                <nuxt-link
                  to="/adtemplates"
                  class="dropdown-item pl-5 pr-2 py-2"
                  v-if="checkPermission(5)"
                >
                  Keyword Planner
                </nuxt-link>
                <nuxt-link
                  to="/adpartners"
                  class="dropdown-item pl-5 pr-2 py-2"
                >
                  Ad Partner Settings
                </nuxt-link>
                <nuxt-link
                  to="/adbuilders"
                  class="dropdown-item pl-5 pr-2 py-2"
                  v-if="checkPermission(1)"
                >
                  Experience Builder
                </nuxt-link>
                <nuxt-link
                  to="/facebook%20targeting%20tool"
                  class="dropdown-item pl-5 pr-2 py-2"
                  v-if="checkPermission(1)"
                >
                  Facebook Interest Tool
                </nuxt-link>
                <nuxt-link
                  to="/campaigns/facebookaudience"
                  class="dropdown-item pl-5 pr-2 py-2"
                  v-if="checkPermission(1)"
                >
                  Facebook Audience
                </nuxt-link>
              </b-collapse>
            </li>

            <li
              v-if="
                checkPermission(6) && $auth.$state.user.role_label !== 'ROOT'
              "
            >
              <nuxt-link to="/users" class="px-4 py-3">
                <IncludeIconUsers /><span class="link">Users</span></nuxt-link
              >
            </li>

            <li v-if="checkPermission(7)">
              <nuxt-link to="/settings" class="px-4 py-3">
                <IncludeIconSettings /><span class="link"
                  >Settings</span
                ></nuxt-link
              >
            </li>

            <li v-if="checkPermission(24)">
              <nuxt-link to="/accounts" class="px-4 py-3">
                <IncludeIconAdmin /><span class="link"
                  >Accounts</span
                ></nuxt-link
              >
            </li>

            <li v-if="$auth.$state.user.role_label === 'ROOT'">
              <nuxt-link to="/admin-users" class="px-4 py-3">
                <IncludeIconUsers /><span class="link">Users</span></nuxt-link
              >
            </li>

            <li>
              <a href="" @click.prevent="doLogout" class="px-4 py-3">
                <IncludeIconLogout /><span class="link">Log-out</span></a
              >
            </li>
          </ul>
        </nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
<script>
import pagePermissions from '~/mixins/pagePermissions'
export default {
  data() {
    return {
      closeSide: false,
      toggle: {
        campaigns: false,
        analytics: false,
        reports: false,
        sites: false,
        tools: false
      }
    }
  },
  methods: {
    doLogout() {
      this.$auth.logout()
    },

    dropdownToggle(toggle) {
      for (let key of Object.keys(this.toggle)) {
        if (toggle === key) {
          this.toggle[key] = !this.toggle[key]
        } else {
          this.toggle[key] = false
        }
      }
    },

    isSerpLinks() {
      if (
        $nuxt.$route.path.includes('/blacklist') ||
        $nuxt.$route.path.includes('/rulesets')
      ) {
        return 'nuxt-link-active'
      } else {
        return ''
      }
    }
  },
  mixins: [pagePermissions],
  computed: {
    thisToggle: function () {
      return {
        closeSide: this.closeSide
      }
    },
    darkMode() {
      return this.$store.state.isDarkActive
    }
  }
}
</script>
