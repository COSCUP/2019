<template>
  <section class="sponsors">
    <Card class="level container" v-for="lv in sponsorsByLevel" :key="lv.title">
      <h1>{{ lv.title }}</h1>
      <div class="sponsors">
        <a v-for="sponsor in lv.sponsors"
          :key="sponsor.name"
          :href="sponsor.link"
          :title="sponsor.name"
          class="sponsor"
          target="_blank"
          >
          <RatioBox ratio="1:1" style="text-align: center;">
            <img :src="sponsor.image" />
          </RatioBox>
          {{ sponsor.name }}
        </a>
      </div>
    </Card>
  </section>
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
import RatioBox from '~/components/RatioBox.vue'

const SponsorsGetter = namespace(sponsorsStoreName, Getter)

@Component({
  components: {
    Card,
    RatioBox,
  },
})
export default class extends Vue {
  @SponsorsGetter('byLevel')
  sponsorsByLevel: SponsorsByLevel
}
</script>

<style scoped>
section.sponsors {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2em;
}

section.sponsors div.sponsors {
  display: flex;
  flex-wrap: wrap;
}

.sponsors .sponsor {
  flex-basis: 20%;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: .5em;
}

.sponsors .sponsor img {
  max-height: 100%;
  max-width: 100%;
}

.sponsors .sponsor:hover img {
  filter: opacity(.6);
}
</style>
