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
    <div class="socials container">
      <a v-for="network in socialNetworks"
        :key="network.name"
        :href="network.link"
        target="_blank"
      >
        <Icon :icon="network.icon" />
      </a>
    </div>
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

const socialIconMapping = {
  blog: ['fab', 'blogger'],
  facebook: ['fab', 'facebook'],
  flickr: ['fab', 'flickr'],
  google_plus: ['fab', 'google-plus'],
  plurk: ['ext', 'plurk'],
  twitter: ['fab', 'twitter'],
  youtube: ['fab', 'youtube'],
  telegram_group: ['fab', 'telegram'],
  telegram_channel: 'bullhorn',
}

@Component
export default class extends Vue {
  @MainState previous_websites
  @MainState('social_network') socialNetworkLinks

  get socialIconMapping() { return socialIconMapping }

  get socialNetworks() {
    return Object.entries(this.socialNetworkLinks).map(([name, link]) => ({
      name,
      link,
      icon: socialIconMapping[name],
      title: name,
    }))
  }
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
  justify-content: space-evenly;
}

.years a,
.socials a {
  flex-grow: 1;
  padding: 0 4px;

  display: flex;
  justify-content: center;
  align-items: center;
}

.years {
  font-size: .9em;
}

.socials {
  font-size: 1.6em;
}

.socials a {
  padding: .2em 0;
}
</style>
