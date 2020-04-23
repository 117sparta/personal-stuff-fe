<template>
  <div class="list-container">
    <div class="flex-container">
    <div v-if="showEditInput">
      <el-input style="font-size: 1em; font-weight: bolder;margin-top: 2px;" ref="title-input" maxlength="14" placeholder="请输入列表标题" v-model="editingTitle" @keydown.native.enter="handleUpdateList" show-word-limit @blur="handleEditCancel"></el-input>
    </div>
    <div v-else class="list-title">
      <span>{{list.title}}</span><span class="el-icon-edit list-title-icon" @click="handleEditTitle"></span>
      <el-dropdown class="more-list" trigger="hover" placement="bottom-end">
        <span class="el-icon-more el-dropdown-link" @click.stop></span>
        <el-dropdown-menu>
          <el-dropdown-item style="color: red;" @click.native="handleDeleteList"><span class="el-icon-delete" style="margin-right: 4px;"></span><span>删除</span></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <section class="card-list-container">
      <draggable tag="div"
        style="max-height: 100%; overflow: auto;"
        group="stuffcard" v-model="cardList"
        @emptyString="handleCardTitleEditCancel"
        ref="card-list"
        @change="handleCardListChanged"
        @on-submit="handleRefreshList"
        >
        <stuff-card v-for="item in cardList" :card="item" :key="item.id" :board-id="boardId" :list-id="list.id"></stuff-card>
      </draggable>
    </section>
    <section class="add-card-footer">
      <article class="add-card-footer-btn">
        <div v-if="showCardTitleInput" style="text-align: left;">
          <el-button type="default" size="medium" @click="handleCardTitleEditCancel">取消</el-button>
        </div>
        <div v-else @click="handleAddNewCard">
          <span class="el-icon-plus" style="margin-right: 10px;"></span>添加一个卡片
        </div>
      </article>
    </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import api from '@/api';
import { Notification } from 'element-ui';
import draggable from 'vuedraggable';
import StuffCard from '../stuff-card';

@Component({
  components: {
    draggable,
    StuffCard
  }
})
export default class BoardList extends Vue {
  @Prop({
    type: Object,
    default: () => ({})
  }) list;

  @Prop({
    type: [String, Number],
    default: ''
  }) boardId;

  showEditInput: boolean = false;
  editingTitle: string = '';
  cardList: any[] = [];
  showCardTitleInput: boolean = false;

  @Watch('list', {
    immediate: true
  })
  onListChanged () {
    this.list.cardList.sort((a, b) => {
      return a.cardOrder - b.cardOrder;
    });
    this.cardList = this.list.cardList;
  }

  handleEditTitle () {
    this.editingTitle = this.list.title;
    this.showEditInput = true;
    this.$nextTick(() => {
      const inputEle: any = this.$refs['title-input'];
      inputEle.focus();
    });
  }

  handleEditCancel () {
    this.showEditInput = false;
    this.editingTitle = '';
  }

  handleUpdateList () {
    if (this.editingTitle && this.editingTitle !== this.list.title) {
      api.list.createList(this.editingTitle, this.list.boardId, 'UPDATE', this.list.id).then(() => {
        this.$parent.$emit('refreshSingleList', this.list.id);
        this.showEditInput = false;
        this.editingTitle = '';
      }).catch((err) => {
        this.showMsg('error', {
          message: err.message,
          title: '错误'
        });
      });
    } else {
      this.showEditInput = false;
      this.editingTitle = '';
    }
  }

  handleRefreshList () {
    this.showCardTitleInput = false;
    this.$parent.$emit('refreshSingleList', this.list.id); // 刷新列表
  }

  showMsg (type: string, message: any = { duration: 0 }) {
    Notification[type](message);
  }

  handleAddNewCard () {
    this.showCardTitleInput = true;
    this.cardList.push({
      id: 0,
      title: '',
      status: 'CREATE',
      description: '',
      deadline: null
    });
    const cardList: any = this.$refs['card-list'];
    cardList.scrollTop = 10000;
  }

  handleCardTitleEditCancel () {
    this.showCardTitleInput = false;
    this.cardList.pop();
  }

  handleCardCreated () {
    this.showCardTitleInput = false;
    this.$parent.$emit('refreshSingleList', this.list.id);
  }

  handleCardListChanged (e) {
    if (e.removed) return;
    this.cardList.forEach((item: any, index: number) => {
      item.cardOrder = index + 1;
    });
    api.card.updateCard(this.cardList).catch(err => {
      Notification.error('更新卡片顺序失败');
      console.log(err);
    });
    if (e.added) {
      api.card.updateCard([e.added.element], this.list.id).catch(err => {
        Notification.error('移动卡片失败');
        console.log(err);
      });
    }
  }

  handleDeleteList () {
    api.list.deleteList(this.list.id).then(() => {
      this.$parent.$emit('refreshList');
    });
  }
}
</script>

<style lang="less" scoped>
.list-container {
  display: inline-block;
  width: 300px;
  height: 100%;
  margin-left: 10px;
  overflow: auto;
  border-radius: 5px;
  vertical-align: top;
  .flex-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-height: 99%;
    box-shadow: 0 0 4px #ddd;
    border-radius: 5px;
    background-color: #eee;
    padding: 2px;
    .list-title {
      position: relative;
      flex-grow: 0;
      padding: 10px 8px;
      text-align: left;
      font-size: 1em;
      font-weight: bold;
      .more-list {
        display: none;
        position: absolute;
        top: 0;
        right: 0;
        padding: 2px 4px;
        border-radius: 2px;
        cursor: pointer;
      }
      .more-list:hover {
        background-color: white;
      }
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
    .list-title:hover {
      .more-list {
        display: inline;
      }
    }
    .add-card-footer {
      flex-grow: 0;
      &-btn {
        color: #aaa;
        padding: 4px;
        border-radius: 2px;
        background-color: white;
        text-align: center;
        cursor: pointer;
      }
      &-btn:hover {
        background-color: rgba(254, 254, 254, 0.7);
      }
    }
    .card-list-container {
      flex-grow: 1;
      overflow: auto;
      padding: 0 6px;
    }
  }
}
</style>
