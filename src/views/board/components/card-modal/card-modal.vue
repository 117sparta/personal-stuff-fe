<template>
  <el-dialog
    :visible="visible"
    @close="handleModalClose"
    width="40%"
    class="card-dialog"
    :close-on-click-modal="false"
    >
    <header slot="title" class="card-title">
      <span class="el-icon-tickets block-align-top" style="font-size: 2em; margin-right: 10px;"></span>
      <span class="block-align-top" style="font-size: 1.5em;">{{(card && card.title) || ''}}</span>
    </header>
    <section class="dialog-container">
      <article class="dialog-left">
        <section style="margin-bottom: 20px;">
          <article style="font-size: 1.3em; font-weight: bold; margin-bottom: 10px;">
            <span class="block-align-middle el-icon-chat-line-square" style="margin-right: 10px;"></span>
            <span class="block-align-middle">描述</span>
          </article>
          <article v-if="!card.description && !showEditContainer" class="description-tip" @click="handleShowEditContainer">点击此处添加详细描述</article>
          <div v-else>
            <article
              contentEditable="true"
              class="edit-container"
              ref="edit-container"
              @blur="handleEditBlur"></article>
            <el-button type="success" size="small">保存描述</el-button><el-button type="default" size="small" @click="showEditContainer = false;">取消</el-button>
          </div>
        </section>
      </article><aside class="dialog-aside">右部分内容</aside>
    </section>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import eventBus from '../../eventBus.js';

@Component({})
export default class CardModal extends Vue {
  visible: boolean = false;
  card: any = {};
  showEditContainer: boolean = false;

  show (card) {
    this.card = JSON.parse(JSON.stringify(card));
    this.visible = true;
  }

  hide () {
    this.visible = false;
    eventBus.$emit('on-close');
  }

  handleModalClose () {
    this.hide();
  }

  handleShowEditContainer () {
    this.showEditContainer = true;
    this.$nextTick(() => {
      const editContainer: any = this.$refs['edit-container'];
      editContainer.focus();
    });
  }

  handleEditBlur () {
    console.log('blur');
  }
}
</script>

<style lang="less" scoped>
.card-dialog {
  .el-dialog__body {
    padding: 10px;
  }
}
.block-align-top {
  display: inline-block;
  vertical-align: top;
}
.block-align-middle {
  display: inline-block;
  vertical-align: middle;
}

.card-title {
  font-weight: bold;
}

.dialog-container {
  display: flex;
  justify-content: space-between;
  align-items: top;
  .dialog-left {
    flex-grow: 1;
    margin-right: 30px;
    .description-tip {
      color: #595959;
      background-color: #eee;
      border-radius: 4px;
      padding: 20px 0 40px 5px;
      cursor: pointer;
      transition: background-color .3s;
    }
    .description-tip:hover {
      background-color: #ccc;
    }
    .edit-container {
      padding: 5px 5px 5px 0;
      border: 4px solid #ddd;
      border-radius: 4px;
      margin-bottom: 10px;
      text-indent: 0.3em;
    }
  }
  .dialog-aside {
    flex-grow: 0;
    width: 150px;
  }
}
</style>
