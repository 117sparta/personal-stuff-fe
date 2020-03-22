<template>
  <div class="list-container">
    <div class="list-title">标题 <span class="el-icon-edit list-title-icon"></span></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class BoardList extends Vue {
}
</script>

<style lang="less" scoped>
.list-container {
  width: 300px;
  background-color: white;
  height: 100%;
  margin-left: 10px;
  overflow: auto;
  border-radius: 5px;
  box-shadow: 0 0 4px #ddd;
  .list-title {
    padding: 10px;
    text-align: left;
    font-size: 1em;
    font-weight: bold;
    &-icon {
      margin-left: 10px;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
    }
    &-icon:hover {
      background-color: rgba(138, 138, 138, 0.5);
    }
  }
}
</style>
