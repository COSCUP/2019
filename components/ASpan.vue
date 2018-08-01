<template>
  <a v-if="$props.href"
    :href="$props.href"
    :target="$props.target"
    :title="$props.title"
  >
    <slot />
  </a>
  <span v-else><slot /></span>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from 'nuxt-property-decorator'

@Component({
  props: {
    href: {
      type: String,
      default: '',
    },
    target: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
  },
})
export default class extends Vue {}
</script>
