<template>
  <div>
    <NavBar />
    <nuxt/>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from 'nuxt-property-decorator'

import NavBar from '~/components/NavBar.vue';

@Component({
  components: {
    NavBar,
  },
})
export default class extends Vue {
}
</script>


<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 18px;
  line-height: 2em;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}

a {
  text-decoration: none;
}

ul > li {
  list-style: none;
}

.container {
  width: 60%;
  max-width: 1280px;
}
</style>
