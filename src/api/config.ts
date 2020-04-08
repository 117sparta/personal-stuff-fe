import requestObj from './config/request';

function getPublicKey () {
  return requestObj.post(
    '/getPublicKey'
  );
}

function getRsaKey (rsaKey: string) {
  return requestObj.post(
    '/getRsaKey',
    {
      rsaKey
    }
  );
}

export default {
  getPublicKey,
  getRsaKey
};
