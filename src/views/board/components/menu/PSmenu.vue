<template>
  <div class="menu-container">
    <header class="menu-header">
      <aside class="menu-header-return-btn el-icon-back" v-show="status !== 'SHOW_MENU'" @click="handleFallback"></aside>
      {{computedTitle}}
      <aside @click="handleCloseMenu" class="menu-header-close-btn el-icon-close"></aside>
    </header>
    <main class="menu-main" v-if="status === 'SHOW_MENU'">
      <div class="menu-item" @click="handleShowSearchCardView">
        <span class="el-icon-search menu-item-icon"></span>搜索卡片
      </div>
      <div class="menu-item" @click="handleShowLabelView">
        <span class="el-icon-price-tag menu-item-icon"></span>标签
      </div>
    </main>
    <main class="menu-main" v-else-if="status === 'SHOW_SEARCH'">
      <el-input type="text" @keydown.native.enter="handleSearchCard" placeholder="输入并回车进行搜索"></el-input>
    </main>
    <main class="menu-main" v-else-if="status === 'SHOW_LABEL'">
      <el-popover
        v-for="(item, index) in labelList"
        :key="item.id" :value="editingIndex === index"
        placement="bottom-start"
        trigger="manual"
        :visible-arrow="false">
        <section>
          <header class="popover-header">
            <div class="popover-header-title">编辑标签</div>
            <span class="popover-header-close-icon el-icon-close" @click="editingIndex = -1"></span>
          </header>
          <main class="popover-main">
            <section class="popover-input">
              <header style="margin-bottom: 5px;">内容</header>
              <el-input size="mini" v-model="labelForm.content" placeholder="输入标签内容"></el-input>
            </section>
            <section @click.stop="handleChangeSelectedColor">
              <header style="margin-bottom: 5px;">标签颜色</header>
              <div v-for="(item, index) in colorsList" :data-index="index" :data-bg-color="item" :key="item" :style="{ backgroundColor: item }" class="color-block" :class="{'color-block-selected': colorSelectedIndex === index}"></div>
            </section>
          </main>
          <footer class="popover-footer">
            <el-button type="success" size="mini" @click="handleUpdateLabel">确定</el-button>
            <el-button type="danger" size="mini" @click="handleDeleteLabel">删除</el-button>
          </footer>
        </section>
        <section class="label-container" slot="reference">
          <main :class="`${item.content ? 'label-item' : 'empty-content-label-item'}`" :style="{ backgroundColor: item.color }">{{item.content}}</main><aside class="el-icon-edit label-edit-icon" @click="handleShowLabelEditInput(index)"></aside>
        </section>
      </el-popover>
      <el-popover
        placement="bottom-start"
        trigger="manual"
        :value="showNewLabelInput"
        :visible-arrow="false">
        <section>
          <header class="popover-header">
            <span class="popover-header-title">新建标签</span>
            <span class="popover-header-close-icon el-icon-close" @click="handleCloseNewLabelInput"></span>
          </header>
          <main class="popover-main">
            <section class="popover-input">
              <header style="margin-bottom: 5px;">内容</header>
              <el-input size="mini" placeholder="输入标签内容" v-model="labelForm.content"></el-input>
            </section>
            <section @click.stop="handleChangeSelectedColor">
              <header style="margin-bottom: 5px;">标签颜色</header>
              <div v-for="(item, index) in colorsList" :data-index="index" :data-bg-color="item" :key="item" :style="{ backgroundColor: item }" class="color-block" :class="{'color-block-selected': colorSelectedIndex === index}"></div>
            </section>
          </main>
          <footer class="popover-footer">
            <el-button type="success" size="mini" @click="handleCreateLabel">确定</el-button>
          </footer>
        </section>
        <section class="label-container" slot="reference">
          <main class="new-label-btn" @click="handleShowNewLabelInput">新建标签</main>
        </section>
      </el-popover>
    </main>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { presetColors } from './const';
import { Notification } from 'element-ui';
import api from '@/api';
import STATUS_CODE from '@/api/config/statusCode';

@Component({})
export default class PSMenu extends Vue {
  @Prop({
    type: Number,
    default: 0
  }) boardId;

  status: string = 'SHOW_MENU'; // SHOW_MENU || SHOW_SEARCH || SHOW_LABEL
  isEditingLabel: boolean = false; // 标志是不是已经在编辑标签的状态了
  editingIndex: number = -1; // 正在编辑的标签
  showNewLabelInput: boolean = false; // 是否显示新建标签的输入框
  defaultLabelColor: string = '#ff0000'; // 默认的标签颜色
  colorSelectedIndex: number = -1;
  labelList: any[] = [
    {
      id: 1,
      content: '重要',
      color: 'red'
    },
    {
      id: 2,
      content: '🌟🌟🌟',
      color: 'red'
    },
    {
      id: 3,
      content: '🌟🌟',
      color: 'red'
    },
    {
      id: 4,
      content: '',
      color: 'blue'
    }
  ];

  labelForm: any = {};

  get colorsList () {
    return presetColors;
  }

  get computedTitle () {
    switch (this.status) {
      case 'SHOW_LABEL':
        return '标签';
      case 'SHOW_MENU':
        return '菜单';
      case 'SHOW_SEARCH':
        return '搜索卡片';
      default:
        return '菜单';
    }
  }

  handleCloseMenu () {
    this.$emit('close-menu');
  }

  handleShowSearchCardView () {
    this.status = 'SHOW_SEARCH';
  }

