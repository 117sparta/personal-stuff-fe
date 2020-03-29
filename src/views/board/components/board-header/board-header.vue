<template>
  <div class="board-header-container">
    <el-input v-if="showEditInput" style="width: 200px;" v-model="editingTitle" ref="title-input" @keydown.native.enter="handleUpdateBoard" @blur="handleCancelEdit"></el-input>
    <div v-else class="board-title">{{item.title}}<span class="el-icon-edit title-edit" @click="handleShowEditInput"></span></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import api from '@/api';

@Component({})
export default class BoardHeader extends Vue {
  @Prop({
    type: Object,
    default: () => ({})
  }) item;

  showEditInput: boolean = false;
  editingTitle: string = '';

  handleShowEditInput () {
    this.editingTitle = this.item.title;
    this.showEditInput = true;
    this.$nextTick(() => {
      const input: any = this.$refs['title-input'];
      input.focus();
    });
  }

  handleUpdateBoard () {
    if (!this.editingTitle || this.editingTitle === this.item.title) {
      this.showEditInput = false;
      this.editingTitle = '';
      return;
    }
    api.board.updateBoard({ ...this.item, title: this.editingTitle, titleOnly: true }).then(() => {
      this.$emit('refreshBoard');
      this.showEditInput = false;
      this.editingTitle = '';
    });
  }

  handleCancelEdit () {
    this.editingTitle = '';
    this.showEditInput = false;
  }
}
</script>

<style lang="less" scoped>
.board-header {
  &-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 6%;
    padding: 20px;
    .board-title {
      font-size: 1.3em;
      font-weight: bold;
      .title-edit {
        padding: 4px;
        margin-left: 15px;
        cursor: pointer;
        border-radius: 3px;
      }
      .title-edit:hover {
        background-color: rgba(138, 138, 138, 0.5);
      }
    }
  }
}
</style>
