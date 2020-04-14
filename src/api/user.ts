import requestObj from './config/request';
import CryptoJS from 'crypto-js';

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
      nickname
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

function queryUserInfo () {
  return requestObj.post(
    '/user/queryUserInfo'
  );
}

export default {
  login,
  register,
  verifyMailCode,
  queryUserInfo
};
