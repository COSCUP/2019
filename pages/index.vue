<template>
  <main class="index">
    <Card class="topic">
      <div class="background" ref="sightContainer">
        <Sight :width="sightWidth" :height="sightHeight"
          :spot="{ x: sightWidth / 2.0, y: sightHeight / 2.0 }" />
      </div>
      <div class="foreground">
        <h1>
          COSCUP 2018<br />
          <span class="the-x">x<br /></span>
          <span class="co-title">openSUSE.Asia&nbsp;&nbsp;GNOME.Asia</span>
        </h1>
        <h2>{{ description }}</h2>
        {{ place }}
      </div>
    </Card>
    <Card class="register container">
      <h1>{{ $t('register') }}</h1>
      <h3>
        <span>{{ registration.start_at | moment }}</span> ~
        <span>{{ registration.end_at | moment }}</span>
      </h3>
      <article>
        <p v-for="(paragraph, idx) in getParagraphs($t('about.welcome'))" :key="idx">
          {{ paragraph }}
        </p>
      </article>
      <div class="register-now">
        <a :href="registration.link" target="_blank">{{ $t('about.register_now') }}</a>
      </div>
    </Card>
    <Card class="about container">
      <article>
        <p v-for="(paragraph, idx) in getParagraphs(aboutArticle)" :key=idx>
          {{ paragraph }}
        </p>
      </article>
    </Card>
    <SponsorFooter />
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
  namespace,
} from 'vuex-class'
import moment from 'moment'

import {
  name as mainStoreName
} from '~/store/main'
import {
  name as aboutStoreName,
} from '~/store/about'

import Card from '~/components/Card.vue'
import SponsorFooter from '~/components/SponsorFooter.vue'
import Sight from '~/components/Sight.vue'

const MainState = namespace(mainStoreName, State)
const AboutState = namespace(aboutStoreName, State)

@Component({
  components: {
    Card,
    SponsorFooter,
    Sight,
  },
  filters: {
    moment(val) {
      return moment(val).format('ll LT')
    }
  }
})
export default class extends Vue {
  @MainState description
  @MainState registration
  @MainState place
  @AboutState('article') aboutArticle

  sightWidth: Number = 0
  sightHeight: Number = 0

  mounted() {
    this.$store.dispatch('clientsFirstFetch', this.$options['fetch'])

    this.$nextTick(() => {
      this.measureSightSize()
    })
    window.addEventListener('resize', this.measureSightSize)
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.measureSightSize)
  }

  async fetch({ store: { dispatch } }) {
    await dispatch(`${aboutStoreName}/fetchData`)
  }

  measureSightSize() {
    const sightContainer: any = this.$refs.sightContainer

    this.sightWidth = sightContainer.clientWidth
    this.sightHeight = sightContainer.clientHeight
  }

  getParagraphs(article) {
    return article.trim().split(/\r\n?|\n\r?/g)
  }
}
</script>

<style scoped>
:root {
  --accent: rgb(59, 156, 96);
}

main.index {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.topic {
  width: 100%;
  padding: 4em 2em !important;
  min-height: 80vh;
  height: 100%;
  max-height: 80vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.topic .background {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #fff;
}

.topic .foreground {
  z-index: 1;
  width: 100%;

  text-align: center;
}

.topic h1 {
  color: var(--accent);
  font-size: 2.4em;
  line-height: 1.2em;
  padding-bottom: .4em;

  text-align: center;
}

.topic .the-x {
  display: none;
}

.topic .co-title {
  word-wrap: break-word;
}

.topic h2 {
  font-size: 1.4em;
  text-align: center;
}

.register article,
.about article {
  margin-bottom: -1em;
}

.register article p,
.about article p {
  margin-bottom: 1em;

  text-indent: 2.5em;
}

.register .register-now {
  text-align: center;
  padding-top: 1em;
}

.register .register-now a {
  margin: 0 auto;
  padding: .6em 1.5em .7em;
  display: inline-block;

  background-color: var(--accent);
  color: #fff;
  line-height: 1em;

  transition: box-shadow .3s cubic-bezier(0.4, 0.0, 0.2, 1),
    margin-top .3s cubic-bezier(0.4, 0.0, 0.2, 1),
    font-size .3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.register .register-now a:hover,
.register .register-now a:focus {
  box-shadow: 0px .2em 12px rgba(0, 0, 0, 0.1);
  margin-top: -.2em;
  font-size: 1.1em;
}

@media(min-width: 840px) {
  .topic {
    font-size: 1.2em;
  }

  .topic .the-x {
    display: block;
  }

  .topic .co-title {
    padding-right: 1.5em;
  }
}
</style>
