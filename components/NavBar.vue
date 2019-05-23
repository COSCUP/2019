<template>
  <nav>
    <input id="nav-menu-state" type="checkbox" :checked="showMenu" />
    <ul class="nav-header">
      <li>
        <label for="nav-menu-state" class="nav-trigger" >
          <Icon class="icon" icon="chevron-down" />
        </label>
      </li>
      <li>
        <nuxt-link class="logo" :to="localePath('index')">
          <img src="~/assets/logo-200.png" alt="" />
        </nuxt-link>
      </li>
      <li>
        <ul class="languages">
          <li v-if="$i18n.locale != 'en'"><nuxt-link :to="switchLocalePath('en')">En</nuxt-link></li>
          <li v-if="$i18n.locale != 'zh-TW'"><nuxt-link :to="switchLocalePath('zh-TW')">繁</nuxt-link></li>
        </ul>
      </li>
    </ul>
    <div class="nav-body">
      <nuxt-link class="logo" :to="localePath('index')">
        <img src="~/assets/logo-200.png" alt="" />
      </nuxt-link>
      <ul class="pages container">
        <li><nuxt-link :to="localePath('index')">{{ $t('pages.about') }}</nuxt-link></li>
        <li><nuxt-link :to="localePath('venue')">{{ $t('pages.venue') }}</nuxt-link></li>
        <li><nuxt-link :to="localePath('sponsors')">{{ $t('pages.sponsors') }}</nuxt-link></li>
        <li><a href="https://blog.coscup.org" target="_blank">{{ $t('pages.blog') }}</a></li>
        <li><a href="https://hackmd.io/s/SyCQqip2N" target="_blank">{{ $t('pages.coc') }}</a></li>
      </ul>
      <ul class="languages">
        <li><nuxt-link :to="switchLocalePath('en')">En</nuxt-link></li>
        <li><nuxt-link :to="switchLocalePath('zh-TW')">繁</nuxt-link></li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      showMenu: false,
    }
  },
  watch: {
    $route({ path: toPath }, { path: fromPath }) {
      if (toPath !== fromPath)
        this.showMenu = false
    }
  },
})
</script>


<style scoped>
:root {
  --accent: rgb(59, 156, 96);
  --secondary: rgb(177, 215, 191);
}

nav {
  background-color: #fff;
  box-shadow: 0px 2px 16px rgba(204, 204, 204, 0.5);
  font-size: .9em;

  display: block;
  height: 3.6rem;

  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 10;
}

#nav-menu-state {
  display: none;
}

.nav-header, .nav-header > li {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;

  height: 100%;

  padding: 0;
}

.nav-header > li:nth-child(2) {
  position: absolute;
  left: 50%;
  margin-left: -2em;
}

.nav-trigger {
  padding: 0 1em;
  display: flex;
  align-items: center;

  text-decoration: none;
  color: var(--accent);
  cursor: pointer;

  transition: 0.4s cubic-bezier(0.4, 0.0, 0.2, 1) transform;
}

#nav-menu-state:checked ~ .nav-header .nav-trigger {
  transform: rotateX(180deg);
}

.nav-trigger .icon {
  height: 1.3em;
  width: 2em;
}

.nav-body {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;

  height: 100%;
}

.nav-body .logo,
.nav-body .languages {
  display: none;
}

.logo {
  padding: 0 1em;
  display: flex;
  align-items: center;
}

.logo img {
  height: 2em;
  width: 2em;
}

.pages {
  display: flex;
  flex-direction: column;
  padding: 0 1em;
  position: fixed;
  top: 3.6rem;
  height: 0;
  overflow: hidden;

  background-color: #fff;

  transition: 1s height ease-in-out;
}

#nav-menu-state:checked ~ .nav-body .pages {
  height: 100%;
}

.pages li {
  display: flex;

  opacity: 0;

  transform: scale(1.1) translateY(-1em);
  transition: opacity 0.35s ease-out,
    transform 0.35s ease-out;
}

.pages li:nth-child(1) {
  transition-delay: 300ms, 300ms;
}
.pages li:nth-child(2) {
  transition-delay: 350ms, 350ms;
}
.pages li:nth-child(3) {
  transition-delay: 400ms, 400ms;
}
.pages li:nth-child(4) {
  transition-delay: 450ms, 450ms;
}
.pages li:nth-child(5) {
  transition-delay: 500ms, 500ms;
}
.pages li:nth-child(6) {
  transition-delay: 550ms, 550ms;
}
.pages li:nth-child(7) {
  transition-delay: 600ms, 600ms;
}
.pages li:nth-child(8) {
  transition-delay: 650ms, 650ms;
}

#nav-menu-state:checked ~ .nav-body .pages li {
  opacity: 1;

  transform: none;
}

.pages li a {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: .5em 0;

  color: var(--accent);

  border-bottom: 1px solid color(var(--secondary) a(.4));
}

.pages li a:hover {
  color: color(var(--accent) a(.4));
}

.pages li a.nuxt-link-exact-active {
  color: color(var(--accent) a(.4));
}

.languages {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;

  padding: 0;
}

.languages li {
  display: flex;
}

.languages li a {
  display: flex;
  align-items: center;
  padding: 0 .5em;

  text-align: center;
}

.languages li:first-child a {
  padding-left: 1em;
}

.languages li:last-child a {
  padding-right: 1em;
}

@media(min-width: 840px) {
  .nav-header {
    display: none;
  }

  .nav-body .logo,
  .nav-body .languages {
    display: flex;
  }

  .logo {
    border-right: 1px solid #e9e9e9;
  }

  .pages {
    flex-direction: row;
    position: initial;
    height: initial;

    align-items: stretch;
    background-color: initial;

    transition: initial;
  }

  .pages li {
    flex-grow: 1;

    opacity: 1;

    transform: none;
    transition: none;
  }

  .pages li a {
    color: hsl(0, 0%, 60%);

    border-bottom: 0px;
  }

  .pages li a.nuxt-link-exact-active {
    color: var(--accent);

    border-top: 4px transparent solid;
    border-bottom: 4px var(--accent) solid;
  }

  .languages {
    border-left: 1px solid #e9e9e9;
  }
}
</style>
