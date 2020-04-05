import httpRequester from 'axios';
import qs from 'qs';

const instance = httpRequester.create({
  timeout: 5000,
  withCredentials: true,
  baseURL: 'http://localhost:3000'
});

instance.interceptors.request.use(config => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`%c[${config.method}][RQ] ${config.url.substring(config.url.lastIndexOf('/') + 1)}`, 'color: orange; font-size: 14px; font-weight: bold;');
    console.log(config.data);
  }
  if (config.method.toLocaleLowerCase() === 'post') {
    config.headers['Content-type'] = 'application/x-www-form-urlencoded';
    if (typeof config.data !== 'string') {
      config.data = qs.stringify(config.data);
    } else {
      config.data = qs.stringify({ data: config.data });
    }
  }
  return config;
}, error => {
  return Promise.reject(error);
});

instance.interceptors.response.use(response => {
  const config = response.config;
  if (process.env.NODE_ENV === 'development') console.log(`%c[${config.method}][RS] ${config.url.substring(config.url.lastIndexOf('/') + 1)}`, 'color: green; font-size: 14px; font-weight: bold;');
  const data = response.data.data;
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
