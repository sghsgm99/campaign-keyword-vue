<template>
  <article class="item">
    <div class="content" :class="{ loved: !isAdd }">
      <div v-if="loading" class="loading">
        <b-spinner label="Loading..."></b-spinner>
      </div>
      <div class="top d-flex flex-wrap align-items-center">
        <a
          class="url-link"
          :href="citem.url"
          target="_blank"
          :disabled="citem.url == ''"
        >
          <i class="fas fa-globe"></i>
          <span class="url">{{ citem.url }}</span>
          <i class="fas fa-external-link-alt"></i>
        </a>

        <div v-if="citem.images.length < 2">
          <b-button
            @click="addCreativeAction()"
            v-if="isAdd"
            class="heart"
            v-b-tooltip.hover
            title="Add to Collection"
          >
            <IncludeIconHeart />
          </b-button>
          <span v-else class="heart loved">
            <IncludeIconHeart />
          </span>
        </div>
        <div class="geo mt-10px" v-if="geoList.length > 0">
          <span class="mr-2">Geo</span>
          <div
            v-for="(code, index) in geoList"
            :key="index"
            class="iti-flag ml-1"
            :class="code"
          />
        </div>
      </div>

      <div class="main">
        <b-carousel
          :interval="0"
          :controls="citem.images.length > 1"
          :indicators="citem.images.length > 1"
          background="#ababab"
          img-width="1024"
          img-height="480"
          class="mb-12px"
        >
          <b-carousel-slide
            v-for="(img, i) in citem.images"
            :key="i"
            :img-src="img.src"
          >
            <b-button
              v-if="citem.images.length > 1 && !imagesList[i].selected"
              @click="handleCarouselImageFave(i)"
              class="carousel-fav"
              v-b-tooltip.hover
              title="Add to Collection"
            >
              <i
                class="far fa-check-circle"
                :class="{
                  fas: imagesList[i].selected,
                  far: !imagesList[i].selected
                }"
              ></i>
            </b-button>
            <span v-else-if="citem.images.length > 1" class="carousel-fav">
              <!--b-badge pill>Added</b-badge-->
              <i
                class="far fa-check-circle"
                :class="{
                  fas: imagesList[i].selected,
                  far: !imagesList[i].selected
                }"
              ></i>
            </span>
          </b-carousel-slide>
        </b-carousel>
        <h5 class="headline">{{ citem.headline }}</h5>
        <div class="description">
          {{ citem.description }}
        </div>

        <div class="title" v-if="citem.title">
          {{ citem.title }}
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import Collections from '~/models/Collections'

