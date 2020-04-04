import requestObj from '@/api/config/request';
import generateTimeStamp from './lib/timestamp';

function createStuffList (stuffList, cardId) {
  return requestObj.post(
    '/stuffList/createStuffList',
    {
      ...stuffList,
      cardId,
      updatedAt: generateTimeStamp(),
      createdAt: generateTimeStamp()
    }
  );
}

function updateStuffList (stuffLists, cardId?) {
  return requestObj.post(
    '/stuffList/updateStuffList',
    JSON.stringify({
      stuffLists,
      cardId
    })
  );
}

export default {
  createStuffList,
  updateStuffList
};
