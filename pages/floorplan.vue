<template>
  <main class="floorplan">
    <div v-for="(image_path, floor) in area.images" :key="floor">
      <Card>
        <img :src="image_path" />
      </Card>
    </div>
    <SponsorFooter />
  </main>
</template>

<script lang="ts">
// packages
import { Component, Vue } from 'nuxt-property-decorator'
import { State, namespace } from 'vuex-class'

// stores
import { name as mainStoreName } from '~/store/main'

// components
import Card from '~/components/Card.vue'
import SponsorFooter from '~/components/SponsorFooter.vue'

const MainState = namespace(mainStoreName, State)

@Component({
  components: {
    Card,
    SponsorFooter
  }
})
class floorplan extends Vue {
  @MainState area

  mounted() {
    // this.$store.dispatch('clientsFirstFetch', this.$options.fetch)
  }

  get title() {
    return `${this.$t('pages.floorplan')} | COSCUP 2019 | Conference for Open Source Coders, Users, and Promoters`
  }

  head() {
    return {
      title: this.title,
      meta: [
        { hid: `og:description`, property: 'og:description', content: this.title },
        { hid: `og:title`, property: 'og:title', content: this.title },
        { hid: `og:type`, property: 'og:type', content: 'article' },
        { hid: `og:url`, property: 'og:url', content: `https://coscup.org/2019${this.$route.path}`},
      ],
    }
  }

  async fetch({ store: { _ } }) {
    // await dispatch(`${transportationStoreName}/fetchData`)
  }
}

export default floorplan
</script>

<style scoped>
main.floorplan {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

img {
  display: block;
  margin: auto;
  max-width: 100%;
}
@media (min-width: 840px) {
}
</style>
