<template>
  <div class="db-content vh-200">
    <div
      class="breadcrumbs p-md-4 p-3 justify-content-between d-flex flex-wrap align-items-center"
    >
      <h1 class="m-0 p-0">{{ pageName }}</h1>
      <div class="data-head d-flex align-items-center">
        <IncludeOperations
          :slug="slug"
          ref="operations"
          :showActions="false"
          class="col-md-12 justify-content-end"
        />
      </div>
    </div>
    
    <div class="data-content data-content-tabs ps-4 pe-4 pb-4">
      <b-card no-body>
        <b-tabs card pills>
          <b-tab title="Collections">
            <b-card-text>
              <CollectionMain />
            </b-card-text>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'Main',
  data() {
    return {
      pageName: 'Campaign Collections',
      slug: 'collections'
    }
  }
}
</script>
