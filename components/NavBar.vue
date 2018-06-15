<template>
  <nav>
    <nuxt-link class="logo" :to="localePath('index')">
      <img src="~/assets/logo-200.png" />
    </nuxt-link>
    <ul class="pages container">
      <li><nuxt-link :to="localePath('index')">{{ $t('pages.about') }}</nuxt-link></li>
      <!-- <li><nuxt-link :to="localePath('schedules')">{{ $t('pages.schedules') }}</nuxt-link></li> -->
      <li><a href="https://blog.coscup.org/2018/05/coscup-information-about-tracks-this.html" target="_blank">{{ $t('pages.schedules') }}</a></li>
      <li><nuxt-link :to="localePath('venue')">{{ $t('pages.venue') }}</nuxt-link></li>
      <li><nuxt-link :to="localePath('sponsors')">{{ $t('pages.sponsors') }}</nuxt-link></li>
      <li><nuxt-link :to="localePath('staffs')">{{ $t('pages.staffs') }}</nuxt-link></li>
      <li><a href="https://blog.coscup.org" target="_blank">{{ $t('pages.blog') }}</a></li>
    </ul>
    <ul class="languages">
      <li><nuxt-link :to="switchLocalePath('en')">En</nuxt-link></li>
      <li><nuxt-link :to="switchLocalePath('zh-TW')">繁</nuxt-link></li>
    </ul>
  </nav>
</template>

<style scoped>
:root {
  --accent: rgb(59, 156, 96);
}

nav {
  height: 3.6rem;
}

nav {
  background-color: #fff;
  box-shadow: 0px 2px 16px rgba(204, 204, 204, 0.5);
  font-size: .9em;

  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;

  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 10;
}

.logo {
  padding: 0 1em;
  display: flex;
  align-items: center;

  border-right: 1px solid #e9e9e9;
}

.logo img {
  height: 2em;
  width: 2em;
}

.pages {
  display: flex;
  flex-direction: row;
  padding: 0 1em;

  align-items: stretch;
}

.pages li {
  flex-grow: 1;
  display: flex;
}

.pages li a {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  color: hsl(0, 0%, 60%);
}

.pages li a.nuxt-link-exact-active {
  color: var(--accent);

  border-top: 4px transparent solid;
  border-bottom: 4px var(--accent) solid;
}

.languages {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;

  padding: 0;

  border-left: 1px solid #e9e9e9;
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
</style>
