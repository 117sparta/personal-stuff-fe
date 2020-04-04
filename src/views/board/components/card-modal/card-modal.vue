<template>
  <el-dialog
    :visible="visible"
    @close="handleModalClose"
    width="40%"
    class="card-dialog"
    :close-on-click-modal="false"
    >
    <header slot="title" class="card-title-container">
      <span class="el-icon-tickets block-align-top" style="font-size: 2em; margin-right: 10px;"></span>
      <el-input v-if="showTitleInput" size="medium" v-model="card.title" style="display: inline-block;vertical-align: top; width: 78%; font-size: 1.4em;font-weight: bold;" @blur="handleSaveTitle" @keydown.native.enter="handleSaveTitle"></el-input>
      <span v-else class="block-align-top card-title" @click="handleEditTitle">{{(card && card.title) || ''}}<span class="el-icon-edit" style="margin-left: 12px;"></span></span>
    </header>
    <section class="dialog-container">
      <article class="dialog-left">
        <section style="margin-bottom: 20px;">
          <article style="font-size: 1.3em; font-weight: bold; margin-bottom: 10px;">
            <span class="block-align-middle el-icon-chat-line-square" style="margin-right: 10px;"></span>
            <span class="block-align-middle">描述</span>
          </article>
          <article v-if="!card.description && !showEditContainer" class="description-tip" @click="handleShowEditContainer">点击此处添加详细描述</article>
          <div v-else style="padding-left: 1.3em;">
            <mavon-editor
              :style="{ cursor: 'pointer', minHeight: '30px' }"
              v-model="card.description"
              placeholder="请输入描述"
              :toolbarsFlag="false"
              :boxShadow="defaultOpen !== 'preview'"
              :subfield="false"
              :default-open="defaultOpen"
              :shotCut="false"
              @click.native.stop="handleEnableEditor"></mavon-editor>
            <div style="margin-top: 20px;" v-show="defaultOpen === 'edit'">
              <el-button type="success" size="small" @click="handleSaveCardInfo">保存描述</el-button><el-button type="default" size="small" @click="handleDisableEditor">取消</el-button>
            </div>
          </div>
        </section>
      </article>
      <aside class="dialog-aside">
        <div style="margin-bottom: 4px;">添加到卡片</div>
        <div class="aside-item"><span class="el-icon-document-checked aside-item-icon"></span>清单</div>
        <div class="aside-item"><span class="el-icon-price-tag aside-item-icon"></span>标签</div>
      </aside>
    </section>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import eventBus from '../../eventBus.js';
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import api from '@/api';

@Component({
  components: {
    mavonEditor: mavonEditor.mavonEditor
  }
})
export default class CardModal extends Vue {
  visible: boolean = false;
  card: any = {};
  showEditContainer: boolean = false;
  defaultOpen: string = 'edit'; // 'edit' || 'preview'
  originContent: string = '';
  showTitleInput: boolean = false;

  show (card) {
    this.card = JSON.parse(JSON.stringify(card));
    this.handleQueryCardInfo();
    if (this.card.description) {
      this.showEditContainer = true;
      this.defaultOpen = 'preview';
    }
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
  }

  handleEnableEditor () {
    if (this.defaultOpen !== 'edit') {
      this.originContent = this.card.description;
      this.defaultOpen = 'edit';
    }
  }

  handleDisableEditor () {
    if (!this.card.description) {
      this.showEditContainer = false;
    }
    this.card.description = this.originContent;
    this.defaultOpen = 'preview';
  }

  handleEditTitle () {
    this.originContent = this.card.title;
    this.showTitleInput = true;
  }

  handleSaveTitle () {
    if (this.originContent === this.card.title) {
      this.showTitleInput = false;
      this.originContent = '';
      return;
    }
    this.handleSaveCardInfo();
  }

  handleSaveCardInfo () {
    api.card.updateCard([this.card]).then(() => {
      this.showTitleInput = false;
      this.defaultOpen = 'preview';
      this.originContent = '';
      this.$emit('refreshSingleList', this.card.listId);
      this.handleQueryCardInfo();
    }).catch(err => {
      console.log(err);
    });
  }

  handleQueryCardInfo () {
    api.card.queryCardInfo(this.card.id).then(({ cardInfo }: any) => {
      this.card = cardInfo;
    });
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

.card-title-container {
  font-weight: bold;
}

.card-title {
  font-size: 1.5em;
  cursor: pointer;
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
    width: 180px;
    .aside-item {
      padding: 5px 5px 5px 10px;
      background-color: #ebecf0;
      margin-bottom: 5px;
      color: black;
      border-radius: 2px;
      cursor: pointer;
      &-icon {
        font-size: 1.3em;
        margin-right: 5px;
      }
    }
    .aside-item:hover {
      background-color: #e2e4e9;
    }
  }
}
</style>
