<template>
  <nav>
    <div class="logo">
      <nuxt-link :to="localePath('index')">
        <img src="~/assets/logo-200.png" />
      </nuxt-link>
    </div>
    <ul class="pages container">
      <li><nuxt-link :to="localePath('index')">{{ $t('pages.about') }}</nuxt-link></li>
      <li><nuxt-link :to="localePath('schedules')">{{ $t('pages.schedules') }}</nuxt-link></li>
      <li><nuxt-link :to="localePath('directions')">{{ $t('pages.directions') }}</nuxt-link></li>
      <li><nuxt-link :to="localePath('sponsors')">{{ $t('pages.sponsors') }}</nuxt-link></li>
      <li><nuxt-link :to="localePath('staffs')">{{ $t('pages.staffs') }}</nuxt-link></li>
      <li><a href="https://blog.coscup.org" target="_blank">{{ $t('pages.blog') }}</a></li>
    </ul>
    <div class="languages">
      <ul>
        <li><nuxt-link :to="switchLocalePath('en')">En</nuxt-link></li>
        <li><nuxt-link :to="switchLocalePath('zh-TW')">繁</nuxt-link></li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
nav, .logo a, .languages li a {
  height: 4em;
}

nav {
  background-color: #fff;
  box-shadow: 0px 2px 16px rgba(204, 204, 204, 0.5);
  font-size: .9em;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 10;
}

.logo {
  flex-grow: 1;
  display: flex;
}

.logo a {
  padding: 1em;

  border-right: 1px solid #e9e9e9;
}

.logo img {
  height: 2em;
  width: 2em;
}

.pages {
  align-self: center;

  display: flex;
  flex-direction: row;
  padding: 0 1em;
  margin-left: auto;

  justify-content: flex-start;
  align-items: center;
}

.pages li {
  flex-grow: 1;

  text-align: center;
}

.pages li a {
  padding: 1.4em 1.2em;

  text-align: center;
}

.languages {
  display: flex;
  flex-grow: 1;

  flex-direction: column;
  align-items: flex-end;
}

.languages ul {
  display: flex;
  flex-direction: row;
  padding: 0 .5em;
  margin-left: auto;

  justify-content: center;
  align-items: center;

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
</style>
