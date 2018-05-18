<template>
  <main class="direction">
    <Map
      class="location"
      :center="location"
      :zoom="16"
    >
      <MapCluster>
        <MapInfoWindow
          :position="location"
          :opened="infoWindowOpened"
          :options="{
            pixelOffset: {
              width: 0,
              height: -42,
            },
          }"
          @closeclick="infoWindowOpened = false"
        >
          <h4>{{ place }}</h4>
          {{ address }}
        </MapInfoWindow>
        <MapMarker
          :position="location"
          :clickable="true"
          @click="infoWindowOpened = true"
        />
      </MapCluster>
    </Map>
    <div class="transportations container">
      <div class="method"
        v-for="(direction, method) in transportations"
        :key="method"
      >
        <Card>
          <h4>{{ direction.name }}</h4>
          {{ direction.description }}
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
  Cluster as MapCluster,
  Marker as MapMarker,
  InfoWindow as MapInfoWindow,
} from 'vue2-google-maps'

import {
  name as transportationStoreName,
} from '~/store/transportation'
import {
  name as mainStoreName
} from '~/store/main'


import Card from '~/components/Card.vue'
import Sponsor from '~/components/Sponsor.vue'

const TransportationState = namespace(transportationStoreName, State)
const MainState = namespace(mainStoreName, State)

@Component({
  components: {
    Card,
    Map,
    MapCluster,
    MapMarker,
    MapInfoWindow,
  },
})
export default class extends Vue {
  @TransportationState location
  @TransportationState address
  @TransportationState('transportation') transportations
  @MainState place

  infoWindowOpened : boolean = true

  async fetch({ store: { dispatch } }) {
    await dispatch(`${transportationStoreName}/fetchData`)
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
}

.transportations {
  flex-grow: 1;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.transportations .method {
  width: 50%;
  min-width: 320px;
  margin-bottom: -2em;
}
</style>
