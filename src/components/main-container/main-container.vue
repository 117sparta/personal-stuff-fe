<template>
  <div class="main-container">
      <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class MainContainer extends Vue {
}
</script>

<style lang="less" scoped>
.main-container {
  background-color: #eee;
}
</style>
