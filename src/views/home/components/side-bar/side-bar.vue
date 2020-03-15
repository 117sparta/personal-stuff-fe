<template>
  <el-menu router style="height: 100%;" :default-active="defaultActive">
    <el-menu-item index="/home/board"><span class="el-icon-date"></span>看板</el-menu-item>
    <el-menu-item index="/home/message-box"><span class="el-icon-house"></span>主页</el-menu-item>
  </el-menu>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class SideBar extends Vue {
  defaultActive = '/home/board';
}
</script>
