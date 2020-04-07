import httpRequester from 'axios';
import qs from 'qs';
import store from '@/store';
import JSEncrypt from 'jsencrypt';

const TIME_OUT = 5000;
let totalTime = 0;
const interval = 500;

function waitingForPublicKey () {
  return new Promise((resolve, reject) => {
    delay(resolve, reject);
  });
}

function delay (resolve: Function, reject: Function) {
  setTimeout(() => {
    const publicKey = store.getters['key/publicKey'];
    if (publicKey) {
      resolve(publicKey);
    } else {
      delay(resolve, reject);
    }
    totalTime += interval;
    if (totalTime >= TIME_OUT) {
      totalTime = 0;
      reject('timeout');
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
  const encrypt = new JSEncrypt(); // 实例化加密对象
  if (!(/getPublicKey/i.test(config.url)) && !publicKey) {
    const res = await waitingForPublicKey();
    encrypt.setKey(res);
    if (config.method.toLocaleLowerCase() === 'post') {
      config.headers['Content-type'] = 'application/x-www-form-urlencoded';
      if (config.data && typeof config.data !== 'string') {
        config.data = qs.stringify({
          data: encrypt.encrypt(JSON.stringify(config.data))
        });
      } else if (config.data) {
        config.data = qs.stringify({ data: encrypt.encrypt(config.data) });
      }
    }
    return config;
  } else if (publicKey) {
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
  } else {
    if (config.method.toLocaleLowerCase() === 'post') {
      config.headers['Content-type'] = 'application/x-www-form-urlencoded';
      if (typeof config.data !== 'string') {
        config.data = qs.stringify(config.data);
      } else {
        config.data = qs.stringify({ data: config.data });
      }
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
  if (response.config.url !== '/getPublicKey') {
    data = encrypt.decrypt(response.data.data);
  } else {
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
    return Promise.resolve(JSON.parse(data));
  } else {
    if (process.env.NODE_ENV === 'development') console.log(data);
    return Promise.resolve(data);
  }
}, error => {
  return Promise.reject(error);
});

export default instance;
