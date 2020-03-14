<template>
  <div class="main-container">
    <ps-header class="ps-header"></ps-header>
    <div class="ps-main">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import PsHeader from '@/components/header';

@Component({
  components: {
    PsHeader
  }
})
export default class MainPage extends Vue {
}
</script>

<style lang="less" scoped>
.main-container {
  position: relative;
  height: 100%;
}
.ps-header {
  height: 5%;
  padding: 5px;
}
.ps-main {
  flex-grow: 1;
}
</style>
