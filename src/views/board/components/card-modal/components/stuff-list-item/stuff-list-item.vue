<template>
  <section style="margin-bottom: 20px;">
    <article class="section-title">
      <span class="el-icon-document-checked" style="margin-right: 10px;"></span>
      <div style="flex-grow: 1;">
        <el-input
          style="display: inline-block; vertical-align: top; width: 80%;"
          v-if="showTitleInput"
          type="text"
          maxlength="32"
          show-word-limit
          v-model="list.title"
          size="small"
          ref="title-input"
          @blur="handleUpdateStuffList"
          @keydown.enter.native="handleUpdateStuffList"
        ></el-input>
        <span v-else class="block-align-middle" style="cursor: pointer;" @click="handleShowTitleInput">{{list.title}}</span>
      </div>
      <div><button class="section-title-delete-button" @click.stop="handleDeleteStuffList">删除</button></div>
    </article>
    <article class="stuff-list-checkbox-container">
      <draggable v-model="list.stuffListItems" @change="handleStuffListItemOrderChanged">
        <div class="stuff-list-checkbox" v-for="(item, index) in list.stuffListItems" :key="item.id">
          <div
            :class="['stuff-list-checkbox-left', (item.isChecked ? 'stuff-list-checkbox-left-active' : '')]"
            @click="handleCheckboxClicked($event, list, index)"
          >{{item.isChecked ? '✔' : ''}}</div>
          <div :class="`stuff-list-checkbox-right ${item.isChecked ? 'stuff-list-checkbox-right-active' : ''}`">{{item.text}}
            <span class="el-icon-delete stuff-list-checkbox-right-delete" size="mini" @click.stop="handleDeleteStuffListItem($event, item)"></span>
          </div>
        </div>
      </draggable>
      <section class="stuff-list-add-item">
        <article v-if="showAddStuffListItemInput">
          <el-input style="font-size: 1.1em;" type="textarea" v-model="newStuffListItemText" maxlength="36" show-word-limit ref="new-stuff-list-item-input" :rows="1"></el-input>
          <section class="btn-group">
            <el-button type="success" size="small" @click="handleCreateNewStuffItem">保存项目</el-button>
            <el-button class="el-icon-close" circle size="small" @click="handleCancelCreateNewStuffItem"></el-button>
          </section>
        </article>
        <button v-else class="stuff-list-add-item-button" @click="handleShowAddNewStuffItemInput">添加项目</button>
      </section>
    </article>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import draggable from 'vuedraggable';
import api from '@/api';

@Component({
  components: {
    draggable
  }
})
export default class StuffListItem extends Vue {
  @Prop({
    type: Object,
    default: {}
  }) list;

  showAddStuffListItemInput: boolean = false;
  newStuffListItemText: string = '';
  showTitleInput: boolean = false;
  originalContent: string = '';

  @Watch('list', {
    immediate: true
  })
  onListChanged () {
    this.list.stuffListItems.sort((a, b) => {
      return a.listItemOrder - b.listItemOrder;
    });
  }

  handleCheckboxClicked (_, list, index) {
    const item = list.stuffListItems[index];
    item.isChecked = !item.isChecked;
    api.stuffList.updateStuffListItems([item]).then(() => {
      this.$emit('refreshCard');
    }).catch(err => {
      console.log(err);
    });
  }

  handleShowAddNewStuffItemInput () {
    this.showAddStuffListItemInput = true;
    this.newStuffListItemText = '';
    this.$nextTick(() => {
      const newStuffListItemInput: any = this.$refs['new-stuff-list-item-input'];
      newStuffListItemInput.focus();
    });
  }

  handleCreateNewStuffItem () {
    api.stuffList.createStuffListItem({ text: this.newStuffListItemText, isChecked: false }, this.list.id).then(() => {
      this.showAddStuffListItemInput = false;
      this.newStuffListItemText = '';
      this.$emit('refreshCard');
    }).catch(err => {
      console.log(err);
    });
  }

