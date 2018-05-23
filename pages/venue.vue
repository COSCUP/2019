<template>
  <main class="direction">
    <Map
      class="location"
      :center="location"
      :zoom="16"
    >
      <MapInfoWindow
        ref="locationInfoWindow"
        :position="location"
        :opened="true"
        :options="{
          pixelOffset: {
            width: 0,
            height: -42,
          },
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
    </Map>
    <div class="transportations container">
      <div class="method"
        v-for="(direction, method) in transportations"
        :key="method"
      >
        <Card>
          <h4>{{ direction.name }}</h4>
          <article>
            <p v-for="(paragraph, idx) in getParagraphs(direction.description)" :key=idx>
              {{ paragraph }}
            </p>
          </article>
        </Card>
      </div>
    </div>
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
  Map,
  Marker as MapMarker,
  InfoWindow as MapInfoWindow,
} from 'vue2-google-maps'

import {
  name as transportationStoreName,
} from '~/store/transportation'


import Card from '~/components/Card.vue'
import Sponsor from '~/components/Sponsor.vue'

const TransportationState = namespace(transportationStoreName, State)

@Component({
  components: {
    Card,
    Map,
    MapMarker,
    MapInfoWindow,
  },
})
export default class extends Vue {
  @TransportationState location
  @TransportationState address
  @TransportationState('transportation') transportations
  @TransportationState place

  async fetch({ store: { dispatch } }) {
    await dispatch(`${transportationStoreName}/fetchData`)
  }

  openInfoWindow() {
    const infoWindow : any = this.$refs.locationInfoWindow
    infoWindow._openInfoWindow()
  }

  getParagraphs(article) {
    return article.split(/\r\n?|\n\r?/g)
  }
}
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

.transportations {
  flex-grow: 1;

  display: block;
  column-count: 2;
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
