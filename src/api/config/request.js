import httpRequester from 'axios';

const instance = httpRequester.create({
  timeout: 5000,
  withCredentials: true,
  baseURL: 'http://localhost:3000'
});

instance.interceptors.request.use(config => {
  if (config.method.toLocaleLowerCase() === 'post') {
    config.headers['Content-type'] = 'application/x-www-form-urlencoded';
  }
  return config;
}, error => {
  return Promise.reject(error);
});

instance.interceptors.response.use(response => {
  return Promise.resolve(response);
}, error => {
  return Promise.reject(error);
});

export default instance;
