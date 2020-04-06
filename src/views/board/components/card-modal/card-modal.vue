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
      <el-input v-if="showTitleInput" type="textarea" size="medium" v-model="card.title" style="display: inline-block;vertical-align: top; width: 78%; font-size: 1.4em;font-weight: bold;" @blur="handleSaveTitle" @keydown.native.enter="handleSaveTitle"></el-input>
      <span v-else class="block-align-top card-title" @click="handleEditTitle">{{(card && card.title) || ''}}<span class="el-icon-edit" style="margin-left: 12px;"></span></span>
    </header>
    <section class="dialog-container">
      <article class="dialog-left">
        <section style="margin-bottom: 20px;">
          <article class="section-title">
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
        <draggable v-model="card.stuffLists" @change="handleUpdateStuffListsOrder">
          <stuff-list-item v-for="item in card.stuffLists" :key="item.id" :list="item" @refreshCard="handleQueryCardInfo"></stuff-list-item>
        </draggable>
      </article>
      <aside class="dialog-aside">
        <div style="margin-bottom: 4px;">添加到卡片</div>
        <el-popover
          trigger="manual"
          placement="bottom-start"
          :visible-arrow="false"
          :value="showNewStuffListPanel">
          <header class="new-stuff-list-panel-header"><span>添加清单到卡片</span><el-button size="small" class="new-stuff-list-panel-header-close-btn" @click="handleCloseNewStuffListPanel">✖️</el-button></header>
          <main class="new-stuff-list-panel-main">
            <el-form ref="form" :model="newStuffList" :inline="true">
              <el-form-item prop="title" :rules="[
                { required: true, trigger: 'blur', message: '请输入清单标题' }
              ]">
                <el-input ref="stuff-input" type="text" size="small" v-model="newStuffList.title" placeholder="请输入清单标题"></el-input>
              </el-form-item>
            </el-form>
          </main>
          <footer><el-button type="success" size="small" @click="handleCreateNewStuffList">确定</el-button></footer>
          <div class="aside-item" slot="reference" @click="handleShowNewStuffListPanel">
            <span class="el-icon-document-checked aside-item-icon"></span>清单
          </div>
        </el-popover>
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
import StuffListItem from './components/stuff-list-item';
import draggable from 'vuedraggable';

interface StuffList {
  id?: number;
  title: string;
  updatedAt?: number | string;
  createdAt?: number | string;
}

@Component({
  components: {
    mavonEditor: mavonEditor.mavonEditor,
    StuffListItem,
    draggable
  }
})
export default class CardModal extends Vue {
  visible: boolean = false;
  card: any = {};
  showEditContainer: boolean = false;
  defaultOpen: string = 'edit'; // 'edit' || 'preview'
  originContent: string = '';
  showTitleInput: boolean = false;
  showNewStuffListPanel: boolean = false;
  newStuffList: StuffList = {
    title: ''
  };

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
      if (cardInfo.stuffLists && Array.isArray(cardInfo.stuffLists)) {
        cardInfo.stuffLists.sort((a, b) => {
          return a.stuffListOrder - b.stuffListOrder;
        });
      }
      this.card = cardInfo;
    });
  }

  handleShowNewStuffListPanel () {
    this.showNewStuffListPanel = true;
    this.$nextTick(() => {
      const stuffListInput: any = this.$refs['stuff-input'];
      stuffListInput.focus();
    });
  }

  handleCloseNewStuffListPanel () {
    this.showNewStuffListPanel = false;
  }

  handleCreateNewStuffList () {
    const form: any = this.$refs.form;
    form.validate((valid: boolean) => {
      if (valid) {
        api.stuffList.createStuffList(this.newStuffList, this.card.id).then(() => {
          this.showNewStuffListPanel = false;
          this.handleQueryCardInfo();
        }).catch(err => {
          console.log(err);
        });
      }
    });
  }

  handleUpdateStuffListsOrder () {
    const stuffLists = this.card.stuffLists;
    stuffLists.forEach((item, index) => {
      item.stuffListOrder = index + 1;
    });
    api.stuffList.updateStuffList(stuffLists).then(() => {
      this.handleQueryCardInfo();
    }).catch(err => {
      console.log(err);
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
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.card-title {
  font-size: 1.5em;
  cursor: pointer;
  margin-right: 18px;
}

.dialog-container {
  color: black;
  display: flex;
  justify-content: space-between;
  align-items: top;
  .dialog-left {
    flex-grow: 1;
    margin-right: 30px;
    .section-title {
      padding-left: 8px;
      font-size: 1.3em;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .description-tip {
      margin-left: 1.1em;
      color: #595959;
      background-color: rgba(243, 243, 243, 0.781);
      border-radius: 4px;
      padding: 20px 0 40px 5px;
      cursor: pointer;
      transition: background-color .3s;
    }
    .description-tip:hover {
      background-color: rgba(240, 240, 240, 1);
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
      background-color: rgba(240, 240, 240, 0.6);
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
      background-color: rgba(230, 230, 230, 0.6);
    }
  }
}

.new-stuff-list-panel {
  &-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    &-close-btn {
      padding: 2px 0 1px 3px;
      text-align: center;
      font-size: 1em;
      border: none;
    }
  }
  &-main {
    margin-top: 12px;
  }
}
</style>
