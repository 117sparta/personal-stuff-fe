<template>
  <section class="header-container">
    <div class="header-container-cover">
      <div class="left">
        <el-button type="default" size="small">
          <span class="el-icon-house"></span><span style="font-size: 0.6em;">主页</span></el-button>
        <el-button class="el-icon-menu" type="default" size="small">
          <span style="font-size: 0.6em;">看板</span>
        </el-button>
        <el-input suffix-icon="el-icon-search" style="width: 40%; margin-left: 10px; color: blue;" size="small" v-model="hehe"></el-input>
      </div>
      <div class="right">
        <el-button icon="el-icon-plus" size="small" style="padding: 7px; font-size: 1.1em;" type="default"></el-button>
        <el-button icon="el-icon-info" size="small" style="padding: 7px; font-size: 1.1em;" type="default"></el-button>
        <el-button icon="el-icon-bell" size="small" style="padding: 7px; font-size: 1.1em;" type="default"></el-button>
        <el-avatar style="margin-left: 10px" :size="30" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class Header extends Vue {
  hehe = '';
}
</script>

<style lang="less" scoped>
.header {
  &-container {
    position: relative;
    background-color: #0099ff;
    &-cover {
      position: absolute;
      display: flex;
      justify-content: space-between;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      .left, .right {
        width: 50%;
        height: 100%;
        display: flex;
        align-items: center;
      }
      .left {
        margin-left: 5px;
        justify-content: flex-start;
      }
      .right {
        margin-right: 5px;
        justify-content: flex-end;
      }
    }
  }
}
</style>
