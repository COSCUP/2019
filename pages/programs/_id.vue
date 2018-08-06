<template>
  <main class="programs">
    <Card class="talk container">
      <h1>{{ talk.title }}</h1>
      <h4><Icon class="icon" icon="columns" /><nuxt-link :to="localePath({ name: 'tracks-group', params: { group: talk.track.group } })">{{ talk.track.title }}</nuxt-link></h4>
      <h4><Icon class="icon" icon="map-marker-alt" />{{ talk.track.room }}</h4>
      <h4><Icon class="icon" icon="clock" />{{ talk | getDatetime }}</h4>

      <Markdown tag="article" :value="talk.intro"></Markdown>

      <Markdown tag="article" class="addition" :value="talk.addition"></Markdown>
    </Card>
    <Card class="container">
      <div class="speakers">
        <div v-for="speaker in talk.speakers" :key="speaker.id"
          class="speaker"
        >
          <ASpan v-if="speaker.avatar" class="avatar" :href="speaker.link" :title="speaker.name" target="_blank">
            <RatioBox ratio="1:1" style="text-align: center;">
              <img :src="speaker.avatar" />
            </RatioBox>
          </ASpan>
          <div class="description">
            <h1><ASpan :href="speaker.link" :title="speaker.name" target="_blank">{{ speaker.name }}</ASpan></h1>
            <Markdown tag="article" :value="speaker.intro"></Markdown>
          </div>
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

import ASpan from '~/components/ASpan.vue'
import Card from '~/components/Card.vue'
import RatioBox from '~/components/RatioBox.vue'
import SponsorFooter from '~/components/SponsorFooter.vue'
import Markdown from '~/components/Markdown.vue'

const ProgramsState = namespace(programsStoreName, State)

@Component({
  components: {
    ASpan,
    Card,
    RatioBox,
    SponsorFooter,
    Markdown,
  },
  filters: {
    getDatetime({ start, end }) {
      const [_, month, day, startTime] = start.match(/\d{4}-(\d{2})-(\d{2})T(\d+:\d+):00\+08:00/)

      return end.replace(/\d{4}-\d{2}-\d{2}T(\d+:\d+):00\+08:00/, (_, endTime) => (
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

  head () {
    const title = `${this.talk.title} - ${this.talk.track.title} - COSCUP x GNOME.Asia x openSUSE.Asia 2018`

    return {
      title,
      meta: [
        { hid: 'og:title', property: 'og:title', content: title },
        { hid: 'description', name: 'description', content: this.talk.intro },
        { hid: 'twitter:label1', property: 'twitter:label1', content: this.$t('programs.track') },
        { hid: 'twitter:data1', property: 'twitter:data1', content: this.talk.track.title },
        { hid: 'twitter:label2', property: 'twitter:label2', content: this.$t('programs.speakers') },
        { hid: 'twitter:data2', property: 'twitter:data2', content: this.talk.speakers.map(({ name }) => (name)).join(', ') },
      ]
    }
  }

  async fetch({ store: { state, dispatch }, params, error }) {
    if (!params) return

    await dispatch(`${programsStoreName}/fetchData`)

    const talk = state[programsStoreName].talks.filter(({ id }) => (id === params.id))[0]
    if (!talk) {
      error({ statusCode: 404, message: 'Page not found.' })
    }
  }

  get talk() {
    return this.allTalks.filter(({ id }) => (id === this.$route.params.id))[0]
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
  word-wrap: break-word;
}

.talk .addition {
  font-size: .8em;
  margin-left: .8em;
  margin-right: .8em;
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

.speaker .avatar + .description {
  flex-basis: 80%;
}

.speaker .description h1 {
  font-size: 1.2em;
}

.speaker article {
  word-wrap: break-word;
}

.speaker .avatar {
  flex-basis: 20%;
  margin-right: 1em;
}

.speaker .avatar img {
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
