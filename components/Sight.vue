<template>
  <svg
    v-if="width > 0 && height > 0"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
  >
    <defs>
      <filter id="f1" x="0" y="0">
        <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
      </filter>
      <radialGradient
        id="flashlight"
        cx="50%"
        cy="50%"
        r="50%"
        fx="50%"
        fy="50%"
      >
        <stop
          offset="0%"
          style="stop-color: rgb(255, 255, 255); stop-opacity: 1"
        />
        <stop
          offset="6%"
          style="stop-color: rgb(255, 255, 255); stop-opacity: 1"
        />
        <stop
          offset="100%"
          style="stop-color: rgb(255, 255, 255); stop-opacity: .6"
        />
      </radialGradient>
    </defs>
    <g stroke="rgb(59, 156, 96)" stroke-opacity="0.16" fill="none">
      <path
        v-for="x in steps(width / 16, width / 8 - 6, 6)"
        :key="x"
        :d="`M ${x} 0 L ${spot.x} ${spot.y}`"
      />
      <path
        v-for="x in steps(width / 8 - 3, width / 4, 6)"
        :key="x"
        :d="`M ${x} 0 L ${spot.x} ${spot.y}`"
        stroke-width="2"
      />
      <path
        v-for="x in steps(width / 4 + 3, (width / 8) * 3, 6)"
        :key="x"
        :d="`M ${x} 0 L ${spot.x} ${spot.y}`"
      />
    </g>
    <g stroke="rgb(59, 156, 96)" stroke-opacity="0.31" fill="none">
      <path
        v-for="x in steps(width / 16, width / 8 - 6, 6)"
        :key="x"
        :d="`M ${x} ${height + 1} L ${spot.x} ${spot.y}`"
      />
      <path
        v-for="x in steps(width / 8 - 3, width / 4, 6)"
        :key="x"
        :d="`M ${x} ${height + 1} L ${spot.x} ${spot.y}`"
        stroke-width="2"
      />
      <path
        v-for="x in steps(width / 4 + 3, (width / 8) * 3, 6)"
        :key="x"
        :d="`M ${x} ${height + 1} L ${spot.x} ${spot.y}`"
      />
    </g>
    <g stroke="rgb(59, 156, 96)" stroke-opacity="0.08" fill="none">
      <path
        v-for="dy in steps(height / 16, height / 8 - 3, 6)"
        :key="dy"
        :d="`M ${width + 1} ${height - dy} L ${spot.x} ${spot.y}`"
      />
      <path
        v-for="dy in steps(height / 8 - 3, height / 4, 6)"
        :key="dy"
        :d="`M ${width + 1} ${height - dy} L ${spot.x} ${spot.y}`"
        stroke-width="2"
      />
      <path
        v-for="dy in steps(height / 4 + 3, (height / 8) * 3, 6)"
        :key="dy"
        :d="`M ${width + 1} ${height - dy} L ${spot.x} ${spot.y}`"
      />
    </g>
    <g>
      <ellipse
        fill="url(#flashlight)"
        filter="url(#f1)"
        :cx="spot.x"
        :cy="spot.y"
        :rx="width / 4"
        :ry="height / 4"
      />
    </g>
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  props: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    spot: {
      type: Object,
      required: true
    }
  }
})
class Sight extends Vue {
  steps(start, end, step) {
    const generator = function*() {
      for (let i = start; i < end; i += step) {
        yield i
      }
    }

    return [...generator()]
  }
}

export default Sight
</script>