  handleCancelCreateNewStuffItem () {
    this.showAddStuffListItemInput = false;
    this.newStuffListItemText = '';
  }

  handleStuffListItemOrderChanged () {
    const stuffListItems = this.list.stuffListItems;
    stuffListItems.forEach((item, index) => {
      item.listItemOrder = index + 1;
    });
    api.stuffList.updateStuffListItems(stuffListItems).then(() => {
      this.$emit('refreshCard');
    });
  }

  handleDeleteStuffListItem (_, item) {
    api.stuffList.deleteStuffListItem(item.id).then(() => {
      this.$emit('refreshCard');
    }).catch(err => {
      console.log(err);
    });
  }

  handleDeleteStuffList () {
    api.stuffList.deleteStuffList(this.list.id).then(() => {
      this.$emit('refreshCard');
    }).catch(err => {
      console.log(err);
    });
  }

  handleShowTitleInput () {
    this.showTitleInput = true;
    this.originalContent = this.list.title;
    this.$nextTick(() => {
      const titleInput: any = this.$refs['title-input'];
      if (titleInput) {
        titleInput.focus();
      }
    });
  }

  handleUpdateStuffList () {
    api.stuffList.updateStuffList([this.list]).then(() => {
      this.$emit('refreshCard');
      this.showTitleInput = false;
      this.originalContent = '';
    }).catch(err => {
      console.log(err);
    });
  }

  handleCancelUpdateTitle () {
    this.list.title = this.originalContent;
    this.showTitleInput = false;
  }
}
</script>

<style lang="less" scoped>
.block-align-middle {
  display: inline-block;
  vertical-align: middle;
}
.section-title {
  padding-left: 8px;
  font-size: 1.3em;
  font-weight: bold;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &-delete-button {
    font-size: 0.6em;
    padding: 8px 12px;
    border-radius: 4px;
    box-shadow: 0 0 2px #eee;
    cursor: pointer;
    background-color: rgba(240, 240, 240, 0.781);
    outline: none;
    border: none;
    transition: all .3s;
  }
  &-delete-button:hover {
    background-color: rgba(230, 230, 230, 1);
  }
}
.stuff-list-checkbox-container {
  .stuff-list-checkbox {
    border-radius: 4px;
    box-shadow: 0 0 4px white;
    padding: 8px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: row;
    transition: all .3s;
    &-left, &-left-active {
      width: 14px;
      height: 14px;
      border: 2px solid #ccc;
      flex-grow: 0;
      cursor: pointer;
      transition: background-color .6s;
    }
    &-left-active {
      width: 18px;
      height: 18px;
      border: none;
      background-color: rgba(0, 191, 255, 0.6);
      text-align: center;
      line-height: 1.5;
    }
    &-left:hover {
      background-color: #eee;
    }
    &-left-active:hover {
      background-color: #33ccff;
    }
    &-right {
      margin-left: 13px;
      font-size: 1.1em;
      flex-grow: 1;
      transition: all .4s;
      position: relative;
      &-delete {
        display: none;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        padding: 5px;
        color: red;
        border-radius: 2px;
        cursor: pointer;
      }
      &-delete:hover {
        background-color: rgb(230, 230, 230);
      }
    }
    &-right-active {
      text-decoration: line-through;
    }
  }
  .stuff-list-checkbox:hover {
    background-color: rgba(243, 243, 243, 0.781);
    cursor: pointer;
    .stuff-list-checkbox-right-delete {
      display: inline;
    }
  }
  .stuff-list-add-item {
    padding-left: 31px;
    .btn-group {
      margin-top: 10px;
    }
    &-button {
      font-size: 0.9em;
      padding: 8px 12px;
      border-radius: 4px;
      box-shadow: 0 0 2px #eee;
      cursor: pointer;
      background-color: rgba(240, 240, 240, 0.781);
      outline: none;
      border: none;
      transition: all .3s;
      margin-top: 10px;
    }
    &-button:hover {
      background-color: rgba(230, 230, 230, 1);
    }
  }
}
</style>
