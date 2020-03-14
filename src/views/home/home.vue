<template>
  <main-container>
    <el-container style="height: 100%; overflow: auto;">
      <el-aside width="200px" style="background-color: red"></el-aside>
      <el-main style="background-color: black;">
        <router-view />
      </el-main>
    </el-container>
  </main-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import MainContainer from '@/components/main-container';

@Component({
  components: {
    MainContainer
  }
})
export default class Home extends Vue {
}
</script>
