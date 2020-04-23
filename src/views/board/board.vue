<template>
  <div style="height: 100%; background-color: #ffffe5;position: relative;">
    <board-header :item="board" @refreshBoard="handleGetBoardInfo" @show-menu="handleShowMenu"></board-header>
    <main :style="`height: 91%;overflow: auto; white-space: nowrap;${showMenu ? 'padding-right: 420px;' : 'padding-right: 20px;'}`">
      <div style="height: 94%; display: inline-block; vertical-align: top;">
        <draggable
          tag="div"
          style="height: 100%;"
          v-model="lists"
          @change="handleListChange"
          @refreshList="handleGetBoardList"
          @refreshSingleList="handleGetList">
          <BoardList v-for="item in lists" :key="item.id" :list="item" :board-id="board.id"></BoardList>
        </draggable>
      </div>
      <div class="new-list-button" @click="handleShowAddPanel" v-show="!showAddPanel">
        <span class="el-icon-plus"></span>
        <span>新建列表</span>
      </div>
      <div class="new-list-panel" v-show="showAddPanel">
        <el-input v-model="listTitle" style="width: 300px;" maxlength="14" show-word-limit placeholder="请输入列表标题"></el-input>
        <div class="button-group">
          <el-button size="small" type="success" @click="handleCreateNewList">确定</el-button>
          <el-button size="small" @click="handleCancelAddList">取消</el-button>
        </div>
      </div>
    </main>
    <card-modal v-if="showCardModal" ref="card-modal" @refreshSingleList="handleGetList" :board-id="board.id"></card-modal>
    <ps-menu v-show="showMenu" @close-menu="handleCloseMenu" :board-id="board.id"
      :has-get-all-lists="hasGetAllLists"
      @searchCard="handleSearchCard($event)"
      @showAllList="handleGetBoardList"></ps-menu>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import BoardHeader from './components/board-header';
import BoardList from './components/list';
import api from '@/api';
import draggable from 'vuedraggable';
import lib from '@/lib';
import eventBus from './eventBus.js';
import CardModal from './components/card-modal';
// import { Board, BoardResponse } from '@/declare/board';
import PsMenu from './components/menu';
import { Notification } from 'element-ui';

@Component({
  components: {
    BoardHeader,
    BoardList,
    draggable,
    CardModal,
    PsMenu
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
  showCardModal: boolean = false;
  showMenu: boolean = false;
  hasGetAllLists: boolean = false;

  @Watch('$route', {
    immediate: true
  })
  onRouteChanged () {
    this.boardId = this.$route.params.boardId;
    const cardId = Number(this.$route.query.cardId);
    if (cardId) {
      this.showCardModal = true;
      this.$nextTick(() => {
        const cardModal: any = this.$refs['card-modal'];
        if (cardModal) {
          cardModal.show({ id: cardId });
        }
      });
    }
    this.handleGetBoardInfo();
  }

  get handleListChange () {
    return lib.debounceDelay(this.handleListOrderChanged, 1500);
  }

  mounted () {
    eventBus.$on('on-close', () => {
      this.showCardModal = false;
    });
    eventBus.$on('on-card-click', (card) => {
      this.showCardModal = true;
      this.$nextTick(() => {
        const cardModal: any = this.$refs['card-modal'];
        if (cardModal) {
          cardModal.show(card);
        }
      });
    });
    eventBus.$on('refreshSingleList', (listId) => {
      this.handleGetList(listId);
    });
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
    api.list.queryAllList(this.board.id).then((res: ListResponse) => {
      res.lists.sort((a: any, b: any) => {
        return a.listOrder - b.listOrder;
      });
      this.hasGetAllLists = true;
      this.lists = res.lists;
    });
  }

  handleGetList (listId) {
    api.list.queryList(this.board.id, listId).then((res: any) => {
      const length = this.lists.length;
      for (let i = 0; i < length; i++) {
        if (this.lists[i].id === listId) {
          this.lists.splice(i, 1, res.list);
          break;
        }
      }
    });
  }

  handleGetBoardInfo () {
    api.board.searchBoard(this.boardId).then((res: BoardResponse) => {
      this.board = res.boardList[0];
      this.handleGetBoardList();
    });
  }

  handleListOrderChanged (e) {
    this.lists.forEach((item: any, index: number) => {
      item.listOrder = index + 1;
    });
    api.list.updateListOrder(this.lists).catch(err => {
      Notification.error('排序出现错误，请刷新重试');
      console.log(err);
    });
  }

  handleShowMenu () {
    this.showMenu = true;
  }

  handleCloseMenu () {
    this.showMenu = false;
  }

  handleSearchCard (keyword: string) {
    api.card.searchCardInBoard(keyword, Number(this.board.id)).then((res: any) => {
      res.lists.sort((a: any, b: any) => {
        return a.listOrder - b.listOrder;
      });
      this.hasGetAllLists = false;
      this.lists = res.lists;
    });
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
