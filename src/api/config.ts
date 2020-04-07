import requestObj from './config/request';

function getPublicKey () {
  return requestObj.post(
    '/getPublicKey'
  );
}

export default {
  getPublicKey
};
