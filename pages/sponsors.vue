<template>
  <main class="sponsors">
    <Card class="container">
    <h1>{{ $t('sponsorship.call_for_sponsorship') }}</h1>
    {{ $t('sponsorship.contact') }} <a :href="'mailto:' + sponsorship.contact.email">{{ sponsorship.contact.email }}</a>
    </Card>
    <Card class="level container" v-for="lv in sponsorsByLevel" :key="lv.title">
      <h1>{{ lv.title }}</h1>
      <div class="sponsors">
        <div v-for="sponsor in lv.sponsors"
          :key="sponsor.name"
          class="sponsor"
          >
          <a class="logo" :href="sponsor.link" :title="sponsor.name" target="_blank">
            <RatioBox ratio="1:1" style="text-align: center;">
              <img :src="sponsor.image" alt="" />
            </RatioBox>
          </a>
          <div class="description">
            <h1><a :href="sponsor.link" :title="sponsor.name" target="_blank">{{ sponsor.name }}</a></h1>
            <article>
              <p v-for="(paragraph, idx) in getParagraphs(sponsor.intro)" :key="idx">
                {{ paragraph }}
              </p>
            </article>
          </div>
        </div>
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
  State,
  Getter,
  namespace,
} from 'vuex-class'

import {
  name as mainStoreName
} from '~/store/main'

import {
  name as sponsorsStoreName,
  SponsorsByLevel,
} from '~/store/sponsors'

import Card from '~/components/Card.vue'
import RatioBox from '~/components/RatioBox.vue'

const MainState = namespace(mainStoreName, State)
const SponsorsGetter = namespace(sponsorsStoreName, Getter)

@Component({
  components: {
    Card,
    RatioBox,
  },
})
export default class extends Vue {
  @MainState sponsorship
  @SponsorsGetter('byLevel')
  sponsorsByLevel: SponsorsByLevel

  mounted() {
    this.$store.dispatch('clientsFirstFetch', this.$options['fetch'])
  }

  async fetch({ store: { dispatch } }) {
    await dispatch(`${sponsorsStoreName}/fetchData`)
  }

  getParagraphs(article) {
    return article.split(/\r\n?|\n\r?/g)
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

main.sponsors div.sponsors {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
}

.sponsors .sponsor {
  display: flex;
  flex-direction: column;

  padding: 0;
  margin: .5em 0;
}

.sponsors .sponsor .description {
  flex-basis: 80%;
  padding: 0;
}

.sponsors .sponsor .description h1 {
  font-size: 1.2em;
}

.sponsors .sponsor .logo {
  flex-basis: 20%;
}

.sponsors .sponsor .logo img {
  max-height: 100%;
  max-width: 100%;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

@media(min-width: 840px) {
  .sponsors .sponsor {
    flex-direction: row;

    padding: 1em;

    transition: box-shadow .3s cubic-bezier(0.4, 0.0, 0.2, 1),
      transform .3s cubic-bezier(0.4, 0.0, 0.2, 1);
  }

  .sponsors .sponsor:hover {
    box-shadow: 0px 2px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .sponsors .sponsor .description {
    padding: 0 1em;
  }
}
</style>
