<template>
  <main class="direction">
    <Map class="location" :center="location" :zoom="16">
      <MapInfoWindow
        ref="locationInfoWindow"
        :position="location"
        :opened="true"
        :options="{
          pixelOffset: {
            width: 0,
            height: -42
          }
        }"
      >
        <h4>{{ place }}</h4>
        {{ address }}
      </MapInfoWindow>
      <MapMarker
        :position="location"
        :clickable="true"
        @click="openInfoWindow"
      />
      <template slot="visible">
        <div class="open-in-gm-controller">
          <ExternalLink :href="googleMapsDirectionUrl">{{
            $t('venue.openInGoogleMaps')
          }}</ExternalLink>
        </div>
      </template>
    </Map>
    <div class="transportations container">
      <div
        v-for="(direction, method) in transportations"
        :key="method"
        class="method"
      >
        <Card>
          <h4>{{ direction.name }}</h4>
          <article>
            <p
              v-for="(paragraph, idx) in getParagraphs(direction.description)"
              :key="idx"
            >
              {{ paragraph }}
            </p>
          </article>
        </Card>
      </div>
    </div>
    <SponsorFooter />
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { State, namespace } from 'vuex-class'
import {
  Map,
  Marker as MapMarker,
  InfoWindow as MapInfoWindow
} from 'vue2-google-maps'

import { name as transportationStoreName } from '~/store/transportation'

import Card from '~/components/Card.vue'
import SponsorFooter from '~/components/SponsorFooter.vue'
import ExternalLink from '~/components/ExternalLink.vue'

const TransportationState = namespace(transportationStoreName, State)

@Component({
  components: {
    Card,
    ExternalLink,
    Map,
    MapMarker,
    MapInfoWindow,
    SponsorFooter
  }
})
class venue extends Vue {
  @TransportationState location
  @TransportationState address
  @TransportationState('transportation') transportations
  @TransportationState place

  mounted() {
    this.$store.dispatch('clientsFirstFetch', this.$options.fetch)
  }

  async fetch({ store: { dispatch } }) {
    await dispatch(`${transportationStoreName}/fetchData`)
  }

  get googleMapsDirectionUrl() {
    const { lat, lng } = this.location

    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
  }

  openInfoWindow() {
    const infoWindow: any = this.$refs.locationInfoWindow
    infoWindow._openInfoWindow()
  }

  getParagraphs(article) {
    return article.split(/\r\n?|\n\r?/g)
  }
}
export default venue
</script>

<style scoped>
main.direction {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.location {
  flex-grow: 1;
  width: 100%;
  height: 100vh;
  max-height: 70vh;
  min-height: 320px;
  margin-bottom: 2em;
}

.location .open-in-gm-controller {
  position: absolute;
  height: 28px;
  bottom: 13px;
  right: 38px;
  margin: 10px;
  padding: 0 0.5em;

  background-color: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  border-radius: 2px;

  font-size: 13px;
  line-height: 28px;
}

.open-in-gm-controller a {
  color: rgb(86, 86, 86);

  &:hover,
  &:focus {
    color: #000;
  }
}

.transportations {
  flex-grow: 1;

  display: block;
  column-count: 1;
}

@media (min-width: 840px) {
  .transportations {
    column-count: 2;
  }
}

.transportations .method {
  display: inline-block;

  width: 100%;
  min-width: 320px;
}

.transportations .method article {
  margin-bottom: -1em;
}

.transportations .method article p {
  min-height: 1em;
}
</style>