export default {
  props: {
    citem: {
      type: Object
    }
  },
  data() {
    return {
      isAdd: true,
      cid: null,
      imagesList: this.citem.images.map((img) => {
        return { ...img, selected: false }
      }),
      loading: false
    }
  },
  computed: {
    geoList() {
      let geos = []
      this.citem['geo'].forEach((v) => {
        geos.push(v.toLowerCase())
      })

      return geos
    }
  },
  methods: {
    proCreative(force = false, isAdd = true) {
      this.isAdd = false
      if (force) {
        if (isAdd) {
          this.$emit('doSelected', false)
        } else {
          this.$emit('doSelected', true)
        }
      } else {
        this.$emit('doSelected', this.isAdd)
      }
    },

    async addCreativeAction() {
      this.loading = true
      let payload = await this.setPayload(this.citem)
      await Collections.addCreative(payload)
        .then((res) => {
          this.loading = false
          this.cid = res.response.data.data.id
          this.proCreative()
        })
        .catch((err) => {
          this.isBusy = false
        })
    },

    async removeCreativeAction(id = null) {
      let payloadId = id ? id : this.cid
      await Collections.removeCreative(payloadId)
        .then((res) => {
          this.proCreative(true, false)
        })
        .catch((err) => {
          this.isBusy = false
        })
    },

    async handleCarouselImageFave(index) {
      this.loading = true
      if (this.imagesList[index].selected) {
        await this.removeCreativeAction(this.imagesList[index].id, true)
      } else {
        let payload = await this.setPayload(this.citem, index)
        await Collections.addCreative(payload)
          .then((res) => {
            this.loading = false
            this.imagesList[index].id = res.response.data.data.id

            this.proCreative(true, true)
          })
          .catch((err) => {
            this.isBusy = false
          })
      }
      this.imagesList[index].selected = !this.imagesList[index].selected
    },

    async setPayload(item, index = null) {
      let data = JSON.parse(JSON.stringify(item))

      data['images'] = []
      if (index) {
        data['images'].push(item.images[index].src)
      } else {
        if (item.images.length > 0) {
          data['images'].push(item.images[0].src)
        }
      }

      return data
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  display: grid;
  grid-template-rows: 1fr auto;
  break-inside: avoid;

  > div {
    grid-row: 1 / -1;
    grid-column: 1;
  }
}

.content {
  position: relative;
  background-color: white;
  border: 1px solid #bfbfbf;
  border-radius: 5px;
  margin-bottom: 20px;
  overflow: hidden;

  &.loved {
    border-color: #f82670 !important;
  }
}

.loading {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(238, 238, 238, 0.7);
  z-index: 11;

  > span {
    position: absolute;
    left: calc(50% - 1rem);
    top: calc(50% - 1rem);
    width: 2rem;
    height: 2rem;
  }
}

.top {
  padding: 13px;
  border-bottom: 1px solid #dfdfdf;

  .url-link {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    background-color: #e3e3e3;
    padding: 8px 10px 8px 8px;
    margin-right: 5px;
    border-radius: 50px;
    color: #626262;
    overflow: hidden;
    max-width: 100%;

    &[disabled] {
      pointer-events: none;
      cursor: default;
    }
  }

  .fa-globe {
    font-size: 16px;
    margin-right: 8px;
  }

  .fa-external-link-alt {
    font-size: 15px;
    margin-left: 5px;
  }

  .url {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    flex: 1;
    color: #3883cf;
  }

  .heart {
    width: 30px;
    padding: 0;
    background-color: transparent;
    border: 0 none;
    color: #f82670;

    &:focus,
    &:active {
      border: 0 none;
      outline: none;
      background: transparent;
      color: #f82670;
      box-shadow: none !important;
    }

    &.loved svg {
      fill: #f82670;
    }
  }

  .geo {
    width: 100%;
    font-size: 12px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
  }
}

.main {
  padding: 13px;

  .headline {
    font-size: 16px;
  }

  .description,
  .title {
    font-size: 13px;
  }

  .title {
    font-size: 13px;
    border-top: 1px solid #dfdfdf;
    padding-top: 12px;
    margin-top: 12px;
  }

  .carousel-fav,
  .carousel-fav:focus,
  .carousel-fav:active {
    position: absolute;
    top: 0;
    left: 0;
    color: #f82670;
    font-size: 18px;
    background: transparent;
    border: 0;
    box-shadow: none !important;
    position: absolute;
    width: 100%;
    height: 100%;

    i {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: #fff;
      border-radius: 50%;
    }

    .badge {
      top: 10px;
      position: relative;
      left: 10px;
      background-color: #f82670;
      color: #fff;
      font-size: 12px;
      padding: 3px 10px;
    }
  }
}

.darktheme {
  .content {
    background-color: #333644;
    box-shadow: 0 0 6px 1px rgba(119, 119, 119, 0.3);
    color: #aab8c5;
    border-color: #323544;
  }

  .top,
  .main .title {
    border-color: rgba(170, 184, 197, 0.5);
  }

  .top .url-link {
    background-color: #404354;
    color: #8e8e8e;
  }
}
</style>

<style lang="scss">
.carousel-control-prev,
.carousel-control-next {
  top: auto;
  background: transparent;
  height: 40px;
}
.carousel-indicators {
  margin: 0;
  background: rgba(0, 0, 0, 0.4);
  padding: 10px 50px;
}
</style>
