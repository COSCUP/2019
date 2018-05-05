<template>
  <section class="container">
    <section class="header">
      <h1>COSCUP 2018</h1>
      <h2>{{ description }}</h2>
      <div class="location"></div>
    </section>
    <section class="registration">
      <span>{{ registration.start_at }}</span>
      <span>{{ registration.end_at }}</span>
    </section>
  </section>
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
  name as mainStoreName
} from '~/store/main'

const MainState = namespace(mainStoreName, State)

@Component
export default class extends Vue {
  @MainState description
  @MainState registration

  async fetch({ store: { dispatch } }) {
    await dispatch(`${mainStoreName}/fetchData`)
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
