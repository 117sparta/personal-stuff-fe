<template>
  <div id="app">
    <main-page v-if="isAuth"></main-page>
    <router-view v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import MainPage from '@/views/main-page';
import api from '@/api';
import lib from '@/lib';
import { Notification } from 'element-ui';

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

  get isAuth () {
    return this.$store.getters['user/isAuth'];
  }

  mounted () {
    api.config.getPublicKey().then((res: any) => {
      this.$store.dispatch('key/setPublicKey', res.publicKey);
      const rsaKey = lib.generateRsaKey();
      api.config.getRsaKey(rsaKey).then((res: any) => {
        const word = res.encoded;
        const decodedRsaKey = lib.aesDecrypt(word, rsaKey);
        if (rsaKey === decodedRsaKey) {
          lib.setAesKey(decodedRsaKey);
          this.$store.dispatch('key/setRSAKey', decodedRsaKey);
          const token = localStorage.getItem('token');
          if (token) {
            api.user.queryUserInfo().then((res: any) => {
              this.$store.dispatch('user/setUserInfo', res.userInfo);
            });
          }
        }
      }).catch(err => {
        console.log(err);
        Notification.error('与服务器通信发生错误');
      });
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
