<template>
  <div class="db-content vh-200 p-0">
    <div class="breadcrumbs p-4">
      <h1 class="m-0 p-0">{{ pageName }}</h1>
    </div>
    <b-alert :show="showToast" dismissible fade v-if="success.message">
      <div class="d-flex justify-content-between">
        <span>{{ success.message }}</span>
      </div>
    </b-alert>
    <IncludeFormsKeywordPlannerCreate/>
  </div>
</template>

<script>
export default {
  async mounted() {},
  layout: 'Main',
  data() {
    return {
      pageName: 'Create Campaign',
      showToast: false,
      success: { message: null }
    }
  },
  methods: {
  }
}
</script>
