<template>
  <div class="board-list">
    <header class="board-list-header">你的看板</header>
    <el-row :gutter="20">
      <el-col :span="4" v-for="item in boardList" :key="item.id">
        <board-item :item="item" @on-delete="handleBoardItemDeleted"></board-item>
      </el-col>
      <el-col :span="4">
        <board-item mode="NEW" @click.native="handleShowBoardModal(null, 'CREATE')"></board-item>
      </el-col>
    </el-row>
    <board-modal
      v-if="showBoardModal"
      ref="modal"
      @on-close="handleModalClose"
      @on-submit="handleModalSubmit"
    ></board-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import BoardItem from './components/board-item';
import BoardModal from './components/modal';
import api from '@/api';
import { Notification } from 'element-ui';
import { BoardResponse } from '@/declare/board';

@Component({
  components: {
    BoardItem,
    BoardModal
  }
})
export default class HomeBoard extends Vue {
  boardList = [];
  showBoardModal = false;

  handleGetBoardList (title?: string) {
    api.board.queryBoardList(title).then(({ boardList }: BoardResponse) => {
      this.boardList = boardList;
      this.$store.dispatch('board/setBoardList', boardList);
    }).catch(err => {
      Notification.error({
        title: '错误',
        message: err.message
      });
    });
  }

  handleShowBoardModal (board, status) {
    this.showBoardModal = true;
    this.$nextTick(() => {
      const modal: any = this.$refs.modal;
      modal.show(board, status);
    });
  }

  handleModalClose () {
    this.showBoardModal = false;
  }

  handleModalSubmit () {
    this.showBoardModal = false;
    this.handleGetBoardList();
  }

  handleBoardItemDeleted () {
    this.handleGetBoardList(); // 刷新后重新加载看板列表
  }

  mounted () {
    this.handleGetBoardList();
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
