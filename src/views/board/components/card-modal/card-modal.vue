<template>
  <el-dialog
    :visible="visible"
    @close="handleModalClose"
    width="40%"
    class="card-dialog"
    :close-on-click-modal="false"
    >
    <header slot="title">
      <div class="card-title-container">
        <span class="el-icon-tickets block-align-top" style="font-size: 2em; margin-right: 10px;"></span>
        <el-input v-if="showTitleInput" ref="card-title-input" type="textarea" size="medium" v-model="card.title" style="display: inline-block;vertical-align: top; width: 78%; font-size: 1.4em;font-weight: bold;" @blur="handleSaveTitle" @keydown.native.enter="handleSaveTitle"></el-input>
        <span v-else class="block-align-top card-title" @click="handleEditTitle">{{(card && card.title) || ''}}<span class="el-icon-edit" style="margin-left: 12px;"></span></span>
      </div>
      <section style="padding-left: 10px; margin-top: 10px;">
        <article
          v-for="item in card.labelList" :key="item.id"
          :class="`${item.content ? 'header-label-item' : 'header-empty-label-item'}`"
          :style="{ backgroundColor: item.color }">{{item.content}}</article>
      </section>
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
        <el-popover
          trigger="manual"
          placement="bottom-start"
          :visible-arrow="false"
          :value="showLabelPanel">
          <header class="attach-label-panel-header"><span>添加标签到卡片</span><el-button size="small" class="attach-label-panel-header-close-btn" @click="handleCloseLabelPanel">✖️</el-button></header>
          <main class="attach-label-panel-main">
            <section
              style="margin: 5px 0;position: relative;"
              v-for="(item, index) in labelList"
              :key="item.id"
              :class="`${item.content ? 'label-item' : 'empty-content-label-item'}`"
              :style="{ backgroundColor: item.color }"
              @click="handleAttachLabel(item, index)"
              >
              <span>{{item.content}}</span>
              <span v-show="item.isSelected" style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%);" class="el-icon-success"></span>
            </section>
          </main>
          <div class="aside-item" slot="reference" @click="handleShowLabelPanel">
            <span class="el-icon-price-tag aside-item-icon"></span>标签
          </div>
        </el-popover>
        <el-popover
          trigger="manual"
          placement="bottom-start"
          :visible-arrow="false"
          :value="showTimeSelectPanel">
          <header class="attach-label-panel-header"><span>设置过期时间</span><el-button size="small" class="attach-label-panel-header-close-btn" @click="handleCloseTimeSelectPanel">✖️</el-button></header>
          <main class="attach-label-panel-main">
            <el-date-picker
              type="datetime"
              v-model="editingDateTime"
              size="small"
              @change="handleDeadlineChanged"
              placeholder="请选择过期时间">
            </el-date-picker>
          </main>
          <footer style="margin-top: 10px;padding: 10px 0; display: flex; justify-content: space-between;">
            <el-button size="small" type="success" @click="handleUpdateDeadline(false)">确定</el-button>
            <el-button size="small" type="danger" @click="handleUpdateDeadline(true)">移除</el-button>
          </footer>
          <div :class="{'deadline': card.deadline, 'aside-item': !card.deadline }" slot="reference" @click="handleShowTimeSelectPanel">
            <div v-if="card.deadline">{{deadline}}</div>
            <div v-else><span class="el-icon-time aside-item-icon"></span>到期时间</div>
          </div>
        </el-popover>
      </aside>
    </section>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import eventBus from '../../eventBus.js';
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import api from '@/api';
import StuffListItem from './components/stuff-list-item';
import draggable from 'vuedraggable';
import STATUS_CODE from '@/api/config/statusCode';
import { Notification } from 'element-ui';
import lib from '@/lib/index';

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
  @Prop({
    type: Number,
    default: -1
  }) boardId;

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

  editingDateTime: Date = null;

  showLabelPanel: boolean = false;
  labelList: any[] = [];
  showTimeSelectPanel: boolean = false;

  get deadline () {
    return lib.dateToString(this.card.deadline);
  }

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
    this.$nextTick(() => {
      const cardTitleInput: any = this.$refs['card-title-input'];
      if (cardTitleInput) {
        cardTitleInput.focus();
      }
    });
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
      Notification.error('保存卡片信息失败');
      console.log(err);
    });
  }

  handleQueryCardInfo (refreshLabel?: boolean) {
    api.card.queryCardInfo(this.card.id).then(({ cardInfo }: any) => {
      if (cardInfo.stuffLists && Array.isArray(cardInfo.stuffLists)) {
        cardInfo.stuffLists.sort((a, b) => {
          return a.stuffListOrder - b.stuffListOrder;
        });
      }
      this.card = cardInfo;
      if (refreshLabel) {
        this.handleQueryLabel();
      }
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
          Notification.error('创建清单失败');
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
      Notification.error('更新清单顺序失败');
      console.log(err);
    });
  }

  handleShowLabelPanel () {
    this.handleQueryLabel();
    this.showLabelPanel = true;
  }

  handleCloseLabelPanel () {
    this.showLabelPanel = false;
  }

  handleAttachLabel (item) {
    const isDelete = !!item.isSelected;
    api.card.attachLabel(this.card.id, item.id, isDelete).then((res: any) => {
      if (res.statusCode === STATUS_CODE.SUCCESS) {
        this.handleQueryCardInfo(true);
      }
    });
  }

  handleQueryLabel () {
    api.label.queryLabel(this.boardId).then((res: any) => {
      const labelList = res.labelList;
      this.card.labelList.forEach(linkedLabel => {
        for (let i = 0; i < labelList.length; i++) {
          if (linkedLabel.id === labelList[i].id) {
            labelList[i].isSelected = true;
            return;
          }
        }
      });
      this.labelList = labelList;
    });
  }

  handleShowTimeSelectPanel () {
    this.editingDateTime = this.card.deadline;
    this.showTimeSelectPanel = true;
  }

  handleCloseTimeSelectPanel () {
    this.showTimeSelectPanel = false;
  }

  handleDeadlineChanged (nval) {
    if (nval && nval.valueOf() <= Date.now() + 30 * 60 * 1000) {
      Notification.warning({
        title: '不能选择之前的时间',
        message: '至少距离现在30分钟'
      });
      this.editingDateTime = null;
    } else {
      this.editingDateTime = nval;
    }
  }

  handleUpdateDeadline (isRemove) {
    if (isRemove) {
      this.card.deadline = null;
    } else {
      this.card.deadline = lib.dateToString(this.editingDateTime.valueOf());
    }
    api.card.updateCard([this.card]).then(() => {
      this.showTimeSelectPanel = false;
      this.editingDateTime = null;
      this.$emit('refreshSingleList', this.card.listId);
      this.handleQueryCardInfo();
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
    .deadline {
      padding: 5px 5px 5px 10px;
      background-color: rgb(240, 38, 38);
      margin-bottom: 5px;
      color: white;
      border-radius: 2px;
      cursor: pointer;
    }
  }
}

.new-stuff-list-panel, .attach-label-panel {
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
.attach-label-panel {
  &-main {
    margin: 16px 0;
  }
}

.empty-content-label-item, .label-item {
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: bolder;
  color: white;
  width: 200px;
  margin-right: 5px;
  cursor: pointer;
  box-shadow: 0 0 4px #eee;
}
.label-item {
  padding: 0.4em;
}
.empty-content-label-item {
  padding: 2em 0.4em 0 0.4em;
}

.empty-content-label-item:hover, .label-item:hover {
  border: 2px solid #66ccff;
}
.header-label-item, .header-empty-label-item {
  display: inline-block;
  vertical-align: middle;
  margin: 0 5px 5px 0;
  border-radius: 4px;
  font-size: 0.4em;
  font-weight: bolder;
  color: white;
  width: 160px;
  margin-right: 5px;
  box-shadow: 0 0 4px #eee;
}
.header-label-item {
  padding: 5px;
}
.header-empty-label-item {
  padding: 4em 5px 0 5px;
}
</style>
