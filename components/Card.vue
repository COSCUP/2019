<template>
  <section class="card">
    <slot />
  </section>
</template>

<style scoped>
.card {
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0px 4px 48px rgba(0, 0, 0, 0.1);
  margin: 0 1em 2em;
  padding: 2em;
}
</style>
