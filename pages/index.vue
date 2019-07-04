<template>
  <main class="index">
    <Card class="topic">
      <div class="background">
      </div>
      <div class="foreground container">
        <div class="logo-box">
          <RatioBox ratio="920:848" />
        </div>
        <div class="main-box">
          <h1>
            COSCUP 2019
          </h1>
          <h2>{{ description }}</h2>
          {{ place }}
		  <a class="call-for-volunteers" href="https://coscup2019.kktix.cc/events/individual-sponsor-19" target="_blank">{{ $t('individual_sponsor') }}</a>
		  <a class="call-for-volunteers" href="https://coscup2019.kktix.cc/events/coscup2019regist" target="_blank">{{ $t('register') }}</a>
        </div>
      </div>
    </Card>
    <Card class="register container">
      <h1>{{ $t('register') }}</h1>
      <h3>{{ `${registration.start_at} ~ ${registration.end_at}` }}</h3>
      <div class="register-now">
        <a :href="registration.link" target="_blank">{{ $t('about.register_now') }}</a>
      </div>
    </Card>
    <Card class="about container">
      <h1>{{ $t('pages.about') }}</h1>
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
import RatioBox from '~/components/RatioBox.vue'
import SponsorFooter from '~/components/SponsorFooter.vue'

const MainState = namespace(mainStoreName, State)
const AboutState = namespace(aboutStoreName, State)

@Component({
  components: {
    Card,
    RatioBox,
    SponsorFooter,
  },
  filters: {
    moment(val) {
      return moment(val).format('ll LT')
    }
  }
})
class Home extends Vue {
  @MainState description
  @MainState registration
  @MainState place
  @AboutState('article') aboutArticle

  mounted() {
    this.$store.dispatch('clientsFirstFetch', this.$options['fetch'])
  }

  async fetch({ store: { dispatch } }) {
    await dispatch(`${aboutStoreName}/fetchData`)
  }

  getParagraphs(article) {
    return article.trim().split(/\r\n?|\n\r?/g)
  }
}

export default Home
</script>

<style scoped>
:root {
  --accent: rgb(59, 156, 96);
  --hover-accent: rgba(59, 156, 96, 0.4);
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
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  text-align: center;
}

.topic .logo-box {
  background-image: url(~assets/logo.png);
  background-repeat: no-repeat;
  background-size: contain;
}

.topic .main-box {
  display: flex;
  flex-direction: column;
  justify-content: center;

  text-align: right;
}

.topic h1 {
  color: var(--accent);
  font-size: 2.4em;
  line-height: 1.2em;
  padding-bottom: .4em;
}

.topic h2 {
  font-size: 1.4em;
}

.call-for-volunteers {
  margin: .3em 0 0 auto;
  padding: .6em 1.5em .7em;
  display: inline-block;

  background-color: var(--accent);
  color: #fff;
  line-height: 1em;

  transition: box-shadow .3s cubic-bezier(0.4, 0.0, 0.2, 1),
    background-color .3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.call-for-volunteers:hover,
.call-for-volunteers:focus {
  box-shadow: 0px .2em 12px rgba(0, 0, 0, 0.1);
  background-color: var(--hover-accent);
}

.show-live-cast {
  text-align: center;
  padding-top: 1em;
}

.show-live-cast a {
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

.show-live-cast a:hover,
.show-live-cast a:focus {
  box-shadow: 0px .2em 12px rgba(0, 0, 0, 0.1);
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
    max-height: 80vh;

    font-size: 1.2em;
  }

  .topic .foreground {
    flex-direction: row;
  }

  .topic .logo-box {
    flex-basis: 50%;
  }

  .topic .main-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-basis: 50%;
    margin-left: 1em;

    text-align: right;
  }
}
</style>
