<template>
  <main class="programs">
    <Card class="talk container">
      <h1>{{ talk.title }}</h1>
      <h4><Icon class="icon" icon="map-marker-alt" />{{ talk.track.room }}</h4>
      <h4><Icon class="icon" icon="clock" />{{ talk | getDatetime }}</h4>

      <article>
        <p v-for="(paragraph, idx) in getParagraphs(talk.intro)" :key="idx">
          {{ paragraph }}
        </p>
      </article>

      <article class="addition" v-if="talk.addition">
        <p v-for="(paragraph, idx) in getParagraphs(talk.addition)" :key="idx">
          {{ paragraph }}
        </p>
      </article>
    </Card>
    <Card class="container">
      <div class="speakers">
        <div v-for="speaker in talk.speakers" :key="speaker.id"
          class="speaker"
        >
          <template v-if="speaker.link">
            <a v-if="speaker.avatar" class="logo" :href="speaker.link" :title="speaker.name" target="_blank">
              <RatioBox ratio="1:1" style="text-align: center;">
                <img :src="speaker.avatar" />
              </RatioBox>
            </a>
            <div class="description">
              <h1><a :href="speaker.link" :title="speaker.name" target="_blank">{{ speaker.name }}</a></h1>
              <article>
                <p v-for="(paragraph, idx) in getParagraphs(speaker.intro)" :key="idx">
                  {{ paragraph }}
                </p>
              </article>
            </div>
          </template>
          <template v-else>
            <span v-if="speaker.avatar" class="logo" :title="speaker.name">
              <RatioBox ratio="1:1" style="text-align: center;">
                <img :src="speaker.avatar" />
              </RatioBox>
            </span>
            <div class="description">
              <h1>{{ speaker.name }}</h1>
              <article>
                <p v-for="(paragraph, idx) in getParagraphs(speaker.intro)" :key="idx">
                  {{ paragraph }}
                </p>
              </article>
            </div>
          </template>
        </div>
      </div>
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

import {
  name as programsStoreName,
} from '~/store/programs'

import Card from '~/components/Card.vue'
import RatioBox from '~/components/RatioBox.vue'
import SponsorFooter from '~/components/SponsorFooter.vue'

const ProgramsState = namespace(programsStoreName, State)

@Component({
  components: {
    Card,
    RatioBox,
    SponsorFooter,
  },
  filters: {
    getDatetime({ start, end }) {
      const [_, month, day, startTime] = start.match(/\d{4}-(\d{2})-(\d{2})T(\d+:\d+):00\+0800/)

      return end.replace(/\d{4}-\d{2}-\d{2}T(\d+:\d+):00\+0800/, (_, endTime) => (
        `${month}/${day} ${startTime} - ${endTime}`
      ))
    }
  }
})
export default class extends Vue {
  @ProgramsState('talks') allTalks

  mounted() {
    this.$store.dispatch('clientsFirstFetch', this.$options['fetch'])
  }

  async fetch({ store: { dispatch } }) {
    await dispatch(`${programsStoreName}/fetchData`)
  }

  getParagraphs(article) {
    return article.split(/\r\n?|\n\r?/g)
  }

  get talk() {
    return this.allTalks.filter(({ id }) => (id === this.$route.params.id))[0] || {}
  }
}
</script>

<style scoped>
main.programs {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2em;
}

.talk .icon {
  display: inline-block;
  width: 1em;
  text-align: center;
  margin-right: .5em;
}

.talk article {
  margin-top: 1em;
}

.talk .addition {
  font-size: .8em;
}

.speakers {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
}

.speaker {
  display: flex;
  flex-direction: column;

  padding: 0;
  margin: .5em 0;
}

.speaker .description {
  padding: 0;
}

.speaker .logo + .description {
  flex-basis: 80%;
}

.speaker .description h1 {
  font-size: 1.2em;
}

.speaker .logo {
  flex-basis: 20%;
}

.speaker .logo img {
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
  .speaker {
    flex-direction: row;

    padding: 1em;
  }
}
</style>
