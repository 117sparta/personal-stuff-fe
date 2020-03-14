<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"/>
  </svg>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class SvgIcon extends Vue {
  @Prop({
    type: String,
    default: ''
  }) icon: string;

  @Prop({
    type: String,
    default: ''
  }) className: string;

  get iconName () {
    return `#icon-${this.icon}`;
  }

  get iconClass () {
    if (this.className) {
      return 'svg-icon ' + this.className;
    } else {
      return 'svg-icon';
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
