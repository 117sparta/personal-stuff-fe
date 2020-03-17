import httpRequester from 'axios';
import qs from 'qs';

const instance = httpRequester.create({
  timeout: 5000,
  withCredentials: true,
  baseURL: 'http://localhost:3000'
});

instance.interceptors.request.use(config => {
  if (config.method.toLocaleLowerCase() === 'post') {
    config.headers['Content-type'] = 'application/x-www-form-urlencoded';
    config.data = qs.stringify(config.data);
  }
  return config;
}, error => {
  return Promise.reject(error);
});

instance.interceptors.response.use(response => {
  const data = response.data.data;
  let isJson = true;
  try {
    JSON.parse(data);
  } catch (e) {
    isJson = false;
  }
  if (isJson) {
    return Promise.resolve(JSON.parse(data));
  } else {
    return Promise.resolve(data);
  }
}, error => {
  return Promise.reject(error);
});

export default instance;
