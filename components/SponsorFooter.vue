<template>
  <section class="sponsors container">
    <Card v-for="lv in sponsorsByLevel" :key="lv.title" class="level">
      <h1>{{ lv.title }}</h1>
      <div class="sponsors">
        <a
          v-for="sponsor in lv.sponsors"
          :key="sponsor.name"
          :href="sponsor.link"
          :title="sponsor.name"
          class="sponsor"
          target="_blank"
        >
          <RatioBox ratio="1:1">
            <img :src="sponsor.image" alt="" />
          </RatioBox>
          {{ sponsor.name }}
        </a>
      </div>
    </Card>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Getter, namespace } from 'vuex-class'

import { name as sponsorsStoreName, SponsorsByLevel } from '~/store/sponsors'

import Card from '~/components/Card.vue'
import RatioBox from '~/components/RatioBox.vue'

const SponsorsGetter = namespace(sponsorsStoreName, Getter)

@Component({
  components: {
    Card,
    RatioBox
  }
})
class SponsorFooter extends Vue {
  @SponsorsGetter('byLevel')
  sponsorsByLevel: SponsorsByLevel
}

export default SponsorFooter
</script>

<style scoped>
section.sponsors {
  display: grid;
  padding-top: 2em;

  grid-template-columns: 1fr;
  grid-gap: 2em;
  font-size: 0.8em;
}

.sponsors .level {
  width: 100%;
  grid-column: 1 / span 2;

  margin: 0;
}

section.sponsors div.sponsors {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.sponsors .sponsor {
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 0.5em;
}

.sponsors .sponsor img {
  max-height: 100%;
  max-width: 100%;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.sponsors .sponsor:hover img {
  filter: opacity(0.6);
}

@media (min-width: 840px) {
  section.sponsors {
    grid-template-columns: 1fr 1fr;
    font-size: 1em;
  }

  section.sponsors div.sponsors {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }

  .sponsors .level:nth-child(1),
  .sponsors .level:nth-child(2) {
    grid-column: initial;
  }

  .sponsors .level:nth-child(1) .sponsors,
  .sponsors .level:nth-child(2) .sponsors {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
