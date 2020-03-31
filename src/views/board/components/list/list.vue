<template>
  <div class="list-container">
    <div v-if="showEditInput">
      <el-input style="white-space: pre-wrap;" ref="title-input" maxlength="14" placeholder="请输入列表标题" v-model="editingTitle" @keydown.native.enter="handleUpdateList" show-word-limit @blur="handleEditCancel"></el-input>
    </div>
    <div v-else class="list-title">{{list.title}}<span class="el-icon-edit list-title-icon" @click="handleEditTitle"></span></div>
    <section class="card-list-container">
      <draggable v-model="cardList">
      </draggable>
    </section>
    <section class="add-card-footer">
      <el-input ref="textarea" v-if="showCardTitleInput" v-model="editingCardTitle" type="textarea" :rows="1" maxlength="46" @keydown.native.enter="handleCreateNewCard" @blur="cancelCreateNewCard"></el-input>
      <article v-else class="add-card-footer-btn" @click="handleAddNewCard">
        <span class="el-icon-plus" style="margin-right: 10px;"></span>添加一个卡片
      </article>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import api from '@/api';
import { Notification } from 'element-ui';
import draggable from 'vuedraggable';

@Component({
  components: {
    draggable
  }
})
export default class BoardList extends Vue {
  @Prop({
    type: Object,
    default: () => ({})
  }) list;

  showEditInput: boolean = false;
  editingTitle: string = '';
  cardList: any[] = [];
  showCardTitleInput: boolean = false;
  editingCardTitle: string = '';

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
        this.$parent.$emit('refreshList');
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
    this.$nextTick(() => {
      const textarea: any = this.$refs.textarea;
      textarea.focus();
    });
  }

  handleCreateNewCard () {
    if (!this.editingCardTitle) {
      this.showCardTitleInput = false;
      return;
    }
    this.showCardTitleInput = false;
    this.editingCardTitle = '';
  }

  cancelCreateNewCard () {
    this.showCardTitleInput = false;
  }
}
</script>

<style lang="less" scoped>
.list-container {
  display: inline-block;
  width: 300px;
  background-color: white;
  max-height: 100%;
  margin-left: 10px;
  padding: 2px;
  overflow: auto;
  border-radius: 5px;
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
      background-color: #eee;
      text-align: center;
      cursor: pointer;
    }
    &-btn:hover {
      background-color: #ddd;
    }
  }
  .card-list-container {
    max-height: 91%;
    overflow: auto;
  }
}
</style>
