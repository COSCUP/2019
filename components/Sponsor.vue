<template>
  <a class="sponsor" :href="sponsor.link" target="_blank" :title="sponsor.name">
    <img :src="sponsor.image" />
    {{ sponsor.name }}
  </a>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from 'nuxt-property-decorator'

@Component({
  props: {
    sponsor: {
      type: Object,
      required: true,
    },
  },
})
export default class extends Vue {
}
</script>

<style scoped>
.sponsor {
  flex-basis: 33%;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: .5em;
}

.sponsor img {
  max-width: 100%;
}

.sponsor:hover img {
  filter: opacity(.6);
}
</style>
