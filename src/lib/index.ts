import CryptoJS from 'crypto-js';

let aesKey = '';
const iv = 'yujiyuxusuyiuijh';

function getAesKey () {
  return aesKey;
}

function setAesKey (key) {
  aesKey = key;
}

function dateToString (timestamp: number) {
  const dateObj = new Date(timestamp);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const date = dateObj.getDate();
  const hour = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();
  return `${year}-${month > 9 ? month : '0' + month}-${date > 9 ? date : '0' + date} ${hour > 9 ? hour : '0' + hour}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}`;
}

function dateStrToTimestamp (dateStr: string) {
  return Date.parse(dateStr);
}

function debounceDelay (func, wait) {
  let timer = null;
  const context = this;
  const args = Array.from(arguments).slice(2);
  return function (...res) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      func.apply(context, args.concat(res));
    }, wait);
  };
}

function generateRsaKey () {
  const now = Date.now();
  const ACharCode = 'A'.charCodeAt(0);
  const length = 16;
  let timeStr = now.toString(16);
  if (timeStr.length < length) {
    const numNeeded = 16 - timeStr.length;
    for (let i = 0; i < numNeeded; i++) {
      timeStr += String.fromCharCode(Math.floor((Math.random() * 26)) + ACharCode);
    }
    return timeStr;
  } else {
    return timeStr.slice(0, 16);
  }
}

function aesEncrypt (word) {
  let encrypted = '';
  if (typeof word === 'string') {
    encrypted = CryptoJS.AES.encrypt(word, aesKey, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  } else if (typeof word === 'object') {
    // 对象格式的转成json字符串
    const data = JSON.stringify(word);
    encrypted = CryptoJS.AES.encrypt(data, aesKey, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  }
  return encrypted.toString();
}
// aes解密
function aesDecrypt (word: string, key?: string) {
  const localKey = aesKey || key;
  const srcs = CryptoJS.enc.Base64.parse(word).toString(CryptoJS.enc.Utf8);
  const decrypt = CryptoJS.AES.decrypt(srcs, localKey, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  const decryptedStr = CryptoJS.enc.Utf8.stringify(decrypt);
  return decryptedStr;
}

export default {
  dateToString,
  dateStrToTimestamp,
  debounceDelay,
  generateRsaKey,
  getAesKey,
  setAesKey,
  aesDecrypt,
  aesEncrypt
};
