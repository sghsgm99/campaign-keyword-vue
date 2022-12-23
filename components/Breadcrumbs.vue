<template>
  <div class="breadcrumbs-links">
    <div v-for="(link, i) in links" :key="link.name">
      <nuxt-link v-if="link.to" :to="link.to">{{ link.name }}</nuxt-link>
      <span v-else>{{ link.name }}</span>
      <i v-if="i != links.length - 1" class="fas fa-chevron-right"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    links: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.breadcrumbs-links {
  background-color: white;
  display: flex;
  align-items: center;
  font-size: 12px;
  width: 100%;
  margin: 0;

  > div {
    margin-right: 6px;
  }

  * {
    color: #7b7b7b;
  }

  a {
    color: #4e4e4e;

    &:hover {
      color: #1e293b;
    }
  }

  i {
    font-size: 10px;
    margin-left: 3px;
  }
}

.darktheme .breadcrumbs-links {
  background-color: #312e3b;

  * {
    color: #aab8c5;
  }

  a {
    color: #ffffff;

    &:hover {
      color: #ffffff;
    }
  }
}
</style>
