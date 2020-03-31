<template>
  <div style="height: 100%; background-color: #d6f5f5;">
    <board-header :item="board" @refreshBoard="handleGetBoardInfo"></board-header>
    <main style="height: 91%;overflow: auto;">
      <div style="height: 94%; display: inline-block; vertical-align: top;">
        <draggable tag="div" style="height: 100%;" v-model="lists" @change="handleListChange" @refreshList="handleGetBoardList" @start="handleListDragStart" @end="handleListDragEnd">
          <BoardList v-for="item in lists" :key="item.id" :list="item"></BoardList>
        </draggable>
      </div>
      <div class="new-list-button" @click="handleShowAddPanel" v-show="!showAddPanel">
        <span class="el-icon-plus"></span>
        <span>新建列表</span>
      </div>
      <div class="new-list-panel" v-show="showAddPanel">
        <el-input v-model="listTitle" style="width: 300px;" maxlength="14" placeholder="请输入列表标题"></el-input>
        <div class="button-group">
          <el-button size="small" type="success" @click="handleCreateNewList">确定</el-button>
          <el-button size="small" @click="handleCancelAddList">取消</el-button>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import BoardHeader from './components/board-header';
import BoardList from './components/list';
import api from '@/api';
import draggable from 'vuedraggable';
import lib from '@/lib';
// import { Board, BoardResponse } from '@/declare/board';
// import { List, ListResponse } from '@/declare/list';

@Component({
  components: {
    BoardHeader,
    BoardList,
    draggable
  }
})
export default class PSBoard extends Vue {
  showAddPanel = false;
  listTitle = '';
  boardId = '';
  board: Board = {
    createdAt: '',
    updatedAt: '',
    title: '',
    boardId: ''
  };

  lists: List[] = [];

  @Watch('$route', {
    immediate: true
  })
  onRouteChanged () {
    this.boardId = this.$route.params.boardId;
    this.handleGetBoardInfo();
  }

  get handleListChange () {
    return lib.debounceDelay(this.handleListOrderChanged, 2000);
  }

  handleShowAddPanel () {
    this.showAddPanel = true;
  }

  handleCancelAddList () {
    this.listTitle = '';
    this.showAddPanel = false;
  }

  handleCreateNewList () {
    api.list.createList(this.listTitle, this.board.id, 'CREATE').then(res => {
      this.showAddPanel = false;
      this.listTitle = '';
      this.handleGetBoardList();
    });
  }

  handleGetBoardList () {
    api.list.queryList(this.board.id).then((res: ListResponse) => {
      this.lists = res.lists;
    });
  }

  handleGetBoardInfo () {
    api.board.searchBoard(this.boardId).then((res: BoardResponse) => {
      this.board = res.boardList[0];
      this.handleGetBoardList();
    });
  }

  handleListOrderChanged () {
    console.log('changed');
  }

  handleListDragStart () {

  }

  handleListDragEnd () {

  }
}
</script>

<style lang="less" scoped>
.new-list-button, .new-list-panel {
  color: white;
  margin-left: 10px;
  display: inline-block;
  vertical-align: top;
  width: 300px;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 5px;
  border-radius: 4px;
  font-weight: bold;
}
.new-list-button {
  cursor: pointer;
  text-align: center;
}
.new-list-button:hover {
  background-color: rgba(0, 0, 0, 0.4);
}
.new-list-button span:first-child {
  margin-right: 10px;
}
.new-list-panel {
  .button-group {
    margin-top: 10px;
  }
}
</style>
