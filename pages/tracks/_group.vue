<template>
  <main class="tracks">
    <template v-if="this.talks.length > 0">
      <div class="zoom-tip">Ctrl + scroll to zoom</div>
      <Timetable
        class="timetable"
        :talks="talks"
        :tracks="tracks"
        :responsibleHeight="true"
        @click-talk="$router.push(localePath({ name: 'programs-id', params: { id: $event.id } }))"
      />
    </template>
    <Card class="track container" v-for="track in groupedTracks" :key="track.title">
      <h1>{{ track.title }}</h1>
      <div class="communities">
        <div v-for="community in track.communities"
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
      const [_, month, day, startTime] = start.match(/\d{4}-(\d{2})-(\d{2})T(\d+:\d+):00\+0800/)

      return end.replace(/\d{4}-\d{2}-\d{2}T(\d+:\d+):00\+0800/, (_, endTime) => (
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

  async fetch({ store: { dispatch } }) {
    await dispatch(`${programsStoreName}/fetchData`)
  }

  getParagraphs(article) {
    return article.split(/\r\n?|\n\r?/g)
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

  get groupedTracks() {
    return Object.values(this.tracks.reduce((collection, { title, ...track }) => {
      if (!collection[title]) {
        collection[title] = {
          title,
          tracks: [],
        }
      }

      collection[title].tracks.push(track)

      return collection
    }, {})).map(({ tracks, title }) => ({
      title,
      rooms: tracks.map(({ room }) => (room)).sort((lRoom, rRoom) => (
        lRoom.localeCompare(rRoom)
      )),
      communities: tracks[0].communities,
    })).sort(({ title: lTitle }, { title: rTitle }) => (
      lTitle.localeCompare(rTitle)
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
  .community {
    flex-direction: row;

    padding: 1em;
  }
}
</style>
