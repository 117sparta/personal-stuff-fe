<template>
  <div class="list-container">
    <div v-if="showEditInput">
      <el-input style="white-space: pre-wrap;" ref="title-input" maxlength="14" placeholder="请输入列表标题" v-model="editingTitle" @keydown.native.enter="handleUpdateList" show-word-limit @blur="handleEditCancel"></el-input>
    </div>
    <div v-else class="list-title">{{list.title}}<span class="el-icon-edit list-title-icon" @click="handleEditTitle"></span></div>
    <section class="card-list-container">
      <draggable tag="div"
        style="max-height: 100%; overflow: auto;"
        group="stuffcard" v-model="cardList"
        @emptyString="handleCardTitleEditCancel"
        ref="card-list"
        @start="handleDragStart"
        @end="handleDragEnd"
        @update="handleDragUpdate"
        @on-submit="handleCardCreated">
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

  handleDragStart () {
    console.log('dragStart: ' + this.list.title);
  }

  handleDragEnd () {
    console.log('dragEnd: ' + this.list.title);
  }

  handleDragUpdate () {
    console.log('dragUpdated: ' + this.list.title);
  }
}
</script>

<style lang="less" scoped>
.list-container {
  display: inline-block;
  width: 300px;
  background-color: #eee;
  max-height: 100%;
  margin-left: 10px;
  padding: 2px;
  overflow: auto;
  border-radius: 5px;
  vertical-align: top;
  box-shadow: 0 0 4px #ddd;
  .list-title {
    padding: 10px 8px;
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
  .add-card-footer {
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
    max-height: 91%;
    overflow: auto;
    padding: 0 6px;
  }
}
</style>
