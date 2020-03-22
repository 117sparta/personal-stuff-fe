<template>
  <div class="board-header-container">
    <div class="board-title">{{item.title}}<span class="el-icon-edit title-edit"></span></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class BoardHeader extends Vue {
  @Prop({
    type: Object,
    default: () => ({})
  }) item;
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
