import httpRequester from 'axios';
import qs from 'qs';
import store from '@/store';
import JSEncrypt from 'jsencrypt';
import lib from '@/lib';
import STATUS_CODE from '@/api/config/statusCode';
import router from '@/router';
import { Notification } from 'element-ui';

const TIME_OUT = 10000;
let totalTime = 0;
const interval = 200;

function getToken () {
  return localStorage.getItem('token') || '';
}

function waitingForPublicKey () {
  return new Promise((resolve, reject) => {
    if (store.getters['key/publicKey']) resolve();
    delay(resolve, reject);
  });
}

function waitingForRsaKey () {
  return new Promise((resolve, reject) => {
    if (store.getters['key/rsaKey']) resolve();
    delayForRsaKey(resolve, reject, 0, 300);
  });
}

function delay (resolve: Function, reject: Function) {
  setTimeout(() => {
    totalTime += interval;
    if (totalTime >= TIME_OUT) {
      totalTime = 0;
      reject('timeout');
      return;
    }
    const publicKey = store.getters['key/publicKey'];
    if (publicKey) {
      store.dispatch('key/setPublicKey', publicKey);
      resolve(publicKey);
    } else {
      delay(resolve, reject);
    }
  }, interval);
}

function delayForRsaKey (resolve: Function, reject: Function, totalTime: number, interval: number) {
  setTimeout(() => {
    totalTime += interval;
    if (totalTime >= TIME_OUT) {
      totalTime = 0;
      reject('timeout');
      return;
    }
    const rsaKey = store.getters['key/rsaKey'];
    if (rsaKey) {
      resolve();
    } else {
      delayForRsaKey(resolve, reject, totalTime, interval);
    }
  }, interval);
}

const instance = httpRequester.create({
  timeout: TIME_OUT,
  withCredentials: true,
  baseURL: 'http://localhost:3000'
});

instance.interceptors.request.use(async (config) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`%c[${config.method}][RQ] ${config.url.substring(config.url.lastIndexOf('/') + 1)}`, 'color: orange; font-size: 14px; font-weight: bold;');
    console.log(config.data);
  }
  const publicKey = store.getters['key/publicKey'];
  const storeRsaKey = store.getters['key/rsaKey'];
  const encrypt = new JSEncrypt(); // 实例化加密对象
  if (!(/getPublicKey/i.test(config.url)) && !(/getrsakey/i.test(config.url)) && (!publicKey || !storeRsaKey)) {
    const res = await waitingForPublicKey();
    encrypt.setKey(res);
    await waitingForRsaKey();
    if (config.method.toLocaleLowerCase() === 'post') {
      config.headers['Content-type'] = 'application/x-www-form-urlencoded';
      config.headers.Authorization = getToken();
      config.data = qs.stringify({
        data: lib.aesEncrypt(config.data),
        key: encrypt.encrypt(store.getters['key/rsaKey'])
      });
    }
    return config;
  } else if (/getRsaKey/i.test(config.url)) { // 如果是为了传输AES加密的key，那么用RSA算法
    if (!publicKey) await waitingForPublicKey();
    encrypt.setKey(publicKey);
    if (config.method.toLocaleLowerCase() === 'post') {
      config.headers['Content-type'] = 'application/x-www-form-urlencoded';
      if (typeof config.data !== 'string') {
        config.data = qs.stringify({
          data: encrypt.encrypt(JSON.stringify(config.data))
        });
      } else {
        config.data = qs.stringify({ data: encrypt.encrypt(config.data) });
      }
    }
    return config;
  } else if ((/getPublicKey/i.test(config.url))) { // 获取服务器公钥，用明文发送
    if (config.method.toLocaleLowerCase() === 'post') {
      config.headers['Content-type'] = 'application/x-www-form-urlencoded';
      if (typeof config.data !== 'string') {
        config.data = qs.stringify(config.data);
      } else {
        config.data = qs.stringify({ data: config.data });
      }
    }
    return config;
  } else { // 除去上面情况，用AES加密传输
    if (config.method.toLocaleLowerCase() === 'post') {
      encrypt.setKey(store.getters['key/publicKey']);
      config.headers['Content-type'] = 'application/x-www-form-urlencoded';
      config.headers.Authorization = getToken();
      config.data = qs.stringify({
        data: lib.aesEncrypt(config.data),
        key: encrypt.encrypt(store.getters['key/rsaKey'])
      });
    }
    return config;
  }
}, error => {
  return Promise.reject(error);
});

instance.interceptors.response.use(response => {
  const config = response.config;
  const encrypt = new JSEncrypt({
    log: true
  }); // 实例化加密对象
  const publicKey = store.getters['key/publicKey'];
  if (publicKey) encrypt.setPublicKey(publicKey);
  if (process.env.NODE_ENV === 'development') console.log(`%c[${config.method}][RS] ${config.url.substring(config.url.lastIndexOf('/') + 1)}`, 'color: green; font-size: 14px; font-weight: bold;');
  let data = null;
  if (response.config.url !== '/getPublicKey' && response.config.url !== '/getRsaKey') {
    let isPlain = false;
    try {
      lib.aesDecrypt(response.data.data);
    } catch (err) {
      console.log(err);
      isPlain = true;
    }
    if (isPlain) {
      data = response.data.data;
    } else {
      data = lib.aesDecrypt(response.data.data);
    }
  } else { // getPublicKey和getRsaKey的原模原样返回
    data = response.data.data;
  }
  let isJson = true;
  try {
    JSON.parse(data);
  } catch (e) {
    isJson = false;
  }
  if (isJson) {
    if (process.env.NODE_ENV === 'development') console.log(JSON.parse(data));
    const responseData = JSON.parse(data);
    if (responseData.statusCode === STATUS_CODE.UNAUTHORIZED) {
      store.dispatch('user/setIsAuth', false);
      store.dispatch('user/setUserInfo', {});
      localStorage.removeItem('token');
      router.push({ path: '/login' });
      return;
    }
    return Promise.resolve(responseData);
  } else {
    if (process.env.NODE_ENV === 'development') console.log(data);
    if (data.statusCode === STATUS_CODE.UNAUTHORIZED) {
      store.dispatch('user/setIsAuth', false);
      store.dispatch('user/setUserInfo', {});
      localStorage.removeItem('token');
      router.push({ path: '/login' });
      return;
    }
    return Promise.resolve(data);
  }
}, error => {
  if (/401/.test(error.message)) {
    Notification.error('你需要重新登录才能使用');
    router.push({ path: '/login' });
    return Promise.reject(new Error('unauthorized'));
  }
  return Promise.reject(error);
});

export default instance;
