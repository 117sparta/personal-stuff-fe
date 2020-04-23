import requestObj from './config/request';
import CryptoJS from 'crypto-js';
import generateTimestamp from './lib/timestamp';

function login ({ account, password }) {
  const pwdStr = CryptoJS.SHA1(password); // 用md5进行密码校验
  const pwd = pwdStr.toString();
  return requestObj.post(
    '/user/login',
    {
      account,
      pwd
    }
  );
}

function register ({ account, password, nickname }) {
  const pwdStr = CryptoJS.SHA1(password);
  const pwd = pwdStr.toString();
  return requestObj.post(
    '/user/register',
    {
      account,
      pwd,
      nickname,
      createdAt: generateTimestamp()
    }
  );
}

function verifyMailCode ({ account, code }) {
  return requestObj.post(
    '/user/verifyCode',
    {
      account,
      code
    }
  );
}

function sendCode (account: string) {
  return requestObj.post(
    '/user/generateCode',
    {
      account
    }
  );
}

function queryUserInfo () {
  return requestObj.post(
    '/user/queryUserInfo'
  );
}

function updateUser (nickname: string, password?: string) {
  return requestObj.post(
    '/user/updateUser',
    {
      nickname,
      password
    }
  );
}

export default {
  login,
  register,
  verifyMailCode,
  queryUserInfo,
  sendCode,
  updateUser
};
