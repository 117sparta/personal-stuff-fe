<template>
  <section class="card-container">
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
    ></el-input>
    <article v-else>{{card && card.title}}</article>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import api from '@/api';
import { Notification } from 'element-ui';

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
}

.card-container:hover {
  border: 1px solid #26c9ff;
}
</style>
