<template>
  <div class="ratio-box" :style="{ '--ratio': cssRatio }">
    <div class="content" v-bind="$attrs">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  inheritAttrs: false,
  props: {
    ratio: {
      type: String,
      required: true
    }
  }
})
class RatioBox extends Vue {
  get cssRatio() {
    const ratio: String = this.$props.ratio
    const [w, h = 1] = ratio.split(':')

    return `${(100.0 * Number(h)) / Number(w)}%`
  }
}
export default RatioBox
</script>

<style scoped>
.ratio-box {
  width: 100%;
  position: relative;
}

.ratio-box:before {
  content: '';
  display: block;
  padding-top: 100%;
  padding-top: var(--ratio);
}

.ratio-box > .content {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
</style>
