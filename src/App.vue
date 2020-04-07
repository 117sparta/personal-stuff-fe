<template>
  <div id="app">
    <main-page></main-page> <!-- TODO 当加入登录机制之后，这边要进行条件判断 -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import MainPage from '@/views/main-page';
import api from '@/api';

@Component({
  components: {
    MainPage
  }
})
export default class App extends Vue {
  @Watch('$route', {
    immediate: true
  })
  onRouteChanged () {
    if (this.$route.meta.title) {
      document.title = this.$route.meta.title;
    }
  }

  mounted () {
    api.config.getPublicKey().then((res: any) => {
      this.$store.dispatch('key/setPublicKey', res.publicKey);
    });
  }
}
</script>

<style lang="less">
html, body {
  height: 100%;
  overflow: hidden;
  padding: 0;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  overflow: auto;
}
</style>
