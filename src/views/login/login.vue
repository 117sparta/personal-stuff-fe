<template>
  <section class="login-wrapper">
    <img style="margin-top: 70px;width: 80px; height: 80px;" src="../../assets/board.png" />
    <article class="login-form-wrapper">
      <header class="login-form-wrapper-header">请登录</header>
      <main>
        <section class="login-form">
          <el-input size="medium" class="login-form-item-input" type="text" v-model="loginForm.account" placeholder="请输入邮箱"></el-input>
          <el-input size="medium" class="login-form-item-input" type="password" placeholder="请输入密码" v-model="loginForm.password"></el-input>
        </section>
        <el-button style="width: 100%;" type="primary" size="medium">登录</el-button>
      </main>
      <footer style="text-align: left;margin-top: 5px;">
        <el-link type="primary">注册</el-link><span style="font-size: 0.8em; margin: 0 8px;">或者</span><el-link type="primary">重置密码</el-link>
      </footer>
    </article>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class Login extends Vue {
  data () {
    return {
      loginForm: {
        account: '',
        password: ''
      }
    };
  }
}
</script>

<style lang="less" scoped>
.login-wrapper {
  position: relative;
  height: 100%;
  text-align: center;
  .login-form-wrapper {
    position: absolute;
    top: 190px;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    text-align: center;
    box-shadow: 0 0 4px #888;
    padding: 70px 24px 100px 24px;
    border-radius: 6px;
    &-header {
      color: #555;
      font-weight: bolder;
      font-size: 1.3em;
    }
    .login-form {
      text-align: left;
      &-item {
        &-input {
          margin-bottom: 15px;
          background-color: rgba(220, 220, 220, 0.5);
          input.el-input__inner {
            background-color: rgba(220, 220, 220, 0.5);
          }
        }
      }
      margin-top: 25px;
      flex-grow: 1;
    }
    .login-form-icon {
      flex-grow: 0;
      width: 200px;
      height: 250px;
      z-index: -1;
    }
  }
}
</style>
