import requestObj from './config/request';
import generateTimeStamp from './lib/timestamp';

function createCard (message) {
  return requestObj.post(
    '/card/createCard',
    {
      ...message,
      createdAt: generateTimeStamp(),
      updatedAt: generateTimeStamp()
    }
  );
}

export default {
  createCard
};
