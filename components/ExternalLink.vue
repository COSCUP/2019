<template>
  <a class="external-link" target="_blank">
    <slot></slot>
    <Icon class="external-link-icon" icon="external-link-alt" />
  </a>
</template>

<style scoped>
.external-link .external-link-icon {
  margin-left: .3em;
}
</style>
