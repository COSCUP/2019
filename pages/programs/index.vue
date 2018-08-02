<template>
  <main class="programs">
    <!-- <div class="zoom-tip">Ctrl + scroll to zoom</div> -->
    <Timetable
      class="timetable"
      :talks="talks"
      :tracks="tracks"
      @click-talk="open($router.resolve(localePath({ name: 'programs-id', params: { id: $event.id } })))"
    />

    <Card class="container">
      <h1>{{ $t('programs.tracks') }}</h1>
    </Card>

    <Card class="track container" v-for="track in groupedTracks" :key="track.title">
      <h1><nuxt-link :to="localePath({ name: 'tracks-group', params: { group: track.group } })">{{ track.title }}</nuxt-link></h1>
      <h4><Icon class="icon" icon="map-marker-alt" />{{ track.rooms.join('/') }}</h4>
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
})
export default class extends Vue {
  @ProgramsState talks
  @ProgramsState tracks

  mounted() {
    this.$store.dispatch('clientsFirstFetch', this.$options['fetch'])
  }

  async fetch({ store: { dispatch } }) {
    await dispatch(`${programsStoreName}/fetchData`)
  }
  
  open(link) {
    window.open(link.href, '_blank')
  }

  get groupedTracks() {
    return Object.values(this.tracks.reduce((collection, { group, ...track }) => {
      if (!collection[group]) {
        collection[group] = {
          group,
          tracks: [],
        }
      }

      collection[group].tracks.push(track)

      return collection
    }, {})).map(({ tracks, group }) => ({
      group,
      rooms: tracks.map(({ room }) => (room)).sort((lRoom, rRoom) => (
        lRoom.localeCompare(rRoom)
      )),
      title: tracks[0].title,
      communities: tracks[0].communities,
    })).sort(({ title: lTitle }, { title: rTitle }) => (
      lTitle.localeCompare(rTitle)
    ))
  }
}
</script>

<style scoped>
main.programs {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.zoom-tip {
  display: none;
  position: relative;
  width: 50%;
  background: rgba(255, 255, 255, .6);
  font-size: .8em;
  text-align: center;
  line-height: 2em;
  margin-bottom: -2em;
  pointer-events: none;
  z-index: 5;
}

.timetable {
  flex-grow: 1;
  width: 100%;
  height: 100vh;
  max-height: 75vh;
  min-height: 320px;
  margin-bottom: 2em;
  background: #fff;
}

.track .icon {
  display: inline-block;
  width: 1em;
  text-align: center;
  margin-right: .5em;
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

.community article {
  word-wrap: break-word;
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

@media(min-width: 840px) {
  .timetable {
    max-height: 80vh;
  }
    
  .zoom-tip {
    display: block;
  }

  .community {
    flex-direction: row;

    padding: 1em;
  }
}
</style>
