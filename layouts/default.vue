<template>
  <div class="root">
    <NavBar />
    <nuxt />
    <Footer />
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from 'nuxt-property-decorator'

import NavBar from '~/components/NavBar.vue'
import Footer from '~/components/Footer.vue'

@Component({
  components: {
    NavBar,
    Footer,
  },
})
export default class extends Vue {
}
</script>

<style>
:root {
  --accent: rgb(59, 156, 96);
}

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

body {
  background-color: rgb(245, 252, 245);
}

a {
  text-decoration: none;
  color: var(--accent);

  &:hover, &:focus {
    color: color(var(--accent) a(40%))
  }
}

ul > li {
  list-style: none;
}

.container {
  width: 60%;
  max-width: 1280px;
}
</style>

<style scoped>
.root {
  padding-top: 3.6rem;

  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
