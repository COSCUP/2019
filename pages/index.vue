<template>
  <main class="index">
    <Card class="topic">
      <h1>COSCUP 2018</h1>
      <h2>{{ description }}</h2>
      {{ place }}
    </Card>
    <Card class="container">
      <h1>{{ $t('register') }}</h1>
      <span>{{ registration.start_at | moment }}</span> ~
      <span>{{ registration.end_at | moment }}</span>
    </Card>
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

import Card from '~/components/Card.vue'

const MainState = namespace(mainStoreName, State)

@Component({
  components: {
    Card,
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

  async fetch({ store: { dispatch } }) {
    await dispatch(`${mainStoreName}/fetchData`)
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
  margin: 0 !important;
  padding: 4em 2em !important;
  min-height: 80vh;
  height: 100%;
  max-height: 80vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.topic h1 {
  color: var(--accent);
  font-size: 4em;
  line-height: 1.2em;
  padding-bottom: .4em;

  text-align: center;
}

.topic h2 {
  text-align: center;
}
</style>