  handleShowLabelView () {
    this.status = 'SHOW_LABEL';
    this.handleQueryLabel();
  }

  handleSearchCard () {
    console.log('search');
  }

  handleFallback () {
    this.status = 'SHOW_MENU';
  }

  handleShowLabelEditInput (index) {
    if (this.showNewLabelInput) this.showNewLabelInput = false;
    this.colorSelectedIndex = this.colorsList.indexOf(this.labelList[index].color);
    this.labelForm = JSON.parse(JSON.stringify(this.labelList[index]));
    this.editingIndex = index;
  }

  handleShowNewLabelInput () {
    if (this.editingIndex !== -1) this.editingIndex = -1;
    this.labelForm = {
      content: '',
      color: '#ff0000'
    };
    this.colorSelectedIndex = this.colorsList.indexOf(this.defaultLabelColor);
    this.showNewLabelInput = true;
  }

  handleCloseNewLabelInput () {
    this.showNewLabelInput = false;
  }

  handleCreateLabel () {
    this.labelForm.content = this.labelForm.content.replace(/<\/?script.*>/g, '');
    api.label.createLabel(this.labelForm, this.boardId).then((res: any) => {
      this.showNewLabelInput = false;
      this.handleQueryLabel();
    });
  }

  handleChangeSelectedColor (e) {
    this.colorSelectedIndex = Number(e.target.dataset.index);
    this.labelForm.color = e.target.dataset.bgColor;
  }

  handleDeleteLabel () {
    api.label.deleteLabel(this.labelForm.id).then((res: any) => {
      if (res.statusCode === STATUS_CODE.SUCCESS) {
        Notification.success('删除成功');
        this.handleQueryLabel();
      } else {
        Notification.warning('删除失败');
      }
    }).catch(() => {
      Notification.error('删除失败');
    });
  }

  handleUpdateLabel () {
    api.label.updateLabel(this.labelForm).then((res: any) => {
      if (res.statusCode === STATUS_CODE.SUCCESS) {
        this.handleQueryLabel();
        Notification.success('更新标签成功');
        this.editingIndex = -1;
      } else {
        Notification.warning('更新失败');
      }
    });
  }

  handleQueryLabel () {
    api.label.queryLabel(this.boardId).then((res: any) => {
      this.labelList = res.labelList;
    });
  }
}
</script>

<style lang="less" scoped>
@keyframes menu-show-up {
  0% {
    right: -300px;
  }
  100% {
    right: 0;
  }
}

.popover-header {
  position: relative;
  padding: 0 0 10px 0;
  border-bottom: 1px solid #eee;
  &-title {
    font-size: 1em;
    text-align: center;
  }
  &-close-icon {
    position: absolute;
    top: 0;
    right: 5px;
    cursor: pointer;
  }
}

.popover-main {
  padding: 10px 0;
  width: 400px;
  white-space: pre-wrap;
  .color-block {
    border-radius: 4px;
    display: inline-block;
    width: 40px;
    height: 20px;
    background-clip: content-box;
    border: 3px solid #ccc;
    padding: 2px;
    margin-right: 4px;
    cursor: pointer;
    &-selected {
      border-color: #66ccff;
    }
  }
}

.popover-input {
  margin-bottom: 10px;
}

.popover-footer {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #eee;
  padding-top: 5px;
}

.menu-container {
  position: absolute;
  right: 0;
  top: 0;
  animation: menu-show-up .5s;
  width: 300px;
  height: 100%;
  background-color: #ffffe5;
  box-shadow: -4px 0 5px #ccc;
  transition: all 1.2s;
  padding: 0 10px;
  .menu-header {
    position: relative;
    text-align: center;
    padding: 10px;
    font-size: 1.2em;
    border-bottom: 1px solid #eee;
    &-return-btn {
      position: absolute;
      left: 0;
      top: 3px;
      padding: 10px;
      text-align: center;
      cursor: pointer;
    }
    &-close-btn {
      position: absolute;
      right: 0;
      top: 3px;
      padding: 10px;
      text-align: center;
      cursor: pointer;
    }
  }
  .menu-main {
    padding: 10px 5px;
    .menu-item {
      &-icon {
        margin-right: 10px;
      }
      padding: 4px 15px;
      border-radius: 4px;
      cursor: pointer;
    }
    .menu-item:hover {
      color: white;
      font-weight: bold;
      background-color: rgba(138, 138, 138, 0.5);
    }
    .label-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
      .empty-content-label-item, .label-item {
        border-radius: 4px;
        font-size: 0.8em;
        font-weight: bolder;
        color: white;
        flex-grow: 1;
        margin-right: 5px;
      }
      .label-item {
        padding: 0.4em;
      }
      .empty-content-label-item {
        padding: 2em 0 0 0;
      }
      .label-edit-icon {
        flex-grow: 0;
        background-color: #eee;
        border-radius: 5px;
        padding: 0.4em;
        cursor: pointer;
      }
      .label-edit-icon:hover {
        background-color: #ddd;
      }
      .label-edit-icon-click-forbidden {
        cursor: not-allowed;
      }
      .new-label-btn {
        padding: 0.4em;
        background-color: #eee;
        border-radius: 4px;
        font-size: 0.9em;
        text-align: center;
        flex-grow: 1;
        cursor: pointer;
      }
      .new-label-btn:hover {
        background-color: #ddd;
      }
    }
  }
}
.menu-show-animation {
  animation: menu-show-up 0.5s;
}
</style>
