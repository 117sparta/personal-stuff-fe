<template>
  <div class="board-list">
    <header class="board-list-header">你的看板</header>
    <el-row :gutter="20">
      <el-col :span="4" v-for="i in 7" :key="i">
        <board-item :item="i"></board-item>
      </el-col>
      <el-col :span="4">
        <board-item mode="NEW"></board-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';
import BoardItem from './components/board-item';

@Component({
  components: {
    BoardItem
  }
})
export default class HomeBoard extends Vue {
  boardList = [];
  // TODO 获取所有看板的接口
}
</script>

<style lang="less" scoped>
.board-list {
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  &-header {
    margin-bottom: 16px;
  }
}
</style>
