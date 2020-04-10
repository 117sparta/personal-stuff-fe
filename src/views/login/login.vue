<template>
  <section class="login-wrapper">
    <img style="margin-top: 70px;width: 80px; height: 80px;" src="../../assets/board.png" />
    <article class="login-form-wrapper" v-if="status === 'LOGIN'">
      <header class="login-form-wrapper-header">请登录</header>
      <main>
        <section class="login-form">
          <el-form :model="loginForm" :rules="rules" ref="login-form">
            <el-form-item prop="account">
              <el-input size="medium" class="login-form-item-input" type="text" v-model="loginForm.account" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input size="medium" class="login-form-item-input" type="password" placeholder="请输入密码" v-model="loginForm.password"></el-input>
            </el-form-item>
          </el-form>
        </section>
        <el-button style="width: 100%;" type="primary" size="medium" @click="handleLogin">登录</el-button>
      </main>
      <footer style="text-align: left;margin-top: 5px;">
        <el-link type="primary" @click="handleGetInRegisterProcess">注册</el-link><span style="font-size: 0.8em; margin: 0 8px;">或者</span><el-link type="primary">重置密码</el-link>
      </footer>
    </article>
    <register v-else @backToLogin="handleGoBackToLogin"></register>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Register from './components/register';
import api from '@/api';

@Component({
  components: {
    Register
  }
})
export default class Login extends Vue {
  loginForm: any = {
    account: '',
    password: ''
  };

  status: string = 'LOGIN'; // LOGIN || REGISTER

  rules: any = {
    account: [
      { trigger: 'blur', validator: this.validatorForAccount }
    ],
    password: [
      { trigger: 'blur', validator: this.validatorForPassword }
    ]
  };

  validatorForAccount (rule, value, callback: Function) {
    if (!value) {
      callback(new Error('邮箱不能为空'));
    } else if (!(/^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/).test(value)) {
      callback(new Error('请输入正确的邮箱'));
    } else {
      callback();
    }
  }

  validatorForPassword (rule, value, callback: Function) {
    if (!value) {
      callback(new Error('密码不能为空'));
    } else {
      callback();
    }
  }

  handleLogin () {
    const loginForm: any = this.$refs['login-form'];
    loginForm.validate().then((valid) => {
      if (valid) {
        api.user.login(this.loginForm).then(res => {
          console.log(res);
        });
      }
    }).catch(err => {
      console.log(err);
    });
  }

  handleGetInRegisterProcess () {
    this.status = 'REGISTER';
    this.loginForm.account = '';
    this.loginForm.password = '';
  }

  handleGoBackToLogin () {
    this.status = 'LOGIN';
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
      margin-top: 25px;
      flex-grow: 1;
    }
  }
}
</style>
