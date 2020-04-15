<template>
  <article class="login-form-wrapper">
    <el-button v-show="step !== 4" type="text" size="mini" class="login-form-wrapper-header-btn" @click="goBackToLogin">返回登录</el-button>
    <header class="login-form-wrapper-header">
      {{title}}
    </header>
    <main>
      <section class="login-form">
        <el-form :model="registerForm" :rules="rules" v-show="step !== 4" ref="register-form">
          <el-form-item prop="account" v-show="step === 1">
            <el-input size="medium" type="text" v-model="registerForm.account" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item prop="code" v-show="step === 2">
            <el-input size="medium" type="text" placeholder="请输入验证码" maxlength="6" v-model="registerForm.code" show-word-limit></el-input>
          </el-form-item>
          <el-form-item prop="nickname" v-show="step === 3">
            <el-input size="medium" type="text" placeholder="请输入昵称" maxlength="31" v-model="registerForm.nickname" show-word-limit></el-input>
          </el-form-item>
          <el-form-item prop="password" v-show="step === 3">
            <el-input size="medium" type="password" placeholder="请输入密码" maxlength="20" v-model="registerForm.password" show-word-limit></el-input>
          </el-form-item>
          <el-form-item prop="passwordAgain" v-show="step === 3">
            <el-input size="medium" type="password" placeholder="请再次输入密码" maxlength="20" v-model="registerForm.passwordAgain" show-word-limit></el-input>
          </el-form-item>
        </el-form>
      </section>
      <el-button style="width: 100%; margin-bottom: 10px;" type="primary" size="medium" @click="handleBtnClick" :disabled="step === 2 && !registerForm.code">{{btnText}}</el-button><br />
      <el-button v-show="step === 2" style="width: 100%;" type="primary" size="medium" @click="moveToLastStep">上一步</el-button>
    </main>
  </article>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import api from '@/api';
import { Notification } from 'element-ui';
import STATUS_CODE from '@/api/config/statusCode';

@Component({})
export default class Register extends Vue {
  step: number = 1;
  registerForm: any = {
    account: '',
    code: '',
    password: '',
    passwordAgain: '',
    nickname: ''
  };

  rules: any = {
    account: [
      { trigger: 'blur', validator: this.accountValidator }
    ],
    code: [
      { trigger: 'blur', validator: this.codeValidator }
    ],
    password: [
      { trigger: 'blur', validator: this.passwordValidator }
    ],
    passwordAgain: [
      { trigger: 'blur', validator: this.passwordAgainValidator }
    ],
    nickname: [
      { trigger: 'blur', required: true, message: '昵称不能为空' }
    ]
  };

  get title () {
    switch (this.step) {
      case 1:
        return '请输入邮箱';
      case 2:
        return '请输入邮箱验证码';
      case 3:
        return '请输入密码';
      case 4:
        return '注册成功';
    }
  }

  get btnText () {
    switch (this.step) {
      case 1:
        return '发送验证码';
      case 2:
        return '下一步';
      case 3:
        return '注册';
      case 4:
        return '请返回登录';
      default:
        return '请返回登录';
    }
  }

  accountValidator (rule, value, callback) {
    if (!value) {
      callback(new Error('请输入要注册的邮箱'));
    } else if (!(/^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/).test(value)) {
      callback(new Error('请输入正确的邮箱'));
    } else {
      callback();
    }
  }

  codeValidator (rule, value, callback) {
    if (!value) {
      callback(new Error('请输入6位的邮箱验证码'));
    } else if (!(/^[0-9]{6,6}$/).test(value)) {
      callback(new Error('请输入正确的邮箱验证码'));
    } else {
      callback();
    }
  }

  passwordValidator (rule, value, callback) {
    if (!value) {
      callback(new Error('密码不能为空'));
    } else if (this.registerForm.passwordAgain && value !== this.registerForm.passwordAgain) {
      callback(new Error('两次密码不一致'));
    } else {
      callback();
    }
  }

  passwordAgainValidator (rule, value, callback) {
    if (!value) {
      callback(new Error('二次确认密码不能为空'));
    } else if (this.registerForm.password !== value) {
      callback(new Error('两次密码不一致'));
    } else {
      callback();
    }
  }

  handleBtnClick () {
    const form: any = this.$refs['register-form'];
    if (this.step === 1) { // 填账户
      form.validateField(['account'], (err) => {
        if (!err) {
          api.user.sendCode(this.registerForm.account).then((res: any) => { // 发送验证码逻辑
            if (res.statusCode === STATUS_CODE.SUCCESS) {
              Notification.success({
                title: '成功',
                message: '验证码发送成功，请注意查收',
                duration: 0
              });
              this.step += 1;
            } else {
              Notification.warning({
                title: '验证码发送失败',
                message: '',
                duration: 5000
              });
            }
          });
        }
      });
    } else if (this.step === 2) { // 填验证码
      form.validateField(['code'], (err) => {
        if (!err) {
          api.user.verifyMailCode(this.registerForm).then((res: any) => { // 验证验证码逻辑
            if (res.statusCode === STATUS_CODE.SUCCESS) {
              Notification.success({
                title: '验证码正确',
                message: ''
              });
              this.step += 1;
            } else if (res.statusCode === STATUS_CODE.FAIL_TO_VERIFY_CODE) {
              Notification.warning({
                title: '无效的验证码',
                message: '请检查是否正确'
              });
            } else {
              Notification.error({
                title: '未知错误',
                message: '您可以刷新重试'
              });
            }
          });
        }
      });
    } else if (this.step === 3) { // step = 3的时候填写密码
      const errMsg = [];
      let done = false;
      form.validateField(['password', 'passwordAgain', 'nickname'], (err) => {
        errMsg.push(err);
        if (errMsg.length === 3) {
          done = true;
        }
      }); // 这边的回调函数每验证一个表单项都会触发一次，所以要用一点小技巧
      new Promise((resolve, reject) => {
        if (done) {
          if (errMsg.every(item => !item)) {
            resolve();
          } else {
            reject(new Error('not pass'));
          }
        }
      }).then(() => {
        this.register().then((res: any) => {
          if (res.statusCode === STATUS_CODE.SUCCESS) {
            this.step += 1;
          } else {
            Notification.error('未知错误');
          }
        }).catch(err => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    } else if (this.step === 4) { // 返回登录
      this.goBackToLogin();
    }
  }

  moveToLastStep () {
    this.registerForm.code = '';
    this.step -= 1;
  }

  goBackToLogin () {
    this.$emit('backToLogin');
  }

  register () {
    return api.user.register(this.registerForm);
  }
}
</script>

<style lang="less" scoped>
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
    position: relative;
    font-weight: bolder;
    font-size: 1.3em;
    &-btn {
      position: absolute;
      top: 30px;
      left: 25px;
    }
  }
  .login-form {
    text-align: left;
    margin-top: 25px;
    flex-grow: 1;
  }
}
</style>
