<template>
  <section class="card-container" @click="handleShowCardModal">
    <el-input
      ref="title-input"
      v-if="showTitleInput"
      v-model="editingTitle"
      type="textarea"
      maxlength="46"
      show-word-limit
      rows="2"
      placeholder="回车确定新建"
      @keydown.native.enter="handleCreateNewCard"
      @click.native.stop
    ></el-input>
    <article style="position: relative; white-space: pre-wrap;" v-else>
      <span>{{card && card.title}}</span>
      <el-dropdown class="more-list" trigger="hover" placement="bottom-end">
        <span class="el-icon-more el-dropdown-link" @click.stop></span>
        <el-dropdown-menu>
          <el-dropdown-item style="color: red;" @click.native="handleDeleteCard"><span class="el-icon-delete" style="margin-right: 4px;"></span><span>删除</span></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </article>
    <article class="status-bar">
      <span v-if="card.description" class="el-icon-chat-line-square status" :key="1"></span>
      <span v-if="card.deadline" :key="2"></span>
    </article>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import api from '@/api';
import { Notification } from 'element-ui';
import eventBus from '../../eventBus.js';

@Component({})
export default class StuffCard extends Vue {
  @Prop({
    type: Object,
    default: () => ({})
  }) card;

  @Prop({
    type: [String, Number],
    default: ''
  }) boardId;

  @Prop({
    type: [String, Number],
    default: ''
  }) listId;

  showTitleInput: boolean = false;
  editingTitle = '';

  mounted () {
    if (this.card.status) {
      this.showTitleInput = true;
      this.editingTitle = '';
      this.$nextTick(() => {
        const input: any = this.$refs['title-input'];
        input.focus();
      });
      delete this.card.status;
    }
  }

  handleCreateNewCard () {
    if (!this.editingTitle) {
      this.$parent.$emit('emptyString');
      return;
    }
    api.card.createCard({ boardId: this.boardId, listId: this.listId, title: this.editingTitle, description: '', deadline: null }).then(() => {
      this.showTitleInput = false;
      this.$parent.$emit('on-submit');
      Notification.success({
        title: '新建成功',
        message: ''
      });
    }).catch(err => {
      console.log(err);
    });
  }

  handleShowCardModal () {
    eventBus.$emit('on-card-click', this.card);
  }

  handleDeleteCard () {
    api.card.deleteCard(this.card.id).then(() => {
      eventBus.$emit('refreshSingleList', this.card.listId);
    });
  }
}
</script>

<style lang="less" scoped>
.card-container {
  box-shadow: 0 0 4px #ccc;
  padding: 4px;
  background-color: white;
  margin: 7px 0;
  border-radius: 3px;
  box-shadow: 0 1px 2px #ccc;
  cursor: pointer;
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
    background-color: #eee;
  }
  .status-bar {
    color: #999;
    margin-top: 5px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    .status {
      margin: 3px 6px;
    }
  }
}

.card-container:hover {
  border: 1px solid #26c9ff;
  .more-list {
    display: inline;
  }
}
</style>
