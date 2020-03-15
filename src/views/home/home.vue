<template>
  <main-container>
    <el-container style="height: 100%; overflow: auto;">
      <el-aside width="400px" style="padding-left: 150px;">
        <side-bar></side-bar>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </main-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import MainContainer from '@/components/main-container';
import SideBar from './components/side-bar';

@Component({
  components: {
    MainContainer,
    SideBar
  }
})
export default class Home extends Vue {
}
</script>
