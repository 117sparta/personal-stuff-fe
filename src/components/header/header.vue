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
      <div class="right" style="display: flex;align-items: center;">
        <el-button icon="el-icon-plus" size="small" style="padding: 7px; font-size: 1.1em;" type="default"></el-button>
        <el-button icon="el-icon-info" size="small" style="padding: 7px; font-size: 1.1em;" type="default"></el-button>
        <el-button icon="el-icon-bell" size="small" style="padding: 7px; font-size: 1.1em;" type="default"></el-button>
        <el-popover trigger="manual" :value="popoverIsVisible">
          <section class="user-info-container">
            <header class="user-info-title">用户信息<span class="el-icon-close user-info-close-btn" @click="closeUserInfoPanel"></span></header>
            <article class="user-info-item">
              <el-input
                ref="nickname-input"
                v-if="showNicknameEdit"
                v-model="editingNickname"
                placeholder="请输入用户昵称, 回车确定"
                @keydown.native.enter="handleConfirmEditNickname"
                @blur="handleCancelEditNickname"
                size="mini"
                maxlength="31"
                show-word-limit>
                </el-input>
              <div v-else>
                <span class="user-info-item-label">昵称：</span> {{userInfo.nickname}}
                <span class="el-icon-edit edit-icon" @click="handleEditingNickname"></span>
              </div>
            </article>
            <article class="user-info-item">
              <span class="user-info-item-label">用户Id：</span> {{userInfo.userId}}
            </article>
            <article class="user-info-item">
              <span class="user-info-item-label">帐号：</span> {{userInfo.account}}
            </article>
            <article class="user-info-item">
              <span class="user-info-item-label">注册时间：</span> {{lib.dateToString(userInfo.createdAt)}}
            </article>
            <article class="user-info-button-group">
              <el-button type="danger" size="small" @click="handleLogOut">退出登录</el-button>
            </article>
          </section>
          <el-avatar slot="reference" style="margin-left: 10px" @click.native="handleShowPopover" :size="40" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
        </el-popover>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import api from '@/api';
import lib from '@/lib/index';

@Component({})
export default class Header extends Vue {
  hehe = '';
  lib: any = lib;
  editingNickname: string = '';
  showNicknameEdit: boolean = false;

  popoverIsVisible: boolean = false;

  get boardList () {
    return this.$store.getters['board/boardList'];
  }

  get userInfo () {
    return this.$store.getters['user/userInfo'];
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

  handleLogOut () {
    localStorage.removeItem('token');
    this.$store.dispatch('user/setIsAuth', false);
    this.$router.push({ path: '/login' });
  }

  handleShowPopover () {
    this.popoverIsVisible = true;
  }

  handleEditingNickname () {
    this.editingNickname = this.userInfo.nickname;
    this.showNicknameEdit = true;
    this.$nextTick(() => {
      const input:any = this.$refs['nickname-input'];
      if (input) {
        input.focus();
      }
    });
  }

  handleConfirmEditNickname () {
    api.user.updateUser(this.editingNickname).then((res: any) => {
      if (res.userInfo) {
        res.userInfo.createdAt = lib.dateToString(res.userInfo.createdAt);
        this.$store.dispatch('user/setUserInfo', res.userInfo);
        this.showNicknameEdit = false;
        this.editingNickname = '';
      }
    });
  }

  handleCancelEditNickname () {
    this.editingNickname = '';
    this.showNicknameEdit = false;
  }

  closeUserInfoPanel () {
    this.popoverIsVisible = false;
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
.user-info-container {
  .user-info-title {
    text-align: center;
    font-weight: bold;
    font-size: 1.1em;
    padding: 4px 4px 10px 4px;
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
    position: relative;
    .user-info-close-btn {
      position: absolute;
      top: calc(4px + 0.8em);
      right: 5px;
      transform: translateY(-50%);
      cursor: pointer;
    }
  }
  .user-info-item {
    padding: 4px;
    .edit-icon {
      padding: 4px;
      border-radius: 4px;
      cursor: pointer;
    }
    .edit-icon:hover {
      background-color: #eee;
    }
    &-label {
      font-weight: bold;
      font-size: 0.9em;
      display: inline-block;
      width: 80px;
      text-align: right;
    }
  }
  .user-info-button-group {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
