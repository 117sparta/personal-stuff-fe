<template>
  <div :class="mode === 'NEW' ? 'board-item-new' : 'board-item'">
    <el-dropdown class="more-list">
      <span class="el-dropdown-link">
        <i class="el-icon-more el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit" style="color: #ff6600">编辑</el-dropdown-item>
        <el-dropdown-item icon="el-icon-delete" class="dropdown-align" style="color: red;" @click.native="handleDeleteBoard">删除</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <template v-if="mode === 'NORMAL'">
     <header>{{item.title}}</header>
    </template>
    <div v-else class="text">创建新的看板</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import api from '@/api';
import { Notification } from 'element-ui';

@Component({})
export default class BoardItem extends Vue {
  @Prop({
    type: String,
    default: 'NORMAL'
  }) mode; // 'NEW' | 'NORMAL'

  @Prop({
    type: Object,
    default: () => ({})
  }) item;

  handleDeleteBoard () {
    this.item.id && api.board.deleteBoard(this.item.id).then(() => {
      this.$emit('on-delete');
    }).catch(err => {
      Notification.error({
        title: '错误',
        message: err.message
      });
    });
  }
}
</script>

<style lang="less" scoped>
.board-item, .board-item-new {
  height: 120px;
  padding: 8px;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
}
.board-item {
  position: relative;
  background-color: #eee;
  .more-list {
    display: none;
    position: absolute;
    top: 8px;
    right: 8px;
  }
  .dropdown-align {
    text-align: center;
  }
}
.board-item-new {
  .more-list {
    display: none;
  }
}
.board-item:hover {
  background-color: rgba(238, 238, 238, 0.6);
}
.board-item:hover {
  .more-list {
    display: block;
  }
}
.board-item-new {
  position: relative;
  background-color: rgba(238, 238, 238, 0.4);
  cursor: pointer;
  .text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 60%;
  }
}
.board-item-new:hover {
  background-color: #eee;
}
</style>
