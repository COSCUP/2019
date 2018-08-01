<template>
  <component :is="tag" v-html="$md.render($props.value)"></component>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from 'nuxt-property-decorator'

@Component({
  props: {
    value: {
      type: String,
      default: '',
    },
    tag: {
      type: String,
      default: 'div',
    },
  },
})
export default class extends Vue {
  mounted() {
    const $md = this['$md']

    const originalRender = $md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

    $md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      var targetIndex = tokens[idx].attrIndex('target');

      if (targetIndex < 0) {
        tokens[idx].attrPush(['target', '_blank']);
      } else {
        tokens[idx].attrs[targetIndex][1] = '_blank';
      }

      return originalRender(tokens, idx, options, env, self);
    };
  }
}
</script>