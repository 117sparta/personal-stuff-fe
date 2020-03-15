<template>
  <div class="board-list">
    <header class="board-list-header">你的看板</header>
    <el-row :gutter="20">
      <el-col :span="4" v-for="i in 7" :key="i">
        <board-item :item="i"></board-item>
      </el-col>
      <el-col :span="4">
        <board-item mode="NEW" @click.native="handleShowBoardModal"></board-item>
      </el-col>
    </el-row>
    <board-modal
      v-if="showBoardModal"
      ref="modal"
      @on-close="handleModalClose"
    ></board-modal>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';
import BoardItem from './components/board-item';
import BoardModal from './components/modal';

@Component({
  components: {
    BoardItem,
    BoardModal
  }
})
export default class HomeBoard extends Vue {
  boardList = [];
  showBoardModal = false;
  // TODO 获取所有看板的接口

  handleShowBoardModal () {
    this.showBoardModal = true;
    this.$nextTick(() => {
      const modal = this.$refs.modal;
      modal.show();
    });
  }

  handleModalClose () {
    this.showBoardModal = false;
  }
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
