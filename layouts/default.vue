<template>
  <div class="root" :class="{app: appMode}">
    <NavBar v-if="!appMode" />
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
class defaultLayout extends Vue {
  appMode = false

  mounted () {
    this.appMode = window.location.search.match('mode=app') !== null
  }
}

export default defaultLayout
</script>

<style>
:root {
  --accent: rgb(59, 156, 96);
}

html {
  font-family: 'Noto Sans', Helvetica, Arial, sans-serif;
  font-size: 18px;
  line-height: 2em;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

html[lang=zh-TW] {
  font-family: 'Noto Sans TC', '微軟正黑體', 'Microsoft JhengHei', '蘋方-繁', sans-serif;
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

ul {
  padding: 0;
}

ul > li {
  list-style: none;
}

.container {
  width: 100%;
  max-width: 1280px;
}

@media(min-width: 840px) {
  .container {
    width: 80%;
  }
}

@media(min-width: 1300px) {
  .container {
    width: 70%;
  }
}
</style>

<style scoped>
.root {
  padding-top: 3.6rem;

  display: flex;
  flex-direction: column;
  align-items: center;
}
.root.app {
  padding-top: 0rem;
}

</style>
