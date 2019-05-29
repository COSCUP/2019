<template>
  <a class="external-link" target="_blank">
    <slot></slot>
    <Icon class="external-link-icon" icon="external-link-alt" />
  </a>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class ExternalLink extends Vue {}

export default ExternalLink
</script>

<style scoped>
.external-link .external-link-icon {
  margin-left: 0.3em;
}
</style>
