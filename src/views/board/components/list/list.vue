<template>
  <div class="list-container">
    <div v-if="showEditInput">
      <el-input style="white-space: pre-wrap;" maxlength="14" placeholder="请输入列表标题" v-model="editingTitle" @keydown.native.enter="handleUpdateList"></el-input>
    </div>
    <div v-else class="list-title">{{list.title}}<span class="el-icon-edit list-title-icon" @click="handleEditTitle"></span></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import api from '@/api';
import { Notification } from 'element-ui';

@Component({})
export default class BoardList extends Vue {
  @Prop({
    type: Object,
    default: () => ({})
  }) list;

  showEditInput: boolean = false;
  editingTitle: string = '';

  handleEditTitle () {
    this.editingTitle = this.list.title;
    this.showEditInput = true;
  }

  handleUpdateList () {
    if (this.editingTitle && this.editingTitle !== this.list.title) {
      api.list.createList(this.list.title, this.list.boardId, 'UPDATE').then(() => {
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
}
</script>

<style lang="less" scoped>
.list-container {
  width: 300px;
  background-color: white;
  max-height: 100%;
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
