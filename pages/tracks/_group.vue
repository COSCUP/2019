<template>
  <main class="tracks">
    <template v-if="this.talks.length > 0">
      <!-- <div class="zoom-tip">Ctrl + scroll to zoom</div> -->
      <Timetable
        class="timetable"
        :talks="talks"
        :tracks="tracks"
        :responsibleHeight="true"
        @click-talk="open($router.resolve(localePath({ name: 'programs-id', params: { id: $event.id } })))"
      />
    </template>

    <Card class="track container">
      <h1>{{ tracks[0].title }}</h1>
      <div class="communities">
        <div v-for="community in tracks[0].communities"
          :key="community.id"
          class="community"
        >
          <ASpan v-if="community.image" class="logo" :href="community.link" :title="community.title" target="_blank">
            <RatioBox ratio="1:1" style="text-align: center;">
              <img :src="community.image" />
            </RatioBox>
          </ASpan>
          <div class="description">
            <h1><ASpan :href="community.link" :title="community.title" target="_blank">{{ community.title }}</ASpan></h1>
            <Markdown tag="article" :value="community.intro"></Markdown>
          </div>
        </div>
      </div>
    </Card>

    <Card class="container">
      <h1>{{ $t('programs.talks') }}</h1>
    </Card>

    <Card class="talk container" v-for="talk in talks" :key="talk.id">
      <h1><nuxt-link :to="localePath({ name: 'programs-id', params: { id: talk.id } })">{{ talk.title }}</nuxt-link></h1>
      <h4><Icon class="icon" icon="user-alt" />{{ talk.speakers.map(({ name }) => (name)).join(', ') }}</h4>
      <h4><Icon class="icon" icon="map-marker-alt" />{{ talk.track.room }}</h4>
      <h4><Icon class="icon" icon="clock" />{{ talk | getDatetime }}</h4>
      <Markdown tag="article" :value="talk.intro"></Markdown>
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
import Timetable from '~/components/Timetable.vue'
import RatioBox from '~/components/RatioBox.vue'
import SponsorFooter from '~/components/SponsorFooter.vue'
import Markdown from '~/components/Markdown.vue'

const ProgramsState = namespace(programsStoreName, State)

@Component({
  components: {
    ASpan,
    Card,
    Timetable,
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
  @ProgramsState('tracks') allTracks

  mounted() {
    this.$store.dispatch('clientsFirstFetch', this.$options['fetch'])
  }
  
  head () {
    const title = `${this.tracks[0].title} - COSCUP 2018 x openSUSE.Asia x GNOME.Asia`

    return {
      title,
      meta: [
        { vmid: 'og:title', property: 'og:title', content: title },
        { hid: 'description', name: 'description', content: title },
        { hid: 'keywords', name: 'keywords', content: `COSCUP,${this.tracks[0].communities.map(({ title }) => (title)).join(',')}` },
      ]
    }
  }

  async fetch({ store: { state, dispatch }, params, error }) {
    if (!params) return

    await dispatch(`${programsStoreName}/fetchData`)

    const tracks = state[programsStoreName].tracks.filter(({ group }) => (group === params.group))
    if (tracks.length == 0) {
      error({ statusCode: 404, message: 'Page not found.' })
    }
  }

  open(link) {
    window.open(link.href, '_blank')
  }

  get tracks() {
    const trackGroup = this.$route.params.group
    return this.allTracks.filter(({ group }) => (group === trackGroup))
  }

  get talks() {
    return this.allTalks.filter(({ track: { id: trackId } }) => (
      this.tracks.find(({ id }) => (id === trackId))
    ))
  }
}
</script>

<style scoped>
main.tracks {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.zoom-tip {
  display: none;
  position: relative;
  width: 100%;
  background: rgb(255, 255, 255);
  font-size: .8em;
  text-align: center;
  line-height: 2em;
  pointer-events: none;
  z-index: 1;
}

.timetable {
  flex-grow: 1;
  width: 100%;
  max-height: 85vh;
  margin-bottom: 2em;
  background: #fff;
}

.communities {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
}

.community {
  display: flex;
  flex-direction: column;

  padding: 0;
  margin: .5em 0;
}

.community .description {
  padding: 0;
}

.community .logo + .description {
  flex-basis: 80%;
}

.community .description h1 {
  font-size: 1.2em;
}

.community .logo {
  flex-basis: 20%;
}

.community .logo img {
  max-height: 100%;
  max-width: 100%;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
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

@media(min-width: 840px) {
  .zoom-tip {
    display: block;
  }

  .community {
    flex-direction: row;

    padding: 1em;
  }
}
</style>
