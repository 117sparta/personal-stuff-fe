<template>
  <div :class="mode === 'NEW' ? 'board-item-new' : 'board-item'">
    <template v-if="mode === 'NORMAL'">
     <header>看板标题</header>
    </template>
    <div v-else class="text">创建新的看板</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class BoardItem extends Vue {
  @Prop({
    type: String,
    default: 'NORMAL'
  }) mode; // 'NEW' | 'NORMAL'
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
  background-color: #eee;
}
.board-item:hover {
  background-color: rgba(238, 238, 238, 0.6);
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
