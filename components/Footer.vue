<template>
  <footer>
    <div class="years container">
      <a v-for="(link, year) in previous_websites"
        :key="year"
        :href="link"
        target="_blank"
      >
        {{ year }}
      </a>
    </div>
    <!-- <div class="socials container">
      <a v-for="(link, social) in social_network"
        :key="social"
        :href="link"
        target="_blank"
      >
        {{ social }}
      </a>
    </div> -->
  </footer>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from 'nuxt-property-decorator'
import {
  State,
  namespace,
} from 'vuex-class'

import {
  name as mainStoreName
} from '~/store/main'

const MainState = namespace(mainStoreName, State)

@Component
export default class extends Vue {
  @MainState previous_websites
  @MainState social_network
}
</script>

<style scoped>
:root {
  --accent: rgb(59, 156, 96);
  --secondary: rgb(177, 215, 191);
}

footer {
  min-height: 10em;
  height: 40vh;
  width: 100%;
  margin-top: 6em;

  background-color: var(--secondary);
  box-shadow: inset 0px 6px 12px -12px rgba(0, 0, 0, 0.5);
  color: var(--accent);
  font-size: .9em;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

footer a {
  color: var(--accent);

  &:hover, &:focus {
    color: #fff;
  }
}

.years, .socials {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.years a,
.socials a {
  margin: 0 .5em;
}
</style>
