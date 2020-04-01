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
      @blur="handleBlur"
      placeholder="回车确定"
      @keydown.native.enter="handleCreateNewCard"
    ></el-input>
    <article v-else>{{card && card.title}}</article>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class StuffCard extends Vue {
  @Prop({
    type: Object,
    default: () => ({})
  }) card;

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
    console.log('add new card');
    this.$parent.$emit('on-submit');
  }

  handleBlur () {
    if (!this.editingTitle) {
      this.$parent.$emit('emptyString'); // 提交空字符串事件，提醒父组件我这里不再进行创建了
    } else {
      this.handleCreateNewCard();
    }
  }
}
</script>

<style lang="less" scoped>
.card-container {
  box-shadow: 0 0 4px #ccc;
}
</style>
