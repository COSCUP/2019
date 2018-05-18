<template>
  <main class="sponsors">
    <Card class="level container" v-for="lv in sponsorsByLevel" :key="lv.title">
      <h1>{{ lv.title }}</h1>
      <h4>{{ $t('sponsors.sortBy') }}</h4>
      <div class="sponsors">
        <Sponsor v-for="spnsr in lv.sponsors" :key="spnsr.name" :sponsor="spnsr" />
      </div>
    </Card>
  </main>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from 'nuxt-property-decorator'
import {
  Action,
  Getter,
  namespace,
} from 'vuex-class'

import {
  name as sponsorsStoreName,
  SponsorsByLevel,
} from '~/store/sponsors'

import Card from '~/components/Card.vue'
import Sponsor from '~/components/Sponsor.vue'

const SponsorsGetter = namespace(sponsorsStoreName, Getter)

@Component({
  components: {
    Card,
    Sponsor,
  },
})
export default class extends Vue {
  @SponsorsGetter('byLevel')
  sponsorsByLevel: SponsorsByLevel

  async fetch({ store: { dispatch } }) {
    await dispatch(`${sponsorsStoreName}/fetchData`)
  }
}
</script>

<style scoped>
main.sponsors {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2em;
}

div.sponsors {
  display: flex;
  flex-wrap: wrap;
}
</style>
