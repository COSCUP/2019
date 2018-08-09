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
import {
  Component,
  Vue,
} from 'nuxt-property-decorator'
import {
  Action,
  State,
  namespace,
} from 'vuex-class'

// stores
import {
  name as mainStoreName
} from '~/store/main'

// components
import Card from '~/components/Card.vue'
import SponsorFooter from '~/components/SponsorFooter.vue'
import ExternalLink from '~/components/ExternalLink.vue'

const MainState = namespace(mainStoreName, State)

@Component({
  components: {
    Card,
    SponsorFooter,
  },
})
export default class extends Vue {
  @MainState area

  mounted() {
    this.$store.dispatch('clientsFirstFetch', this.$options['fetch'])
  }

  async fetch({ store: { dispatch } }) {
    //await dispatch(`${transportationStoreName}/fetchData`)
  }

}
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
@media(min-width: 840px) {
}
</style>
