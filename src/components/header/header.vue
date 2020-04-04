<template>
  <section class="header-container">
    <div class="header-container-cover">
      <div class="left">
        <el-button type="default" size="small" @click="handleBackHome">
          <span class="el-icon-house" style="font-size: 1.1em;"></span>
        </el-button>
        <el-dropdown trigger="click" style="margin-left: 10px;">
          <el-button class="el-icon-menu el-dropdown-link" type="default" size="small">
            <span style="font-size: 0.6em;">看板</span>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in boardList" icon="el-icon-date" :key="item.id" @click.native.stop="handleGoToBoard(item)">{{item.title}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-input suffix-icon="el-icon-search" style="width: 40%; margin-left: 10px; color: blue;" size="small" v-model="hehe"></el-input>
      </div>
      <div class="right">
        <el-button icon="el-icon-plus" size="small" style="padding: 7px; font-size: 1.1em;" type="default"></el-button>
        <el-button icon="el-icon-info" size="small" style="padding: 7px; font-size: 1.1em;" type="default"></el-button>
        <el-button icon="el-icon-bell" size="small" style="padding: 7px; font-size: 1.1em;" type="default"></el-button>
        <el-avatar style="margin-left: 10px" :size="30" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import api from '@/api';

@Component({})
export default class Header extends Vue {
  hehe = '';

  get boardList () {
    return this.$store.getters['board/boardList'];
  }

  mounted () {
    api.board.queryBoardList().then(({ boardList }: BoardResponse) => {
      this.$store.dispatch('board/setBoardList', boardList);
    });
  }

  handleBackHome () {
    if (this.$route.fullPath !== '/home/board') {
      this.$router.push({ path: '/home/board' });
    }
  }

  handleGoToBoard (board) {
    const reg = new RegExp(`${board.boardId}`, 'gi');
    if (!reg.test(this.$route.fullPath)) {
      this.$router.push({ path: '/board/' + board.boardId });
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  &-container {
    position: relative;
    background-color: #0099ff;
    &-cover {
      position: absolute;
      display: flex;
      justify-content: space-between;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      .left, .right {
        width: 50%;
        height: 100%;
        display: flex;
        align-items: center;
      }
      .left {
        margin-left: 5px;
        justify-content: flex-start;
      }
      .right {
        margin-right: 5px;
        justify-content: flex-end;
      }
    }
  }
}
</style>
